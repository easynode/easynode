var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var GenericObject = using('easynode.GenericObject');
var CronJob = require('cron').CronJob;
var AbstractScheduleExecutor = using('easynode.framework.schedule.AbstractScheduleExecutor');
var BeanFactory = using('easynode.framework.BeanFactory');
var fs = require('co-fs');
var co = require('co');

(function() {
        /**
         * 计划任务类
         *
         * @class easynode.framework.schedule.Scheduler
         * @extends easynode.GenericObject
         * @since 0.1.0
         * @author hujiabao
         * */
  class Scheduler extends GenericObject {
                /**
                 * 构造函数。
                 *
                 * @method 构造函数
                 * @private
                 * @since 0.1.0
                 * @author hujiabao
                 * */
    constructor() {
      super();
                        // 调用super()后再定义子类成员。
    }

    static schedule(scheduleExecutor, cronExp) {
      assert(scheduleExecutor instanceof AbstractScheduleExecutor, 'Invalid schedule executor');
      try {
        if (cronExp) {
          scheduleExecutor.cronExpression = cronExp;
        }
        var job = new CronJob(scheduleExecutor.cronExpression, function() {
          logger.info(`executing schedule [${scheduleExecutor.name}]...`);
          co(function *() {
            yield scheduleExecutor.execute();
            logger.info(`schedule [${scheduleExecutor.name}] executed`);
          }).catch(function(err) {
            logger.error('error occurred while executing schedule [' + scheduleExecutor.name + ']');
            logger.error(err);
          });
        });
        job.start();
        return true;
      } catch (err) {
        logger.error(err);
        return false;
      }
    }

    static loadSchedule(file) {
      return function *() {
        const BEAN_REGEXP = /^\$(\w+)$/;
        var fileContent = yield fs.readFile(EasyNode.real(file));
        var config = JSON.parse(fileContent.toString());
        for (var i = 0; i < config.length; i++) {
          var c = config[i];
          if (c.enabled === false) continue;
          var executor = null;
          if (BEAN_REGEXP.test(c.executor)) {
            executor = BeanFactory.get(BEAN_REGEXP.exec(c.executor)[1]);
          }
          else {
            var cls = using(c.executor);
            executor = new cls();
          }
          executor.name = c.name;
          executor.cronExpression = c['cron-expression'];
          executor.description = c.description;
          if (Scheduler.schedule(executor)) {
            logger.info(`scheduler [${c.name}] started, scheduler functionality is：${c.description || 'nothing detailed'}`);
          }
        }
      };
    }

    getClassName() {
      return EasyNode.namespace(__filename);
    }
        }

  module.exports = Scheduler;
})();
