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
var util = require('util');

(function() {
  var _pluginEntries = {};
  var _pluginConfigs = {};
  var _namespaceCache = {};

        /**
         * Class Plugins
         *
         * @class easynode.framework.plugin.Plugins
         * @extends easynode.GenericObject
         * @since 0.1.0
         * @author hujiabao
         * */
  class Plugins extends GenericObject {

                /**
                 * 构造函数。
                 *
                 * @method 构造函数
                 * @private
                 * @since 0.1.0
                 * @author hujiabao
                 * */
    constructor() {
      super();
                        // 调用super()后再定义子类成员。
      throw new Error('Do not  instantiate, call static functions instead.');
    }

                /**
                 * 引用插件目录下的某个class或某个package，注意不能使用全局的using（插件的多个版本可能具有同一个包名）。
                 * ****请注意****：任何插件中的引用，都需要使用此函数替代全局using函数，因为插件包的src目录不在在全局源码目录。
                 *
                 * @method real
                 * @param {String} namespace 类名或包名
                 * @param {String} pluginFullName 插件全名
                 * @return {Object} namespace为类名时：Nodejs导出对象，namespace为包名时：此目录所有js文件的Nodejs导出对象
                 * @since 0.1.0
                 * @author hujiabao
                 * */
    static using(namespace, pluginFullName) {
      assert(typeof namespace === 'string' && namespace, 'Invalid namespace');
      var ret = _namespaceCache[namespace];
      if (ret) return ret;

      var [pluginName, pluginVersion] = pluginFullName.split('@');
                        // using a package
      if (namespace.match(/\/\*$/)) {
        var srcFolder = EasyNode.real(`plugins/${pluginName}-${pluginVersion}/src`);
        var fstat = fs.stat(srcFolder);
        if (fstat.isDirectory()) {
          var files = fs.readdir(srcFolder);
          files.forEach(function(f) {
            if (f.startsWith('.')) return;
            if (f.match(/\.js$/)) {
              f = f.replace(/\.js$/, '');
              var className = f;
              ret[f] = require(path.join(srcFolder, f));
            }
          });
        }
      }
      else {
        ret = require(EasyNode.real('plugins/' + Plugins.getDirectoryName(pluginName, pluginVersion) + '/src/' + namespace.replace(/\./gm, '/')));
      }

      _namespaceCache[namespace] = ret;
      return ret;
    }


                /**
                 *  加载框架插件，插件位于plugins/目录下。目录格式：$pluginName-$pluginVersion（@符号svn有问题）
                 *  插件etc/目录下的$pluginName*.conf文件将作为插件的配置文件被加载，通过AbstractPlugin.config('key')获取。
                 *  插件目录下如果存在".ignore"文件，则插件目录被忽略
                 *
                 * @method load
                 * @static
                 * @async
                 * @since 0.1.0
                 * @author hujiabao
                 * */
    static load() {
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
                if (c.length > 2) {
                  for (var ci = 2; ci < c.length; ci++) {
                    c[1] += '=' + c[ci];
                  }
                }
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
          if (files[i].startsWith('.')) continue;
          var pluginFolderName = files[i];
                                        // var [pluginName, pluginVersion] = pluginFolderName.split('-');
          var idx = pluginFolderName.lastIndexOf('-');
          var pluginName = pluginFolderName.substring(0, idx);
          var pluginVersion = pluginFolderName.substring(idx + 1);
          pluginVersion = pluginVersion || '0.0.1';
          var folder = path.join(pluginFolder, pluginFolderName);
          var stat = yield fs.stat(folder);
          if (stat.isDirectory()) {
            try {
              var isIgnore = yield fs.exists(path.join(folder, '.ignore'));
              if (isIgnore) {
                logger.info(`ignore plugin [${pluginFolderName}]`);
                continue;
              }
              logger.info(`loading plugin [${pluginFolderName}]...`);
              var pluginConf = yield readConfig(pluginFolderName, path.join(folder, 'etc/'), new RegExp(pluginName + '\.*.conf'));
              var i18nConf = yield readConfig(pluginFolderName, path.join(folder, 'etc/i18n/'), new RegExp(locale + '.conf'));
              var pluginDependency = [];
              var dependencyFile = path.join(folder, `${pluginName}-dependencies.json`);
              if (yield fs.exists(dependencyFile)) {
                var s = yield fs.readFile(dependencyFile, 'utf8');
                pluginDependency = JSON.parse(s);
              }
              var PluginEntryClass = require(path.join(folder, 'src/PluginEntry.js'));
              _pluginEntries[pluginName] = _pluginEntries[pluginName] || {};
              _pluginEntries[pluginName][pluginVersion] = PluginEntryClass;
              _pluginConfigs[pluginFolderName] = {
                fullName : pluginName + '@' + pluginVersion,
                conf : pluginConf,
                i18nConf : i18nConf,
                dependency : pluginDependency
              };
            } catch (err) {
              logger.error(err);
            }
          }
        }
        Plugins._preCheckDependencies();
      };
    }

    static getFullName(pluginName, pluginVersion) {
      return pluginName + '@' + pluginVersion;
    }

    static getDirectoryName(pluginName, pluginVersion) {
      return pluginName + '-' + pluginVersion;
    }

    static _preCheckDependencies() {
      var ret = [];
      for (var pluginFullName in _pluginConfigs) {
        var dependency = _pluginConfigs[pluginFullName].dependency || [];
        dependency.forEach((dependencyPluginFullName) => {
          if (!Plugins.exists(dependencyPluginFullName)) {
            ret.push(`${_pluginConfigs[pluginFullName].fullName} depends on ${dependencyPluginFullName}`);
          }
        });
      }
      if (ret.length > 0) {
        logger.warn(`plugin dependency error, the following dependencies were not found : \n----------------------------------------------------\n${ret.join('\n')}\n----------------------------------------------------`);
      }
    }

                /**
                 *  使用指定的插件版本和参数创建插件实例。如果指定的插件版本没有找到，则搜索系统目录中"最合适的"插件版本作为引用版本。
                 *  "最合适的"插件是指主版本与指定版本一致的并且次版本最大的插件。
                 *
                 * @method createPluginInstance
                 * @param {String} pluginFullName 插件全名，格式：$pluginName@$pluginVersion
                 * @param {Object} options，插件初始化参数，由各插件自行定义，具体请参考插件的initialize函数的参数定义。
                 * @static
                 * @async
                 * @since 0.1.0
                 * @author hujiabao
                 * */
    static createPluginInstance(pluginFullName, options = {}) {
      var [name, version] = pluginFullName.split('@');
      version = version || '0.0.1';
      var PluginEntries = _pluginEntries[name];
      if (!PluginEntries) {
        throw new Error(`plugin [${name}] is not found!`);
      }
      var PluginEntryClass = PluginEntries[version];
      var realVersion = version;
      if (!PluginEntryClass) {
        var maxAppropriateVersion = version;
        for (var v in PluginEntries) {
          if (VersionComparator.isAppropriateVersion(v, version)) {
            if (VersionComparator.compare(v, maxAppropriateVersion) > 0) {
              PluginEntryClass = PluginEntries[v];
              realVersion = v;
            }
          }
        }
        logger.warn(`plugin [${name}.${version}] is not found , appropriate version [${name}.${v}] is the substitution`);
      }

      if (!PluginEntryClass) {
        throw new Error(`plugin [${name}.${version}] is not found, and no substitution is found!`);
      }

      var plugin = new PluginEntryClass();
      plugin.name = name;
      plugin.version = realVersion;
      plugin.dependencies = _pluginConfigs[name + '-' + realVersion].dependency;
      plugin.config(_pluginConfigs[name + '-' + realVersion].conf);
      plugin.i18n(_pluginConfigs[name + '-' + realVersion].i18nConf);
      var dependenciesNotFound = plugin.checkDependency();
      if (dependenciesNotFound.length > 0) {
        throw new Error(`plugin [${plugin.name}@${plugin.version}] dependency error：${dependenciesNotFound.join(',')} was(were) not found`);
      }
      EasyNode.DEBUG && logger.debug(`initializing plugin [${plugin.name}@${plugin.version}]`);
      plugin.initialize(options);
      return plugin;
    }

                /**
                 *  销毁插件实例。
                 *
                 * @method destroyPluginInstance
                 * @param {easynode.framework.plugin.AbstractPlugin} instance 通过createPluginInstance创建的插件实例
                 * @static
                 * @since 0.1.0
                 * @author hujiabao
                 * */
    static destroyPluginInstance(instance) {
      assert(instance instanceof AbstractPlugin, 'Invalid plugin instance');
      instance.finalize();
    }

    static exists(pluginFullName, exact = false) {
      var [name, version] = pluginFullName.split('@');
      version = version || '0.0.1';
      var PluginEntries = _pluginEntries[name];
      if (!PluginEntries) {
        return false;
      }

      var PluginEntryClass = PluginEntries[version];
      var realVersion = version;
      if (!PluginEntryClass) {
        if (exact) {
          return false;
        }
        var maxAppropriateVersion = version;
        for (var v in PluginEntries) {
          if (VersionComparator.isAppropriateVersion(v, version)) {
            if (VersionComparator.compare(v, maxAppropriateVersion) > 0) {
              PluginEntryClass = PluginEntries[v];
              realVersion = v;
            }
          }
        }
      }

      return PluginEntryClass != null;
    }

    getClassName() {
      return EasyNode.namespace(__filename);
    }
        }

  module.exports = Plugins;
})();
