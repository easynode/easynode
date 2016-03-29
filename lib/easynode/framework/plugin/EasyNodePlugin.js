'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

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

(function () {
        //插件名列表，有序
        var _pluginList = [];

        //插件实例
        var _plugins = {};

        /**
         * Class EasyNodePlugin
         *
         * @class easynode.framework.plugin.EasyNodePlugin
         * @extends easynode.GenericObject
         * @since 0.1.0
         * @author hujiabao
         * */

        var EasyNodePlugin = (function (_GenericObject) {
                _inherits(EasyNodePlugin, _GenericObject);

                /**
                 * 构造函数。
                 *
                 * @method 构造函数
                 * @param {String} name 插件名称
                 * @param {String} version 插件版本，默认'0.0.1'
                 * @since 0.1.0
                 * @author hujiabao
                 * */

                function EasyNodePlugin(name) {
                        var version = arguments.length <= 1 || arguments[1] === undefined ? '0.0.1' : arguments[1];

                        _classCallCheck(this, EasyNodePlugin);

                        //调用super()后再定义子类成员。

                        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(EasyNodePlugin).call(this));

                        assert(!S(name).isEmpty(), 'Plugin must be named');

                        /**
                         * 插件名称
                         * @property name
                         * @type String
                         * */
                        _this.name = name;

                        /**
                         * 插件版本，格式：major.minor.patch
                         * @property version
                         * @type String
                         * @since 0.1.0
                         * @author hujiabao
                         * */
                        _this.version = version;

                        /**
                         * 插件简述，默认与插件名称一致。
                         * @property brief
                         * @type String
                         * @since 0.1.0
                         * @author hujiabao
                         * */
                        _this.brief = _this.name;

                        /**
                         * 插件详细描述
                         * @property description
                         * @type String
                         * @default null
                         * @since 0.1.0
                         * @author hujiabao
                         * */
                        _this.description = null;

                        /**
                         * 插件配置项
                         * @property configurations
                         * @type Object
                         * @default {}
                         * @since 0.1.0
                         * @author hujiabao
                         * */
                        _this.configurations = {};

                        /**
                         * 插件国际化配置项
                         * @property i18nConfig
                         * @type Object
                         * @default {}
                         * @since 0.1.0
                         * @author hujiabao
                         * */
                        _this.i18nConfig = {};

                        /**
                         * 是否已经加载
                         * @property _load
                         * @type boolean
                         * @private
                         * @default {}
                         * @since 0.1.0
                         * @author hujiabao
                         * */
                        _this._load = false;
                        return _this;
                }

                /**
                 * 获取插件根目录，插件根目录: $EasyNode/plugins/$plugin。
                 *
                 * @method home
                 * @return {String} 插件home目录。绝对目录。
                 * @since 0.1.0
                 * @author hujiabao
                 * */

                _createClass(EasyNodePlugin, [{
                        key: 'home',
                        value: function home() {
                                return EasyNode.real('plugins/' + this.name + '/');
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

                }, {
                        key: 'relative',
                        value: function relative(p) {
                                return path.join('plugins/' + this.name + '/', p);
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

                }, {
                        key: 'real',
                        value: function real(p) {
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

                }, {
                        key: 'isLoad',
                        value: function isLoad() {
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
                         * 初始化插件。
                         *
                         * @method initialize
                         * @param {easynode.framework.plugin.PluginLoadContext} loadCtx 插件加载环境
                         * @async
                         * @since 0.1.0
                         * @author hujiabao
                         * */

                }, {
                        key: 'initialize',
                        value: function initialize(loadCtx) {
                                return regeneratorRuntime.mark(function _callee2() {
                                        return regeneratorRuntime.wrap(function _callee2$(_context2) {
                                                while (1) {
                                                        switch (_context2.prev = _context2.next) {
                                                                case 0:
                                                                case 'end':
                                                                        return _context2.stop();
                                                        }
                                                }
                                        }, _callee2, this);
                                });
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

                }, {
                        key: 'config',
                        value: function config(item) {
                                var defaultValue = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

                                if (typeof item == 'string') {
                                        return this.configurations[item] || defaultValue;
                                } else if ((typeof item === 'undefined' ? 'undefined' : _typeof(item)) == 'object' && arguments.length == 1) {
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

                }, {
                        key: 'getWebDir',
                        value: function getWebDir() {
                                var webDir = this.real('www/');
                                var me = this;
                                return regeneratorRuntime.mark(function _callee3() {
                                        var exists, files;
                                        return regeneratorRuntime.wrap(function _callee3$(_context3) {
                                                while (1) {
                                                        switch (_context3.prev = _context3.next) {
                                                                case 0:
                                                                        _context3.next = 2;
                                                                        return fs.exists(path.join(webDir, me.name));

                                                                case 2:
                                                                        exists = _context3.sent;

                                                                        if (!exists) {
                                                                                _context3.next = 12;
                                                                                break;
                                                                        }

                                                                        _context3.next = 6;
                                                                        return fs.readdir(webDir);

                                                                case 6:
                                                                        files = _context3.sent;

                                                                        if (!(files.length == 1)) {
                                                                                _context3.next = 11;
                                                                                break;
                                                                        }

                                                                        return _context3.abrupt('return', 'plugins/' + me.name + '/www/');

                                                                case 11:
                                                                        logger.error('Unrecognized web directory of plugin [' + me.name + ']');

                                                                case 12:
                                                                case 'end':
                                                                        return _context3.stop();
                                                        }
                                                }
                                        }, _callee3, this);
                                });
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
                         * @author hujiabao
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
                         * @author hujiabao
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
                         * @author hujiabao
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
                         * 检查插件依赖
                         *
                         * @method checkDependency
                         * @since 0.1.0
                         * @author hujiabao
                         * */

                }, {
                        key: 'checkDependency',
                        value: function checkDependency() {
                                var _this2 = this;

                                this.dependencies = this.dependencies || [];
                                this.dependencies.forEach(function (p) {
                                        var _p$split = p.split('@');

                                        var _p$split2 = _slicedToArray(_p$split, 2);

                                        var name = _p$split2[0];
                                        var version = _p$split2[1];

                                        var inst = EasyNodePlugin.getPlugin(name, version);
                                        if (!inst) {
                                                throw new Error('Dependency error, plugin [' + _this2.name + '] depends [' + name + (version ? '@' + version : '') + '], but depended plugin is not found or version is too low');
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

                        /**
                         * 读取easynode.plugins配置项，按配置项顺序加载EasyNode插件，请注意插件的依赖关系。<br/>
                         * easynode.plugins配置项示例：plugin1,plugin2,plugin3<br/>
                         * 所有的EasyNode插件应位于$EasyNode/plugins目录。例：$EasyNode/plugins/plugin1/<br/>
                         * 在插件目录下增加一个.ignore文件可忽略该插件的加载。<br/>
                         * 执行流程<br/>
                         * <pre>
                         *       插件加载流程如下：
                         *      1. 将插件目录下的src目录加入到EasyNode源码目录
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

                }, {
                        key: 'getClassName',
                        value: function getClassName() {
                                return EasyNode.namespace(__filename);
                        }
                }], [{
                        key: 'load',
                        value: function load(loadCtx) {
                                var _marked = [readConfig].map(regeneratorRuntime.mark);

                                function readConfig(pluginName, dir) {
                                        var pattern = arguments.length <= 2 || arguments[2] === undefined ? /^.*\.conf$/ : arguments[2];
                                        var exists, files, ret, i, f, cfg;
                                        return regeneratorRuntime.wrap(function readConfig$(_context4) {
                                                while (1) switch (_context4.prev = _context4.next) {
                                                        case 0:
                                                                _context4.next = 2;
                                                                return fs.exists(dir);

                                                        case 2:
                                                                exists = _context4.sent;

                                                                if (exists) {
                                                                        _context4.next = 5;
                                                                        break;
                                                                }

                                                                return _context4.abrupt('return', {});

                                                        case 5:
                                                                _context4.next = 7;
                                                                return fs.readdir(dir);

                                                        case 7:
                                                                files = _context4.sent;
                                                                ret = {};
                                                                i = 0;

                                                        case 10:
                                                                if (!(i < files.length)) {
                                                                        _context4.next = 21;
                                                                        break;
                                                                }

                                                                f = path.join(dir, files[i]);

                                                                if (!f.match(pattern)) {
                                                                        _context4.next = 18;
                                                                        break;
                                                                }

                                                                _context4.next = 15;
                                                                return fs.readFile(f);

                                                        case 15:
                                                                cfg = _context4.sent;

                                                                cfg = cfg.toString().split('\n');
                                                                cfg.forEach(function (c) {
                                                                        if (c && c[0] != '#') {
                                                                                //#is a comment flag
                                                                                c = c.split('=');
                                                                                c[0] = c[0] && S(c[0]).trim().toString();
                                                                                c[1] = c[1] && S(c[1]).trim().toString();
                                                                                if (ret[c[0]] !== undefined) {
                                                                                        logger.warn('Duplicated config item in plugin [' + pluginName + ']: [' + c[0] + ']');
                                                                                }
                                                                                ret[c[0]] = c[1];
                                                                        }
                                                                });

                                                        case 18:
                                                                i++;
                                                                _context4.next = 10;
                                                                break;

                                                        case 21:
                                                                return _context4.abrupt('return', ret);

                                                        case 22:
                                                        case 'end':
                                                                return _context4.stop();
                                                }
                                        }, _marked[0], this);
                                }

                                var pluginFolder = EasyNode.real('plugins/');
                                var locale = EasyNode.getLocale();
                                return regeneratorRuntime.mark(function _callee4() {
                                        var files, i, pluginFolderName, f, stat, isIgnore, locale, pluginConf, i18nConf, PluginEntryClass, pluginInstance, webDir;
                                        return regeneratorRuntime.wrap(function _callee4$(_context5) {
                                                while (1) {
                                                        switch (_context5.prev = _context5.next) {
                                                                case 0:
                                                                        _context5.next = 2;
                                                                        return fs.readdir(pluginFolder);

                                                                case 2:
                                                                        files = _context5.sent;
                                                                        i = 0;

                                                                case 4:
                                                                        if (!(i < files.length)) {
                                                                                _context5.next = 49;
                                                                                break;
                                                                        }

                                                                        pluginFolderName = files[i];
                                                                        f = path.join(pluginFolder, pluginFolderName);
                                                                        _context5.next = 9;
                                                                        return fs.stat(f);

                                                                case 9:
                                                                        stat = _context5.sent;

                                                                        if (!stat.isDirectory()) {
                                                                                _context5.next = 46;
                                                                                break;
                                                                        }

                                                                        _context5.prev = 11;
                                                                        _context5.next = 14;
                                                                        return fs.exists(path.join(f, '.ignore'));

                                                                case 14:
                                                                        isIgnore = _context5.sent;

                                                                        if (!isIgnore) {
                                                                                _context5.next = 18;
                                                                                break;
                                                                        }

                                                                        logger.info('ignore plugin [' + pluginFolderName + ']');
                                                                        return _context5.abrupt('continue', 46);

                                                                case 18:
                                                                        EasyNode.DEBUG && logger.debug('found plugin directory [' + pluginFolderName + ']...');
                                                                        EasyNode.addSourceDirectory('plugins/' + pluginFolderName + '/src');
                                                                        EasyNode.addConfigFile('plugins/' + pluginFolderName + '/etc/' + pluginFolderName + '.conf');
                                                                        locale = EasyNode.getLocale();
                                                                        _context5.next = 24;
                                                                        return readConfig(pluginFolderName, path.join(f, 'etc/'), new RegExp(pluginFolderName + '.conf'));

                                                                case 24:
                                                                        pluginConf = _context5.sent;
                                                                        _context5.next = 27;
                                                                        return readConfig(pluginFolderName, path.join(f, 'etc/i18n/'), new RegExp(locale + '.conf'));

                                                                case 27:
                                                                        i18nConf = _context5.sent;
                                                                        PluginEntryClass = require(path.join(f, 'src/' + pluginFolderName + '_PluginEntry.js'));
                                                                        pluginInstance = new PluginEntryClass();

                                                                        if (pluginInstance instanceof EasyNodePlugin) {
                                                                                _context5.next = 32;
                                                                                break;
                                                                        }

                                                                        throw new Error('Invalid plugin entry [' + pluginFolderName + ']');

                                                                case 32:
                                                                        logger.info('loading plugin [' + pluginInstance.name + '@' + pluginInstance.version + ']');

                                                                        if (!(pluginInstance.name != pluginFolderName)) {
                                                                                _context5.next = 35;
                                                                                break;
                                                                        }

                                                                        throw new Error('Unmatched plugin name and folder [' + pluginInstance.name + ']->[' + pluginFolderName + ']');

                                                                case 35:
                                                                        pluginInstance.config(pluginConf);
                                                                        pluginInstance.i18n(i18nConf);
                                                                        _plugins[pluginInstance.name] = pluginInstance;
                                                                        _pluginList.push(pluginInstance.name);
                                                                        EasyNode.DEBUG && logger.debug('plugin [' + pluginInstance.name + '@' + pluginInstance.version + '] is load, preparing to initialize...');
                                                                        _context5.next = 46;
                                                                        break;

                                                                case 42:
                                                                        _context5.prev = 42;
                                                                        _context5.t0 = _context5['catch'](11);

                                                                        logger.error('Bad plugin package [' + pluginFolderName + ']');
                                                                        logger.error(_context5.t0);

                                                                case 46:
                                                                        i++;
                                                                        _context5.next = 4;
                                                                        break;

                                                                case 49:
                                                                        i = 0;

                                                                case 50:
                                                                        if (!(i < _pluginList.length)) {
                                                                                _context5.next = 73;
                                                                                break;
                                                                        }

                                                                        _context5.prev = 51;
                                                                        pluginInstance = EasyNodePlugin.getPlugin(_pluginList[i]);

                                                                        EasyNode.DEBUG && logger.debug('initializing plugin [' + pluginInstance.name + '@' + pluginInstance.version + ']...');
                                                                        EasyNode.DEBUG && logger.debug('checking dependency...');
                                                                        pluginInstance.checkDependency();
                                                                        _context5.next = 58;
                                                                        return pluginInstance.initialize(loadCtx);

                                                                case 58:
                                                                        _context5.next = 60;
                                                                        return pluginInstance.getWebDir();

                                                                case 60:
                                                                        webDir = _context5.sent;

                                                                        if (loadCtx.koaHttpServer && webDir) {
                                                                                EasyNode.DEBUG && logger.debug('registering plugin web directory [/' + pluginInstance.name + ']...');
                                                                                loadCtx.koaHttpServer.addWebDirs(webDir);
                                                                        }
                                                                        pluginInstance._load = true;
                                                                        logger.info('plugin [' + pluginInstance.name + '@' + pluginInstance.version + '] is initialized');
                                                                        _context5.next = 70;
                                                                        break;

                                                                case 66:
                                                                        _context5.prev = 66;
                                                                        _context5.t1 = _context5['catch'](51);

                                                                        logger.error('initialize plugin [' + pluginInstance.name + '] failed');
                                                                        logger.error(_context5.t1.stack);

                                                                case 70:
                                                                        i++;
                                                                        _context5.next = 50;
                                                                        break;

                                                                case 73:
                                                                case 'end':
                                                                        return _context5.stop();
                                                        }
                                                }
                                        }, _callee4, this, [[11, 42], [51, 66]]);
                                });
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

                }, {
                        key: 'getPlugin',
                        value: function getPlugin(name, version) {
                                if (arguments.length == 1) {
                                        var _name$split = name.split('@');

                                        var _name$split2 = _slicedToArray(_name$split, 2);

                                        name = _name$split2[0];
                                        version = _name$split2[1];
                                }
                                var plugin = _plugins[name];
                                if (plugin && version) {
                                        if (VersionComparator.compare(plugin.version, version) >= 0) {
                                                return plugin;
                                        } else {
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

                }, {
                        key: 'plugins',
                        value: function plugins() {
                                var detail = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

                                if (!detail) {
                                        return _.clone(_pluginList);
                                } else {
                                        var list = [];
                                        for (var name in _plugins) {
                                                var inst = _plugins[name];
                                                var o = {
                                                        name: name,
                                                        version: inst.version,
                                                        brief: inst.brief,
                                                        description: inst.description,
                                                        load: inst.isLoad()
                                                };
                                                list.push(o);
                                        }
                                        return list;
                                }
                        }
                }]);

                return EasyNodePlugin;
        })(GenericObject);

        module.exports = EasyNodePlugin;
})();