var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var ITemplateViewRenderer = using('easynode.framework.mvc.ITemplateViewRenderer');
var swig = require('swig');
var StringUtil = using('easynode.framework.util.StringUtil');
var _ = require('underscore');

(function() {

  const SWITCH_CACHE = StringUtil.switchState(EasyNode.config('easynode.framework.mvc.view.template.enableCache', 'false'));

        /**
         * Class SwigTemplateViewRenderer，用于渲染swig模板引擎的View
         *
         * @class easynode.framework.mvc.SwigTemplateViewRenderer
         * @extends easynode.framework.mvc.ITemplateViewRenderer
         * @since 0.1.0
         * @author hujiabao
         * */
  class SwigTemplateViewRenderer extends ITemplateViewRenderer {

                /**
                 * 构造函数。
                 *
                 * @method 构造函数
                 * @since 0.1.0
                 * @author hujiabao
                 * */
    constructor() {
      super();
                        // 调用super()后再定义子类成员。
    }

    getCache() {
      if (!SWITCH_CACHE) {
        return false;
      }
      else {
        return 'memory';
      }
    }

    render(actionResult, template) {
      var data = actionResult.toJSON();
      var templateRender = swig.compileFile(template, {cache : this.getCache()});
      return templateRender(data.result);
    }

    _injectHelperFunctions(o) {
                        // TODO 支持格式转换函数
    }

    getClassName() {
      return EasyNode.namespace(__filename);
    }
        }

  module.exports = SwigTemplateViewRenderer;
})();
