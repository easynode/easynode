'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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

        var KOADefaultRoutes = (function (_GenericObject) {
                _inherits(KOADefaultRoutes, _GenericObject);

                /**
                 * 构造函数。
                 *
                 * @method 构造函数
                 * @since 0.1.0
                 * @author hujiabao
                 * */

                function KOADefaultRoutes(app, route, actionContextListener) {
                        _classCallCheck(this, KOADefaultRoutes);

                        //调用super()后再定义子类成员。

                        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(KOADefaultRoutes).call(this));

                        _this.app = app;
                        _this.route = route;
                        assert(actionContextListener == null || (typeof actionContextListener === 'undefined' ? 'undefined' : _typeof(actionContextListener)) == 'object', 'Invalid argument');
                        _this.actionContextListener = actionContextListener;
                        return _this;
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

                _createClass(KOADefaultRoutes, [{
                        key: 'addRoutes',
                        value: function addRoutes() {
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

                }, {
                        key: 'addJSONAPIRoute',
                        value: function addJSONAPIRoute() {
                                var me = this;
                                var uri = EasyNode.config('easynode.servers.koa-HttpServer.routes.jsonAPI.uri', '/json');
                                var mName = EasyNode.config('easynode.servers.koa-HttpServer.routes.jsonAPI.moduleParamName', 'm');
                                var aName = EasyNode.config('easynode.servers.koa-HttpServer.routes.jsonAPI.actionParamName', 'a');
                                this.app.use(this.route.all(uri, regeneratorRuntime.mark(function _callee() {
                                        var m, a;
                                        return regeneratorRuntime.wrap(function _callee$(_context) {
                                                while (1) {
                                                        switch (_context.prev = _context.next) {
                                                                case 0:
                                                                        m = S(this.parameter.param(mName, 'all', false)).trim().toString();
                                                                        a = S(this.parameter.param(aName, 'all', false)).trim().toString();

                                                                        if (!(m.length > 0 && a.length > 0)) {
                                                                                _context.next = 7;
                                                                                break;
                                                                        }

                                                                        _context.next = 5;
                                                                        return me._execAction(m, a, this);

                                                                case 5:
                                                                        _context.next = 8;
                                                                        break;

                                                                case 7:
                                                                        this.throw(403);

                                                                case 8:
                                                                case 'end':
                                                                        return _context.stop();
                                                        }
                                                }
                                        }, _callee, this);
                                })));
                        }

                        /**
                         * 增加Restful API路由 /rest。配置: easynode.servers.koa-HttpServer.routes.action.uri指定一个不同的值。
                         *
                         * @method addJSONAPIRoute
                         * @since 0.1.0
                         * @author hujiabao
                         * */

                }, {
                        key: 'addRestfulAPIRoute',
                        value: function addRestfulAPIRoute() {
                                var me = this;
                                var restfulURI = EasyNode.config('easynode.servers.koa-HttpServer.routes.action.uri', '/action');
                                this.app.use(this.route.all(restfulURI + '/:m/:a', regeneratorRuntime.mark(function _callee2(m, a) {
                                        return regeneratorRuntime.wrap(function _callee2$(_context2) {
                                                while (1) {
                                                        switch (_context2.prev = _context2.next) {
                                                                case 0:
                                                                        m = S(m).trim().toString();
                                                                        a = S(a).trim().toString();

                                                                        if (!(m.length > 0 && a.length > 0)) {
                                                                                _context2.next = 7;
                                                                                break;
                                                                        }

                                                                        _context2.next = 5;
                                                                        return me._execAction(m, a, this);

                                                                case 5:
                                                                        _context2.next = 8;
                                                                        break;

                                                                case 7:
                                                                        this.throw(403);

                                                                case 8:
                                                                case 'end':
                                                                        return _context2.stop();
                                                        }
                                                }
                                        }, _callee2, this);
                                })));
                        }

                        /**
                         * 增加Restful API路由 /rest。配置: easynode.servers.koa-HttpServer.routes.upload.uri指定一个不同的值。
                         * <h5>可通过配置项：easynode.servers.koa-HttpServer.routes.upload.enabled=false关闭上传文件路由。</h5>
                         *
                         * @method addJSONAPIRoute
                         * @since 0.1.0
                         * @author hujiabao
                         * */

                }, {
                        key: 'addUploadRoute',
                        value: function addUploadRoute() {
                                if (S(EasyNode.config('easynode.servers.koa-HttpServer.routes.upload.enabled', 'true')).toBoolean()) {
                                        var me = this;
                                        var uploadURI = EasyNode.config('easynode.servers.koa-HttpServer.routes.upload.uri', '/upload');
                                        this.app.use(this.route.post(uploadURI, regeneratorRuntime.mark(function _callee3() {
                                                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                                                        while (1) {
                                                                switch (_context3.prev = _context3.next) {
                                                                        case 0:
                                                                                this.type = 'json';
                                                                                _context3.next = 3;
                                                                                return me._execUpload(this);

                                                                        case 3:
                                                                                this.body = _context3.sent;

                                                                        case 4:
                                                                        case 'end':
                                                                                return _context3.stop();
                                                                }
                                                        }
                                                }, _callee3, this);
                                        })));
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

                }, {
                        key: 'addViewRoute',
                        value: function addViewRoute() {
                                var me = this;
                                var viewURI = EasyNode.config('easynode.servers.koa-HttpServer.routes.view.uri', '/v');
                                this.app.use(this.route.all(viewURI + '/:m/:a', regeneratorRuntime.mark(function _callee4(m, a) {
                                        var ext, templateFile, plugin, opts;
                                        return regeneratorRuntime.wrap(function _callee4$(_context4) {
                                                while (1) {
                                                        switch (_context4.prev = _context4.next) {
                                                                case 0:
                                                                        m = S(m).trim().toString();
                                                                        a = S(a).trim().toString();
                                                                        a = a.split('.')[0];
                                                                        ext = a.split('.')[1] || 'mst';
                                                                        templateFile = m + '/' + a + '.' + ext;
                                                                        plugin = this.parameter.param('_plugin_');

                                                                        EasyNode.DEBUG && logger.debug('view template file -> [' + templateFile + '], plugin [' + (plugin || 'NONE') + ']');

                                                                        if (!(m.length > 0 && a.length > 0)) {
                                                                                _context4.next = 14;
                                                                                break;
                                                                        }

                                                                        opts = {
                                                                                templateFile: templateFile
                                                                        };

                                                                        if (plugin) {
                                                                                opts.templateDir = plugin + '/' + EasyNode.config('easynode.framework.mvc.view.dir', 'views/');
                                                                        }
                                                                        _context4.next = 12;
                                                                        return me._execAction(m, a, opts, this);

                                                                case 12:
                                                                        _context4.next = 15;
                                                                        break;

                                                                case 14:
                                                                        this.throw(403);

                                                                case 15:
                                                                case 'end':
                                                                        return _context4.stop();
                                                        }
                                                }
                                        }, _callee4, this);
                                })));
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

                }, {
                        key: '_execUpload',
                        value: function _execUpload(ctx) {
                                return regeneratorRuntime.mark(function _callee5() {
                                        var r, files, retO, i, f;
                                        return regeneratorRuntime.wrap(function _callee5$(_context5) {
                                                while (1) {
                                                        switch (_context5.prev = _context5.next) {
                                                                case 0:
                                                                        r = ActionResult.createSuccessResult();
                                                                        files = ctx.parameter.fileNames();
                                                                        retO = {};
                                                                        i = 0;

                                                                case 4:
                                                                        if (!(i < files.length)) {
                                                                                _context5.next = 12;
                                                                                break;
                                                                        }

                                                                        _context5.next = 7;
                                                                        return ctx.parameter.saveFile(files[i]);

                                                                case 7:
                                                                        f = _context5.sent;

                                                                        if (f) {
                                                                                retO[files[i]] = f;
                                                                        }

                                                                case 9:
                                                                        i++;
                                                                        _context5.next = 4;
                                                                        break;

                                                                case 12:
                                                                        r.setResult(retO);
                                                                        return _context5.abrupt('return', r);

                                                                case 14:
                                                                case 'end':
                                                                        return _context5.stop();
                                                        }
                                                }
                                        }, _callee5, this);
                                });
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

                }, {
                        key: '_execAction',
                        value: function _execAction(m, a, opts, ctx) {
                                if (arguments.length == 3) {
                                        ctx = opts;
                                        opts = {};
                                }
                                opts = opts || {};
                                var me = this;
                                return regeneratorRuntime.mark(function _callee6() {
                                        var actionContext, executeResult, executor, d, o, r;
                                        return regeneratorRuntime.wrap(function _callee6$(_context6) {
                                                while (1) {
                                                        switch (_context6.prev = _context6.next) {
                                                                case 0:
                                                                        actionContext = new KOAActionContext(m, a, ctx);

                                                                        if (!(me.actionContextListener && me.actionContextListener.onCreate)) {
                                                                                _context6.next = 4;
                                                                                break;
                                                                        }

                                                                        _context6.next = 4;
                                                                        return me.actionContextListener.onCreate(actionContext);

                                                                case 4:
                                                                        executeResult = null;
                                                                        executor = new ActionExecutor(m, a, me.actionContextListener);
                                                                        _context6.prev = 6;
                                                                        _context6.next = 9;
                                                                        return executor.execute(actionContext, opts);

                                                                case 9:
                                                                        executeResult = _context6.sent;
                                                                        _context6.next = 22;
                                                                        break;

                                                                case 12:
                                                                        _context6.prev = 12;
                                                                        _context6.t0 = _context6['catch'](6);

                                                                        if (!(me.actionContextListener && me.actionContextListener.onError)) {
                                                                                _context6.next = 20;
                                                                                break;
                                                                        }

                                                                        EasyNode.DEBUG && logger.debug('Call action context listener "onError()"...');
                                                                        _context6.next = 18;
                                                                        return me.actionContextListener.onError(actionContext, _context6.t0);

                                                                case 18:
                                                                        _context6.next = 21;
                                                                        break;

                                                                case 20:
                                                                        logger.error(_context6.t0.stack);

                                                                case 21:
                                                                        if (_context6.t0.executeResult) {
                                                                                executeResult = _context6.t0.executeResult;
                                                                        }

                                                                case 22:
                                                                        if (executeResult) {
                                                                                ctx.action = {
                                                                                        m: m,
                                                                                        a: a,
                                                                                        'result-code': executeResult.actionResult.code
                                                                                };
                                                                                if (executeResult.action) {
                                                                                        d = new Date();
                                                                                        o = executeResult.action.getView().render(executeResult.actionResult, executeResult.action.getViewOptions());

                                                                                        ctx.renderCost = new Date() - d;
                                                                                        ctx.type = executeResult.action.getView().getContentType();
                                                                                        ctx.body = o;
                                                                                } else {
                                                                                        ctx.type = 'json';
                                                                                        ctx.body = executeResult.actionResult.toJSON();
                                                                                }
                                                                        } else {
                                                                                r = ActionResult.createErrorResult();

                                                                                ctx.action = {
                                                                                        m: m,
                                                                                        a: a,
                                                                                        'result-code': r.code
                                                                                };
                                                                                ctx.type = 'json';
                                                                                ctx.body = r;
                                                                        }

                                                                        if (!(me.actionContextListener && me.actionContextListener.onDestroy)) {
                                                                                _context6.next = 26;
                                                                                break;
                                                                        }

                                                                        _context6.next = 26;
                                                                        return me.actionContextListener.onDestroy(actionContext);

                                                                case 26:
                                                                case 'end':
                                                                        return _context6.stop();
                                                        }
                                                }
                                        }, _callee6, this, [[6, 12]]);
                                });
                        }
                }, {
                        key: 'getClassName',
                        value: function getClassName() {
                                return EasyNode.namespace(__filename);
                        }
                }]);

                return KOADefaultRoutes;
        })(GenericObject);

        module.exports = KOADefaultRoutes;
})();