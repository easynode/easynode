var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var GenericObject = using('easynode.GenericObject');
var Action = using('easynode.framework.mvc.Action');
var BeanFactory = using('easynode.framework.BeanFactory');
var S = require('string');
var fs = require('co-fs');
var _ = require('underscore');

(function() {
  var entry = {};
  var descriptionMap = new Map();

  /**
   * Class ActionFactory 此类不赞成使用
   *
   * @class easynode.framework.mvc.ActionFactory
   * @extends easynode.GenericObject
   * @since 0.1.0
   * @deprecated
   * @author hujiabao
   * */
  class ActionFactory extends GenericObject {

    /**
     * 构造函数。
     *
     * @method 构造函数
     * @since 0.1.0
     * @author hujiabao
     * */
    constructor() {
      super();
        // 调用super()后再定义子类成员。
    }

    /**
     * 注册一个Action。使得可以通过json api或restful api来调用。注册的Action可以是一个类、一个全类名
     * 或一个Action实例。
     * <h5>http://localhost:5000/json?m=actionModule&a=actionName</h5>
     * <h5>http://localhost:5000/rest/actionModule/actionName</h5>
     *
     * @method register
     * @param {String/Class} actionClass Action类名或类，它是一个js文件的EasyNode字符串命名空间表示
     * @param {String} moduleName 模块名
     * @param {String} actionName action名
     * @param {String} description Action功能描述
     * @since 0.1.0
     * @author hujiabao
     * @example
     *
     *      var Action = using('easynode.framework.mvc.Action');
     *      var ActionFactory = using('easynode.framework.mvc.ActionFactory');
     *      class MyAction extends Action {
     *              constructor (env) {
     *                      super(env);
     *              }
     *      }
     *
     *      // 访问：http://localhost:5000/rest/demoM/demoA
     *      MyAction.module = 'demoM';
     *      MyAction.action = 'demoA';
     *
     *      // 与如下语句相同。
     *      Action.define('demoM', 'demoA', MyAction);
     *
     *      ActionFactory.register(MyAction);
     * */
    static register(actionClass, moduleName, actionName, description) {
      if (typeof actionClass == 'string') {
        //    assert(actionClass.match(/^[0-9a-zA-z\.\*]+$/), 'Invalid action class');
        var m = '';
        var a = '';
        var ActionClass = null;
        if (actionClass.match(/^[0-9a-zA-z\.\*]+$/)) {
          ActionClass = using(actionClass); // ActionClass is class
          m = moduleName || ActionClass.module;
          a = actionName || ActionClass.action;
        }
        else {
          ActionClass = actionClass;    // ActionClass is string
          m = moduleName;
          a = actionName;
        }
        assert(typeof m == 'string' && typeof a == 'string', 'Invalid arguments');
        // assert(!_.isEmpty(ActionClass)&&!S(m).isEmpty() && !S(a).isEmpty(), 'Invalid arguments');
        EasyNode.DEBUG && logger.debug(`register action [${m}.${a}]`);
        entry[m] = entry[m] || {};
        entry[m][a] = ActionClass;                             // stored class or string
        ActionFactory.addActionDescription(m, a, description);
      }
      else if (typeof actionClass == 'function') {
        var m = actionClass.module;
        var a = actionClass.action;
        assert(typeof m == 'string' && typeof a == 'string', 'Invalid arguments');
        assert(!S(m).isEmpty() && !S(a).isEmpty(), 'Invalid arguments');
        EasyNode.DEBUG && logger.debug(`register action [${m}.${a}]`);
        entry[m] = entry[m] || {};
        entry[m][a] = actionClass;                             // stored class, not string
        ActionFactory.addActionDescription(m, a, description);
      }
      else if (typeof actionClass == 'object') {
        var m = actionClass.module;
        var a = actionClass.action;
        assert(actionClass instanceof Action, 'Invalid action instance');
        assert(m && a, 'Invalid action instance');
        EasyNode.DEBUG && logger.debug(`register action [${m}.${a}]`);
        entry[m] = entry[m] || {};
        entry[m][a] = actionClass;                             // stored class instance, not string
        ActionFactory.addActionDescription(m, a, description);
      }
      else {
        throw new Error('Invalid argument');
      }
    }

    /**
     * 删除一个Action。
     *
     * @method remove
     * @param {String} m    模块名
     * @param {String} a     Action名，不传时表示删除m模块下所有的Action。
     * @since 0.1.0
     * @author hujiabao
     * */
    remove(m, a) {
      assert(typeof m == 'string', 'Invalid arguments');
      if (arguments.length == 1) {
        delete entry[m];
      }
      if (arguments.length == 2) {
        assert(typeof a == 'string', 'Invalid arguments');
        delete entry[m][a];
      }
    }

    /**
     * 加载目录中所有文件名匹配pattern的Action。pattern默认为：/^.*Action\.js$/。如果将MethodDispatchedAction与一般Action
     * 放在一个目录，建议将MethodDispatchedAction命名为XXXActions.js。
     *
     * @method registerNamespace
     * @param {String} namespace  命名空间，指明一个源码目录。
     * @param {RegExp} pattern Action文件的pattern, 默认为/^.*Action\.js$/
     * @async
     * @since 0.1.0
     * @author hujiabao
     * */
    static registerNamespace(namespace, pattern = /^.*Action\.js$/) {
      return function *() {
        var path = yield EasyNode.namespace2Path(namespace);
        var stat = yield fs.stat(path);
        if (stat.isFile()) {
          throw new Error('Invalid namespace, not a directory');
        }
        var files = yield fs.readdir(path);
        files.forEach((file) => {
          if (file.match(pattern)) {
            ActionFactory.register(namespace + '.' + file.replace(/\.js$/, ''));
          }
        });
      };
    }

    /**
     * 加载一个根据函数名路由的Action。
     *
     * @method registerMethodDispatchedAction
     * @param {String/Class} namespace  String: 命名空间，指明一个全类名；Class : 类，要求继承于MethodDispatchedAction
     * @param {String} moduleName 模块名
     * @async
     * @since 0.1.0
     * @author hujiabao
     * */
    static registerMethodDispatchedAction(namespace, moduleName = null) {
      assert(typeof namespace == 'string' || typeof namespace == 'function', 'Invalid arguments');
      var MethodDispatchedActionClass = namespace;
      if (typeof namespace == 'string') {
        MethodDispatchedActionClass = using(namespace);
      }
      var instance = new MethodDispatchedActionClass();
      if (moduleName) {
        instance.moduleName(moduleName);
      }
      instance.register();
    }

    /**
     * 从.json文件中加载Action。
     *
     * @method initialize
     * @param {...} ...  文件相对路径，多参
     * @async
     * @static
     * @since 0.1.0
     * @author hujiabao
     * */
    static initialize() {
      var arr = _.toArray(arguments);
      return function *() {
        for (var i = 0; i < arr.length; i++) {
          var file = EasyNode.real(arr[i]);
          var content = yield fs.readFile(file);
          var o = JSON.parse(content.toString());
          for (var m in o) {
            var actionModule = m;
            var actions = o[m];
            actions.forEach((action) => {
              var actionName = action['action-name'] || '';
              if (action['enabled'] !== false && action['enabled'] !== 'false') {
                var description = action['description'] || '';
                var actionType = action['type'];
                if (action.hasOwnProperty('action-class')) {
                  ActionFactory.register(action['action-class'], actionModule, actionName, description);
                }
                else if (action.hasOwnProperty('action-bean')) {
                  ActionFactory.register(action['action-bean'], actionModule, actionName, description);
                }
                                                                else {
                  throw new Error('Invalid argument');
                }
              }
              else {
                logger.info(`disabled action [${actionModule}.${actionName}]`);
              }
            });

          }

        }
      };
    }

    /**
     * 查找一个Action。
     *
     * @method find
     * @param {String} m  模块名
     * @param {String} a Action名
     * @return {easynode.framework.mvc.Action} Action实现类，继承自easynode.framework.mvc.Action。
     * @private
     * @static
     * @since 0.1.0
     * @author hujiabao
     * */
    static find(m, a) {
      assert(typeof m == 'string' && typeof a == 'string', 'Invalid arguments');
      assert(!S(m).isEmpty() && !S(a).isEmpty(), 'Invalid arguments');
      return (entry[m] && entry[m][a]) ? entry[m][a] : null;
    }

    /**
     * 枚举出所有的Action。
     *
     * @method list
     * @param {String} m  模块名，不传时表示枚举所有的Action。
     * @return {Array} Action实现类数组，继承自easynode.framework.mvc.Action。
     * @static
     * @since 0.1.0
     * @author hujiabao
     * */
    static list(m) {
      var l = [];
      if (m) {
        l = descriptionMap.get(m);
      }
      else {
        var keys = descriptionMap.keys();
        for (var key of keys) {
          l.push.apply(l, descriptionMap.get(key));
        }
      }
      return l;
    }

    /**
     * 创建一个Action实例。
     *
     * @method createActionInstance
     * @param {String} m  模块名。
     * @param {String} a Action名。
     * @param {easynode.framework.mvc.ActionContext} ctx ActionContext实例。
     * @return {easynode.framework.mvc.Action} Action实例，不是Action类。
     * @static
     * @since 0.1.0
     * @author hujiabao
     * */
    static createActionInstance(m, a, ctx) {
      assert(typeof m == 'string' && typeof a == 'string', 'Invalid arguments');
      assert(!S(m).isEmpty() && !S(a).isEmpty(), 'Invalid arguments');

      var Clazz = ActionFactory.find(m, a);
      if (Clazz) {
        var ret = null;
        if (typeof Clazz == 'function') {
          var action = new Clazz();
          action.setModule(m);
          action.setActionName(a);
          action.setContext(ctx);
          ctx && ctx.setAction(action);
          ret = action;
        }
        else if (typeof Clazz == 'object') {
          Clazz.setModule(m);
          Clazz.setActionName(a);
          Clazz.setContext(ctx);
          ctx && ctx.setAction(Clazz);
          ret = Clazz;
        }
        else if (typeof Clazz == 'string') {
          Clazz = Clazz.replace('$', '');
          Clazz = BeanFactory.get(Clazz);
          assert(Clazz instanceof Action, 'Invalid action type');
          Clazz.setModule(m);
          Clazz.setActionName(a);
          Clazz.setContext(ctx);
          ctx && ctx.setAction(Clazz);
          ret = Clazz;
        }
        return ret;
      }
    }

    /**
     * 注册action信息
     *
     * @method addActionDescription
     * @param
     * @static
     * @since 0.1.0
     * @author hujiabao
     * */
    static addActionDescription(m, a, description) {
      assert(typeof m == 'string' && typeof a == 'string', 'Invalid arguments');
      assert(!S(m).isEmpty() && !S(a).isEmpty(), 'Invalid arguments');
      var obj = {
        'moduleName': m,
        'actionName': a,
        'state':1,
        'description': description
      };
      var actions = descriptionMap.has(m) ? descriptionMap.get(m) : [];
      actions.push(obj);
      descriptionMap.set(m, actions);
    }

    getClassName() {
      return EasyNode.namespace(__filename);
    }

  }

  module.exports = ActionFactory;
})();
