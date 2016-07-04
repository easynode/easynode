'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var util = require('util');
var events = require("events");

(function () {
  /**
   * GenericObject类。所有的EasyNode类均继承自此类。<br>
   * GenericObject类继承自Node.js->events.EventEmitter，所有的GenericObject类实例，或其子例实例均可以使用
   * on, once, emit, removeListener函数触发和监听事件。<br>
   * <h5>util.inherits(GenericObject, events.EventEmitter);</h5>
   * <pre>
   * var GenericObject = using('easynode.GenericObject');
   * class MyClass extends GenericObject {
   *      constructor () {
   *              super();
   *      }
   * }
   *
   * var o = new MyClass();
   * o.on('hello', function() {
   *      console.log('Hello, EasyNode');
   * });
   * o.trigger('hello');
   * </pre>
   *
   * @class easynode.GenericObject
   * @author hujiabao
   * @since 0.1.0
   * */

  /**
   * 构造函数。PS: 因为操蛋的util.inherits会覆盖class中定义的成员，因此，这个类只能用ES5的function和prototype来实现了。
   *
   * @method 构造函数
   * @since 0.1.0
   * @author hujiabao
   * */

  var GenericObject = function (_events$EventEmitter) {
    _inherits(GenericObject, _events$EventEmitter);

    function GenericObject() {
      _classCallCheck(this, GenericObject);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(GenericObject).call(this));

      _this.setMaxListeners(EasyNode.arg('easynode.events.maxListeners') || 11);
      return _this;
    }

    /**
     * emit函数的别名。参考：Node.js events.EventEmitter.emit()函数。
     *
     * @method trigger
     * @param {String} event 事件名称
     * @param {...} args 事件参数
     * @since 0.1.0
     * @author hujiabao
     * */


    _createClass(GenericObject, [{
      key: 'trigger',
      value: function trigger() {
        this.emit.apply(this, arguments);
      }

      /**
       * removeListener函数的别名。参考：Node.js events.EventEmitter.removeListener()函数。
       *
       * @method off
       * @param {String} event 事件名称
       * @param {Function} listener 事件监听器
       * @since 0.1.0
       * @author hujiabao
       * */

    }, {
      key: 'off',
      value: function off(event, listener) {
        this.removeListener(event, listener);
      }

      /**
       * 获取对象的字符串描述
       *
       * @method toString
       * @return {String} 对象的字符串描述
       * @since 0.1.0
       * @author hujiabao
       * */

    }, {
      key: 'toString',
      value: function toString() {
        return '[object ' + this.getClassName() + ']';
      }

      /**
       * 获取对象的全类名
       * @method getClassName
       * @return {String} 对象的字符串描述
       * @since 0.1.0
       * @author hujiabao
       * */

    }, {
      key: 'getClassName',
      value: function getClassName() {
        return EasyNode.namespace(__filename);
      }

      /**
       * 返回对象的JSON String表达式
       * @method toJSONString
       * @return {String} 对象的JSON字符串描述
       * @since 0.1.0
       * @author hujiabao
       * */

    }, {
      key: 'toJSONString',
      value: function toJSONString() {
        //return util.inspect(this, {depth: EasyNode.config('easynode.inspect.depth')});
        return JSON.stringify(this.toJSON());
      }

      /**
       * 返回对象的JSON对象，即：Notation
       * @method toJSON
       * @return {Object} 对象的Notation
       * @since 0.1.0
       * @author hujiabao
       * */

    }, {
      key: 'toJSON',
      value: function toJSON() {
        var o = {};
        for (var attr in this) {
          var val = this[attr];
          if (attr[0] != '_' && typeof val != 'function') {
            if (val !== null && (typeof val === 'undefined' ? 'undefined' : _typeof(val)) == 'object') {
              if (typeof val.toJSON == 'function') {
                o[attr] = val.toJSON();
              } else {
                o[attr] = val;
              }
            } else {
              o[attr] = val;
            }
          }
        }
        return o;
      }

      /**
       * 判定对象是否属于某个类型
       * @method is
       * @param {String} namespace 全类名
       * @return {boolean} 对象是否为某个类的实例
       * @since 0.1.0
       * @author hujiabao
       * @example
       *
       * var ExpressServer = using('easynode.framework.server.http.ExpressServer');
       * new ExpressServer(3010).is('easynode.framework.server.http.ExpressServer');  //true
       * */

    }, {
      key: 'is',
      value: function is(namespace) {
        return this.getClassName() == namespace;
      }

      /**
       * 无操作函数。可链式调用。
       *
       * @method noop
       * @return this
       * @since 0.1.0
       * @author hujiabao
       * @example
       *
       * var ExpressServer = using('easynode.framework.server.http.ExpressServer');
       * new ExpressServer(3010).is('easynode.framework.server.http.ExpressServer');  //true
       * */

    }, {
      key: 'noop',
      value: function noop() {}
    }]);

    return GenericObject;
  }(events.EventEmitter);

  module.exports = GenericObject;
})();