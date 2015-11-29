'use strict';

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
         *  抽象类，定义了获取Action参数的函数 。
         *
         * @class easynode.framework.mvc.ActionRequestParameter
         * @extends easynode.GenericObject
         * @abstract
         * @since 0.1.0
         * @author hujiabao
         * */

        var ActionRequestParameter = (function (_GenericObject) {
                _inherits(ActionRequestParameter, _GenericObject);

                /**
                 * 构造函数。
                 *
                 * @method 构造函数
                 * @since 0.1.0
                 * @author hujiabao
                 * */

                function ActionRequestParameter() {
                        _classCallCheck(this, ActionRequestParameter);

                        return _possibleConstructorReturn(this, Object.getPrototypeOf(ActionRequestParameter).call(this));
                }

                /**
                 * 获取HTTP请求参数。注意：EasyNode使用'first'模式取query string参数，参数名相同时，先出现的值有效。
                 *
                 * @method param
                 * @param {String} name 参数名
                 * @param {String} where 从哪里取参数，枚举，可以为"query"(query string)，"body“(http body, POST时有效)，
                 *      "all"(body或query,body优先)，默认”all“
                 * @return {String} 参数值
                 * @abstract
                 * @since 0.1.0
                 * @author hujiabao
                 * */

                _createClass(ActionRequestParameter, [{
                        key: 'param',
                        value: function param(name) {
                                var where = arguments.length <= 1 || arguments[1] === undefined ? 'all' : arguments[1];
                                var canNull = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

                                throw new Error('Abstract Method');
                        }

                        /**
                         * 是否传递了某个请求参数。
                         *
                         * @method hasParam
                         * @param {String} name 参数名
                         * @param {String} where 从哪里取参数，枚举，可以为"query"(query string)，"body“(http body, POST时有效)，
                         *      "all"(body或query,body优先)，默认”all“
                         * @return {boolean} 是否有此参数
                         * @abstract
                         * @since 0.1.0
                         * @author hujiabao
                         * */

                }, {
                        key: 'hasParam',
                        value: function hasParam(name) {
                                var where = arguments.length <= 1 || arguments[1] === undefined ? 'all' : arguments[1];

                                throw new Error('Abstract Method');
                        }

                        /**
                         * 获取HTTP请求参数名称。
                         *
                         * @method paramNames
                         * @param {String} where 从哪里取参数名，枚举，可以为"query"(query string)，"body“(http body, POST时有效)，
                         *      "all"(body或query,body优先)，默认”all“
                         * @return {Array} 参数名
                         * @abstract
                         * @since 0.1.0
                         * @author hujiabao
                         * */

                }, {
                        key: 'paramNames',
                        value: function paramNames() {
                                var where = arguments.length <= 0 || arguments[0] === undefined ? 'all' : arguments[0];

                                throw new Error('Abstract Method');
                        }

                        /**
                         * 获取上传的文件描述，POST且enctype="multipart-form-data"时有效。没有指定参数名的文件时，返回null。
                         *
                         * @method file
                         * @param {String} name 参数名（字段名）
                         * @return {object} 上传的文件描述。结构如下：
                         *                              {
                         *                                      field : 'file1',
                                                                 name : 'xx.jpg',
                                                                 mime : 'image/jpeg',
                                                                 path : '/tmp/adksl1234j123/xx.jpg'
                         *                              }
                         * @since 0.1.0
                         * @author hujiabao
                         * */

                }, {
                        key: 'file',
                        value: function file(name) {
                                throw new Error('Abstract Method');
                        }

                        /**
                         * 保存文件到上传目录。
                         *
                         * @method saveFile
                         * @param {String} name 参数名（字段名）
                         * @return {object} 上传的文件描述。结构参考：file()函数。
                         * @async
                         * @since 0.1.0
                         * @author hujiabao
                         * */

                }, {
                        key: 'saveFile',
                        value: function saveFile(name) {
                                throw new Error('Abstract Method');
                        }

                        /**
                         * 枚举所有上传的文件参数名（字段名）。
                         *
                         * @method fileNames
                         * @param {String} name 参数名（字段名）
                         * @return {Array} 上传的所有文件参数名（字段名）
                         * @abstract
                         * @since 0.1.0
                         * @author hujiabao
                         * */

                }, {
                        key: 'fileNames',
                        value: function fileNames() {
                                throw new Error('Abstract Method');
                        }

                        /**
                         * 获取HTTP参数值，转成Number的整型。
                         *
                         * @method intParam
                         * @param {String} name 参数名
                         * @param {String} where query, body or both of two with 'all'
                         * @param {boolean} canNaN 是否允许NaN，如果是false, 当值为NaN时将被转成0
                         * @return {int}
                         * @since 0.1.0
                         * @author hujiabao
                         * */

                }, {
                        key: 'intParam',
                        value: function intParam(name) {
                                var where = arguments.length <= 1 || arguments[1] === undefined ? 'all' : arguments[1];
                                var canNaN = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

                                var val = parseInt(this.param(name, where));
                                if (canNaN !== true && isNaN(val)) {
                                        return 0;
                                } else {
                                        return val;
                                }
                        }

                        /**
                         * 获取HTTP参数值，转成Number的整型。
                         *
                         * @method floatParam
                         * @param {String} name 参数名
                         * @param {String} where query, body or both of two with 'all'
                         * @param {boolean} canNaN 是否允许NaN，如果是false, 当值为NaN时将被转成0
                         * @return {float}
                         * @since 0.1.0
                         * @author hujiabao
                         * */

                }, {
                        key: 'floatParam',
                        value: function floatParam(name) {
                                var where = arguments.length <= 1 || arguments[1] === undefined ? 'all' : arguments[1];
                                var canNaN = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

                                var val = parseFloat(this.param(name, where));
                                if (canNaN !== true && isNaN(val)) {
                                        return 0;
                                }
                                return val;
                        }

                        /**
                         * 获取HTTP参数值，转成boolean型。
                         *
                         * @method booleanParam
                         * @param {String} name 参数名
                         * @param {String} where query, body or both of two with 'all'
                         * @return {boolean}
                         * @since 0.1.0
                         * @author hujiabao
                         * */

                }, {
                        key: 'booleanParam',
                        value: function booleanParam(name) {
                                var where = arguments.length <= 1 || arguments[1] === undefined ? 'all' : arguments[1];

                                var v = this.param(name, where);
                                return v == null || v == 'null' || v == 'false' || v == 'FALSE' || v == 'False' || v === '0' || v == 0 ? false : true;
                        }

                        /**
                         * 获取HTTP参数值，转成数组型。
                         *
                         * @method booleanParam
                         * @param {String} name 参数名
                         * @param {String} type 数组中的元素实际类型，支持string, int, float, boolean, date, datetime, datetimeM
                         * @param {String} where query, body or both of two with 'all'
                         * @return {boolean}
                         * @since 0.1.0
                         * @author hujiabao
                         * */

                }, {
                        key: 'arrayParam',
                        value: function arrayParam(name) {
                                var type = arguments.length <= 1 || arguments[1] === undefined ? 'string' : arguments[1];
                                var where = arguments.length <= 2 || arguments[2] === undefined ? 'all' : arguments[2];
                                var delimiter = arguments.length <= 3 || arguments[3] === undefined ? ',' : arguments[3];

                                var val = this.param(name, where);
                                if (val) {
                                        val = val.split(delimiter);
                                        if (type != 'string') {
                                                var idx = 0;
                                                val.forEach(function (v) {
                                                        var rv = v;
                                                        switch (type) {
                                                                case 'int':
                                                                        {
                                                                                rv = parseInt(v);
                                                                                break;
                                                                        }
                                                                case 'float':
                                                                        {
                                                                                rv = parseFloat(v);
                                                                                break;
                                                                        }
                                                                case 'boolean':
                                                                        {
                                                                                rv = v == null || v == 'null' || v == 'false' || v == 'FALSE' || v == 'False' || v === '0' || v == 0 ? false : true;
                                                                                break;
                                                                        }
                                                                case 'date':
                                                                        {
                                                                                v = v || '';
                                                                                //if(v.match(/^\d{4}\-\d{2}\-\d{2}.*$/)) {
                                                                                //        v = v.substring(0, 10) + ' 00:00:00';
                                                                                //        rv = new Date(Date.parse(v));
                                                                                //}
                                                                                //else {
                                                                                //        rv = null;
                                                                                //}
                                                                                if (!v) {
                                                                                        rv = null;
                                                                                } else {
                                                                                        rv = new Date(Date.parse(v));
                                                                                }
                                                                                break;
                                                                        }
                                                                case 'datetimeM':
                                                                        {
                                                                                v = v || '';
                                                                                //if(v.match(/^\d{4}\-\d{2}\-\d{2}\s\d{2}:\d{2}.*$/)) {
                                                                                //        v = v.substring(0, 16) + ':00';
                                                                                //        rv = new Date(Date.parse(v));
                                                                                //}
                                                                                //else {
                                                                                //        rv = null;
                                                                                //}
                                                                                if (!v) {
                                                                                        rv = null;
                                                                                } else {
                                                                                        rv = new Date(Date.parse(v));
                                                                                }
                                                                                break;
                                                                        }
                                                                case 'datetime':
                                                                        {
                                                                                //if(v.match(/^\d{4}\-\d{2}\-\d{2}\s\d{2}:\d{2}:\d{2}$/)) {
                                                                                //        v = v.substring(0, 16) + ':00';
                                                                                //        rv = new Date(Date.parse(v));
                                                                                //}
                                                                                //else {
                                                                                //        rv = null;
                                                                                //}
                                                                                if (!v) {
                                                                                        rv = null;
                                                                                } else {
                                                                                        rv = new Date(Date.parse(v));
                                                                                }
                                                                                break;
                                                                        }
                                                        }
                                                        val[idx++] = rv;
                                                });
                                        }
                                }
                                return val;
                        }

                        /**
                         * 获取HTTP参数值，转成日期型。日期格式需要是：YYYY-MM-DD HH24:MI:SS, 例：2015-05-13 12:00:00，可只传日期部分。
                         * 日期格式请参考：date-utils模块。
                         *
                         * @method dateParam
                         * @param {String} name 参数名
                         * @param {String} where query, body or both of two with 'all'
                         * @return {Date} 格式错误时返回null。
                         * @since 0.1.0
                         * @author hujiabao
                         * */

                }, {
                        key: 'dateParam',
                        value: function dateParam(name) {
                                var where = arguments.length <= 1 || arguments[1] === undefined ? 'all' : arguments[1];

                                var val = this.param(name, where);
                                if (!val) {
                                        return null;
                                }
                                //val = val || '';
                                //if(val.match(/^\d{4}\-\d{2}\-\d{2}$/)) {
                                //        val = val + ' 00:00:00';
                                //}
                                //else if(val.match(/^\d{4}\-\d{2}\-\d{2}\s\d{2}:\d{2}:?\d{0,2}$/)) {
                                //        val = val.substring(0, 10) + ' 00:00:00';
                                //}
                                //else {
                                //        return null;
                                //}
                                //return new Date(Date.parse(val));
                                return new Date(Date.parse(val));
                        }

                        /**
                         * 获取HTTP参数值，转成日期时间型(精确到秒)。日期格式需要是：YYYY-MM-DD HH24:MI:SS, 例：2015-05-13 12:00:00，可只传日期部分。
                         * 日期格式请参考：date-utils模块。
                         *
                         * @method datetimeParam
                         * @param {String} name 参数名
                         * @param {String} where query, body or both of two with 'all'
                         * @return {Date} 格式错误时返回null。
                         * @since 0.1.0
                         * @author hujiabao
                         * */

                }, {
                        key: 'datetimeParam',
                        value: function datetimeParam(name) {
                                var where = arguments.length <= 1 || arguments[1] === undefined ? 'all' : arguments[1];

                                var val = this.param(name, where);
                                if (!val) {
                                        return null;
                                }
                                //val = val || '';
                                //if(val.match(/^\d{4}\-\d{2}\-\d{2}$/)) {
                                //        val = val + ' 00:00:00';
                                //}
                                //else if(val.match(/^\d{4}\-\d{2}\-\d{2}\s\d{2}:\d{2}:\d{2}$/)) {
                                //        return new Date(Date.parse(val));
                                //}
                                //else {
                                //        return null;
                                //}
                                return new Date(Date.parse(val));
                        }

                        /**
                         * 获取HTTP参数值，转成日期时间型(精确到分钟)。日期格式需要是：YYYY-MM-DD HH24:MI:SS, 例：2015-05-13 12:00:00，可只传日期部分。
                         * 日期格式请参考：date-utils模块。
                         *
                         * @method datetimeMParam
                         * @param {String} name 参数名
                         * @param {String} where query, body or both of two with 'all'
                         * @return {Date} 格式错误时返回null。
                         * @since 0.1.0
                         * @author hujiabao
                         * */

                }, {
                        key: 'datetimeMParam',
                        value: function datetimeMParam(name) {
                                var where = arguments.length <= 1 || arguments[1] === undefined ? 'all' : arguments[1];

                                var val = this.param(name, where);
                                if (!val) {
                                        return null;
                                }
                                //val = val || '';
                                //if(val.match(/^\d{4}\-\d{2}\-\d{2}$/)) {
                                //        val = val + ' 00:00:00';
                                //}
                                //else if(val.match(/^\d{4}\-\d{2}\-\d{2}\s\d{2}:\d{2}$/)) {
                                //        val = val + ':00';
                                //}
                                //else if(val.match(/^\d{4}\-\d{2}\-\d{2}\s\d{2}:\d{2}:\d{2}$/)) {
                                //        val = val.substring(0, 16) + ':00';
                                //}
                                //else {
                                //        return null;
                                //}
                                //return new Date(Date.parse(val));
                                return new Date(Date.parse(val));
                        }

                        /**
                         * 保存指定的文件，获取HTTP参数值，转成文件对象，语义化函数，同saveFile()函数。
                         *
                         * @method fileParam
                         * @param {String} name 参数名
                         * @return {Object} Notation参考file函数。
                         * @since 0.1.0
                         * @author hujiabao
                         * */

                }, {
                        key: 'fileParam',
                        value: function fileParam(name) {
                                return this.saveFile(name);
                        }
                }, {
                        key: 'getClassName',
                        value: function getClassName() {
                                return EasyNode.namespace(__filename);
                        }
                }]);

                return ActionRequestParameter;
        })(GenericObject);

        module.exports = ActionRequestParameter;
})();