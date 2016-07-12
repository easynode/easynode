'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var GenericObject = using('easynode.GenericObject');
var thunkify = require('thunkify');
var http = require('http');
var URL = require('url');

(function () {
  /**
   * Class ObjectWrapper
   *
   * @class easynode.framework.util.ObjectWrapper
   * @extends easynode.GenericObject
   * @since 0.1.0
   * @author hujiabao
   * */

  var ObjectWrapper = function (_GenericObject) {
    _inherits(ObjectWrapper, _GenericObject);

    /**
     * 构造函数。
     *
     * @method 构造函数
     * @since 0.1.0
     * @author hujiabao
     * */

    function ObjectWrapper() {
      _classCallCheck(this, ObjectWrapper);

      return _possibleConstructorReturn(this, Object.getPrototypeOf(ObjectWrapper).call(this));
      // 调用super()后再定义子类成员。
    }

    _createClass(ObjectWrapper, [{
      key: 'getClassName',
      value: function getClassName() {
        return EasyNode.namespace(__filename);
      }
    }]);

    return ObjectWrapper;
  }(GenericObject);

  module.exports = ObjectWrapper;
})();