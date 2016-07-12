'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var GenericObject = using('easynode.GenericObject');

(function () {

  /**
   * Class ActionArgConverter
   *
   * @class easynode.framework.mvc.ActionArgConverter
   * @extends easynode.GenericObject
   * @since 0.1.0
   * @author hujiabao
   * */

  var ActionArgConverter = function (_GenericObject) {
    _inherits(ActionArgConverter, _GenericObject);

    /**
     * 构造函数。
     *
     * @method 构造函数
     * @since 0.1.0
     * @author hujiabao
     * */

    function ActionArgConverter() {
      _classCallCheck(this, ActionArgConverter);

      return _possibleConstructorReturn(this, Object.getPrototypeOf(ActionArgConverter).call(this));
      // 调用super()后再定义子类成员。
    }

    /**
     * 根据Action的参数定义，转换参数。
     *
     * // 支持的类型有：
     *      string，字符串类型，默认
     *      int，     整数型
     *      boolean，boolean型，true/false，true/false, 1/0
     *      float(x)，浮点数型，保留x位小数
     *      array($type)，   数组，每个元素使用","(逗号)分隔，"()"中为存储的实际类型，$type->string, int, float, boolean, date,datetime,datetimeS
     *      date,       日期型
     *      datetime,       日期时间型，精确到秒
     *      datetimeM,     日期时间型，精确到分钟
     *      json,       JSON对象
     *
     * @method convert
     * @param {easynode.framework.mvc.ActionRequestParameter} actionRequestParameter 请求参数来源
     * @param {easynode.framework.mvc.Action} action Action实例
     * @static
     * @since 0.1.0
     * @author hujiabao
     * */


    _createClass(ActionArgConverter, [{
      key: 'getClassName',
      value: function getClassName() {
        return EasyNode.namespace(__filename);
      }
    }], [{
      key: 'convert',
      value: function convert(actionRequestParameter, action) {
        var ret = {};
        action.getArgs().forEach(function (arg) {
          var name = arg.name;
          if (actionRequestParameter.hasParam(name)) {
            var type = arg.type || 'string';
            switch (type) {
              case 'string':
                {
                  ret[name] = actionRequestParameter.param(name);
                  break;
                }
              case 'int':
                {
                  ret[name] = actionRequestParameter.intParam(name);
                  break;
                }
              case 'boolean':
                {
                  ret[name] = actionRequestParameter.booleanParam(name);
                  break;
                }
              case 'float':
                {
                  ret[name] = actionRequestParameter.floatParam(name);
                  break;
                }
              case 'array':
                {
                  ret[name] = actionRequestParameter.arrayParam(name, 'string');
                  break;
                }
              case 'date':
                {
                  ret[name] = actionRequestParameter.dateParam(name);
                  break;
                }
              case 'datetime':
                {
                  ret[name] = actionRequestParameter.datetimeParam(name);
                  break;
                }
              case 'datetimeM':
                {
                  ret[name] = actionRequestParameter.datetimeMParam(name);
                  break;
                }
              case 'json':
                {
                  ret[name] = null;
                  try {
                    ret[name] = JSON.parse(actionRequestParameter.param(name));
                  } catch (e) {}
                  break;
                }
              default:
                {
                  var arrayRegExp = /^array\((\w+)\)$/i;
                  if (type.match(arrayRegExp)) {
                    var arrType = arrayRegExp.exec(type)[1];
                    ret[name] = actionRequestParameter.arrayParam(name, arrType);
                  }
                  break;
                }
            }
          }
        });
        return ret;
      }
    }]);

    return ActionArgConverter;
  }(GenericObject);

  module.exports = ActionArgConverter;
})();