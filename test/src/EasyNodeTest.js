/*
 Function:
 This is OpenApi test for c.163.com
 author: allen.hu
 date: 2016-05-05 20:14
 [OpenApi](https://c.163.com/wiki/index.php?title=OpenAPI%E4%BB%8B%E7%BB%8D)
 APP key: daaf3fdb307f4a38844211325116b72c
 APP Secret: bc12d62d47344a31b3c21a8693e2498d
 * */
'use strict';

require('../../src/EasyNode.js');
require('babel-polyfill');
import co from 'co';
import request from 'superagent';
import chai from 'chai';
const assert = chai.assert;
var fs = require('fs');
var http = require('http');
import req from 'request';
var _ = require('underscore');


describe('EasyNodeTest', function() {

  var root = '';
  var mochaTest = true;
  before(function(done) {
    try {
      root = EasyNode.addArg('easynode-home', process.cwd());
      mochaTest = EasyNode.addArg('mocha-test', true);
      done();
    } catch (e) {
      done(e);
    }
  });

  it('EasyNode.arg', function(done) {
    assert(EasyNode.arg('mocha-test') == mochaTest, 'mocha is not the test program');
    done();
  });


  it('EasyNode.home', function(done) {
    assert(EasyNode.home()) == root, 'easynode-home argument is not specified ';
    done();
  });

  it('EasyNode.real', function(done) {
    assert(EasyNode.real('a/b.js') == `${root}/a/b.js`, 'real function error');
    done();
  });

  it('EasyNode.extend', function(done) {
    var o = {a:'a'};
    EasyNode.extend(o, {b:'b'});
    assert(_.isEqual(o, {a:'a', b:'b'}), 'expected {a:\'a\',b:\'b\'}');
    done();
  });


  it('EasyNode.addConfigFile', function(done) {
    assert(EasyNode.addConfigFile('etc/nginx.conf') === undefined, 'addConfigFile return a value');
    done();
  });

  it('EasyNode.config', function(done) {
    assert(EasyNode.config('app.name', 'monitor') == 'monitor', 'Arg or configItem have no about \'monitor\' , return default value');
    done();
  });

  it('EasyNode.i18n', function(done) {
    assert(EasyNode.i18n() == undefined, 'does not pass key but return a value');
    assert(EasyNode.i18n(__filename) == undefined, 'does not pass key but return a value');
    assert(EasyNode.i18n('easynode.framework.mvc.ActionResult.errors.0') == '接口调用成功', 'easynode.framework.mvc.ActionResult.errors.0 defined value have been modified');
    try {
      assert(EasyNode.addi18nDirectory('etc/noexist.conf') == undefined, 'useless');
    } catch (e) {
            // console.log(e.message);
    } finally {
            // done();
    }
    done();
  });

  it('EasyNode.setLocale', function(done) {
    assert(EasyNode.setLocale('en') == undefined, 'setLocal return value');
    assert(EasyNode.getLocale() == 'en', 'setLocal invalidate');
    done();
  });

  it('EasyNode.namespace', function(done) {
    assert(EasyNode.namespace(__filename).length > 0, 'return  invalidate');
    assert(EasyNode.namespace(__dirname).length > 0, 'return invalidate');
    done();
  });

  it('EasyNode.setEnv', function(done) {
    EasyNode.setEnv('TEST');
    assert(EasyNode.src == 'lib', 'test etc stage, not use lib');
    EasyNode.setEnv('DEVELOP');
    assert(EasyNode.src == 'src', 'develop stage, not use src');
    done();
  });

  it('EasyNode.using', function(done) {
    var GenericObject = EasyNode.using('easynode.GenericObject');
    console.log(GenericObject);
    assert(typeof GenericObject == 'function', 'class is not function');
    assert(GenericObject.name == 'GenericObject', 'name is not the class name');
    assert(new GenericObject() instanceof GenericObject, 'name is not the class name');

    assert(Object.getPrototypeOf(new EasyNode.using('easynode.framework.plugin.EasyNodePlugin')) == GenericObject, 'Object.getPrototypeOf and instanceOf can test to some class is  subclass ');

    const MyClass = class Me {
      getClassName() {
        return Me.name;
      }
        };
    const inst = new MyClass();
    assert(MyClass.name == 'Me', 'Me has not a class name because it is a internal class');
    assert(inst.getClassName(), 'Me has not a class name because it is a internal class');
    try {
      assert(Me == undefined, 'Me has not a class name because it is a internal class');
    } catch (e) {
      console.log(e.message);
    } finally {

    }

    done();
  });

  it('EasyNode.namespace2Path', function(done) {
        // console.log(EasyNode.namespace2Path('easynode.GenericObject'));
    co(function *() {
      var path = yield EasyNode.namespace2Path('easynode.GenericObject');
      assert(path == `${root}/easynode/src/easynode.GetnericObject`, 'inverse of transforming class to path');
    });

    done();
  });

  it('EasyNode.create', function(done) {
        /* var GenericObject = EasyNode.create('easynode.GenericObject');
        console.log(GenericObject.toJSONString());

        var GenericObject = EasyNode.create('easynode.framework.plugin.EasyNodePlugin');
        console.log(GenericObject.toJSONString());
        //ToDO
        //assert( path == `${root}/easynode/src/easynode.GetnericObject`,'inverse of transforming class to path');
*/
    done();
  });

  it('EasyNode.getLocalIP', function(done) {
    var ip = EasyNode.getLocalIP();
    assert(ip == '127.0.0.1', 'EasyNode.config(easyode.local.ip)->eth0->127.0.0.1');
    done();
  });

  it('EasyNode.getLocalIP', function(done) {
    var ip = EasyNode.getLocalIP();
    assert(ip == '127.0.0.1', 'EasyNode.config(easyode.local.ip)->eth0->127.0.0.1');
    done();
  });


  it('EasyNode.sleep', function(done) {

    co(function*(){
      //yield EasyNode.sleep(5000);
    });

    done();
  });


  after(function(done) {
    done();
  });

});

