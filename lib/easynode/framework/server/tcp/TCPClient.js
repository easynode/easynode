'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var GenericObject = using('easynode.GenericObject');

(function () {
  /**
   * Class TCPClient
   *
   * @class easynode.framework.server.tcp.TCPClient
   * @extends easynode.GenericObject
   * @since 0.1.0
   * @author hujiabao
   * */

  var TCPClient = (function (_GenericObject) {
    _inherits(TCPClient, _GenericObject);

    /**
     * 构造函数。
     *
     * @method 构造函数
     * @param {Socket} socket 网络套接字
     * @param {String} clientId 客户端连接UUID
     * @since 0.1.0
     * @author hujiabao
     * */

    function TCPClient(socket, server) {
      _classCallCheck(this, TCPClient);

      //调用super()后再定义子类成员。

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(TCPClient).call(this));

      assert(socket, 'Invalid argument [socket]');
      /**
       *  网络套接字
       *
       * @property socket
       * @type Socket Node.js plain socket object
       * @since 0.1.0
       * @author hujiabao
       * */
      _this.socket = socket;

      /**
       *  TCPServer实例
       *
       * @property server
       * @type easynode.framework.server.tcp.TCPServer
       * @since 0.1.0
       * @author hujiabao
       * */
      _this.server = server;

      /**
       *  创建时间
       *
       * @property _uptime
       * @type Date
       * @private
       *
       * */
      _this._uptime = new Date();

      /**
       *  是否处于连接状态
       *
       * @property _connected
       * @type boolean
       * @private
       *
       * */
      _this._connected = true;

      /**
       *  客户端别名
       *
       * @property _alias
       * @type String
       * @private
       *
       * */
      _this._alias = null;
      return _this;
    }

    /**
     * 获取客户端连接时长(单位：ms)。
     *
     * @method uptime
     * @return {int} 客户端连接时长(单位：ms)
     * @since 0.1.0
     * @author hujiabao
     * */

    _createClass(TCPClient, [{
      key: 'uptime',
      value: function uptime() {
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

    }, {
      key: 'getSocket',
      value: function getSocket() {
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

    }, {
      key: 'getId',
      value: function getId() {
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

    }, {
      key: 'setAlias',
      value: function setAlias(alias) {
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

    }, {
      key: 'getAlias',
      value: function getAlias() {
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

    }, {
      key: 'getSocketId',
      value: function getSocketId() {
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

    }, {
      key: 'connected',
      value: function connected() {
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

    }, {
      key: 'send',
      value: function send(msg) {
        var me = this;
        return regeneratorRuntime.mark(function _callee() {
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  me.socket.encodeAndSend(msg);

                case 1:
                case 'end':
                  return _context.stop();
              }
            }
          }, _callee, this);
        });
      }
    }, {
      key: 'getClassName',
      value: function getClassName() {
        return EasyNode.namespace(__filename);
      }
    }]);

    return TCPClient;
  })(GenericObject);

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