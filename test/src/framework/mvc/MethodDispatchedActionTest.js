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


describe('MethodDispatchedActionTest', function() {

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

    it('constructor', function(done) {


        var MethodDispatchedAction = EasyNode.using('easynode.framework.mvc.MethodDispatchedAction');
        var methodDispatchedAction = new MethodDispatchedAction('m');

        try{
            var moduleName = methodDispatchedAction.moduleName();
            assert( moduleName === 'm', 'equal');

            methodDispatchedAction.moduleName('module');

            moduleName = methodDispatchedAction.moduleName();
            assert( moduleName === 'module', 'equal');
        }catch(e){
            assert( e.message === 'Abstract Method','equal');
        }

        done();

    });

    it('dispatch', function(done) {


        var ActionFactory = using('easynode.framework.mvc.ActionFactory');
        var MethodDispatchedAction = EasyNode.using('easynode.framework.mvc.MethodDispatchedAction');

        class Action3 extends MethodDispatchedAction {
            constructor () {
                super();
                this.dispatch(this.action_action3);
                //here "action_" is the default prefix of dispatch action,
                // "action3" is the real action name
            }

            action_action3() {
                return {
                    defineArgs: function () {
                        this
                            .addArg('p1 int')
                            .addArg('p2 string')
                            .noop();
                    },
                    process: function (ctx, p1, p2) {
                        return function * () {
                            return ActionResult.createSuccessResult({
                                from : 'action3',
                                p1 : p1,
                                p1Type : typeof p1,
                                p2 : p2,
                                p2Type : typeof p2
                            });
                        };
                    }
                };
            }
        }
        ActionFactory.registerMethodDispatchedAction(Action3, 'mvc-test');

        done();

    });

    after(function(done) {
        done();
    });

});

