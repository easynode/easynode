var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var GenericObject = using('easynode.GenericObject');
var S = require('string');
var thunkify = require('thunkify');
var Routes = using('netease.smartwatch.backend.routes.Routes');
var MySqlDataSource = using('easynode.framework.db.MysqlDataSource');
var Package = using('netease.smartwatch.backend.models.Package');
var Program = using('netease.smartwatch.backend.models.Program');
var PackageUpdate = using('netease.smartwatch.backend.models.PackageUpdate');

var mysqlOptions = {
    host: '218.205.113.98',
    port: 3306,
    user: 'scard_pro',
    password: 'scard_pro',
    database: 'scard_pro',
    acquireTimeout: '10000',
    waitForConnections : true,
    connectionLimit :  10,
    queueLimit : 10000
};



(function () {
    /**
     * Class Main
     *
     * @class netease.smartwatch.backend.Main
     * @extends easynode.GenericObject
     * @since 0.1.0
     * @author allen.hu
     * */
    class Main extends GenericObject
    {
        /**
         * 构造函数。
         *
         * @method 构造函数
         * @since 0.1.0
         * @author allen.hu
         * */
        constructor()
        {
            super();
            //调用super()后再定义子类成员。
        }

        static * main(){
            //Database source, connection pool
            var ds = new MySqlDataSource();
            ds.initialize(mysqlOptions);

            //数据库查询
            var conn = yield ds.getConnection();
            var sql = 'SELECT max(code)  as maxCode FROM watch_package';
            var args = {};
            var arr = yield conn.execQuery(sql, args = {});
            yield ds.releaseConnection(conn);

            //conn = yield ds.getConnection();
            //sql = 'SELECT id,version FROM watch_package WHERE id < #id# order by code DESC limit 1';
            //var args = {id:312};
            //let lessPkgs =  yield conn.execQuery(sql, args);
            //console.dir(lessPkgs);
            //yield ds.releaseConnection(conn);

            //HTTP Server
            var KOAHttpServer =  using('easynode.framework.server.http.KOAHttpServer');
            var httpPort = S(EasyNode.config('http.server.port','7000')).toInt();
            var httpServer = new KOAHttpServer(httpPort);

            httpServer.ds = ds;
            httpServer.ds.conn = conn;
            //设置ContextHook,
            httpServer.setActionContextListener({
                onCreate: function (ctx) {
                    console.log("onCreate");
                    return function * () {
                        ctx.setConnection(yield ds.getConnection());
                        yield ctx.getConnection().beginTransaction();
                    };
                },
                onDestroy: function (ctx) {
                    console.log("onDestroy");
                    return function * () {
                        yield ctx.getConnection().commit();
                        yield ds.releaseConnection(ctx.getConnection());
                    };
                },

                onError: function (ctx, err) {
                    console.log("onError");
                    return function * () {
                        yield ctx.getConnection().rollback();
                        !err.executeResult  && logger.error(err.stack);
                    };
                }
            });

            httpServer.name = EasyNode.config('http.server.name','SmartWatch-Backend-Service');
            Routes.defineRoutes(httpServer);
            yield httpServer.start();
        }

        getClassName()
        {
            return EasyNode.namespace(__filename);
        }
    }

    module.exports = Main;
})();