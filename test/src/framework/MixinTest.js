/*
 Function:Mixin Interface Test
 Created by hujiabao on 6/22/16.
 * */
'use strict';

require('../../src/EasyNode.js');
require("babel-polyfill");
import co from 'co';
import request from 'superagent';
import chai from 'chai';
const assert = chai.assert;
var fs = require('fs');
var http = require('http');
import req from 'request';
var _ = require('underscore');


describe('MixinTest', function () {

    var root = '';
    var mochaTest = true;
    before(function (done) {
        try {
            root = EasyNode.addArg('easynode-home', process.cwd());
            mochaTest = EasyNode.addArg('mocha-test', true);
            done();
        } catch (e) {
            done(e);
        }
    });

    it('EasyNode.arg', function (done) {
        assert(EasyNode.arg('mocha-test') == mochaTest, 'mocha is not the test program');
        done();
    });

    it('EasyNode.setEnv',function (done){
        EasyNode.setEnv('TEST')
        assert(EasyNode.src == 'lib', 'test etc stage, not use lib');
        EasyNode.setEnv('DEVELOP')
        assert(EasyNode.src == 'src', 'develop stage, not use src');
        done();
    });

    it('Mix', function (done) {
        class A {
            getA(){
                return 'A';
            }
        };

        class B {
            getB(){
                return 'B';
            }
        };

        var Mixin = EasyNode.using('easynode.framework.Mixin');
        class C extends Mixin.mix(A,B){
            getC(){
                return this.getA()+this.getB();
            }
        };

        var c = new C();
        assert( c.getC() == 'AB', "Mixin test failed");

        done();
    });

    after(function (done) {
        done();
    });

});

