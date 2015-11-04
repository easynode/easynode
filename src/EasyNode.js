require('date-utils');
var assert = require('assert');
var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var S = require('string');
var cofs = require('co-fs');
var os = require('os');

/**
 * 为简化API调用定义必要的全局函数，使用全局函数需要引入EasyNode.js，请在应用程序第一行引入EasyNode.js。<br>
 *      <h5>示例</h5>
 *      //bin/main.js。第一行<br>
 *      require('../src/EasyNode.js');<br>
 *      EasyNode.addSourceDirectory('test', 'demo','app');<br>
 *      EasyNode.addConfigFile('app.conf');<br>
 *      var Logger = using('easynode.framework.Logger');<br>
 *      Logger.getLogger().info('Hello, EasyNode');<br>
 *
 * @class EasyNode
 * */

var EasyNode = global.EasyNode = {};

/**
 * 返回指定名称的namespace，使用JSON对象来模拟namespace。
 *
 * @method _getNamespace
 * @since 0.1.0
 * @author zlbbq
 * @private
 * @param {String} name namespace字符串
 * @return {namespace} JSON模拟的namespace对象
 * @example
 *      var ns = _getNamespace('easynode.framework.Logger');                 //返回对象easynode.framework
 * @example
 *      var ns = _getNamespace('easynode.framework.*');                          //返回对象easynode.framework
 * */
function _getNamespace(name) {
        assert(typeof name == 'string', 'Invalid namespace type, need a String');
        var parts = name.split('.');
        parts = parts.splice(0, parts.length - 1);
        var ns = global;
        parts.forEach(function (v) {
                ns = ns[v];
                assert(ns != null, `Can not find class or namespace [${name}]`);
        });
        return ns;
}

/**
 * 初始化命名空间，using时自动调用。
 *
 * @method _initNamespaces
 * @since 0.1.0
 * @author zlbbq
 * @private
 * @example
 *      require('../src/EasyNode.js');
 *      EasyNode.addSourceDirectory('test', 'demo');                 // $EasyNode/test/,  $EasyNode/demo
 *      EasyNode.using('easynode.framework.Logger');
 */
function _initNamespaces() {
        if (!EasyNode._ns_resolved) {
                if (!EasyNode._src_folders) {
                        EasyNode._src_folders = ['src'];
                }

                var s = '';
                s += '//============DO NOT MODIFY THIS FILE, IT IS AUTO-GENERATED FOR CODE NOTIFICATION=============/\n\n';
                var namespaces = [];

                function _gen(root, folder, p) {
                        var files = fs.readdirSync(folder);
                        files.forEach(function (f) {
                                if (fs.statSync(path.join(folder, f)).isDirectory()) {
                                        var ns = (p.length > 0 ? (p + '.') : '') + f;
                                        var realNS = ns.slice(7);
                                        if (!_.contains(namespaces, ns)) {
                                                namespaces.push(ns);
                                                s += '/**\n' +
                                                        '* @namespace ' + realNS + '\n' +
                                                        '*/\n';
                                                s += ns + ' = ' + '{};\n\n';
                                        }
                                        _gen(root, path.join(folder, f), ns);
                                }
                        });
                }

                EasyNode._src_folders.forEach(function (src) {
                        _gen(src, EasyNode.real(src), 'global');
                });

                fs.writeFileSync(EasyNode.real('bin/resolved-namespaces.js'), s);
                // Evaluate namespace simulation
                eval(s);
                EasyNode._ns_resolved = true;
        }
}

/**
 * 字符串去两端空格。
 *
 * @method _trim
 * @since 0.1.0
 * @author zlbbq
 * @private
 * @example
 *      console.log(_trim('   abc   '));                        //print : 'abc'
 * */
function _trim(s) {
        s = s || '';
        if (typeof s == 'string') {
                return s.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
        }
        throw new TypeError('Not a string');
}

/**
 * 获取EasyNode的根目录。默认返回进程当前目录的父目录，因此需要在bin目录下启用nodejs；如果传递了命令行参数easynode-home，则返回该命令
 * 行参数指定的路径。
 *
 * @method home
 * @since 0.1.0
 * @author zlbbq
 * @static
 * @return {String} EasyNode根目录的绝对路径。
 * @example
 *      //在bin目录下启动：babel-node ./main.js
 *      console.log(EasyNode.home());                                            //print：/home/zlbbq/EasyNode
 * */
