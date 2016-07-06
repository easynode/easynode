var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var IDataSource = using('easynode.framework.db.IDataSource');
var MysqlConnection = using('easynode.framework.db.MysqlConnection');
var mysql = require('mysql');
var thunkify = require('thunkify');

(function() {

  /**
   * Class MysqlDataSource
   *
   * @class easynode.framework.db.MysqlDataSource
   * @extends easynode.framework.db.IDataSource
   * @since 0.1.0
   * @author hujiabao
   * */
  class MysqlDataSource extends IDataSource {

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
    constructor() {
      super();
      // 调用super()后再定义子类成员。
      this._pool = null;
    }

    initialize(opts, name = 'mysql') {
      assert(opts && opts.host && opts.user && opts.password && opts.database, 'Invalid mysql connection pool options');
      this.name = name;
      this._opts = opts;
      this._pool = mysql.createPool(this._opts);
    }

    destroy() {
      var me = this;
      return function *() {
        var fnEnd = thunkify(me._pool.end);
        yield fnEnd.call(me._pool);
      };
    }

    getConnection() {
      var me = this;
      return function *() {
        var fnGetConnection = thunkify(me._pool.getConnection);
        EasyNode.DEBUG && logger.debug('get mysql connection...');
        var conn = yield fnGetConnection.call(me._pool);
        return new MysqlConnection(conn);
      };
    }

    releaseConnection(conn) {
      // assert(conn.getClassName() == 'easynode.framework.db.MysqlConnection', 'Invalid argument');
      assert(conn.rawConnection !== undefined, 'Invalid argument');
      var me = this;
      return function *() {
        EasyNode.DEBUG && logger.debug('release mysql connection...');
        conn.rawConnection.release();
      };
    }

    getName() {
      return this.name;
    }

    getClassName() {
      return EasyNode.namespace(__filename);
    }

  }

  module.exports = MysqlDataSource;
})();
