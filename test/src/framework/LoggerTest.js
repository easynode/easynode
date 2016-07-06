/*
 Function:Logger Test
 Created by hujiabao on 6/22/16.
 * */
'use strict';

require('../../../src/EasyNode.js');
require('babel-polyfill');
import co from 'co';
import request from 'superagent';
import chai from 'chai';
const assert = chai.assert;
var fs = require('fs');
var http = require('http');
import req from 'request';
var _ = require('underscore');


describe('LoggerTest', function() {

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

  it('LoggerSingleInstance', function(done) {

    var Logger = EasyNode.using('easynode.framework.Logger');
    try {
      var logger = new Logger();
    } catch (e) {
      console.log('Logger is a singleton class instance, use getLogger()  instead of instantiation');
    } finally {

    }

    var logger = EasyNode.using('easynode.framework.Logger').getLogger();
    var logger2 = EasyNode.using('easynode.framework.Logger').getLogger();
    assert(logger === logger2, 'singleton class instance');

    EasyNode.DEBUG && logger.debug('Hello, EasyNode');
    logger.info('Hello, EasyNode');
    logger.warn('Hello, EasyNode');
    logger.error('Hello, EasyNode');
    logger.fatal('Hello, EasyNode');

    done();
  });


  it('forFile', function(done) {

    var logger = using('easynode.framework.Logger').forFile(__filename);
    EasyNode.DEBUG && logger.debug('Hello, EasyNode');
    logger.info('Hello, EasyNode2');
    logger.warn('Hello, EasyNode2');
    logger.error('Hello, EasyNode2');
    logger.fatal('Hello, EasyNode2');


    done();
  });


  it('getLogger(access)', function(done) {

    var logger = using('easynode.framework.Logger').getLogger('access');
    EasyNode.DEBUG && logger.debug('Hello, EasyNode');
    logger.info('Hello, EasyNode2');
    logger.warn('Hello, EasyNode2');
    logger.error('Hello, EasyNode2');
    logger.fatal('Hello, EasyNode2');


    done();
  });

  after(function(done) {
    done();
  });

});

