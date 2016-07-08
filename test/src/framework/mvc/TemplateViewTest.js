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


describe('TemplateViewTest', function() {

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

    it('getEngine', function(done) {


        var TemplateView = EasyNode.using('easynode.framework.mvc.TemplateView');
        var view = new TemplateView();

        try{
            var engine = view.getEngine('a.swig');
            assert(engine === 'swig','equal');
            engine = view.getEngine('a.ejs');
            assert(engine === 'ejs','equal');
            engine = view.getEngine('a.mst');
            assert(engine === 'mustache','equal');
            engine = view.getEngine('a.jade');
            assert(engine === 'jade','equal');
            done();
        }catch(e){
            console.log(e);
            done(e);
        }
    });

    it('getEngine', function(done) {


        var TemplateView = EasyNode.using('easynode.framework.mvc.TemplateView');
        var view = new TemplateView();

        try{
            var contentType = view.getContentType();
            assert(contentType === 'html','equal');
            done();
         }catch(e){
            console.log(e);
            done(e);
        }

    });

    it('render.swig', function(done) {

        var TemplateView = EasyNode.using('easynode.framework.mvc.TemplateView');
        var view = new TemplateView();

        var ActionResult = EasyNode.using('easynode.framework.mvc.ActionResult');
        var actionResult = ActionResult.createSuccessResult({pagename : 'my blog',authors:['hujb','zlbbq']});

        try{
            var render = view.render(actionResult,{tplFile:'demo.swig',engine:'swig'});
            console.log(render);
            done();
        }catch(e){
            console.log(e);
            done(e);
        }

    });

    it('render.mustache', function(done) {

        var TemplateView = EasyNode.using('easynode.framework.mvc.TemplateView');
        var view = new TemplateView();

        var ActionResult = EasyNode.using('easynode.framework.mvc.ActionResult');
        var actionResult = ActionResult.createSuccessResult({name : 'hujb'});

        try{
            var render = view.render(actionResult,{tplFile:'demo.mst',engine:'mustache'});
            console.log(render);
            done();
        }catch(e){
            console.log(e);
            done(e);
        }

    });

    it('render.ejs', function(done) {

        var TemplateView = EasyNode.using('easynode.framework.mvc.TemplateView');
        var view = new TemplateView();

        var ActionResult = EasyNode.using('easynode.framework.mvc.ActionResult');
        var actionResult = ActionResult.createSuccessResult({user:{name:'hujb'}});

        try{
            var render = view.render(actionResult,{tplFile:'demo.ejs',engine:'ejs'});
            console.log(render);
            done();
        }catch(e){
            console.log(e);
            done(e);
        }

    });

    it('render.jade', function(done) {

        var TemplateView = EasyNode.using('easynode.framework.mvc.TemplateView');
        var view = new TemplateView();

        var ActionResult = EasyNode.using('easynode.framework.mvc.ActionResult');
        var actionResult = ActionResult.createSuccessResult({pageTitle:'my title'});

        try{
            //ToDO
            var render = view.render(actionResult,{tplFile:'demo.jade',engine:'jade'});
            console.log(render);
            done();
        }catch(e){
            console.log(e);
            done(e);
        }

    });


    after(function(done) {
        done();
    });

});

