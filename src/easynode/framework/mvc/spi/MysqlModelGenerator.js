var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var GenericObject = using('easynode.GenericObject');
var ModelField = using('easynode.framework.mvc.ModelField');
var SqlUtil = using('easynode.framework.util.SqlUtil');
var Model = using('easynode.framework.mvc.Model');

(function() {

  var _mysqlModelCache = {};

  /**
   * Class MysqlModelGenerator
   *
   * @class easynode.framework.mvc.spi.MysqlModelGenerator
   * @extends easynode.GenericObject
   * @since 0.1.0
   * @author hujiabao
   * */
  class MysqlModelGenerator extends GenericObject {

  /**
   * 构造函数。
   *
   * @method 构造函数
   * @private
   * @since 0.1.0
   * @author hujiabao
   * */
    constructor() {
      super();
                        // 调用super()后再定义子类成员。
      throw new Error('Use static methods instead');
    }

    static _createField(col, readonly) {
      var fieldName = SqlUtil.alias(col.columnName);
      var type = col.dataType.toLowerCase();
      var maxLength = 0;
      var defaultValue = col.columnDefault;
      var comment = col.columnComment;
      var nullable = col.isNullable == 'YES';
      var lengthRegExp = /^\w+\(?(\d*),?(\d*)\)?$/;
      var parsed = lengthRegExp.exec(col.columnType);
      if (parsed) {
        var len1 = parsed[1] ? parseInt(parsed[1]) : 0;
        var len2 = parsed[2] ? (parseInt(parsed[2]) + 1) : 0;
        maxLength = len1 + len2;
      }
      if (type == 'char' || type == 'varchar' || type == 'text') {
        type = 'string';
      }
      else if (type.match(/\w*int\w*/)) {
        type = 'int';
      }
      else if (type == 'timestamp') {
        type = 'datetime';
      }
      else if (type == 'decimal' || type == 'real' || type == 'double') {
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
     *                  _mysqlModelCache[name]:cache this array
     * @static
     * @since 0.1.0
     * @author hujiabao
     * */
    static generate(mysqlDataSource, schema, models) {
      EasyNode.DEBUG && logger.debug('Initializing mysql models...');
      return function *() {
        var connection = yield mysqlDataSource.getConnection();
        var modelNames = [];
        console.log(models);
        for (var i = 0; i < models.length; i++) {
          var m = models[i];
          var name = m.name || m.table;
          var table = m.table;
          var view = m.view || m.table;
          EasyNode.DEBUG && logger.debug(`Initializing mysql model [${name}]...`);
          modelNames.push(name);

          // query table fileds
          var sql = 'SELECT COLUMN_NAME, DATA_TYPE, COLUMN_TYPE, COLUMN_DEFAULT, IS_NULLABLE, COLUMN_COMMENT, COLUMN_KEY FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME=#table# AND TABLE_SCHEMA = #schema#';
          var tableColumns = yield connection.execQuery(sql, {table : table, schema : schema});
          var viewColumns = [];
          if (view != table) {
            sql = 'SELECT COLUMN_NAME, DATA_TYPE, COLUMN_TYPE, COLUMN_DEFAULT, IS_NULLABLE, COLUMN_COMMENT FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME=#view# AND TABLE_SCHEMA = #schema# ';
            sql += 'AND COLUMN_NAME NOT IN (';
            sql += 'SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME=#table# AND TABLE_SCHEMA = #schema#)';
            viewColumns = yield connection.execQuery(sql, {table : table, view: view, schema : schema});
          }
          var fields = [];
          var pkCol = null;
          // logger.error(tableColumns);
          tableColumns.forEach((col) => {
            if (col.columnKey == 'PRI') {
              pkCol = SqlUtil.alias(col.columnName);
            }
            fields.push(MysqlModelGenerator._createField(col, false));
          });
          viewColumns.forEach((col) => {
            fields.push(MysqlModelGenerator._createField(col, true));
          });
          _mysqlModelCache[name] = {
            table : table,
            view : view,
            fields : fields,
            pkCol : pkCol
          };
        }
        // console.log(_mysqlModelCache[name]);
        yield mysqlDataSource.releaseConnection(connection);
        EasyNode.DEBUG && logger.debug(`Mysql mysql model [${modelNames.join(',')}] initialized`);
      };
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
    static getModel(name) {
      var cached = _mysqlModelCache[name];
      assert(cached, `Mysql model [${name}] has not been initialized`);
      var model = new Model(cached.table, cached.view);
      cached.fields.forEach((f) => {
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
    static persistent(name, relativePath) {
    }

    getClassName() {
      return EasyNode.namespace(__filename);
    }

  }

  module.exports = MysqlModelGenerator;
})();
