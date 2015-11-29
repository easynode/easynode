'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var ActionContext = using('easynode.framework.mvc.ActionContext');
var ActionArgConverter = using('easynode.framework.mvc.ActionArgConverter');
var _ = require('underscore');

(function () {
        /**
         * Class KOAActionContext
         *
         * @class easynode.framework.server.http.KOAActionContext
         * @extends easynode.ActionContext
         * @since 0.1.0
         * @author hujiabao
         * */

        var KOAActionContext = (function (_ActionContext) {
                _inherits(KOAActionContext, _ActionContext);

                /**
                 * 构造函数。
                 *
                 * @method 构造函数
                 * @since 0.1.0
                 * @author hujiabao
                 * */

                function KOAActionContext(m, a, koaCtx) {
                        _classCallCheck(this, KOAActionContext);

                        //调用super()后再定义子类成员。

                        /**
                         * koa中间件ctx。
                         *
                         * @property _action
                         * @type ctx koa中间件ctx
                         * @private
                         * @since 0.1.0
                         * @author hujiabao
                         * */

                        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(KOAActionContext).call(this, m, a));

                        _this._koaCtx = koaCtx;

                        _this._setRemoteAddress();

                        /**
                         * session。
                         *
                         * @property session
                         * @type {Object}
                         * @since 0.1.0
                         * @author hujiabao
                         * */
                        _this.session = _this._koaCtx.session;

                        _this.__defineGetter__('args', (function () {
                                this._convertArgs();
                                return this._converted;
                        }).bind(_this));
                        return _this;
                }

                _createClass(KOAActionContext, [{
                        key: '_setRemoteAddress',
                        value: function _setRemoteAddress() {
                                this.setRemoteAddress(this._koaCtx.remoteAddress);
                        }

                        /**
                         * 获取此上下文环境中指定名称的参数值。实现ActionContext的param函数。
                         *
                         * @method param
                         * @param {String} name 参数名
                         * @param {Object} defaultValue 默认值，默认为null
                         * @return {any}
                         * @since 0.1.0
                         * @author hujiabao
                         * */

                }, {
                        key: 'param',
                        value: function param(name) {
                                var defaultValue = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

                                this._convertArgs();
                                var v = this._converted[name];
                                if (v === null || v === undefined) {
                                        v = defaultValue;
                                }
                                return v;
                        }

                        /**
                         * 获取此上下文环境中是否传递了某个参数。
                         *
                         * @method hasParam
                         * @param {String} name 参数名
                         * @return {boolean} 是否具有某个参数
                         * @since 0.1.0
                         * @author hujiabao
                         * */

                }, {
                        key: 'hasParam',
                        value: function hasParam(name) {
                                this._convertArgs();
                                return this._converted.hasOwnProperty(name);
                        }

                        /**
                         * 获取此上下文环境中指所有的参数。
                         *
                         * @method params
                         * @return {Object} json对象
                         * @since 0.1.0
                         * @author hujiabao
                         * */

                }, {
                        key: 'params',
                        value: function params() {
                                return _.clone(this._converted);
                        }

                        /**
                         * 设置参数值。
                         *
                         * @method setParam
                         * @param {String} name 参数名
                         * @param {String} val 参数值
                         * @abstract
                         * @since 0.1.0
                         * @author hujiabao
                         * */

                }, {
                        key: 'setParam',
                        value: function setParam(name, val) {
                                this._convertArgs();
                                this._converted[name] = val;
                        }

                        /**
                         * 根据Action的参数定义，转换参数值类型。
                         *
                         * @method _convertArgs
                         * @private
                         * @since 0.1.0
                         * @author hujiabao
                         * */

                }, {
                        key: '_convertArgs',
                        value: function _convertArgs() {
                                if (this._args_converted) {
                                        return;
                                }
                                var parameter = this._koaCtx.parameter; //see KOAHttpServer._createDefaultMiddlewares
                                if (parameter) {
                                        //值类型转换
                                        this._converted = ActionArgConverter.convert(parameter, this.getAction());
                                }
                                this._args_converted = true;
                        }
                }, {
                        key: 'getClassName',
                        value: function getClassName() {
                                return EasyNode.namespace(__filename);
                        }
                }]);

                return KOAActionContext;
        })(ActionContext);

        module.exports = KOAActionContext;
})();