'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var Action = using('easynode.framework.mvc.Action');
var ActionFactory = using('easynode.framework.mvc.ActionFactory');
var ActionResult = using('easynode.framework.mvc.ActionResult');

(function () {

  /**
   * Class CombinedAction，注意CombinedAction始终返回成功的ActionResult。
   *
   * @class easynode.framework.mvc.CombinedAction
   * @extends easynode.framework.mvc.Action
   * @abstract
   * @since 0.1.0
   * @author hujiabao
   * */

  var CombinedAction = function (_Action) {
    _inherits(CombinedAction, _Action);

    /**
     * 构造函数。
     *
     * @method 构造函数
     * @since 0.1.0
     * @author hujiabao
     * */

    function CombinedAction() {
      _classCallCheck(this, CombinedAction);

      // 调用super()后再定义子类成员。

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(CombinedAction).call(this));

      _this._combinedActions = [];

      _this._processListeners = {};
      return _this;
    }

    /**
     * 增加一个组合Action调用。
     *
     * @method combine
     * @param {String} m 模块名
     * @param {String} a Action名
     * @param {String} name 调用$module.$action后返回的ActionResult的值，默认为$module.$action
     * @since 0.1.0
     * @author hujiabao
     * */


    _createClass(CombinedAction, [{
      key: 'combine',
      value: function combine(m, a, name) {
        var _this2 = this;

        name = name || m + '.' + a;
        var actionInstance = ActionFactory.createActionInstance(m, a, null);
        assert(actionInstance, 'Can not combine action [' + m + '.' + a + '], action is not found');
        var args = actionInstance.getArgs();
        args.forEach(function (arg) {
          _this2.addArg(arg);
        });
        this._combinedActions.push({ m: m, a: a, name: name });
      }

      /**
       * 设置Action处理监听器。支持在任何Action执行前后插入处理函数，这些函数是异步函数，它会在处理流程中被顺序
       * 执行。
       *
       * @method setProcessListener
       * @param {String} when "before"/"after"，分别表示Action处理前和Action处理后
       * @param {String} name 组合的Action名称，"*"表示所有的Action，同combine函数的name参数。
       * @param {generator} fn 异步函数，应传递generator的高阶函数，此函数被绑定到CombinedAction实例执行
       *              函数签名：before-* : function(ctx) {}                ctx, ActionContext实例
       *                       after-* : function(ctx, results) {}     ctx, ActionContext实例，results : CombinedAction的处理结果。
       *                                      当此函数返回ActionResult实例时，CombinedAction的ActionResult将被设置为此ActionResult
       *                     before-$action : function(ctx, $args, $ results) {}  ctx, ActionContext实例，$args: Action参数, results : CombinedAction的处理结果
       *                     after-$action : function(ctx, $args, $ results) {}  ctx, ActionContext实例，$args: Action参数, results : CombinedAction的处理结果
       * */

    }, {
      key: 'setProcessListener',
      value: function setProcessListener(when) {
        var name = arguments.length <= 1 || arguments[1] === undefined ? '*' : arguments[1];
        var fn = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

        assert(when == 'before' || when == 'after', 'Invalid argument');
        assert(typeof name == 'string' && (fn == null || typeof fn == 'function'), 'Invalid argument');
        this._processListeners[when + '-' + name] = fn;
      }

      /**
       * 组合的Action　process实现函数，按组合顺序执行Action，与一般的执行不同，组合执行时，会在process函数调用时
       * 压入前面action执行结果，如果各个Action之前没有关联关系，可忽略该参数。
       *
       * @method process
       * */

    }, {
      key: 'process',
      value: function process(ctx) {
        var me = this;
        return regeneratorRuntime.mark(function _callee() {
          var r, o, fn, i, t, actionInstance, args, stack, actionResult, ret;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  r = ActionResult.createSuccessResult();
                  o = {};
                  fn = me._processListeners['before-*'];

                  if (!(typeof fn == 'function')) {
                    _context.next = 6;
                    break;
                  }

                  _context.next = 6;
                  return fn.call(me, ctx, o);

                case 6:
                  i = 0;

                case 7:
                  if (!(i < me._combinedActions.length)) {
                    _context.next = 30;
                    break;
                  }

                  t = me._combinedActions[i];
                  actionInstance = ActionFactory.createActionInstance(t.m, t.a, ctx);
                  args = actionInstance.getArgs();
                  stack = [ctx];

                  args.forEach(function (v) {
                    stack.push(ctx.param(v.name));
                  });
                  stack.push(o);
                  fn = me._processListeners['before-' + t.name];

                  if (!(typeof fn == 'function')) {
                    _context.next = 18;
                    break;
                  }

                  _context.next = 18;
                  return fn.apply(me, stack);

                case 18:
                  _context.next = 20;
                  return actionInstance.process.apply(actionInstance, stack);

                case 20:
                  actionResult = _context.sent;

                  actionResult = actionResult || ActionResult.createNoReturnResult();
                  o[t.name] = actionResult;
                  fn = me._processListeners['after-' + t.name];

                  if (!(typeof fn == 'function')) {
                    _context.next = 27;
                    break;
                  }

                  _context.next = 27;
                  return fn.apply(me, stack);

                case 27:
                  i++;
                  _context.next = 7;
                  break;

                case 30:
                  fn = me._processListeners['after-*'];

                  if (!(typeof fn == 'function')) {
                    _context.next = 36;
                    break;
                  }

                  _context.next = 34;
                  return fn.call(me, ctx, o);

                case 34:
                  ret = _context.sent;

                  o = ret || o;

                case 36:
                  r.result = o;
                  return _context.abrupt('return', r);

                case 38:
                case 'end':
                  return _context.stop();
              }
            }
          }, _callee, this);
        });
      }
    }, {
      key: 'getClassName',
      value: function getClassName() {
        return EasyNode.namespace(__filename);
      }
    }]);

    return CombinedAction;
  }(Action);

  module.exports = CombinedAction;
})();