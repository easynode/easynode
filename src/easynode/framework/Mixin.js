var log4js = require('log4js');
var assert = require('assert');
var fs = require('fs');
var S = require('string');
var GenericObject = using('easynode.GenericObject');

(function () {
        /**
         * EasyNode 多继承实现类。这是一个单例类，请使用它的静态函数，不要实例化它。<br>
         * <h5>示例</h5>
         * <pre>
         *  var Mixin = using('easynode.framework.Mixin');
         *  class UserService extends Mixin.mix(GenericObject,APIReturn) {
         *
         *  }
         *  </pre>
         *
         * @class easynode.framework.Mixin
         * @extends easynode.GenericObject
         * @author hujiabao
         * @since 0.1.0
         * */

        /**
         *  静态实例
         *  @property   instance
         *  @private
         *  @static
         *  @author hujiabao
         *  @since 0.1.0
         * */
        var _instance = null;

        class Mixin extends GenericObject {
                /**
                 * 构造函数，私有的，使用静态函数getLogger()获取Logger实例。
                 *
                 * @method 构造函数
                 * @since 0.1.0
                 * @author hujiabao
                 * @private
                 * */
                constructor() {
                        super();
                        //调用super()后再定义子类成员。
                        assert(_instance == null, 'easynode.Mixin is a singleton class,  use class static function Mixin.mix instead of instantiation');
                }

                getClassName () {
                        return EasyNode.namespace(__filename);
                }

                /**
                 *  类的静态函数,将多个接口的混合
                 *
                 * @method mix
                 * @static
                 * @since 0.1.0
                 * @author hujiabao
                 * @param {...mixins} 需混合的多个接口
                 * @return {Mix} 混合后的内部类
                 * @example
                 *     var Mixin = using('easynode.framework.Mixin');
                 *     var APIReturn =  using('easynode.framework.util.APIReturn');
                 *     class UserService extends Mixin.mix(GenericObject,APIReturn) {
                 *         addUser(){
                              var me = this;
                              return function *(){
                                var ret = {};
                                try {
                                    ret = me.APIReturn(0,'success',{id:newId});
                                } catch (e) {
                                  EasyNode.DEBUG && logger.error(e);
                                  ret = me.APIReturn(1,'failed',{});
                                } finally {
                                  return ret;
                                }
                              }
                            }
                 *     }
                 * */
                static mix(...mixins) {
                        class Mix {}

                        for (let mixin of mixins) {
                                Mixin.copyProperties(Mix, mixin);
                                Mixin.copyProperties(Mix.prototype, mixin.prototype);
                        }

                        return Mix;
                }


                static copyProperties(target, source) {
                        for (let key of Reflect.ownKeys(source)) {
                                if ( key !== "constructor"
                                    && key !== "prototype"
                                    && key !== "name"
                                ) {
                                        let desc = Object.getOwnPropertyDescriptor(source, key);
                                        Object.defineProperty(target, key, desc);
                                }
                        }
                }}


        //实例化单例对象。
        _instance = new Mixin();

        module.exports = Mixin;
})();