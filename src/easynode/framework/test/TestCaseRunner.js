'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var GenericObject = using('easynode.GenericObject');
var TestCase = using('easynode.framework.test.TestCase');

(function () {
        /**
         * Class TestCaseRunner
         *
         * @class easynode.framework.test.TestCaseRunner
         * @extends easynode.GenericObject
         * @since 0.1.0
         * @author hujiabao
         * */

        var TestCaseRunner = function (_GenericObject) {
                _inherits(TestCaseRunner, _GenericObject);

                /**
                 * 构造函数。
                 *
                 * @method 构造函数
                 * @since 0.1.0
                 * @author hujiabao
                 * */

                function TestCaseRunner() {
                        _classCallCheck(this, TestCaseRunner);

                        return _possibleConstructorReturn(this, Object.getPrototypeOf(TestCaseRunner).call(this));
                        //调用super()后再定义子类成员。
                }

                _createClass(TestCaseRunner, [{
                        key: 'getClassName',
                        value: function getClassName() {
                                return EasyNode.namespace(__filename);
                        }
                }], [{
                        key: 'run',
                        value: regeneratorRuntime.mark(function run(namespace) {
                                var TC, inst;
                                return regeneratorRuntime.wrap(function run$(_context) {
                                        while (1) {
                                                switch (_context.prev = _context.next) {
                                                        case 0:
                                                                TC = using(namespace);
                                                                inst = new TC();

                                                                if (!(!inst instanceof TestCase && typeof inst.start != 'function')) {
                                                                        _context.next = 4;
                                                                        break;
                                                                }

                                                                throw new Error('Invalid test case, a test case should inherit from easynode.framework.test.TestCase or contain a start() generator function.');

                                                        case 4:
                                                                _context.next = 6;
                                                                return inst.start();

                                                        case 6:
                                                        case 'end':
                                                                return _context.stop();
                                                }
                                        }
                                }, run, this);
                        })
                }]);

                return TestCaseRunner;
        }(GenericObject);

        module.exports = TestCaseRunner;
})();