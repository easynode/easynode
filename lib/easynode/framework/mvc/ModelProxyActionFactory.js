'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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

  var ModelProxyActionFactory = function (_GenericObject) {
    _inherits(ModelProxyActionFactory, _GenericObject);

    /**
     * 构造函数。
     *
     * @method 构造函数
     * @param {Object} modelFactory 模型工厂，需要接口函数：getModel()，返回一个easynode.framework.mvc.Model实例。
     * @param {String} m 模块名，如果不传则使用modelFactory中的模型的schema。
     * @since 0.1.0
     * @author hujiabao
     * */

    function ModelProxyActionFactory(modelFactory, m) {
      _classCallCheck(this, ModelProxyActionFactory);

      // 调用super()后再定义子类成员。

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ModelProxyActionFactory).call(this));

      assert(modelFactory && typeof modelFactory.getModel == 'function', 'Invalid argument modelFactory');
      _this.modelFactory = modelFactory;
      _this.module = m || modelFactory.getModel().getSchema;
      return _this;
    }

    /**
     * 获取代理模型create函数的Action原型类，返回的是一个动态的类，而不是一个实例。
     *
     * @method getCreateAction
     * @param {Array/String} fieldNames 创建时支持写入的字段名数组，'*'表示可以写入任何字段
     * @param {easynode.framework.mvc.View} view 该Action使用的视图，默认为new JSONView()，如需要显示HTML页面，请传入
     *                                  TemplateView实例。
     * @param {Object} l 事件监听器，分别在开始创建前调用beforeCreate，在创建完成后调用afterCreate，这两个函数均是async函数，
     *                                   并且会被bind到action实例上执行，因此可以在这两个函数中使用this引用到action。
     *
     *        // example
     *           Notation & Example : {
     *                              beforeCreate : function(model, actionCtx) {
     *                                              return function * () {
     *                                              };
     *                                            },
     *
     *                               afterCreate : function(model, actionCtx, insertId) {
     *                                              return function * () {
     *                                              };
     *                                           }
     *                              }
     * @since 0.1.0
     * @author hujiabao
     * */


    _createClass(ModelProxyActionFactory, [{
      key: 'getCreateAction',
      value: function getCreateAction() {
        var fieldNames = arguments.length <= 0 || arguments[0] === undefined ? '*' : arguments[0];
        var view = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
        var l = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

        var model = this.modelFactory.getModel();
        var mf = this.modelFactory;

        var _CreateAction = function (_Action) {
          _inherits(_CreateAction, _Action);

          function _CreateAction() {
            _classCallCheck(this, _CreateAction);

            var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(_CreateAction).call(this));

            if (fieldNames == '*') {
              fieldNames = model.getFieldNames(false);
            }
            assert(util.isArray(fieldNames), 'Invalid argument');
            fieldNames.forEach(function (f) {
              var field = model.getFieldDefinition(f);
              var argS = f + ' ' + field.type + ' ' + field.comment;
              _this2.addArg(argS);
            });

            if (view) {
              _this2.setView(view);
            }
            return _this2;
          }

          _createClass(_CreateAction, [{
            key: 'process',
            value: function process(ctx) {
              var me = this;
              return regeneratorRuntime.mark(function _callee() {
                var params, model, ret;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        params = ctx.params();
                        model = mf.getModel();

                        model.merge(params);

                        if (!(l && typeof l.beforeCreate == 'function')) {
                          _context.next = 6;
                          break;
                        }

                        _context.next = 6;
                        return l.beforeCreate.call(me, model, ctx);

                      case 6:
                        _context.next = 8;
                        return ctx.getConnection().create(model);

                      case 8:
                        ret = _context.sent;

                        if (!(l && typeof l.afterCreate == 'function')) {
                          _context.next = 12;
                          break;
                        }

                        _context.next = 12;
                        return l.afterCreate.call(me, model, ctx, ret.insertId);

                      case 12:
                        return _context.abrupt('return', ActionResult.createSuccessResult(ret));

                      case 13:
                      case 'end':
                        return _context.stop();
                    }
                  }
                }, _callee, this);
              });
            }
          }]);

          return _CreateAction;
        }(Action);

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
       *          // example
       *                Notation & Example : {
       *                        beforeRead : function(model, actionCtx, id) {
       *                                return function * () {
       *                                };
       *                        },
       *
       *                        afterRead : function(model, actionCtx, id, data) {
       *                                return function * () {
       *                                };
       *                        }
       *                }
       * @since 0.1.0
       * @author hujiabao
       * */

    }, {
      key: 'getReadAction',
      value: function getReadAction(view) {
        var l = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

        var model = this.modelFactory.getModel();
        var mf = this.modelFactory;

        var _ReadAction = function (_Action2) {
          _inherits(_ReadAction, _Action2);

          function _ReadAction() {
            _classCallCheck(this, _ReadAction);

            var _this3 = _possibleConstructorReturn(this, Object.getPrototypeOf(_ReadAction).call(this));

            var identityField = model.getIdentifyField();
            var field = model.getFieldDefinition(identityField);
            var argS = field.name + ' ' + field.type + ' ' + field.comment;
            _this3.addArg(argS);
            _this3._idArg = identityField;

            if (view) {
              _this3.setView(view);
            }
            return _this3;
          }

          _createClass(_ReadAction, [{
            key: 'process',
            value: function process(ctx) {
              var me = this;
              return regeneratorRuntime.mark(function _callee2() {
                var model, id, ret;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        model = mf.getModel();
                        id = ctx.param(me._idArg);

                        if (!(l && typeof l.beforeRead == 'function')) {
                          _context2.next = 5;
                          break;
                        }

                        _context2.next = 5;
                        return l.beforeRead.call(me, mode, ctx, id);

                      case 5:
                        _context2.next = 7;
                        return ctx.getConnection().read(model, id);

                      case 7:
                        ret = _context2.sent;

                        if (!(l && typeof l.afterRead == 'function')) {
                          _context2.next = 11;
                          break;
                        }

                        _context2.next = 11;
                        return l.afterRead.call(me, mode, ctx, id, ret);

                      case 11:
                        return _context2.abrupt('return', ActionResult.createSuccessResult(ret));

                      case 12:
                      case 'end':
                        return _context2.stop();
                    }
                  }
                }, _callee2, this);
              });
            }
          }]);

          return _ReadAction;
        }(Action);

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
       *      // example
       *      Notation & Example : {
       *              beforeUpdate : function(model, actionCtx, id) {
       *                      return function * () {
       *                      };
       *              },
       *
       *              afterUpdate : function(model, actionCtx, id) {
       *                      return function * () {
       *                      };
       *              }
       *      }
       * @since 0.1.0
       * @author hujiabao
       * */

    }, {
      key: 'getUpdateAction',
      value: function getUpdateAction() {
        var fieldNames = arguments.length <= 0 || arguments[0] === undefined ? '*' : arguments[0];
        var view = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
        var l = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

        var model = this.modelFactory.getModel();
        var mf = this.modelFactory;

        var _UpdateAction = function (_Action3) {
          _inherits(_UpdateAction, _Action3);

          function _UpdateAction() {
            _classCallCheck(this, _UpdateAction);

            var _this4 = _possibleConstructorReturn(this, Object.getPrototypeOf(_UpdateAction).call(this));

            if (fieldNames == '*') {
              fieldNames = model.getFieldNames(false);
            }

            assert(util.isArray(fieldNames), 'Invalid argument');
            fieldNames.forEach(function (f) {
              var field = model.getFieldDefinition(f);
              var argS = f + ' ' + field.type + ' ' + field.comment;
              _this4.addArg(argS);
            });

            if (view) {
              _this4.setView(view);
            }
            return _this4;
          }

          _createClass(_UpdateAction, [{
            key: 'process',
            value: function process(ctx) {
              var me = this;
              return regeneratorRuntime.mark(function _callee3() {
                var params, model, idVal, ret;
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        params = ctx.params();
                        model = mf.getModel();

                        model.merge(params);
                        idVal = ctx.param(model.getIdentifyField());

                        if (!(l && typeof l.beforeUpdate == 'function')) {
                          _context3.next = 7;
                          break;
                        }

                        _context3.next = 7;
                        return l.beforeUpdate(me, model, ctx, idVal);

                      case 7:
                        _context3.next = 9;
                        return ctx.getConnection().update(model);

                      case 9:
                        ret = _context3.sent;

                        if (!(l && typeof l.afterUpdate == 'function')) {
                          _context3.next = 13;
                          break;
                        }

                        _context3.next = 13;
                        return l.afterUpdate(me, model, ctx, idVal);

                      case 13:
                        return _context3.abrupt('return', ActionResult.createSuccessResult(ret));

                      case 14:
                      case 'end':
                        return _context3.stop();
                    }
                  }
                }, _callee3, this);
              });
            }
          }]);

          return _UpdateAction;
        }(Action);

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
       *          // example
       *          Notation & Example : {
       *                  beforeDel : function(model, actionCtx, ids) {
       *                          return function * () {
       *                          };
       *                  },
       *
       *                  afterDel : function(model, actionCtx, ids) {
       *                          return function * () {
       *                          };
       *                  }
       *          }
       * @since 0.1.0
       * @author hujiabao
       * */

    }, {
      key: 'getDelAction',
      value: function getDelAction(view) {
        var l = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

        var model = this.modelFactory.getModel();
        var mf = this.modelFactory;

        var _DelAction = function (_Action4) {
          _inherits(_DelAction, _Action4);

          function _DelAction() {
            _classCallCheck(this, _DelAction);

            var _this5 = _possibleConstructorReturn(this, Object.getPrototypeOf(_DelAction).call(this));

            var identityField = model.getIdentifyField();
            var field = model.getFieldDefinition(identityField);
            var argS = field.name + 's array(' + field.type + ') ' + field.comment;
            _this5.addArg(argS);
            _this5._idArg = field.name + 's';

            if (view) {
              _this5.setView(view);
            }
            return _this5;
          }

          _createClass(_DelAction, [{
            key: 'process',
            value: function process(ctx) {
              var me = this;
              return regeneratorRuntime.mark(function _callee4() {
                var model, ids, ret;
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                  while (1) {
                    switch (_context4.prev = _context4.next) {
                      case 0:
                        model = mf.getModel();
                        ids = ctx.param(me._idArg);

                        if (!(l && typeof l.beforeDel == 'function')) {
                          _context4.next = 5;
                          break;
                        }

                        _context4.next = 5;
                        return l.beforeDel.call(me, ctx, model, ids);

                      case 5:
                        _context4.next = 7;
                        return ctx.getConnection().del(model, ids);

                      case 7:
                        ret = _context4.sent;

                        if (!(l && typeof l.afterDel == 'function')) {
                          _context4.next = 11;
                          break;
                        }

                        _context4.next = 11;
                        return l.afterDel.call(me, ctx, model, ids);

                      case 11:
                        return _context4.abrupt('return', ActionResult.createSuccessResult(ret));

                      case 12:
                      case 'end':
                        return _context4.stop();
                    }
                  }
                }, _callee4, this);
              });
            }
          }]);

          return _DelAction;
        }(Action);

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
       *         // example
       *         Notation & Example : {
       *                 beforeList : function(model, actionCtx, conditions, pagination, orderBy, conditionPattern) {
       *                         return function * () {
       *                                 return 'AND $pluginName$ OR $pluginVersion$';
       *                         };
       *                 },
       *
       *                 afterList : function(model, actionCtx, result) {
       *                         return function * () {
       *                         };
       *                 }
       *         }
       * @since 0.1.0
       * @author hujiabao
       * */

    }, {
      key: 'getListAction',
      value: function getListAction() {
        var conditions = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];
        var orderBy = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];
        var conditionPattern = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];
        var view = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];
        var l = arguments.length <= 4 || arguments[4] === undefined ? null : arguments[4];

        var model = this.modelFactory.getModel();
        var mf = this.modelFactory;
        var ARRAY_CONDITIONS = ['BETWEEN', '-', 'IN', '()', 'NOT-IN', '!()'];

        var _ListAction = function (_Action5) {
          _inherits(_ListAction, _Action5);

          function _ListAction() {
            _classCallCheck(this, _ListAction);

            var _this6 = _possibleConstructorReturn(this, Object.getPrototypeOf(_ListAction).call(this));

            if (conditions == null) {
              conditions = {};
              var fieldNames = model.getFieldNames(false);
              fieldNames.forEach(function (f) {
                var field = model.getFieldDefinition(f);
                conditions[f] = field.name;
              });
            }
            for (var c in conditions) {
              var field = model.getFieldDefinition(c);
              if (field) {
                var con = conditions[c].toUpperCase();
                if (_.contains(ARRAY_CONDITIONS, con)) {
                  var argS = c + ' array(' + field.type + ') ' + field.comment + ', ' + EasyNode.i18n('commentExpression', __filename) + ' : "' + con + '", ' + EasyNode.i18n('commentDelimiter', __filename);
                  _this6.addArg(argS);
                } else {
                  var argS = c + ' ' + field.type + ' ' + field.comment + ', ' + EasyNode.i18n('commentExpression', __filename) + ' : "' + con + '"';
                  _this6.addArg(argS);
                }
              } else {
                logger.warn('Undefined field [' + c + '], query condition is ignored');
              }
            }
            // if(conditionPattern) {
            //        this.addArg(`__condition_pattern__ string ${EasyNode.i18n('commentConditionPattern', __filename)} : ${conditionPattern}`);
            // }
            // 分页参数_page和_rpp
            _this6.addArg('_page int ' + EasyNode.i18n('pageComment', __filename));
            _this6.addArg('_rpp int ' + EasyNode.i18n('rppComment', __filename));

            if (view) {
              _this6.setView(view);
            }
            return _this6;
          }

          _createClass(_ListAction, [{
            key: 'process',
            value: function process(ctx) {
              var me = this;
              return regeneratorRuntime.mark(function _callee5() {
                var model, realCondition, pagination, c, param, ids, ret;
                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                  while (1) {
                    switch (_context5.prev = _context5.next) {
                      case 0:
                        model = mf.getModel();
                        realCondition = {};
                        pagination = {
                          page: 1
                        };

                        if (ctx.param('_page') != null) {
                          pagination.page = parseInt(ctx.param('_page'));
                          pagination.page = isNaN(pagination.page) ? 0 : pagination.page;
                        }
                        if (ctx.param('_rpp') != null) {
                          pagination.rpp = parseInt(ctx.param('_rpp'));
                          pagination.rpp = isNaN(pagination.rpp) ? 0 : pagination.rpp;
                        }
                        for (c in conditions) {
                          if (ctx.hasParam(c)) {
                            param = ctx.param(c);

                            realCondition[c] = {
                              exp: conditions[c],
                              value: param
                            };
                          }
                        }
                        ids = ctx.param(me._idArg);

                        if (!(l && typeof l.beforeList == 'function')) {
                          _context5.next = 10;
                          break;
                        }

                        _context5.next = 10;
                        return l.beforeList.call(me, ctx, model, realCondition, pagination, orderBy, conditionPattern);

                      case 10:
                        _context5.next = 12;
                        return ctx.getConnection().list(model, realCondition, pagination, orderBy, conditionPattern);

                      case 12:
                        ret = _context5.sent;

                        if (!(l && typeof l.afterList == 'function')) {
                          _context5.next = 16;
                          break;
                        }

                        _context5.next = 16;
                        return l.afterList.call(me, ctx, model, ret);

                      case 16:
                        return _context5.abrupt('return', ActionResult.createSuccessResult(ret));

                      case 17:
                      case 'end':
                        return _context5.stop();
                    }
                  }
                }, _callee5, this);
              });
            }
          }]);

          return _ListAction;
        }(Action);

        Action.define(this.module, LIST_NAME, _ListAction);
        return _ListAction;
      }
    }, {
      key: 'getAll',
      value: function getAll() {
        return [this.getCreateAction(), this.getReadAction(), this.getUpdateAction(), this.getDelAction(), this.getListAction()];
      }
    }, {
      key: 'getClassName',
      value: function getClassName() {
        return EasyNode.namespace(__filename);
      }
    }]);

    return ModelProxyActionFactory;
  }(GenericObject);

  module.exports = ModelProxyActionFactory;
})();