'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var GenericObject = using('easynode.GenericObject');
var CronJob = require('cron').CronJob;
var AbstractScheduleExecutor = using('easynode.framework.schedule.AbstractScheduleExecutor');
var BeanFactory = using('easynode.framework.BeanFactory');
var fs = require('co-fs');
var co = require('co');

(function () {
  /**
   * 计划任务类
   *
   * @class easynode.framework.schedule.Scheduler
   * @extends easynode.GenericObject
   * @since 0.1.0
   * @author hujiabao
   * */

  var Scheduler = function (_GenericObject) {
    _inherits(Scheduler, _GenericObject);

    /**
     * 构造函数。
     *
     * @method 构造函数
     * @private
     * @since 0.1.0
     * @author hujiabao
     * */

    function Scheduler() {
      _classCallCheck(this, Scheduler);

      return _possibleConstructorReturn(this, Object.getPrototypeOf(Scheduler).call(this));
      // 调用super()后再定义子类成员。
    }

    _createClass(Scheduler, [{
      key: 'getClassName',
      value: function getClassName() {
        return EasyNode.namespace(__filename);
      }
    }], [{
      key: 'schedule',
      value: function schedule(scheduleExecutor, cronExp) {
        assert(scheduleExecutor instanceof AbstractScheduleExecutor, 'Invalid schedule executor');
        try {
          if (cronExp) {
            scheduleExecutor.cronExpression = cronExp;
          }
          var job = new CronJob(scheduleExecutor.cronExpression, function () {
            logger.info('executing schedule [' + scheduleExecutor.name + ']...');
            co(regeneratorRuntime.mark(function _callee() {
              return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      _context.next = 2;
                      return scheduleExecutor.execute();

                    case 2:
                      logger.info('schedule [' + scheduleExecutor.name + '] executed');

                    case 3:
                    case 'end':
                      return _context.stop();
                  }
                }
              }, _callee, this);
            })).catch(function (err) {
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
    }, {
      key: 'loadSchedule',
      value: function loadSchedule(file) {
        return regeneratorRuntime.mark(function _callee2() {
          var BEAN_REGEXP, fileContent, config, i, c, executor, cls;
          return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  BEAN_REGEXP = /^\$(\w+)$/;
                  _context2.next = 3;
                  return fs.readFile(EasyNode.real(file));

                case 3:
                  fileContent = _context2.sent;
                  config = JSON.parse(fileContent.toString());
                  i = 0;

                case 6:
                  if (!(i < config.length)) {
                    _context2.next = 19;
                    break;
                  }

                  c = config[i];

                  if (!(c.enabled === false)) {
                    _context2.next = 10;
                    break;
                  }

                  return _context2.abrupt('continue', 16);

                case 10:
                  executor = null;

                  if (BEAN_REGEXP.test(c.executor)) {
                    executor = BeanFactory.get(BEAN_REGEXP.exec(c.executor)[1]);
                  } else {
                    cls = using(c.executor);

                    executor = new cls();
                  }
                  executor.name = c.name;
                  executor.cronExpression = c['cron-expression'];
                  executor.description = c.description;
                  if (Scheduler.schedule(executor)) {
                    logger.info('scheduler [' + c.name + '] started, scheduler functionality is：' + (c.description || 'nothing detailed'));
                  }

                case 16:
                  i++;
                  _context2.next = 6;
                  break;

                case 19:
                case 'end':
                  return _context2.stop();
              }
            }
          }, _callee2, this);
        });
      }
    }]);

    return Scheduler;
  }(GenericObject);

  module.exports = Scheduler;
})();