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
        class CombinedAction extends Action {
                /**
                 * 构造函数。
                 *
                 * @method 构造函数
                 * @since 0.1.0
                 * @author hujiabao
                 * */
                constructor() {
                        super();
                        //调用super()后再定义子类成员。
                        this._combinedActions = [];

                        this._processListeners = {};
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
                combine(m, a, name) {
                        name = name || m + '.' + a;
                        var actionInstance = ActionFactory.createActionInstance(m, a, null);
                        assert(actionInstance, `Can not combine action [${m}.${a}], action is not found`);
                        var args = actionInstance.getArgs();
                        args.forEach(arg => {
                                this.addArg(arg);
                        });
                        this._combinedActions.push({m: m, a : a, name : name});
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
                 *                                 after-* : function(ctx, results) {}     ctx, ActionContext实例，results : CombinedAction的处理结果。
                 *                                                                                           当此函数返回ActionResult实例时，CombinedAction的ActionResult将被设置为此ActionResult
                 *                                 before-$action : function(ctx, $args, $ results) {}  ctx, ActionContext实例，$args: Action参数, results : CombinedAction的处理结果
                 *                                 after-$action : function(ctx, $args, $ results) {}  ctx, ActionContext实例，$args: Action参数, results : CombinedAction的处理结果
                 * */
                setProcessListener (when, name='*', fn=null) {
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
                process (ctx) {
                        var me = this;
                        return function * () {
                                var r = ActionResult.createSuccessResult();
                                var o = {};
                                var fn = me._processListeners['before-*'];
                                if(typeof fn == 'function') {
                                        yield fn.call(me, ctx, o);
                                }
                                for(var i = 0;i<me._combinedActions.length;i++) {
                                        var t = me._combinedActions[i];
                                        var actionInstance = ActionFactory.createActionInstance(t.m, t.a, ctx);
                                        var args = actionInstance.getArgs();
                                        var stack = [ctx];
                                        args.forEach(v => {
                                                stack.push(ctx.param(v.name));
                                        });
                                        stack.push(o);
                                        fn = me._processListeners['before-' + t.name];
                                        if(typeof fn == 'function') {
                                                yield fn.apply(me, stack);
                                        }
                                        var actionResult = yield actionInstance.process.apply(actionInstance, stack);
                                        actionResult = actionResult || ActionResult.createNoReturnResult();
                                        o[t.name] = actionResult;
                                        fn = me._processListeners['after-' + t.name];
                                        if(typeof fn == 'function') {
                                                yield fn.apply(me, stack);
                                        }
                                }
                                fn = me._processListeners['after-*'];
                                if(typeof fn == 'function') {
                                        var ret = yield fn.call(me, ctx, o);
                                        o = ret || o;
                                }
                                r.result = o;
                                return r;
                        };
                }

                getClassName() {
                        return EasyNode.namespace(__filename);
                }
        }

        module.exports = CombinedAction;
})();