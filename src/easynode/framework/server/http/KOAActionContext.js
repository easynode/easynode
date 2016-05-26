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
        class KOAActionContext extends ActionContext {
                /**
                 * 构造函数。
                 *
                 * @method 构造函数
                 * @since 0.1.0
                 * @author hujiabao
                 * */
                constructor(m, a, koaCtx) {
                        super(m, a);
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
                        this._koaCtx = koaCtx;

                        this._setRemoteAddress();

                        /**
                         * session。
                         *
                         * @property session
                         * @type {Object}
                         * @since 0.1.0
                         * @author hujiabao
                         * */
                        this.session = this._koaCtx.session;

                        this.__defineGetter__('args', function() {
                                this._convertArgs();
                                return this._converted;
                        }.bind(this));
                }

                _setRemoteAddress() {
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
                param (name, defaultValue=null) {
                        this._convertArgs();
                        var v =  this._converted[name];
                        if(v === null || v === undefined) {
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
                hasParam(name) {
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
                params () {
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
                setParam(name, val) {
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
                _convertArgs () {
                        if(this._args_converted) {
                                return ;
                        }
                        var parameter = this._koaCtx.parameter;                         //see KOAHttpServer._createDefaultMiddlewares
                        if(parameter) {
                                //值类型转换
                                this._converted = ActionArgConverter.convert(parameter, this.getAction());
                        }
                        this._args_converted = true;
                }

                getClassName() {
                        return EasyNode.namespace(__filename);
                }
        }

        module.exports = KOAActionContext;
})();