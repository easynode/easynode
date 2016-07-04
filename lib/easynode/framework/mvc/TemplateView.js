'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var GenericObject = using('easynode.GenericObject');
var View = using('easynode.framework.mvc.View');
var MustacheTemplateViewRenderer = using('easynode.framework.mvc.MustacheTemplateViewRenderer');
var EJSTemplateViewRenderer = using('easynode.framework.mvc.EJSTemplateViewRenderer');
var path = require('path');
var fs = require('fs');
var S = require('string');
var _ = require('underscore');

(function () {
        var EASYNODE_VIEW_DIR = EasyNode.config('easynode.framework.mvc.view.dir', 'views/');
        var DEFAULT_ENGINE = EasyNode.config('easynode.framework.mvc.view.template.defaultEngine', 'mustache');
        var ENABLE_TEMPLATE_CACHE = S(EasyNode.config('easynode.framework.mvc.view.template.enableCache', 'false')).toBoolean();

        var _cachedTpl = {};

        /**
         * Class TemplateView
         *
         * @class easynode.framework.view.TemplateView
         * @extends easynode.framework.mvc.View
         * @since 0.1.0
         * @author hujiabao
         * */

        var TemplateView = function (_View) {
                _inherits(TemplateView, _View);

                /**
                 * 构造函数。
                 *
                 * @method 构造函数
                 * @param {String} tplFile 模板文件，默认为空，可在渲染时通过参数opt指定。
                 * @param {String} engine 模板引擎，枚举TemplateView.ENGINE_EJS/TemplateView.ENGINE_MUSTACHE
                 * @param {String} dir 模板目录
                 * @since 0.1.0
                 * @author hujiabao
                 * */

                function TemplateView() {
                        var tplFile = arguments.length <= 0 || arguments[0] === undefined ? "" : arguments[0];
                        var engine = arguments.length <= 1 || arguments[1] === undefined ? DEFAULT_ENGINE : arguments[1];
                        var dir = arguments.length <= 2 || arguments[2] === undefined ? EASYNODE_VIEW_DIR : arguments[2];

                        _classCallCheck(this, TemplateView);

                        //调用super()后再定义子类成员。

                        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(TemplateView).call(this));

                        dir = dir || EASYNODE_VIEW_DIR;
                        _this.tplFile = tplFile;
                        engine = _this.getEngine(tplFile);
                        _this.engine = engine;
                        _this.dir = dir;
                        return _this;
                }

                _createClass(TemplateView, [{
                        key: 'getEngine',
                        value: function getEngine(tplFile) {
                                var engine = DEFAULT_ENGINE;
                                if (this.tplFile.match(/\.ejs$/)) {
                                        engine = TemplateView.ENGINE_EJS;
                                } else if (this.tplFile.match(/\.mst$/)) {
                                        engine = TemplateView.ENGINE_MUSTACHE;
                                } else if (this.tplFile.match(/\.jade$/)) {
                                        engine = TemplateView.ENGINE_MUSTACHE;
                                }
                                return engine;
                        }
                }, {
                        key: 'getContentType',
                        value: function getContentType() {
                                return 'html';
                        }
                }, {
                        key: 'render',
                        value: function render(actionResult) {
                                var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

                                var tpl = opts.tplFile || this.tplFile;
                                var engine = opts.engine || this.engine;
                                var oEngine = engine;
                                this.engine = engine = this.getEngine(tpl);
                                assert(tpl && typeof tpl == 'string', 'Invalid template file name');
                                var tplContent = _cachedTpl[tpl];
                                if (!tplContent) {
                                        var realTplFile = tpl;
                                        if (this.dir) {
                                                realTplFile = path.join(EasyNode.real(this.dir), tpl);
                                        }
                                        if (!fs.existsSync(realTplFile)) {
                                                throw new Error('Can not find template file [' + realTplFile + ']');
                                        }
                                        tplContent = fs.readFileSync(realTplFile).toString();
                                        if (ENABLE_TEMPLATE_CACHE) {
                                                _cachedTpl[tpl] = tplContent;
                                        }
                                }
                                switch (engine) {
                                        case TemplateView.ENGINE_MUSTACHE:
                                                {
                                                        return this._renderMustache(actionResult, tplContent);
                                                }
                                        case TemplateView.ENGINE_EJS:
                                                {
                                                        return this._renderEJS(actionResult, tplContent);
                                                }
                                        case TemplateView.ENGINE_JADE:
                                                {
                                                        return this._renderJade(actionResult, tplContent);
                                                }
                                        default:
                                                {
                                                        assert(opt && opt.renderer, 'Engine [' + oEngine + '] is not supported by default, need a renderer to render ActionResult');
                                                        return this._render(actionResult, tplContent, opt.renderer);
                                                }
                                }
                        }
                }, {
                        key: '_renderMustache',
                        value: function _renderMustache(actionResult, tplContent) {
                                return new MustacheTemplateViewRenderer().render(actionResult, tplContent);
                        }
                }, {
                        key: '_renderEJS',
                        value: function _renderEJS(actionResult, tplContent) {
                                return new EJSTemplateViewRenderer().render(actionResult, tplContent);
                        }
                }, {
                        key: '_renderJade',
                        value: function _renderJade(actionResult, tplContent) {
                                return new JadeTemplateViewRenderer().render(actionResult, tplContent);
                        }
                }, {
                        key: '_render',
                        value: function _render(actionResult, tplContent, renderer) {
                                if (typeof renderer == 'string') {
                                        var Renderer = using(renderer);
                                        renderer = new Renderer();
                                }
                                return renderer.render(actionResult, tplContent);
                        }
                }, {
                        key: 'getClassName',
                        value: function getClassName() {
                                return EasyNode.namespace(__filename);
                        }
                }]);

                return TemplateView;
        }(View);

        /**
         *  mustache模板引擎，适配模板文件后缀.mst
         *
         *  @property ENGINE_MUSTACHE
         *  @type {String}
         *  @default mustache
         *  @static
         *  @since 0.1.0
         *  @author hujiabao
         * */


        TemplateView.ENGINE_MUSTACHE = 'mustache';

        /**
         *  ejs模板引擎，适配模板文件后缀.ejs
         *
         *  @property ENGINE_EJS
         *  @type {String}
         *  @default ejs
         *  @static
         *  @since 0.1.0
         *  @author hujiabao
         * */
        TemplateView.ENGINE_EJS = 'ejs';

        /**
         *  jade模板引擎，适配模板文件后缀.jade
         *
         *  @property ENGINE_JADE
         *  @type {String}
         *  @default jade
         *  @static
         *  @since 0.1.0
         *  @author hujiabao
         * */
        TemplateView.ENGINE_JADE = 'jade';

        module.exports = TemplateView;
})();