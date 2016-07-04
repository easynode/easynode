'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var GenericObject = using('easynode.GenericObject');
var mysql = require('mysql');
var util = require('util');
var S = require('string');
var crypto = require('crypto');

(function () {
        /**
         * Class SqlUtil
         *
         * @class easynode.framework.util.SqlUtil
         * @extends easynode.GenericObject
         * @since 0.1.0
         * @author hujiabao
         * */

        var SqlUtil = function (_GenericObject) {
                _inherits(SqlUtil, _GenericObject);

                /**
                 * 构造函数。
                 *
                 * @method 构造函数
                 * @since 0.1.0
                 * @author hujiabao
                 * */

                function SqlUtil() {
                        _classCallCheck(this, SqlUtil);

                        return _possibleConstructorReturn(this, Object.getPrototypeOf(SqlUtil).call(this));
                        //调用super()后再定义子类成员。
                }

                /**
                 * 替换mysql的SQL参数。参数格式：<br/>
                 *      var sql = SELECT * FROM DUAL WHERE A = #a# AND B in $b$ <br/>
                 *      #a# 转义字符串，$b$非转义字符串<br/>
                 *      SqlUtil.replaceMysqlArgs(sql, {a : 'value of a', b : '(1, 2)'});<br/>
                 *      // 等同于<br/>
                 *      SqlUtil.replaceMysqlArgs(sql, ['value of a', '(1, 2)']);<br/>
                 *      请注意，使用非转义字符串时要注意SQL注入攻击。
                 *
                 * @method replaceMysqlArgs
                 * @param {String} sql SQL语句
                 * @param {Object/Array} arg 参数，为Object类型时，按名称替换，为Array类型时，逐个替换
                 * @static
                 * @since 0.1.0
                 * @author hujiabao
                 * */


                _createClass(SqlUtil, [{
                        key: 'getClassName',
                        value: function getClassName() {
                                return EasyNode.namespace(__filename);
                        }
                }], [{
                        key: 'replaceMysqlArgs',
                        value: function replaceMysqlArgs(sql, arg) {
                                if (typeof sql == 'string') {
                                        if (arg == null) {
                                                return sql;
                                        }
                                        //替换#xxx#和$xxx$
                                        var regEx = /([\$|#]\w*[\$|#])($|\s+|,|'|%|;|\))/;
                                        var s = sql;
                                        var counter = 0;
                                        while (true) {
                                                var arr = regEx.exec(s);
                                                if (!arr || arr.length < 2) {
                                                        break;
                                                } else if (arr.length > 1) {
                                                        var part = S(arr[1]);
                                                        var argType = '';
                                                        if (part.startsWith('#') && part.endsWith('#')) {
                                                                argType = '#';
                                                        } else if (part.startsWith('$') && part.endsWith('$')) {
                                                                argType = '$';
                                                        }
                                                        if (argType.length > 0) {
                                                                part = part.substring(1, part.length - 1);
                                                                var v = "";
                                                                if (util.isArray(arg)) {
                                                                        v = arg[counter++];
                                                                        if (typeof v == 'number' && isNaN(v)) {
                                                                                v = null;
                                                                        }
                                                                } else if (arg) {
                                                                        v = arg[part];
                                                                        if (typeof v == 'number' && isNaN(v)) {
                                                                                v = null;
                                                                        }
                                                                } else {
                                                                        v = '';
                                                                }
                                                                if ((typeof v === 'undefined' ? 'undefined' : _typeof(v)) == 'object' && !util.isDate(v)) {
                                                                        v = JSON.stringify(v);
                                                                }
                                                                var isNumber = typeof v == 'number';
                                                                if (argType == '#' && !isNumber) {
                                                                        s = s.replace(regEx, mysql.escape(v) + arr[2]);
                                                                } else if (argType == '$' || isNumber) {
                                                                        s = s.replace(regEx, v + arr[2]);
                                                                }
                                                        } else {
                                                                throw new Error('SQL template error :' + sql);
                                                        }
                                                }
                                        }
                                        return s;
                                }
                                return '';
                        }

                        /**
                         * 映射对象，将数据库列为照射为驼峰名，例：
                         *
                         * // 示例
                         * <pre>
                         * {
                         *      FIELD_NAME_A : 'a',
                         *      FIELD_B : 1
                         * }
                         * 自动照射的结果为：
                         * {
                         *      fieldNameA : 'a',
                         *      fieldB : 1
                         * }
                         *</pre>
                         *
                         * @method mapEntity
                         * @param {Object} o 对象，通常是数据库的查询结果行
                         * @param {Object} mapper 属性对照表, 为null时自动映射
                         * @static
                         * @since 0.1.0
                         * @author hujiabao
                         * */

                }, {
                        key: 'mapEntity',
                        value: function mapEntity(o, mapper) {
                                var ret = {};
                                if (mapper) {
                                        for (var key in mapper) {
                                                if (typeof mapper[key] == 'string') {
                                                        ret[key] = o[mapper[key]];
                                                }
                                        }
                                        mapper.callback && mapper.callback(ret);
                                } else {
                                        //do autoMap
                                        for (var key in o) {
                                                if (typeof o[key] != 'function') {
                                                        var val = o[key];
                                                        var alias = SqlUtil.alias(key);
                                                        ret[alias] = val;
                                                }
                                        }
                                }
                                return ret;
                        }

                        /**
                         *  获取数据库列的驼峰别名。COLUMN_NAME_A => columnNameA
                         *
                         * @method alias
                         * @param {String} columnName 列名
                         * @static
                         * @since 0.1.0
                         * @author hujiabao
                         * */

                }, {
                        key: 'alias',
                        value: function alias(columnName) {
                                var alias = '';
                                var arr = columnName.split('_');
                                alias += arr[0].toLowerCase();
                                for (var j = 1; j < arr.length; j++) {
                                        var temp = arr[j].toUpperCase().substring(0, 1) + arr[j].toLowerCase().substring(1);
                                        alias += temp;
                                }
                                return alias;
                        }

                        /**
                         *  获取数据库驼峰别的数据库列名。columnNameA => COLUMN_NAME_A。alias函数的反向转换函数。应用中如果
                         *  不是按照_命名规则，可覆盖alias函数和aliasReverse函数。
                         *
                         * @method aliasReverse
                         * @param {String} fieldName 列别名
                         * @static
                         * @since 0.1.0
                         * @author hujiabao
                         * */

                }, {
                        key: 'aliasReverse',
                        value: function aliasReverse(fieldName) {
                                var ret = fieldName[0];
                                for (var i = 1; i < fieldName.length; i++) {
                                        var c = fieldName[i];
                                        if (c.match(/^[A-Z]$/)) {
                                                ret += '_' + c;
                                        } else {
                                                ret += c;
                                        }
                                }
                                return ret.toUpperCase();
                        }

                        /**
                         *  计算结果集页数。
                         *
                         * @method calculatePages
                         * @param {int} rows 结果集行数
                         * @param {Object} paging 分页对象，Notation : {page : 1, rpp : 20}
                         * @static
                         * @since 0.1.0
                         * @author hujiabao
                         * */

                }, {
                        key: 'calculatePages',
                        value: function calculatePages(rows, rpp) {
                                var pages = 0;
                                if (rows > 0) {
                                        if (rows % rpp == 0) {
                                                pages = parseInt(rows / rpp);
                                        } else {
                                                pages = parseInt(rows / rpp) + 1;
                                        }
                                }
                                return pages;
                        }

                        /**
                         *  加密函数
                         *
                         * @method decryptAdv
                         * @param {Buffer||String['binary'|'base64'|'hex']} 原数据
                         * @static
                         * @since 0.1.0
                         * @author hujiabao
                         * */

                }, {
                        key: 'encryptAdv',
                        value: function encryptAdv(data) {
                                var key = 'ABCDE';
                                var iv = 'ABCDE';
                                var clearEncoding = 'utf8';
                                var cipherEncoding = 'base64';
                                var cipherChunks = [];
                                var cipher = crypto.createCipherivAdv('aes-128-cbc', key, iv);
                                cipher.setAutoPadding(true);

                                var enc = cipher.update(data, clearEncoding, cipherEncoding);
                                enc += cipher.final(cipherEncoding);

                                return enc;
                        }

                        /**
                         *  解密函数
                         *
                         * @method decryptAdv
                         * @param {Buffer||String['binary'|'base64'|'hex']} 加密数据
                         * @static
                         * @since 0.1.0
                         * @author hujiabao
                         * */

                }, {
                        key: 'decryptAdv',
                        value: function decryptAdv(data) {
                                var key = 'ABCDE';
                                var iv = 'ABCDE';
                                var clearEncoding = 'binary';
                                var cipherEncoding = 'base64';
                                var decipher = crypto.createDecipherivAdv('aes-128-cbc', key, iv);
                                decipher.setAutoPadding(true);

                                var enc = decipher.update(data, cipherEncoding, clearEncoding);
                                enc += decipher.final(clearEncoding);

                                return enc;
                        }

                        /**
                         *  将分页对象转成Mysql LIMIT子句。
                         *
                         * @method pagingToLimit
                         * @param {Object} paging 分页对象，Notation : {page : 1, rpp : 20}
                         * @static
                         * @since 0.1.0
                         * @author hujiabao
                         * */

                }, {
                        key: 'pagingToLimit',
                        value: function pagingToLimit() {
                                var paging = arguments.length <= 0 || arguments[0] === undefined ? { page: 0, rpp: 0 } : arguments[0];

                                if (paging) {
                                        if (paging.page == 0) {
                                                paging.page = 1;
                                        }
                                        if (paging.rpp == 0) {
                                                paging.rpp = parseInt(EasyNode.config('easynode.framework.mvc.model.defaultRPP', '20'));
                                        }
                                        return 'LIMIT ' + (paging.page - 1) * paging.rpp + ',' + paging.rpp;
                                } else {
                                        return '';
                                }
                        }
                }]);

                return SqlUtil;
        }(GenericObject);

        module.exports = SqlUtil;
})();