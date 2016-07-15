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

describe('BinaryTest', function() {

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

    it('wordBE2LE', function(done) {

        var Binary = EasyNode.using('easynode.framework.util.Binary');

        var word = 0xAAFF;
        assert( 65280 === Binary.wordBE2LE(word), 'equal' );

        done();

    });

    it('wordLE2BE', function(done) {

        var Binary = EasyNode.using('easynode.framework.util.Binary');

        var word = 0xAAFF;
        assert( 65280 === Binary.wordLE2BE(word), 'equal' );

        done();

    });

    it('dwordBE2LE', function(done) {

        var Binary = EasyNode.using('easynode.framework.util.Binary');

        var word = 0xAAFFAAFF;
        assert( -16777216 === Binary.dwordBE2LE(word), 'equal' );

        done();

    });

    it('dwordLE2BE', function(done) {

        var Binary = EasyNode.using('easynode.framework.util.Binary');

        var word = 0xAAFFAAFF;
        assert( -16777216 === Binary.dwordLE2BE(word), 'equal' );

        done();

    });

    it('bits', function(done) {

        var Binary = EasyNode.using('easynode.framework.util.Binary');

        var word = 0x67;// * 0x67 = 01100111;
        assert( 103 === Binary.bits(word,1,8), 'equal')
        assert( 1 === Binary.bits(word,3,5), 'equal' );
        assert( 9 === Binary.bits(word,3,6), 'equal' );
        assert( 12 === Binary.bits(word,4,8), 'equal' );

        done();

    });

    it('bitSet', function(done) {

        var Binary = EasyNode.using('easynode.framework.util.Binary');

        var word = 0x67;// * 0x67 = 01100111;
        assert( 103 === Binary.bitSet(word,1,1), 'equal');
        assert( 103 === Binary.bitSet(word,2,1), 'equal');
        assert( 111 === Binary.bitSet(word,3,1), 'equal');
        assert( 119 === Binary.bitSet(word,4,1), 'equal');
        assert( 103 === Binary.bitSet(word,5,1), 'equal');
        assert( 103 === Binary.bitSet(word,6,1), 'equal');
        assert( 231 === Binary.bitSet(word,7,1), 'equal');
        assert( 359 === Binary.bitSet(word,8,1), 'equal');

        done();
    });

    it('bitSets', function(done) {

        var Binary = EasyNode.using('easynode.framework.util.Binary');

        var word = 0x67;// * 0x67 = 01100111;
        assert( 103 === Binary.bitSets(word,1,3,7), 'equal');
        //ToDO
        assert( 103 === Binary.bitSets(word,1,4,0), 'equal');

        done();
    });

    it('writeBuffer2Array', function(done) {

        var Binary = EasyNode.using('easynode.framework.util.Binary');

        var buffer = new Buffer('abcdefghijklmnopqrstuvwxyz');
        var array = [];

        Binary.writeBuffer2Array(buffer,10,array);
        assert( '97,98,99,100,101,102,103,104,105,106' === array.toString() , 'equal');
        assert( 97 === array[0] , 'equal');

        done();
    });

    it('date2Bytes', function(done) {

        var Binary = EasyNode.using('easynode.framework.util.Binary');

        var ret = Binary.date2Bytes();
        assert( ret.length === 3, '[year,month,day]');

        done();
    });

    it('datetime2Bytes', function(done) {

        var Binary = EasyNode.using('easynode.framework.util.Binary');

        var ret = Binary.datetime2Bytes();
        assert( ret.length === 6, '[year,month,day,hour,minute,second]');

        done();
    });

    after(function(done) {
        done();
    });

});

