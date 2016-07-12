'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var GenericObject = using('easynode.GenericObject');

(function () {

  /**
  * Interface ITemplateViewRenderer
  *
  * @class easynode.framework.mvc.ITemplateViewRenderer
  * @extends easynode.GenericObject
  * @since 0.1.0
  * @author hujiabao
  * */

  var ITemplateViewRenderer = function (_GenericObject) {
    _inherits(ITemplateViewRenderer, _GenericObject);

    function ITemplateViewRenderer() {
      _classCallCheck(this, ITemplateViewRenderer);

      return _possibleConstructorReturn(this, Object.getPrototypeOf(ITemplateViewRenderer).apply(this, arguments));
    }

    _createClass(ITemplateViewRenderer, [{
      key: 'render',


      /**
       *
       * @method render
       * @param {easynode.framework.mvc.ActionResult} actionResult ActionResult
       * @param {String} template 模板字符串
       * @return {String} 模板渲染结果字符串
       * @abstract
       * @since 0.1.0
       * @author hujiabao
       * */
      value: function render(actionResult, template) {
        throw new Error('Abstract Method');
      }
    }, {
      key: 'getClassName',
      value: function getClassName() {
        return EasyNode.namespace(__filename);
      }
    }]);

    return ITemplateViewRenderer;
  }(GenericObject);

  module.exports = ITemplateViewRenderer;
})();