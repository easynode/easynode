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


describe('ActionRequestParameterTest', function() {

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

    it('params', function(done) {


        var ActionRequestParameter = EasyNode.using('easynode.framework.mvc.ActionRequestParameter');
        var actionRequestParameter = new ActionRequestParameter();

        try{
            var ret = actionRequestParameter.params();
            console.log(ret);
        }catch(e){
            assert( e.message === 'Abstract Method','equal');
        }

        done();
    });

    it('param', function(done) {


        var ActionRequestParameter = EasyNode.using('easynode.framework.mvc.ActionRequestParameter');
        var actionRequestParameter = new ActionRequestParameter();

        try{
            var ret = actionRequestParameter.param();
        }catch(e){
            assert( e.message === 'Abstract Method','equal');
        }

        done();
    });

    it('get', function(done) {


        var ActionRequestParameter = EasyNode.using('easynode.framework.mvc.ActionRequestParameter');
        var actionRequestParameter = new ActionRequestParameter();

        try{
            var ret = actionRequestParameter.get('name');
        }catch(e){
            assert( e.message === 'Abstract Method','equal');
        }

        done();
    });

    it('hasParam', function(done) {


        var ActionRequestParameter = EasyNode.using('easynode.framework.mvc.ActionRequestParameter');
        var actionRequestParameter = new ActionRequestParameter();

        try{
            var ret = actionRequestParameter.hasParam('name');
        }catch(e){
            assert( e.message === 'Abstract Method','equal');
        }

        done();
    });

    it('paramNames', function(done) {


        var ActionRequestParameter = EasyNode.using('easynode.framework.mvc.ActionRequestParameter');
        var actionRequestParameter = new ActionRequestParameter();

        try{
            var ret = actionRequestParameter.paramNames();
        }catch(e){
            assert( e.message === 'Abstract Method','equal');
        }

        done();
    });

    it('file', function(done) {


        var ActionRequestParameter = EasyNode.using('easynode.framework.mvc.ActionRequestParameter');
        var actionRequestParameter = new ActionRequestParameter();

        try{
            var ret = actionRequestParameter.file();
        }catch(e){
            assert( e.message === 'Abstract Method','equal');
        }

        done();
    });

    it('saveFile', function(done) {


        var ActionRequestParameter = EasyNode.using('easynode.framework.mvc.ActionRequestParameter');
        var actionRequestParameter = new ActionRequestParameter();

        try{
            var ret = actionRequestParameter.saveFile();
        }catch(e){
            assert( e.message === 'Abstract Method','equal');
        }

        done();
    });

    it('fileNames', function(done) {


        var ActionRequestParameter = EasyNode.using('easynode.framework.mvc.ActionRequestParameter');
        var actionRequestParameter = new ActionRequestParameter();

        try{
            var ret = actionRequestParameter.fileNames();
        }catch(e){
            assert( e.message === 'Abstract Method','equal');
        }

        done();
    });

    it('intParam', function(done) {


        var ActionRequestParameter = EasyNode.using('easynode.framework.mvc.ActionRequestParameter');
        var actionRequestParameter = new ActionRequestParameter();

        try{
            //this.param(name,where) is a abstract method
            var ret = actionRequestParameter.intParam('name');

        }catch(e){
            assert( e.message === 'Abstract Method','equal');
        }

        done();
    });

    it('floatParam', function(done) {


        var ActionRequestParameter = EasyNode.using('easynode.framework.mvc.ActionRequestParameter');
        var actionRequestParameter = new ActionRequestParameter();

        try{
            //this.param(name,where) is a abstract method
            var ret = actionRequestParameter.floatParam('name');

        }catch(e){
            assert( e.message === 'Abstract Method','equal');
        }

        done();
    });


    it('booleanParam', function(done) {


        var ActionRequestParameter = EasyNode.using('easynode.framework.mvc.ActionRequestParameter');
        var actionRequestParameter = new ActionRequestParameter();

        try{
            //this.param(name,where) is a abstract method
            var ret = actionRequestParameter.booleanParam('name');

        }catch(e){
            assert( e.message === 'Abstract Method','equal');
        }

        done();
    });


    it('arrayParam', function(done) {


        var ActionRequestParameter = EasyNode.using('easynode.framework.mvc.ActionRequestParameter');
        var actionRequestParameter = new ActionRequestParameter();

        try{
            //this.param(name,where) is a abstract method
            var ret = actionRequestParameter.arrayParam('name');

        }catch(e){
            assert( e.message === 'Abstract Method','equal');
        }

        done();
    });

    it('dateParam', function(done) {


        var ActionRequestParameter = EasyNode.using('easynode.framework.mvc.ActionRequestParameter');
        var actionRequestParameter = new ActionRequestParameter();

        try{
            //this.param(name,where) is a abstract method
            var ret = actionRequestParameter.dateParam('name');

        }catch(e){
            assert( e.message === 'Abstract Method','equal');
        }

        done();
    });

    it('datetimeParam', function(done) {


        var ActionRequestParameter = EasyNode.using('easynode.framework.mvc.ActionRequestParameter');
        var actionRequestParameter = new ActionRequestParameter();

        try{
            //this.param(name,where) is a abstract method
            var ret = actionRequestParameter.datetimeParam('name');

        }catch(e){
            assert( e.message === 'Abstract Method','equal');
        }

        done();
    });

    it('datetimeMParam', function(done) {


        var ActionRequestParameter = EasyNode.using('easynode.framework.mvc.ActionRequestParameter');
        var actionRequestParameter = new ActionRequestParameter();

        try{
            //this.param(name,where) is a abstract method
            var ret = actionRequestParameter.datetimeMParam('name');

        }catch(e){
            assert( e.message === 'Abstract Method','equal');
        }

        done();
    });

    it('fileParam', function(done) {


        var ActionRequestParameter = EasyNode.using('easynode.framework.mvc.ActionRequestParameter');
        var actionRequestParameter = new ActionRequestParameter();

        try{
            //this.param(name,where) is a abstract method
            var ret = actionRequestParameter.fileParam('name');

        }catch(e){
            assert( e.message === 'Abstract Method','equal');
        }

        done();
    });

    after(function(done) {
        done();
    });

});

