var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var GenericObject = using('easynode.GenericObject');

(function() {
        /**
         * 抽象服务类，请不要直接实例化该类，因为它的主要函数都是抽象函数。
         *
         * @class easynode.framework.server.AbstractServer
         * @extends easynode.GenericObject
         * @since 0.1.0
         * @author hujiabao
         * */
  class AbstractServer extends GenericObject {
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
    constructor(port, name = 'no-name') {
      super();
                        // place code below
      if (typeof port != 'number' || isNaN(port)) {
        throw new TypeError('Invalid port number');
      }

      var me = this;

                        /**
                         * 服务类型
                         *
                         * @property type
                         * @type String
                         * @since 0.1.0
                         * @author hujiabao
                         * */
      this.type = 'unknown';

                        /**
                         * 服务端口
                         *
                         * @property port
                         * @type int
                         * @since 0.1.0
                         * @author hujiabao
                         * */
      this.port = port;

                        /**
                         * 服务名称
                         *
                         * @property name
                         * @type String
                         * @since 0.1.0
                         * @author hujiabao
                         * */
      this.name = name;

                        /**
                         * 服务ID，从EasyNode官方网站获取，配置项：easynode.app.id
                         *
                         * @property appId
                         * @type String
                         * @default "UNTITLED"
                         * @since 0.1.0
                         * @author hujiabao
                         * */
      this.appId = EasyNode.config('easynode.app.id', 'UNTITLED');

                        /**
                         * 应用密钥。配置项：easynode.app.key
                         *
                         * @property appKey
                         * @type String
                         * @default "EMPTY"
                         * @since 0.1.0
                         * @author hujiabao
                         * */
      this.appKey = EasyNode.config('easynode.app.key', 'EMPTY');


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
      this.on('started', function() {
        _started = true;
      });
      this.on('stop', function() {
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
      this.isStarted = function() {
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
      this.on('pause', function() {
        _paused = true;
      });
      this.on('resume', function() {
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
      this.isPausing = function() {
        return _paused;
      };
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
    setAppInfo(appId, appKey) {
      this.appId = appId;
      this.appKey = appKey;
    }

    getClassName() {
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
    setActionContextListener(l) {
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
    setPort(port) {
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
    start() {
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
    stop() {
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
    pause() {
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
    resume() {
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
    stat() {
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
    connections() {
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
    send(clientTokens, msg) {
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
    broadcast(msg) {
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
    isRunning() {
      return this.isStarted() && !this.isPausing();
    }
        }

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
