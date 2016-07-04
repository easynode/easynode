/*
 Function:
 This is OpenApi test for c.163.com
 author: allen.hu
 date: 2016-05-05 20:14
 [OpenApi](https://c.163.com/wiki/index.php?title=OpenAPI%E4%BB%8B%E7%BB%8D)
 APP key: daaf3fdb307f4a38844211325116b72c
 APP Secret: bc12d62d47344a31b3c21a8693e2498d
 * */
'use strict';

require("babel-polyfill");
import co from 'co';
import request from 'superagent';
import chai from 'chai';
const assert = chai.assert;
var fs = require('fs');
var http = require('http');
import req from 'request';
var  _ = require('underscore');


describe('GeneratorFunctionTest',function() {

    before(function(done){
        try{
            done();
        }catch(e){
            done(e);
        }
    });



    it('GeneratorFunctionTest',function (done){

        function* helloWorldGeneratorFunction(){
            yield 'hello';
            yield 'world';
            return '!';
        }

        /*
         * return a generator after executing a generator function
         * */
        var helloWorldGenerator = helloWorldGeneratorFunction();

        /*
         在生成器函数内可以使用yield,函数执行到每个yield时都会暂停执行并返回yield的右值,通过调用生成器的next方法返回一个包含value和done的对象
         ,value为当前返回的值,done表明函数是否执行结束, 每次调用next,函数都会从yield的下一个语句执行,等到整个函数执行完,next方法返回的value变为undefined, done变为true.
        * */
        assert( _.isEqual( helloWorldGenerator.next(), {value:'hello',done:false} ), "return value not equal hello");
        assert( _.isEqual( helloWorldGenerator.next(), {value:'world',done:false} ), "return value not equal world");
        assert( _.isEqual( helloWorldGenerator.next(), {value:'!',done:true} ), "return value not equal !");
        assert( _.isEqual( helloWorldGenerator.next(), {value: undefined,done:true} ), "ended");
        assert( _.isEqual( helloWorldGenerator.next(), {value: undefined,done:true} ), "ended");

        done();
    });

    it('GeneratorFunctionTest2',function (done){

        function* helloWorldGeneratorFunction(){
            var hello =  yield 'hello';
            assert( hello === undefined ,'yield \'hello\' only return {value:\'hello\',done:false}, yet yield return undefined');

            var world = yield 'world';
            assert( world === undefined,'yield \'hello\' only return {value:\'hello\',done:false}, yet yield return undefined' );

            return '!';
        }


        /*
         * return a generator after executing a generator function
         * */
        var helloWorldGenerator = helloWorldGeneratorFunction();

        /*
         在生成器函数内可以使用yield,函数执行到每个yield时都会暂停执行并返回yield的右值,通过调用生成器的next方法返回一个包含value和done的对象
         ,value为当前返回的值,done表明函数是否执行结束, 每次调用next,函数都会从yield的下一个语句执行,等到整个函数执行完,next方法返回的value变为undefined, done变为true.
         * */
        assert( _.isEqual( helloWorldGenerator.next(), {value:'hello',done:false} ), "return value not equal hello");
        assert( _.isEqual( helloWorldGenerator.next(), {value:'world',done:false} ), "return value not equal world");
        assert( _.isEqual( helloWorldGenerator.next(), {value:'!',done:true} ), "return value not equal !");
        assert( _.isEqual( helloWorldGenerator.next(), {value: undefined,done:true} ), "ended");
        assert( _.isEqual( helloWorldGenerator.next(), {value: undefined,done:true} ), "ended");

        done();
    });

    after(function(done){
        done();
    });

});

