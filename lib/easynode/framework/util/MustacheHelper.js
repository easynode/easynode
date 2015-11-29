'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var GenericObject = using('easynode.GenericObject');
var mustache = require('mustache');
var fs = require('co-fs');

(function () {
        /**
         * Class MustacheHelper
         *
         * @class easynode.framework.util.MustacheHelper
         * @extends easynode.GenericObject
         * @since 0.1.0
         * @author hujiabao
         * */

        var MustacheHelper = (function (_GenericObject) {
                _inherits(MustacheHelper, _GenericObject);

                /**
                 * 构造函数。
                 *
                 * @method 构造函数
                 * @since 0.1.0
                 * @author hujiabao
                 * */

                function MustacheHelper() {
                        _classCallCheck(this, MustacheHelper);

                        return _possibleConstructorReturn(this, Object.getPrototypeOf(MustacheHelper).call(this));
                        //调用super()后再定义子类成员。
                }

                /**
                 * 标准化Mustache render对象。
                 *
                 * @method normalize
                 * @param {Object} o 准备渲染的对象。
                 * @static
                 * @since 0.1.0
                 * @author hujiabao
                 * */

                _createClass(MustacheHelper, [{
                        key: 'getClassName',
                        value: function getClassName() {
                                return EasyNode.namespace(__filename);
                        }
                }], [{
                        key: 'normalize',
                        value: function normalize(o) {
                                var attr = 'fmt';
                                if (o.fmt !== undefined) {
                                        attr = '_fmt_';
                                }
                                o[attr] = {
                                        //**************保留x位小数****************
                                        fixed0: function fixed0() {
                                                return function (text, render) {
                                                        var val = render(text);
                                                        var n = parseFloat(val);
                                                        if (isNaN(n)) {
                                                                n = 0;
                                                        }
                                                        return n.toFixed(0);
                                                };
                                        },

                                        fixed1: function fixed1() {
                                                return function (text, render) {
                                                        var val = render(text);
                                                        var n = parseFloat(val);
                                                        if (isNaN(n)) {
                                                                n = 0;
                                                        }
                                                        return n.toFixed(1);
                                                };
                                        },
                                        fixed2: function fixed2() {
                                                return function (text, render) {
                                                        var val = render(text);
                                                        var n = parseFloat(val);
                                                        if (isNaN(n)) {
                                                                n = 0;
                                                        }
                                                        return n.toFixed(2);
                                                };
                                        },
                                        fixed3: function fixed3() {
                                                return function (text, render) {
                                                        var val = render(text);
                                                        var n = parseFloat(val);
                                                        if (isNaN(n)) {
                                                                n = 0;
                                                        }
                                                        return n.toFixed(3);
                                                };
                                        },
                                        fixed4: function fixed4() {
                                                return function (text, render) {
                                                        var val = render(text);
                                                        var n = parseFloat(val);
                                                        if (isNaN(n)) {
                                                                n = 0;
                                                        }
                                                        return n.toFixed(4);
                                                };
                                        },
                                        fixed6: function fixed6() {
                                                return function (text, render) {
                                                        var val = render(text);
                                                        var n = parseFloat(val);
                                                        if (isNaN(n)) {
                                                                n = 0;
                                                        }
                                                        return n.toFixed(6);
                                                };
                                        },
                                        //**************保留x位小数结束****************

                                        //**************当null时不输出空白****************
                                        blank: function blank() {
                                                return function (text, render) {
                                                        var val = render(text);
                                                        if (val == null || val == '') {
                                                                return ' ';
                                                        } else {
                                                                return val;
                                                        }
                                                };
                                        },

                                        dash: function dash() {
                                                return function (text, render) {
                                                        var val = render(text);
                                                        if (val == null || val == '') {
                                                                return '<strong>--</strong>';
                                                        } else {
                                                                return val;
                                                        }
                                                };
                                        },
                                        //**************当null时不输出空白结束****************

                                        //**************日期转换****************
                                        date: function date() {
                                                return function (text, render) {
                                                        var val = render(text);
                                                        var d = new Date(val);
                                                        return d.toFormat('YYYY-MM-DD'); //仅日期
                                                };
                                        },

                                        datetime: function datetime() {
                                                return function (text, render) {
                                                        var val = render(text);
                                                        var d = new Date(val);
                                                        return d.toFormat('YYYY-MM-DD HH24:MI'); //带时分
                                                };
                                        },

                                        datetimeS: function datetimeS() {
                                                return function (text, render) {
                                                        var val = render(text);
                                                        var d = new Date(val);
                                                        return d.toFormat('YYYY-MM-DD HH24:MI:SS'); //带时分秒
                                                };
                                        },
                                        //**************日期转换结束****************

                                        //**************货币格式转换****************
                                        currency: function currency() {
                                                function _convert(decimalNum, fixed, bolCommas) {
                                                        if (arguments.length == 1) {
                                                                fixed = 2;
                                                                bolCommas = true;
                                                        } else if (arguments.length == 2) {
                                                                if (typeof fixed == 'boolean') {
                                                                        bolCommas = fixed;
                                                                        fixed = 2;
                                                                } else {
                                                                        bolCommas = true;
                                                                }
                                                        }
                                                        var isSign = decimalNum < 0 ? true : false;
                                                        var tmpNumStr = '' + Math.abs(decimalNum).toFixed(fixed);
                                                        if (bolCommas && (decimalNum >= 1000 || decimalNum <= -1000)) {
                                                                var iStart = tmpNumStr.indexOf(".");
                                                                if (iStart < 0) iStart = tmpNumStr.length;
                                                                iStart -= 3;
                                                                while (iStart >= 1) {
                                                                        tmpNumStr = tmpNumStr.substring(0, iStart) + "," + tmpNumStr.substring(iStart, tmpNumStr.length);
                                                                        iStart -= 3;
                                                                }
                                                        }
                                                        if (isSign) {
                                                                tmpNumStr = '-' + tmpNumStr;
                                                        }
                                                        return tmpNumStr; // Return our formatted string!
                                                }
                                                return function (text, render) {
                                                        var val = parseFloat(render(text));
                                                        if (isNaN(val)) {
                                                                val = 0;
                                                        }
                                                        return _convert(val);
                                                };
                                        },

                                        currency4: function currency4() {
                                                function _convert(decimalNum, fixed, bolCommas) {
                                                        if (arguments.length == 1) {
                                                                fixed = 2;
                                                                bolCommas = true;
                                                        } else if (arguments.length == 2) {
                                                                if (typeof fixed == 'boolean') {
                                                                        bolCommas = fixed;
                                                                        fixed = 2;
                                                                } else {
                                                                        bolCommas = true;
                                                                }
                                                        }
                                                        var isSign = decimalNum < 0 ? true : false;
                                                        var tmpNumStr = '' + Math.abs(decimalNum).toFixed(fixed);
                                                        if (bolCommas && (decimalNum >= 1000 || decimalNum <= -1000)) {
                                                                var iStart = tmpNumStr.indexOf(".");
                                                                if (iStart < 0) iStart = tmpNumStr.length;
                                                                iStart -= 3;
                                                                while (iStart >= 1) {
                                                                        tmpNumStr = tmpNumStr.substring(0, iStart) + "," + tmpNumStr.substring(iStart, tmpNumStr.length);
                                                                        iStart -= 3;
                                                                }
                                                        }
                                                        if (isSign) {
                                                                tmpNumStr = '-' + tmpNumStr;
                                                        }
                                                        return tmpNumStr; // Return our formatted string!
                                                }
                                                return function (text, render) {
                                                        var val = parseFloat(render(text));
                                                        if (isNaN(val)) {
                                                                val = 0;
                                                        }
                                                        return _convert(val, 4);
                                                };
                                        },
                                        //**************货币格式转换结束****************

                                        //**************数据块大小转换****************
                                        blockSize: function blockSize() {
                                                return function (text, render) {
                                                        var size = render(text);
                                                        size = parseInt(size);
                                                        size = isNaN(size) ? 0 : size;
                                                        if (size >= 1024 * 1024 * 1024 * 1024) {
                                                                size = parseFloat(size / 1024 / 1024 / 1024 / 1024).toFixed(1) + 'TB';
                                                        } else if (size >= 1024 * 1024 * 1024) {
                                                                size = parseFloat(size / 1024 / 1024 / 1024).toFixed(1) + 'GB';
                                                        } else if (size >= 1024 * 1024) {
                                                                size = parseFloat(size / 1024 / 1024).toFixed(1) + 'MB';
                                                        } else if (size >= 1024) {
                                                                size = parseFloat(size / 1024).toFixed(1) + 'KB';
                                                        }
                                                        return size;
                                                };
                                        },
                                        //**************数据块大小转换****************

                                        //**************状态文字转换****************
                                        state: function state() {
                                                return function (text, render) {
                                                        var stateStr = render(text); //状态格式$实际状态码;$状态码:$状态文字;$状态码:$状态文字;...
                                                        var arr = stateStr.split(';');
                                                        var code = arr[0];
                                                        var txt = code;
                                                        for (var i = 1; i < arr.length; i++) {
                                                                var tmp = arr[i].split(':');
                                                                if (code == tmp[0]) {
                                                                        txt = tmp[1] || '未定义状态文字(' + tmp[0] + ')';
                                                                }
                                                        }
                                                        return txt;
                                                };
                                        },
                                        //**************状态文字转换****************

                                        //**************处理XSS注入攻击****************
                                        //TODO 有这个意思，正则要细化
                                        XSSless: function XSSless() {
                                                return function (text, render) {
                                                        var s = render(text); //状态格式$实际状态码;$状态码:$状态文字;$状态码:$状态文字;...
                                                        s = s.replaceAll(/<script>.*<\/script>/gim, '');
                                                        return s;
                                                };
                                        },
                                        //**************处理XSS注入攻击结束****************

                                        //**************条件式处理****************
                                        when: function when() {
                                                return function (text, render) {
                                                        var stateStr = render(text); //{{#fmt.when}}{{var}}==1,xxxxxxxx{{/fmt.when}}
                                                        var idx = stateStr.indexOf(',');
                                                        var cExp = stateStr.substring(0, idx).trim();
                                                        var txt = stateStr.substring(idx + 1).trim();
                                                        var cp1 = '';
                                                        var cp2 = '';
                                                        var result = false;
                                                        if (cExp.indexOf('==') > 0) {
                                                                cp1 = cExp.split('==')[0].trim();
                                                                cp2 = cExp.split('==')[1].trim();
                                                                result = cp1 == cp2;
                                                        } else if (cExp.indexOf('>=') > 0) {
                                                                cp1 = cExp.split('>=')[0].trim();
                                                                cp2 = cExp.split('>=')[1].trim();
                                                                result = cp1 >= cp2;
                                                        } else if (cExp.indexOf('<=') > 0) {
                                                                cp1 = cExp.split('<=')[0].trim();
                                                                cp2 = cExp.split('<=')[1].trim();
                                                                result = cp1 <= cp2;
                                                        } else if (cExp.indexOf('!=') > 0) {
                                                                cp1 = cExp.split('!=')[0].trim();
                                                                cp2 = cExp.split('!=')[1].trim();
                                                                result = cp1 != cp2;
                                                        } else if (cExp.indexOf('=>') > 0) {
                                                                //xx=>1||2||3||4||5 means xx==1 or xx==2 or x==3....
                                                                cp1 = cExp.split('=>')[0].trim();
                                                                cp2 = cExp.split('=>')[1].trim();
                                                                cp2 = cp2.split('||');
                                                                for (var i = 0; i < cp2.length; i++) {
                                                                        var temp = cp2[i].trim();
                                                                        if (cp1 == temp) {
                                                                                result = true;
                                                                                break;
                                                                        }
                                                                }
                                                        } else if (cExp.indexOf('>') > 0) {
                                                                cp1 = cExp.split('>')[0].trim();
                                                                cp2 = cExp.split('>')[1].trim();
                                                                result = cp1 > cp2;
                                                        } else if (cExp.indexOf('<') > 0) {
                                                                cp1 = cExp.split('<')[0].trim();
                                                                cp2 = cExp.split('<')[1].trim();
                                                                result = cp1 < cp2;
                                                        }
                                                        if (result) {
                                                                return txt;
                                                        } else {
                                                                return '';
                                                        }
                                                };
                                        }
                                        //**************条件式处理转换****************
                                };
                        }

                        /**
                         * 渲染Mustache模板
                         *
                         * @method render
                         * @param {String} template 模板String
                         * @param {Object} o 准备渲染的对象。
                         * @return {String} 渲染结果
                         * @static
                         * @since 0.1.0
                         * @author hujiabao
                         * */

                }, {
                        key: 'render',
                        value: function render(template, o) {
                                MustacheHelper.normalize(o);
                                return mustache.render(template, o);
                        }

                        /**
                         * 渲染Mustache模板
                         *
                         * @method renderFile
                         * @param {String} file 文件路径
                         * @param {Object} o 准备渲染的对象。
                         * @return {String} 渲染结果
                         * @static
                         * @async
                         * @since 0.1.0
                         * @author hujiabao
                         * */

                }, {
                        key: 'renderFile',
                        value: function renderFile(file, o) {
                                return regeneratorRuntime.mark(function _callee() {
                                        var template;
                                        return regeneratorRuntime.wrap(function _callee$(_context) {
                                                while (1) {
                                                        switch (_context.prev = _context.next) {
                                                                case 0:
                                                                        _context.next = 2;
                                                                        return fs.readFile(file);

                                                                case 2:
                                                                        template = _context.sent;

                                                                        template = template.toString();
                                                                        MustacheHelper.normalize(o);
                                                                        return _context.abrupt('return', mustache.render(template, o));

                                                                case 6:
                                                                case 'end':
                                                                        return _context.stop();
                                                        }
                                                }
                                        }, _callee, this);
                                });
                        }
                }]);

                return MustacheHelper;
        })(GenericObject);

        module.exports = MustacheHelper;
})();