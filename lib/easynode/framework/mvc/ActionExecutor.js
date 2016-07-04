'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var GenericObject = using('easynode.GenericObject');
var ActionFactory = using('easynode.framework.mvc.ActionFactory');
var ActionResult = using('easynode.framework.mvc.ActionResult');
var TemplateView = using('easynode.framework.mvc.TemplateView');
var ActionFilter = using('easynode.framework.mvc.ActionFilter');
var ActionAOP = using('easynode.framework.aop.ActionAOP');
var _ = require('underscore');

(function () {
        /**
         * Class ActionExecutor
         *
         * @class easynode.framework.mvc.ActionExecutor
         * @extends easynode.GenericObject
         * @since 0.1.0
         * @author hujiabao
         * */

        var ActionExecutor = function (_GenericObject) {
                _inherits(ActionExecutor, _GenericObject);

                /**
                 * 构造函数。
                 *
                 * @method 构造函数
                 * @since 0.1.0
                 * @author hujiabao
                 * */

                function ActionExecutor(m, a, actionContextListener) {
                        _classCallCheck(this, ActionExecutor);

                        //调用super()后再定义子类成员。

                        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ActionExecutor).call(this));

                        _this.m = m;
                        _this.a = a;
                        _this.actionContextListener = actionContextListener;
                        return _this;
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
                 *                              {
                 *                                      action : easynode.framework.mvc.Action                                  //当action未找到时，可能为空
                 *                                      actionResult : easynode.framework.mvc.ActionResult
                 *                              }
                 * @since 0.1.0
                 * @async
                 * @author hujiabao
                 * */


                _createClass(ActionExecutor, [{
                        key: 'execute',
                        value: function execute(ctx) {
                                var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

                                assert(ctx != null, 'Invalid argument, ActionContext can not be null');
                                var me = this;
                                return regeneratorRuntime.mark(function _callee() {
                                        var action, args, stack, filters, idx, execAction, next, filterResult, validateResult, authorizeResult, actionResult;
                                        return regeneratorRuntime.wrap(function _callee$(_context2) {
                                                while (1) {
                                                        switch (_context2.prev = _context2.next) {
                                                                case 0:
                                                                        action = ActionFactory.createActionInstance(me.m, me.a, ctx);

                                                                        if (action) {
                                                                                _context2.next = 3;
                                                                                break;
                                                                        }

                                                                        return _context2.abrupt('return', {
                                                                                action: null,
                                                                                actionResult: ActionResult.createActionNotFoundResult()
                                                                        });

                                                                case 3:
                                                                        if (!(me.actionContextListener && me.actionContextListener.onActionReady)) {
                                                                                _context2.next = 6;
                                                                                break;
                                                                        }

                                                                        _context2.next = 6;
                                                                        return me.actionContextListener.onActionReady(ctx);

                                                                case 6:

                                                                        //组织函数参数 -> stack
                                                                        args = action.getArgs();
                                                                        stack = [ctx];

                                                                        args.forEach(function (v) {
                                                                                stack.push(ctx.param(v.name));
                                                                        });

                                                                        //执行Action过滤器
                                                                        filters = ActionFilter.filters();
                                                                        idx = 1;
                                                                        execAction = false;
                                                                        next = regeneratorRuntime.mark(function next() {
                                                                                var tempIndex;
                                                                                return regeneratorRuntime.wrap(function next$(_context) {
                                                                                        while (1) {
                                                                                                switch (_context.prev = _context.next) {
                                                                                                        case 0:
                                                                                                                if (!(idx < filters.length)) {
                                                                                                                        _context.next = 8;
                                                                                                                        break;
                                                                                                                }

                                                                                                                tempIndex = idx++;

                                                                                                                EasyNode.DEBUG && logger.debug('exec action filter [' + filters[tempIndex].name + ']');
                                                                                                                _context.next = 5;
                                                                                                                return filters[tempIndex].filter(me.m, me.a, action, stack, next);

                                                                                                        case 5:
                                                                                                                return _context.abrupt('return', _context.sent);

                                                                                                        case 8:
                                                                                                                execAction = true;

                                                                                                        case 9:
                                                                                                        case 'end':
                                                                                                                return _context.stop();
                                                                                                }
                                                                                        }
                                                                                }, next, this);
                                                                        });

                                                                        if (!(filters.length > 0)) {
                                                                                _context2.next = 22;
                                                                                break;
                                                                        }

                                                                        EasyNode.DEBUG && logger.debug('exec action filter [' + filters[0].name + ']');
                                                                        _context2.next = 17;
                                                                        return filters[0].filter(me.m, me.a, action, stack, next);

                                                                case 17:
                                                                        filterResult = _context2.sent;

                                                                        if (!filterResult) {
                                                                                _context2.next = 20;
                                                                                break;
                                                                        }

                                                                        return _context2.abrupt('return', {
                                                                                action: action,
                                                                                actionResult: filterResult
                                                                        });

                                                                case 20:
                                                                        _context2.next = 23;
                                                                        break;

                                                                case 22:
                                                                        execAction = true;

                                                                case 23:
                                                                        if (execAction) {
                                                                                _context2.next = 25;
                                                                                break;
                                                                        }

                                                                        throw new Error('Action filter chain broken, please call next filter obviously or return an ActionResult instance immediately');

                                                                case 25:
                                                                        if (!(typeof action.validate == 'function')) {
                                                                                _context2.next = 32;
                                                                                break;
                                                                        }

                                                                        EasyNode.DEBUG && logger.debug('call action[' + me.m + '.' + me.a + '].validate');
                                                                        _context2.next = 29;
                                                                        return action.validate.apply(action, stack);

                                                                case 29:
                                                                        validateResult = _context2.sent;

                                                                        if (validateResult) {
                                                                                _context2.next = 32;
                                                                                break;
                                                                        }

                                                                        return _context2.abrupt('return', {
                                                                                action: action,
                                                                                actionResult: ActionResult.createValidateFailResult()
                                                                        });

                                                                case 32:
                                                                        if (!(typeof action.authorize == 'function')) {
                                                                                _context2.next = 39;
                                                                                break;
                                                                        }

                                                                        EasyNode.DEBUG && logger.debug('call action[' + me.m + '.' + me.a + '].authorize');
                                                                        _context2.next = 36;
                                                                        return action.authorize.apply(action, stack);

                                                                case 36:
                                                                        authorizeResult = _context2.sent;

                                                                        if (authorizeResult) {
                                                                                _context2.next = 39;
                                                                                break;
                                                                        }

                                                                        return _context2.abrupt('return', {
                                                                                action: action,
                                                                                actionResult: ActionResult.createAuthorizeFailResult()
                                                                        });

                                                                case 39:

                                                                        //应用Action执行选项
                                                                        if (opts && opts.templateFile) {
                                                                                action.setView(new TemplateView(opts.templateFile, 'auto', opts.templateDir));
                                                                        }

                                                                        //var actionResult = yield action.process.apply(action, stack);
                                                                        _context2.next = 42;
                                                                        return ActionAOP.actionAOPExec(me.m, me.a, action, stack);

                                                                case 42:
                                                                        actionResult = _context2.sent;

                                                                        actionResult = actionResult || ActionResult.createNoReturnResult();
                                                                        return _context2.abrupt('return', {
                                                                                action: action,
                                                                                actionResult: actionResult
                                                                        });

                                                                case 45:
                                                                case 'end':
                                                                        return _context2.stop();
                                                        }
                                                }
                                        }, _callee, this);
                                });
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

                }, {
                        key: 'getClassName',
                        value: function getClassName() {
                                return EasyNode.namespace(__filename);
                        }
                }], [{
                        key: 'exec',
                        value: function exec(m, a, ctx) {
                                var execArgs = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];
                                var doValidation = arguments.length <= 4 || arguments[4] === undefined ? false : arguments[4];
                                var doAuthorize = arguments.length <= 5 || arguments[5] === undefined ? false : arguments[5];

                                return regeneratorRuntime.mark(function _callee2() {
                                        var action, key, args, stack, filters, idx, execAction, next, filterResult, validateResult, authorizeResult, actionResult;
                                        return regeneratorRuntime.wrap(function _callee2$(_context4) {
                                                while (1) {
                                                        switch (_context4.prev = _context4.next) {
                                                                case 0:
                                                                        action = ActionFactory.createActionInstance(m, a, ctx);

                                                                        if (action) {
                                                                                _context4.next = 3;
                                                                                break;
                                                                        }

                                                                        return _context4.abrupt('return', ActionResult.createActionNotFoundResult());

                                                                case 3:

                                                                        //var originalCtxData = null;

                                                                        if (execArgs) {
                                                                                //TODO 保护ActionContext，返回时恢复现场
                                                                                EasyNode.DEBUG && logger.warn('passed arguments to execute an action, these arguments will be merged to ActionContext(ctx)');
                                                                                for (key in execArgs) {
                                                                                        ctx.setParam(key, execArgs[key]);
                                                                                }
                                                                        }

                                                                        //组织函数参数 -> stack
                                                                        args = action.getArgs();
                                                                        stack = [ctx];

                                                                        args.forEach(function (v) {
                                                                                stack.push(ctx.param(v.name));
                                                                        });

                                                                        //执行Action过滤器
                                                                        filters = ActionFilter.filters();
                                                                        idx = 1;
                                                                        execAction = false;
                                                                        next = regeneratorRuntime.mark(function next() {
                                                                                return regeneratorRuntime.wrap(function next$(_context3) {
                                                                                        while (1) {
                                                                                                switch (_context3.prev = _context3.next) {
                                                                                                        case 0:
                                                                                                                if (!(idx < filters.length)) {
                                                                                                                        _context3.next = 6;
                                                                                                                        break;
                                                                                                                }

                                                                                                                _context3.next = 3;
                                                                                                                return filters[idx++].filter(m, a, action, stack, next);

                                                                                                        case 3:
                                                                                                                return _context3.abrupt('return', _context3.sent);

                                                                                                        case 6:
                                                                                                                execAction = true;

                                                                                                        case 7:
                                                                                                        case 'end':
                                                                                                                return _context3.stop();
                                                                                                }
                                                                                        }
                                                                                }, next, this);
                                                                        });

                                                                        if (!(filters.length > 0)) {
                                                                                _context4.next = 19;
                                                                                break;
                                                                        }

                                                                        _context4.next = 14;
                                                                        return filters[0].filter(m, a, action, stack, next);

                                                                case 14:
                                                                        filterResult = _context4.sent;

                                                                        if (!filterResult) {
                                                                                _context4.next = 17;
                                                                                break;
                                                                        }

                                                                        return _context4.abrupt('return', {
                                                                                action: action,
                                                                                actionResult: filterResult
                                                                        });

                                                                case 17:
                                                                        _context4.next = 20;
                                                                        break;

                                                                case 19:
                                                                        execAction = true;

                                                                case 20:
                                                                        if (execAction) {
                                                                                _context4.next = 22;
                                                                                break;
                                                                        }

                                                                        throw new Error('Action filter chain broken, please call next filter obviously or return an ActionResult instance immediately');

                                                                case 22:
                                                                        if (!(doValidation && typeof action.validate == 'function')) {
                                                                                _context4.next = 28;
                                                                                break;
                                                                        }

                                                                        _context4.next = 25;
                                                                        return action.validate.apply(action, stack);

                                                                case 25:
                                                                        validateResult = _context4.sent;

                                                                        if (validateResult) {
                                                                                _context4.next = 28;
                                                                                break;
                                                                        }

                                                                        return _context4.abrupt('return', ActionResult.createValidateFailResult());

                                                                case 28:
                                                                        if (!(doAuthorize && typeof action.authorize == 'function')) {
                                                                                _context4.next = 34;
                                                                                break;
                                                                        }

                                                                        _context4.next = 31;
                                                                        return action.authorize.apply(action, stack);

                                                                case 31:
                                                                        authorizeResult = _context4.sent;

                                                                        if (authorizeResult) {
                                                                                _context4.next = 34;
                                                                                break;
                                                                        }

                                                                        return _context4.abrupt('return', ActionResult.createAuthorizeFailResult());

                                                                case 34:
                                                                        _context4.next = 36;
                                                                        return ActionAOP.actionAOPExec(m, a, action, stack);

                                                                case 36:
                                                                        actionResult = _context4.sent;

                                                                        actionResult = actionResult || ActionResult.createNoReturnResult();
                                                                        return _context4.abrupt('return', actionResult);

                                                                case 39:
                                                                case 'end':
                                                                        return _context4.stop();
                                                        }
                                                }
                                        }, _callee2, this);
                                });
                        }
                }]);

                return ActionExecutor;
        }(GenericObject);

        module.exports = ActionExecutor;
})();