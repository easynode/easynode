'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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

        var ActionResult = (function (_GenericObject) {
                _inherits(ActionResult, _GenericObject);

                /**
                 * 构造函数。
                 *
                 * @method 构造函数
                 * @since 0.1.0
                 * @author hujiabao
                 * */

                function ActionResult() {
                        var code = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
                        var result = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
                        var msg = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

                        _classCallCheck(this, ActionResult);

                        //调用super()后再定义子类成员。

                        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ActionResult).call(this));

                        _this.code = code;
                        _this.result = result;
                        _this.msg = msg || ActionResult.code2Message(_this.code);
                        return _this;
                }

                /**
                 * 将错误码(或正确码)转换为错误消息，从EasyNode.i18n配置中取消息内容　。
                 *
                 * @method code2Message
                 * @param {String/int} code 错误码
                 * @since 0.1.0
                 * @author hujiabao
                 * */

                _createClass(ActionResult, [{
                        key: 'setResult',

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
                        value: function setResult(result, msg) {
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

                }, {
                        key: 'error',
                        value: function error() {
                                var code = arguments.length <= 0 || arguments[0] === undefined ? -1 : arguments[0];
                                var msg = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
                                var file = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

                                if (arguments.length == 1 && typeof code == 'string') {
                                        var _code$split = code.split(':');

                                        var _code$split2 = _slicedToArray(_code$split, 2);

                                        code = _code$split2[0];
                                        msg = _code$split2[1];

                                        if (!msg) {
                                                msg = code;
                                                code = "0";
                                        }
                                        code = S(code).trim().toInt();
                                        msg = S(msg).trim().toString();
                                }

                                if (msg == null && file != null) {
                                        msg = EasyNode.i18n('errors.' + code, file);
                                } else if (msg == null) {
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

                }, {
                        key: 'response',
                        value: function response() {
                                var code = arguments.length <= 0 || arguments[0] === undefined ? -1 : arguments[0];
                                var msg = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
                                var result = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

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

                }, {
                        key: 'isSuccess',
                        value: function isSuccess() {
                                return this.code === ActionResult.CODE_SUCC;
                        }
                }, {
                        key: 'getClassName',
                        value: function getClassName() {
                                return EasyNode.namespace(__filename);
                        }
                }, {
                        key: 'toString',
                        value: function toString() {
                                return 'ERROR(' + this.code + ') : ' + this.msg;
                        }
                }], [{
                        key: 'code2Message',
                        value: function code2Message(code) {
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

                }, {
                        key: 'create',
                        value: function create() {
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

                }, {
                        key: 'createSuccessResult',
                        value: function createSuccessResult() {
                                var result = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

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

                }, {
                        key: 'createErrorResult',
                        value: function createErrorResult() {
                                var msg = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

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

                }, {
                        key: 'createNoReturnResult',
                        value: function createNoReturnResult() {
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

                }, {
                        key: 'createActionNotFoundResult',
                        value: function createActionNotFoundResult() {
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

                }, {
                        key: 'createValidateFailResult',
                        value: function createValidateFailResult() {
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

                }, {
                        key: 'createAuthorizeFailResult',
                        value: function createAuthorizeFailResult() {
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

                }, {
                        key: 'createNoImplementationError',
                        value: function createNoImplementationError() {
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

                }, {
                        key: 'createNoSessionError',
                        value: function createNoSessionError() {
                                return new ActionResult(ActionResult.CODE_NO_SESSION, {});
                        }
                }]);

                return ActionResult;
        })(GenericObject);

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