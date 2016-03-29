'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var GenericObject = using('easynode.GenericObject');
var S = require('string');

(function () {
  /**
   * Class ActionContext
   *
   * @class easynode.framework.mvc.ActionContext
   * @extends easynode.GenericObject
   * @abstract
   * @since 0.1.0
   * @author hujiabao
   * */

  var ActionContext = function (_GenericObject) {
    _inherits(ActionContext, _GenericObject);

    /**
     * 构造函数。
     *
     * @method 构造函数
     * @since 0.1.0
     * @author hujiabao
     * */

    function ActionContext(m, a) {
      _classCallCheck(this, ActionContext);

      //调用super()后再定义子类成员。
      /**
       * Action实例。通过setAction和getAction存取。
       *
       * @property action
       * @type easynode.framework.mvc.Action 子类实例
       * @protected
       * @since 0.1.0
       * @author hujiabao
       * */

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ActionContext).call(this));

      _this.action = null;

      /**
       *  easynode.framework.cache.ICache实例。
       *
       * @property cache
       * @type easynode.framework.cache.ICache实例
       * @since 0.1.0
       * @author hujiabao
       * */
      _this.cache = null;

      /**
       *  easynode.framework.db.IConnection实例。
       *
       * @property connection
       * @type easynode.framework.db.IConnection实例
       * @since 0.1.0
       * @author hujiabao
       * */
      _this.connection = null;

      /**
       *  easynode.framework.mq.IQueue实例。
       *
       * @property queue
       * @type easynode.framework.mq.IQueue实例
       * @since 0.1.0
       * @author hujiabao
       * */
      _this.queue = null;

      /**
       *  远程地址(客户端地址)。
       *
       * @property remoteAddress
       * @type String
       * @since 0.1.0
       * @author hujiabao
       * */
      _this.remoteAddress = null;

      /**
       *  模块名。
       *
       * @property moduleName
       * @type String
       * @since 0.1.0
       * @author hujiabao
       * */
      _this.moduleName = m;
      /**
       *  Action名。
       *
       * @property actionName
       * @type String
       * @since 0.1.0
       * @author hujiabao
       * */
      _this.actionName = a;
      return _this;
    }

    /**
     * set action成员。
     *
     * @method setAction
     * @param {easynode.framework.mvc.Action} action Action实例。
     * @since 0.1.0
     * @author hujiabao
     * */


    _createClass(ActionContext, [{
      key: 'setAction',
      value: function setAction(action) {
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

    }, {
      key: 'getAction',
      value: function getAction() {
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

    }, {
      key: 'param',
      value: function param(name) {
        var defaultValue = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

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

    }, {
      key: 'setParam',
      value: function setParam(name, val) {
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

    }, {
      key: 'params',
      value: function params() {
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

    }, {
      key: 'setCache',
      value: function setCache(cache) {
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

    }, {
      key: 'setRemoteAddress',
      value: function setRemoteAddress(remoteAddress) {
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

    }, {
      key: 'getRemoteAddress',
      value: function getRemoteAddress() {
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

    }, {
      key: 'getCache',
      value: function getCache() {
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

    }, {
      key: 'setConnection',
      value: function setConnection(connection) {
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

    }, {
      key: 'getConnection',
      value: function getConnection() {
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

    }, {
      key: 'setQueue',
      value: function setQueue(queue) {
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

    }, {
      key: 'getQueue',
      value: function getQueue() {
        return this.queue;
      }
    }, {
      key: 'getClassName',
      value: function getClassName() {
        return EasyNode.namespace(__filename);
      }
    }]);

    return ActionContext;
  }(GenericObject);

  module.exports = ActionContext;
})();