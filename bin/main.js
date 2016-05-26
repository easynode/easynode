require('../src/EasyNode.js');
var util = require('util');
var co = require('co');
var fs = require('fs');

const logger = using('easynode.framework.Logger').getLogger();

(function main(){
        (function _handleUncaughtException () {
                process.on('uncaughtException', function(err){
                        logger.error('unhandled error : ');
                        logger.error(err);
                        if(err.code == 'EADDRINUSE') {
                                process.exit(-1);
                        }
                });
        })();

        function _onError(err) {
                logger.error(err);
        }

        co(function * (){
                //通过config-files和src-dirs传入Source目录和配置文件清单
                EasyNode.addConfigFile.apply(null, (EasyNode.arg('config-files') || '').split(','));
                EasyNode.addSourceDirectory.apply(null, (EasyNode.arg('src-dirs') || '').split(','));
                EasyNode.DEBUG = (EasyNode.config('debug-output', 'true') !== 'false');
                const PROJECT = EasyNode.arg('project');
                //加载项目src目录和配置文件
                if(PROJECT) {
                        logger.info(`loading project [${PROJECT}] source and configurations...`);
                        EasyNode.addSourceDirectory(`projects/${PROJECT}/src`);
                        if(fs.existsSync(EasyNode.real(`projects/${PROJECT}/etc/${PROJECT}.conf`))) {
                                EasyNode.addConfigFile(`projects/${PROJECT}/etc/${PROJECT}.conf`);
                        }
                        if(fs.existsSync(EasyNode.real(`projects/${PROJECT}/etc/i18n`))) {
                                EasyNode.addi18nDirectory(`projects/${PROJECT}/etc/i18n`);
                        }
                }
                var mainClassName = EasyNode.arg('main-class');
                if(!mainClassName) {
                        //启动AOP
                        var AOP = using('easynode.framework.aop.AOP');
                        AOP.initialize('etc/easynode-aop.json');
                        //启动BeanFactory
                        var BeanFactory = using('easynode.framework.BeanFactory');
                        yield BeanFactory.initialize('etc/easynode-beans.json');
                        //加载Actions，通常是空的
                        var ActionFactory = using('easynode.framework.mvc.ActionFactory');
                        yield ActionFactory.initialize('etc/easynode-actions.json');

                        //启动HTTP Server
                        var KOAHttpServer = using('easynode.framework.server.http.KOAHttpServer');
                        var httpServer = new KOAHttpServer();
                        //加载HTTP目录
                        if(PROJECT) {
                                logger.info(`add project web directory projects/${PROJECT}/www/`);
                                httpServer.addWebDirs(`projects/${PROJECT}/www/`);
                        }
                        //加载插件
                        var EasyNodePlugin = using('easynode.framework.plugin.EasyNodePlugin');
                        var PluginLoadContext = using('easynode.framework.plugin.PluginLoadContext');
                        yield EasyNodePlugin.load(new PluginLoadContext({
                                koaHttpServer : httpServer,
                                datasource : BeanFactory.get('datasource'),
                                database : EasyNode.config('app.datasource.database'),
                                cache : BeanFactory.get('cache'),
                                mq : BeanFactory.get('mq')
                        }));
                        //Http Session
                        httpServer.setSessionStorage(BeanFactory.get('sessionStorage').type, BeanFactory.get('sessionStorage').opts);
                        //注入ActionContext参数
                        var ds = BeanFactory.get('datasource');
                        var cache = BeanFactory.get('cache');
                        var mq = BeanFactory.get('mq');
                        httpServer.setActionContextListener({
                                onActionReady : function (ctx) {
                                        return function * () {
                                                ctx.setQueue(mq);
                                                ctx.setCache(cache);
                                                if(ctx.getAction().datasourceSupport() === true) {
                                                        ctx.setConnection(yield ds.getConnection());
                                                        yield ctx.getConnection().beginTransaction();
                                                }
                                        };
                                },
                                onDestroy : function (ctx) {
                                        return function * () {
                                                if(ctx.getAction() && ctx.getAction().datasourceSupport() === true) {
                                                        if(ctx.getConnection()) {
                                                                yield ctx.getConnection().commit();
                                                                yield ds.releaseConnection(ctx.getConnection());
                                                        }
                                                }
                                        };
                                }
                        });

                        var projectLoadCtx = {
                                koaHttpServer : httpServer,
                                datasource : ds
                        };

                        if(PROJECT) {
                                yield require(`../projects/${PROJECT}/src/ProjectEntry.js`).launch(projectLoadCtx);
                        }

                        yield httpServer.start();
                }
                else {
                        if(PROJECT) {
                                yield require(`../projects/${PROJECT}/src/ProjectEntry.js`).launch(projectLoadCtx);
                        }
                        var MainClass = using(mainClassName);
                        if(typeof MainClass.main == 'function') {
                                yield MainClass.main.call();
                        }
                        else {
                                logger.error(`main class [${mainClassName}] has no executable generator main*()`);
                        }
                }
        }).catch(_onError);
})();