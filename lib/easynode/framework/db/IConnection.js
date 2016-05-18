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
         * 数据库连接接口，定义了访问数据库的接口函数。包括执行SQL语句，开启事务，提交、回滚事务以及对Model的CRUDL操作。
         * 数据库支持情况：
         *      mysql - since 0.1.0
         *
         * @class easynode.framework.db.IConnection
         * @extends easynode.GenericObject
         * @since 0.1.0
         * @author hujiabao
         * */

        var IConnection = function (_GenericObject) {
                _inherits(IConnection, _GenericObject);

                function IConnection() {
                        _classCallCheck(this, IConnection);

                        return _possibleConstructorReturn(this, Object.getPrototypeOf(IConnection).apply(this, arguments));
                }

                _createClass(IConnection, [{
                        key: 'execQuery',

                        /**
                         * 执行查询SQL，返回查询结果数组
                         *
                         * @method execQuery
                         * @param {String} sql 查询SQL模板语句。SELECT A.* FROM TABLE_A WHERE A.FIELD_A = #fieldA# AND A.FIELD_B = $fieldB$
                         *                      "#"表示转义参数，通常用于字符串、日期等数据类型
                         *                      "$"表示非转义参数，通常用于数值型或SQL子句，注意SQL注入风险。
                         * @param {Object/Array} args 模板替换参数，如果是对象，则按同名替换，如果是数组则逐个按顺序替换
                         * @return {Array} 查询结果，每个元素表示为一个JSON对象，具有与查询结果集列名完全同名的属性。
                         * @async
                         * @since 0.1.0
                         * @author hujiabao
                         * */
                        value: function execQuery(sql) {
                                var args = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

                                throw new Error('Abstract Method');
                        }

                        /**
                         * 执行更新SQL，返回影响行数
                         *
                         * @method execUpdate
                         * @param {String} sql 查询SQL模板语句。SELECT A.* FROM TABLE_A WHERE A.FIELD_A = #fieldA# AND A.FIELD_B = $fieldB$
                         *                      "#"表示转义参数，通常用于字符串、日期等数据类型
                         *                      "$"表示非转义参数，通常用于数值型或SQL子句，注意SQL注入风险。
                         * @param {Object/Array} args 模板替换参数，如果是对象，则按同名替换，如果是数组则逐个按顺序替换
                         * @return {Object} 返回更新语句影响行数和insertId，insertId表示自增列ID
                         *                              {
                         *                                      rowsAffected : 1,                       //更新影响行数
                         *                                      insertId : 0                                 //自增列ID
                         *                              }
                         * @async
                         * @since 0.1.0
                         * @author hujiabao
                         * */

                }, {
                        key: 'execUpdate',
                        value: function execUpdate(sql) {
                                var args = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

                                throw new Error('Abstract Method');
                        }

                        /**
                         * 启动事务
                         *
                         * @method beginTransaction
                         * @async
                         * @since 0.1.0
                         * @author hujiabao
                         * */

                }, {
                        key: 'beginTransaction',
                        value: function beginTransaction() {
                                throw new Error('Abstract Method');
                        }

                        /**
                         * 提交事务
                         *
                         * @method commit
                         * @async
                         * @since 0.1.0
                         * @author hujiabao
                         * */

                }, {
                        key: 'commit',
                        value: function commit() {
                                throw new Error('Abstract Method');
                        }

                        /**
                         * 回滚事务
                         *
                         * @method rollback
                         * @async
                         * @since 0.1.0
                         * @author hujiabao
                         * */

                }, {
                        key: 'rollback',
                        value: function rollback() {
                                throw new Error('Abstract Method');
                        }

                        /**
                         * 创建一个数据库模型。
                         *
                         * @method create
                         * @param {easynode.framework.mvc.Model} model 模型及值定义
                         * @async
                         * @since 0.1.0
                         * @author hujiabao
                         * */

                }, {
                        key: 'create',
                        value: function create(model) {
                                throw new Error('Abstract Method');
                        }

                        /**
                         * 从数据库读取一个模型。
                         *
                         * @method read
                         * @param {easynode.framework.mvc.Model} model 模型定义
                         * @since 0.1.0
                         * @author hujiabao
                         * */

                }, {
                        key: 'read',
                        value: function read(model, id) {
                                throw new Error('Abstract Method');
                        }

                        /**
                         * 更新数据库的一个模型。
                         *
                         * @method update
                         * @param {easynode.framework.mvc.Model} model 模型定义
                         * @async
                         * @since 0.1.0
                         * @author hujiabao
                         * */

                }, {
                        key: 'update',
                        value: function update(model) {
                                throw new Error('Abstract Method');
                        }

                        /**
                         * 从数据库删除一个或一组模型。
                         *
                         * @method del
                         * @param {easynode.framework.mvc.Model} model 模型定义
                         * @param {Array/int} ids 主键值数组或单个数值。数组时删除多个，单个数值时仅删除一个
                         * @async
                         * @since 0.1.0
                         * @author hujiabao
                         * */

                }, {
                        key: 'del',
                        value: function del(model) {
                                var ids = arguments.length <= 1 || arguments[1] === undefined ? [0] : arguments[1];

                                throw new Error('Abstract Method');
                        }

                        /**
                         * 从数据库查询模型集合。
                         *
                         * @method list
                         * @param {easynode.framework.mvc.Model} model 模型定义
                         * @param {Object/String} condition 查询条件，属性名应与查询字段相同，属性值的Notation表示如下：
                         *                      {
                         *                              exp : '=',                                                         //查询条件表达式:
                         *                                                                                                     // =, <>, !=, >, < , >= , <= : value可为任意类型
                         *                                                                                                     // like, startsWith, endsWith : value需要是字符串类型
                         *                                                                                                     // in, not-in : value需要为一个数组
                         *                                                                                                     // between : value需要为一个两个元素的数组\
                         *                              value : 'any type matched to the field'
                         *                      }
                         *                      当condition为String时，默认为：{condition : '=', value : '$string value'}
                         * @param {Object} pagination 分页参数, Notation : { page : 1, rpp : 20} page: 页号，rpp : 每页行数(rows per page)
                         * @param {Array} orderBy 排序方式，字符串数组，
                         *                              格式：[$fieldName ASC/DESC, $fieldName ASC/DESC]，使用空格来分隔排序字段和条件
                         * @param {String} conditionPattern 查询条件拼装模板, 为空时则默认按所传递条件的AND条件拼装，如果传递此值，
                         *                              必须以'AND '开头，使用'$'前后包裹字段名表示条件子句占位符，例：'AND ($pluginName$ OR $pluginVersion$) AND $jsonTest$'
                         *                              实际执行的SQL将替换各占位符为条件子句，如果条件子句没有传递，则条件子句为"1 = 1"，这会显得SQL
                         *                              比较啰嗦，但是会减少非常大的子符串操作工作量并且具有相当好的容错性，同时这会不给数据库带来
                         *                              过多的额外开销，因为数据库会在SQL解析时忽略这条条件子句。
                         * @return {Object} 分页查询结果, Notation : { rows, pages, page, rpp, data : [] } rows : 结果集总行数，pages : 结果集总页数, page, rpp同参数pagination
                         * @async
                         * @since 0.1.0
                         * @author hujiabao
                         * */

                }, {
                        key: 'list',
                        value: function list(model) {
                                var condition = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
                                var pagination = arguments.length <= 2 || arguments[2] === undefined ? { page: 1, rpp: DEFAULT_RPP } : arguments[2];
                                var orderBy = arguments.length <= 3 || arguments[3] === undefined ? [] : arguments[3];
                                var conditionPattern = arguments.length <= 4 || arguments[4] === undefined ? null : arguments[4];

                                throw new Error('Abstract Method');
                        }
                }, {
                        key: 'getClassName',
                        value: function getClassName() {
                                return EasyNode.namespace(__filename);
                        }
                }]);

                return IConnection;
        }(GenericObject);

        module.exports = IConnection;
})();