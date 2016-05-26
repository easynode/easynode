'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var GenericObject = using('easynode.GenericObject');
var S = require('string');
var JSONView = using('easynode.framework.mvc.JSONView');
var ActionResult = using('easynode.framework.mvc.ActionResult');

(function () {
        /**
         * Action抽象类。定义了Action的一些抽象函数，子类需要实现这些抽象函数。Action的子类的构造器只能传递一个类型为ActionContext的参数。
         * 同时，Action的子类应具有module和name两个静态属性对应于添加到ActionFactory时的module和name.
         * <h5>示例</h5>
         *
         *      //sample
         *      var Action = using('easynode.framework.mvc.Action');
         *      class MyAction extends Action {
         *              constructor (ctx) {
         *                      super(ctx);
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
         *
         * @class easynode.framework.mvc.Action
         * @extends easynode.GenericObject
         * @abstract
         * @since 0.1.0
         * @author hujiabao
         * */

        var Action = function (_GenericObject) {
                _inherits(Action, _GenericObject);

                /**
                 * 构造函数。
                 *
                 * @method 构造函数
                 * @since 0.1.0
                 * @author hujiabao
                 * */

                function Action() {
                        _classCallCheck(this, Action);

                        //调用super()后再定义子类成员。
                        /**
                         * easynode.framework.mvc.ActionContext实例
                         *
                         * @property ctx
                         * @protected
                         * @type easynode.framework.mvc.ActionContext
                         * @since 0.1.0
                         * @author hujiabao
                         * */

                        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Action).call(this));

                        _this.ctx = null;

                        /**
                         * Action参数
                         *
                         * @property args
                         * @protected
                         * @type {Array}  Element Notation :
                         *                              {
                         *                                       name : '参数名'
                         *                                       type : '参数类型'
                         *                                       comment : '参数注释'
                         *                              }
                         * @since 0.1.0
                         * @author hujiabao
                         * */
                        _this.args = [];

                        /**
                         * 视图
                         *
                         * @property view
                         * @protected
                         * @type {easynode.framework.mvc.View}
                         * @default new easynode.framework.mvc.JSONView
                         * @since 0.1.0
                         * @author hujiabao
                         * */
                        _this.view = new JSONView();
                        /**
                         * 视图渲染参数
                         *
                         * @property viewOptions
                         * @protected
                         * @type {Object}
                         * @default {}
                         * @since 0.1.0
                         * @author hujiabao
                         * */
                        _this.viewOptions = {};
                        return _this;
                }

                /**
                 * 设置视图。
                 *
                 * @method setView
                 * @param {easynode.framework.mvc.View} view 视图
                 * @param {Object} opts 视图渲染参数
                 * @since 0.1.0
                 * @author hujiabao
                 * */


                _createClass(Action, [{
                        key: 'setView',
                        value: function setView(view) {
                                var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

                                assert(view, 'Invalid argument');
                                this.view = view;
                                this.viewOptions = opts;
                        }

                        /**
                         * 获得视图。
                         *
                         * @method getView
                         * @return {easynode.framework.mvc.View} 当前Action的视图
                         * @since 0.1.0
                         * @author hujiabao
                         * */

                }, {
                        key: 'getView',
                        value: function getView() {
                                return this.view;
                        }

                        /**
                         * 获得视图渲染参数。
                         *
                         * @method getViewOptions
                         * @return {Object} opts 视图渲染参数
                         * @since 0.1.0
                         * @author hujiabao
                         * */

                }, {
                        key: 'getViewOptions',
                        value: function getViewOptions() {
                                return this.viewOptions;
                        }

                        /**
                         * 获取Action全名。
                         *
                         * @method getFullName
                         * @return {String} Action全名，$module.$action
                         * @since 0.1.0
                         * @author hujiabao
                         * */

                }, {
                        key: 'getFullName',
                        value: function getFullName() {
                                return this.module + '.' + this.action;
                        }

                        /**
                         * 设置Action的执行上下文环境。
                         *
                         * @method setContext
                         * @param {easynode.framework.mvc.ActionContext} ctx Action执行上下文环境
                         * @since 0.1.0
                         * @author hujiabao
                         * */

                }, {
                        key: 'setContext',
                        value: function setContext(ctx) {
                                this.ctx = ctx;
                        }

                        /**
                         * 获取Action的执行上下文环境。
                         *
                         * @method getContext
                         * @return {easynode.framework.mvc.ActionContext} Action执行上下文环境
                         * @since 0.1.0
                         * @author hujiabao
                         * */

                }, {
                        key: 'getContext',
                        value: function getContext() {
                                return this.ctx;
                        }

                        /**
                         * 设置模块名，框架内使用，请不要在任何地方调用此函数。
                         *
                         * @method setModule
                         * @param {String} m 模块名
                         * @private
                         * @since 0.1.0
                         * @author hujiabao
                         * */

                }, {
                        key: 'setModule',
                        value: function setModule(m) {
                                assert(typeof m == 'string' && S(m).trim().length > 0, 'Invalid module name');
                                this.module = m;
                        }

                        /**
                         * 获取Action的模块名。
                         *
                         * @method getModule
                         * @return {String} Action模块名
                         * @since 0.1.0
                         * @author hujiabao
                         * */

                }, {
                        key: 'getModule',
                        value: function getModule() {
                                return this.getModule();
                        }

                        /**
                         * 设置Action名，框架内使用，请不要在任何地方调用此函数。
                         *
                         * @method setActionName
                         * @param {String} a Action名
                         * @private
                         * @since 0.1.0
                         * @author hujiabao
                         * */

                }, {
                        key: 'setActionName',
                        value: function setActionName(a) {
                                assert(typeof a == 'string' && S(a).trim().length > 0, 'Invalid action name');
                                this.action = a;
                        }

                        /**
                         * 获取Action名。
                         *
                         * @method getActionName
                         * @return {String} Action名
                         * @since 0.1.0
                         * @author hujiabao
                         * */

                }, {
                        key: 'getActionName',
                        value: function getActionName() {
                                return this.action;
                        }

                        /**
                         * 获取Action参数列表。
                         *
                         * @method getArgs
                         * @return {Array} Action参数列表，参考args(protected)属性。
                         * @since 0.1.0
                         * @author hujiabao
                         * */

                }, {
                        key: 'getArgs',
                        value: function getArgs() {
                                return this.args || [];
                        }

                        /**
                         * 增加一个或多个参数。可链式调用。
                         *
                         * @method addArg
                         * @param {...} o 接受多参，string或JSON对象，对象Notation:
                         *                              {
                         *                                      name : '',
                         *                                      type : '',
                         *                                      comment : ''
                         *                              }
                         *                              type表示实际值类型，默认'string'。
                         *                              当元素为string型时，接受$name $type $comment格式的简化定义方式，用空格分开名称、类型和备注
                         * @return {Action} 返回this, 可链式调用。
                         * @since 0.1.0
                         * @author hujiabao
                         * @example
                         *      this.addArg('field1', 'field2');                                                //field1 with type string
                         *      this.addArg({name : 'field1', type : 'int'});                           //field1 with type int
                         *      // 支持的类型有：
                         *      string，字符串类型，默认
                         *      int，     整数型
                         *      float(x)，浮点数型，保留x位小数
                         *      array，   数组，每个元素使用","(逗号)分隔
                         *      date,       日期型
                         *      datetime,       日期时间型，精确到分钟
                         *      datetimeS,     日期时间型，精确到秒
                         *      json,       JSON对象
                         * */

                }, {
                        key: 'addArg',
                        value: function addArg() {
                                var _this2 = this;

                                for (var _len = arguments.length, o = Array(_len), _key = 0; _key < _len; _key++) {
                                        o[_key] = arguments[_key];
                                }

                                o.forEach(function (a) {
                                        if (typeof a == 'string') {
                                                var regExp = /^(\w+)\s([\w|\(|\)]+)\s?(.*)$/;
                                                if (a.match(regExp)) {
                                                        var parsed = regExp.exec(a);
                                                        a = {
                                                                name: parsed[1],
                                                                type: parsed[2],
                                                                comment: parsed[3] || ''
                                                        };
                                                } else {
                                                        a = {
                                                                name: a
                                                        };
                                                }
                                        }
                                        assert(a.name, 'Invalid argument');
                                        a.type = a.type || 'string';
                                        a.comment = a.comment || '';
                                        if (_this2.hasArg(a.name)) {
                                                logger.warn('Duplicate definition of arg [' + a.name + ']');
                                        }
                                        _this2.args.push(a);
                                });
                                return this;
                        }

                        /**
                         *  是否定义了名为name的参数。
                         *
                         * @method hasArg
                         * @param {String} name 参数名
                         * @return {boolean} 是否包含名为name的参数。
                         * @since 0.1.0
                         * @author hujiabao
                         * */

                }, {
                        key: 'hasArg',
                        value: function hasArg(name) {
                                this.args.forEach(function (arg) {
                                        if (arg.name == name) {
                                                return true;
                                        }
                                });
                                return false;
                        }

                        /**
                         * 验证Action的调用上下文环境，通常用于验证上下文环境中的输入参数。
                         *
                         * @method validate
                         * @return {Object/boolean} 返回boolean时，true表示验证参数成功，false表示验证失败。返回对象的示例：
                         *              {
                         *                      result : true/false,            //同boolean返回值
                         *                      msg : '错误消息',               //错误消息，返回到前端
                         *              }
                         * @async
                         * @since 0.1.0
                         * @author hujiabao
                         * */

                }, {
                        key: 'validate',
                        value: function validate(ctx) {
                                return regeneratorRuntime.mark(function _callee() {
                                        return regeneratorRuntime.wrap(function _callee$(_context) {
                                                while (1) {
                                                        switch (_context.prev = _context.next) {
                                                                case 0:
                                                                        return _context.abrupt('return', ctx != null);

                                                                case 1:
                                                                case 'end':
                                                                        return _context.stop();
                                                        }
                                                }
                                        }, _callee, this);
                                });
                        }

                        /**
                         * 验证Action的调用权限。建议通过RBAC插件统一设置权限校验函数。
                         *
                         * @method validate
                         * @return {Object/boolean} 返回boolean时，true表示验证权限成功，false表示验证权限失败。返回对象的示例：
                         *              {
                         *                      result : true/false,            //同boolean返回值
                         *                      msg : '错误消息',               //错误消息，返回到前端
                         *              }
                         * @async
                         * @since 0.1.0
                         * @author hujiabao
                         * */

                }, {
                        key: 'authorize',
                        value: function authorize(ctx) {
                                return regeneratorRuntime.mark(function _callee2() {
                                        return regeneratorRuntime.wrap(function _callee2$(_context2) {
                                                while (1) {
                                                        switch (_context2.prev = _context2.next) {
                                                                case 0:
                                                                        return _context2.abrupt('return', true);

                                                                case 1:
                                                                case 'end':
                                                                        return _context2.stop();
                                                        }
                                                }
                                        }, _callee2, this);
                                });
                        }

                        /**
                         * 执行Action处理过程。
                         *
                         * @method process
                         * @param {easynode.framework.mvc.ActionContext} ctx ActionContext实例
                         * @param {...} args 参数表，参数顺序与类型取决于args属性
                         * @return {Object/boolean} 返回boolean时，true表示验证参数成功，false表示验证失败。
                         * @async
                         * @since 0.1.0
                         * @author hujiabao
                         * */

                }, {
                        key: 'process',
                        value: function process(ctx) {
                                return regeneratorRuntime.mark(function _callee3() {
                                        return regeneratorRuntime.wrap(function _callee3$(_context3) {
                                                while (1) {
                                                        switch (_context3.prev = _context3.next) {
                                                                case 0:
                                                                        return _context3.abrupt('return', ActionResult.createNoImplementationError());

                                                                case 1:
                                                                case 'end':
                                                                        return _context3.stop();
                                                        }
                                                }
                                        }, _callee3, this);
                                });
                        }

                        /**
                         * 中断Action的执行，并且抛出异常结果，通常使用在process函数中需要直接返回错误结果的情况。在执行Action时，如果
                         * 捕获到的异常是ActionResult实例，则应直接将此ActionResult渲染后返回给客户端。
                         *
                         * @method throwErrorResult
                         * @param {easynode.framework.mvc.ActionResult} actionResult ActionResult实例
                         * @throws Error 总是会抛出一个异常。该异常具有一个executeResult属性，传递ActionResult结果。
                         * @since 0.1.0
                         * @author hujiabao
                         * */

                }, {
                        key: 'throwErrorResult',
                        value: function throwErrorResult() {
                                var actionResult = arguments.length <= 0 || arguments[0] === undefined ? ActionResult.createErrorResult() : arguments[0];

                                var err = new Error(actionResult);
                                var me = this;
                                err.executeResult = {
                                        action: me,
                                        actionResult: actionResult
                                };
                                throw err;
                        }

                        /**
                         * Action是否需要数据源支持。默认返回true。
                         *
                         * @method datasourceSupport
                         * @return {boolean} 返回该Action是否需要数据源支持，需要数据库支持时，ActionListener根据此选项连接数据库并自动开启和关闭数据库事务
                         * @since 0.1.0
                         * @author hujiabao
                         * */

                }, {
                        key: 'datasourceSupport',
                        value: function datasourceSupport() {
                                return true;
                        }

                        /**
                         * 定义某个类为Action类，为其绑定module和action属性。
                         *
                         * @method define
                         * @param {String} m 模块名
                         * @param {String} a Action名
                         * @param {Class} Action实现类
                         * @static
                         * @since 0.1.0
                         * @author hujiabao
                         * @example
                         *      var Action = using('easynode.framework.mvc.Action');
                         *      class MyAction extends Action {
                         *              constructor (env) {
                         *                      super(env);
                         *              }
                         *      }
                         *
                         *      // 访问：http://localhost:5000/rest/demoM/demoA
                         *      Action.define('demoM', 'demoA', MyAction);
                         * */

                }, {
                        key: 'getClassName',
                        value: function getClassName() {
                                return EasyNode.namespace(__filename);
                        }
                }], [{
                        key: 'define',
                        value: function define(m, a, actionClass) {
                                actionClass.module = m;
                                actionClass.action = a;
                        }
                }]);

                return Action;
        }(GenericObject);

        module.exports = Action;
})();