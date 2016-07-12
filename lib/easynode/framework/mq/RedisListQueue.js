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
var thunkify = require('thunkify');

(function () {
  var _marked = [sleep].map(regeneratorRuntime.mark);

  function _sleep(t, callback) {
    setTimeout(function () {
      callback(null, null);
    }, t);
  }

  function sleep(t) {
    var fnSleep;
    return regeneratorRuntime.wrap(function sleep$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            fnSleep = thunkify(_sleep);
            _context.next = 3;
            return fnSleep.call(null, t);

          case 3:
          case 'end':
            return _context.stop();
        }
      }
    }, _marked[0], this);
  }

  /**
   * Class RedisListQueue
   *
   * @class easynode.framework.mq.RedisListQueue
   * @extends easynode.framework.mq.IQueue
   * @since 0.1.0
   * @author hujiabao
   * */

  var RedisListQueue = function (_IQueue) {
    _inherits(RedisListQueue, _IQueue);

    /**
     * 构造函数。
     *
     * @method 构造函数
     * @since 0.1.0
     * @author hujiabao
     * */

    function RedisListQueue() {
      _classCallCheck(this, RedisListQueue);

      return _possibleConstructorReturn(this, Object.getPrototypeOf(RedisListQueue).call(this));
      // 调用super()后再定义子类成员。
    }

    _createClass(RedisListQueue, [{
      key: 'initialize',
      value: function initialize() {
        var server = arguments.length <= 0 || arguments[0] === undefined ? '127.0.0.1' : arguments[0];
        var port = arguments.length <= 1 || arguments[1] === undefined ? 6379 : arguments[1];
        var opts = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

        this.opts = opts;
        this._client_original = redis.createClient(port, server, opts);
        this._client = redisWrapper(this._client_original);
      }
    }, {
      key: '_doAuth',
      value: function _doAuth() {
        var me = this;
        return regeneratorRuntime.mark(function _callee() {
          return regeneratorRuntime.wrap(function _callee$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  if (!me.opts.password) {
                    _context2.next = 7;
                    break;
                  }

                  if (!(me._didAuth !== true)) {
                    _context2.next = 6;
                    break;
                  }

                  me._disAuth = true;
                  _context2.next = 5;
                  return me._client.auth(me.opts.password);

                case 5:
                  me._authResult = _context2.sent;

                case 6:
                  return _context2.abrupt('return', me._authResult);

                case 7:
                  return _context2.abrupt('return', true);

                case 8:
                case 'end':
                  return _context2.stop();
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
          return regeneratorRuntime.wrap(function _callee2$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  _context3.next = 2;
                  return me._doAuth();

                case 2:
                  if (!_context3.sent) {
                    _context3.next = 14;
                    break;
                  }

                  i = 0;

                case 4:
                  if (!(i < msgs.length)) {
                    _context3.next = 12;
                    break;
                  }

                  s = JSON.stringify(msgs[i]);

                  EasyNode.DEBUG && logger.debug('publish message to redis queue [' + queueName + '] -> [' + s + ']');
                  _context3.next = 9;
                  return me._client.lpush(queueName, s);

                case 9:
                  i++;
                  _context3.next = 4;
                  break;

                case 12:
                  _context3.next = 15;
                  break;

                case 14:
                  logger.error('redis authorize fail');

                case 15:
                case 'end':
                  return _context3.stop();
              }
            }
          }, _callee2, this);
        });
      }

      /**
       * 订阅队列消息。注意，listener的onMessage是一个generator函数。
       *
       * @method subscribe
       * @param {String} queueName 队列名称
       * @param {Object} opts 订阅选项，接受一个选项qos。FIFO : true, 先进先出队列, FILO : true，后进先出队列
       * @param {Object} l 队列监听器，具有一个onMessage和onError函数，l.pause指定是否接受数据如pause === true，则暂停接收队列数据，监听器会每隔１秒收到一条null消息
       *                  函数原型：onMessage * (queueName, msg) {}，queueName类型：string，msg类型：object，
       *                          onError(err) {},  err : 错误实例
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
        var opts = arguments.length <= 1 || arguments[1] === undefined ? { FIFO: true } : arguments[1];
        var l = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

        logger.warn('***Subscribe a redis list will block any code below !!!');
        assert(l && typeof l.onMessage == 'function', 'Invalid message listener');
        var me = this;
        return regeneratorRuntime.mark(function _callee3() {
          var working, m;
          return regeneratorRuntime.wrap(function _callee3$(_context4) {
            while (1) {
              switch (_context4.prev = _context4.next) {
                case 0:
                  _context4.next = 2;
                  return me._doAuth();

                case 2:
                  if (!_context4.sent) {
                    _context4.next = 41;
                    break;
                  }

                  working = true;

                case 4:
                  if (!true) {
                    _context4.next = 39;
                    break;
                  }

                  _context4.prev = 5;

                  if (!(l.pause === true)) {
                    _context4.next = 12;
                    break;
                  }

                  _context4.next = 9;
                  return sleep(1000);

                case 9:
                  _context4.next = 11;
                  return l.onMessage(queueName, null);

                case 11:
                  return _context4.abrupt('continue', 4);

                case 12:
                  m = null;

                  if (!(opts && !opts.FILO)) {
                    _context4.next = 19;
                    break;
                  }

                  _context4.next = 16;
                  return me._client.rpop(queueName);

                case 16:
                  m = _context4.sent;
                  _context4.next = 22;
                  break;

                case 19:
                  _context4.next = 21;
                  return me._client.lpop(queueName);

                case 21:
                  m = _context4.sent;

                case 22:
                  if (!m) {
                    _context4.next = 27;
                    break;
                  }

                  _context4.next = 25;
                  return l.onMessage(queueName, JSON.parse(m));

                case 25:
                  _context4.next = 29;
                  break;

                case 27:
                  _context4.next = 29;
                  return sleep(20);

                case 29:
                  if (!working) {
                    working = true;
                    logger.info('subscribe restore');
                  }
                  _context4.next = 37;
                  break;

                case 32:
                  _context4.prev = 32;
                  _context4.t0 = _context4['catch'](5);

                  if (typeof l.onError == 'function') {
                    l.onError.call(null, _context4.t0);
                  }
                  if (working) {
                    logger.error('subscribe broken');
                  }
                  working = false;

                case 37:
                  _context4.next = 4;
                  break;

                case 39:
                  _context4.next = 42;
                  break;

                case 41:
                  logger.error('redis authorize fail');

                case 42:
                case 'end':
                  return _context4.stop();
              }
            }
          }, _callee3, this, [[5, 32]]);
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
        throw new Error('Unsubscribe is not supported on list model');
      }
    }, {
      key: 'getClassName',
      value: function getClassName() {
        return EasyNode.namespace(__filename);
      }
    }]);

    return RedisListQueue;
  }(IQueue);

  module.exports = RedisListQueue;
})();