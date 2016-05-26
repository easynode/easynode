'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var IQueue = using('easynode.framework.mq.IQueue');
var redisWrapper = require('co-redis');
var redis = require('redis');

(function () {
        /**
         * Class RedisQueue
         *
         * @class easynode.framework.mq.RedisQueue
         * @extends easynode.framework.mq.IQueue
         * @since 0.1.0
         * @author hujiabao
         * */

        var RedisQueue = function (_IQueue) {
                _inherits(RedisQueue, _IQueue);

                /**
                 * 构造函数。
                 *
                 * @method 构造函数
                 * @since 0.1.0
                 * @author hujiabao
                 * */

                function RedisQueue() {
                        _classCallCheck(this, RedisQueue);

                        return _possibleConstructorReturn(this, Object.getPrototypeOf(RedisQueue).call(this));
                        //调用super()后再定义子类成员。
                }

                _createClass(RedisQueue, [{
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
                         * 向队列发送消息。
                         *
                         * @method publish
                         * @param {String} queueName 队列名称
                         * @param {Object} opts 发送选项，取决于队列的协议和驱动程序
                         * @param {Object} msgs JSON对象，可一次发送多条消息
                         * @return {boolean} 消息发送结果
                         * @async
                         * @abstract
                         * @since 0.1.0
                         * @author hujiabao
                         * */

                }, {
                        key: 'publish',
                        value: function publish() {
                                for (var _len = arguments.length, msgs = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
                                        msgs[_key - 2] = arguments[_key];
                                }

                                var queueName = arguments.length <= 0 || arguments[0] === undefined ? 'defaultQueue' : arguments[0];
                                var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

                                assert(msgs.length > 0, 'Invalid argument');
                                var me = this;
                                return regeneratorRuntime.mark(function _callee2() {
                                        var i, s;
                                        return regeneratorRuntime.wrap(function _callee2$(_context2) {
                                                while (1) {
                                                        switch (_context2.prev = _context2.next) {
                                                                case 0:
                                                                        _context2.next = 2;
                                                                        return me._doAuth();

                                                                case 2:
                                                                        if (!_context2.sent) {
                                                                                _context2.next = 14;
                                                                                break;
                                                                        }

                                                                        i = 0;

                                                                case 4:
                                                                        if (!(i < msgs.length)) {
                                                                                _context2.next = 12;
                                                                                break;
                                                                        }

                                                                        s = JSON.stringify(msgs[i]);

                                                                        EasyNode.DEBUG && logger.debug('publish message to redis queue [' + queueName + '] -> [' + s + ']');
                                                                        _context2.next = 9;
                                                                        return me._client.publish(queueName, s);

                                                                case 9:
                                                                        i++;
                                                                        _context2.next = 4;
                                                                        break;

                                                                case 12:
                                                                        _context2.next = 15;
                                                                        break;

                                                                case 14:
                                                                        logger.error('redis authorize fail');

                                                                case 15:
                                                                case 'end':
                                                                        return _context2.stop();
                                                        }
                                                }
                                        }, _callee2, this);
                                });
                        }

                        /**
                         * 订阅队列消息。
                         *
                         * @method subscribe
                         * @param {String} queueName 队列名称
                         * @param {Object} opts 订阅选项，接受一个选项qos
                         * @param {Object} l 队列监听器，具有一个onMessage和onError函数，
                         *                                              函数原型：onMessage (queueName, msg) {}，queueName类型：string，msg类型：object，
                         *                                                                 onError(err) {},  err : 错误实例
                         * @return {Object} 订阅实例，需要通过unsubscribe释放资源, 如果返回null则表示订阅失败
                         * @async
                         * @abstract
                         * @since 0.1.0
                         * @author hujiabao
                         * */

                }, {
                        key: 'subscribe',
                        value: function subscribe() {
                                var queueName = arguments.length <= 0 || arguments[0] === undefined ? 'defaultQueue' : arguments[0];
                                var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
                                var l = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

                                assert(l && typeof l.onMessage == 'function', 'Invalid argument');
                                var me = this;
                                return regeneratorRuntime.mark(function _callee3() {
                                        return regeneratorRuntime.wrap(function _callee3$(_context3) {
                                                while (1) {
                                                        switch (_context3.prev = _context3.next) {
                                                                case 0:
                                                                        _context3.next = 2;
                                                                        return me._doAuth();

                                                                case 2:
                                                                        if (!_context3.sent) {
                                                                                _context3.next = 9;
                                                                                break;
                                                                        }

                                                                        _context3.next = 5;
                                                                        return me._client.subscribe(queueName);

                                                                case 5:
                                                                        me._client.on('message', function (queueName, message) {
                                                                                EasyNode.DEBUG && logger.debug('received a message from redis queue [' + queueName + '] -> [' + message + '}]');
                                                                                l.onMessage(queueName, JSON.parse(message));
                                                                        });
                                                                        return _context3.abrupt('return', {
                                                                                client: me._client
                                                                        });

                                                                case 9:
                                                                        logger.error('redis authorize fail');
                                                                        return _context3.abrupt('return', null);

                                                                case 11:
                                                                case 'end':
                                                                        return _context3.stop();
                                                        }
                                                }
                                        }, _callee3, this);
                                });
                        }

                        /**
                         * 取消订阅队列消息。
                         *
                         * @method unsubscribe
                         * @param {Object} subscribeInst subscribe函数的返回值
                         * @async
                         * @abstract
                         * @since 0.1.0
                         * @author hujiabao
                         * */

                }, {
                        key: 'unsubscribe',
                        value: function unsubscribe(subscribeInst) {
                                assert(subscribeInst && subscribeInst.client, 'Invalid argument');
                                var me = this;
                                return regeneratorRuntime.mark(function _callee4() {
                                        return regeneratorRuntime.wrap(function _callee4$(_context4) {
                                                while (1) {
                                                        switch (_context4.prev = _context4.next) {
                                                                case 0:
                                                                        _context4.next = 2;
                                                                        return me._client.unsubscribe();

                                                                case 2:
                                                                case 'end':
                                                                        return _context4.stop();
                                                        }
                                                }
                                        }, _callee4, this);
                                });
                        }
                }, {
                        key: 'getClassName',
                        value: function getClassName() {
                                return EasyNode.namespace(__filename);
                        }
                }]);

                return RedisQueue;
        }(IQueue);

        module.exports = RedisQueue;
})();