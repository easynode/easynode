var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var GenericObject = using('easynode.GenericObject');
var VersionComparator = using('easynode.framework.util.VersionComparator');
var co = require('co');
var path = require('path');
var S = require('string');
var thunkify = require('thunkify');
var _ = require('underscore');
var fs = require('co-fs');

(function() {
        // 插件名列表，有序
  var _pluginList = [];

        // 插件实例
  var _plugins = {};

        /**
         * Class EasyNodePlugin
         *
         * @class easynode.framework.plugin.EasyNodePlugin
         * @extends easynode.GenericObject
         * @since 0.1.0
         * @author hujiabao
         * */
  class EasyNodePlugin extends GenericObject {
                /**
                 * 构造函数。
                 *
                 * @method 构造函数
                 * @param {String} name 插件名称
                 * @param {String} version 插件版本，默认'0.0.1'
                 * @since 0.1.0
                 * @author hujiabao
                 * */
    constructor(name, version = '0.0.1') {
      super();
                        // 调用super()后再定义子类成员。
      assert(!S(name).isEmpty(), 'Plugin must be named');

                        /**
                         * 插件名称
                         * @property name
                         * @type String
                         * */
      this.name = name;

                        /**
                         * 插件版本，格式：major.minor.patch
                         * @property version
                         * @type String
                         * @since 0.1.0
                         * @author hujiabao
                         * */
      this.version = version;

                        /**
                         * 插件简述，默认与插件名称一致。
                         * @property brief
                         * @type String
                         * @since 0.1.0
                         * @author hujiabao
                         * */
      this.brief = this.name;

                        /**
                         * 插件详细描述
                         * @property description
                         * @type String
                         * @default null
                         * @since 0.1.0
                         * @author hujiabao
                         * */
      this.description = null;


                        /**
                         * 插件配置项
                         * @property configurations
                         * @type Object
                         * @default {}
                         * @since 0.1.0
                         * @author hujiabao
                         * */
      this.configurations = {};


                        /**
                         * 插件国际化配置项
                         * @property i18nConfig
                         * @type Object
                         * @default {}
                         * @since 0.1.0
                         * @author hujiabao
                         * */
      this.i18nConfig = {};


                        /**
                         * 是否已经加载
                         * @property _load
                         * @type boolean
                         * @private
                         * @default {}
                         * @since 0.1.0
                         * @author hujiabao
                         * */
      this._load = false;
    }

                /**
                 * 获取插件根目录，插件根目录: $EasyNode/plugins/$plugin。
                 *
                 * @method home
                 * @return {String} 插件home目录。绝对目录。
                 * @since 0.1.0
                 * @author hujiabao
                 * */
    home() {
      return EasyNode.real(`plugins/${this.name}/`);
    }

                /**
                 * 获取指定插件资源的相对路径（相对于EasyNode Home目录）。plugins/$pluginName/$relative
                 *
                 * @method relative
                 * @param {String} p 插件资源相对路径
                 * @return {String} 插件资源目录，相对于EasyNode目录。
                 * @since 0.1.0
                 * @author hujiabao
                 * */
    relative(p) {
      return path.join(`plugins/${this.name}/`, p);
    }

                /**
                 * 获取指定插件资源的绝对路径。
                 *
                 * @method real
                 * @param {String} p 插件资源相对路径
                 * @return {String} 插件资源的绝对路径
                 * @since 0.1.0
                 * @author hujiabao
                 * */
    real(p) {
      return path.join(this.home(), p);
    }

                /**
                 * 插件是否已经加载。
                 *
                 * @method isLoad
                 * @return {boolean} 是否已经加载
                 * @since 0.1.0
                 * @author hujiabao
                 * */
    isLoad() {
      return this._load;
    }

                /**
                 * 读取插件描述文件，插件描述文件应该位于插件根目录下，命名为：$plugin.md，$plugin为插件名称。
                 *
                 * @method getDescription
                 * @async
                 * @since 0.1.0
                 * @author hujiabao
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
                 * 初始化插件。
                 *
                 * @method initialize
                 * @param {easynode.framework.plugin.PluginLoadContext} loadCtx 插件加载环境
                 * @async
                 * @since 0.1.0
                 * @author hujiabao
                 * */
    initialize(loadCtx) {
      return function *() {

      };
    }

                /**
                 * 设置或获取插件配置。
                 *
                 * @method config
                 * @param {Object/String} item 配置项名称，当配置项为object并且只有一个参数时则合并配置项到插件配置
                 * @param {String} defaultValue 默认值，默认为null
                 * @since 0.1.0
                 * @author hujiabao
                 * */
    config(item, defaultValue = null) {
      if (typeof item == 'string') {
        return this.configurations[item] || defaultValue;
      }
      else if (typeof item == 'object' && arguments.length == 1) {
        _.extend(this.configurations, item);
      }
    }

                /**
                 * 获取插件Web目录，插件Web目录为：$plugin/www/，要求插件目录下有且仅有一个以插件名命名的目录，否则视为无效Web目录。
                 *
                 * @method getWebDir
                 * @return {String} 插件Web目录，没有www目录时返回null
                 * @async
                 * @since 0.1.0
                 * @author hujiabao
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
                 * @author hujiabao
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
                 * @author hujiabao
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
                 * @author hujiabao
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
                 * @author hujiabao
                 * */
    depends(...plugins) {
      this.dependencies = this.dependencies || [];
      this.dependencies = this.dependencies.concat(plugins);
      return this;
    }

                /**
                 * 检查插件依赖
                 *
                 * @method checkDependency
                 * @since 0.1.0
                 * @author hujiabao
                 * */
    checkDependency() {
      this.dependencies = this.dependencies || [];
      this.dependencies.forEach((p) => {
        var [name, version] = p.split('@');
        var inst = EasyNodePlugin.getPlugin(name, version);
        if (!inst) {
          throw new Error(`Dependency error, plugin [${this.name}] depends [${name}${version ? '@' + version : ''}], but depended plugin is not found or version is too low`);
        }
      });
    }


                /**
                 * 覆盖GenericObject.toJSON()函数。
                 *
                 * @method toJSON
                 * @since 0.1.0
                 * @author hujiabao
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


                /**
                 * 读取easynode.plugins配置项，按配置项顺序加载EasyNode插件，请注意插件的依赖关系。<br/>
                 * easynode.plugins配置项示例：plugin1,plugin2,plugin3<br/>
                 * 所有的EasyNode插件应位于$EasyNode/plugins目录。例：$EasyNode/plugins/plugin1/<br/>
                 * 在插件目录下增加一个.ignore文件可忽略该插件的加载。<br/>
                 * 执行流程<br/>
                 * <pre>
                 *       插件加载流程如下：
                 *      1. 将插件目录下的src(开发)或lib(测试或线上)目录加入到EasyNode源码目录
                 *      2. 读取插件目录下的etc目录下$plugin.conf文件（注意：不递归加载），视为配置文件并加载到插件配置，conf文件格式同EasyNode.conf
                 *      3. 读取插件目录下的etc/i18n目录下的与EasyNode Locale设定相同的.conf文件，作为国际化文件加载
                 *      4. 加载插件目录下的src/$pluginName_PluginEntry.js，要求该文件导出的是一个easynode.framework.plugin.EasyNodePlugin类的子类
                 *      5. 实例化上一步骤的导出类，创建插件实例，并将读取的配置文件通过config和i18n函数配置
                 *      6. 注册插件到插件库，等待检查依赖关系后初始化
                 *      上述步骤完成后，开始插件启动流程，插件启动流程如下：
                 *      1. 调用插件实例的checkDependency函数
                 *      2. 调用插件的实例的initialize函数初始化插件，插件需要定义Action、路由、中间件均可以在此函数中实现，这是一个异步函数
                 *      3. 加载插件www目录到KOAHttpServer的Web目录，如果PluginLoadContext中定义了KOAHttpServer实例。
                 * </pre>
                 *
                 * @method load
                 * @param {easynode.framework.plugin.PluginLoadContext} loadCtx 加载上下文环境
                 * @static
                 * @async
                 * @since 0.1.0
                 * @author hujiabao
                 * */
    static load(loadCtx) {
      function *readConfig(pluginName, dir, pattern = /^.*\.conf$/) {
        var exists = yield fs.exists(dir);
        if (!exists) {
          return {};
        }
        var files = yield fs.readdir(dir);
        var ret = {};
        for (var i = 0; i < files.length; i++) {
          var f = path.join(dir, files[i]);
          if (f.match(pattern)) {
            var cfg = yield fs.readFile(f);
            cfg = cfg.toString().split('\n');
            cfg.forEach(function(c) {
              if (c && c[0] != '#') {          // #is a comment flag
                c = c.split('=');
                c[0] = c[0] && S(c[0]).trim().toString();
                c[1] = c[1] && S(c[1]).trim().toString();
                if (ret[c[0]] !== undefined) {
                  logger.warn(`Duplicated config item in plugin [${pluginName}]: [${c[0]}]`);
                }
                ret[c[0]] = c[1];
              }
            });
          }
        }
        return ret;
      }

      var pluginFolder = EasyNode.real('plugins/');
      var locale = EasyNode.getLocale();
      return function *() {
        var files = yield fs.readdir(pluginFolder);
        for (var i = 0; i < files.length; i++) {
          var pluginFolderName = files[i];
          var f = path.join(pluginFolder, pluginFolderName);
          var stat = yield fs.stat(f);
          if (stat.isDirectory()) {
            try {
              var isIgnore = yield fs.exists(path.join(f, '.ignore'));
              if (isIgnore) {
                logger.info(`ignore plugin [${pluginFolderName}]`);
                continue;
              }
              EasyNode.DEBUG && logger.debug(`found plugin directory [${pluginFolderName}]...`);
              EasyNode.addSourceDirectory('plugins/' + pluginFolderName + '/src');
              EasyNode.addConfigFile('plugins/' + pluginFolderName + '/etc/' + pluginFolderName + '.conf');
              var locale = EasyNode.getLocale();
              var pluginConf = yield readConfig(pluginFolderName, path.join(f, 'etc/'), new RegExp(pluginFolderName + '.conf'));
              var i18nConf = yield readConfig(pluginFolderName, path.join(f, 'etc/i18n/'), new RegExp(locale + '.conf'));
              var PluginEntryClass = require(path.join(f, 'src/' + pluginFolderName + '_PluginEntry.js'));
              var pluginInstance = new PluginEntryClass();
              if (!(pluginInstance instanceof EasyNodePlugin)) {
                throw new Error(`Invalid plugin entry [${pluginFolderName}]`);
              }
              logger.info(`loading plugin [${pluginInstance.name}@${pluginInstance.version}]`);
              if (pluginInstance.name != pluginFolderName) {
                throw new Error(`Unmatched plugin name and folder [${pluginInstance.name}]->[${pluginFolderName}]`);
              }
              pluginInstance.config(pluginConf);
              pluginInstance.i18n(i18nConf);
              _plugins[pluginInstance.name] = pluginInstance;
              _pluginList.push(pluginInstance.name);
              EasyNode.DEBUG && logger.debug(`plugin [${pluginInstance.name}@${pluginInstance.version}] is load, preparing to initialize...`);
            } catch (e) {
              logger.error(`Bad plugin package [${pluginFolderName}]`);
              logger.error(e);
            }
          }
        }

        for (var i = 0; i < _pluginList.length; i++) {
          try {
            var pluginInstance = EasyNodePlugin.getPlugin(_pluginList[i]);
            EasyNode.DEBUG && logger.debug(`initializing plugin [${pluginInstance.name}@${pluginInstance.version}]...`);
            EasyNode.DEBUG && logger.debug('checking dependency...');
            pluginInstance.checkDependency();
            yield pluginInstance.initialize(loadCtx);
            var webDir = yield pluginInstance.getWebDir();
            if (loadCtx.koaHttpServer && webDir) {
              EasyNode.DEBUG && logger.debug(`registering plugin web directory [/${pluginInstance.name}]...`);
              loadCtx.koaHttpServer.addWebDirs(webDir);
            }
            pluginInstance._load = true;
            logger.info(`plugin [${pluginInstance.name}@${pluginInstance.version}] is initialized`);
          } catch (e) {
            logger.error(`initialize plugin [${pluginInstance.name}] failed`);
            logger.error(e.stack);
          }
        }
      };
    }

                /**
                 * 获取插件实例。
                 *
                 * @method getPlugin
                 * @param {String} name 插件名，可按$name@$version格式只传递一个name参数
                 * @param {String} version 插件最低版本，可不传
                 * @static
                 * @since 0.1.0
                 * @author hujiabao
                 * */
    static getPlugin(name, version) {
      if (arguments.length == 1) {
        [name, version] = name.split('@');
      }
      var plugin = _plugins[name];
      if (plugin && version) {
        if (VersionComparator.compare(plugin.version, version) >= 0) {
          return plugin;
        }
        else {
          return null;
        }
      }
      return plugin;
    }

                /**
                 * 返回系统插件情况。
                 *
                 * @method plugins
                 * @param {boolean} detail 是否获取详细信息，默认false。false时仅返回插件名列表，true时，返回插件的详细信息
                 * @static
                 * @since 0.1.0
                 * @author hujiabao
                 * */
    static plugins(detail = false) {
      if (!detail) {
        return _.clone(_pluginList);
      }
      else {
        var list = [];
        for (var name in _plugins) {
          var inst = _plugins[name];
          var o = {
            name : name,
            version : inst.version,
            brief : inst.brief,
            description : inst.description,
            load : inst.isLoad()
          };
          list.push(o);
        }
        return list;
      }
    }

    getClassName() {
      return EasyNode.namespace(__filename);
    }
        }

  module.exports = EasyNodePlugin;
})();
