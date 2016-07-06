var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var Encoder = using('easynode.framework.server.tcp.Encoder');

(function() {
        /**
         * Class JSONEncoder
         *
         * @class easynode.framework.server.tcp.protocols.JSONEncoder
         * @extends easynode.easynode.framework.server.tcp.Encoder
         * @since 0.1.0
         * @author hujiabao
         * */
  class JSONEncoder extends Encoder {
                /**
                 * 构造函数。
                 *
                 * @method 构造函数
                 * @since 0.1.0
                 * @author hujiabao
                 * */
    constructor(server) {
      super(server);
                        // 调用super()后再定义子类成员。
    }

    encode(msg, client) {
      if (msg && typeof msg == 'object') {
        return JSON.stringify(msg) + '\r\n';
      }
    }

    getClassName() {
      return EasyNode.namespace(__filename);
    }
        }

  module.exports = JSONEncoder;
})();
