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

(function() {
    /**
     * Class PluginDelegate
     *
     * @class easynode.framework.plugin.PluginDelegate
     * @extends easynode.GenericObject
     * @since 0.1.0
     * @author zlbbq
     * */
  class PluginDelegate extends GenericObject {
        /**
         * 构造函数。
         *
         * @method 构造函数
         * @since 0.1.0
         * @author zlbbq
         * */
    constructor() {
      super();
            // 调用super()后再定义子类成员。
            /**
             * 插件全名, $pluginName@$pluginVersion
             * @property pluginFullName
             * @type String
             * */
      this.pluginFullName = null;

            /**
             * 插件初始化参数
             * @property pluginOptions
             * @type Object
             * @default {}
             * */
      this.pluginOptions = {};

            /**
             * 插件实例
             *
             * @property pluginInstance
             * @type easynode.framework.plugin.AbstractPlugin
             * @private
             * */
      this.pluginInstance = null;
    }

    initialize() {
      assert(typeof this.pluginFullName === 'string' && this.pluginFullName, 'Invalid plugin full name');
      this.pluginInstance = Plugins.createPluginInstance(this.pluginFullName, this.pluginOptions);
      this._beginDelegate();
    }

        // TODO
        // babel在转译ES6的时候，会将定义的所有方法成员的enumerable设置成false，导致API方法不能被枚举到
    _beginDelegate() {
      var keys = Object.getOwnPropertyNames(this.pluginInstance);
      logger.error(keys);

      for (var key in this.pluginInstance) {
        logger.error(key);
        var val = this.pluginInstance[key];
        if (typeof val !== 'function') {
          this.__defineGetter__(key, function() {
            return this.pluginInstance[key];
          });
          this.__defineSetter__(key, function(value) {
            this.pluginInstance[key] = value;
          });
        }
        else {
          var me = this;
          this[key] = function() {
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
    home() {
      return EasyNode.real(`plugins/${this.name}-${this.version}/`);
    }

    getClassName() {
      return EasyNode.namespace(__filename);
    }
    }

  module.exports = PluginDelegate;
})();
