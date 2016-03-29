'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var GenericObject = using('easynode.GenericObject');

(function () {
  /**
   * 抽象服务类，请不要直接实例化该类，因为它的主要函数都是抽象函数。
   *
   * @class easynode.framework.server.AbstractServer
   * @extends easynode.GenericObject
   * @since 0.1.0
   * @author hujiabao
   * */

  var AbstractServer = function (_GenericObject) {
    _inherits(AbstractServer, _GenericObject);

    /**
     * 构造函数。
     *
     * @method 构造函数
     * @protected
     * @param {String} name 服务名称
     * @param {int} port 服务端口
     * @since 0.1.0
     * @author hujiabao
     * */

    function AbstractServer(port) {
      var name = arguments.length <= 1 || arguments[1] === undefined ? 'no-name' : arguments[1];

      _classCallCheck(this, AbstractServer);

      //place code below

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(AbstractServer).call(this));

      if (typeof port != 'number' || isNaN(port)) {
        throw new TypeError('Invalid port number');
      }

      var me = _this;

      /**
       * 服务类型
       *
       * @property type
       * @type String
       * @since 0.1.0
       * @author hujiabao
       * */
      _this.type = 'unknown';

      /**
       * 服务端口
       *
       * @property port
       * @type int
       * @since 0.1.0
       * @author hujiabao
       * */
      _this.port = port;

      /**
       * 服务名称
       *
       * @property name
       * @type String
       * @since 0.1.0
       * @author hujiabao
       * */
      _this.name = name;

      /**
       * 服务ID，从EasyNode官方网站获取，配置项：easynode.app.id
       *
       * @property appId
       * @type String
       * @default "UNTITLED"
       * @since 0.1.0
       * @author hujiabao
       * */
      _this.appId = EasyNode.config('easynode.app.id', 'UNTITLED');

      /**
       * 应用密钥。配置项：easynode.app.key
       *
       * @property appKey
       * @type String
       * @default "EMPTY"
       * @since 0.1.0
       * @author hujiabao
       * */
      _this.appKey = EasyNode.config('easynode.app.key', 'EMPTY');

      /**
       * 服务是否已经处于启动状态
       *
       * @property _started
       * @type boolean
       * @private
       * @since 0.1.0
       * @author hujiabao
       * */
      var _started = false;
      _this.on('started', function () {
        _started = true;
      });
      _this.on('stop', function () {
        _started = false;
      });
      /**
       * 获取服务是否已经启动。
       *
       * @method isStarted
       * @return {boolean} 服务是否已经启动
       * @since 0.1.0
       * @author hujiabao
       * */
      _this.isStarted = function () {
        return _started;
      };

      /**
       * 服务是否处于暂停状态
       *
       * @property _paused
       * @type boolean
       * @private
       * @since 0.1.0
       * @author hujiabao
       * */
      var _paused = false;
      _this.on('pause', function () {
        _paused = true;
      });
      _this.on('resume', function () {
        _paused = false;
      });
      /**
       * 获取服务是否处于暂停状态
       *
       * @method isPausing
       * @return {boolean} 服务是否处于暂停状态
       * @since 0.1.0
       * @author hujiabao
       * */
      _this.isPausing = function () {
        return _paused;
      };
      return _this;
    }

    /**
     *  设置应用ID和密钥。
     *
     * @method setAppInfo
     * @param {String} appId 应用ID
     * @param {String} appKey 应用密钥
     * @since 0.1.0
     * @author hujiabao
     **/


    _createClass(AbstractServer, [{
      key: 'setAppInfo',
      value: function setAppInfo(appId, appKey) {
        this.appId = appId;
        this.appKey = appKey;
      }
    }, {
      key: 'getClassName',
      value: function getClassName() {
        return EasyNode.namespace(__filename);
      }

      /**
       *  设置服务的ActionContext监听器，用于向服务的ActionContext注入Action执行时必要成员。
       *
       * @method setActionContextListener
       * @param {easynode.framework.mvc.IActionContextListener} l ActionContext事件监听器
       * @abstract
       * @since 0.1.0
       * @author hujiabao
       **/

    }, {
      key: 'setActionContextListener',
      value: function setActionContextListener(l) {
        throw new Error('Abstract Method');
      }

      /**
       * 设置服务端口。
       *
       * @method setPort
       * @param {int} port 服务端口。
       * @since 0.1.0
       * @author hujiabao
       * @abstract
       * @async
       * */

    }, {
      key: 'setPort',
      value: function setPort(port) {
        assert(typeof port == 'number' && port > 0, 'Invalid port number');
        assert(!this.isRunning(), 'Can not change port while server running');
        this.port = port;
      }

      /**
       * 启动服务。子类实现时，请触发其started事件。
       *
       * @method start
       * @since 0.1.0
       * @author hujiabao
       * @abstract
       * @async
       * */

    }, {
      key: 'start',
      value: function start() {
        throw new Error('Abstract method');
      }

      /**
       * 停止服务。停止服务时，服务占用的网络端口将一并释放。子类实现时，请触发stop事件
       *
       * @method stop
       * @abstract
       * @async
       * @since 0.1.0
       * @author hujiabao
       * */

    }, {
      key: 'stop',
      value: function stop() {
        throw new Error('Abstract method');
      }

      /**
       * 立即暂停服务。与停止服务不同，暂停服务并不释放网络端口资源，也不丢弃网络数据包，仅无响应或响应服务暂停。
       * 子类实现时，请触发pause事件
       *
       * @method pause
       * @abstract
       * @since 0.1.0
       * @author hujiabao
       * */

    }, {
      key: 'pause',
      value: function pause() {
        throw new Error('Abstract method');
      }

      /**
       * 立即恢复服务，如果服务处于暂停状态。子类实现时，请触发resume事件。
       *
       * @method resume
       * @abstract
       * @since 0.1.0
       * @author hujiabao
       * */

    }, {
      key: 'resume',
      value: function resume() {
        throw new Error('Abstract method');
      }

      /**
       * 统计服务状态。
       *
       * @method stat
       * @abstract
       * @return {easynode.framework.server.ServerStat} 服务状态描述
       * @async
       * @since 0.1.0
       * @author hujiabao
       * */

    }, {
      key: 'stat',
      value: function stat() {
        throw new Error('Abstract method');
      }

      /**
       * 获取客户端连接列表。
       *
       * @method connections
       * @abstract
       * @return {Array} 客户端连接列表，每个客户端连接应至少包含一个token字标用于唯一标识一个客户端连接
       * @async
       * @since 0.1.0
       * @author hujiabao
       * */

    }, {
      key: 'connections',
      value: function connections() {
        throw new Error('Abstract method');
      }

      /**
       * 向客户端发送消息。
       *
       * @method send
       * @param {Array/String} clientTokens 客户端Token列表，客户端Token可以唯一识别一个客户端。传递Array时，
       *                                      向多个客户端发送消息
       * @param {Buffer} msg 消息体
       * @return {Array} 客户端列表
       * @abstract
       * @async
       * @since 0.1.0
       * @author hujiabao
       * */

    }, {
      key: 'send',
      value: function send(clientTokens, msg) {
        throw new Error('Abstract method');
      }

      /**
       * 向所有客户端广播消息。
       *
       * @method broadcast
       * @param {Buffer} msg 消息体
       * @return {Array} 客户端列表
       * @abstract
       * @async
       * @since 0.1.0
       * @author hujiabao
       * */

    }, {
      key: 'broadcast',
      value: function broadcast(msg) {
        throw new Error('Abstract method');
      }

      /**
       * 判定服务器是否处于运行状态
       *
       * @method isRunning
       * @return {boolean} 服务是否处于运行状态
       * @since 0.1.0
       * @author hujiabao
       * */

    }, {
      key: 'isRunning',
      value: function isRunning() {
        return this.isStarted() && !this.isPausing();
      }
    }]);

    return AbstractServer;
  }(GenericObject);

  /**
   * 服务开始启动前触发。
   *
   * @event before-start
   */


  AbstractServer.EVENT_BEFORE_START = 'before-start';

  /**
   * 服务启动后触发。
   *
   * @event started
   * @param {Error} err 启动时发生的错误，没有错误为null。
   * @param {boolean} result 启动结果，发生错误时为null，否则为true.
   */
  AbstractServer.EVENT_STARTED = 'started';

  /**
   * 服务开始停止前触发。
   *
   * @event before-stop
   */
  AbstractServer.EVENT_BEFORE_STOP = 'before-stop';

  /**
   * 停止后触发。
   *
   * @event stop
   * @param {Error} err 停止时发生的错误，没有错误为null。
   * @param {boolean} result 停止结果，发生错误时为null，否则为true.
   */
  AbstractServer.EVENT_STOP = 'stop';

  /**
   * 服务暂停时触发。
   *
   * @event before-start
   */
  AbstractServer.EVENT_PAUSE = 'pause';

  /**
   * 服务从暂停状态恢复时触发。
   *
   * @event resume
   */
  AbstractServer.EVENT_RESUME = 'resume';

  module.exports = AbstractServer;
})();