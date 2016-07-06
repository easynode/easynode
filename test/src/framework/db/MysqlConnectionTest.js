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


describe('MysqlConnectionTest', function() {

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

    it('execQuery', function(done) {

        var config = {
            "host": "218.205.113.98",
            "port": 3306,
            "user": "monitor_pro",
            "password": "monitor_pro",
            "database": "monitor_pro",
            "acquireTimeout": "10000",
            "waitForConnections" : true,
            "connectionLimit" :  10,
            "queueLimit" : 10000
        };
        var MySqlDataSource = EasyNode.using('easynode.framework.db.MysqlDataSource');
        var dataSource = new MySqlDataSource();
        dataSource.initialize(config);

        co(function* (){
            try{
                // Get a connection from connection pools
                var conn = yield dataSource.getConnection();

                var sql = 'SELECT max(id)  as maxId FROM monitor_user';
                var args = {};
                var arr = yield conn.execQuery(sql, args = {});
                assert( arr.length > 0, '[ {maxid:null} ]');

            }catch(e){
                console.log(e.message);
            }finally{
                // release a connection
                yield dataSource.releaseConnection(conn);

                // destroy data source
                yield dataSource.destroy();
            }


            done();
        }).catch( function(err){
            if( err ){
                console.log(e.stack);
                console.log(e.message);
            }
        } );

    });

    after(function(done) {
        done();
    });

});

