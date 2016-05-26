'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var GenericObject = using('easynode.GenericObject');

(function () {
        var _filters = [];

        /**
         * Class ActionFilter
         *
         * @class easynode.framework.mvc.ActionFilter
         * @extends easynode.GenericObject
         * @since 0.1.0
         * @author hujiabao
         * */

        var ActionFilter = function (_GenericObject) {
                _inherits(ActionFilter, _GenericObject);

                /**
                 * 构造函数。
                 *
                 * @method 构造函数
                 * @since 0.1.0
                 * @author hujiabao
                 * */

                function ActionFilter() {
                        var name = arguments.length <= 0 || arguments[0] === undefined ? 'untitled' : arguments[0];

                        _classCallCheck(this, ActionFilter);

                        return _possibleConstructorReturn(this, Object.getPrototypeOf(ActionFilter).call(this));
                        //调用super()后再定义子类成员。
                }

                /**
                 * 过滤Action执行。
                 *
                 * @method filter
                 * @param {String} m 模块名
                 * @param {String} a Action名
                 * @param {Action} action Action实例
                 * @param {Array} stack Action的authorize、validate和process方法调用参数栈，该栈的第一个参数总是为ActionContext实例
                 * @param {generator} next 下一个元素
                 * @return {ActionResult} 返回ActionResult实例，返回null值表示filter执行完成
                 * @async
                 * @since 0.1.0
                 * @author hujiabao
                 * */


                _createClass(ActionFilter, [{
                        key: 'filter',
                        value: function filter(m, a, action, stack, next) {
                                return regeneratorRuntime.mark(function _callee() {
                                        return regeneratorRuntime.wrap(function _callee$(_context) {
                                                while (1) {
                                                        switch (_context.prev = _context.next) {
                                                                case 0:
                                                                        _context.next = 2;
                                                                        return next;

                                                                case 2:
                                                                        return _context.abrupt('return', _context.sent);

                                                                case 3:
                                                                case 'end':
                                                                        return _context.stop();
                                                        }
                                                }
                                        }, _callee, this);
                                });
                        }

                        /**
                         * 向系统的Action过滤器链中增加一个或多个过滤器。
                         *
                         * @method addFilter
                         * @param {..} f ActionFilter实例或具有filter成员函数(generator)的对象，一个或多个
                         * @return {ActionFilter} 返回ActionFilter，可链式调用
                         * @static
                         * @since 0.1.0
                         * @author hujiabao
                         * */

                }, {
                        key: 'getClassName',
                        value: function getClassName() {
                                return EasyNode.namespace(__filename);
                        }
                }], [{
                        key: 'addFilter',
                        value: function addFilter() {
                                for (var _len = arguments.length, f = Array(_len), _key = 0; _key < _len; _key++) {
                                        f[_key] = arguments[_key];
                                }

                                f.forEach(function (filter) {
                                        assert(filter instanceof ActionFilter || typeof filter.filter == 'function', 'Invalid argument');
                                        _filters.push(filter);
                                });
                                return ActionFilter;
                        }

                        /**
                         * 向系统的Action过滤器链中增加一个或多个过滤器。
                         *
                         * @method addFilter
                         * @param {..} f ActionFilter实例，一个或多个
                         * @return {ActionFilter} 返回ActionFilter，可链式调用
                         * @static
                         * @since 0.1.0
                         * @author hujiabao
                         * */

                }, {
                        key: 'filters',
                        value: function filters() {
                                return _filters;
                        }
                }]);

                return ActionFilter;
        }(GenericObject);

        module.exports = ActionFilter;
})();