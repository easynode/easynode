'use strict';

require('../lib/EasyNode.js');
var util = require('util');
var co = require('co');
var fs = require('fs');

var logger = using('easynode.framework.Logger').getLogger();

(function main() {
        (function _handleUncaughtException() {
                process.on('uncaughtException', function (err) {
                        logger.error('unhandled error : ');
                        logger.error(err);
                        if (err.code == 'EADDRINUSE') {
                                process.exit(-1);
                        }
                });
        })();

        function _onError(err) {
                logger.error(err);
        }

        co(regeneratorRuntime.mark(function _callee3() {
                var PROJECT, mainClassName, AOP, BeanFactory, ActionFactory, KOAHttpServer, httpServer, EasyNodePlugin, PluginLoadContext, ds, cache, mq, projectLoadCtx, MainClass;
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                        while (1) {
                                switch (_context3.prev = _context3.next) {
                                        case 0:
                                                //通过config-files和src-dirs传入Source目录和配置文件清单
                                                EasyNode.addConfigFile.apply(null, (EasyNode.arg('config-files') || '').split(','));
                                                EasyNode.addSourceDirectory.apply(null, (EasyNode.arg('src-dirs') || '').split(','));
                                                EasyNode.DEBUG = EasyNode.config('debug-output', 'true') !== 'false';
                                                PROJECT = EasyNode.arg('project');
                                                //加载项目src目录和配置文件

                                                if (PROJECT) {
                                                        logger.info('loading project [' + PROJECT + '] source and configurations...');
                                                        EasyNode.addSourceDirectory('projects/' + PROJECT + '/src');
                                                        if (fs.existsSync(EasyNode.real('projects/' + PROJECT + '/etc/' + PROJECT + '.conf'))) {
                                                                EasyNode.addConfigFile('projects/' + PROJECT + '/etc/' + PROJECT + '.conf');
                                                        }
                                                        if (fs.existsSync(EasyNode.real('projects/' + PROJECT + '/etc/i18n'))) {
                                                                EasyNode.addi18nDirectory('projects/' + PROJECT + '/etc/i18n');
                                                        }
                                                }
                                                mainClassName = EasyNode.arg('main-class');

                                                if (mainClassName) {
                                                        _context3.next = 35;
                                                        break;
                                                }

                                                //启动AOP
                                                AOP = using('easynode.framework.aop.AOP');

                                                AOP.initialize('etc/easynode-aop.json');
                                                //启动BeanFactory
                                                BeanFactory = using('easynode.framework.BeanFactory');
                                                _context3.next = 12;
                                                return BeanFactory.initialize('etc/easynode-beans.json');

                                        case 12:
                                                //加载Actions，通常是空的
                                                ActionFactory = using('easynode.framework.mvc.ActionFactory');
                                                _context3.next = 15;
                                                return ActionFactory.initialize('etc/easynode-actions.json');

                                        case 15:

                                                //启动HTTP Server
                                                KOAHttpServer = using('easynode.framework.server.http.KOAHttpServer');
                                                httpServer = new KOAHttpServer();
                                                //加载HTTP目录

                                                if (PROJECT) {
                                                        logger.info('add project web directory projects/' + PROJECT + '/www/');
                                                        httpServer.addWebDirs('projects/' + PROJECT + '/www/');
                                                }
                                                //加载插件
                                                EasyNodePlugin = using('easynode.framework.plugin.EasyNodePlugin');
                                                PluginLoadContext = using('easynode.framework.plugin.PluginLoadContext');
                                                _context3.next = 22;
                                                return EasyNodePlugin.load(new PluginLoadContext({
                                                        koaHttpServer: httpServer,
                                                        datasource: BeanFactory.get('datasource'),
                                                        database: EasyNode.config('app.datasource.database'),
                                                        cache: BeanFactory.get('cache'),
                                                        mq: BeanFactory.get('mq')
                                                }));

                                        case 22:
                                                //Http Session
                                                httpServer.setSessionStorage(BeanFactory.get('sessionStorage').type, BeanFactory.get('sessionStorage').opts);
                                                //注入ActionContext参数
                                                ds = BeanFactory.get('datasource');
                                                cache = BeanFactory.get('cache');
                                                mq = BeanFactory.get('mq');

                                                httpServer.setActionContextListener({
                                                        onActionReady: function onActionReady(ctx) {
                                                                return regeneratorRuntime.mark(function _callee() {
                                                                        return regeneratorRuntime.wrap(function _callee$(_context) {
                                                                                while (1) {
                                                                                        switch (_context.prev = _context.next) {
                                                                                                case 0:
                                                                                                        ctx.setQueue(mq);
                                                                                                        ctx.setCache(cache);

                                                                                                        if (!(ctx.getAction().datasourceSupport() === true)) {
                                                                                                                _context.next = 10;
                                                                                                                break;
                                                                                                        }

                                                                                                        _context.t0 = ctx;
                                                                                                        _context.next = 6;
                                                                                                        return ds.getConnection();

                                                                                                case 6:
                                                                                                        _context.t1 = _context.sent;

                                                                                                        _context.t0.setConnection.call(_context.t0, _context.t1);

                                                                                                        _context.next = 10;
                                                                                                        return ctx.getConnection().beginTransaction();

                                                                                                case 10:
                                                                                                case 'end':
                                                                                                        return _context.stop();
                                                                                        }
                                                                                }
                                                                        }, _callee, this);
                                                                });
                                                        },
                                                        onDestroy: function onDestroy(ctx) {
                                                                return regeneratorRuntime.mark(function _callee2() {
                                                                        return regeneratorRuntime.wrap(function _callee2$(_context2) {
                                                                                while (1) {
                                                                                        switch (_context2.prev = _context2.next) {
                                                                                                case 0:
                                                                                                        if (!(ctx.getAction() && ctx.getAction().datasourceSupport() === true)) {
                                                                                                                _context2.next = 6;
                                                                                                                break;
                                                                                                        }

                                                                                                        if (!ctx.getConnection()) {
                                                                                                                _context2.next = 6;
                                                                                                                break;
                                                                                                        }

                                                                                                        _context2.next = 4;
                                                                                                        return ctx.getConnection().commit();

                                                                                                case 4:
                                                                                                        _context2.next = 6;
                                                                                                        return ds.releaseConnection(ctx.getConnection());

                                                                                                case 6:
                                                                                                case 'end':
                                                                                                        return _context2.stop();
                                                                                        }
                                                                                }
                                                                        }, _callee2, this);
                                                                });
                                                        }
                                                });

                                                projectLoadCtx = {
                                                        koaHttpServer: httpServer,
                                                        datasource: ds
                                                };

                                                if (!PROJECT) {
                                                        _context3.next = 31;
                                                        break;
                                                }

                                                _context3.next = 31;
                                                return require('../projects/' + PROJECT + '/src/ProjectEntry.js').launch(projectLoadCtx);

                                        case 31:
                                                _context3.next = 33;
                                                return httpServer.start();

                                        case 33:
                                                _context3.next = 45;
                                                break;

                                        case 35:
                                                if (!PROJECT) {
                                                        _context3.next = 38;
                                                        break;
                                                }

                                                _context3.next = 38;
                                                return require('../projects/' + PROJECT + '/src/ProjectEntry.js').launch(projectLoadCtx);

                                        case 38:
                                                MainClass = using(mainClassName);

                                                if (!(typeof MainClass.main == 'function')) {
                                                        _context3.next = 44;
                                                        break;
                                                }

                                                _context3.next = 42;
                                                return MainClass.main.call();

                                        case 42:
                                                _context3.next = 45;
                                                break;

                                        case 44:
                                                logger.error('main class [' + mainClassName + '] has no executable generator main*()');

                                        case 45:
                                        case 'end':
                                                return _context3.stop();
                                }
                        }
                }, _callee3, this);
        })).catch(_onError);
})();
