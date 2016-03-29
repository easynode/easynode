'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var GenericObject = using('easynode.GenericObject');
var ModelField = using('easynode.framework.mvc.ModelField');
var SqlUtil = using('easynode.framework.util.SqlUtil');
var Model = using('easynode.framework.mvc.Model');

(function () {

        var _mysqlModelCache = {};

        /**
         * Class MysqlModelGenerator
         *
         * @class easynode.framework.mvc.spi.MysqlModelGenerator
         * @extends easynode.GenericObject
         * @since 0.1.0
         * @author hujiabao
         * */

        var MysqlModelGenerator = (function (_GenericObject) {
                _inherits(MysqlModelGenerator, _GenericObject);

                /**
                 * 构造函数。
                 *
                 * @method 构造函数
                 * @private
                 * @since 0.1.0
                 * @author hujiabao
                 * */

                function MysqlModelGenerator() {
                        _classCallCheck(this, MysqlModelGenerator);

                        //调用super()后再定义子类成员。

                        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(MysqlModelGenerator).call(this));

                        throw new Error('Use static methods instead');
                        return _this;
                }

                _createClass(MysqlModelGenerator, [{
                        key: 'getClassName',
                        value: function getClassName() {
                                return EasyNode.namespace(__filename);
                        }
                }], [{
                        key: '_createField',
                        value: function _createField(col, readonly) {
                                var fieldName = SqlUtil.alias(col.columnName);
                                var type = col.dataType.toLowerCase();
                                var maxLength = 0;
                                var defaultValue = col.columnDefault;
                                var comment = col.columnComment;
                                var nullable = col.isNullable == 'YES';
                                var lengthRegExp = /^\w+\(?(\d*),?(\d*)\)?$/;
                                var parsed = lengthRegExp.exec(col.columnType);
                                var len1 = parsed[1] ? parseInt(parsed[1]) : 0;
                                var len2 = parsed[2] ? parseInt(parsed[2]) + 1 : 0;
                                maxLength = len1 + len2;
                                if (type == 'char' || type == 'varchar' || type == 'text') {
                                        type = 'string';
                                } else if (type.match(/\w*int\w*/)) {
                                        type = 'int';
                                } else if (type == 'timestamp') {
                                        type = 'datetime';
                                } else if (type == 'decimal' || type == 'real' || type == 'double') {
                                        type = 'float';
                                }
                                // 如果一个列被设置成string(char ,varchar, text)存储类型，并且列名以_JSON结尾，则认为是一个JSON类型
                                if (type == 'string' && col.columnName.match(/^\w+_JSON$/)) {
                                        type = 'json';
                                }
                                var field = new ModelField(fieldName, type, maxLength, defaultValue, nullable, comment, readonly);
                                return field;
                        }

                        /**
                         * 初始化Mysql模型工厂，从INFORMATION_SCHEMA表查询数据库表和视图的Metadata。数据源的连接必须具有查询INFORMATION_SCHEMA的权限。
                         *
                         * @method generate
                         * @param {easynode.framework.db.MysqlDataSource} mysqlDataSource Mysql数据源
                         * @param {String} schema 数据库名
                         * @param {Array} models 模型数组。model的Notation: {name : '', table : '', view : ''} 其中table必须，其他两个属性默认赞同于table属性。
                         * @static
                         * @since 0.1.0
                         * @author hujiabao
                         * */

                }, {
                        key: 'generate',
                        value: function generate(mysqlDataSource, schema, models) {
                                EasyNode.DEBUG && logger.debug('Initializing mysql models...');
                                return regeneratorRuntime.mark(function _callee() {
                                        var connection, modelNames, i, m, name, table, view, sql, tableColumns, viewColumns, fields, pkCol;
                                        return regeneratorRuntime.wrap(function _callee$(_context) {
                                                while (1) {
                                                        switch (_context.prev = _context.next) {
                                                                case 0:
                                                                        _context.next = 2;
                                                                        return mysqlDataSource.getConnection();

                                                                case 2:
                                                                        connection = _context.sent;
                                                                        modelNames = [];
                                                                        i = 0;

                                                                case 5:
                                                                        if (!(i < models.length)) {
                                                                                _context.next = 32;
                                                                                break;
                                                                        }

                                                                        m = models[i];
                                                                        name = m.name || m.table;
                                                                        table = m.table;
                                                                        view = m.view || m.table;

                                                                        EasyNode.DEBUG && logger.debug('Initializing mysql model [' + name + ']...');
                                                                        modelNames.push(name);

                                                                        //query table fileds
                                                                        sql = 'SELECT COLUMN_NAME, DATA_TYPE, COLUMN_TYPE, COLUMN_DEFAULT, IS_NULLABLE, COLUMN_COMMENT, COLUMN_KEY FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME=#table# AND TABLE_SCHEMA = #schema#';
                                                                        _context.next = 15;
                                                                        return connection.execQuery(sql, { table: table, schema: schema });

                                                                case 15:
                                                                        tableColumns = _context.sent;
                                                                        viewColumns = [];

                                                                        if (!(view != table)) {
                                                                                _context.next = 24;
                                                                                break;
                                                                        }

                                                                        sql = 'SELECT COLUMN_NAME, DATA_TYPE, COLUMN_TYPE, COLUMN_DEFAULT, IS_NULLABLE, COLUMN_COMMENT FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME=#view# AND TABLE_SCHEMA = #schema# ';
                                                                        sql += 'AND COLUMN_NAME NOT IN (';
                                                                        sql += 'SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME=#table# AND TABLE_SCHEMA = #schema#)';
                                                                        _context.next = 23;
                                                                        return connection.execQuery(sql, { table: table, view: view, schema: schema });

                                                                case 23:
                                                                        viewColumns = _context.sent;

                                                                case 24:
                                                                        fields = [];
                                                                        pkCol = null;
                                                                        //logger.error(tableColumns);

                                                                        tableColumns.forEach(function (col) {
                                                                                if (col.columnKey == 'PRI') {
                                                                                        pkCol = SqlUtil.alias(col.columnName);
                                                                                }
                                                                                fields.push(MysqlModelGenerator._createField(col, false));
                                                                        });
                                                                        viewColumns.forEach(function (col) {
                                                                                fields.push(MysqlModelGenerator._createField(col, true));
                                                                        });
                                                                        _mysqlModelCache[name] = {
                                                                                table: table,
                                                                                view: view,
                                                                                fields: fields,
                                                                                pkCol: pkCol
                                                                        };

                                                                case 29:
                                                                        i++;
                                                                        _context.next = 5;
                                                                        break;

                                                                case 32:
                                                                        _context.next = 34;
                                                                        return mysqlDataSource.releaseConnection(connection);

                                                                case 34:
                                                                        EasyNode.DEBUG && logger.debug('Mysql mysql model [' + modelNames.join(',') + '] initialized');

                                                                case 35:
                                                                case 'end':
                                                                        return _context.stop();
                                                        }
                                                }
                                        }, _callee, this);
                                });
                        }

                        /**
                         * 从Mysql模型工厂中获取一个生成的模型。
                         *
                         * @method getModel
                         * @param {String} name 模型名称。
                         * @static
                         * @since 0.1.0
                         * @author hujiabao
                         * */

                }, {
                        key: 'getModel',
                        value: function getModel(name) {
                                var cached = _mysqlModelCache[name];
                                assert(cached, 'Mysql model [' + name + '] has not been initialized');
                                var model = new Model(cached.table, cached.view);
                                cached.fields.forEach(function (f) {
                                        model.defineField(f);
                                });
                                if (cached.pkCol) {
                                        model.setIdentifyField(cached.pkCol);
                                }
                                return model;
                        }

                        /**
                         * 从Mysql模型工厂中获取一个生成的模型，并生成Model类。
                         *
                         * @method persistent
                         * @param {String} name 模型名称。
                         * @param {String} relativePath 模型存储相对路径。
                         * @static
                         * @async
                         * @since 0.1.0
                         * @author hujiabao
                         * */

                }, {
                        key: 'persistent',
                        value: function persistent(name, relativePath) {}
                }]);

                return MysqlModelGenerator;
        })(GenericObject);

        module.exports = MysqlModelGenerator;
})();