'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var logger = using('easynode.framework.Logger').forFile(__filename);
var GenericObject = using('easynode.GenericObject');

(function () {
  /**
   * 服务状态统计实体类。
   *
   * @class easynode.framework.server.ServerStat
   * @extends easynode.GenericObject
   * @since 0.1.0
   * @author hujiabao
   * */

  var ServerStat = (function (_GenericObject) {
    _inherits(ServerStat, _GenericObject);

    /**
     * 构造函数。
     *
     * @method 构造函数
     * @since 0.1.0
     * @author hujiabao
     * */

    function ServerStat() {
      _classCallCheck(this, ServerStat);

      //调用super()后再定义子类成员。

      /**
       * 服务启动时间, 毫秒数
       * @property uptime
       * @type int
       * */

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ServerStat).call(this));

      _this.uptime = 0;

      /**
       * 当前连接数
       * @property connections
       * @type int
       * */
      _this.sessions = 0;

      /**
       * 服务自启动以来的连接数
       * @property totalSessions
       * @type int
       * */
      _this.totalSessions = 0;

      /**
       * 服务自启动以来的总事务数
       * @property transactions
       * @type int
       * */
      _this.transactions = 0;

      /**
       * 事务的最大耗时
       * @property maxCost
       * @type int
       * */
      _this.maxCost = 0;

      /**
       * 事务的最小耗时
       * @property maxCost
       * @type int
       * */
      _this.minCost = 0;

      /**
       * 事务总耗时
       * @property totalCost
       * @type int
       * */
      _this.totalCost = 0;
      return _this;
    }

    _createClass(ServerStat, [{
      key: 'getClassName',
      value: function getClassName() {
        return EasyNode.namespace(__filename);
      }
    }]);

    return ServerStat;
  })(GenericObject);

  module.exports = ServerStat;
})();