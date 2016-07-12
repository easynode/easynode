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
   * Class AbstractPlugin
   *
   * @class easynode.framework.plugin.AbstractPlugin
   * @extends easynode.GenericObject
   * @since 0.1.0
   * @author zlbbq
   * */
  class AbstractPlugin extends GenericObject {
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
       * 插件名称
       * @property name
       * @type String
       * */
      this.name = null;

      /**
       * 插件版本，格式：major.minor.patch
       * @property version
       * @type String
       * @since 0.1.0
       * @author zlbbq
       * */
      this.version = null;

      /**
       * 插件简述，默认与插件名称一致。
       * @property brief
       * @type String
       * @since 0.1.0
       * @author zlbbq
       * */
      this.brief = this.name;

      /**
       * 插件详细描述
       * @property description
       * @type String
       * @default null
       * @since 0.1.0
       * @author zlbbq
       * */
      this.description = null;


      /**
       * 插件配置项
       * @property configurations
       * @type Object
       * @default {}
       * @since 0.1.0
       * @author zlbbq
       * */
      this.configurations = {};


      /**
       * 插件国际化配置项
       * @property i18nConfig
       * @type Object
       * @default {}
       * @since 0.1.0
       * @author zlbbq
       * */
      this.i18nConfig = {};

      /**
       * 插件依赖，格式：$pluginName@$pluginVersion
       *
       * @property dependencies
       * @type Array
       * @public
       * @default []
       * @since 0.1.0
       * @author zlbbq
       * */
      this.dependencies = [];
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

    /**
     * 获取指定插件资源的相对路径（相对于EasyNode Home目录）。plugins/$pluginName/$relative
     *
     * @method relative
     * @param {String} p 插件资源相对路径
     * @return {String} 插件资源目录，相对于EasyNode目录。
     * @since 0.1.0
     * @author zlbbq
     * */
    relative(p) {
      return path.join(`plugins/${this.name}-${this.version}/`, p);
    }

    /**
     * 获取指定插件资源的绝对路径。
     *
     * @method real
     * @param {String} p 插件资源相对路径
     * @return {String} 插件资源的绝对路径
     * @since 0.1.0
     * @author zlbbq
     * */
    real(p) {
      return path.join(this.home(), p);
    }

    /**
     * 引用插件目录下的某个class或某个package，注意不能使用全局的using（插件的多个版本可能具有同一个包名）。
     * ****请注意****：任何插件中的引用，都需要使用此函数替代全局using函数，因为插件包的src目录不在在全局源码目录。
     *
     * @method using
     * @param {String} namespace 类名或包名
     * @return {Object} namespace为类名时：Nodejs导出对象，namespace为包名时：此目录所有js文件的Nodejs导出对象
     * @since 0.1.0
     * @author zlbbq
     * */
    using(namespace) {
      return Plugins.using(namespace, this.getFullName());
    }

    /**
     * 获取插件全名，插件全名为：$name@$version
     *
     * @method getFullName
     * @return {String} 插件全名
     * @since 0.1.0
     * @author zlbbq
     * */
    getFullName() {
      return this.name + '@' + this.version;
    }

    /**
     * 读取插件描述文件，插件描述文件应该位于插件根目录下，命名为：$plugin.md，$plugin为插件名称。
     *
     * @method getDescription
     * @return {String} 插件描述
     * @async
     * @since 0.1.0
     * @author zlbbq
     * */

    getDescription() {
      var me = this;
      return function *() {
        if (me.description != null) {
          return me.description;
        }
        var descFile = me.real(`${this.name}.md`);
        var fnReadFile = thunkify(fs.readFile);
        var s = yield fnReadFile(descFile);
        s = s.toString();
        me.description = s;
        return s;
      };
    }

    /**
     * 初始化插件实例，注意：每次调用都会创建新的实例，创建的实例应由调用者维持它的生命周期。
     * options应由各插件自行定义数据结构。
     *
     * @method initialize
     * @param {Object} options 初始化插件实例
     * @abstract
     * @since 0.1.0
     * @author zlbbq
     * */
    initialize(options) {
      throw new Error('Abstract Method');
    }

    /**
     * 销毁插件实例，释放插件所用资源。
     *
     * @method finalize
     * @abstract
     * @since 0.1.0
     * @author zlbbq
     * */
    finalize() {
      throw new Error('Abstract Method');
    }

    /**
     * 设置或获取插件配置。
     *
     * @method config
     * @param {Object/String} item 配置项名称，当配置项为object并且只有一个参数时则合并配置项到插件配置
     * @param {String} defaultValue 默认值，默认为null
     * @since 0.1.0
     * @author zlbbq
     * */
    config(item, defaultValue = null) {
      if (typeof item == 'string') {
        return this.configurations[item] || defaultValue;
      }
      else if (typeof item == 'object' && arguments.length == 1) {
        _.extend(this.configurations, item || {});
      }
    }

    /**
     * 获取插件Web目录，插件Web目录为：$plugin/www/，要求插件目录下有且仅有一个以插件名命名的目录，否则视为无效Web目录。
     *
     * @method getWebDir
     * @return {String} 插件Web目录，没有www目录时返回null
     * @async
     * @since 0.1.0
     * @author zlbbq
     * */
    getWebDir() {
      var webDir = this.real('www/');
      var me = this;
      return function *() {
        var exists = yield fs.exists(path.join(webDir, me.name));
        if (exists) {
          var files = yield fs.readdir(webDir);
          if (files.length == 1) {
            return 'plugins/' + me.name + '/www/';
          }
          else {
            logger.error(`Unrecognized web directory of plugin [${me.name}]`);
          }
        }
      };
    }

    /**
     * 设置或获取插件国际化配置。
     *
     * @method i18n
     * @param {Object/String} item 配置项名称，当配置项为object并且只有一个参数时则合并配置项到插件国际化配置
     * @param {String} prefix 配置项前缀，如果传递此值，请始终传递__filename，__filename会被转成namespace(file) + '.' + name;
     * @since 0.1.0
     * @author zlbbq
     * */
    i18n(item, prefix, ...replaces) {
      if (typeof item == 'string') {
        if (prefix) {
          item = EasyNode.namespace(prefix) + '.' + item;
        }
        return this.i18nConfig[item] || item;
      }
      else if (typeof item == 'object' && arguments.length == 1) {
        _.extend(this.i18nConfig, item);
      }
    }

    /**
     * 获取插件i18n字符串。消息来自于i18n配置文件，i18n配置项为：plugin.$pluginName[.$subKey].$code
     *
     * @method formatString
     * @param {String} key string标识。
     * @param {String} subKey string子项，默认为null
     * @return {String} i18n字符串
     * @since 0.1.0
     * @author zlbbq
     * */
    formatString(key, subKey = null) {
      var item = 'plugin.' + this.name + '.' + (subKey ? (subKey + '.') : '') + key;
      return this.i18n(item, '');
    }

    /**
     * 获取插件i18n字符串 - 响应ActionResult专用。消息来自于i18n配置文件，i18n配置项为：plugin.$pluginName.results.$code
     *
     * @method formatResult
     * @param {String} key string标识。
     * @return {String} ActionResult i18n字符串
     * @since 0.1.0
     * @author zlbbq
     * */
    formatResult(key) {
      return this.formatString(key, 'results');
    }

    /**
     * 设置插件依赖。如果没有找到依赖的插件则抛出错误。
     *
     * @method depends
     * @param {...} plugins 插件，多参，每个参数为字符串类型。格式：$pluginName@$version
     * @return this 可链式调用
     * @since 0.1.0
     * @author zlbbq
     * */
    depends(...plugins) {
      this.dependencies = this.dependencies || [];
      this.dependencies = this.dependencies.concat(plugins);
      return this;
    }

    /**
     * 检查插件依赖，并返回未找到的依赖插件
     *
     * @method checkDependency
     * @return {Array} 未找到的依赖插件
     * @public
     * @since 0.1.0
     * @author zlbbq
     * */
    checkDependency() {
      var ret = [];
      this.dependencies = this.dependencies || [];
      this.dependencies.forEach((p) => {
        var inst = Plugins.exists(p);
        if (!inst) {
          ret.push(p);
        }
      });
      return ret;
    }

    /**
     * 覆盖GenericObject.toJSON()函数。
     *
     * @method toJSON
     * @since 0.1.0
     * @author zlbbq
     * */
    toJSON() {
      var o = {
        name : this.name,
        version : this.version,
        brief : this.brief,
        description : this.description,
        home : this.home()
      };
      return JSON.stringify(o);
    }

    static getPluginLogger(pluginFullName, fileName) {
      return Logger.getLogger('Plugin-' + pluginFullName + '-' + EasyNode.namespace(fileName));
    }

    getClassName() {
      return EasyNode.namespace(__filename);
    }
  }

  module.exports = AbstractPlugin;
})();
