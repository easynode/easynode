var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var ITemplateViewRenderer = using('easynode.framework.mvc.ITemplateViewRenderer');
var ejs = require('ejs');
var _ = require('underscore');

(function () {
        /**
         * Class EJSTemplateViewRenderer，用于渲染EJS模板引擎的View
         *
         * @class easynode.framework.mvc.EJSTemplateViewRenderer
         * @extends easynode.framework.mvc.ITemplateViewRenderer
         * @since 0.1.0
         * @author hujiabao
         * */
        class EJSTemplateViewRenderer extends ITemplateViewRenderer {
                /**
                 * 构造函数。
                 *
                 * @method 构造函数
                 * @since 0.1.0
                 * @author hujiabao
                 * */
                constructor() {
                        super();
                        //调用super()后再定义子类成员。
                }

                render (actionResult, template) {
                        var data = actionResult.toJSON();
                        this._injectHelperFunctions(data);
                        return ejs.render(template, data);
                }

                _injectHelperFunctions (o) {
                        //TODO 支持格式转换函数
                }

                getClassName() {
                        return EasyNode.namespace(__filename);
                }
        }

        module.exports = EJSTemplateViewRenderer;
})();