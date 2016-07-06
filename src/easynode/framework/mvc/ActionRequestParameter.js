var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var GenericObject = using('easynode.GenericObject');
var S = require('string');

(function() {
        /**
         *  抽象类，定义了获取Action参数的函数 。
         *
         * @class easynode.framework.mvc.ActionRequestParameter
         * @extends easynode.GenericObject
         * @abstract
         * @since 0.1.0
         * @author hujiabao
         * */
  class ActionRequestParameter extends GenericObject {
                /**
                 * 构造函数。
                 *
                 * @method 构造函数
                 * @since 0.1.0
                 * @author hujiabao
                 * */
    constructor() {
      super();
    }

                /**
                 * 获取HTTP请求参数。注意：EasyNode使用'first'模式取query string参数，参数名相同时，先出现的值有效。
                 *
                 * @method param
                 * @param {String} name 参数名
                 * @param {String} where 从哪里取参数，枚举，可以为"query"(query string)，"body“(http body, POST时有效)，
                 *      "all"(body或query,body优先)，默认”all“
                 * @return {String} 参数值
                 * @abstract
                 * @since 0.1.0
                 * @author hujiabao
                 * */
    param(name, where = 'all', canNull = true) {
      throw new Error('Abstract Method');
    }

                /**
                 * 是否传递了某个请求参数。
                 *
                 * @method hasParam
                 * @param {String} name 参数名
                 * @param {String} where 从哪里取参数，枚举，可以为"query"(query string)，"body“(http body, POST时有效)，
                 *      "all"(body或query,body优先)，默认”all“
                 * @return {boolean} 是否有此参数
                 * @abstract
                 * @since 0.1.0
                 * @author hujiabao
                 * */
    hasParam(name, where = 'all') {
      throw new Error('Abstract Method');
    }

                /**
                 * 获取HTTP请求参数名称。
                 *
                 * @method paramNames
                 * @param {String} where 从哪里取参数名，枚举，可以为"query"(query string)，"body“(http body, POST时有效)，
                 *      "all"(body或query,body优先)，默认”all“
                 * @return {Array} 参数名
                 * @abstract
                 * @since 0.1.0
                 * @author hujiabao
                 * */
    paramNames(where = 'all') {
      throw new Error('Abstract Method');
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
      throw new Error('Abstract Method');
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
      throw new Error('Abstract Method');
    }

                /**
                 * 枚举所有上传的文件参数名（字段名）。
                 *
                 * @method fileNames
                 * @param {String} name 参数名（字段名）
                 * @return {Array} 上传的所有文件参数名（字段名）
                 * @abstract
                 * @since 0.1.0
                 * @author hujiabao
                 * */
    fileNames() {
      throw new Error('Abstract Method');
    }

                /**
                 * 获取HTTP参数值，转成Number的整型。
                 *
                 * @method intParam
                 * @param {String} name 参数名
                 * @param {String} where query, body or both of two with 'all'
                 * @param {boolean} canNaN 是否允许NaN，如果是false, 当值为NaN时将被转成0
                 * @return {int}
                 * @since 0.1.0
                 * @author hujiabao
                 * */
    intParam(name, where = 'all', canNaN = true) {
      var val = parseInt(this.param(name, where));
      if (canNaN !== true && isNaN(val)) {
        return 0;
      }
      else {
        return val;
      }
    }

                /**
                 * 获取HTTP参数值，转成Number的整型。
                 *
                 * @method floatParam
                 * @param {String} name 参数名
                 * @param {String} where query, body or both of two with 'all'
                 * @param {boolean} canNaN 是否允许NaN，如果是false, 当值为NaN时将被转成0
                 * @return {float}
                 * @since 0.1.0
                 * @author hujiabao
                 * */
    floatParam(name, where = 'all', canNaN = true) {
      var val = parseFloat(this.param(name, where));
      if (canNaN !== true && isNaN(val)) {
        return 0;
      }
      return val;
    }

                /**
                 * 获取HTTP参数值，转成boolean型。
                 *
                 * @method booleanParam
                 * @param {String} name 参数名
                 * @param {String} where query, body or both of two with 'all'
                 * @return {boolean}
                 * @since 0.1.0
                 * @author hujiabao
                 * */
    booleanParam(name, where = 'all') {
      var v = this.param(name, where);
      return (v == null || v == 'null' || v == 'false' || v == 'FALSE' || v == 'False' || v === '0' || v == 0) ? false : true;
    }

                /**
                 * 获取HTTP参数值，转成数组型。
                 *
                 * @method booleanParam
                 * @param {String} name 参数名
                 * @param {String} type 数组中的元素实际类型，支持string, int, float, boolean, date, datetime, datetimeM
                 * @param {String} where query, body or both of two with 'all'
                 * @return {boolean}
                 * @since 0.1.0
                 * @author hujiabao
                 * */
    arrayParam(name, type = 'string', where = 'all', delimiter = ',') {
      var val = this.param(name, where);
      if (val) {
        val = val.split(delimiter);
        if (type != 'string') {
          var idx = 0;
          val.forEach((v) => {
            var rv = v;
            switch (type) {
            case 'int' :
              {
                rv = parseInt(v);
                break;
              }
            case 'float':
              {
                rv = parseFloat(v);
                break;
              }
            case 'boolean' :
              {
                rv = (v == null || v == 'null' || v == 'false' || v == 'FALSE' || v == 'False' || v === '0' || v == 0) ? false : true;
                break;
              }
            case 'date':
              {
                v = v || '';
                                                                // if(v.match(/^\d{4}\-\d{2}\-\d{2}.*$/)) {
                                                                //        v = v.substring(0, 10) + ' 00:00:00';
                                                                //        rv = new Date(Date.parse(v));
                                                                // }
                                                                // else {
                                                                //        rv = null;
                                                                // }
                if (!v) {
                  rv = null;
                }
                else {
                  rv = new Date(Date.parse(v));
                }
                break;
              }
            case 'datetimeM':
              {
                v = v || '';
                                                                // if(v.match(/^\d{4}\-\d{2}\-\d{2}\s\d{2}:\d{2}.*$/)) {
                                                                //        v = v.substring(0, 16) + ':00';
                                                                //        rv = new Date(Date.parse(v));
                                                                // }
                                                                // else {
                                                                //        rv = null;
                                                                // }
                if (!v) {
                  rv = null;
                }
                else {
                  rv = new Date(Date.parse(v));
                }
                break;
              }
            case 'datetime':
              {
                                                                // if(v.match(/^\d{4}\-\d{2}\-\d{2}\s\d{2}:\d{2}:\d{2}$/)) {
                                                                //        v = v.substring(0, 16) + ':00';
                                                                //        rv = new Date(Date.parse(v));
                                                                // }
                                                                // else {
                                                                //        rv = null;
                                                                // }
                if (!v) {
                  rv = null;
                }
                else {
                  rv = new Date(Date.parse(v));
                }
                break;
              }
            }
            val[idx++] = rv;
          });
        }
      }
      return val;
    }

                /**
                 * 获取HTTP参数值，转成日期型。日期格式需要是：YYYY-MM-DD HH24:MI:SS, 例：2015-05-13 12:00:00，可只传日期部分。
                 * 日期格式请参考：date-utils模块。
                 *
                 * @method dateParam
                 * @param {String} name 参数名
                 * @param {String} where query, body or both of two with 'all'
                 * @return {Date} 格式错误时返回null。
                 * @since 0.1.0
                 * @author hujiabao
                 * */
    dateParam(name, where = 'all') {
      var val = this.param(name, where);
      if (!val) {
        return null;
      }
                        // val = val || '';
                        // if(val.match(/^\d{4}\-\d{2}\-\d{2}$/)) {
                        //        val = val + ' 00:00:00';
                        // }
                        // else if(val.match(/^\d{4}\-\d{2}\-\d{2}\s\d{2}:\d{2}:?\d{0,2}$/)) {
                        //        val = val.substring(0, 10) + ' 00:00:00';
                        // }
                        // else {
                        //        return null;
                        // }
                        // return new Date(Date.parse(val));
      return new Date(Date.parse(val));
    }

                /**
                 * 获取HTTP参数值，转成日期时间型(精确到秒)。日期格式需要是：YYYY-MM-DD HH24:MI:SS, 例：2015-05-13 12:00:00，可只传日期部分。
                 * 日期格式请参考：date-utils模块。
                 *
                 * @method datetimeParam
                 * @param {String} name 参数名
                 * @param {String} where query, body or both of two with 'all'
                 * @return {Date} 格式错误时返回null。
                 * @since 0.1.0
                 * @author hujiabao
                 * */
    datetimeParam(name, where = 'all') {
      var val = this.param(name, where);
      if (!val) {
        return null;
      }
                        // val = val || '';
                        // if(val.match(/^\d{4}\-\d{2}\-\d{2}$/)) {
                        //        val = val + ' 00:00:00';
                        // }
                        // else if(val.match(/^\d{4}\-\d{2}\-\d{2}\s\d{2}:\d{2}:\d{2}$/)) {
                        //        return new Date(Date.parse(val));
                        // }
                        // else {
                        //        return null;
                        // }
      return new Date(Date.parse(val));
    }

                /**
                 * 获取HTTP参数值，转成日期时间型(精确到分钟)。日期格式需要是：YYYY-MM-DD HH24:MI:SS, 例：2015-05-13 12:00:00，可只传日期部分。
                 * 日期格式请参考：date-utils模块。
                 *
                 * @method datetimeMParam
                 * @param {String} name 参数名
                 * @param {String} where query, body or both of two with 'all'
                 * @return {Date} 格式错误时返回null。
                 * @since 0.1.0
                 * @author hujiabao
                 * */
    datetimeMParam(name, where = 'all') {
      var val = this.param(name, where);
      if (!val) {
        return null;
      }
                        // val = val || '';
                        // if(val.match(/^\d{4}\-\d{2}\-\d{2}$/)) {
                        //        val = val + ' 00:00:00';
                        // }
                        // else if(val.match(/^\d{4}\-\d{2}\-\d{2}\s\d{2}:\d{2}$/)) {
                        //        val = val + ':00';
                        // }
                        // else if(val.match(/^\d{4}\-\d{2}\-\d{2}\s\d{2}:\d{2}:\d{2}$/)) {
                        //        val = val.substring(0, 16) + ':00';
                        // }
                        // else {
                        //        return null;
                        // }
                        // return new Date(Date.parse(val));
      return new Date(Date.parse(val));
    }

                /**
                 * 保存指定的文件，获取HTTP参数值，转成文件对象，语义化函数，同saveFile()函数。
                 *
                 * @method fileParam
                 * @param {String} name 参数名
                 * @return {Object} Notation参考file函数。
                 * @since 0.1.0
                 * @author hujiabao
                 * */
    fileParam(name) {
      return this.saveFile(name);
    }

    getClassName() {
      return EasyNode.namespace(__filename);
    }
        }

  module.exports = ActionRequestParameter;
})();
