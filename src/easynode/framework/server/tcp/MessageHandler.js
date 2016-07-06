var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var GenericObject = using('easynode.GenericObject');

(function() {
        /**
         * Class MessageHandler
         *
         * @class easynode.framework.server.tcp.MessageHandler
         * @extends easynode.GenericObject
         * @since 0.1.0
         * @author hujiabao
         * */
  class MessageHandler extends GenericObject {
                /**
                 * 构造函数。
                 *
                 * @method 构造函数
                 * @since 0.1.0
                 * @author hujiabao
                 * */
    constructor(server) {
      super();
                        // 调用super()后再定义子类成员。
      this.server = server;
    }

                /**
                 * 处理消息
                 *
                 * @method decode
                 * @param {Object} msg decoder触发的TCPClient.EVENT_MESSAGE_DECODED事件的参数
                 * @param {easynode.framework.server.tcp.TCPClient} client 客户端实例
                 * @return {Object/Array} 响应消息，当类型是Array时表示多条响应消息，这些消息会自动经encoder后发送至客户端
                 * @abstract
                 * @async
                 * @since 0.1.0
                 * @author hujiabao
                 * */
    handleMessage(msg, client) {
      throw new Error('Abstract Method');
    }

    getClassName() {
      return EasyNode.namespace(__filename);
    }
        }

  module.exports = MessageHandler;
})();
