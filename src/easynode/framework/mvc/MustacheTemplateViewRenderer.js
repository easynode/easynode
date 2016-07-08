var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var ITemplateViewRenderer = using('easynode.framework.mvc.ITemplateViewRenderer');
var mustache = require('mustache');
var MustacheHelper = using('easynode.framework.util.MustacheHelper');

(function() {
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
  class MustacheTemplateViewRenderer extends ITemplateViewRenderer {

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
      mustache.parse(template);
      var o = actionResult.toJSON();
      this._injectHelperFunctions(o);
      return mustache.render(template, o.result);
    }

    _injectHelperFunctions(o) {
      MustacheHelper.normalize(o);
    }

    getClassName() {
      return EasyNode.namespace(__filename);
    }

  }

  module.exports = MustacheTemplateViewRenderer;
})();
