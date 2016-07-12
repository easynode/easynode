'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var Encoder = using('easynode.framework.server.tcp.Encoder');

(function () {
  /**
   * Class JSONEncoder
   *
   * @class easynode.framework.server.tcp.protocols.JSONEncoder
   * @extends easynode.easynode.framework.server.tcp.Encoder
   * @since 0.1.0
   * @author hujiabao
   * */

  var JSONEncoder = function (_Encoder) {
    _inherits(JSONEncoder, _Encoder);

    /**
     * 构造函数。
     *
     * @method 构造函数
     * @since 0.1.0
     * @author hujiabao
     * */

    function JSONEncoder(server) {
      _classCallCheck(this, JSONEncoder);

      return _possibleConstructorReturn(this, Object.getPrototypeOf(JSONEncoder).call(this, server));
      // 调用super()后再定义子类成员。
    }

    _createClass(JSONEncoder, [{
      key: 'encode',
      value: function encode(msg, client) {
        if (msg && (typeof msg === 'undefined' ? 'undefined' : _typeof(msg)) == 'object') {
          return JSON.stringify(msg) + '\r\n';
        }
      }
    }, {
      key: 'getClassName',
      value: function getClassName() {
        return EasyNode.namespace(__filename);
      }
    }]);

    return JSONEncoder;
  }(Encoder);

  module.exports = JSONEncoder;
})();