"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Created by hujiabao on 8/19/15.
 */

var MyError = function (_Error) {
    _inherits(MyError, _Error);

    function MyError() {
        var obj = arguments.length <= 0 || arguments[0] === undefined ? { code: 0, msg: "success" } : arguments[0];

        _classCallCheck(this, MyError);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(MyError).call(this));

        _this.code = obj.code;
        _this.message = obj.msg;
        return _this;
    }

    return MyError;
}(Error);