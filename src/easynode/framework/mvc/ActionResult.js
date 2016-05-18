var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var GenericObject = using('easynode.GenericObject');
var S = require('string');

(function () {
        /**
         * Class ActionResult
         *
         * @class easynode.framework.mvc.ActionResult
         * @extends easynode.GenericObject
         * @since 0.1.0
         * @author hujiabao
         * */
        class ActionResult extends GenericObject {
                /**
                 * 构造函数。
                 *
                 * @method 构造函数
                 * @since 0.1.0
                 * @author hujiabao
                 * */
                constructor(code = 0, result = {}, msg = null) {
                        super();
                        //调用super()后再定义子类成员。
                        this.code = code;
                        this.result = result;
                        this.msg = msg || ActionResult.code2Message(this.code);
                }

                /**
                 * 将错误码(或正确码)转换为错误消息，从EasyNode.i18n配置中取消息内容　。
                 *
                 * @method code2Message
                 * @param {String/int} code 错误码
                 * @since 0.1.0
                 * @author hujiabao
                 * */
                static code2Message(code) {
                        return EasyNode.i18n('errors.' + code, __filename);
                }

                /**
                 * 创建一个code为ActionResult.CODE_SUCC的ActionResult实例。
                 *
                 * @method create
                 * @return {easynode.framework.mvc.ActionResult}
                 * @since 0.1.0
                 * @author hujiabao
                 * */
                static create() {
                        return new ActionResult(ActionResult.CODE_SUCC, result);
                }

                /**
                 * 创建一个code为ActionResult.CODE_SUCC的ActionResult实例。
                 *
                 * @method createSuccessResult
                 * @param {Object} result 结果
                 * @return {easynode.framework.mvc.ActionResult}
                 * @since 0.1.0
                 * @author hujiabao
                 * */
                static createSuccessResult(result = {}) {
                        return new ActionResult(ActionResult.CODE_SUCC, result);
                }

                /**
                 * 创建一个code为ActionResult.CODE_ERROR的ActionResult实例。
                 *
                 * @method createErrorResult
                 * @return {easynode.framework.mvc.ActionResult}
                 * @since 0.1.0
                 * @author hujiabao
                 * */
                static createErrorResult(msg=null) {
                        return new ActionResult(ActionResult.CODE_ERROR, {}, msg);
                }

                /**
                 * 创建一个code为ActionResult.CODE_ACTION_RETURN_NOTHING的ActionResult实例。
                 *
                 * @method createNoReturnResult
                 * @return {easynode.framework.mvc.ActionResult}
                 * @since 0.1.0
                 * @author hujiabao
                 * */
                static createNoReturnResult() {
                        return new ActionResult(ActionResult.CODE_ACTION_RETURN_NOTHING, {});
                }

                /**
                 * 创建一个code为ActionResult.CODE_ACTION_NOT_FOUND的ActionResult实例。
                 *
                 * @method createActionNotFoundResult
                 * @return {easynode.framework.mvc.ActionResult}
                 * @since 0.1.0
                 * @author hujiabao
                 * */
                static createActionNotFoundResult() {
                        return new ActionResult(ActionResult.CODE_ACTION_NOT_FOUND, {});
                }

                /**
                 * 创建一个code为ActionResult.CODE_ACTION_VALIDATE_FAIL的ActionResult实例。
                 *
                 * @method createValidateFailResult
                 * @return {easynode.framework.mvc.ActionResult}
                 * @since 0.1.0
                 * @author hujiabao
                 * */
                static createValidateFailResult() {
                        return new ActionResult(ActionResult.CODE_ACTION_VALIDATE_FAIL, {});
                }

                /**
                 * 创建一个code为ActionResult.CODE_ACTION_VALIDATE_FAIL的ActionResult实例。
                 *
                 * @method createAuthorizeFailResult
                 * @return {easynode.framework.mvc.ActionResult}
                 * @since 0.1.0
                 * @author hujiabao
                 * */
                static createAuthorizeFailResult() {
                        return new ActionResult(ActionResult.CODE_ACTION_AUTHORIZE_FAIL, {});
                }

                /**
                 * 创建一个code为ActionResult.CODE_NO_IMPLEMENTATION的ActionResult实例。
                 *
                 * @method createNoImplementationError
                 * @return {easynode.framework.mvc.ActionResult}
                 * @since 0.1.0
                 * @author hujiabao
                 * */
                static createNoImplementationError() {
                        return new ActionResult(ActionResult.CODE_NO_IMPLEMENTATION, {});
                }

                /**
                 * 创建一个code为ActionResult.CODE_NO_SESSION的ActionResult实例。
                 *
                 * @method createNoSessionError
                 * @return {easynode.framework.mvc.ActionResult}
                 * @since 0.1.0
                 * @author hujiabao
                 * */
                static createNoSessionError() {
                        return new ActionResult(ActionResult.CODE_NO_SESSION, {});
                }

                /**
                 * 设置result。可链式调用
                 *
                 * @method setResult
                 * @param {Object} result 返回值
                 * @param {String} msg 文本消息
                 * @return this
                 * @since 0.1.0
                 * @author hujiabao
                 * */
                setResult(result, msg) {
                        this.result = result;
                        if (msg) {
                                this.msg = msg;
                        }
                        return this;
                }

                /**
                 * 设置错误，注意，调用此函数会将result置空({})。0-1000为EasyNode保留码，应用中或插件中错误码(code)应 < -1000或 > 1000。
                 *
                 * @method error
                 * @param {int/String} code 返回码，当code为String型时，支持$code:$msg格式或不含code只含message(此时code被设置为0);
                 * @param {String} msg，可不传
                 * @param {String} file 来源文件，会从EasyNode.i18n配置中取返回消息。
                 * @return this
                 * @since 0.1.0
                 * @author hujiabao
                 * */
                error(code = -1, msg = null, file = null) {
                        if (arguments.length == 1 && typeof code == 'string') {
                                [code,msg] = code.split(':');
                                if (!msg) {
                                        msg = code;
                                        code = "0";
                                }
                                code = S(code).trim().toInt();
                                msg = S(msg).trim().toString();
                        }

                        if (msg == null && file != null) {
                                msg = EasyNode.i18n('errors.' + code, file);
                        }
                        else if (msg == null) {
                                msg = EasyNode.i18n('errors.' + code, __filename);
                        }
                        this.code = code;
                        this.msg = msg;
                        this.result = {};
                        return this;
                }

                /**
                 * 设置响应码，响应消息和响应数据。0-1000为EasyNode保留码，应用中或插件中错误码(code)应 < -1000或 > 1000。
                 *
                 * @method response
                 * @param {int/String} code 返回码，当code为String型时，支持$code:$msg格式或不含code只含message(此时code被设置为0);
                 * @param {String} msg，可不传
                 * @param {String} result 响应数据
                 * @return this
                 * @since 0.1.0
                 * @author hujiabao
                 * */
                response(code = -1, msg = null, result = {}) {
                        if (arguments.length == 2) {
                                result = msg;
                                return this.error(code).setResult(result);
                        }
                        return this.error(code, msg).setResult(result);
                }

                /**
                 * 判定是否为成功的Action调用结果
                 *
                 * @method isSuccess
                 * @return {boolean} 是否为成功的Action调用结果(this.code === 0)
                 * @since 0.1.0
                 * @author hujiabao
                 * */
                isSuccess () {
                        return this.code === ActionResult.CODE_SUCC;
                }
                getClassName() {
                        return EasyNode.namespace(__filename);
                }

                toString() {
                        return `ERROR(${this.code}) : ${this.msg}`;
                }
        }

        ActionResult.CODE_SUCC = 0;
        ActionResult.CODE_ERROR = -1;
        ActionResult.CODE_ACTION_NOT_FOUND = -2;
        ActionResult.CODE_ACTION_RETURN_NOTHING = -3;
        ActionResult.CODE_NO_IMPLEMENTATION = -4;
        ActionResult.CODE_ACTION_VALIDATE_FAIL = -5;
        ActionResult.CODE_ACTION_AUTHORIZE_FAIL = -6;
        ActionResult.CODE_NO_SESSION = -7;


        module.exports = ActionResult;
})();