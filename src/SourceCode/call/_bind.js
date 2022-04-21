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
  const fn = this;
  return function () {
    let _this = thisArg;
    // !当这个函数被 new 时,将 _this 指向 this 不能指向 new.target 因为此时当 new.target 是返回当这个匿名函数，但是 this 是之前被绑定的函数，所以被 new 时，生成的实例应该属于之前被绑定的函数。所以这里 _this = this
    if (new.target) {
      _this = this;
    }
    // *返回的是一个函数，并且可以再接收其参数 所以这里使用 arguments
    const arr = [...args, ...arguments];
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
// const f2 = fn.bind(a, 2, 1);
//
// f1();
// f2();

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
// console.log(f1(1), f2(1));

const emptyObj = {};
const emptyObj2 = {};

// *new 测试
function Person(name, age) {
  this.name = name;
  this.age = age;
}

const p1 = Person.bind(emptyObj, 'zx');
const p2 = Person._bind(emptyObj2, 'zwx');

const pp1 = new p1(23);
const pp2 = new p2(0)

console.log(pp1, pp2);
console.log(emptyObj, emptyObj2);
// TODO 上面的打印结果都差不多，但是少了最关键的一步，这里的 pp2 instanceof Person 为 false 应该是 __proto__ !== Person.prototype
console.log(pp1 instanceof Person, pp2 instanceof Person);

// module.exports = _bind;
