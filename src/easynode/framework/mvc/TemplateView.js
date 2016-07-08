var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var GenericObject = using('easynode.GenericObject');
var View = using('easynode.framework.mvc.View');
var SwigTemplateViewRenderer = using('easynode.framework.mvc.SwigTemplateViewRenderer');
var MustacheTemplateViewRenderer = using('easynode.framework.mvc.MustacheTemplateViewRenderer');
var EJSTemplateViewRenderer = using('easynode.framework.mvc.EJSTemplateViewRenderer');
var JadeTemplateViewRenderer = using('easynode.framework.mvc.JadeTemplateViewRenderer');
var path = require('path');
var fs = require('fs');
var S = require('string');
var _ = require('underscore');


(function() {
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
  class TemplateView extends View {

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
    constructor(tplFile = '', engine = DEFAULT_ENGINE, dir = EASYNODE_VIEW_DIR) {
      super();
                        // 调用super()后再定义子类成员。
      dir = dir || EASYNODE_VIEW_DIR;
      this.tplFile = tplFile;
      this.engine = this.getEngine(tplFile);
      this.dir = dir;
    }

    getEngine(tplFile) {
      var engine = DEFAULT_ENGINE;

      this.tplFile = tplFile;
      if(this.tplFile.match(/\.swig$/)) {
        engine = TemplateView.ENGINE_SWIG;
      }
      else if (this.tplFile.match(/\.ejs$/)) {
        engine = TemplateView.ENGINE_EJS;
      }
      else if (this.tplFile.match(/\.mst$/)) {
        engine = TemplateView.ENGINE_MUSTACHE;
      }
      else if (this.tplFile.match(/\.jade$/)) {
        engine = TemplateView.ENGINE_JADE;
      }
      return engine;
    }

    getContentType() {
      return 'html';
    }

    render(actionResult, opts = {}) {
      var tpl = opts.tplFile || this.tplFile;
      var engine = opts.engine || this.engine;
      var oEngine = engine;
      this.engine = engine = this.getEngine(tpl);
      assert(tpl && typeof tpl == 'string', 'Invalid template file name ['+tpl+']');
      var realTplFile = tpl;
      if(this.dir) {
        realTplFile = path.join(EasyNode.real(this.dir), tpl);
      }
      var tplContent = '';
      function getTemplateContent() {
        tplContent = _cachedTpl[realTplFile];
        if (!tplContent) {
          if (!fs.existsSync(realTplFile)) {
            throw new Error(`Can not find template file [${realTplFile}]`);
          }
          tplContent = fs.readFileSync(realTplFile).toString();
          if (ENABLE_TEMPLATE_CACHE) {
            _cachedTpl[realTplFile] = tplContent;
          }
        }
        return tplContent;
      }
      switch (engine) {
        case TemplateView.ENGINE_SWIG:
        {
          return this._renderSwig(actionResult, realTplFile);
        }
        case TemplateView.ENGINE_MUSTACHE :
          {
            return this._renderMustache(actionResult, getTemplateContent());
          }
        case TemplateView.ENGINE_EJS:
          {
            return this._renderEJS(actionResult, getTemplateContent());
          }
        case TemplateView.ENGINE_JADE:
          {
            return this._renderJade(actionResult, getTemplateContent());
          }
        default :
          {
            assert(opt && opt.renderer, `Engine [${oEngine}] is not supported by default, need a renderer to render ActionResult`);
            return this._render(actionResult, tplContent, opt.renderer);
          }
      }
    }

    _renderSwig(actionResult, tplContent) {
      return new SwigTemplateViewRenderer().render(actionResult, tplContent);
    }

    _renderMustache(actionResult, tplContent) {
      return new MustacheTemplateViewRenderer().render(actionResult, tplContent);
    }

    _renderEJS(actionResult, tplContent) {
      return new EJSTemplateViewRenderer().render(actionResult, tplContent);
    }

    _renderJade(actionResult, tplContent) {
      return new JadeTemplateViewRenderer().render(actionResult, tplContent);
    }

    _render(actionResult, tplContent, renderer) {
      if (typeof renderer == 'string') {
        var Renderer = using(renderer);
        renderer = new Renderer();
      }
      return renderer.render(actionResult, tplContent);
    }

    getClassName() {
      return EasyNode.namespace(__filename);
    }
  }

  /**
   *  swig模板引擎，适配模板文件后缀.swig
   *
   *  @property ENGINE_SWIG
   *  @type {String}
   *  @default swig
   *  @static
   *  @since 0.1.0
   *  @author hujiabao
   * */
  TemplateView.ENGINE_SWIG = 'swig';

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
