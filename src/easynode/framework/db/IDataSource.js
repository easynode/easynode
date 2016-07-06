var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var GenericObject = using('easynode.GenericObject');

(function() {
    /**
     * 数据源接口，定义了数据源的初始化、销毁、获取连接，释放连接等抽象函数。
     * 实现类：easynode.framework.db.MysqlDataSource
     *
     * @class easynode.framework.db.IDataSource
     * @extends easynode.GenericObject
     * @since 0.1.0
     * @author hujiabao
     * */
    class IDataSource extends GenericObject {

        /**
         * 获取数据源名称
         *
         * @method getName
         * @return {String} 数据源名称
         * @abstract
         * @since 0.1.0
         * @author hujiabao
         * */
        getName() {
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
        initialize() {
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
        destroy() {
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
        getConnection() {
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
        releaseConnection(conn) {
          throw new Error('Abstract Method');
        }

        getClassName() {
          return EasyNode.namespace(__filename);
        }

   }

  module.exports = IDataSource;
})();
