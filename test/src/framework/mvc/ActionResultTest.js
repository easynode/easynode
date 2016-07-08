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


describe('ActionResultTest', function() {

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

    it('construct', function(done) {


        var ActionResult = EasyNode.using('easynode.framework.mvc.ActionResult');
        var actionResult = new ActionResult( 1, {a:'a'}, 'test');
        assert( actionResult.code === 1, 'equal');
        assert( _.isEqual(actionResult.result,{a:'a'}), 'equal');
        assert( actionResult.msg === 'test', 'equal');

        done();
    });


    it('code2Message', function(done) {

        var ActionResult = EasyNode.using('easynode.framework.mvc.ActionResult');
        try{
            var msg = ActionResult.code2Message(-1);
            assert( msg === '接口调用失败', 'equal');
        }catch(e){
            console.log(e)
        }

        done();
    });

    it('create', function(done) {

        var ActionResult = EasyNode.using('easynode.framework.mvc.ActionResult');
        try{
            var ar = ActionResult.create({a:'a'});
            assert( ar.code === ActionResult.CODE_SUCC, 'equal');
            assert( _.isEqual(ar.result,{a:'a'}),'equal');
            assert( ar.msg === '接口调用成功', 'equal');
        }catch(e){
            console.log(e)
        }

        done();
    });

    it('createSuccessResult', function(done) {

        var ActionResult = EasyNode.using('easynode.framework.mvc.ActionResult');
        try{
            var ar = ActionResult.createSuccessResult({a:'a'});
            assert( ar.code === ActionResult.CODE_SUCC, 'equal');
            assert( _.isEqual(ar.result,{a:'a'}),'equal');
            assert( ar.msg === '接口调用成功', 'equal');
        }catch(e){
            console.log(e)
        }

        done();
    });

    it('createSuccessResult', function(done) {

        var ActionResult = EasyNode.using('easynode.framework.mvc.ActionResult');
        try{
            var ar = ActionResult.createErrorResult('failed');
            assert( ar.code === ActionResult.CODE_ERROR, 'equal');
            assert( _.isEqual(ar.result,{}),'equal');
            assert( ar.msg === 'failed', 'equal');
        }catch(e){
            console.log(e)
        }

        done();
    });

    it('createNoReturnResult', function(done) {

        var ActionResult = EasyNode.using('easynode.framework.mvc.ActionResult');
        try{
            var ar = ActionResult.createNoReturnResult();
            assert( ar.code === ActionResult.CODE_ACTION_RETURN_NOTHING, 'equal');
            assert( _.isEqual(ar.result,{}),'equal');
            assert( ar.msg === 'Action没有返回值', 'equal');
        }catch(e){
            console.log(e)
        }

        done();
    });

    it('createActionNotFoundResult', function(done) {

        var ActionResult = EasyNode.using('easynode.framework.mvc.ActionResult');
        try{
            var ar = ActionResult.createActionNotFoundResult();
            assert( ar.code === ActionResult.CODE_ACTION_NOT_FOUND, 'equal');
            assert( _.isEqual(ar.result,{}),'equal');
            assert( ar.msg === '接口未找到', 'equal');
        }catch(e){
            console.log(e)
        }

        done();
    });

    it('createValidateFailResult', function(done) {

        var ActionResult = EasyNode.using('easynode.framework.mvc.ActionResult');
        try{
            var ar = ActionResult.createValidateFailResult();
            assert( ar.code === ActionResult.CODE_ACTION_VALIDATE_FAIL, 'equal');
            assert( _.isEqual(ar.result,{}),'equal');
            assert( ar.msg === 'Action调用失败，校验失败', 'equal');
        }catch(e){
            console.log(e)
        }

        done();
    });

    it('createAuthorizeFailResult', function(done) {

        var ActionResult = EasyNode.using('easynode.framework.mvc.ActionResult');
        try{
            var ar = ActionResult.createAuthorizeFailResult();
            assert( ar.code === ActionResult.CODE_ACTION_AUTHORIZE_FAIL, 'equal');
            assert( _.isEqual(ar.result,{}),'equal');
            assert( ar.msg === 'Action调用失败，没有权限', 'equal');
        }catch(e){
            console.log(e)
        }

        done();
    });

    it('createNoImplementationError', function(done) {

        var ActionResult = EasyNode.using('easynode.framework.mvc.ActionResult');
        try{
            var ar = ActionResult.createNoImplementationError();
            assert( ar.code === ActionResult.CODE_NO_IMPLEMENTATION, 'equal');
            assert( _.isEqual(ar.result,{}),'equal');
            assert( ar.msg === 'Action已定义，但process方法未重载', 'equal');
        }catch(e){
            console.log(e)
        }

        done();
    });

    it('createNoSessionError', function(done) {

        var ActionResult = EasyNode.using('easynode.framework.mvc.ActionResult');
        try{
            var ar = ActionResult.createNoSessionError();
            assert( ar.code === ActionResult.CODE_NO_SESSION, 'equal');
            assert( _.isEqual(ar.result,{}),'equal');
            assert( ar.msg === '请登录', 'equal');
        }catch(e){
            console.log(e)
        }

        done();
    });

    it('createSimulateResult', function(done) {

        var ActionResult = EasyNode.using('easynode.framework.mvc.ActionResult');
        try{
            var ar = ActionResult.createSimulateResult();
            assert( ar.code === ActionResult.CODE_SIMULATE, 'equal');
            assert( _.isEqual(ar.result,{}),'equal');
            assert( ar.msg === '接口调用成功', 'equal');
        }catch(e){
            console.log(e)
        }

        done();
    });


    it('setResult', function(done) {

        var ActionResult = EasyNode.using('easynode.framework.mvc.ActionResult');
        var actionResult = new ActionResult( 1, {a:'a'}, 'test');
        try{

            var ar = actionResult.setResult({},'msg').setResult({b:'b'},'message');
            assert( ar.code === 1, 'equal');
            assert( _.isEqual(ar.result,{b:'b'}), 'equal');
            assert( ar.msg === 'message', 'equal');
        }catch(e){
            console.log(e)
        }

        done();
    });


    it('setMessage', function(done) {

        var ActionResult = EasyNode.using('easynode.framework.mvc.ActionResult');
        var actionResult = new ActionResult( 1, {a:'a'}, 'test');
        try{

            var ar = actionResult.setMsg('message');
            assert( ar.code === 1, 'equal');
            assert( _.isEqual(ar.result,{a:'a'}), 'equal');
            assert( ar.msg === 'message', 'equal');
        }catch(e){
            console.log(e)
        }

        done();
    });


    it('error', function(done) {

        var ActionResult = EasyNode.using('easynode.framework.mvc.ActionResult');
        var actionResult = new ActionResult( 1, {a:'a'}, 'test');
        try{

            var ar = actionResult.error();
            assert( ar.code === -1, 'equal');
            assert( _.isEqual(ar.result,{}), 'equal');
            assert( ar.msg === '接口调用失败', 'equal');
        }catch(e){
            console.log(e)
        }

        done();
    });

    it('response', function(done) {

        var ActionResult = EasyNode.using('easynode.framework.mvc.ActionResult');
        var actionResult = new ActionResult( 1, {a:'a'}, 'test');
        try{

            var ar = actionResult.response();
            assert( ar.code === -1, 'equal');
            assert( _.isEqual(ar.result,{}), 'equal');
            assert( ar.msg === '接口调用失败', 'equal');
        }catch(e){
            console.log(e)
        }

        done();
    });

    it('isSuccess', function(done) {

        var ActionResult = EasyNode.using('easynode.framework.mvc.ActionResult');
        var actionResult = new ActionResult( 1, {a:'a'}, 'test');
        try{

            var ar = actionResult.isSuccess();
            assert( ar === false, 'equal');

            ar = actionResult.response(0,'ok',{a:'a'});
            assert( actionResult.isSuccess() === true, 'equal');
            assert( actionResult.msg === 'ok', 'equal');
            assert( _.isEqual( actionResult.result,{a:'a'} ), 'equal');
        }catch(e){
            console.log(e)
        }

        done();
    });

    after(function(done) {
        done();
    });

});

