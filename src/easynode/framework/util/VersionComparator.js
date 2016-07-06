var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var GenericObject = using('easynode.GenericObject');

(function() {
        /**
         * Class VersionComparator
         *
         * @class easynode.framework.util.VersionComparator
         * @extends easynode.GenericObject
         * @since 0.1.0
         * @author hujiabao
         * */
  class VersionComparator extends GenericObject {
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

                /**
                 * 比较两个版本。v1 > v2 返回>0的整数，v1 = v2返回０，v1 < v2返回<０的整数。注意：1.0 = 0.1.0，你懂的
                 *
                 * @method compare
                 * @param {String} v1 版本号, 格式：major.minor.patch
                 * @param {String} v2 版本号, 格式：major.minor.patch
                 * @static
                 * @since 0.1.0
                 * @author hujiabao
                 * */
    static compare(v1, v2) {
      var [major1, minor1, patch1] = v1.split('.');
      var [major2, minor2, patch2] = v2.split('.');
      major1 = parseInt(major1);
      major1 = isNaN(major1) ? 0 : major1;

      minor1 = parseInt(minor1);
      minor1 = isNaN(minor1) ? 0 : minor1;

      patch1 = parseInt(patch1);
      patch1 = isNaN(patch1) ? 0 : patch1;

      major2 = parseInt(major2);
      major2 = isNaN(major2) ? 0 : major2;

      minor2 = parseInt(minor2);
      minor2 = isNaN(minor2) ? 0 : minor2;

      patch2 = parseInt(patch2);
      patch2 = isNaN(patch2) ? 0 : patch2;

      var t = major1 - major2;
      if (t != 0) {
        return t;
      }

      t = minor1 - minor2;
      if (t != 0) {
        return t;
      }

      return patch1 - patch2;
    }

    getClassName() {
      return EasyNode.namespace(__filename);
    }
        }

  module.exports = VersionComparator;
})();
