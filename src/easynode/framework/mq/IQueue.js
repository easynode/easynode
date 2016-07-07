var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var GenericObject = using('easynode.GenericObject');

(function() {
/**
 * Class IQueue
 *
 * @class easynode.framework.mq.IQueue
 * @extends easynode.GenericObject
 * @since 0.1.0
 * @author hujiabao
 * */
  class IQueue extends GenericObject {

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
     * 向队列发送消息。
     *
     * @method publish
     * @param {String} queueName 队列名称
     * @param {Object} opts 发送选项，取决于队列的协议和驱动程序
     * @param {Object} msgs JSON对象，可一次发送多条消息
     * @async
     * @abstract
     * @since 0.1.0
     * @author hujiabao
     * */
    publish(queueName, opts, ...msgs) {
        throw new Error('Abstract Method');
    }

    /**
     * 订阅队列消息。
     *
     * @method subscribe
     * @param {String} queueName 队列名称
     * @param {Object} opts 订阅选项，取决于队列的协议和驱动程序
     * @param {Object} l 队列监听器，具有一个onMessage函数，函数原型：onMessage (msg) {}，msg类型：object
     * @return {Object} 订阅实例，需要通过unsubscribe释放资源
     * @async
     * @abstract
     * @since 0.1.0
     * @author hujiabao
     * */
    subscribe(queueName, opts, l) {
        throw new Error('Abstract Method');
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
        throw new Error('Abstract Method');
    }

    getClassName() {
    return EasyNode.namespace(__filename);
    }
   }

  module.exports = IQueue;
})();
