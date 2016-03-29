'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var GenericObject = using('easynode.GenericObject');

(function () {
        /**
         * 缓存接口，定义了缓存的抽象函数。
         * 各缓存支持情况：
         * memcached - since 0.1.0
         * redis - since 0.1.0
         *
         * @class easynode.framework.cache.ICache
         * @extends easynode.GenericObject
         * @since 0.1.0
         * @author hujiabao
         * */

        var ICache = (function (_GenericObject) {
                _inherits(ICache, _GenericObject);

                function ICache() {
                        _classCallCheck(this, ICache);

                        return _possibleConstructorReturn(this, Object.getPrototypeOf(ICache).apply(this, arguments));
                }

                _createClass(ICache, [{
                        key: 'get',

                        /**
                         * 取值。
                         *
                         * @method get
                         * @param {String} key 键
                         * @param {Object} defaultValue 默认值，默认null
                         * @return {Object} 返回缓存的值
                         * @async
                         * @since 0.1.0
                         * @author hujiabao
                         * */
                        value: function get(key) {
                                var defaultValue = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

                                throw new Error('Abstract Method');
                        }

                        /**
                         * 缓存值。
                         *
                         * @method set
                         * @param {String} key 键
                         * @param {Object} value 值
                         * @param {int} ttl 缓存时间，单位，秒
                         * @async
                         * @since 0.1.0
                         * @author hujiabao
                         * */

                }, {
                        key: 'set',
                        value: function set(key, value, ttl) {
                                throw new Error('Abstract Method');
                        }

                        /**
                         * 重新设置缓存时间。
                         *
                         * @method set
                         * @param {String} key 键
                         * @param {int} ttl 缓存时间，单位，秒
                         * @async
                         * @since 0.1.0
                         * @author hujiabao
                         * */

                }, {
                        key: 'touch',
                        value: function touch(key, ttl) {
                                throw new Error('Abstract Method');
                        }

                        /**
                         * 从缓存中删除值。
                         *
                         * @method del
                         * @param {String} key 键
                         * @async
                         * @since 0.1.0
                         * @author hujiabao
                         * */

                }, {
                        key: 'del',
                        value: function del(key) {
                                throw new Error('Abstract Method');
                        }

                        /**
                         * 缓存情况统计。
                         *
                         * @method stat
                         * @return {easynode.framework.cache.CacheStat} 缓存实体
                         * @async
                         * @since 0.1.0
                         * @author hujiabao
                         * */

                }, {
                        key: 'stat',
                        value: function stat() {
                                throw new Error('Abstract Method');
                        }
                }, {
                        key: 'getClassName',
                        value: function getClassName() {
                                return EasyNode.namespace(__filename);
                        }
                }]);

                return ICache;
        })(GenericObject);

        module.exports = ICache;
})();