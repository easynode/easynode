'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var GenericObject = using('easynode.GenericObject');
var _ = require('underscore');
var fs = require('fs');

(function () {
        var _actionAOPs = {};

        /**
         * Class ActionAOP
         *
         * @class easynode.framework.ActionAOP.ActionAOP
         * @extends easynode.GenericObject
         * @since 0.1.0
         * @author hujiabao
         * */

        var ActionAOP = function (_GenericObject) {
                _inherits(ActionAOP, _GenericObject);

                /**
                 * 构造函数。
                 *
                 * @method 构造函数
                 * @since 0.1.0
                 * @author hujiabao
                 * */

                function ActionAOP() {
                        _classCallCheck(this, ActionAOP);

                        return _possibleConstructorReturn(this, Object.getPrototypeOf(ActionAOP).call(this));
                        //调用super()后再定义子类成员。
                }

                /**
                 * 清除Action AOP。
                 *
                 * @method actionAOPClear
                 * @param {String} m 模块名
                 * @param {String} a Action名
                 * @static
                 * @since 0.1.0
                 * @author hujiabao
                 * */


                _createClass(ActionAOP, [{
                        key: 'getClassName',
                        value: function getClassName() {
                                return EasyNode.namespace(__filename);
                        }
                }], [{
                        key: 'actionAOPClear',
                        value: function actionAOPClear(m, a) {
                                var fullName = m + '.' + a;
                                delete _actionAOPs[fullName];
                        }

                        /**
                         * 设置Action AOP。
                         *
                         * @method actionAOPSet
                         * @param {String} m 模块名
                         * @param {String} a Action名
                         * @param {generator} before process前置处理函数，function * (ctx, ...args) {} 与Action的process函数同参
                         * @param {after} after process后置处理函数，function * (ctx, actionResult) {}
                         * @static
                         * @since 0.1.0
                         * @author hujiabao
                         * */

                }, {
                        key: 'actionAOPSet',
                        value: function actionAOPSet(m, a, _before, _after) {
                                var fullName = m + '.' + a;
                                assert(_before == null || typeof _before == 'function', 'Invalid argument');
                                assert(_after == null || typeof _after == 'function', 'Invalid argument');
                                assert(_actionAOPs[fullName] == null, 'Action aop of [' + fullName + '] is already set');
                                _actionAOPs[fullName] = {
                                        before: function before() {
                                                var args = arguments;
                                                return regeneratorRuntime.mark(function _callee() {
                                                        return regeneratorRuntime.wrap(function _callee$(_context) {
                                                                while (1) {
                                                                        switch (_context.prev = _context.next) {
                                                                                case 0:
                                                                                        if (!_before) {
                                                                                                _context.next = 4;
                                                                                                break;
                                                                                        }

                                                                                        _context.next = 3;
                                                                                        return _before.apply(null, args);

                                                                                case 3:
                                                                                        return _context.abrupt('return', _context.sent);

                                                                                case 4:
                                                                                case 'end':
                                                                                        return _context.stop();
                                                                        }
                                                                }
                                                        }, _callee, this);
                                                });
                                        },
                                        after: function after() {
                                                var args = arguments;
                                                return regeneratorRuntime.mark(function _callee2() {
                                                        return regeneratorRuntime.wrap(function _callee2$(_context2) {
                                                                while (1) {
                                                                        switch (_context2.prev = _context2.next) {
                                                                                case 0:
                                                                                        if (!_after) {
                                                                                                _context2.next = 4;
                                                                                                break;
                                                                                        }

                                                                                        _context2.next = 3;
                                                                                        return _after.apply(null, args);

                                                                                case 3:
                                                                                        return _context2.abrupt('return', _context2.sent);

                                                                                case 4:
                                                                                case 'end':
                                                                                        return _context2.stop();
                                                                        }
                                                                }
                                                        }, _callee2, this);
                                                });
                                        }
                                };
                        }

                        /**
                         * 执行Action，支持AOP。
                         *
                         * @method actionAOPExec
                         * @param {String} m 模块名
                         * @param {String} a Action名
                         * @param {Action} action Action实例
                         * @param {Array} stack Action的process函数参数栈
                         * @static
                         * @async
                         * @since 0.1.0
                         * @author hujiabao
                         * */

                }, {
                        key: 'actionAOPExec',
                        value: function actionAOPExec(m, a, action, stack) {
                                var fullName = m + '.' + a;
                                var o = _actionAOPs[fullName];
                                return regeneratorRuntime.mark(function _callee3() {
                                        var newStack, actionResult, newActionResult;
                                        return regeneratorRuntime.wrap(function _callee3$(_context3) {
                                                while (1) {
                                                        switch (_context3.prev = _context3.next) {
                                                                case 0:
                                                                        if (!(o && o.before)) {
                                                                                _context3.next = 5;
                                                                                break;
                                                                        }

                                                                        _context3.next = 3;
                                                                        return o.before.apply(action, stack);

                                                                case 3:
                                                                        newStack = _context3.sent;

                                                                        if (newStack) {
                                                                                stack = newStack;
                                                                        }

                                                                case 5:
                                                                        _context3.next = 7;
                                                                        return action.process.apply(action, stack);

                                                                case 7:
                                                                        actionResult = _context3.sent;

                                                                        if (!(o && o.after)) {
                                                                                _context3.next = 13;
                                                                                break;
                                                                        }

                                                                        _context3.next = 11;
                                                                        return o.after.call(action, stack[0], actionResult);

                                                                case 11:
                                                                        newActionResult = _context3.sent;

                                                                        if (newActionResult) {
                                                                                actionResult = newActionResult;
                                                                        }

                                                                case 13:
                                                                        return _context3.abrupt('return', actionResult);

                                                                case 14:
                                                                case 'end':
                                                                        return _context3.stop();
                                                        }
                                                }
                                        }, _callee3, this);
                                });
                        }
                }]);

                return ActionAOP;
        }(GenericObject);

        ActionAOP.BEFORE = 'before';
        ActionAOP.AFTER = 'after';
        ActionAOP.SYNC = 'sync';
        ActionAOP.ASYNC = 'async';

        module.exports = ActionAOP;
})();