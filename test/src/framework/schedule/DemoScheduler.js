var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var AbstractScheduleExecutor = using('easynode.framework.schedule.AbstractScheduleExecutor');

(function () {

        /**
         * 计划任务执行接口
         *
         * @class DemoScheduler
         * @extends easynode.framework.schedule.AbstractScheduleExecutor
         * @since 0.1.0
         * @author hujiabao
         * */
        class DemoScheduler extends AbstractScheduleExecutor {

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
                        //调用super()后再定义子类成员。
                }

                /**
                 * 执行计划任务入口函数。
                 *
                 * @method execute
                 * @param {Date} date 统计执行时间，默认为系统当前时间，实际统计日期为date前一天
                 * @async
                 * @since 0.1.0
                 * @author hujiabao
                 * */
                execute (date) {
                        var me = this;
                        return function * () {
                                console.log("......\n");
                        };
                }

                getClassName() {
                        return EasyNode.namespace(__filename);
                }
        }

        module.exports = DemoScheduler;
})();