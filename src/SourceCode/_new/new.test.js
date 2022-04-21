function Point(x, y) {
  this.x = x;
  this.y = y;
}

Point.prototype.toString = function () {
  return this.x + ',' + this.y;
};

// const p = new Point(1, 2);
// p.toString(); // '1,2'

const emptyObj = {};
const emptyObj2 = {}
const newTest = Point.bind(emptyObj, 0);
const bindTest = Point.bind(emptyObj2, 0);
const XAxisPoint = Point.bind(emptyObj, 0 /*x*/);

// 本页下方的 polyfill 不支持运行这行代码，
// 但使用原生的 bind 方法运行是没问题的：

const YAxisPoint = Point.bind(null, 0 /*x*/);

/*（译注：polyfill 的 bind 方法中，如果把 bind 的第一个参数加上，
即对新绑定的 this 执行 Object(this)，包装为对象，
因为 Object(null) 是 {}，所以也可以支持）*/

const axisPoint = new YAxisPoint(5);
const xaxisPoint = new XAxisPoint(10);
bindTest(100);
console.log(axisPoint.toString()); // '0,5'
console.log(xaxisPoint.toString());
// *可以证明使用了 new 后 bind 的 this 值会被舍弃
console.log(emptyObj)
console.log(emptyObj2)

console.log(xaxisPoint instanceof Point);
console.log(axisPoint instanceof Point); // true
// axisPoint instanceof YAxisPoint; // true
// new YAxisPoint(17, 42) instanceof Point; // true
