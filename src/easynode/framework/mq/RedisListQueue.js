var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var IQueue = using('easynode.framework.mq.IQueue');
var redisWrapper = require('co-redis');
var redis = require('redis');
var thunkify = require('thunkify');

(function() {

  function _sleep(t, callback) {
    setTimeout(function() {
      callback(null, null);
    }, t);
  }

  function *sleep(t) {
    var fnSleep = thunkify(_sleep);
    yield fnSleep.call(null, t);
  }

/**
 * Class RedisListQueue
 *
 * @class easynode.framework.mq.RedisListQueue
 * @extends easynode.framework.mq.IQueue
 * @since 0.1.0
 * @author hujiabao
 * */
  class RedisListQueue extends IQueue {

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
      this._client_original = redis.createClient(port, server, opts);
      this._client = redisWrapper(this._client_original);
    }

    _doAuth() {
      var me = this;
      return function *() {
        if (me.opts.password) {
          if (me._didAuth !== true) {
            me._disAuth = true;
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
            yield me._client.lpush(queueName, s);
          }
        }
        else {
          logger.error('redis authorize fail');
        }
      };
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
    subscribe(queueName = 'defaultQueue', opts = {FIFO : true}, l = null) {
      logger.warn('***Subscribe a redis list will block any code below !!!');
      assert(l && typeof l.onMessage == 'function', 'Invalid message listener');
      var me = this;
      return function *() {
        if (yield me._doAuth()) {
          var working = true;
          while (true) {
            try {
              if (l.pause === true) {
                yield sleep(1000);
                yield l.onMessage(queueName, null);
                continue;
              }
              var m = null;
              if (opts && !opts.FILO) {
                m = yield me._client.rpop(queueName);
              }
              else {
                m = yield me._client.lpop(queueName);
              }
              if (m) {
                yield l.onMessage(queueName, JSON.parse(m));
              }
              else {
                yield sleep(20);
              }
              if (!working) {
                working = true;
                logger.info('subscribe restore');
              }
            } catch (e) {
              if (typeof l.onError == 'function') {
                l.onError.call(null, e);
              }
              if (working) {
                logger.error('subscribe broken');
              }
              working = false;
            }
          }
        }
        else {
          logger.error('redis authorize fail');
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
      throw new Error('Unsubscribe is not supported on list model');
    }

    getClassName() {
      return EasyNode.namespace(__filename);
    }
  }

  module.exports = RedisListQueue;
})();