EasyNode.home = function () {
        return EasyNode.arg('easynode-home') || path.join(process.cwd(), '../');
};

/**
 * 相对路径转绝对路径。
 *
 * @method EasyNode.real
 * @since 0.1.0
 * @author zlbbq
 * @static
 * @param {String} p 相对路径
 * @return {String} 绝对路径
 * @example
 *      var path = 'src/EasyNode.js';
 *      console.log(EasyNode.real(path));                //print : /home/zlbbq/EasyNode/src/EasyNode.js
 * */
EasyNode.real = function (p) {
        return path.join(EasyNode.home(), p || '');
};

/**
 * JSON对象扩展，这个函数是underscore的extend函数的快捷方式，具体使用请参考underscore.extend()函数。
 *
 * @method extend
 * @since 0.1.0
 * @static
 * @author zlbbq
 * @param {...} JSON对象
 * @example
 *      var o = { a : 'a' };
 *      extend(o, { b : 'b'});          // o = { a : 'a', b : 'b'}
 * */
EasyNode.extend = function () {
        _.extend.apply(null, arguments);
};

/**
 * 获取命令行参数。一个命令行参数需要定义在入口js文件之后，并且格式为--$key=$value。<br>
 * babel-node main.js --easynode.app.name=MyApp
 *
 * @method arg
 * @since 0.1.0
 * @static
 * @author zlbbq
 * @param {String} name 配置项key。
 * @return {String} 配置值。
 * @example
 *      命令行参数：babel-node main.js --easynode.app.name=YourApp
 *      console.log(config('easynode.app.name'));                  //print : 'YourApp'
 */
EasyNode.arg = function (name) {
        if (!EasyNode._parsed_args) {
                EasyNode._parsed_args = {};
                var f = false;
                var argReg = /^\-\-(.*)=(.*)$/;
                process.argv.forEach(function (val) {
                        if (!f) {
                                if (val.match(/^\.\/.*\.js$/) || val.match(/^.*\.js$/)) {
                                        f = true;
                                }
                        }
                        else {
                                var p = argReg.exec(val);
                                if (p) {
                                        EasyNode._parsed_args[p[1]] = p[2];
                                }
                        }
                });
        }
        return EasyNode._parsed_args[name || ''];
};

/**
 * 向EasyNode添加配置文件。配置文件需要位于$EasyNode/etc/目录，默认的配置文件为：EasyNode.conf。该文件始终在所有的配置文件生效前被加载 。
 *
 * @method addConfigFile
 * @since 0.1.0
 * @static
 * @author zlbbq
 * @param {String} ... 配置文件名，可一次添加多个文件。
 * @throws {Error} 配置文件不存在。{TypeError} 参数非String类型。
 * @example
 *      require('../src/EasyNode.js');
 *      EasyNode.addConfigFile('app.conf', 'app1.conf', 'app2.conf');            // etc/app.conf, etc/app1.conf, etc/app2.conf
 *      EasyNode.console.log(config('easynode.app.name'));
 */
EasyNode.addConfigFile = function () {
        //清除配置缓存，如果配置文件发生变化
        EasyNode._config_cache = null;
        EasyNode._config_files = EasyNode._config_files || ['etc/EasyNode.conf'];
        var arr = _.toArray(arguments);
        arr.forEach(function (v) {
                if (_.isString(v)) {
                        if(v) {
                                var f = EasyNode.real(v);
                                if (!fs.existsSync(f)) {
                                        throw new Error(`Config file [${f}] is not found!`);
                                }
                                EasyNode._config_files.push(v);
                        }
                }
                else if (_.isArray(v)) {
                        addConfig.apply(null, v);
                }
                else {
                        throw new TypeError('Invalid config type!');
                }
        });
};

