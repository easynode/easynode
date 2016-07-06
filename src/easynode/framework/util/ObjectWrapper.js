var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var GenericObject = using('easynode.GenericObject');
var thunkify = require('thunkify');
var http = require('http');
var URL = require('url');

(function() {
        /**
         * Class ObjectWrapper
         *
         * @class easynode.framework.util.ObjectWrapper
         * @extends easynode.GenericObject
         * @since 0.1.0
         * @author hujiabao
         * */
  class ObjectWrapper extends GenericObject {
                /**
                 * 构造函数。
                 *
                 * @method 构造函数
                 * @since 0.1.0
                 * @author hujiabao
                 * */
    constructor() {
      super();
                        // 调用super()后再定义子类成员。
    }

    getClassName() {
      return EasyNode.namespace(__filename);
    }
        }

  module.exports = ObjectWrapper;
})();
