var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var GenericObject = using('easynode.GenericObject');
var Action = using('easynode.framework.mvc.Action');
var util = require('util');
var ActionResult = using('easynode.framework.mvc.ActionResult');
var _ = require('underscore');

(function () {
        var CREATE_NAME = EasyNode.config('easynode.framework.mvc.model.action.createName', 'C');
        var READ_NAME = EasyNode.config('easynode.framework.mvc.model.action.readName', 'R');
        var UPDATE_NAME = EasyNode.config('easynode.framework.mvc.model.action.updateName', 'U');
        var DEL_NAME = EasyNode.config('easynode.framework.mvc.model.action.delName', 'D');
        var LIST_NAME = EasyNode.config('easynode.framework.mvc.model.action.listName', 'L');

        /**
         * Class ModelProxyActionFactoryFactory。暴露模型的CRUDL函数为REST接口。
         *
         * @class easynode.framework.mvc.ModelProxyActionFactory
         * @extends easynode.GenericObject
         * @since 0.1.0
         * @author hujiabao
         * */
        class ModelProxyActionFactory extends GenericObject {
                /**
                 * 构造函数。
                 *
                 * @method 构造函数
                 * @param {Object} modelFactory 模型工厂，需要接口函数：getModel()，返回一个easynode.framework.mvc.Model实例。
                 * @param {String} m 模块名，如果不传则使用modelFactory中的模型的schema。
                 * @since 0.1.0
                 * @author hujiabao
                 * */
                constructor(modelFactory, m) {
                        super();
                        //调用super()后再定义子类成员。
                        assert(modelFactory && typeof modelFactory.getModel == 'function', 'Invalid argument modelFactory');
                        this.modelFactory = modelFactory;
                        this.module = m || modelFactory.getModel().getSchema;
                }

                /**
                 * 获取代理模型create函数的Action原型类，返回的是一个动态的类，而不是一个实例。
                 *
                 * @method getCreateAction
                 * @param {Array/String} fieldNames 创建时支持写入的字段名数组，'*'表示可以写入任何字段
                 * @param {easynode.framework.mvc.View} view 该Action使用的视图，默认为new JSONView()，如需要显示HTML页面，请传入
                 *                                                      TemplateView实例。
                 * @param {Object} l 事件监听器，分别在开始创建前调用beforeCreate，在创建完成后调用afterCreate，这两个函数均是async函数，
                 *                                   并且会被bind到action实例上执行，因此可以在这两个函数中使用this引用到action。
                 *
                 *                                                                      // example
                 *                                                                      Notation & Example : {
                 *                                                                              beforeCreate : function(model, actionCtx) {
                 *                                                                                      return function * () {
                 *                                                                                      };
                 *                                                                              },
                 *
                 *                                                                              afterCreate : function(model, actionCtx, insertId) {
                 *                                                                                      return function * () {
                 *                                                                                      };
                 *                                                                              }
                 *                                                                      }
                 * @since 0.1.0
                 * @author hujiabao
                 * */
                getCreateAction(fieldNames = '*', view = null, l = null) {
                        var model = this.modelFactory.getModel();
                        var mf = this.modelFactory;
                        class _CreateAction extends Action {
                                constructor() {
                                        super();
                                        if (fieldNames == '*') {
                                                fieldNames = model.getFieldNames(false);
                                        }
                                        assert(util.isArray(fieldNames), 'Invalid argument');
                                        fieldNames.forEach(f => {
                                                var field = model.getFieldDefinition(f);
                                                var argS = `${f} ${field.type} ${field.comment}`;
                                                this.addArg(argS);
                                        });

                                        if (view) {
                                                this.setView(view);
                                        }
                                }

                                process(ctx) {
                                        var me = this;
                                        return function * () {
                                                var params = ctx.params();
                                                var model = mf.getModel();
                                                model.merge(params);
                                                if(l && typeof l.beforeCreate == 'function') {
                                                        yield l.beforeCreate.call(me, model, ctx);
                                                }
                                                var ret = yield ctx.getConnection().create(model);
                                                if(l && typeof l.afterCreate == 'function') {
                                                        yield l.afterCreate.call(me, model, ctx, ret.insertId);
                                                }
                                                return ActionResult.createSuccessResult(ret);
                                        };
                                }
                        }

                        Action.define(this.module, CREATE_NAME, _CreateAction);
                        return _CreateAction;
                }

                /**
                 * 获取代理模型read函数的Action原型类，返回的是一个动态的类，而不是一个实例。
                 *
                 * @method getReadAction
                 * @param {easynode.framework.mvc.View} view 该Action使用的视图，默认为new JSONView()，如需要显示HTML页面，请传入
                 *                                                      TemplateView实例。
                 * @param {Object} l 事件监听器，分别在开始创建前调用beforeRead，在创建完成后调用afterRead，这两个函数均是async函数，
                 *                                   并且会被bind到action实例上执行，因此可以在这两个函数中使用this引用到action。
                 *
                 *                                                                      // example
                 *                                                                      Notation & Example : {
                 *                                                                              beforeRead : function(model, actionCtx, id) {
                 *                                                                                      return function * () {
                 *                                                                                      };
                 *                                                                              },
                 *
                 *                                                                              afterRead : function(model, actionCtx, id, data) {
                 *                                                                                      return function * () {
                 *                                                                                      };
                 *                                                                              }
                 *                                                                      }
                 * @since 0.1.0
                 * @author hujiabao
                 * */
                getReadAction(view, l = null) {
                        var model = this.modelFactory.getModel();
                        var mf = this.modelFactory;
                        class _ReadAction extends Action {
                                constructor() {
                                        super();

                                        var identityField = model.getIdentifyField();
                                        var field = model.getFieldDefinition(identityField);
                                        var argS = `${field.name} ${field.type} ${field.comment}`;
                                        this.addArg(argS);
                                        this._idArg = identityField;

                                        if (view) {
                                                this.setView(view);
                                        }
                                }

                                process(ctx) {
                                        var me = this;
                                        return function * () {
                                                var model = mf.getModel();
                                                var id = ctx.param(me._idArg);
                                                if(l && typeof l.beforeRead == 'function') {
                                                        yield l.beforeRead.call(me, mode, ctx, id);
                                                }
                                                var ret = yield ctx.getConnection().read(model, id);
                                                if(l && typeof l.afterRead == 'function') {
                                                        yield l.afterRead.call(me, mode, ctx, id, ret);
                                                }
                                                return ActionResult.createSuccessResult(ret);
                                        };
                                }
                        }

                        Action.define(this.module, READ_NAME, _ReadAction);
                        return _ReadAction;
                }

                /**
                 * 获取代理模型update函数的Action原型类，返回的是一个动态的类，而不是一个实例。
                 * @method getUpdateAction
                 * @param {Array/String} fieldNames 创建时支持更新的字段名数组，'*'表示可以更新任何字段
                 * @param {easynode.framework.mvc.View} view 该Action使用的视图，默认为new JSONView()，如需要显示HTML页面，请传入
                 *                                                      TemplateView实例。
                 * @param {Object} l 事件监听器，分别在开始创建前调用beforeUpdate，在创建完成后调用afterUpdate，这两个函数均是async函数，
                 *                                   并且会被bind到action实例上执行，因此可以在这两个函数中使用this引用到action。
                 *
                 *                                                                      // example
                 *                                                                      Notation & Example : {
                 *                                                                              beforeUpdate : function(model, actionCtx, id) {
                 *                                                                                      return function * () {
                 *                                                                                      };
                 *                                                                              },
                 *
                 *                                                                              afterUpdate : function(model, actionCtx, id) {
                 *                                                                                      return function * () {
                 *                                                                                      };
                 *                                                                              }
                 *                                                                      }
                 * @since 0.1.0
                 * @author hujiabao
                 * */
                getUpdateAction(fieldNames = '*', view = null, l = null) {
                        var model = this.modelFactory.getModel();
                        var mf = this.modelFactory;
                        class _UpdateAction extends Action {
                                constructor() {
                                        super();
                                        if (fieldNames == '*') {
                                                fieldNames = model.getFieldNames(false);
                                        }

                                        assert(util.isArray(fieldNames), 'Invalid argument');
                                        fieldNames.forEach(f => {
                                                var field = model.getFieldDefinition(f);
                                                var argS = `${f} ${field.type} ${field.comment}`;
                                                this.addArg(argS);
                                        });

                                        if (view) {
                                                this.setView(view);
                                        }
                                }

                                process(ctx) {
                                        var me = this;
                                        return function * () {
                                                var params = ctx.params();
                                                var model = mf.getModel();
                                                model.merge(params);
                                                var idVal = ctx.param(model.getIdentifyField());
                                                if(l && typeof l.beforeUpdate == 'function') {
                                                        yield l.beforeUpdate(me, model, ctx, idVal);
                                                }
                                                var ret = yield ctx.getConnection().update(model);
                                                if(l && typeof l.afterUpdate == 'function') {
                                                        yield l.afterUpdate(me, model, ctx, idVal);
                                                }
                                                return ActionResult.createSuccessResult(ret);
                                        };
                                }
                        }

                        Action.define(this.module, UPDATE_NAME, _UpdateAction);
                        return _UpdateAction;
                }

                /**
                 * 获取代理模型del函数的Action原型类，返回的是一个动态的类，而不是一个实例。
                 * @method getDelAction
                 * @param {easynode.framework.mvc.View} view 该Action使用的视图，默认为new JSONView()，如需要显示HTML页面，请传入
                 *                                                      TemplateView实例。
                 * @param {Object} l 事件监听器，分别在开始创建前调用beforeDel，在创建完成后调用afterDel，这两个函数均是async函数，
                 *                                   并且会被bind到action实例上执行，因此可以在这两个函数中使用this引用到action。
                 *
                 *                                                                      // example
                 *                                                                      Notation & Example : {
                 *                                                                              beforeDel : function(model, actionCtx, ids) {
                 *                                                                                      return function * () {
                 *                                                                                      };
                 *                                                                              },
                 *
                 *                                                                              afterDel : function(model, actionCtx, ids) {
                 *                                                                                      return function * () {
                 *                                                                                      };
                 *                                                                              }
                 *                                                                      }
                 * @since 0.1.0
                 * @author hujiabao
                 * */
                getDelAction(view, l = null) {
                        var model = this.modelFactory.getModel();
                        var mf = this.modelFactory;
                        class _DelAction extends Action {
                                constructor() {
                                        super();

                                        var identityField = model.getIdentifyField();
                                        var field = model.getFieldDefinition(identityField);
                                        var argS = `${field.name}s array(${field.type}) ${field.comment}`;
                                        this.addArg(argS);
                                        this._idArg = field.name + 's';

                                        if (view) {
                                                this.setView(view);
                                        }
                                }

                                process(ctx) {
                                        var me = this;
                                        return function * () {
                                                var model = mf.getModel();
                                                var ids = ctx.param(me._idArg);
                                                if(l && typeof l.beforeDel == 'function') {
                                                        yield l.beforeDel.call(me, ctx, model, ids);
                                                }
                                                var ret = yield ctx.getConnection().del(model, ids);
                                                if(l && typeof l.afterDel == 'function') {
                                                        yield l.afterDel.call(me, ctx, model, ids);
                                                }
                                                return ActionResult.createSuccessResult(ret);
                                        };
                                }
                        }

                        Action.define(this.module, DEL_NAME, _DelAction);
                        return _DelAction;
                }

                /**
                 * 获取代理模型del函数的Action原型类，返回的是一个动态的类，而不是一个实例。
                 * @method getListAction
                 * @param {Object} conditions 查询条件字段、比较表达式. Notation : {
                 *                                                                                                                      $fieldName1 : $expression
                 *                                                                                                                      $fieldName2 : $expression
                 *                                                                                                                      }
                 * @param {Array} orderBy 排序字段，参考：IConnection.list的orderBy参数，支持参数中使用__orderBy__参数修改默认排序
                 * @param {String} conditionPattern 条件组合模板，参考参考：IConnection.list的conditionPattern参数
                 * @param {easynode.framework.mvc.View} view 该Action使用的视图，默认为new JSONView()，如需要显示HTML页面，请传入
                 *                                                      TemplateView实例。
                 * @param {Object} l 事件监听器，分别在开始创建前调用beforeList，在创建完成后调用afterList，这两个函数均是async函数，
                 *                                   并且会被bind到action实例上执行，因此可以在这两个函数中使用this引用到action。
                 *                                   在beforeList函数中，可以返回一个string表示一个新的conditionPattern，实际查询时将按新的conditionPattern
                 *                                   组织SQL逻辑。
                 *
                 *                                                                      // example
                 *                                                                      Notation & Example : {
                 *                                                                              beforeList : function(model, actionCtx, conditions, pagination, orderBy, conditionPattern) {
                 *                                                                                      return function * () {
                 *                                                                                              return 'AND $pluginName$ OR $pluginVersion$';
                 *                                                                                      };
                 *                                                                              },
                 *
                 *                                                                              afterList : function(model, actionCtx, result) {
                 *                                                                                      return function * () {
                 *                                                                                      };
                 *                                                                              }
                 *                                                                      }
                 * @since 0.1.0
                 * @author hujiabao
                 * */
                getListAction(conditions = null, orderBy = [], conditionPattern = null, view = null, l = null) {
                        var model = this.modelFactory.getModel();
                        var mf = this.modelFactory;
                        const ARRAY_CONDITIONS = ['BETWEEN','-','IN','()','NOT-IN','!()'];
                        class _ListAction extends Action {
                                constructor() {
                                        super();
                                        if(conditions == null) {
                                                conditions = {};
                                                var fieldNames = model.getFieldNames(false);
                                                fieldNames.forEach(f => {
                                                        var field = model.getFieldDefinition(f);
                                                        conditions[f] = field.name;
                                                });
                                        }
                                        for(var c in conditions) {
                                                var field = model.getFieldDefinition(c);
                                                if(field) {
                                                        var con = conditions[c].toUpperCase();
                                                        if(_.contains(ARRAY_CONDITIONS, con)) {
                                                                var argS = `${c} array(${field.type}) ${field.comment}, ${EasyNode.i18n('commentExpression', __filename)} : "${con}", ${EasyNode.i18n('commentDelimiter', __filename)}`;
                                                                this.addArg(argS);
                                                        }
                                                        else {
                                                                var argS = `${c} ${field.type} ${field.comment}, ${EasyNode.i18n('commentExpression', __filename)} : "${con}"`;
                                                                this.addArg(argS);
                                                        }
                                                }
                                                else {
                                                        logger.warn(`Undefined field [${c}], query condition is ignored`);
                                                }
                                        }
                                        //if(conditionPattern) {
                                        //        this.addArg(`__condition_pattern__ string ${EasyNode.i18n('commentConditionPattern', __filename)} : ${conditionPattern}`);
                                        //}
                                        //分页参数_page和_rpp
                                        this.addArg('_page int ' + EasyNode.i18n('pageComment', __filename));
                                        this.addArg('_rpp int ' + EasyNode.i18n('rppComment', __filename));

                                        if (view) {
                                                this.setView(view);
                                        }
                                }

                                process(ctx) {
                                        var me = this;
                                        return function * () {
                                                var model = mf.getModel();
                                                var realCondition = {};
                                                var pagination = {
                                                        page : 1
                                                };
                                                if(ctx.param('_page') != null) {
                                                        pagination.page = parseInt(ctx.param('_page'));
                                                        pagination.page = isNaN(pagination.page) ? 0 : pagination.page;
                                                }
                                                if(ctx.param('_rpp') != null) {
                                                        pagination.rpp = parseInt(ctx.param('_rpp'));
                                                        pagination.rpp = isNaN(pagination.rpp) ? 0 : pagination.rpp;
                                                }
                                                for(var c in conditions) {
                                                        if(ctx.hasParam(c)) {
                                                                var param = ctx.param(c);
                                                                realCondition[c] = {
                                                                        exp: conditions[c],
                                                                        value: param
                                                                };
                                                        }
                                                }
                                                var ids = ctx.param(me._idArg);
                                                if(l && typeof l.beforeList == 'function') {
                                                        yield l.beforeList.call(me, ctx, model, realCondition, pagination, orderBy, conditionPattern);
                                                }
                                                var ret = yield ctx.getConnection().list(model, realCondition, pagination, orderBy, conditionPattern);
                                                if(l && typeof l.afterList == 'function') {
                                                        yield l.afterList.call(me, ctx, model, ret);
                                                }
                                                return ActionResult.createSuccessResult(ret);
                                        };
                                }
                        }

                        Action.define(this.module, LIST_NAME, _ListAction);
                        return _ListAction;
                }

                getAll() {
                        return [
                                this.getCreateAction(),
                                this.getReadAction(),
                                this.getUpdateAction(),
                                this.getDelAction(),
                                this.getListAction()
                        ];
                }

                getClassName() {
                        return EasyNode.namespace(__filename);
                }
        }

        module.exports = ModelProxyActionFactory;
})();