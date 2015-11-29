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
        class MysqlConnection extends IConnection {
                /**
                 * 构造函数。
                 *
                 * @method 构造函数
                 * @since 0.1.0
                 * @author hujiabao
                 * */
                constructor(rawConnection) {
                        super();
                        //调用super()后再定义子类成员。
                        this.rawConnection = rawConnection;
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
                execQuery(sql, args = {}) {
                        var me = this;
                        return function * () {
                                var finalSql = SqlUtil.replaceMysqlArgs(sql, args);
                                EasyNode.DEBUG && logger.debug('original sql : ' + sql);
                                EasyNode.DEBUG && logger.debug('args :' + JSON.stringify(args));
                                EasyNode.DEBUG && logger.debug('executing sql : ' + finalSql);
                                var d = new Date();
                                var fnQuery = thunkify(me.rawConnection.query);
                                var result = yield fnQuery.call(me.rawConnection, finalSql);
                                var cost = new Date() - d;
                                EasyNode.DEBUG && logger.debug(`execute sql cost [${cost}]ms : ${finalSql}`);
                                if (cost >= LOW_PERFORMANCE_SQL) {
                                        logger.warn(`***LOW performance SQL(${cost}ms): ${finalSql}`);
                                }
                                var ret = [];
                                for (var i = 0; i < result[0].length; i++) {
                                        ret[i] = SqlUtil.mapEntity(result[0][i]);
                                }
                                return ret;
                        };
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
                execUpdate(sql, args = {}) {
                        var me = this;
                        return function * () {
                                var finalSql = SqlUtil.replaceMysqlArgs(sql, args);
                                EasyNode.DEBUG && logger.debug('original sql : ' + sql);
                                EasyNode.DEBUG && logger.debug('args :' + JSON.stringify(args));
                                EasyNode.DEBUG && logger.debug('executing sql : ' + finalSql);
                                var d = new Date();
                                var fnQuery = thunkify(me.rawConnection.query);
                                var result = yield fnQuery.call(me.rawConnection, finalSql);
                                var cost = new Date() - d;
                                EasyNode.DEBUG && logger.debug(`execute sql cost [${cost}]ms : ${finalSql}`);
                                if (cost >= LOW_PERFORMANCE_SQL) {
                                        logger.warn(`***LOW performance SQL(${cost}ms): ${finalSql}`);
                                }
                                return {
                                        affectedRows: result[0].affectedRows,
                                        insertId: result[0].insertId
                                };
                        };
                }

                /**
                 * 启动事务
                 *
                 * @method beginTransaction
                 * @async
                 * @since 0.1.0
                 * @author hujiabao
                 * */
                beginTransaction() {
                        var me = this;
                        return function * () {
                                EasyNode.DEBUG && logger.debug('begin mysql transaction...');
                                var fnBeginTransaction = thunkify(me.rawConnection.beginTransaction);
                                yield fnBeginTransaction.call(me.rawConnection);
                        };
                }

                /**
                 * 提交事务
                 *
                 * @method commit
                 * @async
                 * @since 0.1.0
                 * @author hujiabao
                 * */
                commit() {
                        var me = this;
                        return function * () {
                                EasyNode.DEBUG && logger.debug('commit mysql transaction');
                                var fnCommit = thunkify(me.rawConnection.commit);
                                yield fnCommit.call(me.rawConnection);
                        };
                }

                /**
                 * 回滚事务
                 *
                 * @method rollback
                 * @async
                 * @since 0.1.0
                 * @author hujiabao
                 * */
                rollback() {
                        var me = this;
                        return function * () {
                                EasyNode.DEBUG && logger.debug('rollback mysql transaction');
                                var fnRollback = thunkify(me.rawConnection.rollback);
                                yield fnRollback.call(me.rawConnection);
                        };
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
                create(model) {
                        var me = this;
                        return function * () {
                                var d = new Date();
                                var sql = 'INSERT INTO $__table__$ ($__fields__$) VALUES ($__quoteFields__$)';
                                var __table__ = model.getSchema();
                                var fields = model.getFieldNames(false);
                                var __fields__ = [];
                                var __quoteFields__ = [];
                                fields.forEach(f => {
                                        __fields__.push(SqlUtil.aliasReverse(f));
                                        __quoteFields__.push(`#${f}#`);
                                });
                                __fields__ = __fields__.join(' , ');
                                __quoteFields__ = __quoteFields__.join(' , ');
                                sql = sql.replace(/\$__table__\$/, __table__)
                                        .replace(/\$__fields__\$/, __fields__)
                                        .replace(/\$__quoteFields__\$/, __quoteFields__);
                                var args = model.getFieldValues();
                                EasyNode.DEBUG && console.dir(args);
                                EasyNode.DEBUG && logger.debug(`Prepare create sql cost [${new Date() - d}]ms`);
                                return yield me.execUpdate(sql, args);
                        };
                }

                /**
                 * 从数据库读取一个模型。
                 *
                 * @method read
                 * @param {easynode.framework.mvc.Model} model 模型定义
                 * @since 0.1.0
                 * @author hujiabao
                 * */
                read(model, id) {
                        assert(typeof id != null, 'Invalid argument');
                        var me = this;
                        return function * () {
                                var d = new Date();
                                var sql = 'SELECT $__fields__$ FROM $__view__$ WHERE $__identityField__$ = #id#';
                                var __view__ = model.getView();
                                var __fields__ = [];
                                model.getFieldNames(true).forEach(f => {
                                        __fields__.push(SqlUtil.aliasReverse(f));
                                });
                                __fields__ = __fields__.join(', ');
                                if (model.isRawView()) {
                                        __view__ = `(${__view__}) AS __TEMP__`;
                                }
                                var __identityField__ = SqlUtil.aliasReverse(model.getIdentifyField());
                                sql = sql.replace(/\$__fields__\$/, __fields__)
                                        .replace(/\$__view__\$/, __view__)
                                        .replace(/\$__identityField__\$/, __identityField__);
                                EasyNode.DEBUG && logger.debug(`Prepare read sql cost [${new Date() - d}]ms`);
                                var ret = yield me.execQuery(sql, {id: id});
                                assert(ret.length <= 1, 'Multi-records matched to the identity field, please set primary key or unique key on the identity field');
                                if (ret.length > 0) {
                                        return Model.normalizeJSON(model, ret[0]);
                                }
                                return null;
                        };
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
                update(model) {
                        var me = this;
                        return function * () {
                                var d = new Date();
                                var sql = 'UPDATE $__table__$ SET $__set__$ WHERE $__identityField__$ = $__identityAlias__$';
                                var __table__ = model.getSchema();
                                var fields = model.getFieldNames(false);
                                var __set__ = [];
                                var __identityAlias__ = model.getIdentifyField();
                                var __identityField__ = SqlUtil.aliasReverse(__identityAlias__);
                                fields.forEach(f => {
                                        if (f != __identityAlias__ && model.getFieldValue(f) !== undefined) {
                                                var colName = SqlUtil.aliasReverse(f);
                                                __set__.push(`${colName} = #${f}#`);
                                        }
                                });
                                __set__ = __set__.join(', ');
                                sql = sql.replace(/\$__table__\$/, __table__)
                                        .replace(/\$__set__\$/, __set__)
                                        .replace(/\$__identityField__\$/, __identityField__)
                                        .replace(/\$__identityAlias__\$/, `#${__identityAlias__}#`);
                                EasyNode.DEBUG && logger.debug(`Prepare update sql cost [${new Date() - d}]ms`);
                                return yield me.execUpdate(sql, model.getFieldValues());
                        };
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
                del(model, ids = [0]) {
                        var me = this;
                        assert(util.isArray(ids) || typeof ids == 'number', 'Invalid argument ids');
                        return function * () {
                                var d = new Date();
                                var sql = '';
                                if (util.isArray(ids)) {
                                        sql = 'DELETE FROM $__table__$ WHERE $__identityField__$ in ($__ids__$)';
                                        var sIn = [];
                                        ids.forEach(id => {
                                                sIn.push(mysql.escape(id));
                                        });
                                        sql = sql.replace(/\$__ids__\$/, sIn.join(', '));
                                }
                                else {
                                        sql = 'DELETE FROM $__table__$ WHERE $__identityField__$ = $__ids__$';
                                        sql = sql.replace(/\$__ids__\$/, mysql.escape(ids));
                                }
                                var __table__ = model.getSchema();
                                var __identityAlias__ = model.getIdentifyField();
                                var __identityField__ = SqlUtil.aliasReverse(__identityAlias__);
                                sql = sql.replace(/\$__table__\$/, __table__).replace(/\$__identityField__\$/, __identityField__);
                                EasyNode.DEBUG && logger.debug(`Prepare delete sql cost [${new Date() - d}]ms`);
                                return yield me.execUpdate(sql);
                        };
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
                list(model, condition = {}, pagination = {
                        page: 1,
                        rpp: DEFAULT_RPP
                }, orderBy = [], conditionPattern = null) {
                        if(!pagination) {
                                pagination = {};
                        }
                        if(!pagination.page) {
                                pagination.page = 1;
                        }
                        if(!pagination.rpp) {
                                pagination.rpp = DEFAULT_RPP;
                        }
                        if(typeof conditionPattern == 'function') {
                                conditionPattern = conditionPattern(condition, model);
                        }
                        orderBy = orderBy || [];
                        var me = this;
                        return function * () {
                                var ret = {
                                        rows: 0,
                                        pages: 0,
                                        page: pagination.page,
                                        rpp: pagination.rpp,
                                        data: []
                                };
                                var d = new Date();
                                var sql = 'SELECT $__fields__$ FROM $__view__$ WHERE 1 = 1';
                                var countSql = [];
                                var conditionSqlParts = {};
                                var __view__ = model.getView();
                                var __fields__ = [];
                                model.getFieldNames(true).forEach(f => {
                                        __fields__.push(SqlUtil.aliasReverse(f));
                                });
                                __fields__ = __fields__.join(', ');
                                //var __identityAlias__ = model.getIdentifyField();
                                //var __identityField__ = SqlUtil.aliasReverse(__identityAlias__);
                                if (model.isRawView()) {
                                        __view__ = `(${__view__}) AS __TEMP__`;
                                }
                                sql = sql.replace(/\$__fields__\$/, __fields__).replace(/\$__view__\$/, __view__);
                                sql = [sql];
                                //var tmpCountSql = 'SELECT COUNT($__identityField__$) AS ROW_COUNT FROM $__view__$ WHERE 1 = 1';
                                var tmpCountSql = 'SELECT COUNT(1) AS ROW_COUNT FROM $__view__$ WHERE 1 = 1';
                                countSql.push(tmpCountSql.replace(/\$__view__\$/, __view__));
                                var conArgs = {};
                                for (var c in condition) {
                                        var v = condition[c];
                                        if (typeof v != 'function') {
                                                if (typeof v == 'string') {
                                                        v = {
                                                                exp: '=',
                                                                value: v
                                                        };
                                                }
                                                var exp = v.exp || '=';
                                                me._makeConditionParts(exp, c, v.value, conditionSqlParts, conArgs);
                                        }
                                }

                                //确认查询子句的组合条件
                                var conditionClause = me._makeConditionClause(conditionSqlParts, conditionPattern);
                                countSql.push(conditionClause);
                                sql.push(conditionClause);

                                //查询结果
                                //排序
                                if (orderBy.length > 0) {
                                        sql.push('ORDER BY');
                                        var orderClause = [];
                                        orderBy.forEach(o => {
                                                o = o.replace(/\s+/, ' ');
                                                var [field, order] = o.split(' ');
                                                order = order || 'ASC';
                                                field = SqlUtil.aliasReverse(field);
                                                orderClause.push(`${field} ${order}`);
                                        });
                                        sql.push(orderClause.join(', '));
                                }
                                //分页
                                sql.push(SqlUtil.pagingToLimit(pagination));

                                // 查询行数
                                countSql = countSql.join(' ');
                                EasyNode.DEBUG && logger.debug(`Prepare list sql cost [${new Date() - d}]ms`);
                                var r = yield me.execQuery(countSql, conArgs);
                                ret.rows = r[0].rowCount || 0;
                                ret.pages = SqlUtil.calculatePages(ret.rows, ret.rpp);
                                if(ret.rows > 0) {
                                        sql = sql.join(' ');
                                        var data = yield me.execQuery(sql, conArgs);
                                        //处理结果
                                        if (data) {
                                                var idx = 0;
                                                data.forEach(row => {
                                                        data[idx++] = Model.normalizeJSON(model, row);
                                                });
                                                ret.data = data;
                                        }
                                }
                                return ret;
                        };
                }

                _makeConditionClause(conditionSqlParts, conditionPattern) {
                        var conditionFields = [];
                        if (!conditionPattern) {
                                conditionPattern = '';
                                for (var alias in conditionSqlParts) {
                                        conditionFields.push(alias);
                                        conditionPattern += `AND $${alias}$ `;
                                }
                        }
                        var s = conditionPattern;
                        var regEx = /\$(\w*)\$/;
                        while (true) {
                                var arr = regEx.exec(s);
                                if (!arr) {
                                        break;
                                }
                                s = s.replace(regEx, conditionSqlParts[arr[1]] || '1 = 0');          // 设置１= 0防止条件为空的情况
                        }
                        return s;
                }

                _makeConditionParts(expression, alias, v, sql, args) {
                        if (v == null) {
                                return;
                        }
                        var colName = SqlUtil.aliasReverse(alias);
                        assert(typeof expression == 'string', 'Invalid condition, enumeration of condition is [=, >=, <=, <>, !=, like, startsWith(^), endsWith($), in(()), not-in(!()), between(-)]');
                        expression = expression.toUpperCase();
                        switch (expression) {
                                case '=' :
                                case '<>' :
                                case '!=' :
                                case '>=':
                                case '<=':
                                {
                                        var temp = `${colName} ${expression} #${alias}#`;
                                        sql[alias] = temp;
                                        args[alias] = v;
                                        break;
                                }
                                case 'LIKE' :
                                {
                                        var temp = `${colName} LIKE #${alias}#`;
                                        v = '%' + v + '%';
                                        sql[alias] = temp;
                                        args[alias] = v;
                                        break;
                                }
                                case 'STARTSWITH' :
                                case '^' :
                                {
                                        var temp = `${colName} LIKE #${alias}#`;
                                        v = v + '%';
                                        sql[alias] = temp;
                                        args[alias] = v;
                                        break;
                                }
                                case 'ENDSWITH' :
                                case '$':
                                {
                                        var temp = `${colName} LIKE #${alias}#`;
                                        v = '%' + v;
                                        sql[alias] = temp;
                                        args[alias] = v;
                                        break;
                                }
                                case 'IN':
                                case '()':
                                case 'NOT-IN':
                                case '!()' :
                                {
                                        assert(util.isArray(v) && v.length > 0, 'Invalid condition "in/not in", need Array value');
                                        var temp = `${colName} $__NOT__$ IN (`;
                                        var s = [];
                                        if (expression == 'IN' || expression == '()') {
                                                temp = temp.replace(/\$__NOT__\$/, '');
                                        }
                                        else {
                                                temp = temp.replace(/\$__NOT__\$/, 'NOT');
                                        }
                                        var counter = 0;
                                        v.forEach(t => {
                                                s.push(`#${alias}_${counter}#`);
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
                                        //assert(util.isArray(v) && v.length == 2, 'Invalid condition "between", need Array with 2 elements, and the first one must be lower than the second one');
                                        if(v.length == 2 && v[0] !== null && v[1] !== null) {
                                                var temp = `${colName} BETWEEN #${alias}_0# AND #${alias}_1#`;
                                                sql[alias] = temp;
                                                args[alias + '_0'] = v[0];
                                                args[alias + '_1'] = v[1];
                                        }
                                        else if(v[0] === null) {
                                                var temp = `${colName} < #${alias}#`;
                                                sql[alias] = temp;
                                                args[alias] = v[1];
                                        }
                                        else if(v.length == 1 || v[1] === null) {
                                                var temp = `${colName} >= #${alias}#`;
                                                sql[alias] = temp;
                                                args[alias] = v[0];
                                        }
                                        break;
                                }
                                default :
                                {
                                        throw new Error(`Unknown condition [${expression}]`);
                                }
                        }
                }

                getClassName() {
                        return EasyNode.namespace(__filename);
                }
        }

        module.exports = MysqlConnection;
})();