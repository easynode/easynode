'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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

  var AOP = function (_GenericObject) {
    _inherits(AOP, _GenericObject);

    /**
     * 构造函数。
     *
     * @method 构造函数
     * @since 0.1.0
     * @author hujiabao
     * */

    function AOP() {
      _classCallCheck(this, AOP);

      return _possibleConstructorReturn(this, Object.getPrototypeOf(AOP).call(this));
      // 调用super()后再定义子类成员。
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


    _createClass(AOP, [{
      key: 'getClassName',
      value: function getClassName() {
        return EasyNode.namespace(__filename);
      }
    }], [{
      key: 'before',
      value: function before(namespace, methodName, fnBefore) {
        var syncMode = arguments.length <= 3 || arguments[3] === undefined ? AOP.SYNC : arguments[3];

        var o = null;
        assert(namespace, 'Invalid arguments');
        if (typeof namespace == 'string') {
          o = using(namespace);
        } else if ((typeof namespace === 'undefined' ? 'undefined' : _typeof(namespace)) == 'object' || typeof namespace == 'function') {
          o = namespace;
        } else {
          throw new Error('Invalid argument [namesapce]');
        }
        if (typeof o == 'function') {
          var srcFn = o.prototype[methodName];
          assert(typeof srcFn == 'function', 'Invalid argument [methodName], not a function');
          if (syncMode == AOP.ASYNC) {
            o.prototype[methodName] = function () {
              var ctx = this;
              var args = arguments;
              return regeneratorRuntime.mark(function _callee() {
                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.t0 = srcFn;
                        _context.t1 = ctx;
                        _context.next = 4;
                        return fnBefore.apply(ctx, args);

                      case 4:
                        _context.t2 = _context.sent;
                        _context.next = 7;
                        return _context.t0.apply.call(_context.t0, _context.t1, _context.t2);

                      case 7:
                        return _context.abrupt('return', _context.sent);

                      case 8:
                      case 'end':
                        return _context.stop();
                    }
                  }
                }, _callee, this);
              });
            };
          } else {
            o.prototype[methodName] = function () {
              return srcFn.apply(this, fnBefore.apply(this, arguments));
            };
          }
        } else if ((typeof o === 'undefined' ? 'undefined' : _typeof(o)) == 'object') {
          var srcFn = o[methodName];
          assert(typeof srcFn == 'function', 'Invalid argument [methodName], not a function');
          if (syncMode == AOP.ASYNC) {
            o[methodName] = function () {
              var ctx = this;
              var args = arguments;
              return regeneratorRuntime.mark(function _callee2() {
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        _context2.t0 = srcFn;
                        _context2.t1 = ctx;
                        _context2.next = 4;
                        return fnBefore.apply(ctx, args);

                      case 4:
                        _context2.t2 = _context2.sent;
                        _context2.next = 7;
                        return _context2.t0.apply.call(_context2.t0, _context2.t1, _context2.t2);

                      case 7:
                        return _context2.abrupt('return', _context2.sent);

                      case 8:
                      case 'end':
                        return _context2.stop();
                    }
                  }
                }, _callee2, this);
              });
            };
          } else {
            o[methodName] = function () {
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

    }, {
      key: 'after',
      value: function after(namespace, methodName, fnAfter) {
        var syncMode = arguments.length <= 3 || arguments[3] === undefined ? AOP.SYNC : arguments[3];

        var o = null;
        assert(namespace, 'Invalid arguments');
        if (typeof namespace == 'string') {
          o = using(namespace);
        } else if ((typeof namespace === 'undefined' ? 'undefined' : _typeof(namespace)) == 'object') {
          o = namespace;
        } else {
          throw new Error('Invalid argument [namesapce]');
        }
        if (typeof o == 'function') {
          var srcFn = o.prototype[methodName];
          assert(typeof srcFn == 'function', 'Invalid argument [methodName], not a function');
          if (syncMode == AOP.ASYNC) {
            o.prototype[methodName] = function () {
              var ctx = this;
              var args = arguments;
              return regeneratorRuntime.mark(function _callee3() {
                var ret;
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        _context3.next = 2;
                        return srcFn.apply(ctx, args);

                      case 2:
                        ret = _context3.sent;
                        _context3.next = 5;
                        return fnAfter.call(ctx, ret);

                      case 5:
                        ret = _context3.sent;
                        return _context3.abrupt('return', ret);

                      case 7:
                      case 'end':
                        return _context3.stop();
                    }
                  }
                }, _callee3, this);
              });
            };
          } else {
            o.prototype[methodName] = function () {
              return fnAfter.call(this, srcFn.apply(this, arguments));
            };
          }
        } else if ((typeof o === 'undefined' ? 'undefined' : _typeof(o)) == 'object') {
          var srcFn = o[methodName];
          assert(typeof srcFn == 'function', 'Invalid argument [methodName], not a function');
          if (syncMode == AOP.ASYNC) {
            o[methodName] = function () {
              var ctx = this;
              var args = arguments;
              return regeneratorRuntime.mark(function _callee4() {
                var ret;
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                  while (1) {
                    switch (_context4.prev = _context4.next) {
                      case 0:
                        _context4.next = 2;
                        return srcFn.apply(ctx, args);

                      case 2:
                        ret = _context4.sent;
                        _context4.next = 5;
                        return fnAfter.call(ctx, ret);

                      case 5:
                        ret = _context4.sent;
                        return _context4.abrupt('return', ret);

                      case 7:
                      case 'end':
                        return _context4.stop();
                    }
                  }
                }, _callee4, this);
              });
            };
          } else {
            o[methodName] = function () {
              return fnAfter.call(this, srcFn.apply(this, arguments));
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

    }, {
      key: 'initialize',
      value: function initialize() {
        for (var i = 0; i < arguments.length; i++) {
          var file = EasyNode.real(arguments[i]);
          var intercepts = JSON.parse(fs.readFileSync(file).toString());
          assert(_.isArray(intercepts), 'Invalid interceptor description, not an array');
          intercepts.forEach(function (o) {
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
    }]);

    return AOP;
  }(GenericObject);

  AOP.BEFORE = 'before';
  AOP.AFTER = 'after';
  AOP.SYNC = 'sync';
  AOP.ASYNC = 'async';

  module.exports = AOP;
})();