var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var GenericObject = using('easynode.GenericObject');
var fs = require('co-fs');
var FileService =  using('easynode.framework.util.FileService');
var multipart = require('co-multipart');
var f =  require('fs');
var util = require('util');
var thunkify = require('thunkify');
var UploadService = using('netease.smartwatch.backend.services.UploadService');
var FileService =  using('easynode.framework.util.FileService');

(function () {
    /**
     * Class Controllers
     *
     * @class netease.smartwatch.Controllers
     * @extends easynode.GenericObject
     * @since 0.1.0
     * @author allen.hu
     * */
    class Controllers extends GenericObject
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

        /**
         * @api:
         * @apiDescription: 版本添加
         * @apiName {}
         * @apiGroup {}
         * @apiPermission {}
         * @apiSuccess {} {} {}
         * @apiVersion {}
         * */
        static  addVersion(app){
            return function * (){
                yield this.render('version-add',{});
            }
        }

        /**
         * @api:
         * @apiDescription: 首页
         * @apiName {}
         * @apiGroup {}
         * @apiPermission {}
         * @apiSuccess {} {} {}
         * @apiVersion {}
         * */
        static home(app){
            return function *(){
                yield this.render('index',{});
            }
        }

        /**
         * @api:
         * @apiDescription: package.json 上传处理,multaipartMiddleware处理图片,zip
         * @apiName {}
         * @apiGroup {}
         * @apiPermission {}
         * @apiSuccess {} {} {}
         * @apiVersion {}
         * */
        static packageUpload(app){
            var supportFileTypes = '^.*\.(?:json)$';
            var regEx = new RegExp(supportFileTypes);

            return function *(){
                console.dir(this.cookies.get('koa.sid'));
                var pkg = {};
                var session = this.session;
                if( session.hasOwnProperty('firms') ){
                    delete session.firms;
                }
                if( session.hasOwnProperty('pkg') ){
                    delete session.pkg;
                }
                this.state.upload=0;
                if (this.method.toLocaleLowerCase() == 'post') {
                    var hasError = false;
                    var filename = '';
                    var parts = yield* multipart(this);
                    for(let file  of parts.files) {
                        if(!file.filename.match(regEx)) {
                            parts.dispose();
                            this.status = 403;
                            this.body = `403 Forbidden : Unsupported type of upload file [${file.filename}]`;
                            hasError = true;                //ignore downstream middleware
                        }
                        else{
                            pkg = f.readFileSync(file.path);

                            var fileService = new FileService();
                            yield fileService.copyFile(file.path,app.getUploadDir() + file.filename);

                            filename = file.filename;
                            session.pkg = JSON.parse(pkg);
                        }
                    };
                    parts.dispose();

                    let uploadService = new UploadService(app);
                    let {resCode:hasError,resReason} = uploadService.validatePackage(session.pkg,filename);

                    if(!hasError) {
                        this.type = 'json';
                        this.body = session.pkg;
                    }else{
                        this.type = 'json';
                        this.body = resReason;
                    }
                }
                else {
                    EasyNode.DEBUG  && logger.debug('multipart must post');
                }
            }
        }

        /**
         * @api:  上传固件
         * @apiDescription:
         * @apiName {}
         * @apiGroup {}
         * @apiPermission {}
         * @apiSuccess {} {} {}
         * @apiVersion {}
         * */
        static firmwareUpload(app){
            var supportFileTypes = '^.*\.(?:bin)$';
            var regEx = new RegExp(supportFileTypes);

            return function *(type){
                console.dir(this.cookies.get('koa.sid'));
                var session = this.session;
                session.firms == undefined ? session.firms = [] : null;
                this.state.upload=0;
                if (this.method.toLocaleLowerCase() == 'post') {
                    var hasError = false;
                    var parts = yield* multipart(this);
                    for ( var file of parts.files ){
                        if(!file.filename.match(regEx)) {
                            parts.dispose();
                            this.status = 403;
                            this.body = `403 Forbidden : Unsupported type of upload file [${file.filename}]`;
                            hasError = true;                //ignore downstream middleware
                        }
                        else{
                            var obj = { type:type, path:app.getUploadDir() + file.filename, filename: file.filename };
                            session.firms.push(obj);
                            var fileService = new FileService();
                            yield fileService.copyFile(file.path,app.getUploadDir() + file.filename);
                       }
                    }
                   parts.dispose();

                    let uploadService = new UploadService(app);
                    let {resCode:hasError,resReason} = uploadService.validateFirms(session.pkg,session.firms);

                    if(!hasError) {
                        this.type = 'json';
                        this.body = session.firms;
                    }else{
                        this.type = 'json';
                        this.body = resReason;
                    }
                }
                else {
                    EasyNode.DEBUG  && logger.info('multipart must post');
                }
            }
        }

        /**
         * @api: summit && issure
         * @apiDescription: }
         * @apiName {}
         * @apiGroup `
         * @apiPermission {}
         * @apiSuccess {} {} {}
         * @apiVersion {}
         * */
        static issue(app) {
            return function *() {
                var uploadService = new UploadService(app);
                var upload = uploadService.upload(this.session.pkg,this.session.firms);
                var ret =  yield upload();

                this.type = 'json';
                this.body = ret;
            }
        }

        /**
         * @api:   获取升级信息
         * @apiDescription: }
         * @apiName
         * @apiGroup {}
         * @apiPermission {}
         * @apiSuccess {} {} {}
         * @apiVersion {}
         * */
        static getVersionInfo(app){
            return function*(){
                var version = this.parameter.param('version');
                var uploadService = new UploadService(app);

                this.type = 'json';
                this.body = yield  uploadService.download(version)();
            }
        }

        /**
         * @api:   获取版本列表信息,分页支持 TODO
         * @apiDescription: list页面传给变量名固定为listRet
         * @apiName {}
         * @apiGroup {}
         * @apiPermission {}
         * @apiSuccess {} {} {}
         * @apiVersion {}
         * */
        static listVersion(app){
            return function *(page){
                var uploadService = new UploadService(app);
                var listRet  = yield  uploadService.getPackages(page);
                yield this.render('version-list',{ listRet: listRet});
            }
        }

        getClassName()
        {
            return EasyNode.namespace(__filename);
        }
    }

    module.exports = Controllers;
})();