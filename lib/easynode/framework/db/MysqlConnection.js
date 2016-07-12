'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var IConnection = using('easynode.framework.db.IConnection');
var thunkify = require('thunkify');
var SqlUtil = using('easynode.framework.util.SqlUtil');
var S = require('string');
var _ = require('underscore');
var mysql = require('mysql');
var Model = using('easynode.framework.mvc.Model');
var util = require('util');

(function () {
  var DEFAULT_RPP = parseInt(EasyNode.config('easynode.framework.mvc.model.defaultRPP', '20'));
  var LOW_PERFORMANCE_SQL = parseInt(EasyNode.config('easynode.framework.db.execSQLWarning', '3000'));

  /**
   * Class MysqlConnection
   *
   * @class easynode.framework.db.MysqlConnection
   * @extends easynode.framework.db.IConnection
   * @since 0.1.0
   * @author hujiabao
   * */

  var MysqlConnection = function (_IConnection) {
    _inherits(MysqlConnection, _IConnection);

    /**
     * 构造函数。
     *
     * @method 构造函数
     * @since 0.1.0
     * @author hujiabao
     * */

    function MysqlConnection(rawConnection) {
      _classCallCheck(this, MysqlConnection);

      // 调用super()后再定义子类成员。

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(MysqlConnection).call(this));

      _this.rawConnection = rawConnection;
      return _this;
    }

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


    _createClass(MysqlConnection, [{
      key: 'execQuery',
      value: function execQuery(sql) {
        var args = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        var me = this;
        return regeneratorRuntime.mark(function _callee() {
          var finalSql, d, fnQuery, result, cost, ret, i;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  finalSql = SqlUtil.replaceMysqlArgs(sql, args);

                  EasyNode.DEBUG && logger.debug('original sql : ' + sql);
                  EasyNode.DEBUG && logger.debug('args :' + JSON.stringify(args));
                  EasyNode.DEBUG && logger.debug('executing sql : ' + finalSql);
                  d = new Date();
                  fnQuery = thunkify(me.rawConnection.query);
                  _context.next = 8;
                  return fnQuery.call(me.rawConnection, finalSql);

                case 8:
                  result = _context.sent;
                  cost = new Date() - d;

                  EasyNode.DEBUG && logger.debug('execute sql cost [' + cost + ']ms : ' + finalSql);
                  if (cost >= LOW_PERFORMANCE_SQL) {
                    logger.warn('***LOW performance SQL(' + cost + 'ms): ' + finalSql);
                  }
                  ret = [];

                  for (i = 0; i < result[0].length; i++) {
                    ret[i] = SqlUtil.mapEntity(result[0][i]);
                  }
                  return _context.abrupt('return', ret);

                case 15:
                case 'end':
                  return _context.stop();
              }
            }
          }, _callee, this);
        });
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
       *    {
       *      rowsAffected : 1,    //更新影响行数
       *      insertId : 0         //自增列ID
       *    }
       * @async
       * @since 0.1.0
       * @author hujiabao
       * */

    }, {
      key: 'execUpdate',
      value: function execUpdate(sql) {
        var args = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        var me = this;
        return regeneratorRuntime.mark(function _callee2() {
          var finalSql, d, fnQuery, result, cost;
          return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  finalSql = SqlUtil.replaceMysqlArgs(sql, args);

                  EasyNode.DEBUG && logger.debug('original sql : ' + sql);
                  EasyNode.DEBUG && logger.debug('args :' + JSON.stringify(args));
                  EasyNode.DEBUG && logger.debug('executing sql : ' + finalSql);
                  d = new Date();
                  fnQuery = thunkify(me.rawConnection.query);
                  _context2.next = 8;
                  return fnQuery.call(me.rawConnection, finalSql);

                case 8:
                  result = _context2.sent;
                  cost = new Date() - d;

                  EasyNode.DEBUG && logger.debug('execute sql cost [' + cost + ']ms : ' + finalSql);
                  if (cost >= LOW_PERFORMANCE_SQL) {
                    logger.warn('***LOW performance SQL(' + cost + 'ms): ' + finalSql);
                  }
                  return _context2.abrupt('return', {
                    affectedRows: result[0].affectedRows,
                    insertId: result[0].insertId
                  });

                case 13:
                case 'end':
                  return _context2.stop();
              }
            }
          }, _callee2, this);
        });
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
        var me = this;
        return regeneratorRuntime.mark(function _callee3() {
          var fnBeginTransaction;
          return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  EasyNode.DEBUG && logger.debug('begin mysql transaction...');
                  fnBeginTransaction = thunkify(me.rawConnection.beginTransaction);
                  _context3.next = 4;
                  return fnBeginTransaction.call(me.rawConnection);

                case 4:
                case 'end':
                  return _context3.stop();
              }
            }
          }, _callee3, this);
        });
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
        var me = this;
        return regeneratorRuntime.mark(function _callee4() {
          var fnCommit;
          return regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
              switch (_context4.prev = _context4.next) {
                case 0:
                  EasyNode.DEBUG && logger.debug('commit mysql transaction');
                  fnCommit = thunkify(me.rawConnection.commit);
                  _context4.next = 4;
                  return fnCommit.call(me.rawConnection);

                case 4:
                case 'end':
                  return _context4.stop();
              }
            }
          }, _callee4, this);
        });
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
        var me = this;
        return regeneratorRuntime.mark(function _callee5() {
          var fnRollback;
          return regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (1) {
              switch (_context5.prev = _context5.next) {
                case 0:
                  EasyNode.DEBUG && logger.debug('rollback mysql transaction');
                  fnRollback = thunkify(me.rawConnection.rollback);
                  _context5.next = 4;
                  return fnRollback.call(me.rawConnection);

                case 4:
                case 'end':
                  return _context5.stop();
              }
            }
          }, _callee5, this);
        });
      }

      /**
       * 创建一个数据库模型。
       *
       * @method create
       * @param {easynode.framework.mvc.Model} model 模型及值定义
       * @return {Object} 返回更新语句影响行数和insertId，insertId表示自增列ID
       *   {
       *    rowsAffected : 1, //更新影响行数
       *    insertId : 0      //自增列ID
       *   }
       * @async
       * @since 0.1.0
       * @author hujiabao
       * */

    }, {
      key: 'create',
      value: function create(model) {
        var me = this;
        return regeneratorRuntime.mark(function _callee6() {
          var d, sql, __table__, fields, __fields__, __quoteFields__, args;

          return regeneratorRuntime.wrap(function _callee6$(_context6) {
            while (1) {
              switch (_context6.prev = _context6.next) {
                case 0:
                  d = new Date();
                  sql = 'INSERT INTO $__table__$ ($__fields__$) VALUES ($__quoteFields__$)';
                  __table__ = model.getSchema();
                  fields = model.getFieldNames(false);
                  __fields__ = [];
                  __quoteFields__ = [];

                  fields.forEach(function (f) {
                    __fields__.push(SqlUtil.aliasReverse(f));
                    __quoteFields__.push('#' + f + '#');
                  });
                  __fields__ = __fields__.join(' , ');
                  __quoteFields__ = __quoteFields__.join(' , ');
                  sql = sql.replace(/\$__table__\$/, __table__).replace(/\$__fields__\$/, __fields__).replace(/\$__quoteFields__\$/, __quoteFields__);
                  args = model.getFieldValues();

                  EasyNode.DEBUG && console.dir(args);
                  EasyNode.DEBUG && logger.debug('Prepare create sql cost [' + (new Date() - d) + ']ms');
                  _context6.next = 15;
                  return me.execUpdate(sql, args);

                case 15:
                  return _context6.abrupt('return', _context6.sent);

                case 16:
                case 'end':
                  return _context6.stop();
              }
            }
          }, _callee6, this);
        });
      }

      /**
       * 从数据库读取一个模型。
       *
       * @method read
       * @param {easynode.framework.mvc.Model} model 模型定义
       * @return {Object} 查询结果，该元素表示为一个JSON对象，具有与模型列名完全同名的属性。
       * @since 0.1.0
       * @author hujiabao
       * */

    }, {
      key: 'read',
      value: function read(model, id) {
        assert(typeof id != null, 'Invalid argument');
        var me = this;
        return regeneratorRuntime.mark(function _callee7() {
          var d, sql, __view__, __fields__, __identityField__, ret;

          return regeneratorRuntime.wrap(function _callee7$(_context7) {
            while (1) {
              switch (_context7.prev = _context7.next) {
                case 0:
                  d = new Date();
                  sql = 'SELECT $__fields__$ FROM $__view__$ WHERE $__identityField__$ = #id#';
                  __view__ = model.getView();
                  __fields__ = [];

                  model.getFieldNames(true).forEach(function (f) {
                    __fields__.push(SqlUtil.aliasReverse(f));
                  });
                  __fields__ = __fields__.join(', ');
                  if (model.isRawView()) {
                    __view__ = '(' + __view__ + ') AS __TEMP__';
                  }
                  __identityField__ = SqlUtil.aliasReverse(model.getIdentifyField());

                  sql = sql.replace(/\$__fields__\$/, __fields__).replace(/\$__view__\$/, __view__).replace(/\$__identityField__\$/, __identityField__);
                  EasyNode.DEBUG && logger.debug('Prepare read sql cost [' + (new Date() - d) + ']ms');
                  _context7.next = 12;
                  return me.execQuery(sql, { id: id });

                case 12:
                  ret = _context7.sent;

                  assert(ret.length <= 1, 'Multi-records matched to the identity field, please set primary key or unique key on the identity field');

                  if (!(ret.length > 0)) {
                    _context7.next = 16;
                    break;
                  }

                  return _context7.abrupt('return', Model.normalizeJSON(model, ret[0]));

                case 16:
                  return _context7.abrupt('return', null);

                case 17:
                case 'end':
                  return _context7.stop();
              }
            }
          }, _callee7, this);
        });
      }

      /**
       * 更新数据库的一个模型。
       *
       * @method update,根据identityField字段来更新模型
       * @param {easynode.framework.mvc.Model} model 模型定义
       * @return {Object} 返回更新语句影响行数和insertId，insertId表示自增列ID
       *    {
       *      rowsAffected : 1,    //更新影响行数
       *      insertId : 0         //自增列ID
       *    }
       * @async
       * @since 0.1.0
       * @author hujiabao
       * */

    }, {
      key: 'update',
      value: function update(model) {
        var me = this;
        return regeneratorRuntime.mark(function _callee8() {
          var d, sql, __table__, fields, __set__, __identityAlias__, __identityField__;

          return regeneratorRuntime.wrap(function _callee8$(_context8) {
            while (1) {
              switch (_context8.prev = _context8.next) {
                case 0:
                  d = new Date();
                  sql = 'UPDATE $__table__$ SET $__set__$ WHERE $__identityField__$ = $__identityAlias__$';
                  __table__ = model.getSchema();
                  fields = model.getFieldNames(false);
                  __set__ = [];
                  __identityAlias__ = model.getIdentifyField();
                  __identityField__ = SqlUtil.aliasReverse(__identityAlias__);

                  fields.forEach(function (f) {
                    if (f != __identityAlias__ && model.getFieldValue(f) !== undefined) {
                      var colName = SqlUtil.aliasReverse(f);
                      __set__.push(colName + ' = #' + f + '#');
                    }
                  });
                  __set__ = __set__.join(', ');
                  sql = sql.replace(/\$__table__\$/, __table__).replace(/\$__set__\$/, __set__).replace(/\$__identityField__\$/, __identityField__).replace(/\$__identityAlias__\$/, '#' + __identityAlias__ + '#');
                  EasyNode.DEBUG && logger.debug('Prepare update sql cost [' + (new Date() - d) + ']ms');
                  _context8.next = 13;
                  return me.execUpdate(sql, model.getFieldValues());

                case 13:
                  return _context8.abrupt('return', _context8.sent);

                case 14:
                case 'end':
                  return _context8.stop();
              }
            }
          }, _callee8, this);
        });
      }

      /**
       * 从数据库删除一个或一组模型。
       *
       * @method del
       * @param {easynode.framework.mvc.Model} model 模型定义
       * @param {Array/int} ids 主键值数组或单个数值。数组时删除多个，单个数值时仅删除一个
       * @return {Object} 返回更新语句影响行数和insertId，insertId表示自增列ID
       *    {
       *      rowsAffected : 1,    //更新影响行数
       *      insertId : 0         //自增列ID
       *    }
       * @async
       * @since 0.1.0
       * @author hujiabao
       * */

    }, {
      key: 'del',
      value: function del(model) {
        var ids = arguments.length <= 1 || arguments[1] === undefined ? [0] : arguments[1];

        var me = this;
        assert(util.isArray(ids) || typeof ids == 'number', 'Invalid argument ids');
        return regeneratorRuntime.mark(function _callee9() {
          var d, sql, sIn, __table__, __identityAlias__, __identityField__;

          return regeneratorRuntime.wrap(function _callee9$(_context9) {
            while (1) {
              switch (_context9.prev = _context9.next) {
                case 0:
                  d = new Date();
                  sql = '';

                  if (util.isArray(ids)) {
                    sql = 'DELETE FROM $__table__$ WHERE $__identityField__$ in ($__ids__$)';
                    sIn = [];

                    ids.forEach(function (id) {
                      sIn.push(mysql.escape(id));
                    });
                    sql = sql.replace(/\$__ids__\$/, sIn.join(', '));
                  } else {
                    sql = 'DELETE FROM $__table__$ WHERE $__identityField__$ = $__ids__$';
                    sql = sql.replace(/\$__ids__\$/, mysql.escape(ids));
                  }
                  __table__ = model.getSchema();
                  __identityAlias__ = model.getIdentifyField();
                  __identityField__ = SqlUtil.aliasReverse(__identityAlias__);

                  sql = sql.replace(/\$__table__\$/, __table__).replace(/\$__identityField__\$/, __identityField__);
                  EasyNode.DEBUG && logger.debug('Prepare delete sql cost [' + (new Date() - d) + ']ms');
                  _context9.next = 10;
                  return me.execUpdate(sql);

                case 10:
                  return _context9.abrupt('return', _context9.sent);

                case 11:
                case 'end':
                  return _context9.stop();
              }
            }
          }, _callee9, this);
        });
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
       * @param {String/Function} conditionPattern 查询条件拼装模板, 为空时则默认按所传递条件的AND条件拼装，如果传递此值，
       *                              必须以'AND '开头，使用'$'前后包裹字段名表示条件子句占位符，例：'AND ($pluginName$ OR $pluginVersion$) AND $jsonTest$'
       *                              实际执行的SQL将替换各占位符为条件子句，如果条件子句没有传递，则条件子句为"1 = 1"，这会显得SQL
       *                              比较啰嗦，但是会减少非常大的子符串操作工作量并且具有相当好的容错性，同时这会不给数据库带来
       *                              过多的额外开销。
       *                              当conditionPattern为function时，使用该函数的返回值作为conditionPattern, 函数原型：function conditionPattern(condition, model){}
       * @return {Object} 分页查询结果, Notation : { rows, pages, page, rpp, data : [] } rows : 结果集总行数，pages : 结果集总页数, page, rpp同参数pagination
       * @async
       * @since 0.1.0
       * @author hujiabao
       * */

    }, {
      key: 'list',
      value: function list(model) {
        var condition = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
        var pagination = arguments.length <= 2 || arguments[2] === undefined ? {
          page: 1,
          rpp: DEFAULT_RPP
        } : arguments[2];
        var orderBy = arguments.length <= 3 || arguments[3] === undefined ? [] : arguments[3];
        var conditionPattern = arguments.length <= 4 || arguments[4] === undefined ? null : arguments[4];

        if (!pagination) {
          pagination = {};
        }
        if (!pagination.page) {
          pagination.page = 1;
        }
        if (!pagination.rpp) {
          pagination.rpp = DEFAULT_RPP;
        }
        if (typeof conditionPattern == 'function') {
          conditionPattern = conditionPattern(condition, model);
        }
        orderBy = orderBy || [];
        var me = this;
        return regeneratorRuntime.mark(function _callee10() {
          var ret, d, sql, countSql, conditionSqlParts, __view__, __fields__, tmpCountSql, conArgs, c, v, exp, conditionClause, orderClause, r, data, idx;

          return regeneratorRuntime.wrap(function _callee10$(_context10) {
            while (1) {
              switch (_context10.prev = _context10.next) {
                case 0:
                  ret = {
                    rows: 0,
                    pages: 0,
                    page: pagination.page,
                    rpp: pagination.rpp,
                    data: []
                  };
                  d = new Date();
                  sql = 'SELECT $__fields__$ FROM $__view__$ WHERE 1 = 1';
                  countSql = [];
                  conditionSqlParts = {};
                  __view__ = model.getView();
                  __fields__ = [];

                  model.getFieldNames(true).forEach(function (f) {
                    __fields__.push(SqlUtil.aliasReverse(f));
                  });
                  __fields__ = __fields__.join(', ');
                  // var __identityAlias__ = model.getIdentifyField();
                  // var __identityField__ = SqlUtil.aliasReverse(__identityAlias__);
                  if (model.isRawView()) {
                    __view__ = '(' + __view__ + ') AS __TEMP__';
                  }
                  sql = sql.replace(/\$__fields__\$/, __fields__).replace(/\$__view__\$/, __view__);
                  sql = [sql];
                  // var tmpCountSql = 'SELECT COUNT($__identityField__$) AS ROW_COUNT FROM $__view__$ WHERE 1 = 1';
                  tmpCountSql = 'SELECT COUNT(1) AS ROW_COUNT FROM $__view__$ WHERE 1 = 1';

                  countSql.push(tmpCountSql.replace(/\$__view__\$/, __view__));
                  conArgs = {};

                  for (c in condition) {
                    v = condition[c];

                    if (typeof v != 'function') {
                      if (typeof v == 'string') {
                        v = {
                          exp: '=',
                          value: v
                        };
                      }
                      exp = v.exp || '=';

                      me._makeConditionParts(exp, c, v.value, conditionSqlParts, conArgs);
                    }
                  }

                  // 确认查询子句的组合条件
                  conditionClause = me._makeConditionClause(conditionSqlParts, conditionPattern);

                  countSql.push(conditionClause);
                  sql.push(conditionClause);

                  // 查询结果
                  // 排序
                  if (orderBy.length > 0) {
                    sql.push('ORDER BY');
                    orderClause = [];

                    orderBy.forEach(function (o) {
                      o = o.replace(/\s+/, ' ');

                      var _o$split = o.split(' ');

                      var _o$split2 = _slicedToArray(_o$split, 2);

                      var field = _o$split2[0];
                      var order = _o$split2[1];

                      order = order || 'ASC';
                      field = SqlUtil.aliasReverse(field);
                      orderClause.push(field + ' ' + order);
                    });
                    sql.push(orderClause.join(', '));
                  }
                  // 分页
                  sql.push(SqlUtil.pagingToLimit(pagination));

                  // 查询行数
                  countSql = countSql.join(' ');
                  EasyNode.DEBUG && logger.debug('Prepare list sql cost [' + (new Date() - d) + ']ms');
                  _context10.next = 25;
                  return me.execQuery(countSql, conArgs);

                case 25:
                  r = _context10.sent;

                  ret.rows = r[0].rowCount || 0;
                  ret.pages = SqlUtil.calculatePages(ret.rows, ret.rpp);

                  if (!(ret.rows > 0)) {
                    _context10.next = 34;
                    break;
                  }

                  sql = sql.join(' ');
                  _context10.next = 32;
                  return me.execQuery(sql, conArgs);

                case 32:
                  data = _context10.sent;

                  // 处理结果
                  if (data) {
                    idx = 0;

                    data.forEach(function (row) {
                      data[idx++] = Model.normalizeJSON(model, row);
                    });
                    ret.data = data;
                  }

                case 34:
                  return _context10.abrupt('return', ret);

                case 35:
                case 'end':
                  return _context10.stop();
              }
            }
          }, _callee10, this);
        });
      }
    }, {
      key: '_makeConditionClause',
      value: function _makeConditionClause(conditionSqlParts, conditionPattern) {
        var conditionFields = [];
        if (!conditionPattern) {
          conditionPattern = '';
          for (var alias in conditionSqlParts) {
            conditionFields.push(alias);
            conditionPattern += 'AND $' + alias + '$ ';
          }
        }
        var s = conditionPattern;
        var regEx = /\$(\w*)\$/;
        while (true) {
          var arr = regEx.exec(s);
          if (!arr) {
            break;
          }
          s = s.replace(regEx, conditionSqlParts[arr[1]] || '1 = 0'); // 设置１= 0防止条件为空的情况
        }
        return s;
      }
    }, {
      key: '_makeConditionParts',
      value: function _makeConditionParts(expression, alias, v, sql, args) {
        if (v == null) {
          return;
        }
        var colName = SqlUtil.aliasReverse(alias);
        assert(typeof expression == 'string', 'Invalid condition, enumeration of condition is [=, >=, <=, <>, !=, like, startsWith(^), endsWith($), in(()), not-in(!()), between(-)]');
        expression = expression.toUpperCase();
        switch (expression) {
          case '=':
          case '<>':
          case '!=':
          case '>=':
          case '<=':
            {
              var temp = colName + ' ' + expression + ' #' + alias + '#';
              sql[alias] = temp;
              args[alias] = v;
              break;
            }
          case 'LIKE':
            {
              var temp = colName + ' LIKE #' + alias + '#';
              v = '%' + v + '%';
              sql[alias] = temp;
              args[alias] = v;
              break;
            }
          case 'STARTSWITH':
          case '^':
            {
              var temp = colName + ' LIKE #' + alias + '#';
              v = v + '%';
              sql[alias] = temp;
              args[alias] = v;
              break;
            }
          case 'ENDSWITH':
          case '$':
            {
              var temp = colName + ' LIKE #' + alias + '#';
              v = '%' + v;
              sql[alias] = temp;
              args[alias] = v;
              break;
            }
          case 'IN':
          case '()':
          case 'NOT-IN':
          case '!()':
            {
              assert(util.isArray(v) && v.length > 0, 'Invalid condition "in/not in", need Array value');
              var temp = colName + ' $__NOT__$ IN (';
              var s = [];
              if (expression == 'IN' || expression == '()') {
                temp = temp.replace(/\$__NOT__\$/, '');
              } else {
                temp = temp.replace(/\$__NOT__\$/, 'NOT');
              }
              var counter = 0;
              v.forEach(function (t) {
                s.push('#' + alias + '_' + counter + '#');
                args[alias + '_' + counter] = t;
                counter++;
              });
              temp += s.join(',') + ')';
              sql[alias] = temp;
              break;
            }
          case 'BETWEEN':
          case '-':
            {
              // assert(util.isArray(v) && v.length == 2, 'Invalid condition "between", need Array with 2 elements, and the first one must be lower than the second one');
              if (v.length == 2 && v[0] !== null && v[1] !== null) {
                var temp = colName + ' BETWEEN #' + alias + '_0# AND #' + alias + '_1#';
                sql[alias] = temp;
                args[alias + '_0'] = v[0];
                args[alias + '_1'] = v[1];
              } else if (v[0] === null) {
                var temp = colName + ' < #' + alias + '#';
                sql[alias] = temp;
                args[alias] = v[1];
              } else if (v.length == 1 || v[1] === null) {
                var temp = colName + ' >= #' + alias + '#';
                sql[alias] = temp;
                args[alias] = v[0];
              }
              break;
            }
          default:
            {
              throw new Error('Unknown condition [' + expression + ']');
            }
        }
      }
    }, {
      key: 'getClassName',
      value: function getClassName() {
        return EasyNode.namespace(__filename);
      }
    }]);

    return MysqlConnection;
  }(IConnection);

  module.exports = MysqlConnection;
})();