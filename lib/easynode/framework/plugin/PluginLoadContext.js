'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var GenericObject = using('easynode.GenericObject');
var _ = require('underscore');

(function () {
  /**
   * 插件加载环境类PluginLoadContext
   *
   * @class easynode.framework.plugin.PluginLoadContext
   * @extends easynode.GenericObject
   * @since 0.1.0
   * @author hujiabao
   * */

  var PluginLoadContext = (function (_GenericObject) {
    _inherits(PluginLoadContext, _GenericObject);

    /**
     * 构造函数。
     *
     * @method 构造函数
     * @param {Object} opts 选项，参考PluginLoadContext的成员。
     * @since 0.1.0
     * @author hujiabao
     * */

    function PluginLoadContext(opts) {
      _classCallCheck(this, PluginLoadContext);

      //调用super()后再定义子类成员。

      /**
       * 数据源
       *
       * @property datasource
       * @type {easynode.framework.db.IDataSource}
       * @default null
       * @since 0.1.0
       * @author hujiabao
       * */

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(PluginLoadContext).call(this));

      _this.datasource = null;

      /**
       * 数据库名
       *
       * @property database
       * @type {String}
       * @default null
       * @since 0.1.0
       * @author hujiabao
       * */
      _this.database = null;

      /**
       * 缓存
       *
       * @property cache
       * @type {easynode.framework.cache.ICache}
       * @default null
       * @since 0.1.0
       * @author hujiabao
       * */
      _this.cache = null;

      /**
       * 队列实例
       *
       * @property mq
       * @type {easynode.framework.mq.IQueue}
       * @default null
       * @since 0.1.0
       * @author hujiabao
       * */
      _this.mq = null;

      /**
       * KOAHttpServer
       *
       * @property koaHttpServer
       * @type {easynode.framework.server.http.KOAHttpServer}
       * @default null
       * @since 0.1.0
       * @author hujiabao
       * */
      _this.koaHttpServer = null;

      _this.tcpServer = null;

      _this.udpServer = null;

      _this.wsServer = null;

      _.extend(_this, opts || {});
      return _this;
    }

    _createClass(PluginLoadContext, [{
      key: 'getClassName',
      value: function getClassName() {
        return EasyNode.namespace(__filename);
      }
    }]);

    return PluginLoadContext;
  })(GenericObject);

  module.exports = PluginLoadContext;
})();