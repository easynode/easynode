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


describe('ModelFieldTest', function() {

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


        var ModelField = EasyNode.using('easynode.framework.mvc.ModelField');
        var modelFiled = new ModelField('account','string',50,'',false,'帐号',false);

        assert( ModelField.TYPE_STRING === 'string', 'equal');
        assert( ModelField.TYPE_INT === 'int', 'equal');
        assert( ModelField.TYPE_FLOAT === 'float', 'equal');
        assert( ModelField.TYPE_DATE === 'date', 'equal');
        assert( ModelField.TYPE_DATETIME === 'datetime', 'equal');
        assert( ModelField.TYPE_JSON === 'json', 'equal');

        done();

    });

    after(function(done) {
        done();
    });

});

