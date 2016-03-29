'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var IDataSource = using('easynode.framework.db.IDataSource');
var MysqlConnection = using('easynode.framework.db.MysqlConnection');
var mysql = require('mysql');
var thunkify = require('thunkify');

(function () {
        /**
         * Class MysqlDataSource
         *
         * @class easynode.framework.db.MysqlDataSource
         * @extends easynode.framework.db.IDataSource
         * @since 0.1.0
         * @author hujiabao
         * */

        var MysqlDataSource = function (_IDataSource) {
                _inherits(MysqlDataSource, _IDataSource);

                /**
                 * 构造函数。
                 *
                 * @method 构造函数
                 * @param {Object} opts Mysql连接池配置，对象原型：
                 *                      {
                 *                              host : '127.0.0.1',
                 *                              port : 3306',
                 *                              user : 'root',
                 *                              password : 'password of root',
                 *                              database : 'db,
                 *                              acquireTimeout : 10000,
                 *                              waitForConnections : true,        // true等待, false立即返回错误
                 *                              connectionLimit :  10,
                 *                              queueLimit : 10000
                 *                      }
                 * @since 0.1.0
                 * @author hujiabao
                 * */

                function MysqlDataSource() {
                        _classCallCheck(this, MysqlDataSource);

                        //调用super()后再定义子类成员。

                        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(MysqlDataSource).call(this));

                        _this._pool = null;
                        return _this;
                }

                _createClass(MysqlDataSource, [{
                        key: 'initialize',
                        value: function initialize(opts) {
                                var name = arguments.length <= 1 || arguments[1] === undefined ? 'mysql' : arguments[1];

                                assert(opts && opts.host && opts.user && opts.password && opts.database, 'Invalid mysql connection pool options');
                                this.name = name;
                                this._opts = opts;
                                this._pool = mysql.createPool(this._opts);
                        }
                }, {
                        key: 'destroy',
                        value: function destroy() {
                                var me = this;
                                return regeneratorRuntime.mark(function _callee() {
                                        var fnEnd;
                                        return regeneratorRuntime.wrap(function _callee$(_context) {
                                                while (1) {
                                                        switch (_context.prev = _context.next) {
                                                                case 0:
                                                                        fnEnd = thunkify(me._pool.end);
                                                                        _context.next = 3;
                                                                        return fnEnd.call(me._pool);

                                                                case 3:
                                                                case 'end':
                                                                        return _context.stop();
                                                        }
                                                }
                                        }, _callee, this);
                                });
                        }
                }, {
                        key: 'getConnection',
                        value: function getConnection() {
                                var me = this;
                                return regeneratorRuntime.mark(function _callee2() {
                                        var fnGetConnection, conn;
                                        return regeneratorRuntime.wrap(function _callee2$(_context2) {
                                                while (1) {
                                                        switch (_context2.prev = _context2.next) {
                                                                case 0:
                                                                        fnGetConnection = thunkify(me._pool.getConnection);

                                                                        EasyNode.DEBUG && logger.debug('get mysql connection...');
                                                                        _context2.next = 4;
                                                                        return fnGetConnection.call(me._pool);

                                                                case 4:
                                                                        conn = _context2.sent;
                                                                        return _context2.abrupt('return', new MysqlConnection(conn));

                                                                case 6:
                                                                case 'end':
                                                                        return _context2.stop();
                                                        }
                                                }
                                        }, _callee2, this);
                                });
                        }
                }, {
                        key: 'releaseConnection',
                        value: function releaseConnection(conn) {
                                //assert(conn.getClassName() == 'easynode.framework.db.MysqlConnection', 'Invalid argument');
                                assert(conn.rawConnection !== undefined, 'Invalid argument');
                                var me = this;
                                return regeneratorRuntime.mark(function _callee3() {
                                        return regeneratorRuntime.wrap(function _callee3$(_context3) {
                                                while (1) {
                                                        switch (_context3.prev = _context3.next) {
                                                                case 0:
                                                                        EasyNode.DEBUG && logger.debug('release mysql connection...');
                                                                        conn.rawConnection.release();

                                                                case 2:
                                                                case 'end':
                                                                        return _context3.stop();
                                                        }
                                                }
                                        }, _callee3, this);
                                });
                        }
                }, {
                        key: 'getName',
                        value: function getName() {
                                return this.name;
                        }
                }, {
                        key: 'getClassName',
                        value: function getClassName() {
                                return EasyNode.namespace(__filename);
                        }
                }]);

                return MysqlDataSource;
        }(IDataSource);

        module.exports = MysqlDataSource;
})();