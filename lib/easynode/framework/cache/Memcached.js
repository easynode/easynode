'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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

(function () {
        /**
         * Class Memcached, ICache实现类
         *
         * @class easynode.framework.cache.Memcached
         * @extends easynode.framework.cache.ICache
         * @since 0.1.0
         * @author hujiabao
         * */

        var Memcached = (function (_ICache) {
                _inherits(Memcached, _ICache);

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

                function Memcached() {
                        var connect = arguments.length <= 0 || arguments[0] === undefined ? '127.0.0.1:11211' : arguments[0];
                        var opts = arguments.length <= 1 || arguments[1] === undefined ? { timeout: 1000, poolSize: 20, retries: 0 } : arguments[1];

                        _classCallCheck(this, Memcached);

                        //调用super()后再定义子类成员。

                        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Memcached).call(this));

                        _this._client = new MemcachedClient(connect, opts);
                        _this._client.on('issue', function () {
                                var cs = typeof connect == 'string' ? connect : JSON.stringify(connect);
                                logger.error('Error while connecting to memcached [' + connect + ']');
                        });
                        return _this;
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

                _createClass(Memcached, [{
                        key: 'get',
                        value: function get(key) {
                                var defaultValue = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

                                var me = this;
                                return regeneratorRuntime.mark(function _callee() {
                                        var v;
                                        return regeneratorRuntime.wrap(function _callee$(_context) {
                                                while (1) {
                                                        switch (_context.prev = _context.next) {
                                                                case 0:
                                                                        EasyNode.DEBUG && logger.debug('get from cache with key [' + key + '] ...');
                                                                        v = null;
                                                                        _context.prev = 2;
                                                                        _context.next = 5;
                                                                        return fnGet.call(me._client, key);

                                                                case 5:
                                                                        v = _context.sent;
                                                                        _context.next = 11;
                                                                        break;

                                                                case 8:
                                                                        _context.prev = 8;
                                                                        _context.t0 = _context['catch'](2);

                                                                        logger.error(_context.t0);

                                                                case 11:
                                                                        v != null && EasyNode.DEBUG && logger.debug('cache hit');
                                                                        v == null && EasyNode.DEBUG && logger.debug('miss');
                                                                        return _context.abrupt('return', v || defaultValue);

                                                                case 14:
                                                                case 'end':
                                                                        return _context.stop();
                                                        }
                                                }
                                        }, _callee, this, [[2, 8]]);
                                });
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

                }, {
                        key: 'set',
                        value: function set(key, value) {
                                var ttl = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

                                var me = this;
                                return regeneratorRuntime.mark(function _callee2() {
                                        return regeneratorRuntime.wrap(function _callee2$(_context2) {
                                                while (1) {
                                                        switch (_context2.prev = _context2.next) {
                                                                case 0:
                                                                        EasyNode.DEBUG && logger.debug('set value to cache with key [' + key + '] ...');
                                                                        _context2.prev = 1;
                                                                        _context2.next = 4;
                                                                        return fnSet.call(me._client, key, value, ttl);

                                                                case 4:
                                                                        _context2.next = 9;
                                                                        break;

                                                                case 6:
                                                                        _context2.prev = 6;
                                                                        _context2.t0 = _context2['catch'](1);

                                                                        logger.error(_context2.t0);

                                                                case 9:
                                                                case 'end':
                                                                        return _context2.stop();
                                                        }
                                                }
                                        }, _callee2, this, [[1, 6]]);
                                });
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

                }, {
                        key: 'touch',
                        value: function touch(key) {
                                var ttl = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

                                var me = this;
                                return regeneratorRuntime.mark(function _callee3() {
                                        return regeneratorRuntime.wrap(function _callee3$(_context3) {
                                                while (1) {
                                                        switch (_context3.prev = _context3.next) {
                                                                case 0:
                                                                        _context3.prev = 0;
                                                                        _context3.next = 3;
                                                                        return fnTouch.call(me._client, key, ttl);

                                                                case 3:
                                                                        _context3.next = 8;
                                                                        break;

                                                                case 5:
                                                                        _context3.prev = 5;
                                                                        _context3.t0 = _context3['catch'](0);

                                                                        logger.error(_context3.t0);

                                                                case 8:
                                                                case 'end':
                                                                        return _context3.stop();
                                                        }
                                                }
                                        }, _callee3, this, [[0, 5]]);
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
                                return regeneratorRuntime.mark(function _callee4() {
                                        return regeneratorRuntime.wrap(function _callee4$(_context4) {
                                                while (1) {
                                                        switch (_context4.prev = _context4.next) {
                                                                case 0:
                                                                        _context4.prev = 0;
                                                                        _context4.next = 3;
                                                                        return fnDel.call(me._client, key);

                                                                case 3:
                                                                        _context4.next = 8;
                                                                        break;

                                                                case 5:
                                                                        _context4.prev = 5;
                                                                        _context4.t0 = _context4['catch'](0);

                                                                        logger.error(_context4.t0);

                                                                case 8:
                                                                case 'end':
                                                                        return _context4.stop();
                                                        }
                                                }
                                        }, _callee4, this, [[0, 5]]);
                                });
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

                return Memcached;
        })(ICache);

        module.exports = Memcached;
})();