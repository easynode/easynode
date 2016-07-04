'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var GenericObject = using('easynode.GenericObject');
var mustache = require('mustache');
var _ = require('underscore');
var Iconv = require('iconv').Iconv;
var crypto = require('crypto');

(function () {
        /**
         * Class StringUtil
         *
         * @class easynode.framework.util.StringUtil
         * @extends easynode.GenericObject
         * @since 0.1.0
         * @author hujiabao
         * */

        var StringUtil = function (_GenericObject) {
                _inherits(StringUtil, _GenericObject);

                /**
                 * 构造函数。
                 *
                 * @method 构造函数
                 * @since 0.1.0
                 * @author hujiabao
                 * */

                function StringUtil() {
                        _classCallCheck(this, StringUtil);

                        return _possibleConstructorReturn(this, Object.getPrototypeOf(StringUtil).call(this));
                        //调用super()后再定义子类成员。
                }

                /**
                 * 格式化字符串，将字符串中的占位符按顺序或按名称替换成实际字符串。占位符格式：{{xxx}}。
                 *
                 * @method format
                 * @param {String} str
                 * @param {...} replaces 替换参数，可以为数组，如果为数组则逐个替换，如果为对象则按名称替换。
                 * @since 0.1.0
                 * @author hujiabao
                 * */


                _createClass(StringUtil, [{
                        key: 'getClassName',
                        value: function getClassName() {
                                return EasyNode.namespace(__filename);
                        }
                }], [{
                        key: 'format',
                        value: function format(str) {
                                for (var _len = arguments.length, replaces = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                                        replaces[_key - 1] = arguments[_key];
                                }

                                assert(str == null || typeof str == 'string', 'Invalid argument');
                                if (arguments.length == 1) {
                                        return str;
                                }

                                if (!str) {
                                        return str;
                                }

                                if (arguments.length == 2 && _typeof(arguments[1]) == 'object') {
                                        var replace = arguments[1];
                                        //使用mustache来渲染，不支持helper函数。
                                        return mustache.render(str, replace);
                                } else {
                                        var args = _.toArray(arguments).splice(1);
                                        var regExp = /\{\{\w+\}\}/;
                                        var idx = 0;
                                        while (true) {
                                                if (idx == args.length) {
                                                        break;
                                                }
                                                if (str.match(regExp)) {
                                                        str = str.replace(regExp, args[idx]);
                                                } else {
                                                        break;
                                                }
                                                idx++;
                                        }
                                        return str;
                                }
                        }

                        /**
                         * 2字节short转HEX String
                         *
                         * @method short2Hex
                         * @param {short} s
                         * @return {String} hex code, 不含0x
                         * @since 0.1.0
                         * @author hujiabao
                         * */

                }, {
                        key: 'short2Hex',
                        value: function short2Hex(s) {
                                var buf = new Buffer(1);
                                buf.writeUInt8(s);
                                return buf.toString('hex').toUpperCase();
                        }

                        /**
                         * 1字节byte转HEX String
                         *
                         * @method short2Hex
                         * @param {byte} b
                         * @return {String} hex code, 不含0x
                         * @since 0.1.0
                         * @author hujiabao
                         * */

                }, {
                        key: 'byte2Hex',
                        value: function byte2Hex(b) {
                                //var buf = new Buffer(1);
                                //buf.writeUInt8BE(b);
                                //return buf.toString('hex').toUpperCase();
                                assert(typeof b == 'number' && !isNaN(b), 'Invalid short number');
                                b = b & 0xFF; //防止byte型溢出
                                b = b.toString(16).toUpperCase();
                                if (b.length < 2) {
                                        b = '0' + b;
                                }
                        }

                        /**
                         * 4字节int转HEX String
                         *
                         * @method short2Hex
                         * @param {int} i
                         * @return {String} hex code, 不含0x
                         * @since 0.1.0
                         * @author hujiabao
                         * */

                }, {
                        key: 'int2Hex',
                        value: function int2Hex(i) {
                                //var buf = new Buffer(4);
                                //buf.writeUInt32BE(i);
                                //return buf.toString('hex').toUpperCase();
                                assert(typeof i == 'number' && !isNaN(i), 'Invalid short number');
                                i = i & 0xFFFFFFFF; //防止int型溢出
                                i = i.toString(16).toUpperCase();
                                while (i.length < 8) {
                                        i = '0' + i;
                                }
                                return i;
                        }

                        /*
                         * 加密数据
                         *
                         * @method encryptAdv
                         * @param {Buffer|String['binary','hex','utf8','ascii']} 原始数据
                         * @return {Buffer} 加密数据
                         * @since 0.1.0
                         * @author hujiabao
                         * */

                }, {
                        key: 'encryptAdv',
                        value: function encryptAdv(data) {
                                var key = 'XRDRUE7FFCRE1T7I';
                                var iv = '7VU2H0LLBG8373LK';
                                var clearEncoding = 'utf8';
                                var cipherEncoding = 'base64';
                                var cipherChunks = [];
                                var cipher = crypto.createCipherivAdv('aes-128-cbc', key, iv);
                                cipher.setAutoPadding(true);

                                var enc = cipher.update(data, clearEncoding, cipherEncoding);
                                enc += cipher.final(cipherEncoding);

                                return enc;
                        }

                        /*
                         * 解密数据
                         *
                         * @method decryptAdv
                         * @param {Buffer|String['binary','hex','utf8','ascii']} 加密数据
                         * @return {Buffer} 原始数据
                         * @since 0.1.0
                         * @author hujiabao
                        * */

                }, {
                        key: 'decryptAdv',
                        value: function decryptAdv(data) {
                                var key = 'XRDRUE7FFCRE1T7I';
                                var iv = '7VU2H0LLBG8373LK';
                                var clearEncoding = 'binary';
                                var cipherEncoding = 'base64';
                                var decipher = crypto.createDecipherivAdv('aes-128-cbc', key, iv);
                                decipher.setAutoPadding(true);

                                var enc = decipher.update(data, cipherEncoding, clearEncoding);
                                enc += decipher.final(clearEncoding);

                                return enc;
                        }

                        /**
                         * 返回开关状态
                         *
                         * @method switchState
                         * @param {int/boolean/String} sw 状态
                         * @return {boolean} 开关状态，int型时，1返回true, 非1返回false，boolean型时直接返回，字符串型
                         *                                      '1','true','on','yes'返回true，其他返回false
                         * @since 0.1.0
                         * @author hujiabao
                         * */

                }, {
                        key: 'switchState',
                        value: function switchState(sw) {
                                switch (typeof sw === 'undefined' ? 'undefined' : _typeof(sw)) {
                                        case 'number':
                                                {
                                                        return sw === 1;
                                                }
                                        case 'boolean':
                                                {
                                                        return sw;
                                                }
                                        case 'string':
                                                {
                                                        sw = sw.toLowerCase();
                                                        return sw == '1' || sw == 'true' || sw == 'yes' || sw == 'on';
                                                }
                                }
                                return false;
                        }

                        /*字符串转hexString
                         */

                }, {
                        key: 'stringToHex',
                        value: function stringToHex(str, encoding) {
                                var buf = new Buffer(str);
                                if (encoding) {
                                        var converter = new Iconv('utf8', encoding);
                                        buf = converter.convert(buf);
                                }
                                return buf.toString('hex');
                        }

                        /**
                         * 是否为局域网IP，局域网IP包括：192网段，172网段和10网段，127本地地址也视为局域网地址
                         *
                         * @method isIntranet
                         * @param {String} ip IP地址
                         * @return {boolean} 是否为局域网IP地址
                         * @since 0.1.0
                         * @author hujiabao
                         * */

                }, {
                        key: 'isIntranet',
                        value: function isIntranet(ip) {
                                if (ip) {
                                        return ip.match(/^[172|192|127|10].*$/);
                                }
                                return false;
                        }
                }]);

                return StringUtil;
        }(GenericObject);

        module.exports = StringUtil;
})();