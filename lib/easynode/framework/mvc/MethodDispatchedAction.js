'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var GenericObject = using('easynode.GenericObject');
var ActionFactory = using('easynode.framework.mvc.ActionFactory');
var Action = using('easynode.framework.mvc.Action');
var _ = require('underscore');

(function () {
        /**
         * Class MethodDispatchedAction
         *
         * @class easynode.framework.mvc.MethodDispatchedAction
         * @extends easynode.GenericObject
         * @since 0.1.0
         * @author hujiabao
         * */

        var MethodDispatchedAction = (function (_GenericObject) {
                _inherits(MethodDispatchedAction, _GenericObject);

                /**
                 * 构造函数。
                 *
                 * @method 构造函数
                 * @param {String} moduleName Action模块名
                 * @param {String} entryMethodPrefix action处理函数名前缀，默认action_
                 * @param {String} argDefineMethodPrefix action参数定义函数名前缀，默认arg_
                 * @since 0.1.0
                 * @author hujiabao
                 * */

                function MethodDispatchedAction(moduleName) {
                        var entryMethodPrefix = arguments.length <= 1 || arguments[1] === undefined ? 'action_' : arguments[1];
                        var argDefineMethodPrefix = arguments.length <= 2 || arguments[2] === undefined ? 'arg_' : arguments[2];

                        _classCallCheck(this, MethodDispatchedAction);

                        //调用super()后再定义子类成员。

                        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(MethodDispatchedAction).call(this));

                        _this._moduleName = moduleName;
                        _this._entryMethodPrefix = entryMethodPrefix;
                        _this._argDefineMethodPrefix = argDefineMethodPrefix;
                        _this._actionEntries = [];
                        return _this;
                }

                /**
                 * 添加一个Action入口。
                 *
                 * @method dispatch
                 * @param {function} entry 函数，应当总是返回一个对象，该对象的defineArgs和process函数会绑定到一个Action的实例上执行。
                 *      对象原型为：{
                 *                                      brief : 'action简述',
                 *                                      defineArgs : function() {
                 *                                              this.addArg('a string comment of a');
                 *                                      },
                 *                                      process : function(ctx, arg1, arg2) {
                 *                                              return function * () {
                 *                                                      return ActionResult.createSuccessResult('MDA');
                 *                                              };
                 *                                      }
                 *                            }
                 *
                 * @since 0.1.0
                 * @author hujiabao
                 * */

                _createClass(MethodDispatchedAction, [{
                        key: 'dispatch',
                        value: function dispatch(entry) {
                                assert(typeof entry == 'function', 'Invalid argument');
                                var actionRegExp = new RegExp(this._entryMethodPrefix + '*');
                                assert(entry.name.match(actionRegExp), 'Action processor is not matched to the declared pattern [' + this._entryMethodPrefix + ']');
                                this._actionEntries.push(entry);
                                return this;
                        }

                        /**
                         * 获取或设置Action模块名。
                         *
                         * @method moduleName
                         * @param {String} name 传递此参数时，设置；不传递此参数时获取。
                         * @since 0.1.0
                         * @author hujiabao
                         * */

                }, {
                        key: 'moduleName',
                        value: function moduleName(name) {
                                if (arguments.length == 0) {
                                        return this._moduleName;
                                }
                                assert(name, 'Invalid argument');
                                this._moduleName = name;
                        }

                        /**
                         * 注册所有符合命名规范的Action。Action的模块名为设置的moduleName，Action的名称为处理函数去"processMethodPrefix"(默认：action_)。
                         * 例如：action_aaa返回"aaa"。
                         *
                         * @method register
                         * @since 0.1.0
                         * @author hujiabao
                         * */

                }, {
                        key: 'register',
                        value: function register() {
                                var _this2 = this;

                                this._actionEntries.forEach(function (entryMethod) {
                                        var actionName = _this2._getActionName(entryMethod.name);
                                        var argDefineMethod = _this2._argDefineMethodPrefix + actionName;
                                        var ActionClass = _this2._createActionClass(entryMethod.call(_this2));
                                        Action.define(_this2._moduleName, actionName, ActionClass);
                                        ActionFactory.register(ActionClass);
                                });
                        }
                }, {
                        key: '_createActionClass',
                        value: function _createActionClass(actionEntry) {
                                var argDefineMethod = actionEntry.defineArgs;
                                var processMethod = actionEntry.process || function (ctx) {
                                        return regeneratorRuntime.mark(function _callee() {
                                                var ActionResult;
                                                return regeneratorRuntime.wrap(function _callee$(_context) {
                                                        while (1) {
                                                                switch (_context.prev = _context.next) {
                                                                        case 0:
                                                                                ActionResult = using('easynode.framework.mvc.ActionResult');
                                                                                return _context.abrupt('return', ActionResult.createNoImplementationError());

                                                                        case 2:
                                                                        case 'end':
                                                                                return _context.stop();
                                                                }
                                                        }
                                                }, _callee, this);
                                        });
                                };

                                var ActionClass = (function (_Action) {
                                        _inherits(ActionClass, _Action);

                                        function ActionClass() {
                                                _classCallCheck(this, ActionClass);

                                                var _this3 = _possibleConstructorReturn(this, Object.getPrototypeOf(ActionClass).call(this));

                                                if (argDefineMethod) {
                                                        argDefineMethod.call(_this3);
                                                }
                                                _this3.brief = actionEntry.brief;
                                                return _this3;
                                        }

                                        _createClass(ActionClass, [{
                                                key: 'process',
                                                value: function process(ctx) {
                                                        var me = this;
                                                        var args = arguments;
                                                        return regeneratorRuntime.mark(function _callee2() {
                                                                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                                                                        while (1) {
                                                                                switch (_context2.prev = _context2.next) {
                                                                                        case 0:
                                                                                                _context2.next = 2;
                                                                                                return processMethod.apply(me, args);

                                                                                        case 2:
                                                                                                return _context2.abrupt('return', _context2.sent);

                                                                                        case 3:
                                                                                        case 'end':
                                                                                                return _context2.stop();
                                                                                }
                                                                        }
                                                                }, _callee2, this);
                                                        });
                                                }
                                        }]);

                                        return ActionClass;
                                })(Action);

                                return ActionClass;
                        }
                }, {
                        key: '_getActionName',
                        value: function _getActionName(methodName) {
                                return methodName.replace(new RegExp(this._entryMethodPrefix), '');
                        }
                }, {
                        key: 'getClassName',
                        value: function getClassName() {
                                return EasyNode.namespace(__filename);
                        }
                }]);

                return MethodDispatchedAction;
        })(GenericObject);

        module.exports = MethodDispatchedAction;
})();