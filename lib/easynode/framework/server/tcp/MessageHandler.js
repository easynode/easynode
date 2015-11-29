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
         * Class MessageHandler
         *
         * @class easynode.framework.server.tcp.MessageHandler
         * @extends easynode.GenericObject
         * @since 0.1.0
         * @author hujiabao
         * */

        var MessageHandler = (function (_GenericObject) {
                _inherits(MessageHandler, _GenericObject);

                /**
                 * 构造函数。
                 *
                 * @method 构造函数
                 * @since 0.1.0
                 * @author hujiabao
                 * */

                function MessageHandler(server) {
                        _classCallCheck(this, MessageHandler);

                        //调用super()后再定义子类成员。

                        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(MessageHandler).call(this));

                        _this.server = server;
                        return _this;
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

                _createClass(MessageHandler, [{
                        key: 'handleMessage',
                        value: function handleMessage(msg, client) {
                                throw new Error('Abstract Method');
                        }
                }, {
                        key: 'getClassName',
                        value: function getClassName() {
                                return EasyNode.namespace(__filename);
                        }
                }]);

                return MessageHandler;
        })(GenericObject);

        module.exports = MessageHandler;
})();