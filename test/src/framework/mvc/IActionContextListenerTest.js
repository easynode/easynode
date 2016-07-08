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


describe('IActionContextListenerTest', function() {

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

    it('onCreate', function(done) {

        var IActionContextListener = EasyNode.using('easynode.framework.mvc.IActionContextListener');
        var iactionContextListener = new IActionContextListener();
        try{
            iactionContextListener.onCreate(null);
        }catch(e){
            assert( e.message === 'Abstract Method', 'equal' );
        }

        done();
    });

    it('onActionReady', function(done) {

        var IActionContextListener = EasyNode.using('easynode.framework.mvc.IActionContextListener');
        var iactionContextListener = new IActionContextListener();
        try{
            iactionContextListener.onActionReady(null);
        }catch(e){
            assert( e.message === 'Abstract Method', 'equal' );
        }

        done();
    });

    it('onDestroy', function(done) {

        var IActionContextListener = EasyNode.using('easynode.framework.mvc.IActionContextListener');
        var iactionContextListener = new IActionContextListener();
        try{
            iactionContextListener.onDestroy(null);
        }catch(e){
            assert( e.message === 'Abstract Method', 'equal' );
        }

        done();
    });

    it('onError', function(done) {

        var IActionContextListener = EasyNode.using('easynode.framework.mvc.IActionContextListener');
        var iactionContextListener = new IActionContextListener();
        try{
            iactionContextListener.onError(null);
        }catch(e){
            assert( e.message === 'Abstract Method', 'equal' );
        }

        done();
    });

    after(function(done) {
        done();
    });


});

