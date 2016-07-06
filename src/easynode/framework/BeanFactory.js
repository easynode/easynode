var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var GenericObject = using('easynode.GenericObject');
var _ = require('underscore');
var fs = require('co-fs');
var f = require('fs');

(function() {
  var configuration = {};
  var singletons = {};

  const INT_CONFIG_REGEXP = /^\$int\((.*)\)$/;
  const FLOAT_CONFIG_REGEXP = /^\$float\((.*)\)$/;
  const STRING_CONFIG_REGEXP = /^\$str\((.*)\)$/;
  const BEAN_REGEXP = /^\$(.*)$/;

        /**
         * Class BeanFactory
         *
         * @class easynode.framework.BeanFactory
         * @extends easynode.GenericObject
         * @since 0.1.0
         * @author hujiabao
         * */
  class BeanFactory extends GenericObject {
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
                 * 初始化BeanFactory。逐个读取参数中的文件，根据参数中的文件描述创建BeanFactory，实现IoC。这些文件应当是标准的JSON数据格式。
                 *
                 * @method initialize
                 * @static
                 * @async
                 * @since 0.1.0
                 * @author hujiabao
                 *
                 * @example
                 *      yield BeanFactory.initialize('etc/beans/demo-easynode-beans.json', 'etc/beans/demo-easynode-beans-1.json');
                 * */
    static initialize() {
      var arr = _.toArray(arguments);
      return function *() {
        for (var i = 0; i < arr.length; i++) {
          var file = EasyNode.real(arr[i]);
          var exists = yield fs.exists(file);
          if (!exists) {
            throw new Error(`beans configuration file [${file}] is not found`);
          }
                                        // var content = yield fs.readFile(file);
          var content = f.readFileSync(file);
          content = content.toString();
          var o = JSON.parse(content);
          _.extend(configuration, o);
        }
      };
    }

                /**
                 * 根据bean ID获取Bean。
                 *
                 * @method get
                 * @param {String} id bean ID。
                 * @return {Object} bean实例。
                 * @static
                 * @since 0.1.0
                 * @author hujiabao
                 *
                 * @example
                 *      yield BeanFactory.initialize('etc/beans/demo-easynode-beans.json', 'etc/beans/demo-easynode-beans-1.json');
                 *      var bean1 = BeanFactory.get('bean1');
                 *      bean1.name1 = 'hujiabao';
                 *      bean1 = BeanFactory.get('bean1');
                 *      console.log(bean.name1);                //hujiabao, 使用singleton或prototype来描述创建bean的行为模式是单例还是原型。
                 * */
    static get(id) {
      return BeanFactory.bean(id);
    }

    static init(id) {
      return BeanFactory.get(id);
    }

                /**
                 * 放置一个单例bean至BeanFactory。可链式调用。
                 *
                 * @method put
                 * @param {String} id bean ID。
                 * @param {Object} obj bean实例。
                 * @return {easynode.framework.BeanFactory} 返回BeanFactory类，可链式调用
                 * @static
                 * @since 0.1.0
                 * @author hujiabao
                 *
                 * */
    static put(id, obj) {
      assert(id && obj, 'Invalid argument');
      if (configuration[id]) {
        throw new Error('Duplicated bean id [${id}]');
      }
      configuration[id] = {
        scope : 'singleton'
      };
      singletons[id] = obj;
      return BeanFactory;
    }

    static bean(id) {
      var cfg = configuration[id];
      if (cfg == null) {
        throw new Error(`bean [${id}] is not defined`);
      }
      if (typeof cfg != 'object') {
        throw new Error(`definition of bean [${id}] is incorrect`);
      }

      var scope = cfg['scope'] || 'singleton';
      if (scope == 'singleton') {
        if (singletons[id] != null) {
          return singletons[id];
        }
        var o = BeanFactory.createBean(id, cfg);
        return singletons[id] = o;
      }
      else if (scope == 'prototype') {
        return BeanFactory.createBean(id, cfg);
      }
                        else {
        throw new Error(`Invalid bean scope [${scope}]`);
      }
    }

    static createBean(id, cfg) {
      var className = cfg['class'];
      var init = cfg['init'];
      var destroy = cfg['destroy'];
      var props = cfg['props'];
      var Clazz = using(className);

      var obj = null;
      if (typeof Clazz == 'function') {                                          // export a Class
        obj = new Clazz();
      }
      else {
        obj = Clazz;                                                                     // export a module or an literal object
      }

      if (props) {
        assert(typeof props == 'object', `Invalid props config of bean [${id}]`);
        for (var key in props) {
          var val = BeanFactory.eval(props[key]);
          obj[key] = val;
        }
      }

      if (init) {
        assert(typeof obj[init] == 'function', `Initialize function of bean [${id}] is not found`);
        var initArgs = cfg['init-args'];
        var initArgVals = [];
        if (initArgs) {
          assert(_.isArray(initArgs), 'Invalid init arguments');
          for (var i = 0; i < initArgs.length; i++) {
            initArgVals.push(BeanFactory.eval(initArgs[i]));
          }
        }
        obj[init].apply(obj, initArgVals);
      }

      return obj;
    }

    static eval(exp) {
      if (exp == null) return exp;

      if (typeof exp == 'number') {
        return exp;
      }

      if (typeof exp == 'object') {
        for (var key in exp) {
          exp[key] = BeanFactory.eval(exp[key]);
        }
      }

      if (INT_CONFIG_REGEXP.test(exp)) {
        var configKey = INT_CONFIG_REGEXP.exec(exp)[1];
        return parseInt(EasyNode.config(configKey, '0'));
      }

      if (FLOAT_CONFIG_REGEXP.test(exp)) {
        var configKey = FLOAT_CONFIG_REGEXP.exec(exp)[1];
        return parseFloat(EasyNode.config(configKey, '0'));
      }

      if (STRING_CONFIG_REGEXP.test(exp)) {
        var configKey = STRING_CONFIG_REGEXP.exec(exp)[1];
        return EasyNode.config(configKey);
      }

      if (BEAN_REGEXP.test(exp)) {
        var beanId = BEAN_REGEXP.exec(exp)[1] || '';
        return BeanFactory.bean(beanId);
      }

      return exp;
    }

    getClassName() {
      return EasyNode.namespace(__filename);
    }
        }

  module.exports = BeanFactory;
})();
