var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var IQueue = using('easynode.framework.mq.IQueue');
var GenericPool = require('generic-pool');
var mqtt = require('mqtt');
var _ = require('underscore');
var thunkify = require('thunkify');

(function() {
  const DEFAULT_POOL_OPTS = {
    min: 2,
    max: 10,
    idleTimeoutMillis: 30000,
    log: false
  };

  const DEFAULT_CONNECT_OPTS = {
    maxWaitCount : 100,
    waitForConnections : true,
    connectTimeout : 1000
  };

      /**
       * Class MQTTQueue
       *
       * @class easynode.framework.queue.MQTTQueue
       * @extends easynode.framework.mq.IQueue
       * @since 0.1.0
       * @author hujiabao
       * */
    class MQTTQueue extends IQueue {

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
          initialize(url = 'mqtt://127.0.0.1', name = 'mqtt', poolOpts = DEFAULT_POOL_OPTS, connectOpts = DEFAULT_CONNECT_OPTS) {
            var me = this;
            this.url = url;
            this.poolOpts = poolOpts;
            this.connectOpts = connectOpts;
            var poolArgs = _.extend(poolOpts, {
              name: name,
              create: function(callback) {
                var client = mqtt.connect(url, connectOpts);
                setTimeout(function() {
                  if (!client.connected) {
                    client.end();
                    callback(null, client);
                  }
                }, connectOpts.connectTimeout || 1000);


                client.once('connect', function() {
                  client.once('offline', function() {
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

              destroy: function(client) {
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
        static getDefaultOpts() {
          return {qos: MQTTQueue.QoS_NORMAL, retain: false};
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
        publish(queueName = 'defaultQueue', opts = {qos: MQTTQueue.QoS_NORMAL, retain: false}, ...msgs) {
          assert(msgs.length > 0, 'Invalid argument');
          opts = opts || MQTTQueue.getDefaultOpts();
          var me = this;
          return function *() {
            if (me.pool.availableObjectsCount() == 0 && me.pool.waitingClientsCount() >= me.connectOpts.maxWaitCount) {
              logger.warn('No more available mqtt clients, ***WARNING: acquire suspending will happen');
              if (me.connectOpts.waitForConnections !== true) {
                return false;
              }
            }
            var fnAcquire = thunkify(me.pool.acquire);
            var client = yield fnAcquire.call(me.pool);
            if (client.connected === true) {
              var fnPublish = thunkify(client.publish);
              for (var i = 0; i < msgs.length; i++) {
                var s = JSON.stringify(msgs[i]);
                EasyNode.DEBUG && logger.debug(`send to mqtt queue[${me.url}]: ${s}`);
                yield fnPublish.call(client, queueName, s, opts);
              }
              me.pool.release(client);
              return true;
            }
            else {
              me.pool.destroy(client);
              logger.error(`Can not connect to mqtt [${me.url}]`);
              return false;
            }
          };
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
          subscribe(queueName = 'defaultQueue', opts = {qos: MQTTQueue.QoS_NORMAL}, l = null) {
            assert(l && typeof l.onMessage == 'function', 'Invalid argument');
            opts = opts || {qos: MQTTQueue.QoS_NORMAL};
            var me = this;
            return function *() {
              if (me.pool.availableObjectsCount() == 0 && me.pool.waitingClientsCount() >= me.connectOpts.maxWaitCount) {
                logger.warn('No more available mqtt clients, ***WARNING: acquire suspending will happen');
                if (me.connectOpts.waitForConnections !== true) {
                  return null;
                }
              }
              var fnAcquire = thunkify(me.pool.acquire);
              var client = yield fnAcquire.call(me.pool);
              if (!client.connected) {
                me.pool.destroy(client);
                logger.error(`Can not connect to mqtt [${me.url}]`);
                return null;
              }
              var fnSubscribe = thunkify(client.subscribe);
              yield fnSubscribe.call(client, queueName, opts);
              client.on('message', function(queueName, msg) {
                try {
                  msg = JSON.parse(msg);
                  l.onMessage(queueName, msg);
                } catch (e) {
                  logger.error(`Invalid queued string [${msg}] serialized fail`);
                }
              });
              client.once('offline', function() {
                if (typeof l.onError == 'function') {
                  l.onError(new Error('offline'));
                }
              });
              return {
                client : client
              };
            };
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
        unsubscribe(subscribeInst) {
          assert(subscribeInst && subscribeInst.client, 'Invalid argument');
          var me = this;
          return function *() {
            me.pool.release(subscribeInst.client);
          };
        }

        getClassName() {
          return EasyNode.namespace(__filename);
        }

      }

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
