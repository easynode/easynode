var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var TestCase = using('easynode.framework.test.TestCase');

(function () {
        /**
         * Class SimpleKOAHttpServerTest
         *
         * @class easynode.tests.SimpleKOAHttpServerTest
         * @extends easynode.framework.test.TestCase
         * @since 0.1.0
         * @author hujiabao
         * */
        class SimpleKOAHttpServerTest extends TestCase {

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

                start () {
                        return function * () {
                                var KOAHttpServer = using('easynode.framework.server.http.KOAHttpServer');
                                var defaultPort = 5000;
                                var server = new KOAHttpServer(defaultPort);
                                yield server.start();
                        };
                }

                getClassName() {
                        return EasyNode.namespace(__filename);
                }
        }

        module.exports = SimpleKOAHttpServerTest;
})();