var assert = require('assert');
var thunkify = require('thunkify');
var Logger = using('easynode.framework.Logger');
var _  = require('underscore');
var fs = require('co-fs');
var f =  require('fs');
var logger = Logger.forFile(__filename);
var AbstractServer = using('easynode.framework.server.AbstractServer');
var S = require('string');
var koa = require('koa');
var staticFileServe = require('koa-static');
var favicon = require('koa-favicon');
var path = require('path');
var session = require('koa-generic-session');
var accessLogger = Logger.getLogger('access');
var route = require('koa-route');
var multipart = require('co-multipart');
var qs = require('koa-qs');
var render = require('koa-ejs');
var AdmZip = require('adm-zip');

var KOAHttpRequestParameter = using('easynode.framework.server.http.KOAHttpRequestParameter');



(function () {
        var PROXY_IP_HEADER = EasyNode.config('easynode.servers.koa-HttpServer.proxyIPHeader', 'x-forwarded-for');
        const HTTP_METHODS = [
                'all',          //virtual method
                'del',          //virtual method, equal to delete
                'get',
                'post',
                'put',
                'head',
                'delete',
                'options',
                'trace',
                'copy',
                'lock',
                'mkcol',
                'move',
                'purge',
                'propfind',
                'proppatch',
                'unlock',
                'report',
                'mkactivity',
                'checkout',
                'merge',
                'm-search',
                'notify',
                'subscribe',
                'unsubscribe',
                'patch',
                'search',
                'connect'
        ];

        var filters = {

        };
        /**
         * KOAHttpServer封装了一个koa Application，预定义了access logger，csrf，session, routes等中间件，并支持通过API方式向koa Application
         * 增加新的中间件、路由。<br>
         * 中间件和路由的加载顺序：favicon->access log->static files(包括所有静态文件目录)->session->csrf->$middlewares->default routes->$extra routes->$middleware-after-routes
         * <h5>使用参考：</h5>
         * <pre>
         *
         *
         *               require('../src /EasyNode.js');<br>
                         EasyNode.addSourceDirectory(src);
                         var co = require('co');
                         var assert = require('assert');
                         var logger = using('easynode.framework.Logger').getLogger();

                         var KOAHttpServer = using('easynode.framework.server.http.KOAHttpServer');
                         var server = new KOAHttpServer();

                         // redis session存储
                         //server.setSessionStorage(KOAHttpServer.SessionSupport.STORAGE_REDIS, {
                        //        host : '127.0.0.1',
                        //        port : 6379
                        //});

                         // memcached session存储
                         //server.setSessionStorage(KOAHttpServer.SessionSupport.STORAGE_MEMCACHED, {
                        //        host : '127.0.0.1',
                        //        port : 11211
                        //});

                         // memory session 存储
                         server.setSessionStorage(KOAHttpServer.SessionSupport.STORAGE_MEMORY);

                         //增加一个WEB目录。
                         server.addWebDirs('plugins/demo/www/');

                         //增加一个中间件
                         server.addMiddleware(function * (next) {
                        console.log('this message is printed anytime');
                        console.log(this.parameter.param('a'));
                        console.log(this.parameter.param('b'));
                        console.log(this.parameter.dateParam('c'));
                        console.log(this.remoteAddress);                        //客户端IP地址
                                yield next;
                        });

                         //增加一个在路由之后的中间件
                         server.addMiddlewareAfterRoutes(function * (next) {
                        console.log('this message is printed when no route was found');
                                this.type = 'json';
                                this.body = {
                                        hello : 'EasyNode'
                                };
                                yield next;
                        });

                         //增加一个路由
                         server.addRoute('get', '/abc.jsp', function * () {
                                 this.body = 'This is abc.jsp';
                        });

                         //启动服务

                         co(function * (){
                                yield server.start();
                        }).catch(onError());

                         //错误处理
                         function onError(err) {
                                if(err) {
                                        logger.error(err);
                                }
                        }
         *  </pre>
         * @class easynode.framework.server.http.KOAHttpServer
         * @extends easynode.GenericObject
         * @since 0.1.0
         * @author hujiabao
         * */
        class KOAHttpServer extends AbstractServer {
                /**
                 * 构造函数。
                 *
                 * @method 构造函数
                 * @param {int} port 端口，默认5000
                 * @since 0.1.0
                 * @author hujiabao
                 * */
                constructor(port=S(EasyNode.config('easynode.servers.koa-HttpServer.port', '5000')).toInt()) {
                        super(port, EasyNode.config('easynode.servers.koa-HttpServer.name', 'koa-HttpServer'));
                        //调用super()后再定义子类成员。

                        /**
                         *  HTTP服务的根目录，默认配置项：easynode.servers.koa-HttpServer.rootDirectory或www
                         * @property _webRoot
                         * @type String
                         * @private
                         *
                         * */
                        var _webRoot = EasyNode.real(EasyNode.config('easynode.servers.koa-HttpServer.webRoot', 'www/'));

                        /**
                         *  设置HTTP服务根目录。
                         * @method setWebRoot
                         * @param {String} webRoot HTTP服务根目录，相对路径
                         * @since 0.1.0
                         * @author hujiabao
                         * */
                        this.setWebRoot = function(webRoot) {
                                _webRoot = EasyNode.real(webRoot);
                        };

                        /**
                         *  获取HTTP服务根目录。
                         * @method getWebRoot
                         * @return {String} 返回HTTP服务根目录
                         * @since 0.1.0
                         * @author hujiabao
                         * */
                        this.getWebRoot = function() {
                                return _webRoot;
                        };

                        /**
                         *  上传文件目录，默认www/uploads
                         * @property _uploadDir
                         * @type String
                         * @private
                         * */
                        var _uploadDir = EasyNode.real(EasyNode.config('easynode.servers.koa-HttpServer.uploadDir', 'www/uploads/'));

                        /**
                         * 上传文件目录前缀，默认/uploads
                         * @property _uploadURIPrefix
                         * @type String
                         * @private
                         * */
                        var _uploadURIPrefix = EasyNode.config('easynode.servers.koa-HttpServer.uploadURIPrefix','/uploads/');

                        /**
                         *  设置文件上传目录。
                         * @method setUploadDir
                         * @param {String} uploadDir HTTP服务根目录，相对路径
                         * @since 0.1.0
                         * @author hujiabao
                         * */
                        this.setUploadDir = function(uploadDir) {
                                _uploadDir = EasyNode.real(uploadDir);
                        };
                        /**
                         *  获取HTTP服务上传目录。
                         * @method getUploadDir
                         * @return {String} 返回HTTP服务上传目录
                         * @since 0.1.0
                         * @author hujiabao
                         * */
                        this.getUploadDir = function() {
                                return _uploadDir;
                        };

                        /**
                         * 获取HTTP服务上伟目录相对路径
                         * @method getUploadURIPrefix
                         * @return {String} 返回HTTP服务上传目录相对路径
                         * @since 0.1.0
                         * @author allen.hu
                         */
                         this.getUploadURIPrefix = function() {
                            return _uploadURIPrefix;
                         };

                        var _writeAccessLog = S(EasyNode.config('easynode.servers.koa-HttpServer.writeAccessLog',  'true')).toBoolean();
                        /**
                         *  设置服务是否记录访问日志
                         * @method writeAccessLog
                         * @param {boolean} flag 是否记录访问日志
                         * @since 0.1.0
                         * @author hujiabao
                         * */
                        this.writeAccessLog = function(flag) {
                                if(arguments.length == 0) {
                                        return _writeAccessLog;
                                }
                                assert(typeof flag == 'boolean', 'Invalid argument');
                                _writeAccessLog = flag;
                        };

                        /**
                         *  Session 存储类型，默认KOAHttpServer.SessionSupport.STORAGE_MEMORY
                         * @property _sessionStorage
                         * @type String
                         * @private
                         * */
                        this._sessionStorage = 'storage-memory';
                        /**
                         *  Session 存储选项，默认null
                         * @property _sessionStorageOptions
                         * @type object
                         * @private
                         * */
                        this._sessionStorageOptions = null;

                        /**
                         *  koa app的key
                         * @property _keys
                         * @type array
                         * @private
                         * */
                        this._keys = EasyNode.config('easynode.servers.koa-HttpServer.keys', 'EasyNode').split(',');

                }

                /**
                 *  增加静态文件查找目录
                 * @method addWebDirs
                 * @param {String} arr 静态文件列表，相对于EasyNode的目录。
                 * @since 0.1.0
                 * @author hujiabao
                 * */
                addWebDirs (...arr) {
                        this._webDirs = this._webDirs || [];
                        arr.forEach(dir => {
                                assert(typeof dir == 'string', 'Invalid arguments');
                                this._webDirs.push(dir);
                        });
                }

                /**
                 *  增加动态模板查找目录，仅允许一个目录
                 *  @method addTemplateDirs
                 *  @param {String} arr 模板文件列表，相对于EasyNode的目录
                 *  @since 0.1.0
                 *  @autho allen.hu
                 * */
                addTemplateDirs(...arr) {
                        this._templateDirs = this._templateDirs || [];
                        assert( arr.length == 1, 'template dire number, only one');
                        arr.forEach( dir => {
                            assert(typeof dir == 'string', 'Invalid arguments');
                            this._templateDirs.push(dir);
                        });
                }

                 /**
                 *  设置koa的KEY
                 * @method setKeys
                 * @param {...} keys Key列表，每个KEY是string。
                 * @since 0.1.0
                 * @author hujiabao
                 * */
                setKeys (...keys) {
                        assert(keys.length > 0, 'Invalid arguments');
                        this._keys = keys;
                }

                /**
                 *  增加中间件，中间件是一个generator函数，请注意：中间件会按先后顺序添加到koa，具体流程请参考start函数。
                 *  在任何中间件中可以访问koa ctx对象，即中间件generator函数中的this对象，的parameter对象，该成员是
                 *  easynode.framework.server.http.KOAHttpRequestParameter类实例，用于获取HTTP请求参数和上传的文件。
                 *
                 * @method addMiddleware
                 * @param {generator} gen generator函数，符合koa中间件规范
                 * @since 0.1.0
                 * @author hujiabao
                 * @example
                 *
                 *      server.addMiddleware(function * (next) {
                 *               console.log('this message is printed anytime');
                 *               console.log(this.parameter.param('a'));
                 *               console.log(this.parameter.param('b'));
                 *               console.log(this.parameter.dateParam('c'));
                 *               yield next;
                 *       });
                 * */
                addMiddleware (gen) {
                        this._middlewares = this._middlewares || [];
                        this._middlewares.push(gen);
                }

                /**
                 *  增加中间件(在Routes之后)，中间件是一个generator函数，请注意：中间件会按先后顺序添加到koa，具体流程请参考start函数。
                 *  在任何中间件中可以访问koa ctx对象，即中间件generator函数中的this对象，的parameter对象，该成员是
                 *  easynode.framework.server.http.KOAHttpRequestParameter类实例，用于获取HTTP请求参数和上传的文件。
                 *
                 * @method addMiddlewareAfterRoutes
                 * @param {generator} gen generator函数，符合koa中间件规范
                 * @since 0.1.0
                 * @author hujiabao
                 * @example
                 *       server.addMiddlewareAfterRoutes(function * (next) {
                 *               console.log('this message is printed when no route was found');
                 *               this.type = 'json';
                 *               this.body = {
                 *                       hello : 'EasyNode'
                 *               };
                 *               yield next;
                 *       });
                 * */
                addMiddlewareAfterRoutes (gen) {
                        this._middlewaresAfterRoutes = this._middlewaresAfterRoutes || [];
                        this._middlewaresAfterRoutes.push(gen);
                }

                /**
                 *  增加一个路由。
                 * 在任何路由中可以访问koa ctx对象，即中间件generator函数中的this对象，的parameter对象，该成员是
                 *  easynode.framework.server.http.KOAHttpRequestParameter类实例，用于获取HTTP请求参数和上传的文件。
                 *
                 * @method addRoute
                 * @param {String} method http method，支持"all", "get", "post", "put", "delete"
                 * @param {String} uri, 以"/"开头
                 * @param {generator} gen, 路由generator函数
                 * @since 0.1.0
                 * @author hujiabao
                 * @example
                 *      server.addRoute('get', '/abc.jsp', function * () {
                 *               this.body = 'This is abc.jsp';
                 *      });
                 *
                 * */
                addRoute (method, uri, gen) {
                        assert(typeof method == 'string' && typeof uri == 'string', 'Invalid http method');
                        method = method.toLowerCase();
                        assert(_.contains(HTTP_METHODS, method), `Invalid http method [${method}] of route, supported methods are: [${HTTP_METHODS.join(',')}]`);
                        this._routes = this._routes || [];
                        this._routes.push({
                                method : method,
                                uri : uri,
                                gen : gen
                        });
                }

                /**
                 *  设置Session的存储类型，默认Session支持为内存存储，这容易引起内存泄漏，请不要用于生产环境。
                 *
                 * @method setSessionStorage
                 * @param {String} storage 存储类型, KOAHttpServer.SessionSupport.STORAGE_*
                 * @param {object} opt 参数，使用KOAHttpServer.SessionSupport.STORAGE_MEMORY时，忽略此参数。
                 * @since 0.1.0
                 * @author hujiabao
                 * @example
                 *      var KOAHttpServer = using('easynode.framework.server.http.KOAHttpServer');
                 *      var server = new KOAHttpServer();
                 *
                 *      //use memory session
                 *      server.setSessionStorage(KOAHttpServer.SessionSupport.STORAGE_MEMORY);
                 *
                 *      //use redis session storage
                 *      server.setSessionStorage(KOAHttpServer.SessionSupport.STORAGE_REDIS, {
                 *              host : '127.0.0.1',
                 *              port : 6379,
                 *              db : 'EasyNode_Session',
                 *              pass : 'password_of_db'
                 *      });
                 *
                 *      //use memcached session storage
                 *      server.setSessionStorage(KOAHttpServer.SessionSupport.STORAGE_MEMCACHED, {
                 *              host : '127.0.0.1',
                 *              port : 11211
                 *      });
                 * */
                setSessionStorage(storage, opt) {
                        assert(typeof storage == 'string', 'Invalid argument');
                        assert(_.contains([
                                                KOAHttpServer.SessionSupport.STORAGE_MEMORY,
                                                KOAHttpServer.SessionSupport.STORAGE_REDIS,
                                                KOAHttpServer.SessionSupport.STORAGE_MEMCACHED
                                        ], storage), `Invalid session storage [${storage}]`);
                        this._sessionStorage = storage;
                        this._sessionStorageOptions = opt;
                }

                /**
                 *  设置HTTP Server是否启用CSRF防御。默认禁用。启用时需要koa-csrf模块支持。
                 *
                 * @method enableCSRF
                 * @param {boolean} flag true-启用；false-禁用。
                 * @since 0.1.0
                 * @author hujiabao
                 **/
                enableCSRF (flag) {
                        assert(typeof flag == 'boolean', 'Invalid argument');
                        this._enableCSRF = flag;
                }

                /**
                 *  设置HTTP Server是否启用404中间件。默认启用。可以通过addMiddlewareAfterRoutes函数自行增加一个404处理中间件，在这个
                 *  中间件中不调用yield next中止downstream中间件可以达到同样的效果。KOAHttpServer的404中间件总是位于中间件最底端。
                 *
                 * @method enableCSRF
                 * @param {boolean} flag true-启用；false-禁用。
                 * @since 0.1.0
                 * @author hujiabao
                 **/
                enable404Middleware (flag) {
                        assert(typeof flag == 'boolean', 'Invalid argument');
                        this._enable404Middleware = flag;
                }

                /**
                 *  设置KOAActionContext的事件处理器。可在此注入数据库支持、缓存支持、队列支持等等。<br/>
                 *  这是一个非常重要的函数，用于设置EasyNode中所有Action的调用上下文，包括数据库连接使用，cache使用，MQ使用
                 *  等，这些对象的使用，EasyNode已经抽象出相应的接口。<br/>
                 *  EasyNode的新版本可能会再抽象其他一些通用的功能接口
                 *
                 * @method setActionContextListener
                 * @param @param {easynode.framework.mvc.IActionContextListener} l ActionContext事件监听器
                 * @since 0.1.0
                 * @author hujiabao
                 **/
                setActionContextListener (l) {
                        this._actionContextListener = l;
                }

                /**
                 *  返回session的storage对象，符合koa-generic-session接口定义。get、set、destroy。
                 *
                 * @method _getSessionStore
                 * @return {object} storage 存储对象。实现get、set、destroy接口。
                 * @private
                 * @since 0.1.0
                 * @author hujiabao
                 * */
                _getSessionStore () {
                        this._sessionStorage = this._sessionStorage || KOAHttpServer.SessionSupport.STORAGE_MEMORY;
                        switch (this._sessionStorage) {
                                case KOAHttpServer.SessionSupport.STORAGE_MEMORY :
                                {
                                        return this._createMemoryStorage();
                                }
                                case KOAHttpServer.SessionSupport.STORAGE_REDIS :
                                {
                                        return this._createRedisStorage();
                                }
                                case KOAHttpServer.SessionSupport.STORAGE_MEMCACHED :
                                {
                                        return this._createMemcachedStorage();
                                }
                                default :
                                {
                                        throw new Error(`Unsupported session storage [${this._sessionStorage}]`);
                                }
                        }
                }

                /**
                 *  session内存存储
                 *
                 * @method _createMemoryStorage
                 * @return {object} session内存存储对象。实现get、set、destroy接口。
                 * @private
                 * @since 0.1.0
                 * @author hujiabao
                 * */
                _createMemoryStorage () {
                        var MSS = using('easynode.framework.server.http.KOAMemorySessionStorage');
                        return new MSS();
                }

                /**
                 *  session redis存储
                 *
                 * @method _createRedisStorage
                 * @return {object} session redis存储对象。koa-redis模块支持。
                 * @private
                 * @since 0.1.0
                 * @author hujiabao
                 * */
                _createRedisStorage () {
                        var redisStore = require('koa-redis');
                        return redisStore(this._sessionStorageOptions);
                }

                /**
                 *  session memcached存储
                 *
                 * @method _createMemcachedStorage
                 * @return {object} session memcached存储对象。koa-memcached模块支持。
                 * @private
                 * @since 0.1.0
                 * @author hujiabao
                 * */
                _createMemcachedStorage () {
                        var memcachedStore = require('koa-memcached');
                        return memcachedStore(this._sessionStorageOptions);
                }

                /**
                 *  写AccessLog的中间件。
                 *  如果需要记录会话用户，则需要在后续中间件或者route或action中设置session.user.id至koa context
                 *
                 * @method _createAccessLogger
                 * @return {generator} 符合koa中间件规范的AccessLog的generator对象。
                 * @private
                 * @since 0.1.0
                 * @author hujiabao
                 * */
                _createAccessLogger () {
                        var me = this;
                        return function * (next) {
                                var d = new Date();
                                yield next;
                                if(this.status == 404) {return;}
                                var t = new Date() - d;
                                var o = {
                                        'app-id' : me.appId,
                                        'app-key' : me.appKey,
                                        pid : process.pid,
                                        uptime : parseInt(process.uptime()),
                                        server : (me.name + '@' + EasyNode.getLocalIP() + ':' + me.port) || ('koa-http-server@' + EasyNode.getLocalIP() + ':' + me.port),
                                        time : d.toFormat('YYYY-MM-DD HH:MI:SS'),
                                        method : this.method,
                                        url : this.url.replace(/\?.*$/, ''),
                                        status : this.status,
                                        cost : t,
                                        'render-cost' : this.renderCost || 0,                   // to write the performance of view engine such as ejs or mustache
                                                                                                                          // set renderCost attribute to koa context.
                                        action : this.action,                                               // see KOADefaultRoutes._execAction();
                                        remote : this.remoteAddress,                            //remote address
                                        user : this.session && this.session.user && this.session.user.id || '[UNKNOWN]'         //user id in the session
                                };
                                accessLogger.info(JSON.stringify(o));
                                me.trigger(KOAHttpServer.Events.EVENT_ACCESS, o);
                        };
                }

                /**
                 *  默认Routes。
                 *
                 * @method _createDefaultRoutes
                 * @param {koa} app koa实例
                 * @private
                 * @since 0.1.0
                 * @author hujiabao
                 * */
                _createDefaultRoutes (app) {
                        var DefaultRoutes = using('easynode.framework.server.http.KOADefaultRoutes');
                        new DefaultRoutes(app, route, this._actionContextListener).addRoutes();
                }

                /**
                 *  增加用户定义的Routes(通过addRoute函数)。
                 *
                 * @method _createDefaultRoutes
                 * @param {koa} app koa实例
                 * @private
                 * @since 0.1.0
                 * @author hujiabao
                 * */
                _createExtraRoutes (app) {
                        this._routes = this._routes || [];
                        this._routes.forEach(o => {
                                if(typeof route[o.method] == 'function') {
                                        app.use(route[o.method].call(null, o.uri, o.gen));
                                }
                                else {
                                        throw new Error(`Unsupported http method [${o.method}]`);
                                }
                        });
                }

                /**
                 *  增加用户定义的Middleware(通过addMiddleware函数)。
                 *
                 * @method _createExtraMiddlewares
                 * @param {koa} app koa实例
                 * @private
                 * @since 0.1.0
                 * @author hujiabao
                 * */
                _createExtraMiddlewares (app) {
                        this._middlewares = this._middlewares || [];
                        this._middlewares.forEach(middleware => {
                                app.use(middleware);
                        });
                }

                /**
                 *  加载默认中间件。
                 *
                 * @method _createDefaultMiddlewares
                 * @param {koa} app koa实例
                 * @private
                 * @since 0.1.0
                 * @author hujiabao
                 * */
                _createDefaultMiddlewares (app) {
                        // anytime goes here, this.query will be the parse result of query string, this.parts will be the parsed body of request if
                        // it is a POST method now
                        app.use(function * (next) {
                                var me = this;
                                // add parameter attribute to ctx, so the downstream middlewares could access this attribute to fetch parameters from
                                // query string or body
                                this.parameter = new KOAHttpRequestParameter(this.query, this.parts);
                                yield next;
                        });
                }

                /**
                 *  增加multipart-form-data支持。
                 *
                 * @method _createMultipartMiddleware
                 * @param {koa} app koa实例
                 * @private
                 * @since 0.1.0
                 * @author hujiabao
                 * */
                _createMultipartMiddleware (app) {
                        var supportFileTypes = '^.*\.(?:png|jpg|bmp|gif|jpeg|txt|doc|xls|xlsx|ppt|pptx|pdf|zip|tar|gz|rar|swf|mp3|mp4|log)$';
                        supportFileTypes = EasyNode.config('easynode.servers.koa-HttpServer.upload.types', supportFileTypes);
                        var regEx = new RegExp(supportFileTypes);
                        var me = this;
                        app.use(function* (next) {
                                        //this.state.upload=0;
                                        //if (this.method.toLocaleLowerCase() == 'post') {
                                        //        var hasError = false;
                                        //        var parts = yield* multipart(this);
                                        //        parts.files.forEach(file => {
                                        //                if(!file.filename.match(regEx)) {
                                        //                        parts.dispose();
                                        //                        this.status = 403;
                                        //                        this.body = `403 Forbidden : Unsupported type of upload file [${file.filename}]`;
                                        //                        hasError = true;                //ignore downstream middleware
                                        //                }
                                        //                f.rename(file.path, me.getUploadDir() + file.filename,function(err){
                                        //                    if(err){
                                        //                        EasyNode.DEBUG && logger.debug(`rename ${file.path} to ${me.getUploadDir()+file.filename} err`,err.message);
                                        //                    }
                                        //                    else {
                                        //                        var zip = AdmZip(me.getUploadDir() + file.filename);
                                        //                        zip.extractAllTo(me.getUploadDir(), true);
                                        //                        EasyNode.DEBUG && logger.debug(`rename ${file.path} to ${me.getUploadDir()+file.filename} success`);
                                        //                    }
                                        //                });
                                        //        });
                                        //        if(!hasError) {
                                        //            this.parts = parts;
                                        //                if( ~this.req.url.indexOf('/idmanager') && this.req.method.toLowerCase() === 'post' ){
                                        //                    this.state.upload = 1;
                                        //                    var filename = this.parts.files[0].filename;
                                        //                    this.state.relativePath =  me.getUploadURIPrefix() + path.basename( filename, path.extname(filename));
                                        //                    this.state.relativeFilename = this.state.relativePath + '/start.html';
                                        //                }
                                        //            parts.dispose();
                                        //            yield next;
                                        //
                                        //        }
                                        //}
                                        //else {
                                                // for compatibility
                                                this.parts = {
                                                        files : [],
                                                        fields : []
                                                };
                                                yield next;
                                       // }
                                }
                        );
                }

                /**
                 *  增加在Route之后的middleware, 通过addMiddlewareAfterRoutes
                 *
                 * @method _createMiddlewaresAfterRoutes
                 * @param {koa} app koa实例
                 * @private
                 * @since 0.1.0
                 * @author hujiabao
                 * */
                _createMiddlewaresAfterRoutes (app) {
                        this._middlewaresAfterRoutes = this._middlewaresAfterRoutes || [];
                        this._middlewaresAfterRoutes.forEach(middleware => {
                                app.use(middleware);
                        });
                }
                /**
                 *  增加用户定义的静态文件目录(通过addWebDirs函数)。
                 *
                 * @method _addExtraWebDirs
                 * @param {koa} app koa实例
                 * @private
                 * @since 0.1.0
                 * @author hujiabao
                 * */
                _addExtraWebDirs (app) {
                        this._webDirs = this._webDirs || [];
                        this._webDirs.forEach(dir => {
                                app.use(staticFileServe(EasyNode.real(dir)));
                        });
                }

                /**
                 *  增加用户定义的模板文件目录(通过addTemplateDirs函数)。
                 * @method _addTemplate
                 * @param {koa} app koa实例
                 * @private
                 * @since 0.1.0
                 * @author allen.hu
                 * */
                _addTemplate(app){
                    this._templateDirs = this._templateDirs || [];
                    this._templateDirs.forEach(dir => {
                        render(app, {
                            root: EasyNode.real(dir),
                            layout: '',
                            viewExt: 'html',
                            cache: false,
                            debug: true,
                            filters: filters
                        });
                    });
                }

                /**
                 * 启动KOAHttpServer并加载中间件，中间件会按先后顺序添加到koa，具体流程如下：<br>
                 *          favicon->access log->static files(包括所有静态文件目录)->session->csrf->$middlewares->default routes->$extra routes->$middleware-after-routes
                 *
                 * @method start
                 * @overwrite
                 * @private
                 * @since 0.1.0
                 * @author hujiabao
                 * */
                start () {
                        var me = this;
                        return function * () {
                                /**
                                 * koa Application实例
                                 * @property _app
                                 * @type {koa.Application}
                                 * @private
                                 * @since 0.1.0
                                 * @author hujiabao
                                 * */
                                var app = me._app = koa();
                                //trigger before-start event
                                me.trigger(AbstractServer.EVENT_BEFORE_START);

                                // set key of app
                                app.keys = me._keys;
                                app.name = me.name;

                                // add favicon support
                                app.use(favicon(path.join(me.getWebRoot(), 'favicon.ico')));

                                // serve static files
                                //HTTP ROOT
                                app.use(staticFileServe(me.getWebRoot()));
                                //Additional web dirs
                                me._addExtraWebDirs(app);


                                me._addTemplate(app);

        //=========================dynamic request below=========================//

                                //set remote address
                                app.use(function * (next){
                                        var req = this.req;
                                        var address = req.headers[PROXY_IP_HEADER] ||
                                                (req.connection && req.connection.remoteAddress) ||
                                                (req.socket && req.socket.remoteAddress) ||
                                                (req.connection.socket && req.connection.socket.remoteAddress) || '0.0.0.0';
                                        address = address.replace(/:.*:/, '');                  //convert to pure IPv4
                                        this.remoteAddress = address;
                                        yield next;
                                });


                                // access log
                                if (me.writeAccessLog()) {
                                        app.use(me._createAccessLogger());
                                }

                                // session support
                                app.use(session({
                                        store: me._getSessionStore()
                                }));

                                //csrf support
                                if (me._enableCSRF === true) {
                                        var csrf = require('koa-csrf');
                                        csrf(app);
                                        app.use(csrf.middleware);
                                }

                                // parse url query string and body before any middleware defined by user is running
                                qs(app, 'first');                       // /foo?a=b&a=c         this.query.a = 'b' , not a = ['b', 'c']

                                // support multipart-form-data
                                me._createMultipartMiddleware(app);

                                // default middlewares
                                me._createDefaultMiddlewares(app);

                                // user defined middlewares
                                me._createExtraMiddlewares(app);

                                // inner routes
                                me._createDefaultRoutes(app);

                                // user defined routes
                                me._createExtraRoutes(app);

                                // middleware after routes
                                me._createMiddlewaresAfterRoutes(app);

                                // handle error 404
                                if (me._enable404Middleware !== false) {
                                        app.use(function * () {
                                                if (this.status == 404) {
                                                        var uri = this.url.replace(/\?.*$/gm, '');
                                                        var content404 = me._404Content;
                                                        if (!content404) {
                                                                EasyNode.DEBUG && logger.debug('load 404 content from 404.html');
                                                                var config404 = EasyNode.config('easynode.servers.koa-HttpServer.404', '404.html');
                                                                var page404 = path.join(me.getWebRoot(), config404);
                                                                var content404 = '<h1>404 Resource Not Found : ${URI}</h1>';
                                                                if (yield fs.exists(page404)) {
                                                                        content404 = yield fs.readFile(page404);
                                                                }
                                                                me._404Content = content404;
                                                        }
                                                        content404 = content404.toString().replace(/\$\{URI\}/gm, uri);
                                                        this.type = 'html';
                                                        this.body = content404;
                                                        this.status = 404;
                                                }
                                        });
                                }

                                //auto-generate nginx configuration
                                if(EasyNode.config('easynode.servers.koa-HttpServer.generateNginxConfig', '0') == '1') {
                                        var nginxConfTemplate = EasyNode.real('etc/nginx-conf.mst');
                                        var nginxVPTemplate = EasyNode.real('etc/nginx-vp-conf.mst');
                                        var sCfg = '';
                                        var sVP = '';
                                        var extraDirs = me.getWebDirs();
                                        var vpRegexp = /.*\/(.+)\/www\/?$/;
                                        //virtual path
                                        for(var i = 0;i<extraDirs.length;i++) {
                                                var p = extraDirs[i];
                                                var vp = '';
                                                if(p.match(vpRegexp)) {
                                                        vp = vpRegexp.exec(p)[1];
                                                        sVP += yield MustacheHelper.renderFile(nginxVPTemplate, {
                                                                virtualPathName : vp,
                                                                virtualPathRoot : EasyNode.real(p)
                                                        });
                                                        sVP += '\n\n\n';
                                                }
                                        }
                                        //nginx conf
                                        sCfg = yield MustacheHelper.renderFile(nginxConfTemplate, {
                                                rootDir : me.getWebRoot(),
                                                serviceIP : EasyNode.getLocalIP(),
                                                servicePort : me.port,
                                                virtualPath : sVP
                                        });

                                        var nginxConfigFile = EasyNode.real('etc/nginx.conf');
                                        yield fs.writeFile(nginxConfigFile, sCfg);
                                        logger.info(`nginx config file is auto-generated at [${nginxConfigFile}]`);
                                }

                                var fnListen = thunkify(app.listen);
                                            yield fnListen.call(app, me.port);
                                            logger.info(`[${me.name}] is listening on port [${me.port}]...`);
                                            me.trigger(AbstractServer.EVENT_STARTED);
                                    };
                }

                /**
                 * 获取客户端连接列表。KOAHttpServer只返回一个空的数组。
                 *
                 * @method connections
                 * @abstract
                 * @return {Array} 客户端连接列表，每个客户端连接应至少包含一个token字标用于唯一标识一个客户端连接
                 * @async
                 * @since 0.1.0
                 * @author hujiabao
                 * */
                connections () {
                        return [];
                }

                /**
                 * 向客户端发送消息。HTTP服务不支持主动向客户端发送消息，仅抛出错误。
                 *
                 * @method send
                 * @param {Array/String} clientTokens 客户端Token列表，客户端Token可以唯一识别一个客户端。传递Array时，
                 *                                      向多个客户端发送消息
                 * @param {Buffer} msg 消息体
                 * @return {Array} 客户端列表
                 * @abstract
                 * @async
                 * @since 0.1.0
                 * @author hujiabao
                 * */
                send(clientTokens, msg) {
                        throw new Error('This is http server, do you think it is able to work?');
                }

                /**
                 * 向所有客户端广播消息。HTTP服务不支持主动向客户端发送消息，仅抛出错误。
                 *
                 * @method broadcast
                 * @param {Buffer} msg 消息体
                 * @return {Array} 客户端列表
                 * @abstract
                 * @async
                 * @since 0.1.0
                 * @author hujiabao
                 * */
                broadcast (msg) {
                        throw new Error('This is http server, do you think it is able to work?');
                }

                getClassName() {
                        return EasyNode.namespace(__filename);
                }
        }

        /**
         *      session存储类型常量。
         *      <pre>
         *      KOAHttpServer.SessionSupport.STORAGE_MEMORY = 'storage-memory';
         *      KOAHttpServer.SessionSupport.STORAGE_REDIS = 'storage-redis';
         *      KOAHttpServer.SessionSupport.STORAGE_MEMCACHED = 'storage-memcached';
         *      </pre>
         *      <h5>Example</h5>
         *      <pre>
         *var KOAHttpServer = using('easynode.framework.server.http.KOAHttpServer');
         *var server = new KOAHttpServer();
         *
         * server.setSessionStorage(KOAHttpServer.SessionSupport.STORAGE_REDIS, {
         *         host : '127.0.0.1',
         *         port : 6379
         * });
         *
         * server.setSessionStorage(KOAHttpServer.SessionSupport.STORAGE_MEMCACHED, {
         *         host : '127.0.0.1',
         *         port : 11211
         * });
         *
         * server.setSessionStorage(KOAHttpServer.SessionSupport.STORAGE_MEMORY);
         *      </pre>
         *
         * @class easynode.framework.server.http.KOAHttpServer.SessionSupport
         * @since 0.1.0
         * @author hujiabao
         * */
        KOAHttpServer.SessionSupport = {};

        KOAHttpServer.SessionSupport.STORAGE_MEMORY = 'storage-memory';

        KOAHttpServer.SessionSupport.STORAGE_REDIS = 'storage-redis';

        KOAHttpServer.SessionSupport.STORAGE_MEMCACHED = 'storage-memcached';

        KOAHttpServer.Events = {};

        /**
         * 用户访问动态内容时触发。
         *
         * @event access
         * @since 0.1.0
         * @author hujiabao
         * */
        KOAHttpServer.Events.EVENT_ACCESS = 'access';

        module.exports = KOAHttpServer;
})();