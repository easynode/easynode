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


describe('RouterCacheTest', function() {

  before(function(done) {
    try {
      done();
    } catch (e) {
      done(e);
    }
  });


  it('koa-router-cache', function(done) {

    var koa = require('koa');
    var app = koa();

    app.use(function *(next) {
      var start = new Date();
      console.log(1);
      yield next;
      var ms = new Date - start;
      console.log(3);
      this.set('X-Response-Time', ms + 'ms');
      console.log(4);
    });

    app.use(function *() {
      this.body = 'Hello World!';
      console.log(2);
    });

    app.listen(3000);

    done();
  });


  after(function(done) {
    done();
  });

});

