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
   * 计划任务执行接口
   *
   * @class easynode.framework.schedule.AbstractScheduleExecutor
   * @extends easynode.GenericObject
   * @since 0.1.0
   * @author hujiabao
   * */

  var AbstractScheduleExecutor = function (_GenericObject) {
    _inherits(AbstractScheduleExecutor, _GenericObject);

    /**
     * 构造函数。
     *
     * @method 构造函数
     * @protected
     * @since 0.1.0
     * @author hujiabao
     * */

    function AbstractScheduleExecutor() {
      _classCallCheck(this, AbstractScheduleExecutor);

      // 调用super()后再定义子类成员。

      /**
       *  计划任务名称
       *
       * @property name
       * @type String
       * @public
       *
       * */

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(AbstractScheduleExecutor).call(this));

      _this.name = 'Unnamed';

      /**
       *  计划任务cron表达式
       *
       * @property cronExpression
       * @type String
       * @public
       *
       * */
      _this.cronExpression = null;

      /**
       *  计划任务描述
       *
       * @property description
       * @type String
       * @public
       *
       * */
      _this.description = '';
      return _this;
    }

    /**
     * 执行计划任务入口函数。
     *
     * @method execute
     * @return {boolean} 计划任务执行结果
     * @async
     * @since 0.1.0
     * @author hujiabao
     * */


    _createClass(AbstractScheduleExecutor, [{
      key: 'execute',
      value: function execute() {
        throw new Error('Abstract Method');
      }
    }, {
      key: 'getClassName',
      value: function getClassName() {
        return EasyNode.namespace(__filename);
      }
    }]);

    return AbstractScheduleExecutor;
  }(GenericObject);

  module.exports = AbstractScheduleExecutor;
})();