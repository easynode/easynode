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

EasyNode.DEBUG = true;
var id = 0;
var model = {};

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


    it('execUpdate', function(done) {

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

                var sql = 'insert monitor_user set account = #account#, accountid = #accountid#, email = #email#, ' +
                    'phonenumber = #phonenumber#, salt = #salt#, passwordsha = #passwordsha#,  createtime = #createtime#, updatetime = #updatetime#';
                var args = {
                    account: 'hujb2000',
                    accountid: 'hujb2000@163.com',
                    email: 'hujb2000@163.com',
                    phonenumber: '1888888888',
                    salt: 'passwordsalt',
                    passwordsha: '123asf121',
                    createtime: Date.now(),
                    updatetime: Date.now()
                };
                var ret = yield conn.execUpdate(sql, args);
                id = ret.insertId;
                if( ret.hasOwnProperty('affectedRows') ){
                }else{
                }
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

    it('transaction address', function(done) {

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

                yield conn.beginTransaction();
                var sql = 'insert monitor_user set account = #account#, accountid = #accountid#, email = #email#, ' +
                    'phonenumber = #phonenumber#, salt = #salt#, passwordsha = #passwordsha#,  createtime = #createtime#, updatetime = #updatetime#';
                var args = {
                    account: 'hujb2000',
                    accountid: 'hujb2000@163.com',
                    email: 'hujb2000@163.com',
                    phonenumber: '1888888888',
                    salt: 'passwordsalt',
                    passwordsha: '123asf121',
                    createtime: Date.now(),
                    updatetime: Date.now()
                };
                var ret = yield conn.execUpdate(sql, args);
                if( ret.hasOwnProperty('affectedRows') ){
                    console.log(ret);
                }else{
                    console.log(ret);
                }
                yield conn.commit();
            }catch(e){
                console.log(e.message);
                yield conn.rollback();
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


    it('del record', function(done) {

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

                var sql = 'delete  from monitor_user where id = #id#';
                var args = {
                    id:id
                };
                var ret = yield conn.execQuery(sql, args);
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


    it('create model', function(done) {

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

                var User = require( './User');
                var modelUser = new User();
                var args = {
                    account: 'hujb2000',
                    accountid: 'hujb2000@163.com',
                    email: 'hujb2000@163.com',
                    phonenumber: '1888888888',
                    salt: 'passwordsalt',
                    passwordsha: '123asf121',
                    createtime: Date.now(),
                    updatetime: Date.now()
                };
                model = args;
                modelUser.merge(args);
                var ret = yield conn.create(modelUser);

                assert( ret.affectedRows === 1 ,'equal');
                assert( ret.insertId > 0, 'id is greater zero');
                id = ret.insertId;
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

    it('read model', function(done) {

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

                var User = require( './User');
                var modelUser = new User();

                var ret = yield conn.read(modelUser,id);
                assert( _.isEqual( ret, Object.assign(model,{id:id}) ),'equal' );
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

    it('update model', function(done) {

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

                var User = require( './User');
                var modelUser = new User();
                modelUser.merge(model);
                modelUser.merge({account:'hujb2000@tecent.com'});
                var ret = yield conn.update(modelUser);
                assert( modelUser.getFieldValue('account') === 'hujb2000@tecent.com', 'equal');
                model = modelUser;
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

    it('list model', function(done) {

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
        var ret = {rows:0, pages:0, page:0, rpp:0, data:[]};

        co(function* (){
            try{
                // Get a connection from connection pools
                var conn = yield dataSource.getConnection();

                var User = require( './User');
                var modelUser = new User();

                ret = yield conn.list(modelUser, {id: {exp:'<>', value:0}}, {page: 0, rpp: 20}, ['updatetime ASC']);
                console.log(ret);
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

    it('del model', function(done) {

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

                var User = require( './User');
                var modelUser = new User();

                var ret = yield conn.del(modelUser,[id]);
                assert( _.isEqual(ret,{affectedRows:1, insertId:0}), 'equal');
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

