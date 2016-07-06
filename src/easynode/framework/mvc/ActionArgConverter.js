var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var GenericObject = using('easynode.GenericObject');

(function() {
        /**
         * Class ActionArgConverter
         *
         * @class easynode.framework.mvc.ActionArgConverter
         * @extends easynode.GenericObject
         * @since 0.1.0
         * @author hujiabao
         * */
  class ActionArgConverter extends GenericObject {
                /**
                 * 构造函数。
                 *
                 * @method 构造函数
                 * @since 0.1.0
                 * @author hujiabao
                 * */
    constructor() {
      super();
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
    static convert(actionRequestParameter, action) {
      var ret = {};
      action.getArgs().forEach((arg) => {
        var name = arg.name;
        if (actionRequestParameter.hasParam(name)) {
          var type = arg.type || 'string';
          switch (type) {
          case 'string' :
            {
              ret[name] = actionRequestParameter.param(name);
              break;
            }
          case 'int' :
            {
              ret[name] = actionRequestParameter.intParam(name);
              break;
            }
          case 'boolean':
            {
              ret[name] = actionRequestParameter.booleanParam(name);
              break;
            }
          case 'float' :
            {
              ret[name] = actionRequestParameter.floatParam(name);
              break;
            }
          case 'array' :
            {
              ret[name] = actionRequestParameter.arrayParam(name, 'string');
              break;
            }
          case 'date' :
            {
              ret[name] = actionRequestParameter.dateParam(name);
              break;
            }
          case 'datetime' :
            {
              ret[name] = actionRequestParameter.datetimeParam(name);
              break;
            }
          case 'datetimeM':
            {
              ret[name] = actionRequestParameter.datetimeMParam(name);
              break;
            }
          case 'json' :
            {
              ret[name] = null;
              try {
                ret[name] = JSON.parse(actionRequestParameter.param(name));
              } catch (e) {
              }
              break;
            }
          default :
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

    getClassName() {
      return EasyNode.namespace(__filename);
    }
        }

  module.exports = ActionArgConverter;
})();
