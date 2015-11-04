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

        class KOAMemorySessionStorage extends GenericObject {
                /**
                 * 构造函数。
                 *
                 * @method 构造函数
                 * @since 0.1.0
                 * @author hujiabao
                 * */
                constructor(options) {
                        super();
                        //调用super()后再定义子类成员。
                        this._options = options || {};
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
                get (sid) {
                        return function * () {
                                return _sessions[sid];
                        };
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
                set (sid, sess, ttl) {
                        return function * () {
                                _sessions[sid] = sess;
                        };
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
                destroy (sid) {
                        return function * () {
                                delete _sessions[sid];
                        };
                }

                getClassName() {
                        return EasyNode.namespace(__filename);
                }
        }

        module.exports = KOAMemorySessionStorage;
})();