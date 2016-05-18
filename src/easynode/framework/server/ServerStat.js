var logger = using('easynode.framework.Logger').forFile(__filename);
var GenericObject = using('easynode.GenericObject');

(function () {
        /**
         * 服务状态统计实体类。
         *
         * @class easynode.framework.server.ServerStat
         * @extends easynode.GenericObject
         * @since 0.1.0
         * @author hujiabao
         * */
        class ServerStat extends GenericObject {
                /**
                 * 构造函数。
                 *
                 * @method 构造函数
                 * @since 0.1.0
                 * @author hujiabao
                 * */
                constructor() {
                        super();
                        //调用super()后再定义子类成员。

                        /**
                         * 服务启动时间, 毫秒数
                         * @property uptime
                         * @type int
                         * */
                        this.uptime = 0;

                        /**
                         * 当前连接数
                         * @property connections
                         * @type int
                         * */
                        this.sessions = 0;

                        /**
                         * 服务自启动以来的连接数
                         * @property totalSessions
                         * @type int
                         * */
                        this.totalSessions = 0;

                        /**
                         * 服务自启动以来的总事务数
                         * @property transactions
                         * @type int
                         * */
                         this.transactions = 0;

                        /**
                         * 事务的最大耗时
                         * @property maxCost
                         * @type int
                         * */
                        this.maxCost = 0;

                        /**
                         * 事务的最小耗时
                         * @property maxCost
                         * @type int
                         * */
                        this.minCost = 0;

                        /**
                         * 事务总耗时
                         * @property totalCost
                         * @type int
                         * */
                        this.totalCost = 0;
                }

                getClassName () {
                        return EasyNode.namespace(__filename);
                }
        }

        module.exports = ServerStat;
})();