var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var GenericObject = using('easynode.GenericObject');

(function() {
        /**
         * 缓存接口，定义了缓存的抽象函数。
         * 各缓存支持情况：
         * memcached - since 0.1.0
         * redis - since 0.1.0
         *
         * @class easynode.framework.cache.ICache
         * @extends easynode.GenericObject
         * @since 0.1.0
         * @author hujiabao
         * */
  class ICache extends GenericObject {
                /**
                 * 取值。
                 *
                 * @method get
                 * @param {String} key 键
                 * @param {Object} defaultValue 默认值，默认null
                 * @return {Object} 返回缓存的值
                 * @async
                 * @since 0.1.0
                 * @author hujiabao
                 * */
    get(key, defaultValue = null) {
      throw new Error('Abstract Method');
    }

                /**
                 * 缓存值。
                 *
                 * @method set
                 * @param {String} key 键
                 * @param {Object} value 值
                 * @param {int} ttl 缓存时间，单位，秒
                 * @async
                 * @since 0.1.0
                 * @author hujiabao
                 * */
    set(key, value, ttl) {
      throw new Error('Abstract Method');
    }

                /**
                 * 重新设置缓存时间。
                 *
                 * @method set
                 * @param {String} key 键
                 * @param {int} ttl 缓存时间，单位，秒
                 * @async
                 * @since 0.1.0
                 * @author hujiabao
                 * */
    touch(key, ttl) {
      throw new Error('Abstract Method');
    }

                /**
                 * 从缓存中删除值。
                 *
                 * @method del
                 * @param {String} key 键
                 * @async
                 * @since 0.1.0
                 * @author hujiabao
                 * */
    del(key) {
      throw new Error('Abstract Method');
    }

                /**
                 * 缓存情况统计。
                 *
                 * @method stat
                 * @return {easynode.framework.cache.CacheStat} 缓存实体
                 * @async
                 * @since 0.1.0
                 * @author hujiabao
                 * */
    stat() {
      throw new Error('Abstract Method');
    }

    getClassName() {
      return EasyNode.namespace(__filename);
    }
        }

  module.exports = ICache;
})();
