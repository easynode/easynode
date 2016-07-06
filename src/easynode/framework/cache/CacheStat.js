var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var GenericObject = using('easynode.GenericObject');

(function() {
        /**
         * 缓存服务统计实体类。
         *
         * @class easynode.framework.cache.CacheStat
         * @extends easynode.GenericObject
         * @since 0.1.0
         * @author hujiabao
         * */
  class CacheStat extends GenericObject {
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

    getClassName() {
      return EasyNode.namespace(__filename);
    }
        }

  module.exports = CacheStat;
})();
