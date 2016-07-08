var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var GenericObject = using('easynode.GenericObject');
var S = require('string');

(function() {

    /**
     * Class ActionContext
     *
     * @class easynode.framework.mvc.ActionContext
     * @extends easynode.GenericObject
     * @abstract
     * @since 0.1.0
     * @author hujiabao
     * */
  class ActionContext extends GenericObject {

    /**
     * 构造函数。
     *
     * @method 构造函数
     * @since 0.1.0
     * @author hujiabao
     * */
    constructor(m, a) {
      super();
      // 调用super()后再定义子类成员。

      /**
       * Action实例。通过setAction和getAction存取。
       *
       * @property action
       * @type easynode.framework.mvc.Action 子类实例
       * @protected
       * @since 0.1.0
       * @author hujiabao
       * */
        this.action = null;

      /**
       *  easynode.framework.cache.ICache实例。
       *
       * @property cache
       * @type easynode.framework.cache.ICache实例
       * @since 0.1.0
       * @author hujiabao
       * */
        this.cache = null;

      /**
       *  easynode.framework.db.IConnection实例。
       *
       * @property connection
       * @type easynode.framework.db.IConnection实例
       * @since 0.1.0
       * @author hujiabao
       * */
        this.connection = null;

      /**
       *  easynode.framework.mq.IQueue实例。
       *
       * @property queue
       * @type easynode.framework.mq.IQueue实例
       * @since 0.1.0
       * @author hujiabao
       * */
        this.queue = null;

      /**
       *  远程地址(客户端地址)。
       *
       * @property remoteAddress
       * @type String
       * @since 0.1.0
       * @author hujiabao
       * */
        this.remoteAddress = null;

      /**
       *  模块名。
       *
       * @property moduleName
       * @type String
       * @since 0.1.0
       * @author hujiabao
       * */
        this.moduleName = m;

      /**
       *  Action名。
       *
       * @property actionName
       * @type String
       * @since 0.1.0
       * @author hujiabao
       * */
        this.actionName = a;
    }

    /**
     * set action成员。
     *
     * @method setAction
     * @param {easynode.framework.mvc.Action} action Action实例。
     * @since 0.1.0
     * @author hujiabao
     * */
    setAction(action) {
      this.action = action;
    }

    /**
     * get action成员。
     *
     * @method getAction
     * @return {easynode.framework.mvc.Action} Action实例。
     * @since 0.1.0
     * @author hujiabao
     * */
    getAction() {
      return this.action;
    }

    /**
     * 获取此上下文环境中指定名称的参数值。
     *
     * @method param
     * @param {String} name 参数名
     * @param {Object} defaultValue 默认值，默认为null
     * @return {any}
     * @since 0.1.0
     * @author hujiabao
     * */
    param(name, defaultValue = null) {
      throw new Error('Abstract Method');
    }

    /**
     * 设置参数值。
     *
     * @method setParam
     * @param {String} name 参数名
     * @param {String} val 参数值
     * @abstract
     * @since 0.1.0
     * @author hujiabao
     * */
    setParam(name, val) {
      throw new Error('Abstract Method');
    }

    /**
     * 获取此上下文环境中指所有的参数。
     *
     * @method params
     * @return {Object} json对象
     * @since 0.1.0
     * @author hujiabao
     * */
    params() {
      throw new Error('Abstract Method');
    }

    /**
     * 为ActionContext增加cache支持。
     *
     * @method setCache
     * @param {easynode.framework.cache.ICache} cache cache实例
     * @since 0.1.0
     * @author hujiabao
     * */
    setCache(cache) {
      this.cache = cache;
    }


    /**
     * 设置远程地址。
     *
     * @method setRemoteAddress
     * @param {String} remoteAddress 远程IP地址
     * @since 0.1.0
     * @author hujiabao
     * */
    setRemoteAddress(remoteAddress) {
      this.remoteAddress = remoteAddress;
    }

    /**
     * 获取远程地址。
     *
     * @method getRemoteAddress
     * @return {String} remoteAddress 远程IP地址
     * @since 0.1.0
     * @author hujiabao
     * */
    getRemoteAddress() {
      return this.remoteAddress;
    }


    /**
     * 获取cache实例。
     *
     * @method getCache
     * @return {easynode.framework.cache.ICache} cache实例
     * @since 0.1.0
     * @author hujiabao
     * */
    getCache() {
      return this.cache;
    }

    /**
     * 为ActionContext增加数据库支持。
     *
     * @method setCache
     * @param {easynode.framework.cache.IConnection} connection 数据库连接实例
     * @since 0.1.0
     * @author hujiabao
     * */
    setConnection(connection) {
      this.connection = connection;
    }

    /**
     * 获取数据库连接实例。
     *
     * @method getConnection
     * @return {easynode.framework.cache.IConnection} 数据库连接实例
     * @since 0.1.0
     * @author hujiabao
     * */
    getConnection() {
      return this.connection;
    }

    /**
     * 为ActionContext增加队列支持。
     *
     * @method setQueue
     * @param {easynode.framework.mq.IQueue} queue 队列实例
     * @since 0.1.0
     * @author hujiabao
     * */
    setQueue(queue) {
      this.queue = queue;
    }

    /**
     * 获取队列连接实例。
     *
     * @method getQueue
     * @return {easynode.framework.mq.IQueue} 队列连接实例
     * @since 0.1.0
     * @author hujiabao
     * */
    getQueue() {
      return this.queue;
    }

    getClassName() {
      return EasyNode.namespace(__filename);
    }

  }

  module.exports = ActionContext;
})();
