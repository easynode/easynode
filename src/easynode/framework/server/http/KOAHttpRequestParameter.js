var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var GenericObject = using('easynode.GenericObject');
var ActionRequestParameter = using('easynode.framework.mvc.ActionRequestParameter');
var S = require('string');
var fs = require('fs');
var cofs = require('co-fs');
var path = require('path');
var UUID = require('uuid');

(function() {
        /**
         * KOAHttpRequestParameter提供了标准的获取HTTP参数或上传的文件的函数供下游middleware使用。
         *
         * @class easynode.framework.server.http.KOAHttpRequestParameter
         * @extends easynode.framework.mvc.ActionRequestParameter
         * @since 0.1.0
         * @author hujiabao
         * */
  class KOAHttpRequestParameter extends ActionRequestParameter {
                /**
                 * 构造函数。
                 *
                 * @method 构造函数
                 * @since 0.1.0
                 * @author hujiabao
                 * */
    constructor(query, parts, uploadDir) {
      super();
                        // 调用super()后再定义子类成员。
      parts.field = parts.field || {};
      parts.fields = parts.fields || [];
      parts.file = parts.file || {};
      parts.files = parts.files || [];

      this._query = query || {};
      this._parts = parts || {};
      this._uploadDir = uploadDir;

                        // this._parts.fields.forEach(f => {
                        //        EasyNode.DEBUG && logger.debug('---->' + JSON.stringify(f));
                        // });
                        //
                        // parts.files.forEach(file => {
                        //        EasyNode.DEBUG && logger.debug('---->' + JSON.stringify(file));
                        // });
                        //
                        // for(var key in this._query) {
                        //        if(this._query[key] != 'function') {
                        //                EasyNode.DEBUG && logger.debug(key + '=' + this._query[key]);
                        //        }
                        // }
    }

                /**
                 * 获取HTTP请求参数。注意：EasyNode使用'first'模式取query string参数，参数名相同时，先出现的值有效。
                 *
                 * @method param
                 * @param {String} name 参数名
                 * @param {String} where 从哪里取参数，枚举，可以为"query"(query string)，"body“(http body, POST时有效)，
                 *      "all"(body或query,body优先)，默认”all“
                 * @return {String} 参数值
                 * @since 0.1.0
                 * @author hujiabao
                 * */
    param(name, where = 'all', canNull = true) {
      var queryVal = this._query[name];
      var bodyVal = this._parts.field[name];

      if (canNull != true) {
        queryVal = queryVal || '';
        bodyVal = bodyVal || '';
      }

      switch (where) {
      case 'query' :
        {
          return queryVal;
        }
      case 'body' :
        {
          return bodyVal;
        }
      case 'all' :
        {
          return bodyVal ? bodyVal : queryVal;
        }
      }
    }

    hasParam(name, where = 'all') {
      switch (where) {
      case 'query' :
        return this._query.hasOwnProperty(name);
      case 'body' :
        return this._parts.field.hasOwnProperty(name);
      case 'all':
        return this._query.hasOwnProperty(name) || this._parts.field.hasOwnProperty(name);
      }
      return false;
    }

                /**
                 * 获取此上下文环境中指所有的参数。
                 *
                 * @method params
                 * @return {Object} json对象
                 * @since 0.1.0
                 * @author hujiabao
                 * */
    params() {
      var o = {};
      this.paramNames().forEach((name) => {
        o[name] = this.param(name);
      });
      return o;
    }

                /**
                 * 获取HTTP请求参数名称。
                 *
                 * @method paramNames
                 * @param {String} where 从哪里取参数名，枚举，可以为"query"(query string)，"body“(http body, POST时有效)，
                 *      "all"(body或query,body优先)，默认”all“
                 * @return {Array} 参数名
                 * @since 0.1.0
                 * @author hujiabao
                 * */
    paramNames(where = 'all') {
      if (!this._queryKeys) {
        this._queryKeys = [];
        for (var key in this._query) {
          if (typeof this._query[key] == 'string') {
            this._queryKeys.push(key);
          }
        }
      }

      if (!this._bodyKeys) {
        this._bodyKeys = [];
        for (var key in this._parts.field) {
          if (typeof this._query[key] == 'string') {
            this._bodyKeys.push(key);
          }
        }
      }

      if (!this._allKeys) {
        this._allKeys = _.union(this._queryKeys, this._bodyKeys);
      }

      switch (where) {
      case 'query' :
        {
          return this._queryKeys;
        }
      case 'body' :
        {
          return this._bodyKeys;
        }
      case 'all' :
        {
          return this._allKeys;
        }
      }
    }

                /**
                 * 获取上传的文件描述，POST且enctype="multipart-form-data"时有效。没有指定参数名的文件时，返回null。
                 *
                 * @method file
                 * @param {String} name 参数名（字段名）
                 * @return {object} 上传的文件描述。结构如下：
                 *                              {
                 *                                      field : 'file1',
                                                         name : 'xx.jpg',
                                                         mime : 'image/jpeg',
                                                         path : '/tmp/adksl1234j123/xx.jpg'
                 *                              }
                 * @since 0.1.0
                 * @author hujiabao
                 * */
    file(name) {
      if (this._parts.file) {
        var f = this._parts.file[name];
        if (f) {
          var size = 0;
          try {
            size = fs.statSync(f.path).size;
          } catch (e) {}
          return {
            field : f.fieldname,
            name : f.filename,
            mime : f.mime || f.mimeType,
            path : f.path,
            size : size
          };
        }
      }
    }

                /**
                 * 保存文件到上传目录。
                 *
                 * @method saveFile
                 * @param {String} name 参数名（字段名）
                 * @return {object} 上传的文件描述。结构参考：file()函数。
                 * @async
                 * @since 0.1.0
                 * @author hujiabao
                 * */
    saveFile(name) {
      var me = this;
      return function *() {
        var f = me.file(name);
        if (!f) {
          return null;
        }
                                // 在上传目录下创建日期目录
        var _date = new Date();
        var folder = EasyNode.real(EasyNode.config('easynode.servers.koa-HttpServer.uploadDir', 'www/uploads'));
        if (!fs.existsSync(folder)) {
          fs.mkdirSync(folder);
        }
        var datedir = _date.getFullYear();
        var mm = _date.getMonth() + 1;
        if (mm < 10) {
          datedir += '0' + mm;
        } else {
          datedir += mm.toString();
        }
        var dd = _date.getDate();
        if (dd < 10) {
          datedir += '0' + dd;
        } else {
          datedir += dd.toString();
        }
        folder = path.join(folder, datedir);
                                // 指定文件上传后的目录 - 示例为"images"目录。
        if (!fs.existsSync(folder)) {
          fs.mkdirSync(folder);
        }
        var unifiedDir = UUID.v4().replace(/\-.*$/, '');
        folder = path.join(folder, unifiedDir);
        if (!fs.existsSync(folder)) {
          fs.mkdirSync(folder);
        }
                                // 移动文件
        var targetFileRealPath = path.join(folder, f.name);
        var targetFileURI = path.join(EasyNode.config('easynode.servers.koa-HttpServer.uploadURIPrefix', '/uploads'), datedir + '/' + unifiedDir + '/' + f.name);
        if (fs.existsSync(targetFileRealPath)) {
          logger.warn('upload file exists, trying to save it again');
          return yield me.saveFile(name);
        }
        yield cofs.rename(f.path, targetFileRealPath);
        f.path = targetFileURI;
        return f;
      };
    }

                /**
                 * 枚举所有上传的文件参数名（字段名）。
                 *
                 * @method fileNames
                 * @param {String} name 参数名（字段名）
                 * @return {Array} 上传的所有文件参数名（字段名）
                 * @since 0.1.0
                 * @author hujiabao
                 * */
    fileNames() {
      var arr = [];
      for (var key in this._parts.file) {
        if (typeof this._parts.file[key] == 'object') {
          arr.push(key);
        }
      }
      return arr;
    }

    getClassName() {
      return EasyNode.namespace(__filename);
    }
        }

  module.exports = KOAHttpRequestParameter;
})();
