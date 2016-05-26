var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var ICache = using('easynode.framework.cache.ICache');
var redisWrapper = require('co-redis');
var redis = require('redis');
var CacheStat = using('easynode.framework.cache.CacheStat');

(function () {
        /**
         * Class Redis
         *
         * @class easynode.framework.cache.Redis
         * @extends easynode.framework.cache.ICache
         * @since 0.1.0
         * @author hujiabao
         * */
        class Redis extends ICache {
                /**
                 * 构造函数。
                 *
                 * @method 构造函数
                 * @param {String} server redis服务器, 默认127.0.0.1
                 * @param {int} port redis服务端口，默认6379
                 * @param {Object} opts redis连接选项，默认{},
                 *              请参考：<a href='https://www.npmjs.com/package/redis' target='_blank'>redis模块初始化参数</a>
                 * @since 0.1.0
                 * @author hujiabao
                 * */
                constructor() {
                        super();
                        //调用super()后再定义子类成员。
                }

                /**
                 * 初始化连接参数。
                 *
                 * @method get
                 * @param {String} key 键
                 * @param {Object} defaultValue 默认值，默认null
                 * @return {Object} 返回缓存的值
                 * @async
                 * @since 0.1.0
                 * @author hujiabao
                 * */
                initialize(server = '127.0.0.1', port = 6379, opts = {}) {
                        this.opts = opts;
                        this._client = redisWrapper(redis.createClient(port, server, opts));
                }

                _doAuth() {
                        var me = this;
                        return function * () {
                                if (me.opts.password) {
                                        if (me._didAuth !== true) {
                                                me._didAuth = true;
                                                me._authResult = yield me._client.auth(me.opts.password);
                                        }
                                        return me._authResult;
                                }
                                return true;
                        };
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
                        return function * () {
                                EasyNode.DEBUG && logger.debug(`get from cache [${key}] ...`);
                                if (yield me._doAuth()) {
                                        var s = yield me._client.get(key);
                                        if(s) {
                                                s = JSON.parse(s);
                                        }
                                        return s;
                                }
                                else {
                                        logger.error(`redis authorize fail`);
                                        return null;
                                }
                        };
                }

                /**
                 * 缓存值。如果不设置TTL并且原KEY有TTL，则保证该KEY在原TTL到期时被删除。
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
                        return function * () {
                                if (yield me._doAuth()) {
                                        if (value != null) {
                                                EasyNode.DEBUG && logger.debug(`set value to cache [${key}] ...`);
                                                if(!ttl) {
                                                        var ttlRemaining = yield me._client.ttl(key);
                                                        if(ttlRemaining > 0) {
                                                                EasyNode.DEBUG && logger.debug(`reset TTL to [${ttlRemaining}] seconds...`);
                                                                ttl = ttlRemaining;
                                                        }
                                                }
                                                yield me._client.set(key, JSON.stringify(value));
                                                if(ttl > 0) {
                                                        yield me._client.expire(key, ttl);
                                                }
                                                return true;
                                        }
                                }
                                else {
                                        logger.error(`redis authorize fail`);
                                        return false;
                                }
                        };
                }

                /**
                 * 重新设置缓存时间。注意：如果已经KEY已经过期，则该函数没有任何效果。
                 *
                 * @method touch
                 * @param {String} key 键
                 * @param {int} ttl 缓存时间，单位，秒
                 * @async
                 * @since 0.1.0
                 * @author hujiabao
                 * */
                touch(key, ttl) {
                        var me = this;
                        return function* () {
                                if (yield me._doAuth()) {
                                        yield me._client.expire(key, ttl);
                                        return true;
                                }
                                else {
                                        logger.error(`redis authorize fail`);
                                        return false;
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
                        return function * () {
                                if (yield me._doAuth()) {
                                        try {
                                                yield me._client.del(key);
                                        } catch (e) {
                                                logger.error(e);
                                        }
                                }
                                else {
                                        logger.error(`redis authorize fail`);
                                        return false;
                                }
                        };
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
                        return new CacheStat();
                }

                getClassName() {
                        return EasyNode.namespace(__filename);
                }
        }

        module.exports = Redis;
})();