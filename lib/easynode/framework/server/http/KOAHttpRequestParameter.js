'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var GenericObject = using('easynode.GenericObject');
var ActionRequestParameter = using('easynode.framework.mvc.ActionRequestParameter');
var S = require('string');
var fs = require('fs');
var cofs = require('co-fs');
var path = require('path');
var UUID = require('uuid');

(function () {
  /**
   * KOAHttpRequestParameter提供了标准的获取HTTP参数或上传的文件的函数供下游middleware使用。
   *
   * @class easynode.framework.server.http.KOAHttpRequestParameter
   * @extends easynode.framework.mvc.ActionRequestParameter
   * @since 0.1.0
   * @author hujiabao
   * */

  var KOAHttpRequestParameter = function (_ActionRequestParamet) {
    _inherits(KOAHttpRequestParameter, _ActionRequestParamet);

    /**
     * 构造函数。
     *
     * @method 构造函数
     * @since 0.1.0
     * @author hujiabao
     * */

    function KOAHttpRequestParameter(query, parts, uploadDir) {
      _classCallCheck(this, KOAHttpRequestParameter);

      // 调用super()后再定义子类成员。

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(KOAHttpRequestParameter).call(this));

      parts.field = parts.field || {};
      parts.fields = parts.fields || [];
      parts.file = parts.file || {};
      parts.files = parts.files || [];

      _this._query = query || {};
      _this._parts = parts || {};
      _this._uploadDir = uploadDir;

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
      return _this;
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


    _createClass(KOAHttpRequestParameter, [{
      key: 'param',
      value: function param(name) {
        var where = arguments.length <= 1 || arguments[1] === undefined ? 'all' : arguments[1];
        var canNull = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

        var queryVal = this._query[name];
        var bodyVal = this._parts.field[name];

        if (canNull != true) {
          queryVal = queryVal || '';
          bodyVal = bodyVal || '';
        }

        switch (where) {
          case 'query':
            {
              return queryVal;
            }
          case 'body':
            {
              return bodyVal;
            }
          case 'all':
            {
              return bodyVal ? bodyVal : queryVal;
            }
        }
      }
    }, {
      key: 'hasParam',
      value: function hasParam(name) {
        var where = arguments.length <= 1 || arguments[1] === undefined ? 'all' : arguments[1];

        switch (where) {
          case 'query':
            return this._query.hasOwnProperty(name);
          case 'body':
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

    }, {
      key: 'params',
      value: function params() {
        var _this2 = this;

        var o = {};
        this.paramNames().forEach(function (name) {
          o[name] = _this2.param(name);
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

    }, {
      key: 'paramNames',
      value: function paramNames() {
        var where = arguments.length <= 0 || arguments[0] === undefined ? 'all' : arguments[0];

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
          case 'query':
            {
              return this._queryKeys;
            }
          case 'body':
            {
              return this._bodyKeys;
            }
          case 'all':
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

    }, {
      key: 'file',
      value: function file(name) {
        if (this._parts.file) {
          var f = this._parts.file[name];
          if (f) {
            var size = 0;
            try {
              size = fs.statSync(f.path).size;
            } catch (e) {}
            return {
              field: f.fieldname,
              name: f.filename,
              mime: f.mime || f.mimeType,
              path: f.path,
              size: size
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

    }, {
      key: 'saveFile',
      value: function saveFile(name) {
        var me = this;
        return regeneratorRuntime.mark(function _callee() {
          var f, _date, folder, datedir, mm, dd, unifiedDir, targetFileRealPath, targetFileURI;

          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  f = me.file(name);

                  if (f) {
                    _context.next = 3;
                    break;
                  }

                  return _context.abrupt('return', null);

                case 3:
                  // 在上传目录下创建日期目录
                  _date = new Date();
                  folder = EasyNode.real(EasyNode.config('easynode.servers.koa-HttpServer.uploadDir', 'www/uploads'));

                  if (!fs.existsSync(folder)) {
                    fs.mkdirSync(folder);
                  }
                  datedir = _date.getFullYear();
                  mm = _date.getMonth() + 1;

                  if (mm < 10) {
                    datedir += '0' + mm;
                  } else {
                    datedir += mm.toString();
                  }
                  dd = _date.getDate();

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
                  unifiedDir = UUID.v4().replace(/\-.*$/, '');

                  folder = path.join(folder, unifiedDir);
                  if (!fs.existsSync(folder)) {
                    fs.mkdirSync(folder);
                  }
                  // 移动文件
                  targetFileRealPath = path.join(folder, f.name);
                  targetFileURI = path.join(EasyNode.config('easynode.servers.koa-HttpServer.uploadURIPrefix', '/uploads'), datedir + '/' + unifiedDir + '/' + f.name);

                  if (!fs.existsSync(targetFileRealPath)) {
                    _context.next = 23;
                    break;
                  }

                  logger.warn('upload file exists, trying to save it again');
                  _context.next = 22;
                  return me.saveFile(name);

                case 22:
                  return _context.abrupt('return', _context.sent);

                case 23:
                  _context.next = 25;
                  return cofs.rename(f.path, targetFileRealPath);

                case 25:
                  f.path = targetFileURI;
                  return _context.abrupt('return', f);

                case 27:
                case 'end':
                  return _context.stop();
              }
            }
          }, _callee, this);
        });
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

    }, {
      key: 'fileNames',
      value: function fileNames() {
        var arr = [];
        for (var key in this._parts.file) {
          if (_typeof(this._parts.file[key]) == 'object') {
            arr.push(key);
          }
        }
        return arr;
      }
    }, {
      key: 'getClassName',
      value: function getClassName() {
        return EasyNode.namespace(__filename);
      }
    }]);

    return KOAHttpRequestParameter;
  }(ActionRequestParameter);

  module.exports = KOAHttpRequestParameter;
})();