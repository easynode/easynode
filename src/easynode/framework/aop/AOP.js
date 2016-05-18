var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var GenericObject = using('easynode.GenericObject');
var _ = require('underscore');
var fs = require('fs');

(function () {
        /**
         * Class AOP
         *
         * @class easynode.framework.aop.AOP
         * @extends easynode.GenericObject
         * @since 0.1.0
         * @author hujiabao
         * */
        class AOP extends GenericObject {
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
                }

                /**
                 * AOP before。功能：在A函数执行前先行执行B函数，使用B函数的返回值（必须是一个数组）作为A函数的参数。A函数：被拦截函数，
                 * B函数：拦截函数。
                 *
                 * @method before
                 * @param {String/Object/Class} namespace 全类名或对象或类
                 * @param {String} methodName 要拦截的函数名（被拦截函数）
                 * @param {Function/generator} fnBefore 拦截函数，此函数可以是普通函数或generator函数，取决于syncMode，如果是AOP.SYNC则为同步函数
                 * 　　　　　　　　　　　　　　 如果是AOP.ASYNC则为一个generator函数(异步函数)。为了避免generator中的this指针引用问题，建议使用一个返回
                 *                                                      generator的高阶函数替代纯generator函数。
                 *                                                      拦截函数的参数与被拦截函数的参数相同
                 * @param {String} syncMode "sync/async"，AOP.SYNC/AOP.ASYNC，表示被拦截的函数的类型，ASYNC表示拦截的函数是一个generator函数
                 *                                                      注意：拦截函数的类型(sync/async)必须与被拦截函数的类型一致
                 * @return {Array} 返回一个数组，该数组中的元素依次作为被拦截函数的参数传入(Function.apply)。如果不需要修改参数，可以return arguments;
                 * @static
                 * @since 0.1.0
                 * @author hujiabao
                 * @example
                 *              var obj = {
                 *                      name : 'ABC',
                 *                      sayHello : function(hello) {
                 *                              console.log(this.name + '->' + hello);
                 *                              this.name = 'abc';
                 *                      }
                 *              };
                 *
                 *              AOP.before(obj, 'sayHello', function(){
                 *                      console.log('Before->' + this.name);
                 *                      return ['PPP'];                                                        //实际传递到obj.sayHello的函数的参数hello变成了"PPP"
                 *              });
                 * */
                static before(namespace, methodName, fnBefore, syncMode=AOP.SYNC) {
                        var o = null;
                        assert(namespace, 'Invalid arguments');
                        if(typeof namespace == 'string') {
                                o = using(namespace);
                        }
                        else if(typeof namespace == 'object' || typeof namespace == 'function') {
                                o = namespace;
                        }
                        else {
                                throw new Error('Invalid argument [namesapce]');
                        }
                        if(typeof o == 'function') {
                                var srcFn = o.prototype[methodName];
                                assert(typeof srcFn == 'function', 'Invalid argument [methodName], not a function');
                                if(syncMode == AOP.ASYNC) {
                                        o.prototype[methodName] = function() {
                                                var ctx = this;
                                                var args = arguments;
                                                return function * () {
                                                        return yield srcFn.apply(ctx, yield fnBefore.apply(ctx, args));
                                                };
                                        };
                                }
                                else {
                                        o.prototype[methodName] = function() {
                                                return srcFn.apply(this, fnBefore.apply(this, arguments));
                                        };
                                }
                        }
                        else if(typeof o == 'object') {
                                var srcFn = o[methodName];
                                assert(typeof srcFn == 'function', 'Invalid argument [methodName], not a function');
                                if(syncMode == AOP.ASYNC) {
                                        o[methodName] = function() {
                                                var ctx = this;
                                                var args = arguments;
                                                return function * () {
                                                        return yield srcFn.apply(ctx, yield fnBefore.apply(ctx, args));
                                                };
                                        };
                                }
                                else {
                                        o[methodName] = function() {
                                                return srcFn.apply(this, fnBefore.apply(this, arguments));
                                        };
                                }
                        }
                }

                /**
                 * AOP after。功能：在A函数执行后执行B函数，A函数的返回值作为B函数的传入参数，B函数的返回值作为A函数的最终返回值。A函数：被拦截函数，
                 * B函数：拦截函数。
                 *
                 * @method after
                 * @param {String/Object/Class} namespace 全类名或对象或类
                 * @param {String} methodName 要拦截的函数名（被拦截函数）
                 * @param {Function/generator} fnAfter 拦截函数，此函数可以是普通函数或generator函数，取决于syncMode，如果是AOP.SYNC则为同步函数
                 * 　　　　　　　　　　　　　　 如果是AOP.ASYNC则为一个generator函数(异步函数)。为了避免generator中的this指针引用问题，建议使用一个返回
                 *                                                      generator的高阶函数替代纯generator函数。
                 *                                                      拦截函数的参数与被拦截函数的参数相同
                 * @param {String} syncMode "sync/async"，AOP.SYNC/AOP.ASYNC，表示被拦截的函数的类型，ASYNC表示拦截的函数是一个generator函数
                 *                                                      注意：拦截函数的类型(sync/async)必须与被拦截函数的类型一致
                 * @return {any} 该返回值将作为被拦截函数的实际返回值
                 * @static
                 * @since 0.1.0
                 * @author hujiabao
                 * @example
                 *              var obj = {
                 *                      name : 'ABC',
                 *                      sayHello : function(hello) {
                 *                              console.log(this.name + '->' + hello);
                 *                              this.name = 'abc';
                 *                      }
                 *              };
                 *
                 *              AOP.after(obj, 'sayHello', function(ret){
                 *                      console.log('After->' + this.name);
                 *              });
                 * */
                static after(namespace, methodName, fnAfter, syncMode=AOP.SYNC) {
                        var o = null;
                        assert(namespace, 'Invalid arguments');
                        if(typeof namespace == 'string') {
                                o = using(namespace);
                        }
                        else if(typeof namespace == 'object') {
                                o = namespace;
                        }
                        else {
                                throw new Error('Invalid argument [namesapce]');
                        }
                        if(typeof o == 'function') {
                                var srcFn = o.prototype[methodName];
                                assert(typeof srcFn == 'function', 'Invalid argument [methodName], not a function');
                                if(syncMode == AOP.ASYNC) {
                                        o.prototype[methodName] = function() {
                                                var ctx = this;
                                                var args = arguments;
                                                return function * () {
                                                        var ret = yield srcFn.apply(ctx, args);
                                                        ret = yield fnAfter.call(ctx, ret);
                                                        return ret;
                                                };
                                        };
                                }
                                else {
                                        o.prototype[methodName] = function() {
                                                return fnAfter.call(this, srcFn.apply(this, arguments));
                                        };
                                }
                        }
                        else if(typeof o == 'object') {
                                var srcFn = o[methodName];
                                assert(typeof srcFn == 'function', 'Invalid argument [methodName], not a function');
                                if(syncMode == AOP.ASYNC) {
                                        o[methodName] = function() {
                                                var ctx = this;
                                                var args = arguments;
                                                return function * () {
                                                        var ret = yield srcFn.apply(ctx, args);
                                                        ret = yield fnAfter.call(ctx, ret);
                                                        return ret;
                                                };
                                        };
                                }
                                else {
                                        o[methodName] = function() {
                                                fnAfter.call(this, srcFn.apply(this, arguments));
                                        };
                                }
                        }
                }

                /**
                 * 从JSON文件描述中初始化AOP模块。
                 *
                 * @method initialize
                 * @param {String} ... 拦截器描述文件（多参），描述对象Notation:
                 *                                                                              {
                 *                                                                                       "target" : "easynode.framework.util.SqlUtil",
                 *                                                                                       "interceptor" : "easynode.tests.SqlUtilInterceptor",
                 *                                                                                       "method" : "replaceMysqlArgs",
                 *                                                                                       "mode" : "sync",
                 *                                                                                       "when" : "before"
                 *                                                                               }
                 * @static
                 * @since 0.1.0
                 * @author hujiabao
                 * */
                static initialize() {
                        for(var i = 0;i<arguments.length;i++) {
                                var file = EasyNode.real(arguments[i]);
                                var intercepts = JSON.parse(fs.readFileSync(file).toString());
                                assert(_.isArray(intercepts), 'Invalid interceptor description, not an array');
                                intercepts.forEach(o => {
                                        o['mode'] = (o['mode'] || AOP.SYNC).toLowerCase();
                                        o['when'] = o['when'].toLowerCase();
                                        assert(o['mode'] == AOP.SYNC || o['mode'] == AOP.ASYNC, 'Invalid method mode, set to "sync" or "async"');
                                        assert(o['when'] == AOP.BEFORE || o['when'] == AOP.AFTER, 'Invalid interceptor, set "when" to "before" or "after"');
                                        var namespace = using(o['target']);
                                        var interceptor = using(o['interceptor']);
                                        var implMethodName = o['when'] + '_' + o['method'];
                                        AOP[o['when']].call(null, namespace, o['method'], interceptor[implMethodName], o['mode']);
                                });
                        }
                }

                getClassName() {
                        return EasyNode.namespace(__filename);
                }
        }

        AOP.BEFORE = 'before';
        AOP.AFTER = 'after';
        AOP.SYNC = 'sync';
        AOP.ASYNC = 'async';

        module.exports = AOP;
})();