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
         * KOAHttpServer session的内存存储，注意，内存存储仅供开发使用，并且不支持TTL，线上产品请使用redis或后续将支持的memcached等 。
         *
         * @class easynode.framework.server.KOAMemorySessionStorage
         * @extends easynode.GenericObject
         * @since 0.1.0
         * @author hujiabao
         * */

        var _sessions = {};

        var KOAMemorySessionStorage = function (_GenericObject) {
                _inherits(KOAMemorySessionStorage, _GenericObject);

                /**
                 * 构造函数。
                 *
                 * @method 构造函数
                 * @since 0.1.0
                 * @author hujiabao
                 * */

                function KOAMemorySessionStorage(options) {
                        _classCallCheck(this, KOAMemorySessionStorage);

                        //调用super()后再定义子类成员。

                        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(KOAMemorySessionStorage).call(this));

                        _this._options = options || {};
                        return _this;
                }

                /**
                 *  get函数，获取一个session。
                 *
                 * @method get
                 * @param {string} sid session id
                 * @async
                 * @since 0.1.0
                 * @author hujiabao
                 * */


                _createClass(KOAMemorySessionStorage, [{
                        key: 'get',
                        value: function get(sid) {
                                return regeneratorRuntime.mark(function _callee() {
                                        return regeneratorRuntime.wrap(function _callee$(_context) {
                                                while (1) {
                                                        switch (_context.prev = _context.next) {
                                                                case 0:
                                                                        return _context.abrupt('return', _sessions[sid]);

                                                                case 1:
                                                                case 'end':
                                                                        return _context.stop();
                                                        }
                                                }
                                        }, _callee, this);
                                });
                        }

                        /**
                         *  set函数，获取一个session。
                         *
                         * @method set
                         * @async
                         * @param {string} sid session id
                         * @param {object} sess session 对象
                         * @param {int} ttl, 超时时间：NOTE : 不支持
                         * @since 0.1.0
                         * @author hujiabao
                         * */

                }, {
                        key: 'set',
                        value: function set(sid, sess, ttl) {
                                return regeneratorRuntime.mark(function _callee2() {
                                        return regeneratorRuntime.wrap(function _callee2$(_context2) {
                                                while (1) {
                                                        switch (_context2.prev = _context2.next) {
                                                                case 0:
                                                                        _sessions[sid] = sess;

                                                                case 1:
                                                                case 'end':
                                                                        return _context2.stop();
                                                        }
                                                }
                                        }, _callee2, this);
                                });
                        }

                        /**
                         *  destroy函数，销毁一个session。
                         *
                         * @method destroy
                         * @async
                         * @param {string} sid session id
                         * @since 0.1.0
                         * @author hujiabao
                         * */

                }, {
                        key: 'destroy',
                        value: function destroy(sid) {
                                return regeneratorRuntime.mark(function _callee3() {
                                        return regeneratorRuntime.wrap(function _callee3$(_context3) {
                                                while (1) {
                                                        switch (_context3.prev = _context3.next) {
                                                                case 0:
                                                                        delete _sessions[sid];

                                                                case 1:
                                                                case 'end':
                                                                        return _context3.stop();
                                                        }
                                                }
                                        }, _callee3, this);
                                });
                        }
                }, {
                        key: 'getClassName',
                        value: function getClassName() {
                                return EasyNode.namespace(__filename);
                        }
                }]);

                return KOAMemorySessionStorage;
        }(GenericObject);

        module.exports = KOAMemorySessionStorage;
})();