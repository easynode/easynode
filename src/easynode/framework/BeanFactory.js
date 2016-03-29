'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var GenericObject = using('easynode.GenericObject');
var _ = require('underscore');
var fs = require('co-fs');

(function () {
        var configuration = {};
        var singletons = {};

        var INT_CONFIG_REGEXP = /^\$int\((.*)\)$/;
        var FLOAT_CONFIG_REGEXP = /^\$float\((.*)\)$/;
        var STRING_CONFIG_REGEXP = /^\$str\((.*)\)$/;
        var BEAN_REGEXP = /^\$(.*)$/;

        /**
         * Class BeanFactory
         *
         * @class easynode.framework.BeanFactory
         * @extends easynode.GenericObject
         * @since 0.1.0
         * @author hujiabao
         * */

        var BeanFactory = function (_GenericObject) {
                _inherits(BeanFactory, _GenericObject);

                /**
                 * 构造函数。
                 *
                 * @method 构造函数
                 * @since 0.1.0
                 * @author hujiabao
                 * */

                function BeanFactory() {
                        _classCallCheck(this, BeanFactory);

                        return _possibleConstructorReturn(this, Object.getPrototypeOf(BeanFactory).call(this));
                        //调用super()后再定义子类成员。
                }

                /**
                 * 初始化BeanFactory。逐个读取参数中的文件，根据参数中的文件描述创建BeanFactory，实现IoC。这些文件应当是标准的JSON数据格式。
                 *
                 * @method initialize
                 * @static
                 * @async
                 * @since 0.1.0
                 * @author hujiabao
                 *
                 * @example
                 *      yield BeanFactory.initialize('etc/beans/demo-easynode-beans.json', 'etc/beans/demo-easynode-beans-1.json');
                 * */


                _createClass(BeanFactory, [{
                        key: 'getClassName',
                        value: function getClassName() {
                                return EasyNode.namespace(__filename);
                        }
                }], [{
                        key: 'initialize',
                        value: function initialize() {
                                var arr = _.toArray(arguments);
                                return regeneratorRuntime.mark(function _callee() {
                                        var i, file, exists, content, o;
                                        return regeneratorRuntime.wrap(function _callee$(_context) {
                                                while (1) {
                                                        switch (_context.prev = _context.next) {
                                                                case 0:
                                                                        i = 0;

                                                                case 1:
                                                                        if (!(i < arr.length)) {
                                                                                _context.next = 17;
                                                                                break;
                                                                        }

                                                                        file = EasyNode.real(arr[i]);
                                                                        _context.next = 5;
                                                                        return fs.exists(file);

                                                                case 5:
                                                                        exists = _context.sent;

                                                                        if (exists) {
                                                                                _context.next = 8;
                                                                                break;
                                                                        }

                                                                        throw new Error('beans configuration file [' + file + '] is not found');

                                                                case 8:
                                                                        _context.next = 10;
                                                                        return fs.readFile(file);

                                                                case 10:
                                                                        content = _context.sent;

                                                                        content = content.toString();
                                                                        o = JSON.parse(content);

                                                                        _.extend(configuration, o);

                                                                case 14:
                                                                        i++;
                                                                        _context.next = 1;
                                                                        break;

                                                                case 17:
                                                                case 'end':
                                                                        return _context.stop();
                                                        }
                                                }
                                        }, _callee, this);
                                });
                        }

                        /**
                         * 根据bean ID获取Bean。
                         *
                         * @method get
                         * @param {String} id bean ID。
                         * @return {Object} bean实例。
                         * @static
                         * @since 0.1.0
                         * @author hujiabao
                         *
                         * @example
                         *      yield BeanFactory.initialize('etc/beans/demo-easynode-beans.json', 'etc/beans/demo-easynode-beans-1.json');
                         *      var bean1 = BeanFactory.get('bean1');
                         *      bean1.name1 = 'hujiabao';
                         *      bean1 = BeanFactory.get('bean1');
                         *      console.log(bean.name1);                //hujiabao, 使用singleton或prototype来描述创建bean的行为模式是单例还是原型。
                         * */

                }, {
                        key: 'get',
                        value: function get(id) {
                                return BeanFactory.bean(id);
                        }
                }, {
                        key: 'init',
                        value: function init(id) {
                                return BeanFactory.get(id);
                        }

                        /**
                         * 放置一个单例bean至BeanFactory。可链式调用。
                         *
                         * @method put
                         * @param {String} id bean ID。
                         * @param {Object} obj bean实例。
                         * @return {easynode.framework.BeanFactory} 返回BeanFactory类，可链式调用
                         * @static
                         * @since 0.1.0
                         * @author hujiabao
                         *
                         * */

                }, {
                        key: 'put',
                        value: function put(id, obj) {
                                assert(id && obj, 'Invalid argument');
                                if (configuration[id]) {
                                        throw new Error('Duplicated bean id [${id}]');
                                }
                                configuration[id] = {
                                        scope: 'singleton'
                                };
                                singletons[id] = obj;
                                return BeanFactory;
                        }
                }, {
                        key: 'bean',
                        value: function bean(id) {
                                var cfg = configuration[id];
                                if (cfg == null) {
                                        throw new Error('bean [' + id + '] is not defined');
                                }
                                if ((typeof cfg === 'undefined' ? 'undefined' : _typeof(cfg)) != 'object') {
                                        throw new Error('definition of bean [' + id + '] is incorrect');
                                }

                                var scope = cfg['scope'] || 'singleton';
                                if (scope == 'singleton') {
                                        if (singletons[id] != null) {
                                                return singletons[id];
                                        }
                                        var o = BeanFactory.createBean(id, cfg);
                                        return singletons[id] = o;
                                } else if (scope == 'prototype') {
                                        return BeanFactory.createBean(id, cfg);
                                } else {
                                        throw new Error('Invalid bean scope [' + scope + ']');
                                }
                        }
                }, {
                        key: 'createBean',
                        value: function createBean(id, cfg) {
                                var className = cfg['class'];
                                var init = cfg['init'];
                                var destroy = cfg['destroy'];
                                var props = cfg['props'];
                                var Clazz = using(className);

                                var obj = null;
                                if (typeof Clazz == 'function') {
                                        //export a Class
                                        obj = new Clazz();
                                } else {
                                        obj = Clazz; //export a module or an literal object
                                }

                                if (props) {
                                        assert((typeof props === 'undefined' ? 'undefined' : _typeof(props)) == 'object', 'Invalid props config of bean [' + id + ']');
                                        for (var key in props) {
                                                var val = BeanFactory.eval(props[key]);
                                                obj[key] = val;
                                        }
                                }

                                if (init) {
                                        assert(typeof obj[init] == 'function', 'Initialize function of bean [' + id + '] is not found');
                                        var initArgs = cfg['init-args'];
                                        var initArgVals = [];
                                        if (initArgs) {
                                                assert(_.isArray(initArgs), 'Invalid init arguments');
                                                for (var i = 0; i < initArgs.length; i++) {
                                                        initArgVals.push(BeanFactory.eval(initArgs[i]));
                                                }
                                        }
                                        obj[init].apply(obj, initArgVals);
                                }

                                return obj;
                        }
                }, {
                        key: 'eval',
                        value: function _eval(exp) {
                                if (exp == null) return exp;

                                if (typeof exp == 'number') {
                                        return exp;
                                }

                                if ((typeof exp === 'undefined' ? 'undefined' : _typeof(exp)) == 'object') {
                                        for (var key in exp) {
                                                exp[key] = BeanFactory.eval(exp[key]);
                                        }
                                }

                                if (INT_CONFIG_REGEXP.test(exp)) {
                                        var configKey = INT_CONFIG_REGEXP.exec(exp)[1];
                                        return parseInt(EasyNode.config(configKey, '0'));
                                }

                                if (FLOAT_CONFIG_REGEXP.test(exp)) {
                                        var configKey = FLOAT_CONFIG_REGEXP.exec(exp)[1];
                                        return parseFloat(EasyNode.config(configKey, '0'));
                                }

                                if (STRING_CONFIG_REGEXP.test(exp)) {
                                        var configKey = STRING_CONFIG_REGEXP.exec(exp)[1];
                                        return EasyNode.config(configKey);
                                }

                                if (BEAN_REGEXP.test(exp)) {
                                        var beanId = BEAN_REGEXP.exec(exp)[1] || '';
                                        return BeanFactory.bean(beanId);
                                }

                                return exp;
                        }
                }]);

                return BeanFactory;
        }(GenericObject);

        module.exports = BeanFactory;
})();