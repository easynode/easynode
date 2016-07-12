'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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

(function () {
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

  var Plugins = function (_GenericObject) {
    _inherits(Plugins, _GenericObject);

    /**
     * 构造函数。
     *
     * @method 构造函数
     * @private
     * @since 0.1.0
     * @author hujiabao
     * */

    function Plugins() {
      _classCallCheck(this, Plugins);

      // 调用super()后再定义子类成员。

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Plugins).call(this));

      throw new Error('Do not  instantiate, call static functions instead.');
      return _this;
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


    _createClass(Plugins, [{
      key: 'getClassName',
      value: function getClassName() {
        return EasyNode.namespace(__filename);
      }
    }], [{
      key: 'using',
      value: function using(namespace, pluginFullName) {
        assert(typeof namespace === 'string' && namespace, 'Invalid namespace');
        var ret = _namespaceCache[namespace];
        if (ret) return ret;

        var _pluginFullName$split = pluginFullName.split('@');

        var _pluginFullName$split2 = _slicedToArray(_pluginFullName$split, 2);

        var pluginName = _pluginFullName$split2[0];
        var pluginVersion = _pluginFullName$split2[1];
        // using a package

        if (namespace.match(/\/\*$/)) {
          var srcFolder = EasyNode.real('plugins/' + pluginName + '-' + pluginVersion + '/src');
          var fstat = fs.stat(srcFolder);
          if (fstat.isDirectory()) {
            var files = fs.readdir(srcFolder);
            files.forEach(function (f) {
              if (f.startsWith('.')) return;
              if (f.match(/\.js$/)) {
                f = f.replace(/\.js$/, '');
                var className = f;
                ret[f] = require(path.join(srcFolder, f));
              }
            });
          }
        } else {
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

    }, {
      key: 'load',
      value: function load() {
        var _marked = [readConfig].map(regeneratorRuntime.mark);

        function readConfig(pluginName, dir) {
          var pattern = arguments.length <= 2 || arguments[2] === undefined ? /^.*\.conf$/ : arguments[2];
          var exists, files, ret, i, f, cfg;
          return regeneratorRuntime.wrap(function readConfig$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.next = 2;
                  return fs.exists(dir);

                case 2:
                  exists = _context.sent;

                  if (exists) {
                    _context.next = 5;
                    break;
                  }

                  return _context.abrupt('return', {});

                case 5:
                  _context.next = 7;
                  return fs.readdir(dir);

                case 7:
                  files = _context.sent;
                  ret = {};
                  i = 0;

                case 10:
                  if (!(i < files.length)) {
                    _context.next = 21;
                    break;
                  }

                  f = path.join(dir, files[i]);

                  if (!f.match(pattern)) {
                    _context.next = 18;
                    break;
                  }

                  _context.next = 15;
                  return fs.readFile(f);

                case 15:
                  cfg = _context.sent;

                  cfg = cfg.toString().split('\n');
                  cfg.forEach(function (c) {
                    if (c && c[0] != '#') {
                      // #is a comment flag
                      c = c.split('=');
                      c[0] = c[0] && S(c[0]).trim().toString();
                      c[1] = c[1] && S(c[1]).trim().toString();
                      if (c.length > 2) {
                        for (var ci = 2; ci < c.length; ci++) {
                          c[1] += '=' + c[ci];
                        }
                      }
                      if (ret[c[0]] !== undefined) {
                        logger.warn('Duplicated config item in plugin [' + pluginName + ']: [' + c[0] + ']');
                      }
                      ret[c[0]] = c[1];
                    }
                  });

                case 18:
                  i++;
                  _context.next = 10;
                  break;

                case 21:
                  return _context.abrupt('return', ret);

                case 22:
                case 'end':
                  return _context.stop();
              }
            }
          }, _marked[0], this);
        }
        var pluginFolder = EasyNode.real('plugins/');
        var locale = EasyNode.getLocale();
        return regeneratorRuntime.mark(function _callee() {
          var files, i, pluginFolderName, idx, pluginName, pluginVersion, folder, stat, isIgnore, pluginConf, i18nConf, pluginDependency, dependencyFile, s, PluginEntryClass;
          return regeneratorRuntime.wrap(function _callee$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  _context2.next = 2;
                  return fs.readdir(pluginFolder);

                case 2:
                  files = _context2.sent;
                  i = 0;

                case 4:
                  if (!(i < files.length)) {
                    _context2.next = 52;
                    break;
                  }

                  if (!files[i].startsWith('.')) {
                    _context2.next = 7;
                    break;
                  }

                  return _context2.abrupt('continue', 49);

                case 7:
                  pluginFolderName = files[i];
                  // var [pluginName, pluginVersion] = pluginFolderName.split('-');

                  idx = pluginFolderName.lastIndexOf('-');
                  pluginName = pluginFolderName.substring(0, idx);
                  pluginVersion = pluginFolderName.substring(idx + 1);

                  pluginVersion = pluginVersion || '0.0.1';
                  folder = path.join(pluginFolder, pluginFolderName);
                  _context2.next = 15;
                  return fs.stat(folder);

                case 15:
                  stat = _context2.sent;

                  if (!stat.isDirectory()) {
                    _context2.next = 49;
                    break;
                  }

                  _context2.prev = 17;
                  _context2.next = 20;
                  return fs.exists(path.join(folder, '.ignore'));

                case 20:
                  isIgnore = _context2.sent;

                  if (!isIgnore) {
                    _context2.next = 24;
                    break;
                  }

                  logger.info('ignore plugin [' + pluginFolderName + ']');
                  return _context2.abrupt('continue', 49);

                case 24:
                  logger.info('loading plugin [' + pluginFolderName + ']...');
                  _context2.next = 27;
                  return readConfig(pluginFolderName, path.join(folder, 'etc/'), new RegExp(pluginName + '\.*.conf'));

                case 27:
                  pluginConf = _context2.sent;
                  _context2.next = 30;
                  return readConfig(pluginFolderName, path.join(folder, 'etc/i18n/'), new RegExp(locale + '.conf'));

                case 30:
                  i18nConf = _context2.sent;
                  pluginDependency = [];
                  dependencyFile = path.join(folder, pluginName + '-dependencies.json');
                  _context2.next = 35;
                  return fs.exists(dependencyFile);

                case 35:
                  if (!_context2.sent) {
                    _context2.next = 40;
                    break;
                  }

                  _context2.next = 38;
                  return fs.readFile(dependencyFile, 'utf8');

                case 38:
                  s = _context2.sent;

                  pluginDependency = JSON.parse(s);

                case 40:
                  PluginEntryClass = require(path.join(folder, 'src/PluginEntry.js'));

                  _pluginEntries[pluginName] = _pluginEntries[pluginName] || {};
                  _pluginEntries[pluginName][pluginVersion] = PluginEntryClass;
                  _pluginConfigs[pluginFolderName] = {
                    fullName: pluginName + '@' + pluginVersion,
                    conf: pluginConf,
                    i18nConf: i18nConf,
                    dependency: pluginDependency
                  };
                  _context2.next = 49;
                  break;

                case 46:
                  _context2.prev = 46;
                  _context2.t0 = _context2['catch'](17);

                  logger.error(_context2.t0);

                case 49:
                  i++;
                  _context2.next = 4;
                  break;

                case 52:
                  Plugins._preCheckDependencies();

                case 53:
                case 'end':
                  return _context2.stop();
              }
            }
          }, _callee, this, [[17, 46]]);
        });
      }
    }, {
      key: 'getFullName',
      value: function getFullName(pluginName, pluginVersion) {
        return pluginName + '@' + pluginVersion;
      }
    }, {
      key: 'getDirectoryName',
      value: function getDirectoryName(pluginName, pluginVersion) {
        return pluginName + '-' + pluginVersion;
      }
    }, {
      key: '_preCheckDependencies',
      value: function _preCheckDependencies() {
        var ret = [];
        for (var pluginFullName in _pluginConfigs) {
          var dependency = _pluginConfigs[pluginFullName].dependency || [];
          dependency.forEach(function (dependencyPluginFullName) {
            if (!Plugins.exists(dependencyPluginFullName)) {
              ret.push(_pluginConfigs[pluginFullName].fullName + ' depends on ' + dependencyPluginFullName);
            }
          });
        }
        if (ret.length > 0) {
          logger.warn('plugin dependency error, the following dependencies were not found : \n----------------------------------------------------\n' + ret.join('\n') + '\n----------------------------------------------------');
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

    }, {
      key: 'createPluginInstance',
      value: function createPluginInstance(pluginFullName) {
        var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        var _pluginFullName$split3 = pluginFullName.split('@');

        var _pluginFullName$split4 = _slicedToArray(_pluginFullName$split3, 2);

        var name = _pluginFullName$split4[0];
        var version = _pluginFullName$split4[1];

        version = version || '0.0.1';
        var PluginEntries = _pluginEntries[name];
        if (!PluginEntries) {
          throw new Error('plugin [' + name + '] is not found!');
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
          logger.warn('plugin [' + name + '.' + version + '] is not found , appropriate version [' + name + '.' + v + '] is the substitution');
        }

        if (!PluginEntryClass) {
          throw new Error('plugin [' + name + '.' + version + '] is not found, and no substitution is found!');
        }

        var plugin = new PluginEntryClass();
        plugin.name = name;
        plugin.version = realVersion;
        plugin.dependencies = _pluginConfigs[name + '-' + realVersion].dependency;
        plugin.config(_pluginConfigs[name + '-' + realVersion].conf);
        plugin.i18n(_pluginConfigs[name + '-' + realVersion].i18nConf);
        var dependenciesNotFound = plugin.checkDependency();
        if (dependenciesNotFound.length > 0) {
          throw new Error('plugin [' + plugin.name + '@' + plugin.version + '] dependency error：' + dependenciesNotFound.join(',') + ' was(were) not found');
        }
        EasyNode.DEBUG && logger.debug('initializing plugin [' + plugin.name + '@' + plugin.version + ']');
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

    }, {
      key: 'destroyPluginInstance',
      value: function destroyPluginInstance(instance) {
        assert(instance instanceof AbstractPlugin, 'Invalid plugin instance');
        instance.finalize();
      }
    }, {
      key: 'exists',
      value: function exists(pluginFullName) {
        var exact = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

        var _pluginFullName$split5 = pluginFullName.split('@');

        var _pluginFullName$split6 = _slicedToArray(_pluginFullName$split5, 2);

        var name = _pluginFullName$split6[0];
        var version = _pluginFullName$split6[1];

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
    }]);

    return Plugins;
  }(GenericObject);

  module.exports = Plugins;
})();