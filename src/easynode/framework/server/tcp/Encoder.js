var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var GenericObject = using('easynode.GenericObject');

(function() {
        /**
         * Class Encoder
         *
         * @class easynode.framework.server.tcp.Encoder
         * @extends easynode.GenericObject
         * @since 0.1.0
         * @author hujiabao
         * */
  class Encoder extends GenericObject {
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
                 * 对消息进行编码
                 *
                 * @method decode
                 * @param {Object} 原始消息对象
                 * @param {easynode.framework.server.tcp.TCPClient} client 客户端实例
                 * @return {Buffer/String} 二进制Buffer，取决于socket的Encoding。
                 * @abstract
                 * @since 0.1.0
                 * @author hujiabao
                 * */
    encode(msg, client) {
      throw new Error('Abstract Method');
    }

    getClassName() {
      return EasyNode.namespace(__filename);
    }
        }

  module.exports = Encoder;
})();