/**
 * 获取配置文件中的配置参数。配置参数默认为etc/EasyNode.conf，可以通过EasyNode.addConfigFile向EasyNode添加配置文件。<br>
 * 注意：如果命令行参数与配置项具有相同的key，则返回命令行参数值。
 *
 * @method config
 * @since 0.1.0
 * @static
 * @author zlbbq
 * @param {String} name 配置项key。
 * @return {String} 配置值。如果不传递任何参数，EasyNode则会加载配置文件，但不会返回任何值。
 * @example
 *      配置文件：etc/EasyNode.conf  ==> easynode.app.name = MyApp
 *      console.log(config('easynode.app.name'));                  //print : 'MyApp'
 *
 *      命令行参数：babel-node main.js --easynode.app.name=YourApp
 *      console.log(EasyNode.config('easynode.app.name'));                  //print : 'YourApp'
 */
EasyNode.config = function (name, defaultVal) {
        if (!EasyNode._config_cache) {
                EasyNode._config_cache = {};
                var cfgDirectory = EasyNode.real('');
                EasyNode._config_files = EasyNode._config_files || ['etc/EasyNode.conf'];
                EasyNode._config_files.forEach(function (v) {
                        var file = path.join(cfgDirectory, v);
                        var cfg = fs.readFileSync(file);
                        cfg = cfg.toString().split('\n');
                        cfg.forEach(function (c) {
                                if (c && c[0] != '#') {          //#is a comment flag
                                        c = c.split('=');
                                        c[0] = c[0] && _trim(c[0]);
                                        c[1] = c[1] && _trim(c[1]);
                                        for(var i = 2;i<c.length;i++) {
                                                c[1] += '=' + c[i];
                                        }
                                        if (c[0]) {
                                                if (EasyNode._config_cache[c[0]] !== undefined) {
                                                        console.warn(`***Warning : Duplicate config item [${c[0]}], value [${c[1]}] at [${file}] overwrote others.`);
                                                }
                                                EasyNode._config_cache[c[0]] = c[1];
                                        }
                                }
                        });
                });
        }
        if (typeof name == 'string') {
                var v = EasyNode._config_cache[name];
                //command line argument is able to overwrite EasyNode.conf configuration
                var clv = EasyNode.arg(name);
                clv = clv ? clv : v;
                return clv || defaultVal;
        }
};

/**
 * 获取字符串表，国际化支持。配置文件：etc/i18n_$locale.conf，格式与EasyNode.conf相同。
 *
 * @method i18n
 * @since 0.1.0
 * @static
 * @author zlbbq
 * @param {String} name 国际化字符串配置项key。
 * @param {String} prefix 如果传递此值，请始终传递__filename，__filename会被转成namespace(file) + '.' + name;
 * @return {String} 配置值。如果不传递任何参数，EasyNode则会加载国际化配置文件，但不会返回任何值。
 */
EasyNode.i18n = function (name, prefix = '') {
        if (prefix) {
                name = EasyNode.namespace(prefix) + '.' + name;
        }
        if (!EasyNode._i18n_cache) {
                EasyNode._i18n_cache = {};
                EasyNode._i18n_folders = EasyNode._i18n_folders || ['etc/i18n'];
                EasyNode._i18n_folders.forEach(v => {
                        var cfgDirectory = EasyNode.real(v);
                        var i18nFile = (EasyNode._locale || 'zh_CN') + '.conf';
                        var file = path.join(cfgDirectory, i18nFile);
                        var cfg = fs.readFileSync(file);
                        cfg = cfg.toString().split('\n');
                        cfg.forEach(function (c) {
                                if (c && c[0] != '#') {          //#is a comment flag
                                        c = c.split('=');
                                        c[0] = c[0] && _trim(c[0]);
                                        c[1] = c[1] && _trim(c[1]);
                                        if (c[0]) {
                                                if (EasyNode._i18n_cache[c[0]] !== undefined) {
                                                        console.warn(`***Warning : Duplicate config item [${c[0]}], value [${c[1]}] at [${file}] overwrote others.`);
                                                }
                                                EasyNode._i18n_cache[c[0]] = c[1];
                                        }
                                }
                        });
                });
        }
        if (typeof name == 'string') {
                var v = EasyNode._i18n_cache[name];
                return v || name;
        }
};

