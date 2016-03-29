'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var GenericObject = using('easynode.GenericObject');

(function () {
        /**
         * Class IQueue
         *
         * @class easynode.framework.mq.IQueue
         * @extends easynode.GenericObject
         * @since 0.1.0
         * @author hujiabao
         * */

        var IQueue = function (_GenericObject) {
                _inherits(IQueue, _GenericObject);

                /**
                 * 构造函数。
                 *
                 * @method 构造函数
                 * @since 0.1.0
                 * @author hujiabao
                 * */

                function IQueue() {
                        _classCallCheck(this, IQueue);

                        return _possibleConstructorReturn(this, Object.getPrototypeOf(IQueue).call(this));
                        //调用super()后再定义子类成员。
                }

                /**
                 * 向队列发送消息。
                 *
                 * @method publish
                 * @param {String} queueName 队列名称
                 * @param {Object} opts 发送选项，取决于队列的协议和驱动程序
                 * @param {Object} msgs JSON对象，可一次发送多条消息
                 * @async
                 * @abstract
                 * @since 0.1.0
                 * @author hujiabao
                 * */


                _createClass(IQueue, [{
                        key: 'publish',
                        value: function publish(queueName, opts) {
                                throw new Error('Abstract Method');
                        }

                        /**
                         * 订阅队列消息。
                         *
                         * @method subscribe
                         * @param {String} queueName 队列名称
                         * @param {Object} opts 订阅选项，取决于队列的协议和驱动程序
                         * @param {Object} l 队列监听器，具有一个onMessage函数，函数原型：onMessage (msg) {}，msg类型：object
                         * @return {Object} 订阅实例，需要通过unsubscribe释放资源
                         * @async
                         * @abstract
                         * @since 0.1.0
                         * @author hujiabao
                         * */

                }, {
                        key: 'subscribe',
                        value: function subscribe(queueName, opts, l) {
                                throw new Error('Abstract Method');
                        }

                        /**
                         * 取消订阅队列消息。
                         *
                         * @method unsubscribe
                         * @param {Object} subscribeInst subscribe函数的返回值
                         * @async
                         * @abstract
                         * @since 0.1.0
                         * @author hujiabao
                         * */

                }, {
                        key: 'unsubscribe',
                        value: function unsubscribe(subscribeInst) {
                                throw new Error('Abstract Method');
                        }
                }, {
                        key: 'getClassName',
                        value: function getClassName() {
                                return EasyNode.namespace(__filename);
                        }
                }]);

                return IQueue;
        }(GenericObject);

        module.exports = IQueue;
})();