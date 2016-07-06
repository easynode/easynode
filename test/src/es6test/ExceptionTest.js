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

require('babel-polyfill');
import co from 'co';
import request from 'superagent';
import chai from 'chai';
const assert = chai.assert;
var fs = require('fs');
var http = require('http');
import req from 'request';
var _ = require('underscore');


describe('ExceptionTest', function() {

  before(function(done) {
    try {
      done();
    } catch (e) {
      done(e);
    }
  });


  it('exception(uncaughtException)', function(done) {

    try {
      throw new Error('Catch me');
    } catch (e) {
            // error captured
      assert(e.message === 'Catch me', 'Catch me');
    }

    done();
  });

  it('exception(uncaughtException)2', function(done) {

    try {
            // 由于NodeJS的异步特性,这里的try->catch并不能捕获到该异常
      process.nextTick(function my_app() {
        throw new Error('Catch me');
      });
    } catch (e) {
            // error captured
      console.log('can not catch me');
    }

    done();
  });

  it('exception(uncaughtException)3', function(done) {

    (function _handleUncaughtException() {
            /*
            未知异常捕获,不提倡
            * */
      process.on('uncaughtException', function(err) {
        console.error('unhandled error : ', err.stack);
        if (err.message === 'Catch me') {
          console.log('Catch me');
                    // process.exit(-1);
        }
      });
    })();

    try {
            // 由于NodeJS的异步特性,这里的try->catch并不能捕获到该异常
      process.nextTick(function my_app() {
        throw new Error('Catch me');
      });
    } catch (e) {
            // error captured
      console.log('can not catch me');
    }

    done();
  });

  after(function(done) {
    done();
  });

});