EasyNode.addi18nDirectory = function () {
        //清除i18n缓存
        EasyNode._i18n_cache = null;
        if (!EasyNode._i18n_folders) {
                EasyNode._i18n_folders = ['etc/i18n'];
        }
        var arr = _.toArray(arguments);
        arr.forEach(function (v) {
                if (_.isString(v)) {
                        var folder = EasyNode.real(v);
                        if (!fs.existsSync(folder)) {
                                throw new Error(`Can not found i18n folder [${folder}]`);
                        }
                        EasyNode._i18n_folders.push(v);
                }
                else if (_.isArray(v)) {
                        EasyNode.addi18nDirectory.apply(null, v);
                }
                else {
                        throw new TypeError('Invalid arguments!');
                }
        });
};

/**
 * 设置i18n Locale，系统默认'zh_CN'，i18n默认读取的配置文件为etc/i18n/$locale.conf，如：etc/i18n/zh_CN.conf。
 * 在使用i18n函数前调用此函数才能正确设置语言。
 *
 * @method setLocale
 * @since 0.1.0
 * @static
 * @author zlbbq
 * @param {String} locale 地区字符串。
 */
EasyNode.setLocale = function (locale = 'zh_CN') {
        EasyNode._locale = locale
};
/**
 * 获取i18n Locale，系统默认'zh_CN'，可通过启动参数--locale指定地区字符串
 * --locale=zh_CN
 *
 * @method getLocale
 * @since 0.1.0
 * @static
 * @author zlbbq
 */
EasyNode.getLocale = function () {
        return EasyNode._locale || EasyNode.arg('locale') || 'zh_CN';
};

/**
 * 获取文件的命名空间名称或全类名。
 *
 * @method namespace
 * @since 0.1.0
 * @author zlbbq
 * @static
 * @param {String} name 建议在源码文件中使用__filename或__dirname。
 * @return {String} 命名空间名称或全类名。
 * @throws {TypeError} 参数name不是一个字符串
 * @throws {Error} 源码文件不在src目录中。
 * @example
 *      //文件：src/easynode.framework.Logger.js
 *      console.log(EasyNode.namespace(__filename));             //print : easynode.framework.Logger
 *      console.log(EasyNode.namespace(__dirname));              //print : easynode.framework
 */

