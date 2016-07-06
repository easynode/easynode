/*
 Function:AopTest
 Created by hujiabao on 6/24/16.
 * */
'use strict';

require('../../../../src/EasyNode.js');
require('babel-polyfill');
import co from 'co';
import request from 'superagent';
import chai from 'chai';
const assert = chai.assert;
var fs = require('fs');
var http = require('http');
import req from 'request';
var _ = require('underscore');


describe('AopTest', function() {

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

  it('EasyNode.setEnv', function(done) {
    EasyNode.setEnv('TEST');
    assert(EasyNode.src == 'lib', 'test etc stage, not use lib');
    EasyNode.setEnv('DEVELOP');
    assert(EasyNode.src == 'src', 'develop stage, not use src');
    done();
  });

  it('aop.after', function(done) {
    var AOP = using('easynode.framework.aop.AOP');
    var obj = {
      name : 'ABC',
      sayHello : function(hello) {
        this.name = 'abc';
        return 1;
      }
    };

         // co(function*() {//willn't throw error after wrapping
    var ret3 = AOP.after(obj, 'sayHello', function(ret) {
      assert(ret === 1, "upstream\'return is downstream\' input param");
      assert(this.name == 'abc', 'this.name has modified');
      return 2;
    });
    assert(2 == obj.sayHello('Hello'), 'finaly return');

    AOP.after(obj, 'sayHello', function(ret) {
      assert(ret === 2, "upstream\'return is downstream\' input param");
      assert(this.name == 'abc', 'this.name has not modified');
      return 3;
    });
    assert(3 == obj.sayHello('Hello'), 'finalyy return');
       // });

    done();
  });

  it('aop.before', function(done) {
    var AOP = using('easynode.framework.aop.AOP');
    var obj = {
      name : 'ABC',
      sayHello : function(hello) {
        assert(hello == 'ppp', 'hook out equal be hooked input');
        this.name = 'abc';
        return 2;
      }
    };

    AOP.before(obj, 'sayHello', function(hello) {
      assert(this.name == 'ABC', 'before hook');
      return ['ppp'];
    });
    assert(2 == obj.sayHello('Hello'), '2');

    done();
  });

  after(function(done) {
    done();
  });

});

