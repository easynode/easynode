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


describe('RedisQueueSubscribeTest', function() {

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

    it('subscribe', function(done) {

        var RedisQueue = EasyNode.using('easynode.framework.mq.RedisQueue');
        var redisQueue = new RedisQueue();
        redisQueue.initialize('218.205.113.98',6380,{password:'1122334455'});

        co(function* (){

            var sub = yield redisQueue.subscribe( 'defaultQueue', {},{
                onMessage:function(queueName,msg){
                    console.log(queueName);
                    assert( queueName === 'defaultQueue', 'equal' );
                    assert( _.isEqual(msg,{a:'a'}), 'equal');

                    //done();
                },
                onError: function(err){
                    if( err ){
                        console.log(err);
                    }
                    done();
                }
            });

        });
    });

    after(function(done) {
        done();
    });

});

