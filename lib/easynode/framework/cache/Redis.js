'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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

        var Redis = (function (_ICache) {
                _inherits(Redis, _ICache);

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

                function Redis() {
                        _classCallCheck(this, Redis);

                        return _possibleConstructorReturn(this, Object.getPrototypeOf(Redis).call(this));
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

                _createClass(Redis, [{
                        key: 'initialize',
                        value: function initialize() {
                                var server = arguments.length <= 0 || arguments[0] === undefined ? '127.0.0.1' : arguments[0];
                                var port = arguments.length <= 1 || arguments[1] === undefined ? 6379 : arguments[1];
                                var opts = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

                                this.opts = opts;
                                this._client = redisWrapper(redis.createClient(port, server, opts));
                        }
                }, {
                        key: '_doAuth',
                        value: function _doAuth() {
                                var me = this;
                                return regeneratorRuntime.mark(function _callee() {
                                        return regeneratorRuntime.wrap(function _callee$(_context) {
                                                while (1) {
                                                        switch (_context.prev = _context.next) {
                                                                case 0:
                                                                        if (!me.opts.password) {
                                                                                _context.next = 7;
                                                                                break;
                                                                        }

                                                                        if (!(me._didAuth !== true)) {
                                                                                _context.next = 6;
                                                                                break;
                                                                        }

                                                                        me._didAuth = true;
                                                                        _context.next = 5;
                                                                        return me._client.auth(me.opts.password);

                                                                case 5:
                                                                        me._authResult = _context.sent;

                                                                case 6:
                                                                        return _context.abrupt('return', me._authResult);

                                                                case 7:
                                                                        return _context.abrupt('return', true);

                                                                case 8:
                                                                case 'end':
                                                                        return _context.stop();
                                                        }
                                                }
                                        }, _callee, this);
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

                }, {
                        key: 'get',
                        value: function get(key) {
                                var defaultValue = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

                                var me = this;
                                return regeneratorRuntime.mark(function _callee2() {
                                        var s;
                                        return regeneratorRuntime.wrap(function _callee2$(_context2) {
                                                while (1) {
                                                        switch (_context2.prev = _context2.next) {
                                                                case 0:
                                                                        EasyNode.DEBUG && logger.debug('get from cache [' + key + '] ...');
                                                                        _context2.next = 3;
                                                                        return me._doAuth();

                                                                case 3:
                                                                        if (!_context2.sent) {
                                                                                _context2.next = 11;
                                                                                break;
                                                                        }

                                                                        _context2.next = 6;
                                                                        return me._client.get(key);

                                                                case 6:
                                                                        s = _context2.sent;

                                                                        if (s) {
                                                                                s = JSON.parse(s);
                                                                        }
                                                                        return _context2.abrupt('return', s);

                                                                case 11:
                                                                        logger.error('redis authorize fail');
                                                                        return _context2.abrupt('return', null);

                                                                case 13:
                                                                case 'end':
                                                                        return _context2.stop();
                                                        }
                                                }
                                        }, _callee2, this);
                                });
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

                }, {
                        key: 'set',
                        value: function set(key, value) {
                                var ttl = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

                                var me = this;
                                return regeneratorRuntime.mark(function _callee3() {
                                        var ttlRemaining;
                                        return regeneratorRuntime.wrap(function _callee3$(_context3) {
                                                while (1) {
                                                        switch (_context3.prev = _context3.next) {
                                                                case 0:
                                                                        _context3.next = 2;
                                                                        return me._doAuth();

                                                                case 2:
                                                                        if (!_context3.sent) {
                                                                                _context3.next = 18;
                                                                                break;
                                                                        }

                                                                        if (!(value != null)) {
                                                                                _context3.next = 16;
                                                                                break;
                                                                        }

                                                                        EasyNode.DEBUG && logger.debug('set value to cache [' + key + '] ...');

                                                                        if (ttl) {
                                                                                _context3.next = 10;
                                                                                break;
                                                                        }

                                                                        _context3.next = 8;
                                                                        return me._client.ttl(key);

                                                                case 8:
                                                                        ttlRemaining = _context3.sent;

                                                                        if (ttlRemaining > 0) {
                                                                                EasyNode.DEBUG && logger.debug('reset TTL to [' + ttlRemaining + '] seconds...');
                                                                                ttl = ttlRemaining;
                                                                        }

                                                                case 10:
                                                                        _context3.next = 12;
                                                                        return me._client.set(key, JSON.stringify(value));

                                                                case 12:
                                                                        if (!(ttl > 0)) {
                                                                                _context3.next = 15;
                                                                                break;
                                                                        }

                                                                        _context3.next = 15;
                                                                        return me._client.expire(key, ttl);

                                                                case 15:
                                                                        return _context3.abrupt('return', true);

                                                                case 16:
                                                                        _context3.next = 20;
                                                                        break;

                                                                case 18:
                                                                        logger.error('redis authorize fail');
                                                                        return _context3.abrupt('return', false);

                                                                case 20:
                                                                case 'end':
                                                                        return _context3.stop();
                                                        }
                                                }
                                        }, _callee3, this);
                                });
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

                }, {
                        key: 'touch',
                        value: function touch(key, ttl) {
                                var me = this;
                                return regeneratorRuntime.mark(function _callee4() {
                                        return regeneratorRuntime.wrap(function _callee4$(_context4) {
                                                while (1) {
                                                        switch (_context4.prev = _context4.next) {
                                                                case 0:
                                                                        _context4.next = 2;
                                                                        return me._doAuth();

                                                                case 2:
                                                                        if (!_context4.sent) {
                                                                                _context4.next = 8;
                                                                                break;
                                                                        }

                                                                        _context4.next = 5;
                                                                        return me._client.expire(key, ttl);

                                                                case 5:
                                                                        return _context4.abrupt('return', true);

                                                                case 8:
                                                                        logger.error('redis authorize fail');
                                                                        return _context4.abrupt('return', false);

                                                                case 10:
                                                                case 'end':
                                                                        return _context4.stop();
                                                        }
                                                }
                                        }, _callee4, this);
                                });
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

                }, {
                        key: 'del',
                        value: function del(key) {
                                var me = this;
                                return regeneratorRuntime.mark(function _callee5() {
                                        return regeneratorRuntime.wrap(function _callee5$(_context5) {
                                                while (1) {
                                                        switch (_context5.prev = _context5.next) {
                                                                case 0:
                                                                        _context5.next = 2;
                                                                        return me._doAuth();

                                                                case 2:
                                                                        if (!_context5.sent) {
                                                                                _context5.next = 13;
                                                                                break;
                                                                        }

                                                                        _context5.prev = 3;
                                                                        _context5.next = 6;
                                                                        return me._client.del(key);

                                                                case 6:
                                                                        _context5.next = 11;
                                                                        break;

                                                                case 8:
                                                                        _context5.prev = 8;
                                                                        _context5.t0 = _context5['catch'](3);

                                                                        logger.error(_context5.t0);

                                                                case 11:
                                                                        _context5.next = 15;
                                                                        break;

                                                                case 13:
                                                                        logger.error('redis authorize fail');
                                                                        return _context5.abrupt('return', false);

                                                                case 15:
                                                                case 'end':
                                                                        return _context5.stop();
                                                        }
                                                }
                                        }, _callee5, this, [[3, 8]]);
                                });
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

                }, {
                        key: 'stat',
                        value: function stat() {
                                return new CacheStat();
                        }
                }, {
                        key: 'getClassName',
                        value: function getClassName() {
                                return EasyNode.namespace(__filename);
                        }
                }]);

                return Redis;
        })(ICache);

        module.exports = Redis;
})();