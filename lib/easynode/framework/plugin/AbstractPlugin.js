'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

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
   * Class AbstractPlugin
   *
   * @class easynode.framework.plugin.AbstractPlugin
   * @extends easynode.GenericObject
   * @since 0.1.0
   * @author zlbbq
   * */

  var AbstractPlugin = function (_GenericObject) {
    _inherits(AbstractPlugin, _GenericObject);

    /**
     * 构造函数。
     *
     * @method 构造函数
     * @since 0.1.0
     * @author zlbbq
     * */

    function AbstractPlugin() {
      _classCallCheck(this, AbstractPlugin);

      // 调用super()后再定义子类成员。
      /**
       * 插件名称
       * @property name
       * @type String
       * */

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(AbstractPlugin).call(this));

      _this.name = null;

      /**
       * 插件版本，格式：major.minor.patch
       * @property version
       * @type String
       * @since 0.1.0
       * @author zlbbq
       * */
      _this.version = null;

      /**
       * 插件简述，默认与插件名称一致。
       * @property brief
       * @type String
       * @since 0.1.0
       * @author zlbbq
       * */
      _this.brief = _this.name;

      /**
       * 插件详细描述
       * @property description
       * @type String
       * @default null
       * @since 0.1.0
       * @author zlbbq
       * */
      _this.description = null;

      /**
       * 插件配置项
       * @property configurations
       * @type Object
       * @default {}
       * @since 0.1.0
       * @author zlbbq
       * */
      _this.configurations = {};

      /**
       * 插件国际化配置项
       * @property i18nConfig
       * @type Object
       * @default {}
       * @since 0.1.0
       * @author zlbbq
       * */
      _this.i18nConfig = {};

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
      _this.dependencies = [];
      return _this;
    }

    /**
     * 获取插件根目录，插件根目录: $EasyNode/plugins/$plugin。
     *
     * @method home
     * @return {String} 插件home目录。绝对目录。
     * @since 0.1.0
     * @author zlbbq
     * */


    _createClass(AbstractPlugin, [{
      key: 'home',
      value: function home() {
        return EasyNode.real('plugins/' + this.name + '-' + this.version + '/');
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

    }, {
      key: 'relative',
      value: function relative(p) {
        return path.join('plugins/' + this.name + '-' + this.version + '/', p);
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

    }, {
      key: 'real',
      value: function real(p) {
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

    }, {
      key: 'using',
      value: function using(namespace) {
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

    }, {
      key: 'getFullName',
      value: function getFullName() {
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

    }, {
      key: 'getDescription',
      value: function getDescription() {
        var me = this;
        return regeneratorRuntime.mark(function _callee() {
          var descFile, fnReadFile, s;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  if (!(me.description != null)) {
                    _context.next = 2;
                    break;
                  }

                  return _context.abrupt('return', me.description);

                case 2:
                  descFile = me.real(this.name + '.md');
                  fnReadFile = thunkify(fs.readFile);
                  _context.next = 6;
                  return fnReadFile(descFile);

                case 6:
                  s = _context.sent;

                  s = s.toString();
                  me.description = s;
                  return _context.abrupt('return', s);

                case 10:
                case 'end':
                  return _context.stop();
              }
            }
          }, _callee, this);
        });
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

    }, {
      key: 'initialize',
      value: function initialize(options) {
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

    }, {
      key: 'finalize',
      value: function finalize() {
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

    }, {
      key: 'config',
      value: function config(item) {
        var defaultValue = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

        if (typeof item == 'string') {
          return this.configurations[item] || defaultValue;
        } else if ((typeof item === 'undefined' ? 'undefined' : _typeof(item)) == 'object' && arguments.length == 1) {
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

    }, {
      key: 'getWebDir',
      value: function getWebDir() {
        var webDir = this.real('www/');
        var me = this;
        return regeneratorRuntime.mark(function _callee2() {
          var exists, files;
          return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  _context2.next = 2;
                  return fs.exists(path.join(webDir, me.name));

                case 2:
                  exists = _context2.sent;

                  if (!exists) {
                    _context2.next = 12;
                    break;
                  }

                  _context2.next = 6;
                  return fs.readdir(webDir);

                case 6:
                  files = _context2.sent;

                  if (!(files.length == 1)) {
                    _context2.next = 11;
                    break;
                  }

                  return _context2.abrupt('return', 'plugins/' + me.name + '/www/');

                case 11:
                  logger.error('Unrecognized web directory of plugin [' + me.name + ']');

                case 12:
                case 'end':
                  return _context2.stop();
              }
            }
          }, _callee2, this);
        });
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

    }, {
      key: 'i18n',
      value: function i18n(item, prefix) {
        for (var _len = arguments.length, replaces = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
          replaces[_key - 2] = arguments[_key];
        }

        if (typeof item == 'string') {
          if (prefix) {
            item = EasyNode.namespace(prefix) + '.' + item;
          }
          return this.i18nConfig[item] || item;
        } else if ((typeof item === 'undefined' ? 'undefined' : _typeof(item)) == 'object' && arguments.length == 1) {
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

    }, {
      key: 'formatString',
      value: function formatString(key) {
        var subKey = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

        var item = 'plugin.' + this.name + '.' + (subKey ? subKey + '.' : '') + key;
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

    }, {
      key: 'formatResult',
      value: function formatResult(key) {
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

    }, {
      key: 'depends',
      value: function depends() {
        this.dependencies = this.dependencies || [];

        for (var _len2 = arguments.length, plugins = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          plugins[_key2] = arguments[_key2];
        }

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

    }, {
      key: 'checkDependency',
      value: function checkDependency() {
        var ret = [];
        this.dependencies = this.dependencies || [];
        this.dependencies.forEach(function (p) {
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

    }, {
      key: 'toJSON',
      value: function toJSON() {
        var o = {
          name: this.name,
          version: this.version,
          brief: this.brief,
          description: this.description,
          home: this.home()
        };
        return JSON.stringify(o);
      }
    }, {
      key: 'getClassName',
      value: function getClassName() {
        return EasyNode.namespace(__filename);
      }
    }], [{
      key: 'getPluginLogger',
      value: function getPluginLogger(pluginFullName, fileName) {
        return Logger.getLogger('Plugin-' + pluginFullName + '-' + EasyNode.namespace(fileName));
      }
    }]);

    return AbstractPlugin;
  }(GenericObject);

  module.exports = AbstractPlugin;
})();