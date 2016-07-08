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


describe('ActionFilterTest', function() {

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

    it('filters', function(done) {


        var ActionFilter = EasyNode.using('easynode.framework.mvc.ActionFilter');
        //var af = new ActionFilter();

        try{
            var af = ActionFilter.filters();
            assert( af instanceof Array, 'equal');
            assert( af.length === 0, 'equal');
        }catch(e){
            assert( e.message === 'Abstract Method','equal');
        }

        done();
    });


    it('addFilter', function(done) {

        var ActionFilter = EasyNode.using('easynode.framework.mvc.ActionFilter');

        var actionFilter = new ActionFilter();

        try{
            var af = ActionFilter.addFilter(actionFilter).filters();
            assert( af instanceof Array, 'equal');
            assert( af.length === 1, 'equal');
        }catch(e){
            assert( e.message === 'Abstract Method','equal');
        }

        done();
    });

    it('filter', function(done) {

        var ActionFilter = EasyNode.using('easynode.framework.mvc.ActionFilter');

        var actionFilter = new ActionFilter();

        try{
            var af = ActionFilter.addFilter(actionFilter).filters();
            assert( af instanceof Array, 'equal');
            assert( af.length === 2, 'notice 2,equal');

            co(function*(){

            //ToDO
             yield af.filter('m','a',{},{},function(){});
            });

        }catch(e){
            console.log(e)
            assert( e.message === 'Abstract Method','equal');
        }

        done();
    });

    after(function(done) {
        done();
    });

});

