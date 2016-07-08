var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var GenericObject = using('easynode.GenericObject');
var ActionFactory = using('easynode.framework.mvc.ActionFactory');
var ActionResult = using('easynode.framework.mvc.ActionResult');
var TemplateView = using('easynode.framework.mvc.TemplateView');
var ActionFilter = using('easynode.framework.mvc.ActionFilter');
var ActionAOP = using('easynode.framework.aop.ActionAOP');
var _ = require('underscore');

(function() {

  /**
   * Class ActionExecutor
   *
   * @class easynode.framework.mvc.ActionExecutor
   * @extends easynode.GenericObject
   * @since 0.1.0
   * @author hujiabao
   * */
  class ActionExecutor extends GenericObject {

    /**
     * 构造函数。
     *
     * @method 构造函数
     * @since 0.1.0
     * @author hujiabao
     * */
    constructor(m, a, actionContextListener) {
      super();
      // 调用super()后再定义子类成员。
      this.m = m;
      this.a = a;
      this.actionContextListener = actionContextListener;
    }

    /**
     * 在ctx上下文环境下，执行Action。<br/>
     * <pre>
     * 执行过程：
     * 1、调用action的validate函数，如果存在
     * 2、调用action的authorize函数，如果存在
     * 3、调用action的process函数(支持AOP)
     *
     * 其中：validate函数和authorize函数都是异步函数，需要返回一个generator。
     * </pre>
     *
     * @method execute
     * @param {easynode.framework.mvc.ActionContext} ctx ActionContext实例
     * @param {Object} opts Action执行选项
     * @return {Object} 执行结果, Notation :
     *      {
     *          action : easynode.framework.mvc.Action   //当action未找到时，可能为空
     *          actionResult : easynode.framework.mvc.ActionResult
     *      }
     * @since 0.1.0
     * @async
     * @author hujiabao
     * */
    execute(ctx, opts = {}) {
      assert(ctx != null, 'Invalid argument, ActionContext can not be null');
      var me = this;
      return function *() {
        var action = ActionFactory.createActionInstance(me.m, me.a, ctx);

        if (!action) {
          return {
            action : null,
            actionResult : ActionResult.createActionNotFoundResult()
          };
        }

        if (me.actionContextListener && me.actionContextListener.onActionReady) {
          yield me.actionContextListener.onActionReady(ctx);
        }

        // 组织函数参数 -> stack
        var args = action.getArgs();
        var stack = [ctx];
        args.forEach((v) => {
          stack.push(ctx.param(v.name));
        });

        // 执行Action过滤器
        var filters = ActionFilter.filters();
        var idx = 1;
        var execAction = false;
        var next = function *() {
          if (idx < filters.length) {
            var tempIndex = idx++;
            EasyNode.DEBUG && logger.debug(`exec action filter [${filters[tempIndex].name}]`);
            return yield filters[tempIndex].filter(me.m, me.a, action, stack, next);
          }
          else {
            execAction = true;
          }
        };

        if (filters.length > 0) {
          EasyNode.DEBUG && logger.debug(`exec action filter [${filters[0].name}]`);
          var filterResult = yield filters[0].filter(me.m, me.a, action, stack, next);
          if (filterResult) {
            return {
              action: action,
              actionResult: filterResult
            };
          }
        }
        else {
          execAction = true;
        }

        if (!execAction) {
          throw new Error('Action filter chain broken, please call next filter obviously or return an ActionResult instance immediately');
        }

        // 校验参数
        if (typeof action.validate == 'function') {
          EasyNode.DEBUG && logger.debug(`call action[${me.m}.${me.a}].validate`);
          var validateResult = yield action.validate.apply(action, stack);
          if (!validateResult) {
            return {
              action : action,
              actionResult : ActionResult.createValidateFailResult()
            };
          }
        }

        // 检查权限
        if (typeof action.authorize == 'function') {
          EasyNode.DEBUG && logger.debug(`call action[${me.m}.${me.a}].authorize`);
          var authorizeResult = yield action.authorize.apply(action, stack);
          if (!authorizeResult) {
            return {
              action : action,
              actionResult : ActionResult.createAuthorizeFailResult()
            };
          }
        }

        // 应用Action执行选项
        if (opts && opts.templateFile) {
          action.setView(new TemplateView(opts.templateFile, 'auto', opts.templateDir));
        }

        // var actionResult = yield action.process.apply(action, stack);
        var actionResult = yield ActionAOP.actionAOPExec(me.m, me.a, action, stack);
        actionResult = actionResult || ActionResult.createNoReturnResult();
        return {
          action : action,
          actionResult : actionResult
        };
      };
    }

    /**
     * 在ctx上下文环境下，执行Action。注意：调用此方法执行Action默认不校验参数也不检查执行权限<br/>
     * <pre>
     * 执行过程：
     * 1、调用action的validate函数，如果存在
     * 2、调用action的authorize函数，如果存在
     * 3、调用action的process函数(支持AOP)
     *
     * 其中：validate函数和authorize函数都是异步函数，需要返回一个generator。
     * </pre>
     *
     * @method exec
     * @param {String} m 模块名
     * @param {String} a Action名
     * @param {easynode.framework.mvc.ActionContext} ctx ActionContext实例
     * @param {Object} execArgs Action执行参数，默认null, 如果传递此参数，被调用的参数将使用将对象中的数据，否则使用ctx中的param数据
     * @param {boolean} doValidation 是否执行Action的参数校验validate方法，默认为false
     * @param {boolean} doAuthorize 是否执行Action的权限校验authorize方法，默认为false
     * @return {easynode.framework.mvc.ActionResult} 执行结果
     * @static
     * @async
     * @since 0.1.0
     * @author hujiabao
     * */
    static exec(m, a, ctx, execArgs = null, doValidation = false, doAuthorize = false) {
      return function *() {
        var action = ActionFactory.createActionInstance(m, a, ctx);

        if (!action) {
          return ActionResult.createActionNotFoundResult();
        }

        // var originalCtxData = null;
        if (execArgs) {
          // TODO 保护ActionContext，返回时恢复现场
          EasyNode.DEBUG && logger.warn('passed arguments to execute an action, these arguments will be merged to ActionContext(ctx)');
          for (var key in execArgs) {
            ctx.setParam(key, execArgs[key]);
          }
        }

        // 组织函数参数 -> stack
        var args = action.getArgs();
        var stack = [ctx];
        args.forEach((v) => {
          stack.push(ctx.param(v.name));
        });

        // 执行Action过滤器
        var filters = ActionFilter.filters();
        var idx = 1;
        var execAction = false;
        var next = function *() {
          if (idx < filters.length) {
            return yield filters[idx++].filter(m, a, action, stack, next);
          }
          else {
            execAction = true;
          }
        };

        if (filters.length > 0) {
          var filterResult = yield filters[0].filter(m, a, action, stack, next);
          if (filterResult) {
            return {
              action: action,
              actionResult: filterResult
            };
          }
        }
        else {
          execAction = true;
        }

        if (!execAction) {
          throw new Error('Action filter chain broken, please call next filter obviously or return an ActionResult instance immediately');
        }

        // 校验参数
        if (doValidation && typeof action.validate == 'function') {
          var validateResult = yield action.validate.apply(action, stack);
          if (!validateResult) {
            return ActionResult.createValidateFailResult();
          }
        }

        // 检查权限
        if (doAuthorize && typeof action.authorize == 'function') {
          var authorizeResult = yield action.authorize.apply(action, stack);
          if (!authorizeResult) {
            return ActionResult.createAuthorizeFailResult();
          }
        }

        // 执行Action
        var actionResult = yield ActionAOP.actionAOPExec(m, a, action, stack);
        actionResult = actionResult || ActionResult.createNoReturnResult();
        return actionResult;
      };
    }

    getClassName() {
      return EasyNode.namespace(__filename);
    }

  }

  module.exports = ActionExecutor;
})();
