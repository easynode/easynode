var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var GenericObject = using('easynode.GenericObject');
var fs = require('fs');
var S = require('string');

(function () {
    /**
     * Class FileService
     *
     * @class #NAMESPACE#.FileService
     * @extends easynode.GenericObject
     * @since 0.1.0
     * @author allen.hu
     * */
    class FileService extends GenericObject
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

            /**
             *  交互稿项目管理文件，默认配置项：id.manager.project.filename
             * @property _projectFileName
             * @type String
             * @private
             *
             * */
            var _projectFileName = EasyNode.real(EasyNode.config('id.manager.project.filename','/hzspeed/config/project.json'));

            /**
             *  设置交互稿管理文件。
             * @method setProjectFileName
             * @param {String} projectFileName 交互稿管理文件，相对路径
             * @since 0.1.0
             * @author allen.hu
             * */
            this.setProjectFileName = function(projectFileName) {
                _projectFileName = EasyNode.real(projectFileName);
            };

            /**
             *  获取交互稿管理文件。
             * @method getProjectFileName
             * @return {String} 返回交互稿管理文件
             * @since 0.1.0
             * @author allen.hu
             * */
            this.getProjectFileName = function() {
                return _projectFileName;
            };

            /**
             *  项目管理对象
             * @property _projectsMap
             * @type Map {key=name,value=versions:[]}
             * @private
             *
             * */
            var _projectsMap = new Map();

            /**
             *  返回项目管理对像
             * @method getProjectsMap
             * @return {Map} 返回项目管理对象
             * @since 0.1.0
             * @author allen.hu
             * */
            this.getProjectsMap = function() {
                return _projectsMap;
            };

        }

        /**
         *  增加一个项目,项目存储结构为[{name:'',all:[{version1},{version2}]}]
         * @method addProject
         * @param {Project} {name:'',version:{}}
         * @since 0.1.0
         * @author allen.hu
         * */
        addProject(project){
            assert(project != undefined,'Invalid argument');
            var projects = [];
            var projectExist = false;
            var versionExist = false;
            //1.确保文件存在
            if( fs.existsSync(this.getProjectFileName()) ){
             } else {
                fs.writeFileSync(this.getProjectFileName(), JSON.stringify(projects));
            }
            projects = fs.readFileSync(this.getProjectFileName(),'utf8');
            projects = JSON.parse(projects);
            projects.forEach( function(prj,j) {
                if( prj.name == project.name ){
                    //2.确保项目名称与版本号不重复
                    prj.versions.forEach( function(version,index){
                        if( version.version == project.version.version){
                            projects[j].versions[index] = project.version;
                            versionExist = true;
                        }
                   });
                    if( versionExist == false){
                        prj.versions.push(project.version);
                    }
                    projectExist = true;
                }
            });
            if( projectExist == false ){
                var item = {};
                item.versions = [];
                item.name = project.name;
                item.versions.push(project.version);
                projects.push(item);
                this.getProjectsMap().set(project.name,item)
            }

            //2.确保项目名称与版本号不重复
            //projects.forEach( project => {
            //    project.versions.forEach( version => {
            //        this.getVersionsMap().set(version.name + version.version,version);
            //    });
            //});
            //projects = [];
            //projects.push(...this.getProjectsMap().values());

            //3.写入文件
            fs.writeFileSync(this.getProjectFileName(), JSON.stringify(projects));

            //4.重新Reload
            if( projectExist ){
                this.getProjects(true);
            }
        }

        getProjects(reload=false){
            //如果this.projectsMap为空，从项目管理文件中读取项目配置信息，
            if( this.getProjectsMap().size == 0 || reload == true ){
                try{
                    this.getProjectsMap().clear();
                    var projects = fs.readFileSync(this.getProjectFileName(),'utf8');
                    projects = JSON.parse(projects);
                    projects.forEach( project => {
                        this.getProjectsMap().set(project.name,project);
                    });
                }catch(err){
                    EasyNode.DEBUG && logger.debug(`getProjectsFileName ${this.getProjectFileName()}`,err.message);
                }
            }

            return [...this.getProjectsMap().values()];
        }

        getProject(name,vernum){
            var ret = {};
            var projects = this.getProjects();
            projects.forEach(project => {
                if( name == project.name ){
                    project.versions.forEach(ver => {
                        if( vernum == ver.version ){
                            ret = ver;
                            //这里return不能立刻返回
                            //return ret;
                        }
                    });
               }
            });
            return ret;
        }

        /*
          有问题，通过删除，新增加来做
        * */
        updateProject(name,version,project){
            var prjOld = this.getProject(name,version);
            var prjNew = this.getProject(project.name,project.version);
            var projects = [];
            var versionExist = false;
            var projectExist = false;
            /*
            * 1.找到项目说明名字和版本有重复，或者没有修改，覆盖吧
            * */
            if( prjNew.hasOwnProperty('name')  ){
                //覆盖
                if( fs.existsSync(this.getProjectFileName()) ){
                } else {
                    fs.writeFileSync(this.getProjectFileName(), JSON.stringify(projects));
                }
                projects = fs.readFileSync(this.getProjectFileName(),'utf8');
                projects = JSON.parse(projects);
                projects.forEach( function(prj,j) {
                    if( prj.name == project.name ){
                        //2.确保项目名称与版本号不重复
                        prj.versions.forEach( function(version,index){
                            if( version.version == project.version.version){
                                projects[j].versions[index] = project.version;
                                versionExist = true;
                            }
                        });
                        if( versionExist == false){
                            prj.versions.push(project.version);
                        }
                        projectExist = true;
                    }
                });
                //3.写入文件
                fs.writeFileSync(this.getProjectFileName(), JSON.stringify(projects));

                //4.重新Reload
                if( projectExist ){
                    this.getProjects(true);
                }
            }else{//新增，同时删除老的
                if( fs.existsSync(this.getProjectFileName()) ){
                } else {
                    fs.writeFileSync(this.getProjectFileName(), JSON.stringify(projects));
                }
                projects = fs.readFileSync(this.getProjectFileName(),'utf8');
                projects = JSON.parse(projects);
                projects.forEach( function(prj,j) {
                    if( prj.name === prjOld.name ){
                        prj.versions.forEach( function(version,index){
                            if( version.version == prjOld.version){
                                projects[j].versions.splice(index,1);
                                versionExist = true;
                            }
                        });
                        if( projects[j].versions.length <= 0 ){
                            projects.splice(j,1);
                        }
                    }
                });
                //3.写入文件
                fs.writeFileSync(this.getProjectFileName(), JSON.stringify(projects));

                //4.重新Reload
                this.getProjects(true);
                //</>删除老的版本完成

                //添加新版本
                this.addProject(project);
            }
        }

        deleteProject(ver){
            var projects = [];
            if( fs.existsSync(this.getProjectFileName()) ){
            } else {
                fs.writeFileSync(this.getProjectFileName(), JSON.stringify(projects));
            }
            projects = fs.readFileSync(this.getProjectFileName(),'utf8');
            projects = JSON.parse(projects);
            projects.forEach( function(prj,j) {
                if( prj.name == ver.name ){
                    prj.versions.forEach( function(version,index){
                        if( version.version == ver.version.version){
                            projects[j].versions.splice(index,1);
                        }
                    });
                    if( projects[j].versions.length <= 0 ){
                        projects.splice(j,1);
                    }
                }
            });
            //3.写入文件
            fs.writeFileSync(this.getProjectFileName(), JSON.stringify(projects));

            //4.重新Reload
            this.getProjects(true);
            //</>删除老的版本完成
        }

        /*
         * copy file
         * filecopy有问题,改用emit方式
         * */
        copyFile(srcPath,toPath){
            return new Promise(function(res,rej){
                var readStream = fs.createReadStream(srcPath);
                var writeStream = fs.createWriteStream(toPath);

                writeStream.on('close',function(){
                    console.log(`finish file copy from ${srcPath} to ${toPath}`);
                    res();
                });

                readStream.on('error',function(err){
                    rej(err);
                    throw err;
                });
                writeStream.on('error',function(err){
                    rej(err);
                    throw err;
                });

                readStream.pipe(writeStream);
            });
        }

        getClassName()
        {
            return EasyNode.namespace(__filename);
        }
    }

    module.exports = FileService;
})();