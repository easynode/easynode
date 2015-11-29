'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var GenericObject = using('easynode.GenericObject');
var S = require('string');
var Binary = using('easynode.framework.util.Binary');

(function () {
        /**
         * Class StreamDecoderHelper
         *
         * @class easynode.framework.server.tcp.StreamDecoderHelper
         * @extends easynode.GenericObject
         * @since 0.1.0
         * @author hujiabao
         * */

        var StreamDecoderHelper = (function (_GenericObject) {
                _inherits(StreamDecoderHelper, _GenericObject);

                /**
                 * 构造函数。
                 *
                 * @method 构造函数
                 * @since 0.1.0
                 * @author hujiabao
                 * */

                function StreamDecoderHelper() {
                        _classCallCheck(this, StreamDecoderHelper);

                        return _possibleConstructorReturn(this, Object.getPrototypeOf(StreamDecoderHelper).call(this));
                        //调用super()后再定义子类成员。
                }

                /**
                 * 根据字符串描述的报文结构解析报文。
                 *
                 * @method decodeByStructDescription
                 * @param {Buffer} buf 输入Buffer，IN | OUT，正确解析时输入Buffer将被”消费“相应消息内容。
                 * @param {int} bufLen 输入Buffer的长度, in bytes
                 * @param {Array} struct 报文结构描述，字符串数组。
                 * @param {Object} dynamic 动态参数处理函数容器
                 * @param {String} endian 字节序：BE/LE。BE->big endian, LE->little endian
                 * @param {Iconv} encodingConverter 字符集转换器，如果为null则视为utf8字符集，否则请传递iconv字符集转换实例new Iconv('src', 'dest')
                 * @param {Object} validator 报文验证器，具有一个成员：validate : function(msg) {return true/false;}，如果验证失败，本函数将返回truncated Buffer
                 * @return {Object} 返回正确解析的消息结构、偏移量（消息总字节数），正确解析时输入Buffer将被”消费“相应消息内容。
                 * @static
                 * @since 0.1.0
                 * @author hujiabao
                 * */

                _createClass(StreamDecoderHelper, [{
                        key: 'getClassName',
                        value: function getClassName() {
                                return EasyNode.namespace(__filename);
                        }
                }], [{
                        key: 'decodeByStructDescription',
                        value: function decodeByStructDescription(buf, bufLen, struct) {
                                var dynamic = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];
                                var endian = arguments.length <= 4 || arguments[4] === undefined ? 'BE' : arguments[4];
                                var encodingConverter = arguments.length <= 5 || arguments[5] === undefined ? null : arguments[5];
                                var validator = arguments.length <= 6 || arguments[6] === undefined ? {
                                        validate: function validate(msg) {
                                                return true;
                                        }
                                } : arguments[6];

                                if (!buf || bufLen == 0 || !struct) {
                                        return null;
                                }

                                var msg = {};
                                var offset = 0;
                                var DECODE_FAIL = -1;
                                var dynamicLengthRegExp = /^LENGTH\(\$(.*)\)$/;

                                function __setField(name, val) {
                                        if (msg[name] !== undefined) {
                                                logger.warn('Duplicated field name [' + name + ']');
                                        }
                                        msg[name] = val;
                                }

                                function __recursiveDecode(buf, bufLen, struct) {
                                        var dynamic = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];
                                        var endian = arguments.length <= 4 || arguments[4] === undefined ? 'BE' : arguments[4];
                                        var encodingConverter = arguments.length <= 5 || arguments[5] === undefined ? null : arguments[5];

                                        for (var loop = 0; loop < struct.length; loop++) {
                                                var field = struct[loop];

                                                var _field$split = field.split(':');

                                                var _field$split2 = _slicedToArray(_field$split, 3);

                                                var name = _field$split2[0];
                                                var type = _field$split2[1];
                                                var exp = _field$split2[2];

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
                                                        exp = '' + exp; //convert to string
                                                }
                                                if (name == '$dynamic') {
                                                        console.dir(type);
                                                        console.dir(msg);
                                                        console.dir(dynamic);
                                                        var subStruct = dynamic[type].call(null, msg);
                                                        if (__recursiveDecode(buf, bufLen, subStruct, dynamic, endian, encodingConverter) < 0) {
                                                                return DECODE_FAIL;
                                                        }
                                                } else {
                                                        //EasyNode.DEBUG && logger.debug(`read [${name}] -> [${type}(${exp})] -> offset[${offset}]`);
                                                        switch (type.toUpperCase()) {
                                                                case 'STRING':
                                                                        {
                                                                                var len = parseInt(exp);
                                                                                if (offset + len > bufLen) {
                                                                                        return DECODE_FAIL;
                                                                                }
                                                                                var tempBuf = new Buffer(len);
                                                                                for (var i = 0; i < len; i++) {
                                                                                        tempBuf.writeUInt8(buf.readUInt8(offset++), i);
                                                                                }
                                                                                if (encodingConverter) {
                                                                                        var tempS = encodingConverter.convert(tempBuf).toString();
                                                                                        tempS = tempS.replace(/\u0000.*$/, ''); //截断C字符串终止符\0
                                                                                        __setField(name, tempS);
                                                                                } else {
                                                                                        var tempS = tempBuf.toString('utf8');
                                                                                        tempS = tempS.replace(/\u0000.*$/, ''); //截断C字符串终止符\0
                                                                                        __setField(name, tempS);
                                                                                }
                                                                                break;
                                                                        }
                                                                case 'BYTE':
                                                                        {
                                                                                var len = 1;
                                                                                if (offset + len > bufLen) {
                                                                                        return DECODE_FAIL;
                                                                                }
                                                                                __setField(name, buf.readUInt8(offset++));
                                                                                break;
                                                                        }
                                                                case 'BYTES':
                                                                        {
                                                                                var len = parseInt(exp);
                                                                                if (offset + len > bufLen) {
                                                                                        return DECODE_FAIL;
                                                                                }
                                                                                var arr = [];
                                                                                for (var i = 0; i < len; i++) {
                                                                                        arr.push(buf.readUInt8(offset++));
                                                                                }
                                                                                __setField(name, arr);
                                                                                break;
                                                                        }
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
                                                                                var fieldVal = msg[fieldName];
                                                                                if (fieldVal === undefined) {
                                                                                        throw new Error('Invalid sequence of field definition, BIT source is not found [$' + fieldName + ']');
                                                                                }
                                                                                fieldVal = fieldVal || 0;
                                                                                __setField(name, Binary.bits(fieldVal, bitPos, bitPos + bitLen - 1));
                                                                                break;
                                                                        }
                                                                case 'WORD':
                                                                        {
                                                                                var len = 2;
                                                                                if (offset + len > bufLen) {
                                                                                        return DECODE_FAIL;
                                                                                }
                                                                                if (endian != 'LE') {
                                                                                        __setField(name, buf.readUInt16BE(offset));
                                                                                } else {
                                                                                        __setField(name, buf.readUInt16LE(offset));
                                                                                }
                                                                                offset += 2;
                                                                                break;
                                                                        }
                                                                case 'DWORD':
                                                                        {
                                                                                var len = 4;
                                                                                if (offset + len > bufLen) {
                                                                                        return DECODE_FAIL;
                                                                                }
                                                                                if (endian != 'LE') {
                                                                                        __setField(name, buf.readUInt32BE(offset));
                                                                                } else {
                                                                                        __setField(name, buf.readUInt32LE(offset));
                                                                                }
                                                                                offset += 4;
                                                                                break;
                                                                        }
                                                                case 'FLOAT':
                                                                        {
                                                                                var len = 4;
                                                                                if (offset + len > bufLen) {
                                                                                        return DECODE_FAIL;
                                                                                }
                                                                                if (endian != 'LE') {
                                                                                        __setField(name, buf.readFloatBE(offset));
                                                                                } else {
                                                                                        __setField(name, buf.readFloatLE(offset));
                                                                                }
                                                                                offset += 4;
                                                                                break;
                                                                        }
                                                                case 'DOUBLE':
                                                                        {
                                                                                var len = 8;
                                                                                if (offset + len > bufLen) {
                                                                                        return DECODE_FAIL;
                                                                                }
                                                                                if (endian != 'LE') {
                                                                                        __setField(name, buf.readDoubleBE(offset));
                                                                                } else {
                                                                                        __setField(name, buf.readDoubleLE(offset));
                                                                                }
                                                                                offset += 8;
                                                                                break;
                                                                        }
                                                                default:
                                                                        {
                                                                                throw new Error('Unknown type [' + type + '] of field [' + name + ']');
                                                                        }
                                                        }
                                                }
                                        }
                                        return offset;
                                }

                                var ret = __recursiveDecode(buf, bufLen, struct, dynamic, endian, encodingConverter);
                                if (ret > 0) {
                                        msg.__original__ = buf.slice(0, offset).toString('hex');
                                        if (validator.validate(msg)) {
                                                //buf.copy(buf, 0, offset, bufLen - offset);                    //nodejs bug，重复地址的copy会出问题
                                                var _buf = new Buffer(bufLen - offset);
                                                buf.copy(_buf, 0, offset, bufLen);
                                                _buf.copy(buf);
                                                buf.fill(0, bufLen - offset);
                                                return {
                                                        msg: msg,
                                                        offset: offset
                                                };
                                        } else {
                                                //clear received buffer
                                                logger.warn('bad package, received buffer will be truncated');
                                                buf.fill(0);
                                                return {
                                                        msg: null,
                                                        offset: bufLen
                                                };
                                        }
                                } else {
                                        EasyNode.DEBUG && logger.debug('waiting next package...');
                                }
                                return null;
                        }
                }]);

                return StreamDecoderHelper;
        })(GenericObject);

        module.exports = StreamDecoderHelper;
})();