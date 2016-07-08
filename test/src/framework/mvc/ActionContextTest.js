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


describe('ActionContextTest', function() {

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

    it('setAction', function(done) {


        var ActionContext = EasyNode.using('easynode.framework.mvc.ActionContext');
        var actionContext = new ActionContext();

        try{
            actionContext.setAction({action:'action'});
            var ac = actionContext.getAction();
            assert( _.isEqual(ac,{action:'action'}), 'equal');
        }catch(e){
            assert( e.message === 'Abstract Method','equal');
        }

        done();
    });

    it('param', function(done) {


        var ActionContext = EasyNode.using('easynode.framework.mvc.ActionContext');
        var actionContext = new ActionContext();

        try{
            actionContext.param('name');
        }catch(e){
            assert( e.message === 'Abstract Method','equal');
        }

        done();
    });

    it('setParam', function(done) {


        var ActionContext = EasyNode.using('easynode.framework.mvc.ActionContext');
        var actionContext = new ActionContext();

        try{
            actionContext.setParam('name','value');
        }catch(e){
            assert( e.message === 'Abstract Method','equal');
        }

        done();
    });

    it('setCache', function(done) {


        var ActionContext = EasyNode.using('easynode.framework.mvc.ActionContext');
        var actionContext = new ActionContext();

        try{
            actionContext.setCache({cache:'cache'});
            var ac = actionContext.getCache();
            assert( _.isEqual(ac,{cache:'cache'}), 'equal');
        }catch(e){
            assert( e.message === 'Abstract Method','equal');
        }

        done();
    });

    it('setRemoteAddress', function(done) {


        var ActionContext = EasyNode.using('easynode.framework.mvc.ActionContext');
        var actionContext = new ActionContext();

        try{
            actionContext.setRemoteAddress('127.0.0.1');
            var ac = actionContext.getRemoteAddress();
            assert( _.isEqual(ac,'127.0.0.1'), 'equal');
        }catch(e){
            assert( e.message === 'Abstract Method1','equal');
        }

        done();
    });


    it('setConnection', function(done) {


        var ActionContext = EasyNode.using('easynode.framework.mvc.ActionContext');
        var actionContext = new ActionContext();

        try{
            actionContext.setConnection({connection:'connection'});
            var ac = actionContext.getConnection();
            assert( _.isEqual(ac,{connection:'connection'}), 'equal');
        }catch(e){
            assert( e.message === 'Abstract Method','equal');
        }

        done();
    });

    it('setQueue', function(done) {


        var ActionContext = EasyNode.using('easynode.framework.mvc.ActionContext');
        var actionContext = new ActionContext();

        try{
            actionContext.setQueue({queue:'queue'});
            var ac = actionContext.getQueue();
            assert( _.isEqual(ac,{queue:'queue'}), 'equal');
        }catch(e){
            assert( e.message === 'Abstract Method','equal');
        }

        done();
    });


    after(function(done) {
        done();
    });

});

