var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var GenericObject = using('easynode.GenericObject');

(function() {
        /**
         * Class IActionContextListener。流程顺序：onCreate->onActionReady->onDestroy，出错时调用onError->onDestroy
         *
         * @class easynode.framework.mvc.IActionContextListener
         * @extends easynode.GenericObject
         * @since 0.1.0
         * @author hujiabao
         * */
  class IActionContextListener extends GenericObject {
                /**
                 *  ActionContext创建时被调用。此时ctx.getAction()可能为null。
                 *
                 * @method onCreate
                 * @param {easynode.framework.mvc.ActionContext} ctx ActionContext实例
                 * @async
                 * @abstract
                 * @since 0.1.0
                 * @author hujiabao
                 **/
    onCreate(ctx) {
      throw new Error('Abstract Error');
    }

                /**
                 *  ActionContext的action被执行前调用。
                 *
                 * @method onActionReady
                 * @param {easynode.framework.mvc.ActionContext} ctx ActionContext实例
                 * @async
                 * @abstract
                 * @since 0.1.0
                 * @author hujiabao
                 **/
    onActionReady(ctx) {
      throw new Error('Abstract Error');
    }

                /**
                 *  ActionContext销毁时被调用。
                 *
                 * @method onDestroy
                 * @param {easynode.framework.mvc.ActionContext} ctx ActionContext实例
                 * @async
                 * @abstract
                 * @since 0.1.0
                 * @author hujiabao
                 **/
    onDestroy(ctx) {
      throw new Error('Abstract Error');
    }

                /**
                 *  Action调用发生异常时被调用。
                 *
                 * @method onError
                 * @param {easynode.framework.mvc.ActionContext} ctx ActionContext实例
                 * @param {Error} err 异常实例
                 * @async
                 * @abstract
                 * @since 0.1.0
                 * @author hujiabao
                 **/
    onError(ctx, err) {
      throw new Error('Abstract Error');
    }

    getClassName() {
      return EasyNode.namespace(__filename);
    }
        }

  module.exports = IActionContextListener;
})();
