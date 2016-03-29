'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var GenericObject = using('easynode.GenericObject');

(function () {
        /**
         * Class IActionContextListener。流程顺序：onCreate->onActionReady->onDestroy，出错时调用onError->onDestroy
         *
         * @class easynode.framework.mvc.IActionContextListener
         * @extends easynode.GenericObject
         * @since 0.1.0
         * @author hujiabao
         * */

        var IActionContextListener = (function (_GenericObject) {
                _inherits(IActionContextListener, _GenericObject);

                function IActionContextListener() {
                        _classCallCheck(this, IActionContextListener);

                        return _possibleConstructorReturn(this, Object.getPrototypeOf(IActionContextListener).apply(this, arguments));
                }

                _createClass(IActionContextListener, [{
                        key: 'onCreate',

                        /**
                         *  ActionContext创建时被调用。此时ctx.getAction()可能为null。
                         *
                         * @method onCreate
                         * @param {easynode.framework.mvc.ActionContext} ctx ActionContext实例
                         * @async
                         * @abstract
                         * @since 0.1.0
                         * @author hujiabao
                         **/
                        value: function onCreate(ctx) {
                                throw new Error('Abstract Error');
                        }

                        /**
                         *  ActionContext的action被执行前调用。
                         *
                         * @method onActionReady
                         * @param {easynode.framework.mvc.ActionContext} ctx ActionContext实例
                         * @async
                         * @abstract
                         * @since 0.1.0
                         * @author hujiabao
                         **/

                }, {
                        key: 'onActionReady',
                        value: function onActionReady(ctx) {
                                throw new Error('Abstract Error');
                        }

                        /**
                         *  ActionContext销毁时被调用。
                         *
                         * @method onDestroy
                         * @param {easynode.framework.mvc.ActionContext} ctx ActionContext实例
                         * @async
                         * @abstract
                         * @since 0.1.0
                         * @author hujiabao
                         **/

                }, {
                        key: 'onDestroy',
                        value: function onDestroy(ctx) {
                                throw new Error('Abstract Error');
                        }

                        /**
                         *  Action调用发生异常时被调用。
                         *
                         * @method onError
                         * @param {easynode.framework.mvc.ActionContext} ctx ActionContext实例
                         * @param {Error} err 异常实例
                         * @async
                         * @abstract
                         * @since 0.1.0
                         * @author hujiabao
                         **/

                }, {
                        key: 'onError',
                        value: function onError(ctx, err) {
                                throw new Error('Abstract Error');
                        }
                }, {
                        key: 'getClassName',
                        value: function getClassName() {
                                return EasyNode.namespace(__filename);
                        }
                }]);

                return IActionContextListener;
        })(GenericObject);

        module.exports = IActionContextListener;
})();