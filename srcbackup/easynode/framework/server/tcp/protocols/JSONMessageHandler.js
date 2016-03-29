var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var MessageHandler = using('easynode.framework.server.tcp.MessageHandler');

(function () {
        /**
         * Class JSONMessageHandler
         *
         * @class easynode.framework.server.tcp.protocols.JSONMessageHandler
         * @extends easynode.framework.server.tcp.MessageHandler
         * @since 0.1.0
         * @author hujiabao
         * */
        class JSONMessageHandler extends MessageHandler {
                /**
                 * 构造函数。
                 *
                 * @method 构造函数
                 * @since 0.1.0
                 * @author hujiabao
                 * */
                constructor(server) {
                        super(server);
                        //调用super()后再定义子类成员。
                }

                handleMessage(msg, client) {
                        return function * () {
                                var m = msg.m;
                                var a = msg.a;
                                return {
                                        hello : 'JSON'
                                };
                        };
                }

                getClassName() {
                        return EasyNode.namespace(__filename);
                }
        }

        module.exports = JSONMessageHandler;
})();