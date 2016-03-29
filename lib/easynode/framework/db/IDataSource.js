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
         * 数据源接口，定义了数据源的初始化、销毁、获取连接，释放连接等抽象函数。
         * 实现类：easynode.framework.db.MysqlDataSource
         *
         * @class easynode.framework.db.IDataSource
         * @extends easynode.GenericObject
         * @since 0.1.0
         * @author hujiabao
         * */

        var IDataSource = (function (_GenericObject) {
                _inherits(IDataSource, _GenericObject);

                function IDataSource() {
                        _classCallCheck(this, IDataSource);

                        return _possibleConstructorReturn(this, Object.getPrototypeOf(IDataSource).apply(this, arguments));
                }

                _createClass(IDataSource, [{
                        key: 'getName',

                        /**
                         * 获取数据源名称
                         *
                         * @method getName
                         * @return {String} 数据源名称
                         * @abstract
                         * @since 0.1.0
                         * @author hujiabao
                         * */
                        value: function getName() {
                                throw new Error('Abstract Method');
                        }

                        /**
                         * 初始化数据源
                         *
                         * @method initialize
                         * @abstract
                         * @since 0.1.0
                         * @author hujiabao
                         * */

                }, {
                        key: 'initialize',
                        value: function initialize() {
                                throw new Error('Abstract Method');
                        }

                        /**
                         * 销毁数据源
                         *
                         * @method destroy
                         * @async
                         * @abstract
                         * @since 0.1.0
                         * @author hujiabao
                         * */

                }, {
                        key: 'destroy',
                        value: function destroy() {
                                throw new Error('Abstract Method');
                        }

                        /**
                         * 从数据源中获取一个连接，通常数据源是一个数据库连接池
                         *
                         * @method getConnection
                         * @return {easynode.framework.db.IConnection} 数据源连接实例
                         * @async
                         * @abstract
                         * @since 0.1.0
                         * @author hujiabao
                         * */

                }, {
                        key: 'getConnection',
                        value: function getConnection() {
                                throw new Error('Abstract Method');
                        }

                        /**
                         * 释放一个连接。
                         *
                         * @method releaseConnection
                         * @param {easynode.framework.db.IConnection} 数据源连接实例，从getConnection取得。
                         * @async
                         * @abstract
                         * @since 0.1.0
                         * @author hujiabao
                         * */

                }, {
                        key: 'releaseConnection',
                        value: function releaseConnection(conn) {
                                throw new Error('Abstract Method');
                        }
                }, {
                        key: 'getClassName',
                        value: function getClassName() {
                                return EasyNode.namespace(__filename);
                        }
                }]);

                return IDataSource;
        })(GenericObject);

        module.exports = IDataSource;
})();