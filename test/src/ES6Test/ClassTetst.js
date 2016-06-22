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


describe('ClassTest',function() {

    before(function(done){
        try{
            done();
        }catch(e){
            done(e);
        }
    });

    it('extends',function (done){
        class A extends Object {
        }
        assert( A.__proto__ === Object, "");
        assert( A.prototype.__proto__ === Object.prototype, "");

        class B {
        }
        assert( B.__proto__ === Function.prototype, "");
        assert( B.prototype.__proto__ === Object.prototype, "");


        class C extends null{
        }
        assert( C.__proto__ === Function.prototype, "");
        assert( C.prototype.__proto__ === undefined, "");

        done();
    });

    it('extends.native',function (done){
        class NewObj extends Object{
            constructor(){
                super(...arguments);
            }
        }
        var o = new NewObj({attr: true});
        assert( o.attr === true, 'v6.2.0 extends object no exception');//true
        done();
    });


    it('getter setter',function (done){

        class CustomHTMLElement {
            constructor(element) {
                this.element = element;
            }

            get html() {
                return this.element.innerHTML;
            }

            set html(value) {
                this.element.innerHTML = value;
            }
        }
        var descriptor = Object.getOwnPropertyDescriptor( CustomHTMLElement.prototype, "html" );

        assert( "get" in descriptor ,'getter in descriptor');  // true
        assert( "set" in descriptor ,'setter in descriptor');  // true

        done();
    });

    it('Generator of class',function (done){

        class Foo {
            constructor(...args) {
                this.args = args;
            }
            * [Symbol.iterator]() {
                for (let arg of this.args) {
                    yield arg;
                }
            }
        }

        for (let x of new Foo('hello', 'world')) {
            console.log(x);
        }

        done();
    });

    it('static attribute of class',function (done){
        class Foo {
        }

        Foo.prop = 1;
        assert( Foo.prop == 1, 'static attribute of class, only simulated by prototype' );

        done();
    });

    it('new.target',function (done){

        function Person(name) {
            if (new.target !== undefined) {
                this.name = name;
            } else {
                throw new Error('必须使用new生成实例');
            }
        }

        // 另一种写法
        function Person(name) {
            if (new.target === Person) {
                this.name = name;
            } else {
                throw new Error('必须使用new生成实例');
            }
        }

        var person = new Person('张三'); // 正确
        try{
            var notAPerson = Person.call(person, '张三');  // 报错
        } catch(e){
            console.log("new.target can  distinguish the instance if created by constructor");
        } finally{

        }

        class Rectangle {
            constructor(length, width) {
                assert( new.target !== Rectangle, 'new.tartget will return subclass');
                if( new.target === Rectangle ){
                    throw new Error('Rectangle class can not be instanced');
                }
                // ...
            }
        }

        class Square extends Rectangle {
            constructor(length) {
                super(length, length);
            }
        }

        var obj = new Square(3);

        done();
    });

    after(function(done){
        done();
    });

});

