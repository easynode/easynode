'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var assert = require('assert');
var Logger = using('easynode.framework.Logger');
var logger = Logger.forFile(__filename);
var GenericObject = using('easynode.GenericObject');
var VersionComparator = using('easynode.framework.util.VersionComparator');
var co = require('co');
var path = require('path');
var S = require('string');
var thunkify = require('thunkify');
var _ = require('underscore');
var fs = require('co-fs');
var Plugins = using('easynode.framework.plugin.Plugins');

(function () {
  /**
   * Class PluginDelegate
   *
   * @class easynode.framework.plugin.PluginDelegate
   * @extends easynode.GenericObject
   * @since 0.1.0
   * @author zlbbq
   * */

  var PluginDelegate = function (_GenericObject) {
    _inherits(PluginDelegate, _GenericObject);

    /**
     * 构造函数。
     *
     * @method 构造函数
     * @since 0.1.0
     * @author zlbbq
     * */

    function PluginDelegate() {
      _classCallCheck(this, PluginDelegate);

      // 调用super()后再定义子类成员。
      /**
       * 插件全名, $pluginName@$pluginVersion
       * @property pluginFullName
       * @type String
       * */

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(PluginDelegate).call(this));

      _this.pluginFullName = null;

      /**
       * 插件初始化参数
       * @property pluginOptions
       * @type Object
       * @default {}
       * */
      _this.pluginOptions = {};

      /**
       * 插件实例
       *
       * @property pluginInstance
       * @type easynode.framework.plugin.AbstractPlugin
       * @private
       * */
      _this.pluginInstance = null;
      return _this;
    }

    _createClass(PluginDelegate, [{
      key: 'initialize',
      value: function initialize() {
        assert(typeof this.pluginFullName === 'string' && this.pluginFullName, 'Invalid plugin full name');
        this.pluginInstance = Plugins.createPluginInstance(this.pluginFullName, this.pluginOptions);
        this._beginDelegate();
      }

      // TODO
      // babel在转译ES6的时候，会将定义的所有方法成员的enumerable设置成false，导致API方法不能被枚举到

    }, {
      key: '_beginDelegate',
      value: function _beginDelegate() {
        var keys = Object.getOwnPropertyNames(this.pluginInstance);
        logger.error(keys);

        for (var key in this.pluginInstance) {
          logger.error(key);
          var val = this.pluginInstance[key];
          if (typeof val !== 'function') {
            this.__defineGetter__(key, function () {
              return this.pluginInstance[key];
            });
            this.__defineSetter__(key, function (value) {
              this.pluginInstance[key] = value;
            });
          } else {
            var me = this;
            this[key] = function () {
              return me.pluginInstance[key].apply(me.pluginInstance, arguments);
            };
          }
        }
      }

      /**
       * 获取插件根目录，插件根目录: $EasyNode/plugins/$plugin。
       *
       * @method home
       * @return {String} 插件home目录。绝对目录。
       * @since 0.1.0
       * @author zlbbq
       * */

    }, {
      key: 'home',
      value: function home() {
        return EasyNode.real('plugins/' + this.name + '-' + this.version + '/');
      }
    }, {
      key: 'getClassName',
      value: function getClassName() {
        return EasyNode.namespace(__filename);
      }
    }]);

    return PluginDelegate;
  }(GenericObject);

  module.exports = PluginDelegate;
})();