'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var GenericObject = using('easynode.GenericObject');
var ActionResult = using('easynode.framework.mvc.ActionResult');
var S = require('string');
var _ = require('underscore');

(function () {
  /**
   * Class Validator
   * usage :
   * this.validator.check('paramName').necessary().isInt().end();                                 //must be an integer
   * this.validator.check('paramName').optional().match($emailRegexp).end();         //paramName is not passed or a legal email address
   * if(this.validator.isValid()) {                                                               //an validation error will be reponse to client
   *          //process your real business logic
   * }
   *
   *
   * @class easynode.framework.mvc.Validator
   * @extends easynode.GenericObject
   * @abstract
   * @since 0.1.0
   * @author zlbbq
   * */

  var Validator = function (_GenericObject) {
    _inherits(Validator, _GenericObject);

    /**
     * 构造函数。
     *
     * @method 构造函数
     * @since 0.1.0
     * @author zlbbq
     * */

    function Validator(koaCtx, actionRequestParameter) {
      var mode = arguments.length <= 2 || arguments[2] === undefined ? Validator.VALIDATE_SINGLE : arguments[2];

      _classCallCheck(this, Validator);

      // 调用super()后再定义子类成员。

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Validator).call(this));

      _this._koaCtx = koaCtx;
      _this._actionRequestParameter = actionRequestParameter;
      _this._tempName = null;
      _this._tempText = null;
      _this._invalidText = [];
      _this._mode = mode;
      _this._valid = true; // 验证状态
      _this._optional = false; // 是否为可选参数
      return _this;
    }

    _createClass(Validator, [{
      key: '_setInvalidText',
      value: function _setInvalidText(invalidText) {
        invalidText = invalidText || this._tempText;
        invalidText = invalidText.replace(/\$name/gm, this._tempName);
        this._valid = false;
        this._invalidText.push(invalidText);
        return this;
      }

      /**
       * 指明要验证的参数。
       *
       * @method validate
       * @param {String} name 参数名
       * @param {String} invalidText 参数不合法时的字符串
       * @return {Validator} 返回当前对象，可链式调用
       * @since 0.1.0
       * @author zlbbq
       * */

    }, {
      key: 'validate',
      value: function validate(name, invalidText) {
        assert(name && name.length > 0, 'Invalid argument');
        this._tempName = name;
        this._tempText = invalidText || 'Invalid parameter [$name]';
        return this;
      }

      /**
       * 指明要验证的参数，validate方法的别名方法
       *
       * @method check
       * @param {String} name 参数名
       * @param {String} invalidText 参数不合法时的字符串
       * @return {Validator} 返回当前对象，可链式调用
       * @since 0.1.0
       * @author zlbbq
       * */

    }, {
      key: 'check',
      value: function check(name, invalidText) {
        return this.validate(name, invalidText);
      }

      /**
       * 参数必须传递。
       *
       * @method necessary
       * @param {String} invalidText 参数不合法时的字符串
       * @return {Validator} 返回当前对象，可链式调用
       * @since 0.1.0
       * @author zlbbq
       * */

    }, {
      key: 'necessary',
      value: function necessary() {
        var invalidText = arguments.length <= 0 || arguments[0] === undefined ? '必须传递参数[$name]' : arguments[0];

        assert(this._tempName, 'Invalid validation call sequence, parameter name must be indicated by function "check" or "validate"');
        this._optinal = false;
        if (this._valid || this._mode === Validator.VALIDATE_ALL) {
          var val = this._actionRequestParameter.param(this._tempName);
          if (val === undefined) {
            return this._setInvalidText(invalidText);
          }
        }
        return this;
      }

      /**
       * 验证上传文件。
       *
       * @method file
       * @param {boolean} necessary 是否必须上传文件
       * @param {String} suffix 上传的文件必须是suffix后缀
       * @param {String} invalidText 参数不合法时的字符串
       * @return {Validator} 返回当前对象，可链式调用
       * @since 0.1.0
       * @author zlbbq
       * */

    }, {
      key: 'file',
      value: function file() {
        var necessary = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];
        var suffix = arguments.length <= 1 || arguments[1] === undefined ? '*' : arguments[1];
        var invalidText = arguments.length <= 2 || arguments[2] === undefined ? '参数[$name]必须是一个文件' : arguments[2];

        assert(this._tempName, 'Invalid validation call sequence, parameter name must be indicated by function "check" or "validate"');
        if (this._valid || this._mode === Validator.VALIDATE_ALL) {
          var val = this._actionRequestParameter.file(this._tempName);
          var val2 = this._actionRequestParameter.param(this._tempName);
          if (val === undefined && val2 === undefined && !necessary) {
            return this;
          }

          if (!val) {
            return this._setInvalidText(invalidText);
          }

          if (suffix !== '*' && !val.name.toLowerCase().endsWith(suffix.toLowerCase())) {
            return this._setInvalidText('参数[$name]文件类型错误，必须是[' + suffix + ']');
          }
        }
        return this;
      }

      /**
       * 要求传递一个正确的整型参数。
       *
       * @method isInt
       * @param {String} invalidText 参数不合法时的字符串
       * @return {Validator} 返回当前对象，可链式调用
       * @since 0.1.0
       * @author zlbbq
       * */

    }, {
      key: 'isInt',
      value: function isInt() {
        var invalidText = arguments.length <= 0 || arguments[0] === undefined ? '参数[$name]必须是int型' : arguments[0];

        assert(this._tempName, 'Invalid validation call sequence, parameter name must be indicated by function "check" or "validate"');
        if (this._valid || this._mode === Validator.VALIDATE_ALL) {
          var val = this._actionRequestParameter.param(this._tempName);

          if (val === undefined && this._optional) {
            return this;
          }

          if (!val || !val.match(/^\-?[0-9]+$/)) {
            return this._setInvalidText(invalidText);
          }
        }
        return this;
      }

      /**
       * 要求传递一个正确的数值型参数。
       *
       * @method isNumber
       * @param {String} invalidText 参数不合法时的字符串
       * @return {Validator} 返回当前对象，可链式调用
       * @since 0.1.0
       * @author zlbbq
       * */

    }, {
      key: 'isNumber',
      value: function isNumber() {
        var invalidText = arguments.length <= 0 || arguments[0] === undefined ? '参数[$name]必须是数值型' : arguments[0];

        assert(this._tempName, 'Invalid validation call sequence, parameter name must be indicated by function "check" or "validate"');
        if (this._valid || this._mode === Validator.VALIDATE_ALL) {
          var val = this._actionRequestParameter.param(this._tempName);
          if (val === undefined && this._optional) {
            return this;
          }

          if (!val.match(/^\-?[0-9]+([.]{1}[0-9]+){0,1}$/)) {
            this._setInvalidText(invalidText);
          }
        }
        return this;
      }

      /**
       * 要求传递一个有效的枚举参数。
       *
       * @method enum
       * @param {Array/String} array 字符串数组或用"|"分隔的字符串，表示枚举范围
       * @param {String} invalidText 参数不合法时的字符串
       * @return {Validator} 返回当前对象，可链式调用
       * @since 0.1.0
       * @author zlbbq
       * */

    }, {
      key: 'enum',
      value: function _enum(array) {
        var invalidText = arguments.length <= 1 || arguments[1] === undefined ? '参数[$name]只能是: $enum其中之一' : arguments[1];

        assert(this._tempName, 'Invalid validation call sequence, parameter name must be indicated by function "check" or "validate"');
        if (this._valid || this._mode === Validator.VALIDATE_ALL) {
          var val = this._actionRequestParameter.param(this._tempName);
          if (val === undefined && this._optional) {
            return this;
          }
          if (typeof array == 'string') {
            array = array.split('|');
          }
          invalidText = invalidText.replace(/\$enum/, array.join(' | '));
          if (!_.contains(array, val)) {
            return this._setInvalidText(invalidText);
          }
        }
        return this;
      }

      /**
       * 要求传递一个值不小于minVal的数值型参数。
       *
       * @method min
       * @param {number} minVal 最小值
       * @param {String} invalidText 参数不合法时的字符串
       * @return {Validator} 返回当前对象，可链式调用
       * @since 0.1.0
       * @author zlbbq
       * */

    }, {
      key: 'min',
      value: function min(minVal) {
        var invalidText = arguments.length <= 1 || arguments[1] === undefined ? '参数[$name]必须>=$min' : arguments[1];

        assert(this._tempName, 'Invalid validation call sequence, parameter name must be indicated by function "check" or "validate"');
        if (this._valid || this._mode === Validator.VALIDATE_ALL) {
          var val = this._actionRequestParameter.param(this._tempName);
          if (val === undefined && this._optional) {
            return this;
          }

          if (parseFloat(val) < minVal) {
            return this._setInvalidText(invalidText.replace(/\$min/gm, minVal));
          }
        }
        return this;
      }

      /**
       * 要求传递一个值不大于maxVal的数值型参数。
       *
       * @method max
       * @param {number} maxVal 最大值
       * @param {String} invalidText 参数不合法时的字符串
       * @return {Validator} 返回当前对象，可链式调用
       * @since 0.1.0
       * @author zlbbq
       * */

    }, {
      key: 'max',
      value: function max(maxVal) {
        var invalidText = arguments.length <= 1 || arguments[1] === undefined ? '参数[$name]必须<=$max' : arguments[1];

        assert(this._tempName, 'Invalid validation call sequence, parameter name must be indicated by function "check" or "validate"');
        if (this._valid || this._mode === Validator.VALIDATE_ALL) {
          var val = this._actionRequestParameter.param(this._tempName);
          if (val === undefined && this._optional) {
            return this;
          }
          if (parseFloat(val) > maxVal) {
            return this._setInvalidText(invalidText.replace(/\$max/gm, maxVal));
          }
        }
        return this;
      }

      /**
       * 要求传递一个值不小于minVal并且不大于maxVal的数值型参数。
       *
       * @method range
       * @param {number} minVal 最小值
       * @param {number} maxVal 最大值
       * @param {String} invalidText 参数不合法时的字符串
       * @return {Validator} 返回当前对象，可链式调用
       * @since 0.1.0
       * @author zlbbq
       * */

    }, {
      key: 'range',
      value: function range(minVal, maxVal) {
        var invalidText = arguments.length <= 2 || arguments[2] === undefined ? '参数[$name]必须>=$min同时<=$max' : arguments[2];

        assert(this._tempName, 'Invalid validation call sequence, parameter name must be indicated by function "check" or "validate"');
        if (this._valid || this._mode === Validator.VALIDATE_ALL) {
          var val = this._actionRequestParameter.param(this._tempName);
          if (val === undefined && this._optional) {
            return this;
          }
          val = parseFloat(val);
          if (val > maxVal || val < minVal) {
            return this._setInvalidText(invalidText.replace(/\$min/gm, minVal).replace(/\$max/gm, maxVal));
          }
        }
        return this;
      }

      /**
       * 要求传递一个(字节)长度等于len的字符串。
       *
       * @method length
       * @param {int} len 长度
       * @param {int} flag 比较标识，应传递Validator.CHECK_LENGTH_BY_CHAR或Validator.CHECK_LENGTH_BY_BYTES
       * @param {String} invalidText 参数不合法时的字符串
       * @return {Validator} 返回当前对象，可链式调用
       * @since 0.1.0
       * @author zlbbq
       * */

    }, {
      key: 'length',
      value: function length(len) {
        var flag = arguments.length <= 1 || arguments[1] === undefined ? Validator.CHECK_LENGTH_BY_CHAR : arguments[1];
        var invalidText = arguments.length <= 2 || arguments[2] === undefined ? '参数[$name]的长度必须是$len个$flag' : arguments[2];

        assert(this._tempName, 'Invalid validation call sequence, parameter name must be indicated by function "check" or "validate"');
        if (this._valid || this._mode === Validator.VALIDATE_ALL) {
          invalidText = invalidText.replace(/\$len/, len).replace(/\$flag/, flag === Validator.CHECK_LENGTH_BY_CHAR ? '字符' : '字节');
          var val = this._actionRequestParameter.param(this._tempName);
          if (val === undefined && this._optional) {
            return this;
          }
          switch (flag) {
            case Validator.CHECK_LENGTH_BY_CHAR:
              {
                if (val.length !== len) {
                  return this._setInvalidText(invalidText);
                }
                break;
              }
            case Validator.CHECK_LENGTH_BY_BYTES:
              {
                if (Buffer.byteLength(val) !== len) {
                  return this._setInvalidText(invalidText);
                }
                break;
              }
            default:
              {
                assert(false, 'Invalid argument => flag');
              }
          }
        }
        return this;
      }

      /**
       * 要求传递一个最小(字节)长度为len的字符串。
       *
       * @method minLength
       * @param {int} len 最小长度
       * @param {int} flag 比较标识，应传递Validator.CHECK_LENGTH_BY_CHAR或Validator.CHECK_LENGTH_BY_BYTES
       * @param {String} invalidText 参数不合法时的字符串
       * @return {Validator} 返回当前对象，可链式调用
       * @since 0.1.0
       * @author zlbbq
       * */

    }, {
      key: 'minLength',
      value: function minLength(len) {
        var flag = arguments.length <= 1 || arguments[1] === undefined ? Validator.CHECK_LENGTH_BY_CHAR : arguments[1];
        var invalidText = arguments.length <= 2 || arguments[2] === undefined ? '参数[$name]的长度最少$len个$flag' : arguments[2];

        assert(this._tempName, 'Invalid validation call sequence, parameter name must be indicated by function "check" or "validate"');
        if (this._valid || this._mode === Validator.VALIDATE_ALL) {
          invalidText = invalidText.replace(/\$len/, len).replace(/\$flag/, flag === Validator.CHECK_LENGTH_BY_CHAR ? '字符' : '字节');
          var val = this._actionRequestParameter.param(this._tempName);
          if (val === undefined && this._optional) {
            return this;
          }
          switch (flag) {
            case Validator.CHECK_LENGTH_BY_CHAR:
              {
                if (val.length < len) {
                  return this._setInvalidText(invalidText);
                }
                break;
              }
            case Validator.CHECK_LENGTH_BY_BYTES:
              {
                if (Buffer.byteLength(val) < len) {
                  return this._setInvalidText(invalidText);
                }
                break;
              }
            default:
              {
                assert(false, 'Invalid argument => flag');
              }
          }
        }
        return this;
      }

      /**
       * 要求传递一个最大(字节)长度为len的字符串。
       *
       * @method maxLength
       * @param {int} len 长度
       * @param {int} flag 比较标识，应传递Validator.CHECK_LENGTH_BY_CHAR或Validator.CHECK_LENGTH_BY_BYTES
       * @param {String} invalidText 参数不合法时的字符串
       * @return {Validator} 返回当前对象，可链式调用
       * @since 0.1.0
       * @author zlbbq
       * */

    }, {
      key: 'maxLength',
      value: function maxLength(len) {
        var flag = arguments.length <= 1 || arguments[1] === undefined ? Validator.CHECK_LENGTH_BY_CHAR : arguments[1];
        var invalidText = arguments.length <= 2 || arguments[2] === undefined ? '参数[$name]的长度最多$len个$flag' : arguments[2];

        assert(this._tempName, 'Invalid validation call sequence, parameter name must be indicated by function "check" or "validate"');
        if (this._valid || this._mode === Validator.VALIDATE_ALL) {
          invalidText = invalidText.replace(/\$len/, len).replace(/\$flag/, flag === Validator.CHECK_LENGTH_BY_CHAR ? '字符' : '字节');
          var val = this._actionRequestParameter.param(this._tempName);
          if (val === undefined && this._optional) {
            return this;
          }
          switch (flag) {
            case Validator.CHECK_LENGTH_BY_CHAR:
              {
                if (val.length > len) {
                  return this._setInvalidText(invalidText);
                }
                break;
              }
            case Validator.CHECK_LENGTH_BY_BYTES:
              {
                if (Buffer.byteLength(val) > len) {
                  return this._setInvalidText(invalidText);
                }
                break;
              }
            default:
              {
                assert(false, 'Invalid argument => flag');
              }
          }
        }
        return this;
      }

      /**
       * 要求传递一个(字节)长度不小于minLen并且不大于maxLen的字符串。
       *
       * @method rangeLength
       * @param {int} minLen 最小长度
       * @param {int} maxLen 最大长度
       * @param {int} flag 比较标识，应传递Validator.CHECK_LENGTH_BY_CHAR或Validator.CHECK_LENGTH_BY_BYTES
       * @param {String} invalidText 参数不合法时的字符串
       * @return {Validator} 返回当前对象，可链式调用
       * @since 0.1.0
       * @author zlbbq
       * */

    }, {
      key: 'rangeLength',
      value: function rangeLength(minLen, maxLen) {
        var flag = arguments.length <= 2 || arguments[2] === undefined ? Validator.CHECK_LENGTH_BY_CHAR : arguments[2];
        var invalidText = arguments.length <= 3 || arguments[3] === undefined ? '参数[$name]的长度必须是$minLen-$maxLen个$flag' : arguments[3];

        assert(this._tempName, 'Invalid validation call sequence, parameter name must be indicated by function "check" or "validate"');
        if (this._valid || this._mode === Validator.VALIDATE_ALL) {
          invalidText = invalidText.replace(/\$minLen/, minLen).replace(/\$maxLen/, maxLen).replace(/\$flag/, flag === Validator.CHECK_LENGTH_BY_CHAR ? '字符' : '字节');
          var val = this._actionRequestParameter.param(this._tempName);
          if (val === undefined && this._optional) {
            return this;
          }
          switch (flag) {
            case Validator.CHECK_LENGTH_BY_CHAR:
              {
                if (val.length < minLen || val.length > maxLen) {
                  return this._setInvalidText(invalidText);
                }
                break;
              }
            case Validator.CHECK_LENGTH_BY_BYTES:
              {
                var bLen = Buffer.byteLength(val);
                if (bLen < minLen || bLen > maxLen) {
                  return this._setInvalidText(invalidText);
                }
                break;
              }
            default:
              {
                assert(false, 'Invalid argument => flag');
              }
          }
        }
        return this;
      }

      /**
       * 要求传递一个日期类型，日期类型格式为：YYYY-MM-DD，例：2015-08-18。
       *
       * @method date
       * @param {String} invalidText 参数不合法时的字符串
       * @return {Validator} 返回当前对象，可链式调用
       * @since 0.1.0
       * @author zlbbq
       * */

    }, {
      key: 'date',
      value: function date() {
        var invalidText = arguments.length <= 0 || arguments[0] === undefined ? '参数[$name]需要是一个日期字符串(2015-08-03)' : arguments[0];

        assert(this._tempName, 'Invalid validation call sequence, parameter name must be indicated by function "check" or "validate"');
        if (this._valid || this._mode === Validator.VALIDATE_ALL) {
          var val = this._actionRequestParameter.param(this._tempName);
          if (val === undefined && this._optional) {
            return this;
          }
          return this.match(/^\d{4}\-\d{2}\-\d{2}$/, invalidText);
        }
        return this;
      }

      /**
       * 要求传递一个日期时间类型，日期类型格式为：YYYY-MM-DD HH24:MI:SS，例：2015-08-18 00:00:00。
       *
       * @method datetime
       * @param {String} invalidText 参数不合法时的字符串
       * @return {Validator} 返回当前对象，可链式调用
       * @since 0.1.0
       * @author zlbbq
       * */

    }, {
      key: 'datetime',
      value: function datetime() {
        var invalidText = arguments.length <= 0 || arguments[0] === undefined ? '参数[$name]需要是一个日期时间字符串(2015-08-03 00:00:00)' : arguments[0];

        assert(this._tempName, 'Invalid validation call sequence, parameter name must be indicated by function "check" or "validate"');
        if (this._valid || this._mode === Validator.VALIDATE_ALL) {
          var val = this._actionRequestParameter.param(this._tempName);
          if (val === undefined && this._optional) {
            return this;
          }
          return this.match(/^\d{4}\-\d{2}\-\d{2}\s\d{2}:\d{2}:\d{2}$/, invalidText);
        }
        return this;
      }

      /**
       * 要求传递符合regExp正则表达式的字符串。
       *
       * @method match
       * @param {RegExp} regExp 正则表达式
       * @param {String} invalidText 参数不合法时的字符串
       * @return {Validator} 返回当前对象，可链式调用
       * @since 0.1.0
       * @author zlbbq
       * */

    }, {
      key: 'match',
      value: function match(regExp) {
        var invalidText = arguments.length <= 1 || arguments[1] === undefined ? '参数[$name]格式错误' : arguments[1];

        assert(this._tempName, 'Invalid validation call sequence, parameter name must be indicated by function "check" or "validate"');
        if (this._valid || this._mode === Validator.VALIDATE_ALL) {
          var val = this._actionRequestParameter.param(this._tempName);
          if (val === undefined && this._optional) {
            return this;
          }
          if (!val.match(regExp)) {
            return this._setInvalidText(invalidText);
          }
        }
        return this;
      }

      /**
       * 声明正在检查的参数为可选参数。
       *
       * @method optional
       * @return {Validator} 返回当前对象，可链式调用
       * @since 0.1.0
       * @author zlbbq
       * */

    }, {
      key: 'optional',
      value: function optional() {
        assert(this._tempName, 'Invalid validation call sequence, parameter name must be indicated by function "check" or "validate"');
        this._optional = true;
        return this;
      }

      /**
       * 获取验证的错误文本。
       *
       * @method getInvalidText
       * @return {Validator} 返回当前对象，可链式调用
       * @since 0.1.0
       * @author zlbbq
       * */

    }, {
      key: 'getInvalidText',
      value: function getInvalidText() {
        return this._invalidText;
      }

      /**
       * 获取当前的验证对象的验证结果。
       *
       * @method isValid
       * @param {boolean} response 是否响验证错误到客户端，默认true
       * @param {Function} fun 响应函数
       * @return {boolean} 返回验证结果, true：验证的各个参数满足规则，false：验证的某个参数不满足某条规则
       * @since 0.1.0
       * @author zlbbq
       * */

    }, {
      key: 'isValid',
      value: function isValid() {
        var response = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];
        var fun = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

        if (response && this._valid === false) {
          var me = this;
          fun = fun || function (invalidTextArr) {
            me._koaCtx.type = 'json';
            me._koaCtx.body = ActionResult.createValidateFailResult(invalidTextArr.join(','));
          };
          fun.call(null, this._invalidText);
        }
        return this._valid;
      }

      /**
       * 结束某个参数的验证，语义化方法。
       *
       * @method end
       * @since 0.1.0
       * @author zlbbq
       * */

    }, {
      key: 'end',
      value: function end() {
        this._tempName = null;
        this._tempText = null;
        this._optinal = false;
      }
    }, {
      key: 'getClassName',
      value: function getClassName() {
        return EasyNode.namespace(__filename);
      }
    }]);

    return Validator;
  }(GenericObject);

  Validator.VALIDATE_SINGLE = 0;
  Validator.VALIDATE_ALL = 1;
  Validator.CHECK_LENGTH_BY_CHAR = 0;
  Validator.CHECK_LENGTH_BY_BYTES = 1;

  module.exports = Validator;
})();