'use strict';

//var m = function * (){
//    console.log("m");
//}
//
//var f = function * (){
//    console.log('f');
//}
//
//var g = function * (){
//    console.log('g');
//    yield * f();
//    yield * f();
//    yield  m();
//
//}
//
//var ret = g();
//
//console.dir(ret.next());
//
//
//function* helloWorldGenerator() {
//    yield  'hello';
//    yield 'world';
//    return 'ending';
//}
//
//var hw = helloWorldGenerator();
//
//console.log(hw.next());
//
//var myInterable = {};
//
//myInterable[Symbol.iterator] = function *(){
//    yield 1;
//    yield 2;
//    yield 3;
//}
//
//console.log([...myInterable]);



//var arr = ["a", "b", "c", "d"];
//
//for (var a in arr) {
//    console.log(a); // 0 1 2 3
//}
//
//for (var a of arr) {
//    console.log(a); // a b c d
//}

//
//let map = new Map().set('a', 1).set('b', 2);
//for (let pair of map) {
//    console.log(pair);
//}
//// ['a', 1]
//// ['b', 2]
//
//for (let [key, value] of map) {
//    console.log(key + ' : ' + value);
//}
//// a : 1
//// b : 2
//
//let arr = ['a', 'b', 'c'];
//for (let pair of arr.values()) {
//    console.log(pair);
//}
//
//// arguments对象
//function printArgs() {
//    for (let x in arguments) {
//        console.log(arguments[x]);
//    }
//}
//printArgs('a', 'b');

//let arrayLike = { length: 2, 0: 'a', 1: 'b' };
//
//// 报错
////for (let x of arrayLike) {
////    console.log(x);
////}
//
//// 正确
//for (let x of Array.from(arrayLike)) {
//    console.log(x);
//}


//var es6 = {
//    edition: 6,
//    committee: "TC39",
//    standard: "ECMA-262"
//};
//es6.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator];
//
//for (e in es6) {
//    console.log(e);
//}
//// edition
//// committee
//// standard
//
//for (e of es6) {
//    console.log(e);
//}

//var obj = {a:1,b:2,c:3};
//
//function* entries(obj) {
//    for (let key of Object.keys(obj)) {
//        yield [key, obj[key]];
//    }
//}
//
//for (let [key, value] of entries(obj)) {
//    console.log(key, "->", value);
//}
//
//;