EasyNode.namespace = function (name) {
        assert(typeof name == 'string', 'Invalid name, need a String');
        assert(name.match(/.*\/src\/.*/), 'Source code is not in src folder');
        name = name.replace(/\.js/, '').replace(/^.*\/src\//gm, '');
        return name.replace(/\//gm, '.');
};

/**
 * 引用一个类、模块或者一个命名空间下所有的类或模块，取决于Node.js的导出。
 *
 * @method using
 * @since 0.1.0
 * @author zlbbq
 * @static
 * @param {String} name 全类名或命名空间名。
 * @param {boolean} throwError 是否在类或命名空间未找到时抛出异常，默认为true，当throwError为false时，如果没有找到相应的类或命名空间则返回null
 * @return {Object} 类，对象，或命名空间对象。
 * @example
 *      //引用一个类
 *      EasyNode.using('easynode.framework.Logger');
 *
 *      //引用easynode.framework命名空间下所有的类。
 *      EasyNode.using('easynode.framework.*');
 * @example
 *      var Logger = EasyNode.using('easynode.framework.Logger');
 *      Logger.getLogger().info('Hello, EasyNode');
 * @example
 *      EasyNode.using('easynode.framework.Logger');
 *      easynode.framework.Logger.getLogger().info('Hello, EasyNode');
 * @example
 *      var ns = using('easynode.framework.*');
 *      ns.Logger.getLogger().info('Hello, EasyNode');
 */
EasyNode.using = function (name, throwError = true) {
        if (!EasyNode._ns_resolved) {
                _initNamespaces();
        }
        if (typeof name == 'string') {
                var oName = name;
                var ns = _getNamespace(name);
                if (!EasyNode._using_cache) {
                        EasyNode._using_cache = {};
                }
                if (EasyNode._using_cache[name]) {
                        return EasyNode._using_cache[name];
                }
                name = name.replace(/\./gm, '/');
                if (name.match(/\/\*$/)) {
                        name = name.replace(/\/\*$/, '');
                        var folder;
                        var found = [];
                        EasyNode._src_folders.forEach(function (src) {
                                var file = path.join(EasyNode.real(src), name);
                                if (fs.existsSync(file)) {
                                        var fstat = fs.statSync(file);
                                        if (fstat.isDirectory()) {
                                                found.push(`[${oName}] was FOUND : [${file}]`);
                                                if (!folder) {
                                                        folder = file;
                                                }
                                        }
                                }
                        });
                        if (found.length > 1) {
                                found = found.join('\n');
                                console.warn(`***Warning: Ambiguous resource [${oName}] and the FIRST one was returned\n${found}`);
                        }
                        if (folder) {
                                var files = fs.readdirSync(folder);
                                var o = {};
                                files.forEach(function (f) {
                                        if (f.match(/\.js$/)) {
                                                f = f.replace(/\.js$/, '');
                                                var className = f;
                                                o[f] = require(path.join(folder, f));
                                                ns[className] = o[f];                                    //inject into namespace
                                        }
                                });
                                EasyNode._using_cache[oName] = o;
                                return o;
                        }
                        else {
                                if (throwError !== false) {
                                        throw new Error(`Resource [${oName}] not found!`);
                                }
                                else {
                                        return null;
                                }
                        }
                }
                else {
                        var o;
                        var f;
                        var found = [];
                        EasyNode._src_folders.forEach(function (src) {
                                var file = path.join(EasyNode.real(src), name + '.js');
                                if (fs.existsSync(file)) {
                                        var fstat = fs.statSync(file);
                                        if (fstat.isFile()) {
                                                found.push(`[${oName}] was FOUND : [${file}]`);
                                                if (!o) {
                                                        o = require(file);
                                                        f = file;
                                                }
                                        }
                                }
                        });
                        if (found.length > 1) {
                                found = found.join('\n');
                                console.warn(`***Warning: Ambiguous resource [${oName}] and the FIRST one was returned\n${found}`);
                        }
                        if (!o) {
                                if (throwError !== false) {
                                        throw new Error(`Resource [${oName}] not found!`);
                                }
                                else {
                                        return null;
                                }
                        }
                        var className = oName.split('.').splice(-1);
                        ns[className[0]] = o;                                                           //inject into namespace
                        EasyNode._using_cache[oName] = o;
                        return o;
                }
        }
};

/**
 * 获取指定命名空间或全类名的绝对路径。
 *
 * @method namespace2Path
 * @since 0.1.0
 * @author zlbbq
 * @async
 * @static
 * @param {String} namespace 命名空间或全类名。easynode.GenericObject
 * @throws {Error} 源码目录不存在。{TypeError} 参数非String类型。
 */
EasyNode.namespace2Path = function (namespace) {
        return function *() {
                EasyNode._src_pathCache = EasyNode._src_pathCache || {};
                if (EasyNode._src_pathCache[namespace]) {
                        return EasyNode._src_pathCache[namespace];
                }
                var p = null;
                var found = [];
                for (var i = 0; i < EasyNode._src_folders.length; i++) {
                        var src = EasyNode._src_folders[i];
                        var path2NS = namespace.replace(/\./gm, '/') + '.js';
                        var file = path.join(EasyNode.real(src), path2NS);
                        if (yield cofs.exists(file)) {
                                var fstat = yield cofs.stat(file);
                                if (fstat.isFile()) {
                                        found.push(`[${namespace}] was FOUND : [${file}]`);
                                        if (!p) {
                                                p = file;
                                        }
                                }
                        }
                        else {
                                path2NS = namespace.replace(/\./gm, '/');
                                file = path.join(EasyNode.real(src), path2NS);
                                if (yield cofs.exists(file)) {
                                        var fstat = yield cofs.stat(file);
                                        if (fstat.isDirectory()) {
                                                found.push(`[${namespace}] was FOUND : [${file}]`);
                                                if (!p) {
                                                        p = file;
                                                }
                                        }
                                }
                        }
                }
                if (found.length > 1) {
                        found = found.join('\n');
                        console.warn(`***Warning: Ambiguous resource [${namespace}] and the FIRST one was returned\n${found}`);
                }
                EasyNode._src_pathCache[namespace] = p;
                return p;
        }
};

/**
 * 向EasyNode添加一个源码目录，使用using引用一个类、对象或命名空间时，EasyNode在所有的源码目录下查找同
 * 名的目录或js文件，默认的源码目录为：$EasyNode/src/。
 * <h5>注意：为了识别不同目录下的命名空间，源码目录必须以'src'结尾的目录</h5>
 *
 * @method addSourceDirectory
 * @since 0.1.0
 * @author zlbbq
 * @static
 * @param {String} ... 源码目录，相对于EasyNode根目录。可一次添加多个源码目录。
 * @throws {Error} 源码目录不存在。{TypeError} 参数非String类型。
 * @example
 *      require('../src/EasyNode.js');
 *      EasyNode.addSourceDirectory('test', 'demo');                 // $EasyNode/test/,  $EasyNode/demo
 */
EasyNode.addSourceDirectory = function () {
        if (!EasyNode._src_folders) {
                EasyNode._src_folders = ['src'];
        }
        var arr = _.toArray(arguments);
        EasyNode._ns_resolved = false;                                  //clear easynode namespace cache
        arr.forEach(function (v) {
                if (_.isString(v)) {
                        if(v) {
                                assert(S(v).endsWith('src'), `Invalid source folder, a source folder must ends with 'src'`);
                                var folder = EasyNode.real(v);
                                if (!fs.existsSync(folder)) {
                                        throw new Error(`Can not found source folder [${folder}]`);
                                }
                                EasyNode._src_folders.push(v);
                        }
                }
                else if (_.isArray(v)) {
                        EasyNode.addSourceDirectory.apply(null, v);
                }
                else {
                        throw new TypeError('Invalid arguments');
                }
        });
};

/**
 * 创建一个实例，指定的namespace必须是一个全类名。即：Node.js的导出对象是一个类，或者是ES5的函数。
 * <h5>注意，该类必须能够通过无参构造器实例化。</h5>
 *
 * @method create
 * @since 0.1.0
 * @author zlbbq
 * @static
 * @param {String} namespace 全类名
 * @example
 *      require('../src/EasyNode.js');
 *      var plugin = EasyNode.create('easynode.framework.plugin.EasyNodePlugin');
 *      console.log(plugin.toJSON());
 */
EasyNode.create = function (namespace) {
        var Clazz = using(namespace);
        return new Clazz;
};

/**
 * 获取本机第一块以ethx命名的网卡的配置的第一个IP地址。
 *
 * @method getLocalIP
 * @return {String} 本地IP地址
 * @since 0.1.0
 * @author zlbbq
 * @static
 * @example
 *      require('../src/EasyNode.js');
 *      var plugin = EasyNode.create('easynode.framework.plugin.EasyNodePlugin');
 *      console.log(plugin.toJSON());
 */
EasyNode.getLocalIP = function () {
        if (EasyNode._localIP) {
                return EasyNode._localIP;
        }
        var ip = EasyNode.config('easynode.local.ip');
        if(!ip) {
                var ifaces = os.networkInterfaces();
                for (var iface in ifaces) {
                        if (iface.match(/eth\d+/) && ifaces[iface].length > 0) {             //标准Linux网卡：eth0, eth1
                                ip = ifaces[iface][0].address;
                                if (ip) {
                                        break;
                                }
                        }
                }
                ip = ip || '127.0.0.1';
        }
        return EasyNode._localIP = ip;
};

/**
 * 全局函数
 * @class 全局函数
 * */

/**
 * 引用一个类、对象或者一个命名空间下所有的类或对象。类或对象取决于nodejs的module.exports导出了什么。<br>
 *         <h3>这是EasyNode.using函数的快捷方式</h3>
 *
 * @method using
 * @since 0.1.0
 * @author zlbbq
 * @param {String} name 全类名或命名空间名。
 * @return {Object} 类，对象，或命名空间对象。
 * @example
 *      //引用一个类
 *      using('easynode.framework.Logger');
 *
 *      //引用easynode.framework命名空间下所有的类。
 *      using('easynode.framework.*');
 * @example
 *      var Logger = using('easynode.framework.Logger');
 *      Logger.getLogger().info('Hello, EasyNode');
 * @example
 *      using('easynode.framework.Logger');
 *      easynode.framework.Logger.getLogger().info('Hello, EasyNode');
 * @example
 *      var ns = using('easynode.framework.*');
 *      ns.Logger.getLogger().info('Hello, EasyNode');
 */
global.using = global.EasyNode.using;

EasyNode.DEBUG = true;