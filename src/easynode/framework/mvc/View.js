var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var GenericObject = using('easynode.GenericObject');

(function () {
        /**
         * Class View
         *
         * @class easynode.framework.mvc.View
         * @extends easynode.GenericObject
         * @since 0.1.0
         * @author hujiabao
         * */
        class View extends GenericObject {
                /**
                 * 构造函数。
                 *
                 * @method 构造函数
                 * @since 0.1.0
                 * @author hujiabao
                 * */
                constructor() {
                        super();
                        //调用super()后再定义子类成员。
                }

                /**
                 * 获取渲染类型，json/html，影响response content-type。
                 *
                 * @method getContentType
                 * @return {String} 返回body类型, json/html
                 * @abstract
                 * @since 0.1.0
                 * @author hujiabao
                 * */
                getContentType () {
                        throw new Error('Abstract Method');
                }

                /**
                 * 渲染ActionResult。
                 *
                 * @method render
                 * @param {easynode.framework.mvc.ActionResult} actionResult Action执行结果
                 * @param {Object} opts 保留参数
                 * @return {Object} 返回渲染结果，JSON对象或者String
                 * @abstract
                 * @since 0.1.0
                 * @author hujiabao
                 * */
                render (actionResult, opts) {
                        throw new Error('Abstract Method');
                }

                getClassName() {
                        return EasyNode.namespace(__filename);
                }
        }

        module.exports = View;
})();