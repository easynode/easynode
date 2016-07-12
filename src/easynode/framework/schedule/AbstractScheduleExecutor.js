var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var GenericObject = using('easynode.GenericObject');

(function() {

    /**
     * 计划任务执行接口
     *
     * @class easynode.framework.schedule.AbstractScheduleExecutor
     * @extends easynode.GenericObject
     * @since 0.1.0
     * @author hujiabao
     * */
  class AbstractScheduleExecutor extends GenericObject {

        /**
         * 构造函数。
         *
         * @method 构造函数
         * @protected
         * @since 0.1.0
         * @author hujiabao
         * */
        constructor() {
          super();
          // 调用super()后再定义子类成员。

        /**
         *  计划任务名称
         *
         * @property name
         * @type String
         * @public
         *
         * */
          this.name = 'Unnamed';

        /**
         *  计划任务cron表达式
         *
         * @property cronExpression
         * @type String
         * @public
         *
         * */
          this.cronExpression = null;

        /**
         *  计划任务描述
         *
         * @property description
         * @type String
         * @public
         *
         * */
          this.description = '';
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
        execute() {
          throw new Error('Abstract Method');
        }

        getClassName() {
          return EasyNode.namespace(__filename);
        }

    }

  module.exports = AbstractScheduleExecutor;
})();
