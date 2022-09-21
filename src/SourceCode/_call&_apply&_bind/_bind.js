// *bind 的细节实现（具体看 MDN ）https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
/**
 * !1. bind 返回一个新的绑定函数
 * !2. 绑定函数可以传入参数。
 * !3. 绑定函数可以使用 new 构造，但是提供的 this 值会被忽略，前置参数依然被提供给模拟函数，所以如果要实现 bind 还需要去看一下 new。提供了一种方法，可以观察当前是否被 new 可以在函数内部使用 new.target。如果当前函数正在被 new 的话，那么 new.target 就会返回该函数(typeof 得出结果为 function)，如果不是的话就会返回 undefined 。但是有兼容问题具体的见 MDN
 * !4.
 * !5.
 * !6.
 * */
function _bind(thisArg, ...args) {
  // *this 就是调用 _bind 的函数
  const fn = this;
  return function temp() {
    let _this = thisArg;
    // *返回的是一个函数，并且可以再接收其参数 所以这里使用 arguments
    const arr = [...args, ...arguments];

    // !当返回的 temp 函数被 new 时 new.target 为一个匿名函数，这里应该可以直接返回 new fn(...arr) 因为 fn 就是调用 _bind 的函数，所以 new temp 时，就相当于 new fn.
    /**
     * 分析一下 new temp 函数的过程
     * *1 创建一个空对象 obj
     * *2 将 obj 的 __proto__ 指向 temp 函数的 prototype 也就是绑定原型链
     * *3 使用 obj 作为 temp 函数的上下文，并且指向 temp 对象，相当于将 temp 函数的 this 修改为 obj 后执行 temp 对象，返回 res
     * *4 如果 res 是对象，那么返回 res 如果不是对象，那么返回 obj
     * ! 在这里我们的 _bind 并不能像 bind 一样返回原函数的拷贝 所以 temp 的 prototype 肯定不是指向 Person 的。但是直接 new fn 的返回值，一定是一个对象，所以就会代替 new temp 的返回值，此时这个返回值就会指向 Person。
     * */
    if (new.target) {
      // !开始的做法是 _this = this; return fn.apply(_this, arr); 想法是 new temp 时会创建一个空对象，会把 temp 挂载到这个对象上执行，所以此时 this 指向 这个空对象。然后执行 fn 也就是 Person 会把 name, age 挂载到 这个空对象上，然后返回这个空对象（是 new 进行的返回，不是 Person() 进行的返回）。虽然返回的对象上也包括了对应的属性，但是这个对象 instanceof Person 为 false 期望的结果应该是 true。这就是因为 new 过程第二步，obj 的 __proto__ 指向的就是 temp 的 prototype 而不是 Person 的 prototype ， 因为 _bind 并不能返回原函数的拷贝， bind 可以，可以通过下面的打印获得。 所以这里直接改变 this 指向是不正确的
      // *这里打印的 this 的 __proto__ 指向 temp.prototype
      console.log(this, 'this');
      // *所以这里直接使用 new fn() 但是不确定是否还有其他限制，目前的测试结果都正常
      return new fn(...arr);
    }

    // *如果没有被 new 那么直接 apply 改变 this 指向，并返回
    return fn.apply(_this, arr);
  };
}

Function.prototype._bind = _bind;

// *基本测试
// function fn(y, z) {
//   console.log(this, y, z);
// }
//
// const a = {
//   x: 123,
// };
//
// const f1 = fn.bind(a, 1, 2);
// const f2 = fn._bind(a, 2, 1);
//
// f1();// { x: 123 } 1, 2
// f2();// { x: 123 } 2, 1

// *偏函数测试
// function fn(y,z) {
//   return this.x + y + z;
// }
// const a = {
//   x: 123
// }
// const f1 = fn.bind(a, 1)
// const f2 = fn._bind(a, 1)
//
// console.log(f1(1), f2(1));// 125 125

// *new 测试
// const emptyObj = {};
// const emptyObj2 = {};
//
// function Person(name, age) {
//   this.name = name;
//   this.age = age;
// }
//
// const p1 = Person.bind(emptyObj, 'zx');
// const p2 = Person._bind(emptyObj2, 'zwx');
//
// // *打印这里可以发现 p1 是一个绑定函数:https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind#%E6%8F%8F%E8%BF%B0 绑定函数内部属性解释
// console.dir(p1);
//
// const pp1 = new p1(23);
// const pp2 = new p2(0);
//
// console.log(pp1, pp2); // Person {} Person{}
// console.log(emptyObj, emptyObj2); // {} {} 因为被 new 后，原本修改的 this 会被忽略，这里进行确认
// console.log(pp1 instanceof Person, pp2 instanceof Person); // true true

// setTimeout 测试
function LateBloomer() {
  this.petalCount = Math.ceil(Math.random() * 12) + 1;
}

// 在 1 秒钟后声明 bloom
// LateBloomer.prototype.bloom = function () {
//   window.setTimeout(this.declare.bind(this), 1000);
// };
// LateBloomer.prototype._bloom = function () {
//   window.setTimeout(this.declare._bind(this), 1000);
// };
//
// LateBloomer.prototype.declare = function () {
//   console.log('I am a beautiful flower with ' + this.petalCount + ' petals!');
// };
//
// var flower = new LateBloomer();
// flower.bloom(); // 一秒钟后, 调用 'declare' 方法
// flower._bloom();
// module.exports = _bind;


function logThis() {
  console.log(this);
}
// *无论有多少个 bind 都相当于是绑定的第一个 this
// *因为 bind 返回一个函数，所以后面的 bind 都相当于对这个返回的函数进行绑定 this 操作。
// * logThis._bind({ b: 1 })._bind({ b: 2 }) => (function bind1(..args) { return logThis.call(this, ...args) })._bind({ b:2 }) => (function bind2(...args) { return bind1.call(this, ...args) }) 所以最终执行的 logThis.call(this, ...args) 的 this 还是 { b: 1 }
const a = logThis._bind({ b: 1 })._bind({ b: 2 })
a(); // {b: 1}
const b = a._bind({ b: 4 });
b(); // {b: 1}