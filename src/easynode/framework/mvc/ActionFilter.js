var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var GenericObject = using('easynode.GenericObject');

(function() {
  var filters = [];

        /**
         * Class ActionFilter
         *
         * @class easynode.framework.mvc.ActionFilter
         * @extends easynode.GenericObject
         * @since 0.1.0
         * @author hujiabao
         * */
  class ActionFilter extends GenericObject {
                /**
                 * 构造函数。
                 *
                 * @method 构造函数
                 * @since 0.1.0
                 * @author hujiabao
                 * */
    constructor(name = 'untitled') {
      super();
                        // 调用super()后再定义子类成员。
    }

                /**
                 * 过滤Action执行。
                 *
                 * @method filter
                 * @param {String} m 模块名
                 * @param {String} a Action名
                 * @param {Action} action Action实例
                 * @param {Array} stack Action的authorize、validate和process方法调用参数栈，该栈的第一个参数总是为ActionContext实例
                 * @param {generator} next 下一个元素
                 * @return {ActionResult} 返回ActionResult实例，返回null值表示filter执行完成
                 * @async
                 * @since 0.1.0
                 * @author hujiabao
                 * */
    filter(m, a, action, stack, next) {
      return function *() {
        return yield next;
      };
    }

                /**
                 * 向系统的Action过滤器链中增加一个或多个过滤器。
                 *
                 * @method addFilter
                 * @param {..} f ActionFilter实例或具有filter成员函数(generator)的对象，一个或多个
                 * @return {ActionFilter} 返回ActionFilter，可链式调用
                 * @static
                 * @since 0.1.0
                 * @author hujiabao
                 * */
    static addFilter(...f) {
      f.forEach((filter) => {
        assert(filter instanceof ActionFilter || typeof filter.filter == 'function', 'Invalid argument');
        filters.push(filter);
      });
      return ActionFilter;
    }

                /**
                 * 向系统的Action过滤器链中增加一个或多个过滤器。
                 *
                 * @method addFilter
                 * @param {..} f ActionFilter实例，一个或多个
                 * @return {ActionFilter} 返回ActionFilter，可链式调用
                 * @static
                 * @since 0.1.0
                 * @author hujiabao
                 * */
    static filters() {
      return filters;
    }

    getClassName() {
      return EasyNode.namespace(__filename);
    }
        }

  module.exports = ActionFilter;
})();
