'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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

        var Mixin = function (_GenericObject) {
                _inherits(Mixin, _GenericObject);

                /**
                 * 构造函数，私有的，使用静态函数getLogger()获取Logger实例。
                 *
                 * @method 构造函数
                 * @since 0.1.0
                 * @author hujiabao
                 * @private
                 * */

                function Mixin() {
                        _classCallCheck(this, Mixin);

                        //调用super()后再定义子类成员。

                        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Mixin).call(this));

                        assert(_instance == null, 'easynode.Mixin is a singleton class,  use class static function Mixin.mix instead of instantiation');
                        return _this;
                }

                _createClass(Mixin, [{
                        key: 'getClassName',
                        value: function getClassName() {
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

                }], [{
                        key: 'mix',
                        value: function mix() {
                                var Mix = function Mix() {
                                        _classCallCheck(this, Mix);
                                };

                                for (var _len = arguments.length, mixins = Array(_len), _key = 0; _key < _len; _key++) {
                                        mixins[_key] = arguments[_key];
                                }

                                var _iteratorNormalCompletion = true;
                                var _didIteratorError = false;
                                var _iteratorError = undefined;

                                try {

                                        for (var _iterator = mixins[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                                                var mixin = _step.value;

                                                Mixin.copyProperties(Mix, mixin);
                                                Mixin.copyProperties(Mix.prototype, mixin.prototype);
                                        }
                                } catch (err) {
                                        _didIteratorError = true;
                                        _iteratorError = err;
                                } finally {
                                        try {
                                                if (!_iteratorNormalCompletion && _iterator.return) {
                                                        _iterator.return();
                                                }
                                        } finally {
                                                if (_didIteratorError) {
                                                        throw _iteratorError;
                                                }
                                        }
                                }

                                return Mix;
                        }
                }, {
                        key: 'copyProperties',
                        value: function copyProperties(target, source) {
                                var _iteratorNormalCompletion2 = true;
                                var _didIteratorError2 = false;
                                var _iteratorError2 = undefined;

                                try {
                                        for (var _iterator2 = Reflect.ownKeys(source)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                                                var key = _step2.value;

                                                if (key !== "constructor" && key !== "prototype" && key !== "name") {
                                                        var desc = Object.getOwnPropertyDescriptor(source, key);
                                                        Object.defineProperty(target, key, desc);
                                                }
                                        }
                                } catch (err) {
                                        _didIteratorError2 = true;
                                        _iteratorError2 = err;
                                } finally {
                                        try {
                                                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                                        _iterator2.return();
                                                }
                                        } finally {
                                                if (_didIteratorError2) {
                                                        throw _iteratorError2;
                                                }
                                        }
                                }
                        }
                }]);

                return Mixin;
        }(GenericObject);

        //实例化单例对象。


        _instance = new Mixin();

        module.exports = Mixin;
})();