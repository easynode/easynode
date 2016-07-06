var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var GenericObject = using('easynode.GenericObject');
var _ = require('underscore');

(function() {
        /**
         * 插件加载环境类PluginLoadContext
         *
         * @class easynode.framework.plugin.PluginLoadContext
         * @extends easynode.GenericObject
         * @since 0.1.0
         * @author hujiabao
         * */
  class PluginLoadContext extends GenericObject {
                /**
                 * 构造函数。
                 *
                 * @method 构造函数
                 * @param {Object} opts 选项，参考PluginLoadContext的成员。
                 * @since 0.1.0
                 * @author hujiabao
                 * */
    constructor(opts) {
      super();
                        // 调用super()后再定义子类成员。

                        /**
                         * 数据源
                         *
                         * @property datasource
                         * @type {easynode.framework.db.IDataSource}
                         * @default null
                         * @since 0.1.0
                         * @author hujiabao
                         * */
      this.datasource = null;

                        /**
                         * 数据库名
                         *
                         * @property database
                         * @type {String}
                         * @default null
                         * @since 0.1.0
                         * @author hujiabao
                         * */
      this.database = null;

                        /**
                         * 缓存
                         *
                         * @property cache
                         * @type {easynode.framework.cache.ICache}
                         * @default null
                         * @since 0.1.0
                         * @author hujiabao
                         * */
      this.cache = null;

                        /**
                         * 队列实例
                         *
                         * @property mq
                         * @type {easynode.framework.mq.IQueue}
                         * @default null
                         * @since 0.1.0
                         * @author hujiabao
                         * */
      this.mq = null;

                        /**
                         * KOAHttpServer
                         *
                         * @property koaHttpServer
                         * @type {easynode.framework.server.http.KOAHttpServer}
                         * @default null
                         * @since 0.1.0
                         * @author hujiabao
                         * */
      this.koaHttpServer = null;

      this.tcpServer = null;

      this.udpServer = null;

      this.wsServer = null;

      _.extend(this, opts || {});
    }

    getClassName() {
      return EasyNode.namespace(__filename);
    }
        }

  module.exports = PluginLoadContext;
})();
