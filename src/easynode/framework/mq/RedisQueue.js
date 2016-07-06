var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var IQueue = using('easynode.framework.mq.IQueue');
var redisWrapper = require('co-redis');
var redis = require('redis');

(function() {
        /**
         * Class RedisQueue
         *
         * @class easynode.framework.mq.RedisQueue
         * @extends easynode.framework.mq.IQueue
         * @since 0.1.0
         * @author hujiabao
         * */
  class RedisQueue extends IQueue {
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

    initialize(server = '127.0.0.1', port = 6379, opts = {}) {
      this.opts = opts;
      this._client = redisWrapper(redis.createClient(port, server, opts));
    }

    _doAuth() {
      var me = this;
      return function *() {
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
    publish(queueName = 'defaultQueue', opts = {}, ...msgs) {
      assert(msgs.length > 0, 'Invalid argument');
      var me = this;
      return function *() {
        if (yield me._doAuth()) {
          for (var i = 0; i < msgs.length; i++) {
            var s = JSON.stringify(msgs[i]);
            EasyNode.DEBUG && logger.debug(`publish message to redis queue [${queueName}] -> [${s}]`);
            yield me._client.publish(queueName, s);
          }
        }
        else {
          logger.error('redis authorize fail');
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
                 *                                              函数原型：onMessage (queueName, msg) {}，queueName类型：string，msg类型：object，
                 *                                                                 onError(err) {},  err : 错误实例
                 * @return {Object} 订阅实例，需要通过unsubscribe释放资源, 如果返回null则表示订阅失败
                 * @async
                 * @abstract
                 * @since 0.1.0
                 * @author hujiabao
                 * */
    subscribe(queueName = 'defaultQueue', opts = {}, l = null) {
      assert(l && typeof l.onMessage == 'function', 'Invalid argument');
      var me = this;
      return function *() {
        if (yield me._doAuth()) {
          yield me._client.subscribe(queueName);
          me._client.on('message', function(queueName, message) {
            EasyNode.DEBUG && logger.debug(`received a message from redis queue [${queueName}] -> [${message}}]`);
            l.onMessage(queueName, JSON.parse(message));
          });
          return {
            client: me._client
          };
        }
        else {
          logger.error('redis authorize fail');
          return null;
        }
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
        yield me._client.unsubscribe();
      };
    }

    getClassName() {
      return EasyNode.namespace(__filename);
    }
        }

  module.exports = RedisQueue;
})();
