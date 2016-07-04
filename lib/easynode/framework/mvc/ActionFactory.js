'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var GenericObject = using('easynode.GenericObject');
var Action = using('easynode.framework.mvc.Action');
var BeanFactory = using('easynode.framework.BeanFactory');
var S = require('string');
var fs = require('co-fs');
var _ = require('underscore');

(function () {
        var entry = {};
        var descriptionMap = new Map();

        /**
         * Class ActionFactory
         *
         * @class easynode.framework.mvc.ActionFactory
         * @extends easynode.GenericObject
         * @since 0.1.0
         * @author hujiabao
         * */

        var ActionFactory = function (_GenericObject) {
                _inherits(ActionFactory, _GenericObject);

                /**
                 * 构造函数。
                 *
                 * @method 构造函数
                 * @since 0.1.0
                 * @author hujiabao
                 * */

                function ActionFactory() {
                        _classCallCheck(this, ActionFactory);

                        return _possibleConstructorReturn(this, Object.getPrototypeOf(ActionFactory).call(this));
                        //调用super()后再定义子类成员。
                }

                /**
                 * 注册一个Action。使得可以通过json api或restful api来调用。注册的Action可以是一个类、一个全类名
                 * 或一个Action实例。
                 * <h5>http://localhost:5000/json?m=actionModule&a=actionName</h5>
                 * <h5>http://localhost:5000/rest/actionModule/actionName</h5>
                 *
                 * @method register
                 * @param {String/Class} actionClass Action类名或类，它是一个js文件的EasyNode字符串命名空间表示
                 * @param {String} moduleName 模块名
                 * @param {String} actionName action名
                 * @param {String} description Action功能描述
                 * @since 0.1.0
                 * @author hujiabao
                 * @example
                 *
                 *      var Action = using('easynode.framework.mvc.Action');
                 *      var ActionFactory = using('easynode.framework.mvc.ActionFactory');
                 *      class MyAction extends Action {
                 *              constructor (env) {
                 *                      super(env);
                 *              }
                 *      }
                 *
                 *      // 访问：http://localhost:5000/rest/demoM/demoA
                 *      MyAction.module = 'demoM';
                 *      MyAction.action = 'demoA';
                 *
                 *      // 与如下语句相同。
                 *      Action.define('demoM', 'demoA', MyAction);
                 *
                 *      ActionFactory.register(MyAction);
                 * */


                _createClass(ActionFactory, [{
                        key: 'remove',


                        /**
                         * 删除一个Action。
                         *
                         * @method remove
                         * @param {String} m    模块名
                         * @param {String} a     Action名，不传时表示删除m模块下所有的Action。
                         * @since 0.1.0
                         * @author hujiabao
                         * */
                        value: function remove(m, a) {
                                assert(typeof m == 'string', 'Invalid arguments');
                                if (arguments.length == 1) {
                                        delete entry[m];
                                }
                                if (arguments.length == 2) {
                                        assert(typeof a == 'string', 'Invalid arguments');
                                        delete entry[m][a];
                                }
                        }

                        /**
                         * 加载目录中所有文件名匹配pattern的Action。pattern默认为：/^.*Action\.js$/。如果将MethodDispatchedAction与一般Action
                         * 放在一个目录，建议将MethodDispatchedAction命名为XXXActions.js。
                         *
                         * @method registerNamespace
                         * @param {String} namespace  命名空间，指明一个源码目录。
                         * @param {RegExp} pattern Action文件的pattern, 默认为/^.*Action\.js$/
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
                        key: 'register',
                        value: function register(actionClass, moduleName, actionName, description) {
                                if (typeof actionClass == 'string') {
                                        //    assert(actionClass.match(/^[0-9a-zA-z\.\*]+$/), 'Invalid action class');
                                        var m = "";
                                        var a = "";
                                        var ActionClass = null;
                                        if (actionClass.match(/^[0-9a-zA-z\.\*]+$/)) {
                                                ActionClass = using(actionClass); //ActionClass is class
                                                m = moduleName || ActionClass.module;
                                                a = actionName || ActionClass.action;
                                        } else {
                                                ActionClass = actionClass; //ActionClass is string
                                                m = moduleName;
                                                a = actionName;
                                        }
                                        assert(typeof m == 'string' && typeof a == 'string', 'Invalid arguments');
                                        //assert(!_.isEmpty(ActionClass)&&!S(m).isEmpty() && !S(a).isEmpty(), 'Invalid arguments');
                                        EasyNode.DEBUG && logger.debug('register action [' + m + '.' + a + ']');
                                        entry[m] = entry[m] || {};
                                        entry[m][a] = ActionClass; //stored class or string
                                        ActionFactory.addActionDescription(m, a, description);
                                } else if (typeof actionClass == 'function') {
                                        var m = actionClass.module;
                                        var a = actionClass.action;
                                        assert(typeof m == 'string' && typeof a == 'string', 'Invalid arguments');
                                        assert(!S(m).isEmpty() && !S(a).isEmpty(), 'Invalid arguments');
                                        EasyNode.DEBUG && logger.debug('register action [' + m + '.' + a + ']');
                                        entry[m] = entry[m] || {};
                                        entry[m][a] = actionClass; //stored class, not string
                                        ActionFactory.addActionDescription(m, a, description);
                                } else if ((typeof actionClass === 'undefined' ? 'undefined' : _typeof(actionClass)) == 'object') {
                                        var m = actionClass.module;
                                        var a = actionClass.action;
                                        assert(actionClass instanceof Action, 'Invalid action instance');
                                        assert(m && a, 'Invalid action instance');
                                        EasyNode.DEBUG && logger.debug('register action [' + m + '.' + a + ']');
                                        entry[m] = entry[m] || {};
                                        entry[m][a] = actionClass; //stored class instance, not string
                                        ActionFactory.addActionDescription(m, a, description);
                                } else {
                                        throw new Error('Invalid argument');
                                }
                        }
                }, {
                        key: 'registerNamespace',
                        value: function registerNamespace(namespace) {
                                var pattern = arguments.length <= 1 || arguments[1] === undefined ? /^.*Action\.js$/ : arguments[1];

                                return regeneratorRuntime.mark(function _callee() {
                                        var path, stat, files;
                                        return regeneratorRuntime.wrap(function _callee$(_context) {
                                                while (1) {
                                                        switch (_context.prev = _context.next) {
                                                                case 0:
                                                                        _context.next = 2;
                                                                        return EasyNode.namespace2Path(namespace);

                                                                case 2:
                                                                        path = _context.sent;
                                                                        _context.next = 5;
                                                                        return fs.stat(path);

                                                                case 5:
                                                                        stat = _context.sent;

                                                                        if (!stat.isFile()) {
                                                                                _context.next = 8;
                                                                                break;
                                                                        }

                                                                        throw new Error('Invalid namespace, not a directory');

                                                                case 8:
                                                                        _context.next = 10;
                                                                        return fs.readdir(path);

                                                                case 10:
                                                                        files = _context.sent;

                                                                        files.forEach(function (file) {
                                                                                if (file.match(pattern)) {
                                                                                        ActionFactory.register(namespace + '.' + file.replace(/\.js$/, ''));
                                                                                }
                                                                        });

                                                                case 12:
                                                                case 'end':
                                                                        return _context.stop();
                                                        }
                                                }
                                        }, _callee, this);
                                });
                        }

                        /**
                         * 加载一个根据函数名路由的Action。
                         *
                         * @method registerMethodDispatchedAction
                         * @param {String/Class} namespace  String: 命名空间，指明一个全类名；Class : 类，要求继承于MethodDispatchedAction
                         * @param {String} moduleName 模块名
                         * @async
                         * @since 0.1.0
                         * @author hujiabao
                         * */

                }, {
                        key: 'registerMethodDispatchedAction',
                        value: function registerMethodDispatchedAction(namespace) {
                                var moduleName = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

                                assert(typeof namespace == 'string' || typeof namespace == 'function', 'Invalid arguments');
                                var MethodDispatchedActionClass = namespace;
                                if (typeof namespace == 'string') {
                                        MethodDispatchedActionClass = using(namespace);
                                }
                                var instance = new MethodDispatchedActionClass();
                                if (moduleName) {
                                        instance.moduleName(moduleName);
                                }
                                instance.register();
                        }

                        /**
                         * 从.json文件中加载Action。
                         *
                         * @method initialize
                         * @param {...} ...  文件相对路径，多参
                         * @async
                         * @static
                         * @since 0.1.0
                         * @author hujiabao
                         * */

                }, {
                        key: 'initialize',
                        value: function initialize() {
                                var arr = _.toArray(arguments);
                                return regeneratorRuntime.mark(function _callee2() {
                                        var i, file, content, o, m, actionModule, actions;
                                        return regeneratorRuntime.wrap(function _callee2$(_context2) {
                                                while (1) {
                                                        switch (_context2.prev = _context2.next) {
                                                                case 0:
                                                                        i = 0;

                                                                case 1:
                                                                        if (!(i < arr.length)) {
                                                                                _context2.next = 11;
                                                                                break;
                                                                        }

                                                                        file = EasyNode.real(arr[i]);
                                                                        _context2.next = 5;
                                                                        return fs.readFile(file);

                                                                case 5:
                                                                        content = _context2.sent;
                                                                        o = JSON.parse(content.toString());

                                                                        for (m in o) {
                                                                                actionModule = m;
                                                                                actions = o[m];

                                                                                actions.forEach(function (action) {
                                                                                        var actionName = action['action-name'] || '';
                                                                                        if (action['enabled'] !== false && action['enabled'] !== 'false') {
                                                                                                var description = action['description'] || '';
                                                                                                var actionType = action['type'];
                                                                                                if (action.hasOwnProperty('action-class')) {
                                                                                                        ActionFactory.register(action['action-class'], actionModule, actionName, description);
                                                                                                } else if (action.hasOwnProperty('action-bean')) {
                                                                                                        ActionFactory.register(action['action-bean'], actionModule, actionName, description);
                                                                                                } else {
                                                                                                        throw new Error('Invalid argument');
                                                                                                }
                                                                                        } else {
                                                                                                logger.info('disabled action [' + actionModule + '.' + actionName + ']');
                                                                                        }
                                                                                });
                                                                        }

                                                                case 8:
                                                                        i++;
                                                                        _context2.next = 1;
                                                                        break;

                                                                case 11:
                                                                case 'end':
                                                                        return _context2.stop();
                                                        }
                                                }
                                        }, _callee2, this);
                                });
                        }

                        /**
                         * 查找一个Action。
                         *
                         * @method find
                         * @param {String} m  模块名
                         * @param {String} a Action名
                         * @return {easynode.framework.mvc.Action} Action实现类，继承自easynode.framework.mvc.Action。
                         * @private
                         * @static
                         * @since 0.1.0
                         * @author hujiabao
                         * */

                }, {
                        key: 'find',
                        value: function find(m, a) {
                                assert(typeof m == 'string' && typeof a == 'string', 'Invalid arguments');
                                assert(!S(m).isEmpty() && !S(a).isEmpty(), 'Invalid arguments');
                                return entry[m] && entry[m][a] ? entry[m][a] : null;
                        }

                        /**
                         * 枚举出所有的Action。
                         *
                         * @method list
                         * @param {String} m  模块名，不传时表示枚举所有的Action。
                         * @return {Array} Action实现类数组，继承自easynode.framework.mvc.Action。
                         * @static
                         * @since 0.1.0
                         * @author hujiabao
                         * */

                }, {
                        key: 'list',
                        value: function list(m) {
                                var l = [];
                                if (m) {
                                        l = descriptionMap.get(m);
                                } else {
                                        var keys = descriptionMap.keys();
                                        var _iteratorNormalCompletion = true;
                                        var _didIteratorError = false;
                                        var _iteratorError = undefined;

                                        try {
                                                for (var _iterator = keys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                                                        var key = _step.value;

                                                        l.push.apply(l, descriptionMap.get(key));
                                                }
                                        } catch (err) {
                                                _didIteratorError = true;
                                                _iteratorError = err;
                                        } finally {
                                                try {
                                                        if (!_iteratorNormalCompletion && _iterator.return) {
                                                                _iterator.return();
                                                        }
                                                } finally {
                                                        if (_didIteratorError) {
                                                                throw _iteratorError;
                                                        }
                                                }
                                        }
                                }
                                return l;
                        }

                        /**
                         * 创建一个Action实例。
                         *
                         * @method createActionInstance
                         * @param {String} m  模块名。
                         * @param {String} a Action名。
                         * @param {easynode.framework.mvc.ActionContext} ctx ActionContext实例。
                         * @return {easynode.framework.mvc.Action} Action实例，不是Action类。
                         * @static
                         * @since 0.1.0
                         * @author hujiabao
                         * */

                }, {
                        key: 'createActionInstance',
                        value: function createActionInstance(m, a, ctx) {
                                assert(typeof m == 'string' && typeof a == 'string', 'Invalid arguments');
                                assert(!S(m).isEmpty() && !S(a).isEmpty(), 'Invalid arguments');

                                var Clazz = ActionFactory.find(m, a);
                                if (Clazz) {
                                        var ret = null;
                                        if (typeof Clazz == 'function') {
                                                var action = new Clazz();
                                                action.setModule(m);
                                                action.setActionName(a);
                                                action.setContext(ctx);
                                                ctx && ctx.setAction(action);
                                                ret = action;
                                        } else if ((typeof Clazz === 'undefined' ? 'undefined' : _typeof(Clazz)) == 'object') {
                                                Clazz.setModule(m);
                                                Clazz.setActionName(a);
                                                Clazz.setContext(ctx);
                                                ctx && ctx.setAction(Clazz);
                                                ret = Clazz;
                                        } else if (typeof Clazz == 'string') {
                                                Clazz = Clazz.replace('$', '');
                                                Clazz = BeanFactory.get(Clazz);
                                                assert(Clazz instanceof Action, 'Invalid action type');
                                                Clazz.setModule(m);
                                                Clazz.setActionName(a);
                                                Clazz.setContext(ctx);
                                                ctx && ctx.setAction(Clazz);
                                                ret = Clazz;
                                        }
                                        return ret;
                                }
                        }

                        /**
                         * 注册action信息
                         *
                         * @method addActionDescription
                         * @param
                         * @static
                         * @since 0.1.0
                         * @author hujiabao
                         * */

                }, {
                        key: 'addActionDescription',
                        value: function addActionDescription(m, a, description) {
                                assert(typeof m == 'string' && typeof a == 'string', 'Invalid arguments');
                                assert(!S(m).isEmpty() && !S(a).isEmpty(), 'Invalid arguments');
                                var obj = {
                                        "moduleName": m,
                                        "actionName": a,
                                        "state": 1,
                                        "description": description
                                };
                                var actions = descriptionMap.has(m) ? descriptionMap.get(m) : [];
                                actions.push(obj);
                                descriptionMap.set(m, actions);
                        }
                }]);

                return ActionFactory;
        }(GenericObject);

        module.exports = ActionFactory;
})();