var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var GenericObject = using('easynode.GenericObject');
var TestCase = using('easynode.framework.test.TestCase');

(function() {
        /**
         * Class TestCaseRunner
         *
         * @class easynode.framework.test.TestCaseRunner
         * @extends easynode.GenericObject
         * @since 0.1.0
         * @author hujiabao
         * */
  class TestCaseRunner extends GenericObject {
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

    static *run(namespace) {
      var TC = using(namespace);
      var inst = new TC();
      if (!inst instanceof TestCase && typeof inst.start != 'function') {
        throw new Error('Invalid test case, a test case should inherit from easynode.framework.test.TestCase or contain a start() generator function.');
      }
      yield inst.start();
    }

    getClassName() {
      return EasyNode.namespace(__filename);
    }
        }

  module.exports = TestCaseRunner;
})();
