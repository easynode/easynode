var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var GenericObject = using('easynode.GenericObject');
var S = require('string');
var ActionFactory = using('easynode.framework.mvc.ActionFactory');
var ActionExecutor = using('easynode.framework.mvc.ActionExecutor');
var KOAActionContext = using('easynode.framework.server.http.KOAActionContext');
var ActionResult = using('easynode.framework.mvc.ActionResult');

(function () {
        /**
         * Class KOADefaultRoutes
         *
         * @class easynode.framework.server.http.KOADefaultRoutes
         * @extends easynode.GenericObject
         * @since 0.1.0
         * @author hujiabao
         * */
        class KOADefaultRoutes extends GenericObject {
                /**
                 * 构造函数。
                 *
                 * @method 构造函数
                 * @since 0.1.0
                 * @author hujiabao
                 * */
                constructor(app, route, actionContextListener) {
                        super();
                        //调用super()后再定义子类成员。
                        this.app = app;
                        this.route = route;
                        assert(actionContextListener == null || typeof actionContextListener == 'object', 'Invalid argument');
                        this.actionContextListener = actionContextListener;
                }

                /**
                 * 增加路由。路由清单：<br>
                 *         <pre>
                 *               JSON API路由：                                  /json
                 *              RESTFUL API路由：                             /rest
                 *              UPLOAD FILE 路由：                           /upload
                 *         </pre>
                 *
                 * @method addRoutes
                 * @since 0.1.0
                 * @author hujiabao
                 * */
                addRoutes() {
                        this.addJSONAPIRoute();
                        this.addRestfulAPIRoute();
                        this.addUploadRoute();
                        this.addViewRoute();
                }

                /**
                 * 增加JSON API路由 /json。配置: easynode.servers.koa-HttpServer.routes.jsonAPI.uri指定一个不同的值。
                 *
                 * @method addJSONAPIRoute
                 * @since 0.1.0
                 * @author hujiabao
                 * */
                addJSONAPIRoute() {
                        var me = this;
                        var uri = EasyNode.config('easynode.servers.koa-HttpServer.routes.jsonAPI.uri', '/json');
                        var mName = EasyNode.config('easynode.servers.koa-HttpServer.routes.jsonAPI.moduleParamName', 'm');
                        var aName = EasyNode.config('easynode.servers.koa-HttpServer.routes.jsonAPI.actionParamName', 'a');
                        this.app.use(this.route.all(uri, function * () {
                                var m = S(this.parameter.param(mName, 'all', false)).trim().toString();
                                var a = S(this.parameter.param(aName, 'all', false)).trim().toString();
                                if (m.length > 0 && a.length > 0) {
                                        yield me._execAction(m, a, this);
                                }
                                else {
                                        this.throw(403);
                                }
                        }));
                }

                /**
                 * 增加Restful API路由 /rest。配置: easynode.servers.koa-HttpServer.routes.action.uri指定一个不同的值。
                 *
                 * @method addJSONAPIRoute
                 * @since 0.1.0
                 * @author hujiabao
                 * */
                addRestfulAPIRoute() {
                        var me = this;
                        var restfulURI = EasyNode.config('easynode.servers.koa-HttpServer.routes.action.uri', '/action');
                        this.app.use(this.route.all(restfulURI + '/:m/:a', function * (m, a) {
                                m = S(m).trim().toString();
                                a = S(a).trim().toString();
                                if (m.length > 0 && a.length > 0) {
                                        yield me._execAction(m, a, this);
                                }
                                else {
                                        this.throw(403);
                                }
                        }));
                }

                /**
                 * 增加Restful API路由 /rest。配置: easynode.servers.koa-HttpServer.routes.upload.uri指定一个不同的值。
                 * <h5>可通过配置项：easynode.servers.koa-HttpServer.routes.upload.enabled=false关闭上传文件路由。</h5>
                 *
                 * @method addJSONAPIRoute
                 * @since 0.1.0
                 * @author hujiabao
                 * */
                addUploadRoute() {
                        if (S(EasyNode.config('easynode.servers.koa-HttpServer.routes.upload.enabled', 'true')).toBoolean()) {
                                var me = this;
                                var uploadURI = EasyNode.config('easynode.servers.koa-HttpServer.routes.upload.uri', '/upload');
                                this.app.use(this.route.post(uploadURI, function * () {
                                        this.type = 'json';
                                        this.body = yield me._execUpload(this);
                                }));
                        }
                }

                /**
                 * 增加view路由 /v/$module/$action[.mst|.jade|.ejs]?_plugin_=xxx。
                 * $module，Action模块名
                 * $action，Action名
                 * .mst|.jade|.ejs，渲染模板，默认.mst
                 * _plugin_，插件名，如果指定，将使用插件下的view下的模板文件渲染
                 *
                 * @method addViewRoute
                 * @since 0.1.0
                 * @author hujiabao
                 * */
                addViewRoute() {
                        var me = this;
                        var viewURI = EasyNode.config('easynode.servers.koa-HttpServer.routes.view.uri', '/v');
                        this.app.use(this.route.all(viewURI + '/:m/:a', function * (m, a) {
                                m = S(m).trim().toString();
                                a = S(a).trim().toString();
                                a = a.split('.')[0];
                                var ext = a.split('.')[1] || 'mst';
                                var templateFile = m + '/' + a + '.' + ext;
                                var plugin = this.parameter.param('_plugin_');
                                EasyNode.DEBUG && logger.debug(`view template file -> [${templateFile}], plugin [${plugin || 'NONE'}]`);
                                if (m.length > 0 && a.length > 0) {
                                        var opts =  {
                                                templateFile: templateFile
                                        };
                                        if(plugin) {
                                                opts.templateDir = plugin + '/' + EasyNode.config('easynode.framework.mvc.view.dir', 'views/');
                                        }
                                        yield me._execAction(m, a, opts, this);
                                }
                                else {
                                        this.throw(403);
                                }

                        }));
                }

                /**
                 * 上传文件。
                 *
                 * @method _execUpload
                 * @param {koa} ctx koa middleware ctx
                 * @private
                 * @since 0.1.0
                 * @author hujiabao
                 * */
                _execUpload(ctx) {
                        return function * () {
                                var r = ActionResult.createSuccessResult();
                                var files = ctx.parameter.fileNames();
                                var retO = {};
                                for(var i = 0;i<files.length;i++) {
                                        var f = yield ctx.parameter.saveFile(files[i]);
                                        if(f) {
                                                retO[files[i]] = f;
                                        }
                                }
                                r.setResult(retO);
                                return r;
                        };
                }

                /**
                 * 执行一个Action。
                 *
                 * @method _execAction
                 * @param {String} m 模块名
                 * @param {String} a Action名
                 * @param {Object} opts 执行Action选项
                 * @param {koa} ctx koa middleware ctx
                 * @private
                 * @since 0.1.0
                 * @author hujiabao
                 * */
                _execAction(m, a, opts, ctx) {
                        if (arguments.length == 3) {
                                ctx = opts;
                                opts = {};
                        }
                        opts = opts || {};
                        var me = this;
                        return function * () {
                                var actionContext = new KOAActionContext(m, a, ctx);
                                if (me.actionContextListener && me.actionContextListener.onCreate) {
                                        yield me.actionContextListener.onCreate(actionContext);
                                }
                                var executeResult = null;
                                var executor = new ActionExecutor(m, a, me.actionContextListener);
                                try {
                                        executeResult = yield executor.execute(actionContext, opts);
                                } catch (e) {
                                        if (me.actionContextListener && me.actionContextListener.onError) {
                                                EasyNode.DEBUG && logger.debug('Call action context listener "onError()"...');
                                                yield me.actionContextListener.onError(actionContext, e);
                                        }
                                        else {
                                                logger.error(e.stack);
                                        }
                                        if (e.executeResult) {
                                                executeResult = e.executeResult;
                                        }
                                }
                                if (executeResult) {
                                        ctx.action = {
                                                m: m,
                                                a: a,
                                                'result-code': executeResult.actionResult.code
                                        };
                                        if (executeResult.action) {
                                                var d = new Date();
                                                var o = executeResult.action.getView().render(executeResult.actionResult, executeResult.action.getViewOptions());
                                                ctx.renderCost = new Date() - d;
                                                ctx.type = executeResult.action.getView().getContentType();
                                                ctx.body = o;
                                        }
                                        else {
                                                ctx.type = 'json';
                                                ctx.body = executeResult.actionResult.toJSON();
                                        }
                                }
                                else {
                                        var r = ActionResult.createErrorResult();
                                        ctx.action = {
                                                m: m,
                                                a: a,
                                                'result-code': r.code
                                        };
                                        ctx.type = 'json';
                                        ctx.body = r;
                                }
                                if (me.actionContextListener && me.actionContextListener.onDestroy) {
                                        yield me.actionContextListener.onDestroy(actionContext);
                                }
                        };
                }

                getClassName() {
                        return EasyNode.namespace(__filename);
                }
        }

        module.exports = KOADefaultRoutes;
})();