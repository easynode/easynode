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

require('babel-polyfill');
import co from 'co';
import request from 'superagent';
import chai from 'chai';
const assert = chai.assert;
var fs = require('fs');
var http = require('http');
import req from 'request';
var _ = require('underscore');


describe('GeneratorFunctionTest', function() {

  before(function(done) {
    try {
      done();
    } catch (e) {
      done(e);
    }
  });


  it('GeneratorFunctionTest', function(done) {

    function *helloWorldGeneratorFunction() {
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
    assert(_.isEqual(helloWorldGenerator.next(), {value:'hello', done:false}), 'return value not equal hello');
    assert(_.isEqual(helloWorldGenerator.next(), {value:'world', done:false}), 'return value not equal world');
    assert(_.isEqual(helloWorldGenerator.next(), {value:'!', done:true}), 'return value not equal !');
    assert(_.isEqual(helloWorldGenerator.next(), {value: undefined, done:true}), 'ended');
    assert(_.isEqual(helloWorldGenerator.next(), {value: undefined, done:true}), 'ended');

    done();
  });

  it('GeneratorFunctionTest2', function(done) {

    function *helloWorldGeneratorFunction() {
      var hello = yield 'hello';
      assert(hello === undefined, 'yield \'hello\' only return {value:\'hello\',done:false}, yet yield return undefined');

      var world = yield 'world';
      assert(world === undefined, 'yield \'hello\' only return {value:\'hello\',done:false}, yet yield return undefined');

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
    assert(_.isEqual(helloWorldGenerator.next(), {value:'hello', done:false}), 'return value not equal hello');
    assert(_.isEqual(helloWorldGenerator.next(), {value:'world', done:false}), 'return value not equal world');
    assert(_.isEqual(helloWorldGenerator.next(), {value:'!', done:true}), 'return value not equal !');
    assert(_.isEqual(helloWorldGenerator.next(), {value: undefined, done:true}), 'ended');
    assert(_.isEqual(helloWorldGenerator.next(), {value: undefined, done:true}), 'ended');

    done();
  });

  it('GeneratorFunctionTest3', function(done) {

    function *helloWorldGeneratorFunction() {
      var hello = yield 'hello';
            /*
            * 往函数next方法传入参数,那么该参数就成为上一个yield语句的返回值,第一次调用next方法时传入的参数将被忽略*/
      assert(hello === 2, 'yield \'hello\' only return {value:\'hello\',done:false}, yet yield return undefined');

      var world = yield 'world';
      assert(world === 3, 'yield \'world\' only return {value:\'world\',done:false}, yet yield return undefined');

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
    assert(_.isEqual(helloWorldGenerator.next(1), {value:'hello', done:false}), 'return value not equal hello');
    assert(_.isEqual(helloWorldGenerator.next(2), {value:'world', done:false}), 'return value not equal world');
    assert(_.isEqual(helloWorldGenerator.next(3), {value:'!', done:true}), 'return value not equal !');
    assert(_.isEqual(helloWorldGenerator.next(4), {value: undefined, done:true}), 'ended');
    assert(_.isEqual(helloWorldGenerator.next(5), {value: undefined, done:true}), 'ended');

    done();
  });

  it('yield(array and string)', function(done) {

    function *GenFunc() {
      yield [1, 2];
      yield* [3, 4];
      yield '56';
      yield* '78';
    }

    var gen = GenFunc();
    assert(_.isEqual(gen.next().value, [1, 2]), 'equal');
    assert(_.isEqual(gen.next().value, 3), 'equal');
    assert(_.isEqual(gen.next().value, 4), 'equal');
    assert(_.isEqual(gen.next().value, '56'), 'equal');
    assert(_.isEqual(gen.next().value, '7'), 'equal');
    assert(_.isEqual(gen.next().value, '8'), 'equal');

    done();
  });

  it('yield(arguments)', function(done) {

    function *GenFunc() {
      yield arguments;
      yield* arguments;
    }

    var gen = GenFunc('a', 'b');
        // why?
    console.log(gen.next().value);
        // assert( _.isEqual( gen.next().value, { '0': 'a', '1': 'b' } ), 'equal' );
    assert(_.isEqual(gen.next().value, 'a'), 'equal');
    assert(_.isEqual(gen.next().value, 'b'), 'equal');

    done();
  });

  it('yield(arguments)2', function(done) {

    function *GenFunc() {
      yield arguments;
      yield* arguments;
    }

    var gen = GenFunc(1, 2);
        // why?
    console.log(gen.next().value);
        // assert( _.isEqual( gen.next().value, { '0': 1, '1': 2 } ), 'equal' );
    assert(_.isEqual(gen.next().value, 1), 'equal');
    assert(_.isEqual(gen.next().value, 2), 'equal');

    done();
  });

  it('yield(genertor)', function(done) {

    function *Gen1() {
      yield 2;
      yield 3;
    }

    function *Gen2() {
      yield 1;
      yield* Gen1();
      yield 4;
    }

    var g2 = Gen2();
    assert(g2.next().value === 1, 'equal');
    assert(g2.next().value === 2, 'equal');
    assert(g2.next().value === 3, 'equal');
    assert(g2.next().value === 4, 'equal');
    assert(g2.next().value === undefined, 'equal');

    done();
  });

  it('yield(Object)', function(done) {

    function *GenFunc() {
      yield {a:'1', b:'2'};
            /*
            yield与yield* 的区别在于:yield只返回右值,而yield则函数委托(delegate)到另一个生成器(Generator)或可迭代的对象
            (如字符串\数组\类数组arguments\,以及ES6中的Map\Set等)
            * */
      yield* {'0':'1', '1':'2'};
    }

    var gen = GenFunc();

    assert(_.isEqual(gen.next().value, {a:'1', b:'2'}), 'equal');
    assert(_.isEqual(gen.next(), {value: undefined, done:true}), 'equal');
        // console.log(gen.next());
        // console.log(gen.next());

    done();
  });

  it('co', function(done) {
    var fs = require('fs');
    var co = require('co');

    function readFile(path) {

            /*
             返回一个thunk函数(即有且只有一个参数是callback的函数,且callback的函数第一个参数为error),这样我们可以用同步的方式书写异步的代码了.
             */
      return function(cb) {
        fs.readFile(path, {encoding:'utf8'}, cb);
      };
    }

        /*
           1.Co将所有yield后面的表达式都封装成了Promise对象
           2. 只有当前表达式执行结束后(即调用.then)才会在回调函数内执行gen.next(res),将res赋值给yield左侧的变量并执行到下一个yield,下一个表达
             式执行结束后又调用gen.next()
           3.ES6中的yield后面可以跟任意类型的值,但co对此做了限制,只允许yield后跟thunk,promise,generator,generatorFunction,array或者object
        * */
    co(function *() {
      var dataA = yield readFile('test/src/es6test/ClassTest.js');
      assert(dataA.length > 0, 'readFile ok');
      var dataB = yield readFile('test/src/es6test/GeneratorFunctionTest.js');
      assert(dataB.length > 0, 'readFile ok');
    }).catch((err) => {
      console.log(err);
    });

    done();
  });

  it('co(context)', function(done) {

    function Person(name) {
      this.name = name;
    }

    Person.prototype.getName = function(callback) {
      var self = this;
      setImmediate(function() {
        callback(null, self.name);
      });
    };

    var person = new Person('nswbmw');
    person.getName(function(err, name) {
      assert(name === 'nswbmw', 'equal');
    });

    co(function *() {
      var name = yield person.getName;
            // getName中的this已经不再指向person,而指向了co的上下文
      assert(name === undefined, 'not equal');
    }).catch((err) => {
      console.log(err);
    });

    done();
  });

  it('co(context)1', function(done) {

    function Person(name) {
      this.name = name;
    }

    Person.prototype.getName = function(callback) {
      var self = this;
      setImmediate(function() {
        callback(null, self.name);
      });
    };

    var person = new Person('nswbmw');
    person.getName(function(err, name) {
      assert(name === 'nswbmw', 'equal');
    });

    co(function *() {
      var name = yield person.getName.bind(person);
            // getName中的this已经不再指向person,而指向了co的上下文,通过bind函数修改getName中的this对象
      assert(name === 'nswbmw', 'not equal');
    }).catch((err) => {
      console.log(err);
    });

    done();
  });


  it('co(context)2', function(done) {

    function Person(name) {
      this.name = name;
    }

    Person.prototype.getName = function *() {
      return this.name;
    };

    var person = new Person('nswbmw');

    co(function *() {
      var name = yield person.getName();
      assert(name === 'nswbmw', 'not equal');
    }).catch((err) => {
      console.log(err);
    });

    done();
  });

  it('koa(paperclip)', function(done) {

    var koa = require('koa');
    var app = koa();

    app.use(function *(next) {
      var start = new Date();
      console.log(1);
      yield next;
      var ms = new Date - start;
      console.log(3);
      this.set('X-Response-Time', ms + 'ms');
      console.log(4);
    });

    app.use(function *() {
      this.body = 'Hello World!';
      console.log(2);
    });

    app.listen(3000);

    done();
  });


  after(function(done) {
    done();
  });

});

