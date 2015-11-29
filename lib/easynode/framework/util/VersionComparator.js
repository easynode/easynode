'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var GenericObject = using('easynode.GenericObject');

(function () {
        /**
         * Class VersionComparator
         *
         * @class easynode.framework.util.VersionComparator
         * @extends easynode.GenericObject
         * @since 0.1.0
         * @author hujiabao
         * */

        var VersionComparator = (function (_GenericObject) {
                _inherits(VersionComparator, _GenericObject);

                /**
                 * 构造函数。
                 *
                 * @method 构造函数
                 * @since 0.1.0
                 * @author hujiabao
                 * */

                function VersionComparator() {
                        _classCallCheck(this, VersionComparator);

                        return _possibleConstructorReturn(this, Object.getPrototypeOf(VersionComparator).call(this));
                        //调用super()后再定义子类成员。
                }

                /**
                 * 比较两个版本。v1 > v2 返回>0的整数，v1 = v2返回０，v1 < v2返回<０的整数。注意：1.0 = 0.1.0，你懂的
                 *
                 * @method compare
                 * @param {String} v1 版本号, 格式：major.minor.patch
                 * @param {String} v2 版本号, 格式：major.minor.patch
                 * @static
                 * @since 0.1.0
                 * @author hujiabao
                 * */

                _createClass(VersionComparator, [{
                        key: 'getClassName',
                        value: function getClassName() {
                                return EasyNode.namespace(__filename);
                        }
                }], [{
                        key: 'compare',
                        value: function compare(v1, v2) {
                                var _v1$split = v1.split('.');

                                var _v1$split2 = _slicedToArray(_v1$split, 3);

                                var major1 = _v1$split2[0];
                                var minor1 = _v1$split2[1];
                                var patch1 = _v1$split2[2];

                                var _v2$split = v2.split('.');

                                var _v2$split2 = _slicedToArray(_v2$split, 3);

                                var major2 = _v2$split2[0];
                                var minor2 = _v2$split2[1];
                                var patch2 = _v2$split2[2];

                                major1 = parseInt(major1);
                                major1 = isNaN(major1) ? 0 : major1;

                                minor1 = parseInt(minor1);
                                minor1 = isNaN(minor1) ? 0 : minor1;

                                patch1 = parseInt(patch1);
                                patch1 = isNaN(patch1) ? 0 : patch1;

                                major2 = parseInt(major2);
                                major2 = isNaN(major2) ? 0 : major2;

                                minor2 = parseInt(minor2);
                                minor2 = isNaN(minor2) ? 0 : minor2;

                                patch2 = parseInt(patch2);
                                patch2 = isNaN(patch2) ? 0 : patch2;

                                var t = major1 - major2;
                                if (t != 0) {
                                        return t;
                                }

                                t = minor1 - minor2;
                                if (t != 0) {
                                        return t;
                                }

                                return patch1 - patch2;
                        }
                }]);

                return VersionComparator;
        })(GenericObject);

        module.exports = VersionComparator;
})();