var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var GenericObject = using('easynode.GenericObject');
var _ = require('underscore');
var fs = require('fs');

(function() {
  var _actionAOPs = {};

        /**
         * Class ActionAOP
         *
         * @class easynode.framework.ActionAOP.ActionAOP
         * @extends easynode.GenericObject
         * @since 0.1.0
         * @author hujiabao
         * */
  class ActionAOP extends GenericObject {
                /**
                 * 构造函数。
                 *
                 * @method 构造函数
                 * @since 0.1.0
                 * @author hujiabao
                 * */
    constructor() {
      super();
                        // 调用super()后再定义子类成员。
    }

                /**
                 * 清除Action AOP。
                 *
                 * @method actionAOPClear
                 * @param {String} m 模块名
                 * @param {String} a Action名
                 * @static
                 * @since 0.1.0
                 * @author hujiabao
                 * */
    static actionAOPClear(m, a) {
      var fullName = m + '.' + a;
      delete _actionAOPs[fullName];
    }

                /**
                 * 设置Action AOP。
                 *
                 * @method actionAOPSet
                 * @param {String} m 模块名
                 * @param {String} a Action名
                 * @param {generator} before process前置处理函数，function * (ctx, ...args) {} 与Action的process函数同参
                 * @param {after} after process后置处理函数，function * (ctx, actionResult) {}
                 * @static
                 * @since 0.1.0
                 * @author hujiabao
                 * */
    static actionAOPSet(m, a, before, after) {
      var fullName = m + '.' + a;
      assert(before == null || typeof before == 'function', 'Invalid argument');
      assert(after == null || typeof after == 'function', 'Invalid argument');
      assert(_actionAOPs[fullName] == null, `Action aop of [${fullName}] is already set`);
      _actionAOPs[fullName] = {
        before : function() {
          var args = arguments;
          return function *() {
            if (before) {
              return yield before.apply(null, args);
            }
          };
        },
        after : function() {
          var args = arguments;
          return function *() {
            if (after) {
              return yield after.apply(null, args);
            }
          };
        }
      };
    }

                /**
                 * 执行Action，支持AOP。
                 *
                 * @method actionAOPExec
                 * @param {String} m 模块名
                 * @param {String} a Action名
                 * @param {Action} action Action实例
                 * @param {Array} stack Action的process函数参数栈
                 * @static
                 * @async
                 * @since 0.1.0
                 * @author hujiabao
                 * */
    static actionAOPExec(m, a, action, stack) {
      var fullName = m + '.' + a;
      var o = _actionAOPs[fullName];
      return function *() {
        if (o && o.before) {
          var newStack = yield o.before.apply(action, stack);
          if (newStack) {
            stack = newStack;
          }
        }
        var actionResult = yield action.process.apply(action, stack);
        if (o && o.after) {
          var newActionResult = yield o.after.call(action, stack[0], actionResult);
          if (newActionResult) {
            actionResult = newActionResult;
          }
        }
        return actionResult;
      };
    }

    getClassName() {
      return EasyNode.namespace(__filename);
    }
        }

  ActionAOP.BEFORE = 'before';
  ActionAOP.AFTER = 'after';
  ActionAOP.SYNC = 'sync';
  ActionAOP.ASYNC = 'async';

  module.exports = ActionAOP;
})();
