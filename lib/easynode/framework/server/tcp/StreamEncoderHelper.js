'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var GenericObject = using('easynode.GenericObject');
var S = require('string');
var Binary = using('easynode.framework.util.Binary');
var util = require('util');

(function () {
  /**
   * Class StreamEncoderHelper
   *
   * @class easynode.framework.server.tcp.StreamEncoderHelper
   * @extends easynode.GenericObject
   * @since 0.1.0
   * @author hujiabao
   * */

  var StreamEncoderHelper = function (_GenericObject) {
    _inherits(StreamEncoderHelper, _GenericObject);

    /**
     * 构造函数。
     *
     * @method 构造函数
     * @since 0.1.0
     * @author hujiabao
     * */

    function StreamEncoderHelper() {
      _classCallCheck(this, StreamEncoderHelper);

      return _possibleConstructorReturn(this, Object.getPrototypeOf(StreamEncoderHelper).call(this));
      // 调用super()后再定义子类成员。
    }

    /**
     * 根据字符串描述的报文结构解析报文。
     *
     * @method encodeByStructDescription
     * @static
     * @since 0.1.0
     * @author hujiabao
     * */


    _createClass(StreamEncoderHelper, [{
      key: 'getClassName',
      value: function getClassName() {
        return EasyNode.namespace(__filename);
      }
    }], [{
      key: 'encodeByStructDescription',
      value: function encodeByStructDescription(msg, struct) {
        var dynamic = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
        var endian = arguments.length <= 3 || arguments[3] === undefined ? 'BE' : arguments[3];
        var encodingConverter = arguments.length <= 4 || arguments[4] === undefined ? null : arguments[4];

        if (!msg || struct.length == 0) {
          return new Buffer(0);
        }

        var arr = [];
        var dynamicLengthRegExp = /^LENGTH\(\$(.*)\)$/;
        var length = 0;
        // 计算BIT值。
        function __calculateBits(s) {
          for (var i = 0; i < s.length; i++) {
            var field = s[i];

            var _field$split = field.split(':');

            var _field$split2 = _slicedToArray(_field$split, 3);

            var name = _field$split2[0];
            var type = _field$split2[1];
            var exp = _field$split2[2];

            name = S(name).trim().toString();
            type = S(type).trim().toString();
            exp = exp || '';
            exp = S(exp).trim().toString();
            if (name == '$dynamic') {
              var subStruct = dynamic[type].call(null, msg);
              __calculateBits(subStruct);
            } else {
              switch (type.toUpperCase()) {
                case 'BIT':
                  {
                    var bitRegExp = /^BIT\(\$(\w+)\,(\d+)\,?(\d*)\)$/;
                    var arr = bitRegExp.exec(exp);
                    if (!arr) {
                      throw new Error('Invalid bit field expression [' + exp + '], BIT($fieldName,pos[,len])');
                    }
                    var fieldName = arr[1];
                    var bitPos = parseInt(arr[2]);
                    var bitLen = parseInt(arr[3] || '1');
                    if (msg[fieldName] === undefined) {
                      msg[fieldName] = 0;
                    }
                    var fieldVal = msg[fieldName];
                    var val = msg[name] || 0;
                    assert(typeof fieldVal == 'number', 'Invalid field type number -> [' + fieldName + ']');
                    assert(typeof val == 'number', 'Invalid field type number -> [' + name + ']');
                    msg[fieldName] = Binary.bitSets(fieldVal, bitPos, bitPos + bitLen, val);
                    break;
                  }
              }
            }
          }
        }

        function __encodeStruct(s) {
          for (var loop = 0; loop < s.length; loop++) {
            var field = s[loop];

            var _field$split3 = field.split(':');

            var _field$split4 = _slicedToArray(_field$split3, 3);

            var name = _field$split4[0];
            var type = _field$split4[1];
            var exp = _field$split4[2];

            name = S(name).trim().toString();
            type = S(type).trim().toString();
            exp = exp || '';
            exp = S(exp).trim().toString();
            if (dynamicLengthRegExp.test(exp)) {
              var _referField = dynamicLengthRegExp.exec(exp)[1];
              exp = msg[_referField];
              if (exp == null) {
                throw new Error('Invalid struct definition, field [' + _referField + '] is not found');
              }
              exp = '' + exp; // convert to string
            }
            if (name == '$dynamic') {
              var subStruct = dynamic[type].call(null, msg);
              __encodeStruct(subStruct);
            } else {
              switch (type.toUpperCase()) {
                case 'STRING':
                  {
                    var len = parseInt(exp);
                    length += len;
                    var val = msg[name] || '';
                    assert(typeof val == 'string', 'Invalid field type string -> [' + name + ']');
                    var tempBuf = new Buffer(len);
                    tempBuf.fill(0);
                    if (encodingConverter) {
                      var _buf = encodingConverter.convert(val);
                      _buf.copy(tempBuf);
                    } else {
                      tempBuf.write(val);
                    }
                    Binary.writeBuffer2Array(tempBuf, len, arr);
                    break;
                  }
                case 'BYTE':
                  {
                    var val = msg[name] || 0;
                    length += 1;
                    assert(typeof val == 'number', 'Invalid field type number -> [' + name + ']');
                    var tempBuf = new Buffer(1);
                    tempBuf.writeUInt8(val);
                    Binary.writeBuffer2Array(tempBuf, 1, arr);
                    break;
                  }
                case 'BYTES':
                  {
                    var len = parseInt(exp);
                    length += len;
                    var val = msg[name] || [];
                    assert(util.isArray(val), 'Invalid field type array -> [' + name + ']');
                    var tempBuf = new Buffer(len);
                    tempBuf.fill(0);
                    var dataBuf = new Buffer(val);
                    dataBuf.copy(tempBuf);
                    Binary.writeBuffer2Array(tempBuf, len, arr);
                    break;
                  }
                case 'BIT':
                  {
                    break;
                  }
                case 'WORD':
                  {
                    var val = msg[name] || 0;
                    length += 2;
                    assert(typeof val == 'number', 'Invalid field type number -> [' + name + ']');
                    var tempBuf = new Buffer(2);
                    if (endian != 'LE') {
                      tempBuf.writeUInt16BE(val);
                    } else {
                      tempBuf.writeUInt16LE(val);
                    }
                    Binary.writeBuffer2Array(tempBuf, 2, arr);
                    break;
                  }
                case 'DWORD':
                  {
                    var val = msg[name] || 0;
                    length += 4;
                    assert(typeof val == 'number', 'Invalid field type number -> [' + name + ']');
                    var tempBuf = new Buffer(4);
                    if (endian != 'LE') {
                      tempBuf.writeUInt32BE(val);
                    } else {
                      tempBuf.writeUInt32LE(val);
                    }
                    Binary.writeBuffer2Array(tempBuf, 4, arr);
                    break;
                  }
                case 'FLOAT':
                  {
                    var val = msg[name] || 0.0;
                    length += 4;
                    assert(typeof val == 'number', 'Invalid field type number -> [' + name + ']');
                    var tempBuf = new Buffer(4);
                    if (endian != 'LE') {
                      tempBuf.writeFloatBE(val);
                    } else {
                      tempBuf.writeFloatLE(val);
                    }
                    Binary.writeBuffer2Array(tempBuf, 4, arr);
                    break;
                  }
                case 'DOUBLE':
                  {
                    var val = msg[name] || 0.0;
                    length += 8;
                    assert(typeof val == 'number', 'Invalid field type number -> [' + name + '}]');
                    var tempBuf = new Buffer(8);
                    if (endian != 'LE') {
                      tempBuf.writeDoubleBE(val);
                    } else {
                      tempBuf.writeDoubleLE(val);
                    }
                    Binary.writeBuffer2Array(tempBuf, 8, arr);
                    break;
                  }
                default:
                  {
                    throw new Error('Unknown type [' + type + '] of field [' + name + ']');
                  }
              }
            }
          }
        }

        __calculateBits(struct);
        __encodeStruct(struct);
        return new Buffer(arr);
      }
    }]);

    return StreamEncoderHelper;
  }(GenericObject);

  module.exports = StreamEncoderHelper;
})();