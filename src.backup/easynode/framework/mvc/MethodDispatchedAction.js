var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var GenericObject = using('easynode.GenericObject');
var ActionFactory = using('easynode.framework.mvc.ActionFactory');
var Action = using('easynode.framework.mvc.Action');
var _ = require('underscore');

(function () {
        /**
         * Class MethodDispatchedAction
         *
         * @class easynode.framework.mvc.MethodDispatchedAction
         * @extends easynode.GenericObject
         * @since 0.1.0
         * @author hujiabao
         * */
        class MethodDispatchedAction extends GenericObject {
                /**
                 * 构造函数。
                 *
                 * @method 构造函数
                 * @param {String} moduleName Action模块名
                 * @param {String} entryMethodPrefix action处理函数名前缀，默认action_
                 * @param {String} argDefineMethodPrefix action参数定义函数名前缀，默认arg_
                 * @since 0.1.0
                 * @author hujiabao
                 * */
                constructor(moduleName, entryMethodPrefix = 'action_', argDefineMethodPrefix = 'arg_') {
                        super();
                        //调用super()后再定义子类成员。
                        this._moduleName = moduleName;
                        this._entryMethodPrefix = entryMethodPrefix;
                        this._argDefineMethodPrefix = argDefineMethodPrefix;
                        this._actionEntries = [];
                }

                /**
                 * 添加一个Action入口。
                 *
                 * @method dispatch
                 * @param {function} entry 函数，应当总是返回一个对象，该对象的defineArgs和process函数会绑定到一个Action的实例上执行。
                 *      对象原型为：{
                 *                                      brief : 'action简述',
                 *                                      defineArgs : function() {
                 *                                              this.addArg('a string comment of a');
                 *                                      },
                 *                                      process : function(ctx, arg1, arg2) {
                 *                                              return function * () {
                 *                                                      return ActionResult.createSuccessResult('MDA');
                 *                                              };
                 *                                      }
                 *                            }
                 *
                 * @since 0.1.0
                 * @author hujiabao
                 * */
                dispatch(entry) {
                        assert(typeof entry == 'function', 'Invalid argument');
                        var actionRegExp = new RegExp(this._entryMethodPrefix + '*');
                        assert(entry.name.match(actionRegExp), `Action processor is not matched to the declared pattern [${this._entryMethodPrefix}]`);
                        this._actionEntries.push(entry);
                        return this;
                }

                /**
                 * 获取或设置Action模块名。
                 *
                 * @method moduleName
                 * @param {String} name 传递此参数时，设置；不传递此参数时获取。
                 * @since 0.1.0
                 * @author hujiabao
                 * */
                moduleName(name) {
                        if (arguments.length == 0) {
                                return this._moduleName;
                        }
                        assert(name, 'Invalid argument');
                        this._moduleName = name;
                }

                /**
                 * 注册所有符合命名规范的Action。Action的模块名为设置的moduleName，Action的名称为处理函数去"processMethodPrefix"(默认：action_)。
                 * 例如：action_aaa返回"aaa"。
                 *
                 * @method register
                 * @since 0.1.0
                 * @author hujiabao
                 * */
                register() {
                        this._actionEntries.forEach(entryMethod => {
                                var actionName = this._getActionName(entryMethod.name);
                                var argDefineMethod = this._argDefineMethodPrefix + actionName;
                                var ActionClass = this._createActionClass(entryMethod.call(this));
                                Action.define(this._moduleName, actionName, ActionClass);
                                ActionFactory.register(ActionClass);
                        });
                }

                _createActionClass(actionEntry) {
                        var argDefineMethod = actionEntry.defineArgs;
                        var processMethod = actionEntry.process || function (ctx) {
                                        return function * () {
                                                var ActionResult = using('easynode.framework.mvc.ActionResult');
                                                return ActionResult.createNoImplementationError();
                                        };
                                };
                        class ActionClass extends Action {
                                constructor() {
                                        super();
                                        if (argDefineMethod) {
                                                argDefineMethod.call(this);
                                        }
                                        this.brief = actionEntry.brief;
                                }

                                process(ctx) {
                                        var me = this;
                                        var args = arguments;
                                        return function * () {
                                                return yield processMethod.apply(me, args);
                                        };
                                }
                        }

                        return ActionClass;
                }

                _getActionName(methodName) {
                        return methodName.replace(new RegExp(this._entryMethodPrefix), '');
                }

                getClassName() {
                        return EasyNode.namespace(__filename);
                }
        }

        module.exports = MethodDispatchedAction;
})();