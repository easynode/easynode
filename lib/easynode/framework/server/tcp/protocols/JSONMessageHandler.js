'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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

  var JSONMessageHandler = function (_MessageHandler) {
    _inherits(JSONMessageHandler, _MessageHandler);

    /**
     * 构造函数。
     *
     * @method 构造函数
     * @since 0.1.0
     * @author hujiabao
     * */

    function JSONMessageHandler(server) {
      _classCallCheck(this, JSONMessageHandler);

      return _possibleConstructorReturn(this, Object.getPrototypeOf(JSONMessageHandler).call(this, server));
      // 调用super()后再定义子类成员。
    }

    _createClass(JSONMessageHandler, [{
      key: 'handleMessage',
      value: function handleMessage(msg, client) {
        return regeneratorRuntime.mark(function _callee() {
          var m, a;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  m = msg.m;
                  a = msg.a;
                  return _context.abrupt('return', {
                    hello: 'JSON'
                  });

                case 3:
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

    return JSONMessageHandler;
  }(MessageHandler);

  module.exports = JSONMessageHandler;
})();