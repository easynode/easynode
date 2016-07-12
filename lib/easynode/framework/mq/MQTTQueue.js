'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var IQueue = using('easynode.framework.mq.IQueue');
var GenericPool = require('generic-pool');
var mqtt = require('mqtt');
var _ = require('underscore');
var thunkify = require('thunkify');

(function () {
  var DEFAULT_POOL_OPTS = {
    min: 2,
    max: 10,
    idleTimeoutMillis: 30000,
    log: false
  };

  var DEFAULT_CONNECT_OPTS = {
    maxWaitCount: 100,
    waitForConnections: true,
    connectTimeout: 1000
  };

  /**
   * Class MQTTQueue
   *
   * @class easynode.framework.queue.MQTTQueue
   * @extends easynode.framework.mq.IQueue
   * @since 0.1.0
   * @author hujiabao
   * */

  var MQTTQueue = function (_IQueue) {
    _inherits(MQTTQueue, _IQueue);

    /**
     * 构造函数。
     *
     * @method 构造函数
     * @since 0.1.0
     * @author hujiabao
     * */

    function MQTTQueue() {
      _classCallCheck(this, MQTTQueue);

      return _possibleConstructorReturn(this, Object.getPrototypeOf(MQTTQueue).call(this));
      // 调用super()后再定义子类成员。
    }

    /**
     * 初始化连接参数。
     *
     * @method get
     * @param {String} url MQTT协议连接字符串：mqtt://127.0.0.1
     * @param {String} name 默认mqtt
     * @param {Object} poolOpts 连接池参数
     * @param {Object} connectOpts 连接参数
     * @since 0.1.0
     * @author hujiabao
     * */


    _createClass(MQTTQueue, [{
      key: 'initialize',
      value: function initialize() {
        var url = arguments.length <= 0 || arguments[0] === undefined ? 'mqtt://127.0.0.1' : arguments[0];
        var name = arguments.length <= 1 || arguments[1] === undefined ? 'mqtt' : arguments[1];
        var poolOpts = arguments.length <= 2 || arguments[2] === undefined ? DEFAULT_POOL_OPTS : arguments[2];
        var connectOpts = arguments.length <= 3 || arguments[3] === undefined ? DEFAULT_CONNECT_OPTS : arguments[3];

        var me = this;
        this.url = url;
        this.poolOpts = poolOpts;
        this.connectOpts = connectOpts;
        var poolArgs = _.extend(poolOpts, {
          name: name,
          create: function create(callback) {
            var client = mqtt.connect(url, connectOpts);
            setTimeout(function () {
              if (!client.connected) {
                client.end();
                callback(null, client);
              }
            }, connectOpts.connectTimeout || 1000);

            client.once('connect', function () {
              client.once('offline', function () {
                logger.error('mqtt client lost connection');
                me.pool.destroy(client);
                // 这个函数调用会引起程序崩溃并且无法捕捉异常，监听process的uncaughtException事件可以阻止程序崩溃。
              });
              callback(null, client);
            });

            // client.once('offline', function (err) {
            //        logger.error('mqtt client is offline: ' + err);
            //        callback(null, client);
            // });
          },

          destroy: function destroy(client) {
            try {
              client.end();
            } catch (err) {}
          }
        });
        this.pool = GenericPool.Pool(poolArgs);
      }

      /**
       * 获取默认队列选项
       *
       * @method getDefaultOpts
       * @return {Object} 返回默认队列选项
       * @async
       * @abstract
       * @since 0.1.0
       * @author hujiabao
       * */

    }, {
      key: 'publish',


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
      value: function publish() {
        for (var _len = arguments.length, msgs = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
          msgs[_key - 2] = arguments[_key];
        }

        var queueName = arguments.length <= 0 || arguments[0] === undefined ? 'defaultQueue' : arguments[0];
        var opts = arguments.length <= 1 || arguments[1] === undefined ? { qos: MQTTQueue.QoS_NORMAL, retain: false } : arguments[1];

        assert(msgs.length > 0, 'Invalid argument');
        opts = opts || MQTTQueue.getDefaultOpts();
        var me = this;
        return regeneratorRuntime.mark(function _callee() {
          var fnAcquire, client, fnPublish, i, s;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  if (!(me.pool.availableObjectsCount() == 0 && me.pool.waitingClientsCount() >= me.connectOpts.maxWaitCount)) {
                    _context.next = 4;
                    break;
                  }

                  logger.warn('No more available mqtt clients, ***WARNING: acquire suspending will happen');

                  if (!(me.connectOpts.waitForConnections !== true)) {
                    _context.next = 4;
                    break;
                  }

                  return _context.abrupt('return', false);

                case 4:
                  fnAcquire = thunkify(me.pool.acquire);
                  _context.next = 7;
                  return fnAcquire.call(me.pool);

                case 7:
                  client = _context.sent;

                  if (!(client.connected === true)) {
                    _context.next = 23;
                    break;
                  }

                  fnPublish = thunkify(client.publish);
                  i = 0;

                case 11:
                  if (!(i < msgs.length)) {
                    _context.next = 19;
                    break;
                  }

                  s = JSON.stringify(msgs[i]);

                  EasyNode.DEBUG && logger.debug('send to mqtt queue[' + me.url + ']: ' + s);
                  _context.next = 16;
                  return fnPublish.call(client, queueName, s, opts);

                case 16:
                  i++;
                  _context.next = 11;
                  break;

                case 19:
                  me.pool.release(client);
                  return _context.abrupt('return', true);

                case 23:
                  me.pool.destroy(client);
                  logger.error('Can not connect to mqtt [' + me.url + ']');
                  return _context.abrupt('return', false);

                case 26:
                case 'end':
                  return _context.stop();
              }
            }
          }, _callee, this);
        });
      }

      /**
       * 订阅队列消息。
       *
       * @method subscribe
       * @param {String} queueName 队列名称
       * @param {Object} opts 订阅选项，接受一个选项qos
       * @param {Object} l 队列监听器，具有一个onMessage和onError函数，
       *               函数原型： onMessage (queueName, msg) {}，queueName类型：string，msg类型：object，
       *                         onError(err) {},  err : 错误实例
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
        var opts = arguments.length <= 1 || arguments[1] === undefined ? { qos: MQTTQueue.QoS_NORMAL } : arguments[1];
        var l = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

        assert(l && typeof l.onMessage == 'function', 'Invalid argument');
        opts = opts || { qos: MQTTQueue.QoS_NORMAL };
        var me = this;
        return regeneratorRuntime.mark(function _callee2() {
          var fnAcquire, client, fnSubscribe;
          return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  if (!(me.pool.availableObjectsCount() == 0 && me.pool.waitingClientsCount() >= me.connectOpts.maxWaitCount)) {
                    _context2.next = 4;
                    break;
                  }

                  logger.warn('No more available mqtt clients, ***WARNING: acquire suspending will happen');

                  if (!(me.connectOpts.waitForConnections !== true)) {
                    _context2.next = 4;
                    break;
                  }

                  return _context2.abrupt('return', null);

                case 4:
                  fnAcquire = thunkify(me.pool.acquire);
                  _context2.next = 7;
                  return fnAcquire.call(me.pool);

                case 7:
                  client = _context2.sent;

                  if (client.connected) {
                    _context2.next = 12;
                    break;
                  }

                  me.pool.destroy(client);
                  logger.error('Can not connect to mqtt [' + me.url + ']');
                  return _context2.abrupt('return', null);

                case 12:
                  fnSubscribe = thunkify(client.subscribe);
                  _context2.next = 15;
                  return fnSubscribe.call(client, queueName, opts);

                case 15:
                  client.on('message', function (queueName, msg) {
                    try {
                      msg = JSON.parse(msg);
                      l.onMessage(queueName, msg);
                    } catch (e) {
                      logger.error('Invalid queued string [' + msg + '] serialized fail');
                    }
                  });
                  client.once('offline', function () {
                    if (typeof l.onError == 'function') {
                      l.onError(new Error('offline'));
                    }
                  });
                  return _context2.abrupt('return', {
                    client: client
                  });

                case 18:
                case 'end':
                  return _context2.stop();
              }
            }
          }, _callee2, this);
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
        return regeneratorRuntime.mark(function _callee3() {
          return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  me.pool.release(subscribeInst.client);

                case 1:
                case 'end':
                  return _context3.stop();
              }
            }
          }, _callee3, this);
        });
      }
    }, {
      key: 'getClassName',
      value: function getClassName() {
        return EasyNode.namespace(__filename);
      }
    }], [{
      key: 'getDefaultOpts',
      value: function getDefaultOpts() {
        return { qos: MQTTQueue.QoS_NORMAL, retain: false };
      }
    }]);

    return MQTTQueue;
  }(IQueue);

  /**
  * 服务质量 - 一般服务。消息最多被传递一次，比如一般类广告，通知，不保证消息一定能到达。
  *
  * @property MQTTQueue.QoS_NORMAL
  * @type number
  * @default 0
  * @static
  * @since 0.1.0
  * @author hujiabao
  * */


  MQTTQueue.QoS_NORMAL = 0;

  /**
  * 服务质量 - 保证消息到达，但可能重复。应用场景示例：账户余额通知
  *
  * @property MQTTQueue.QoS_GUARANTEE
  * @type number
  * @default 0
  * @static
  * @since 0.1.0
  * @author hujiabao
  * */
  MQTTQueue.QoS_GUARANTEE = 1;

  /**
  * 服务质量 - 保证消息到达并且保证消息的一次到达。应用场景示例：消费通知
  *
  * @property MQTTQueue.QoS_GUARANTEE_ONCE
  * @type number
  * @default 0
  * @static
  * @since 0.1.0
  * @author hujiabao
  * */
  MQTTQueue.QoS_GUARANTEE_ONCE = 2;

  module.exports = MQTTQueue;
})();