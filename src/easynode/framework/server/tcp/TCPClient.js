var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var GenericObject = using('easynode.GenericObject');

(function() {
        /**
         * Class TCPClient
         *
         * @class easynode.framework.server.tcp.TCPClient
         * @extends easynode.GenericObject
         * @since 0.1.0
         * @author hujiabao
         * */
  class TCPClient extends GenericObject {
                /**
                 * 构造函数。
                 *
                 * @method 构造函数
                 * @param {Socket} socket 网络套接字
                 * @param {String} clientId 客户端连接UUID
                 * @since 0.1.0
                 * @author hujiabao
                 * */
    constructor(socket, server) {
      super();
                        // 调用super()后再定义子类成员。
      assert(socket, 'Invalid argument [socket]');
                        /**
                         *  网络套接字
                         *
                         * @property socket
                         * @type Socket Node.js plain socket object
                         * @since 0.1.0
                         * @author hujiabao
                         * */
      this.socket = socket;

                        /**
                         *  TCPServer实例
                         *
                         * @property server
                         * @type easynode.framework.server.tcp.TCPServer
                         * @since 0.1.0
                         * @author hujiabao
                         * */
      this.server = server;

                        /**
                         *  创建时间
                         *
                         * @property _uptime
                         * @type Date
                         * @private
                         *
                         * */
      this._uptime = new Date();

                        /**
                         *  是否处于连接状态
                         *
                         * @property _connected
                         * @type boolean
                         * @private
                         *
                         * */
      this._connected = true;

                        /**
                         *  客户端别名
                         *
                         * @property _alias
                         * @type String
                         * @private
                         *
                         * */
      this._alias = null;
    }

                /**
                 * 获取客户端连接时长(单位：ms)。
                 *
                 * @method uptime
                 * @return {int} 客户端连接时长(单位：ms)
                 * @since 0.1.0
                 * @author hujiabao
                 * */
    uptime() {
      return new Date() - this._uptime;
    }

                /**
                 * 获取原生Socket连接。
                 *
                 * @method getSocket
                 * @return {Socket} Socket连接
                 * @since 0.1.0
                 * @author hujiabao
                 * */
    getSocket() {
      return this.socket;
    }

                /**
                 * 获取客户端ID，返回：this.socket.SOCKET_ID
                 *
                 * @method getId
                 * @return {String} 客户端ID
                 * @since 0.1.0
                 * @author hujiabao
                 * */
    getId() {
      return this.getSocketId();
    }

                /**
                 * 设置客户端别名
                 *
                 * @method setAlias
                 * @param {String} alias 客户端别名
                 * @since 0.1.0
                 * @author hujiabao
                 * */
    setAlias(alias) {
      this._alias = alias;
    }

                /**
                 * 设置客户端别名
                 *
                 * @method getAlias
                 * @return {String} 客户端别名
                 * @since 0.1.0
                 * @author hujiabao
                 * */
    getAlias() {
      return this._alias;
    }

                /**
                 * 获取客户端Socket ID，返回：this.socket.SOCKET_ID
                 *
                 * @method getClientId
                 * @return {String} 客户端ID
                 * @since 0.1.0
                 * @author hujiabao
                 * */
    getSocketId() {
      return this.socket.SOCKET_ID;
    }

                /**
                 * 客户端是否已经连接成功
                 *
                 * @method uptime
                 * @return {boolean} 客户端是否已经连接成功
                 * @since 0.1.0
                 * @author hujiabao
                 * */
    connected() {
      return this._connected;
    }

                /**
                 * 发送一条消息
                 *
                 * @method send
                 * @param {Object} msg 要发送的消息，该消息会经过Encoder编码
                 * @async
                 * @since 0.1.0
                 * @author hujiabao
                 * */
    send(msg) {
      var me = this;
      return function *() {
        me.socket.encodeAndSend(msg);
      };
    }

    getClassName() {
      return EasyNode.namespace(__filename);
    }
        }

        /**
         * 消息decode后触发。
         *
         * @event message-decoded
         * @since 0.1.0
         * @author hujiabao
         * */
  TCPClient.EVENT_MESSAGE_DECODED = 'message-decoded';
  TCPClient.EVENT_MESSAGE_HANDLED = 'message-handled';

  module.exports = TCPClient;
})();
