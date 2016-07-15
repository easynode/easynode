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
var thunkify = require('thunkify');

describe('TestCaseTest', function() {

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

    it('EasyNode.addSourceDirectory', function(done) {

        EasyNode.addSourceDirectory('test');

        done();
    });

    it('post', function(done) {

        var APMTool = EasyNode.using('easynode.framework.util.APMTool');

       /* try{//不能捕获取Co执行器中的错误
            //ToDo
            co(function*(){
               yield APMTool.post('abcdef');
            });

        }catch(e){
            assert( e.message === 'Abstract Method','equal');
        }*/

        co(function*(){
            try{
                //ToDo, wait for build APM Server
                yield APMTool.post('abcdef');
            }catch(e){
                console.log(e);
            }
        });

    });

    after(function(done) {
        done();
    });

});

