'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var Decoder = using('easynode.framework.server.tcp.Decoder');
var TCPClient = using('easynode.framework.server.tcp.TCPClient');

(function () {
        /**
         * Class JSONDecoder
         *
         * @class easynode.framework.server.tcp.protocols.JSONDecoder
         * @extends easynode.framework.server.tcp.Decoder
         * @since 0.1.0
         * @author hujiabao
         * */

        var JSONDecoder = (function (_Decoder) {
                _inherits(JSONDecoder, _Decoder);

                /**
                 * 构造函数。
                 *
                 * @method 构造函数
                 * @since 0.1.0
                 * @author hujiabao
                 * */

                function JSONDecoder(server) {
                        var encoding = arguments.length <= 1 || arguments[1] === undefined ? 'utf8' : arguments[1];

                        _classCallCheck(this, JSONDecoder);

                        //调用super()后再定义子类成员。

                        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(JSONDecoder).call(this, server));

                        _this.encoding = encoding;
                        return _this;
                }

                _createClass(JSONDecoder, [{
                        key: 'decode',
                        value: function decode(client) {
                                var socket = client.getSocket();
                                var me = this;
                                socket.setEncoding(this.encoding);
                                var r = false;
                                var line = false;
                                client.recvBuf = '';
                                socket.on('readable', function () {
                                        while (true) {
                                                var s = socket.read(1);
                                                if (s == null) {
                                                        break;
                                                }
                                                var code = s.charCodeAt(0);
                                                client.recvBuf += s;
                                                if (!r) {
                                                        if (code == 0x0D) {
                                                                r = true;
                                                        }
                                                } else {
                                                        if (code == 0x0A) {
                                                                line = true;
                                                        }
                                                        r = false;
                                                }
                                                if (line) {
                                                        //received a line
                                                        try {
                                                                var msg = JSON.parse(client.recvBuf);
                                                                if (msg && (typeof msg === 'undefined' ? 'undefined' : _typeof(msg)) == 'object') {
                                                                        client.trigger(TCPClient.EVENT_MESSAGE_DECODED, msg);
                                                                }
                                                        } catch (err) {}
                                                        line = false;
                                                        client.recvBuf = '';
                                                }
                                        }
                                });
                        }
                }, {
                        key: 'getClassName',
                        value: function getClassName() {
                                return EasyNode.namespace(__filename);
                        }
                }]);

                return JSONDecoder;
        })(Decoder);

        module.exports = JSONDecoder;
})();