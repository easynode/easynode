var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var GenericObject = using('easynode.GenericObject');
var _ = require('underscore');

(function() {
  const TYPES = [
    'string',
    'int',
    'float',
    'date',
    'datetime',
    'json'
  ];

        /**
         * Class ModelField
         *
         * @class easynode.framework.mvc.ModelField
         * @extends easynode.GenericObject
         * @since 0.1.0
         * @author hujiabao
         * */
  class ModelField extends GenericObject {
                /**
                 * 构造函数。
                 *
                 * @method 构造函数
                 * @since 0.1.0
                 * @author hujiabao
                 * */
    constructor(name, type, maxLength = 0, defaultValue = null, nullable = true, comment = '', readonly = false) {
      super();
                        // 调用super()后再定义子类成员。
      assert(name, `Invalid attribute name [${name}]`);
      assert(typeof type == 'string', `Invalid attribute name [${name}]`);
      assert(typeof maxLength == 'number', 'Invalid argument maxLength');
      assert(typeof nullable == 'boolean', 'Invalid argument nullable');
      assert(typeof comment == 'string', 'Invalid argument comment');
      assert(typeof readonly == 'boolean', 'Invalid argument readonly');
      type = type.toLowerCase();
      assert(_.contains(TYPES, type), `Invalid attribute type [${type}]`);
                        /**
                         * 字段名称
                         *
                         * @property name
                         * @type String
                         * @since 0.1.0
                         * @author hujiabao
                         * */
      this.name = name;
                        /**
                         * 字段类型，ModelField.TYPE_*枚举
                         *
                         * @property type
                         * @type String
                         * @since 0.1.0
                         * @author hujiabao
                         * */
      this.type = type;
                        /**
                         * 字段最大长度，默认为0（不限制长度）
                         *
                         * @property maxLength
                         * @type int
                         * @default 0
                         * @since 0.1.0
                         * @author hujiabao
                         * */
      this.maxLength = maxLength;
                        /**
                         * 字段默认值。
                         *
                         * @property defaultValue
                         * @type variant
                         * @default 0
                         * @since 0.1.0
                         * @author hujiabao
                         * */
      this.defaultValue = defaultValue;
                        /**
                         * 字段可否为空。
                         *
                         * @property nullable
                         * @type boolean
                         * @default true
                         * @since 0.1.0
                         * @author hujiabao
                         * */
      this.nullable = nullable;
                        /**
                         * 字段备注。
                         *
                         * @property comment
                         * @type String
                         * @default ''(empty string)
                         * @since 0.1.0
                         * @author hujiabao
                         * */
      this.comment = comment;
                        /**
                         * 是否为只读字段。
                         *
                         * @property readonly
                         * @type boolean
                         * @default false
                         * @since 0.1.0
                         * @author hujiabao
                         * */
      this.readonly = readonly;
    }

    getClassName() {
      return EasyNode.namespace(__filename);
    }
        }

        /**
         * string 型
         * @property ModelField.TYPE_STRING
         * @type String
         * @static
         * @since 0.1.0
         * @author hujiabao
         * */
  ModelField.TYPE_STRING = 'string';
        /**
         * int型
         * @property ModelField.TYPE_INT
         * @type String
         * @static
         * @since 0.1.0
         * @author hujiabao
         * */
  ModelField.TYPE_INT = 'int';
        /**
         * float型
         * @property ModelField.TYPE_FLOAT
         * @type String
         * @static
         * @since 0.1.0
         * @author hujiabao
         * */
  ModelField.TYPE_FLOAT = 'float';
        /**
         * 日期型
         * @property ModelField.TYPE_DATE
         * @type String
         * @static
         * @since 0.1.0
         * @author hujiabao
         * */
  ModelField.TYPE_DATE = 'date';
        /**
         * 日期时间型
         * @property ModelField.TYPE_DATETIME
         * @type String
         * @static
         * @since 0.1.0
         * @author hujiabao
         * */
  ModelField.TYPE_DATETIME = 'datetime';
        /**
         * JSON类型，数据库实际存储为VARCHAR或TEXT
         * @property ModelField.TYPE_JSON
         * @type String
         * @static
         * @since 0.1.0
         * @author hujiabao
         * */
  ModelField.TYPE_JSON = 'json';

  module.exports = ModelField;
})();
