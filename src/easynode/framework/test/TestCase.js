var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var GenericObject = using('easynode.GenericObject');

(function () {
        /**
         * Class TestCase
         *
         * @class easynode.framework.test.TestCase
         * @extends easynode.GenericObject
         * @since 0.1.0
         * @author hujiabao
         * */
        class TestCase extends GenericObject {
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
                 * 启动测试案例，子类需要实现start函数，注意：它是一个异步函数，需要返回一个generator函数的高阶函数。
                 *
                 * @method start
                 * @async
                 * @since 0.1.0
                 * @author hujiabao
                 * */
                start () {
                        throw new Error('Abstract Method');
                }

                getClassName() {
                        return EasyNode.namespace(__filename);
                }
        }

        module.exports = TestCase;
})();