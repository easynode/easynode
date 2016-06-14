var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var GenericObject = using('easynode.GenericObject');
var md5 =  require('md5');
var fs = require('co-fs');
var f =  require('fs');
var Package = using('netease.smartwatch.backend.models.Package');
var Program = using('netease.smartwatch.backend.models.Program');
var PackageUpdate = using('netease.smartwatch.backend.models.PackageUpdate');
var MyError = using('easynode.framework.util.MyError');
var xdelta  = require('watch-xdelta');
var bfs = require('babel-fs');
var Nos = require('nenos');
var archiver = require('archiver');
var FileService =  using('easynode.framework.util.FileService');

(function () {
    //UPLOAD
    const UPLOAD_SUCCESS = { resCode:0, resReason: "恭喜,版本发布成功!" };
    const UPLOAD_MD5_FAIL = { resCode: -1, resReason: "固件MD5校验失败!" };
    const UPLOAD_DOWNGRADING = { resCode: -2, resReason: "亲,这不是升级,而是在降级!"};
    const UPLOAD_UNKNOWN = { resCode: -3, resReason: "版本发布,产生未知错误!" };

    //UPDATE
    const UPDATE_SUCCESS = { resCode: 0, resReason: "成功",url:'' };
    const UPDATE_NOT_EXIST = { resCode: 101, resReason: "请求包版本号不存在",url:'' };
    const UPDATE_NEWEST = { resCode: 102, resReason: "请求包版本号已是最新版本",url:'' };
    const UPDATE_CREATE_PACKAGE_FAIL = { resCode: 110, resReason: "添加package失败,请检查package.json文件内容!!",url:'' };
    const UPDATE_UNKNOWN = { resCode: 103, resReason: "升级请求出现未知错误!",url:'' };
    const UPDATE_CHECK_PACKAGE = { resCode: 104, resReason: "请检查package-version.json文件!",url:'' };
    const UPDATE_UPLOAD_FIRM = { resCode: 105, resReason: "您还未上传程序!",url:'' };


    //VALIDATE
    const VALIDATE_PACKAGE_ERROR = { resCode: 1, resReason: `error:请查检package.*.*.*json` };
    const VALIDATE_FIRMS_ERROR = { resCode: 1, resReason: `error:请查检package.*.*.*.json文件格式和程序文件名` };
    const VALIDATE_PACKAGE_SUCCESS = { resCode: 0, resReason: `success` };


    const UPDATE_LEVEL_MINOR = 0;
    const UPDATE_LEVEL_MAJOR = 1;
    const UPDATE_LEVEL_DOWNGRADING = 2;
    /**
     * Class UploadService
     *
     * @class easynode.framework.util.UploadService
     * @extends easynode.GenericObject
     * @since 0.1.0
     * @author allen.hu
     * */
    class UploadService extends GenericObject {
        /**
         * 构造函数。
         *
         * @method 构造函数
         * @since 0.1.0
         * @author allen.hu
         * */
        constructor(app) {
            super();
            //调用super()后再定义子类成员。
            this.app = app;
        }

        /**
         * @api: 获取升级信息
         * @apiDescription: 1.从当前版本watch_package找出最后版本pkgId, 2.从srcPkgId和toPkgId找出各下载URL
         * @apiName {}
         * @apiGroup {}
         * @apiPermission {}
         * @apiSuccess {} {} {}
         * @apiVersion {}
         * */
        download(version){
            var me = this;
            return function* (){

                if( version == undefined || typeof version != 'string' || version.split('.').length != 3 ){
                    return UPDATE_NOT_EXIST;
                }


                try{
                    me.conn = yield  me.app.ds.getConnection();
                    var code = UploadService.generateCode(version);
                    var srcpkgids = yield * me.getPkgIdByCode(code)();
                    if( srcpkgids.length <= 0 ){
                        return UPDATE_NOT_EXIST ;
                    }
                    var srcpkgid = srcpkgids[0].id;
                    var arr1 = yield * me.siblingMaxCode(version.split('.')[0],code)();
                    var arr2 = yield * me.seniorMinCode(code)();
                    var arr = arr1.concat(arr2);
                    if( arr.length <= 0 ){
                        return UPDATE_NEWEST;
                    }
                    var topkgid = arr[0].id;
                    var packages = yield * me.getPackageUpdate(srcpkgid,topkgid)();
                    if( packages.length <= 0 ){
                        return UPDATE_NOT_EXIST;
                    }
                    UPDATE_SUCCESS.url = packages[0].url;
                    UPDATE_SUCCESS.resReason = arr[0].version;
                    return UPDATE_SUCCESS;
                }catch(e){
                    EasyNode.DEBUG && logger.debug(` ${e},${e.stack}`);
                    return UPDATE_UNKNOWN;
                }finally{
                    yield me.app.ds.releaseConnection(me.conn);
                }
            }
        }

        /**
         * @api: 上传版本处理
         * @apiDescription: 1. MD5 check 2. watch_package record, watch_program record, 4.查找待升级的pkgIds 3. upload nos
         * @apiName
         * @apiGroup {}
         * @apiPermission {}
         * @apiSuccess {} {} {}
         * @apiVersion {}
         * */
        upload(topkg = {}, firms = []){
            var me = this;
            return function *() {

                if( !topkg.hasOwnProperty('version') ){
                    return UPDATE_CHECK_PACKAGE;
                }
                if( firms.length <= 0){
                    return UPDATE_UPLOAD_FIRM;
                }

                try{
                    me.conn = yield  me.app.ds.getConnection();

                    yield * me.conn.beginTransaction()();

                    //1.MD5 Check
                    var ret = yield * me.validate(topkg, firms)();
                    if( ret ==  false ){
                        return UPLOAD_MD5_FAIL;
                    }

                    //4.find pkgIds to update
                    var {updatelevel,code} = yield * me.getUpdateLevel(topkg.version)();

                    if( updatelevel == UPDATE_LEVEL_DOWNGRADING ){
                        return UPLOAD_DOWNGRADING;
                    }

                    //2.createPackage
                    try{
                        var createpkgRet = yield * me.createPackage(topkg,firms)();
                        var topkgid = createpkgRet.insertId;
                    }catch(e){
                        return UPDATE_CREATE_PACKAGE_FAIL;
                    }

                    //3.createProgram,can be obseleted
                    //var ret = yield * me.createProgram(topkgid,topkg,firms)();

                    //[{id:1,version:'0.0.1'},{id:2,version:'0.0.2'}]
                    var lessPkgs = yield * me.getLessPackages(topkgid,updatelevel,code)();
                    console.dir(lessPkgs);
                    for (let pkg of lessPkgs ){
                        var srcPkgPath = me.app.getUploadDir() + `package-${pkg.version}.json`;
                        var srcpkg = f.readFileSync(srcPkgPath);
                        srcpkg = JSON.parse(srcpkg);


                        //[{type:1,size:1,md5:'',path:'',version:''}]
                        var afterDiffs = yield * me.generateProgramDiff(srcpkg,topkg)();
                        for (let diff of afterDiffs ){
                            let pgm = UploadService.findProgram(topkg, diff.type);
                            Object.assign(pgm,{ type:diff.type, size:diff.size, md5:diff.md5} );
                        }


                        var filename = `${srcpkg.version}-${topkg.version}.zip`;
                        var zipPath = me.app.getUploadDir() + filename;

                        yield me.generateZip(topkg,afterDiffs,zipPath);

                        var packageUpdate = {};
                        var data = yield fs.readFile( zipPath );
                        var m5 = md5(data);
                        let oldStat = yield bfs.stat(zipPath);
                        var size = oldStat.size;

                        var uri = EasyNode.config('http.server.uploads.URI','http://127.0.0.1:6005/uploads/');
                        var url =  uri + filename;
                        Object.assign(packageUpdate,{srcpkgid:pkg.id,topkgid:topkgid,size:size,md5:m5,url:url});

                        //4.uploadToNOS
                        url = yield  me.uploadNos(filename,zipPath);
                        Object.assign(packageUpdate,{url:url});

                        //5. createPackageUpdate
                        var ret = yield * me.createPackageUpdate(packageUpdate)();
                    }
                    yield * me.conn.commit()();
                    return UPLOAD_SUCCESS;
                }catch(e){
                    EasyNode.DEBUG && logger.error(` ${e} ${e.stack}`);
                    yield * me.conn.rollback()();
                    return UPLOAD_UNKNOWN;
                }finally{
                    yield me.app.ds.releaseConnection(me.conn);
                }
            }
        }

        /**
         * @api:    校验固件MD5内容
         * @apiDescription:
         * @apiName {}
         * @apiGroup {}
         * @apiPermission {}
         * @apiSuccess true
         * @apiFail    false
         * @apiVersion {}
         * */
          validate (pkg = {},firms = []){
            return function * (){
                    for( var idx in firms ){
                        var ele = firms[idx];
                        var data = yield fs.readFile( ele.path );
                        var program = UploadService.findProgram (pkg, ele.type);
                        var temp = md5(data);

                        EasyNode.DEBUG && logger.debug(` program.md5 = ${program.md5} temp = ${temp} `);

                        if( program.md5 == temp ){

                        }else {
                            //throw new MyError(UPLOAD_MD5_FAIL);
                            return false;
                        }
                    }
                    return true;
            }
        }

        /**
         * @api: 安装包里找到类型为type的程序
         * @apiDescription:
         * @apiName
         * @apiGroup {}
         * @apiPermission {}
         * @apiSuccess {} {} {}
         * @apiVersion {}
         * */
        static findProgram( pkg,type ){
            var ret = {};
            if( !Array.isArray(pkg.programs) ){
                return ret;
            }
            pkg.programs.forEach( (ele,index) =>{
                if( ele.type == type ){
                    ret = ele;
                    return ele;
                }
            });
            return ret;
        }

        /**
         * @api: 固件包里查找类型为type的固件
         * @apiDescription: }
         * @apiName {}
         * @apiGroup {}
         * @apiPermission {}
         * @apiSuccess {} {} {}
         * @apiVersion {}
         * */
        static findFirm( firms, type ){
            var ret = {};
            for (let ele of firms ){
                if( ele.type == type ){
                    ret = ele;
                    return ele;
                }
            }
            return ret;
        }

        /**
         * @api:   生成包记录
         * @apiDescription: }
         * @apiName {}
         * @apiGroup {}
         * @apiPermission {}
         * @apiSuccess {insertId:1}
         * @apiVersion {}
         * */
        createPackage(pkg = {}, firms = []){
            var me = this;
            return function* (){
                var model = new Package();
                model.merge({
                    version: pkg.version,
                    code: UploadService.generateCode(pkg.version),
                    email: pkg.email,
                    creator: pkg.issuer,
                    createtime:  Date.now()
                });
                return yield me.conn.create(model);
            }
        }

        /**
         * @api: 1.0 获取id小于pkgId的包记录, 如果 level==UPDATE_LEVEL_MAJOR只返回最后最大的CODE记录,否则返回所有
         * @api: 1.1 获取id小于pkgId的包记录, 如果 level==UPDATE_LEVEL_MAJOR只返回最后最大的CODE记录,否则返回同Major下的所有
         * @apiDescription: }
         * @apiName
         * @apiGroup
         * @apiPermission
         * @apiSuccess [{id:1,version:'0.0.1'},{id:2,version:'0.0.2'}]
         * @apiVersion {}
         * */
        getLessPackages(pkgId,level,code){
            var me = this;
            return function* (){
                var sql = '';
                code = Math.pow(10,Math.trunc( Math.log10(code)));
                if( level == UPDATE_LEVEL_MINOR ){
                    sql = `SELECT id,version FROM watch_package WHERE id < #id# and code >= ${code}`;
                }else{
                    sql = 'SELECT id,version FROM watch_package WHERE id < #id# order by code DESC limit 1';
                }
                var args = {id:pkgId};
                return yield me.conn.execQuery(sql, args);
            }
        }

        /**
         * @api:  根据code值获取PkgID
         * @apiDescription: }
         * @apiName {}
         * @apiGroup {}
         * @apiPermission {}
         * @apiSuccess {} {} {}
         * @apiVersion {}
         * */
        getPkgIdByCode(code){
            var me = this;
            return function* (){
                var sql = 'SELECT id FROM watch_package WHERE code = #code#';
                var args = {code:code};
                return yield me.conn.execQuery(sql, args);
            }
        }

        /**
         * @api: 根据srcpkgid,topkgid查找升级包
         * @apiDescription: }
         * @apiName {}
         * @apiGroup {}
         * @apiPermission {}
         * @apiSuccess [{id:1,url:''},{}]
         * @apiVersion {}
         * */
        getPackageUpdate(srcpkgid,topkgid){
            var me = this;
            return function* (){
                var sql = 'SELECT id,url FROM watch_package_update WHERE srcpkgid = #srcpkgid# and topkgid = #topkgid#';
                var args = {srcpkgid:srcpkgid,topkgid:topkgid};
                return yield me.conn.execQuery(sql, args);
            }
        }


        /**
         * @api:  生成程序记录,useless, can b obseleted
         * @apiDescription: }
         * @apiName {}
         * @apiGroup {}
         * @apiPermission {}
         * @apiSuccess [{insertId:1,ele:{}}]
         * @apiVersion {}
         * */
        createProgram(pkgId,pkg = {}, firms = []){
            var me = this;
            return function* (){
                var model = new Program();
                var ret = [];
                var uri = EasyNode.config('http.server.uploads.URI','http://127.0.0.1:6005/uploads/');
                for (var ele of pkg.programs){
                    model.merge({
                        pkgid: pkgId,
                        type: ele.type,
                        size: ele.size,
                        md5: ele.md5,
                        version:  ele.version,
                        code: UploadService.generateCode(ele.version),
                        description: ele.describe,
                        enablediff: ele.enablediff,
                        blocksize: ele.blocksize,
                        sequence: ele.order,
                        url: uri+UploadService.findFirm(firms,ele.type).filename,
                        email: ele.email
                    });
                    var r = yield me.conn.create(model);
                    ret.push( {insertId:r.insertId,ele:ele});
                }
                return ret;
            }
        }

        /**
         * @api: 生成程序差分文件
         * @apiDescription: }
         * @apiName {}
         * @apiGroup {}
         * @apiPermission {}
         * @apiSuccess [{type:1,size:1,md5:'',path:'',version:''}]
         * @apiVersion {}
         * */
        generateProgramDiff(srcPkg,toPkg){
            var me = this;
            return function *(){
                var ret = [];

                for (let toPrg of toPkg.programs ){
                    var toPath = me.app.getUploadDir() + `${toPrg.type}-${toPrg.version}.bin`;
                    var srcPrg = UploadService.findProgram(srcPkg,toPrg.type);
                    var srcPath = me.app.getUploadDir() + `${srcPrg.type}-${srcPrg.version}.bin`;

                    if( !srcPrg.hasOwnProperty('version') ){//没找到,新程序
                        ret.push({type:toPrg.type,size:toPrg.size,md5:toPrg.md5,path:toPath,version:toPrg.version});
                    }else{//找到了
                        if( srcPrg.version != toPrg.version ){
                            try{
                                var size = 0;
                                var m5 = '';
                                var diffPath = me.app.getUploadDir() + `${toPrg.type}-${srcPrg.version}-${toPrg.version}.bin`;

                                if(toPrg.enablediff == 1){//以当前版本为准
                                    yield xdelta({oldPath: srcPath, newPath: toPath, diffPath: diffPath,size:srcPrg.blocksize});
                                }else{
                                    var fileService = new FileService();
                                    yield fileService.copyFile(toPath,diffPath);
                                }

                                var data = yield fs.readFile( diffPath );
                                m5 = md5(data);
                                let oldStat = yield bfs.stat(diffPath);
                                size = oldStat.size;

                                //计算size,md5,生成的path,
                                ret.push({type:toPrg.type,size:size,md5:m5,path:diffPath,version:toPrg.version});
                            }catch(e){
                                EasyNode.DEBUG && logger.error(`generateProgramDiff failed ${e}`,e.stack);
                            }
                        }
                    }
                }
                return ret;
            }
        }

        /*
        * Generate zip file, notice async opration to stream
        * */
        generateZip(topkg,afterDiffs,zipPath){
           return new Promise(function(res,rej){
                var output = f.createWriteStream(zipPath);
                var zipArchiver = archiver('zip');

                output.on('close',function(){
                    console.log(zipArchiver.pointer()+' total bytes');
                    console.log('archiver has been finalized and the output file descriptor has closed.');
                    res();
                });

                zipArchiver.on('error',function(err){
                    rej();
                    throw err;
                });

                zipArchiver.pipe(output);

                for( let diff of afterDiffs ){
                    zipArchiver.append(f.createReadStream(diff.path),{name:`${diff.type}-${diff.version}.bin`});
                }
               zipArchiver.append(new Buffer(JSON.stringify(topkg)),{name:'package.json'});

               zipArchiver.finalize();
            });
        }

        /**
         * @api: 生成升级记录
         * @apiDescription:   ,{srcpkgid:pkg.id,topkgid:topkgid,size:size,md5:md5,url:url})
         * @apiName {}
         * @apiGroup {}
         * @apiPermission {}
         * @apiSuccess insertId
         * @apiVersion
         * */
        createPackageUpdate(pu){
            var me = this;
            return function *(){
                var model = new PackageUpdate();
                model.merge( Object.assign({},pu) );
                var r = yield me.conn.create(model);
                return {insertId:r.insertId};
            }
        }

        /**
         * @api: 生成版本Code值, x.y.z, x:Major(0-99) y:Minor(0-99) z:Revision(0-99)
         * @apiDescription: }
         * @apiName {}
         * @apiGroup {}
         * @apiPermission {}
         * @apiSuccess {} {} {}
         * @apiVersion {}
         * */
        static generateCode(version){
            if( typeof(version) != 'string' )
                return 0;
            var arr = version.split('.');
            arr = arr.map( val => { return parseInt(val); } );
            return UploadService.calcCode(arr,arr.length-1,arr[arr.length-1]);
        }

        /**
         * @api:  尾递归调优计算版本Code值
         * @apiDescription: }
         * @apiName {}
         * @apiGroup {}
         * @apiPermission {}
         * @apiSuccess {} {} {}
         * @apiVersion {}
         * */
        static calcCode( arr, idx, total) {
            if (idx == 0) return total;
            return UploadService.calcCode(arr, idx-1, Math.pow(100,arr.length-idx) * arr[idx-1]+total);
        }

        /**
         * @api: 获取更新级别  UPDATE_LEVEL_MINOR or UPDATE_LEVEL_MAJOR
         * @apiDescription: }
         * @apiName {}
         * @apiGroup {}
         * @apiPermission {}
         * @apiSuccess Minor: UPDATE_LEVEL_MINOR, Major: UPDATE_LEVEL_MAJOR  {updatelevel,curcode}
         * @apiVersion {}
         * */
        getUpdateLevel(version){
            var me = this;
            return function* (){
                var curcode = UploadService.generateCode(version);
                var sql = 'SELECT max(code) as maxcode FROM watch_package';
                var args = {};
                var maxcodes = yield me.conn.execQuery(sql, args);
                if( maxcodes.length <= 0){
                    return {level:UPDATE_LEVEL_MINOR,code:curcode};
                }
                var maxcode = maxcodes[0].maxcode;
                if( maxcode > curcode ){
                    return {level:UPDATE_LEVEL_DOWNGRADING,code:curcode};
                }
                if( parseInt(curcode/10000) > parseInt(maxcode/10000)   ){
                    return {level:UPDATE_LEVEL_MAJOR,code:curcode};
                }
                return {level:UPDATE_LEVEL_MINOR,code:curcode};
            }
        }

        /**
         * @api: 查找同Major级别下code的最大值, code > code and code < Major * 10000 + 9999 order by code DESC limit 1
         * @apiDescription: }
         * @apiName {}
         * @apiGroup {}
         * @apiPermission {}
         * @apiSuccess [{id:1,code:2,version:'1.0.0'},{}]
         * @apiVersion {}
         * */
        siblingMaxCode(major=0,code=0){
            var me = this;
            return function* (){
                var maxcode = major * 10000 + 9999;
                var sql = 'SELECT id,code,version FROM watch_package WHERE code > #code# and code < #maxcode# order by code DESC limit 1';
                var args = {code:code, maxcode: maxcode};
                return yield me.conn.execQuery(sql, args);
            }
        }

        /**
         * @api: 查找高Major级别下Code的最小值, code >= parseInt(#code#/10000)*10000+10000 order by code asc
         * @apiDescription: (#code#+10000)不能生成sql语句
         * @apiName {}
         * @apiGroup {}
         * @apiPermission {}
         * @apiSuccess [{id:1,code:2,version:'1.0.0'},{}]
         * @apiVersion {}
         * */
        seniorMinCode(code=0){
            var me = this;
            return function* (){
                var sql = 'SELECT id,code,version FROM watch_package WHERE (code-10000) >= #code#  order by code asc limit 1';
                var args = {code:parseInt(code/10000)*10000};
                return yield me.conn.execQuery(sql, args);
            }
        }

        /**
         * @api: 获取所有版本信息,支持分页操作, list(model,condtion = {}, pagination = { page:1,rpp: DEFAULT_RPP },orderBy = [], condtionPattern = null }
         * @apiDescription: }
         * @apiName {}
         * @apiGroup {}
         * @apiPermission {}
         * @apiSuccess {} {} {}
         * @apiVersion {}
         * */
        getPackages(page){
            var me = this;
            return function* (){
                try{
                    var model = new PackageUpdate();
                    me.conn = yield  me.app.ds.getConnection();
                    return yield me.conn.list(model,{},{page:page});
                } catch(e){
                    EasyNode.DEBUG && logger.debug(` ${e} ${e.stack}`);
                    return {rows:0, pages:0, page:0, rpp:0,data:[]};
                }finally{
                    yield me.app.ds.releaseConnection(me.conn);
                }
            }
        }

        /**
         * @api:   上传文件至NOS,filename as the ObjectKey
         * @apiDescription:
         * @apiName {}
         * @apiGroup {}
         * @apiPermission {}
         * @apiSuccess {} {} {}
         * @apiVersion {}
         * */
        uploadNos(filename,path){
            return function* (){
                var url = `http://apollodev.nos.netease.com/${filename}`;
                let nos = new Nos('c92f74b0d48f4fb39271a1109da74cc2','f200fad9c6b541d28f01159de8d9ecea','apollodev');
                yield nos.upload(filename,path);
                nos = null;
                return url;
            }
        }

        /**
         * @api:
         * @apiDescription: 校验package-1.0.0.json文件格式
         * @apiName validatePacakge
         * @apiGroup UploadService
         * @apiPermission login
         *
         * @apiParam pkg  包版本描述信息
         * @apiParam filename  包文件名
         *
         * @apiSuccess  VALIDATE_PACKAGE_SUCCESS
         *
         * @apiError VALIDATE_PACKAGE_ERROR
         *
         * @apiVersion 0.0.1
         * */
        validatePackage(pkg,filename){
            if( typeof pkg != 'object'
                &&
                !pkg.hasOwnProperty('version')
                &&
                !pkg.hasOwnProperty('programs')
                &&
                typeof pkg.programs != 'object'
                &&
                pkg.programs.length == 0
            ){
                return VALIDATE_PACKAGE_ERROR;
            }

            if( /package-\d*(\.\d+){2}.json/.test(filename) == false ){
                return VALIDATE_PACKAGE_ERROR;
            }

            var ver = /\d+(\.\d+){2}/.exec(filename);
            //[ '1.0.2', '.2', index: 8, input: 'package-1.0.2.json' ]
            if( pkg.version != ver[0] ){
                return VALIDATE_PACKAGE_ERROR;
            }

            return  VALIDATE_PACKAGE_SUCCESS;
        }


        /**
         * @api:
         * @apiDescription: 校验固件程序格式与版本号
         * @apiName validateFirms
         * @apiGroup UploadService
         * @apiPermission login
         *
         * @apiParam pkg  包版本描述信息
         * @apiParam firms  固件程序数组
         * @apiParam firm.type  固件程序类型
         * @apiParam firm.path  固件程序路径
         * @apiParam firm.filename  固件程序文件名
         *
         * @apiSuccess  VALIDATE_PACKAGE_SUCCESS
         *
         * @apiError VALIDATE_PACKAGE_ERROR
         *
         * @apiVersion 0.0.1
         * */
        validateFirms(pkg,firms){
            if( typeof pkg != 'object'
                &&
                !pkg.hasOwnProperty('version')
                &&
                !pkg.hasOwnProperty('programs')
                &&
                typeof pkg.programs != 'object'
                &&
                pkg.programs.length == 0
            ){
                return VALIDATE_PACKAGE_ERROR;
            }

            if( typeof firms != 'object'
                &&
                firms.length == 0
            ){
                return VALIDATE_PACKAGE_ERROR;
            }

            for(let firm of firms){
                let ele = UploadService.findFirm(firms,firm.type);
                if( /^\d*-\d*(\.\d+){1}.bin/.test(ele.filename) == false ){
                    return VALIDATE_FIRMS_ERROR;
                }
                let ele2 = UploadService.findProgram(pkg,firm.type);
                let ver = /\d+(\.\d+){1}/.exec(ele.filename);
                if( ele2.version != ver[0] ){
                    console.dir(ver);
                    console.dir(ele);
                    console.log("2");
                    return VALIDATE_FIRMS_ERROR;
                }
            }

            return  VALIDATE_PACKAGE_SUCCESS;
        }

        getClassName() {
            return EasyNode.namespace(__filename);
        }
    }

    module.exports = UploadService;
})();