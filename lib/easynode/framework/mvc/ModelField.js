'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var GenericObject = using('easynode.GenericObject');
var _ = require('underscore');

(function () {
  var TYPES = ['string', 'int', 'float', 'date', 'datetime', 'json'];

  /**
   * Class ModelField
   *
   * @class easynode.framework.mvc.ModelField
   * @extends easynode.GenericObject
   * @since 0.1.0
   * @author hujiabao
   * */

  var ModelField = function (_GenericObject) {
    _inherits(ModelField, _GenericObject);

    /**
     * 构造函数。
     *
     * @method 构造函数
     * @since 0.1.0
     * @author hujiabao
     * */

    function ModelField(name, type) {
      var maxLength = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];
      var defaultValue = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];
      var nullable = arguments.length <= 4 || arguments[4] === undefined ? true : arguments[4];
      var comment = arguments.length <= 5 || arguments[5] === undefined ? '' : arguments[5];
      var readonly = arguments.length <= 6 || arguments[6] === undefined ? false : arguments[6];

      _classCallCheck(this, ModelField);

      // 调用super()后再定义子类成员。

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ModelField).call(this));

      assert(name, 'Invalid attribute name [' + name + ']');
      assert(typeof type == 'string', 'Invalid attribute name [' + name + ']');
      assert(typeof maxLength == 'number', 'Invalid argument maxLength');
      assert(typeof nullable == 'boolean', 'Invalid argument nullable');
      assert(typeof comment == 'string', 'Invalid argument comment');
      assert(typeof readonly == 'boolean', 'Invalid argument readonly');
      type = type.toLowerCase();
      assert(_.contains(TYPES, type), 'Invalid attribute type [' + type + ']');

      /**
      * 字段名称
      *
      * @property name
      * @type String
      * @since 0.1.0
      * @author hujiabao
      * */
      _this.name = name;

      /**
       * 字段类型，ModelField.TYPE_*枚举
       *
       * @property type
       * @type String
       * @since 0.1.0
       * @author hujiabao
       * */
      _this.type = type;

      /**
       * 字段最大长度，默认为0（不限制长度）
       *
       * @property maxLength
       * @type int
       * @default 0
       * @since 0.1.0
       * @author hujiabao
       * */
      _this.maxLength = maxLength;

      /**
       * 字段默认值。
       *
       * @property defaultValue
       * @type variant
       * @default 0
       * @since 0.1.0
       * @author hujiabao
       * */
      _this.defaultValue = defaultValue;

      /**
       * 字段可否为空。
       *
       * @property nullable
       * @type boolean
       * @default true
       * @since 0.1.0
       * @author hujiabao
       * */
      _this.nullable = nullable;

      /**
       * 字段备注。
       *
       * @property comment
       * @type String
       * @default ''(empty string)
       * @since 0.1.0
       * @author hujiabao
       * */
      _this.comment = comment;

      /**
       * 是否为只读字段。
       *
       * @property readonly
       * @type boolean
       * @default false
       * @since 0.1.0
       * @author hujiabao
       * */
      _this.readonly = readonly;
      return _this;
    }

    _createClass(ModelField, [{
      key: 'getClassName',
      value: function getClassName() {
        return EasyNode.namespace(__filename);
      }
    }]);

    return ModelField;
  }(GenericObject);

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