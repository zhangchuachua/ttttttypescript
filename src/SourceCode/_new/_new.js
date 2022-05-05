/**
 * 要想手写 new 就要先知道 new 干了哪些事情，MDN 里面写的很详细 ：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/new
 *  *1. 初始化一个空对象 {}
 *  *2. 将 第一步空对象的 __proto__ 指向 构造函数的 prototype
 *  *3. 使用第一步创建的空对象作为构造函数的上下文，并且执行构造函数，传入参数
 *  *4. 检查构造函数返回值，如果构造函数返回值是一个对象，那么就返回这个对象，不然就返回第一步创建的对象。
 * */

// *es6 写法
function _new(Con, ...args) {
  const tempObj = {};
  tempObj.__proto__ = Con.prototype;
  const symbol = Symbol('secret');
  tempObj[symbol] = Con;
  const res = tempObj[symbol](...args);
  delete tempObj[symbol];
  return res instanceof Object ? res : tempObj;
}

function Person(name, age, sex) {
  this.name = name;
  this.age = age;
  this.sex = sex;
}

const p = new Person('zhangxu', 23, 'man');
const p2 = _new(Person, 'zwt', 22, 'woman');

console.log(p, p2);
console.log(p.__proto__, p2.__proto__)
console.log(p instanceof Person,p2 instanceof Person);