/*
 Function:Logger Test
 Created by hujiabao on 6/22/16.
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


describe('ActionTest', function() {

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

    it('action', function(done) {


        var Action = EasyNode.using('easynode.framework.mvc.Action');

        class MyAction extends Action {
                constructor (ctx) {
                    super(ctx);
                }
        }
        MyAction.module = 'demoM';
        MyAction.action = 'demoA';

        Action.define('demoM','demoA',MyAction);

        done();
      /*  var dataSource = new Action();

        co(function* (){
            try{
                // Get a connection from connection pools
                var conn = yield dataSource.getConnection();

                var MysqlModelGenerator = EasyNode.using('easynode.framework.mvc.spi.MysqlModelGenerator');
                var ret = yield MysqlModelGenerator.generate(dataSource, 'monitor_pro', [{table:'monitor_user'}])
                assert( ret === undefined, 'no return ')

                var model = MysqlModelGenerator.getModel('monitor_user');
                console.log(model);
            }catch(e){
                console.log(e);
                EasyNode.DEBUG && logger.debug(` ${e}`);
            }finally{
                // release a connection
                yield dataSource.releaseConnection(conn);

                // destroy data source
                yield dataSource.destroy();
            }

            done();
        });*/

    });

    after(function(done) {
        done();
    });

});

