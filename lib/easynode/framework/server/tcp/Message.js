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

(function () {
        /**
         * Class Message
         *
         * @class easynode.framework.server.tcp.Message
         * @extends easynode.GenericObject
         * @since 0.1.0
         * @author hujiabao
         * */

        var Message = (function (_GenericObject) {
                _inherits(Message, _GenericObject);

                /**
                 * 构造函数。
                 *
                 * @method 构造函数
                 * @since 0.1.0
                 * @author hujiabao
                 * */

                function Message() {
                        _classCallCheck(this, Message);

                        return _possibleConstructorReturn(this, Object.getPrototypeOf(Message).call(this));
                        //调用super()后再定义子类成员。
                }

                /**
                 * 从消息结构数组创建消息JSON对象。
                 * //结构示范：
                 * return [
                 'startFlag:BYTE',
                 'frameLen:WORD',
                 'sumCheck:WORD',
                 'msgId:WORD',
                 'msgVersion:BYTE',
                 'encrypt:BYTE',
                 'IMEI:STRING:16',
                 '$dynamic:getBodyStruct',
                 'bitField:BIT:BIT($msgId,1)',
                 'bitField2:BIT:BIT($msgId,1,2)',
                 'endFlag:BYTE',
                 'dynamicLen:BYTES:LENGTH($frameLen)'
                 ];
                 *
                 *
                 * @method createFromStructDescription
                 * @param {Object} dynamicSrc dynamic执行时的源对象
                 * @param {Array} struct 消息结构数组
                 * @param {Object} dynamic 动态参数处理器
                 * @static
                 * @since 0.1.0
                 * @author hujiabao
                 * */

                _createClass(Message, [{
                        key: 'getClassName',
                        value: function getClassName() {
                                return EasyNode.namespace(__filename);
                        }
                }], [{
                        key: 'createFromStructDescription',
                        value: function createFromStructDescription(dynamicSrc, struct) {
                                var dynamic = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

                                var length = 0;
                                var dynamicLengthRegExp = /^LENGTH\(\$(.*)\)$/;
                                var msg = {};

                                function __create(s) {
                                        for (var loop = 0; loop < s.length; loop++) {
                                                var field = s[loop];

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
                                                        var subStruct = dynamic[type].call(null, dynamicSrc);
                                                        __create(subStruct);
                                                } else {
                                                        switch (type.toUpperCase()) {
                                                                case 'STRING':
                                                                        {
                                                                                msg[name] = '';
                                                                                length += parseInt(exp);
                                                                                break;
                                                                        }
                                                                case 'BYTE':
                                                                        {
                                                                                msg[name] = 0;
                                                                                length += 1;
                                                                                break;
                                                                        }
                                                                case 'BIT':
                                                                        {
                                                                                msg[name] = 0;
                                                                                break;
                                                                        }
                                                                case 'WORD':
                                                                        {
                                                                                msg[name] = 0;
                                                                                length += 2;
                                                                                break;
                                                                        }
                                                                case 'DWORD':
                                                                        {
                                                                                msg[name] = 0;
                                                                                length += 4;
                                                                                break;
                                                                        }
                                                                case 'BYTES':
                                                                        {
                                                                                var len = parseInt(exp);
                                                                                var arr = [];
                                                                                for (var i = 0; i < len; i++) {
                                                                                        arr.push(0);
                                                                                }
                                                                                msg[name] = arr;
                                                                                length += parseInt(exp);
                                                                                break;
                                                                        }
                                                                case 'FLOAT':
                                                                        {
                                                                                msg[name] = 0.0;
                                                                                length += 4;
                                                                                break;
                                                                        }
                                                                case 'DOUBLE':
                                                                        {
                                                                                msg[name] = 0.0;
                                                                                length += 8;
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

                                __create(struct);
                                return {
                                        msg: msg,
                                        length: length
                                };
                        }
                }]);

                return Message;
        })(GenericObject);

        module.exports = Message;
})();