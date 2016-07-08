var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var GenericObject = using('easynode.GenericObject');

(function() {

    /**
    * Interface ITemplateViewRenderer
    *
    * @class easynode.framework.mvc.ITemplateViewRenderer
    * @extends easynode.GenericObject
    * @since 0.1.0
    * @author hujiabao
    * */
  class ITemplateViewRenderer extends GenericObject {

        /**
         *
         * @method render
         * @param {easynode.framework.mvc.ActionResult} actionResult ActionResult
         * @param {String} template 模板字符串
         * @return {String} 模板渲染结果字符串
         * @abstract
         * @since 0.1.0
         * @author hujiabao
         * */
        render(actionResult, template) {
          throw new Error('Abstract Method');
        }

        getClassName() {
          return EasyNode.namespace(__filename);
        }

    }
    module.exports = ITemplateViewRenderer;
})();
