'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var ITemplateViewRenderer = using('easynode.framework.mvc.ITemplateViewRenderer');
var mustache = require('mustache');
var MustacheHelper = using('easynode.framework.util.MustacheHelper');

(function () {
        /**
         * Class MustacheTemplateViewRenderer，用于渲染Mustache模板引擎的View。在mustache模板中，内置支持以下格式转换函数：
         * <h5>通过{{#fmt.*}}{{/fmt.*}}使用格式转换函数</h5>
         * <pre>
         *         fmt.fixedx   -       保留x位小数，x = 0(取整), 1, 2, 3, 4, 6
         *         fmt.blank    -       值为null时输出空白字符而不是null字符串
         *         fmt.dash     -       值为null或为空白字符时，输出-(横杠)
         *         fmt.date     -        转成日期型, YYYY-MM-DD
         *         fmt.datetime -       转成日期时间型, 精确到分，YYYY-MM-DD HH24:MI
         *         fmt.datetimeS -      转成日期时间型，精确到秒，YYYY-MM-DD HH24:MI:SS
         *         fmt.currency -       转成货币格式：123,456,789.00   保留两位小数
         *         fmt.currency4 -      转成货币格式：123,456,789.0000 保留４位小数
         *         fmt.blockSize -       数据块大小，自动根据大小换算单位(TB，GB, MB, KB)，保留１位小数。
         *         fmt.state        -       转换状态码为状态文字，例：{{#fmt.state}}{{xxx.state}};0:失败;1:成功;{{/fmt.state}}
         *         fmt.XSSless    -        去文字中的脚本，防止XSS注入
         *         fmt.when       -        支持条件判断，例：{{#fmt.when}}{{var}}==1,xxxxxxxx{{/fmt.when}}，
         *                                     支持的运算符：==、>=、<=、>、<、!=、=>(或，{{var}}=>1||2||3，表示var == 1或var == 2或var==3)
         * </pre>
         *
         * @class easynode.framework.mvc.MustacheTemplateViewRenderer
         * @extends easynode.framework.mvc.ITemplateViewRenderer
         * @since 0.1.0
         * @author hujiabao
         * */

        var MustacheTemplateViewRenderer = (function (_ITemplateViewRendere) {
                _inherits(MustacheTemplateViewRenderer, _ITemplateViewRendere);

                /**
                 * 构造函数。
                 *
                 * @method 构造函数
                 * @since 0.1.0
                 * @author hujiabao
                 * */

                function MustacheTemplateViewRenderer() {
                        _classCallCheck(this, MustacheTemplateViewRenderer);

                        return _possibleConstructorReturn(this, Object.getPrototypeOf(MustacheTemplateViewRenderer).call(this));
                        //调用super()后再定义子类成员。
                }

                _createClass(MustacheTemplateViewRenderer, [{
                        key: 'render',
                        value: function render(actionResult, template) {
                                mustache.parse(template);
                                var o = actionResult.toJSON();
                                this._injectHelperFunctions(o);
                                return mustache.render(template, o);
                        }
                }, {
                        key: '_injectHelperFunctions',
                        value: function _injectHelperFunctions(o) {
                                MustacheHelper.normalize(o);
                        }
                }, {
                        key: 'getClassName',
                        value: function getClassName() {
                                return EasyNode.namespace(__filename);
                        }
                }]);

                return MustacheTemplateViewRenderer;
        })(ITemplateViewRenderer);

        module.exports = MustacheTemplateViewRenderer;
})();