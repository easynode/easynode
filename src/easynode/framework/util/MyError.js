var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var GenericObject = using('easynode.GenericObject');

(function() {
    /**
     * Class MyError
     *
     * @class easynode.framework.util.MyError
     * @extends easynode.GenericObject
     * @since 0.1.0
     * @author allen.hu
     * */
  class MyError extends Error {
        /**
         * 构造函数。
         *
         * @method 构造函数
         * @since 0.1.0
         * @author allen.hu
         * */
    constructor(obj = {code:0, msg:'success'}) {
      super();
            // 调用super()后再定义子类成员。
      this.code = obj.code;
      this.message = obj.msg;
    }


    getClassName() {
      return EasyNode.namespace(__filename);
    }
    }

  module.exports = MyError;
})();
