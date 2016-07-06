var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var GenericObject = using('easynode.GenericObject');

(function() {
        /**
         * Class Decoder
         *
         * @class easynode.framework.server.tcp.Decoder
         * @extends easynode.GenericObject
         * @since 0.1.0
         * @author hujiabao
         * */
  class Decoder extends GenericObject {
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
                 * 开始decode client消息。解析出有效消息后触发事件：TCPClient.EVENT_MESSAGE_DECODED
                 *
                 * @method encode
                 * @param {easynode.framework.server.tcp.TCPClient} client 客户端实例
                 * @abstract
                 * @since 0.1.0
                 * @author hujiabao
                 * */
    encode(client) {
      throw new Error('Abstract Method');
    }

    getClassName() {
      return EasyNode.namespace(__filename);
    }
        }

  module.exports = Decoder;
})();
