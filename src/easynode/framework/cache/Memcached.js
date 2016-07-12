var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var ICache = using('easynode.framework.cache.ICache');
var thunkify = require('thunkify');
var MemcachedClient = require('memcached');
var CacheStat = using('easynode.framework.cache.CacheStat');

var fnGet = thunkify(MemcachedClient.prototype.get);
var fnSet = thunkify(MemcachedClient.prototype.set);
var fnTouch = thunkify(MemcachedClient.prototype.touch);
var fnDel = thunkify(MemcachedClient.prototype.del);

(function() {
  /**
   * Class Memcached, ICache实现类
   *
   * @class easynode.framework.cache.Memcached
   * @extends easynode.framework.cache.ICache
   * @since 0.1.0
   * @author hujiabao
   * */
  class Memcached extends ICache {

  /**
   * 构造函数。
   *
   * @method 构造函数
   * @param {Object} connect 参考memcached模块的构造参数。默认值：127.0.0.1:11211
   *      var memcached = new Memcached({ '192.168.0.102:11211': 1, '192.168.0.103:11211': 2, '192.168.0.104:11211': 1 });
   *      var memcached = new Memcached([ '192.168.0.102:11211', '192.168.0.103:11211', '192.168.0.104:11211' ]);
   *      var memcached = new Memcached('192.168.0.102:11211');
   * @param {Object} opts 连接参数，参考：<a href='https://www.npmjs.com/package/memcached' target='_blank'>memcached模块初始化参数</a>
   * @since 0.1.0
   * @author hujiabao
   * */
    constructor(connect = '127.0.0.1:11211', opts = {timeout: 1000, poolSize: 20, retries: 0}) {
      super();
      // 调用super()后再定义子类成员。
      this._client = new MemcachedClient(connect, opts);
      this._client.on('issue', function() {
        console.log('errr');
        var cs = typeof connect == 'string' ? connect : JSON.stringify(connect);
        logger.error(`Error while connecting to memcached [${connect}]`);
      });
    }

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
      var me = this;
      return function *() {
        EasyNode.DEBUG && logger.debug(`get from cache with key [${key}] ...`);
        var v = null;
        try {
          v = yield fnGet.call(me._client, key);
        } catch (e) {
          logger.error(e);
        }
        v != null && EasyNode.DEBUG && logger.debug('cache hit');
        v == null && EasyNode.DEBUG && logger.debug('miss');
        return v || defaultValue;
      };
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
    set(key, value, ttl = 0) {
      var me = this;
      return function *() {
        EasyNode.DEBUG && logger.debug(`set value to cache with key [${key}] ...`);
        try {
          yield fnSet.call(me._client, key, value, ttl);
        } catch (e) {
          logger.error(e);
        }
      };
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
    touch(key, ttl = 0) {
      var me = this;
      return function *() {
        try {
          yield fnTouch.call(me._client, key, ttl);
        } catch (e) {
          logger.error(e);
        }
      };
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
      var me = this;
      return function *() {
        try {
          yield fnDel.call(me._client, key);
        } catch (e) {
          logger.error(e);
        }
      };
    }

  /**
   * 缓存情况统计。功能暂不可用。
   *
   * @method stat
   * @return {easynode.framework.cache.CacheStat} 缓存实体
   * @async
   * @since 0.1.0
   * @author hujiabao
   * */
    stat() {
      return new CacheStat();
    }

    getClassName() {
      return EasyNode.namespace(__filename);
    }
        }

  module.exports = Memcached;
})();
