var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var ITemplateViewRenderer = using('easynode.framework.mvc.ITemplateViewRenderer');
var _ = require('underscore');
var jade = require('jade');

(function() {

  /**
   * Class JadeTemplateViewRenderer，用于渲染Jade模板引擎的View
   *
   * @class easynode.framework.mvc.JadeTemplateViewRenderer
   * @extends easynode.framework.mvc.ITemplateViewRenderer
   * @since 0.1.0
   * @author hujiabao
   * */
  class JadeTemplateViewRenderer extends ITemplateViewRenderer {

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

    render(actionResult, template) {
      var data = actionResult.toJSON();
      this._injectHelpers(data);
      return jade.render(template, data.result);
    }

    _injectHelpers(data) {
      _.extend(data, {});
    }

    getClassName() {
      return EasyNode.namespace(__filename);
    }

  }

  module.exports = JadeTemplateViewRenderer;
})();
