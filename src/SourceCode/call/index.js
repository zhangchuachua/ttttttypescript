/**
 * 先补充一点 this 的知识： https://juejin.cn/post/6844903496253177863
 * 1. 在 es5 中，this 永远指向最后调用它的对象
 * 2. 箭头函数没有 this 直接继承当前对象的 this，箭头函数嵌套就一直向上查找
 * 3. 在非严格模式中，this 默认是指向 window, node 中指向 global, 严格模式中，默认指向 undefined
 * 4. 函数使用 apply, call, bind 可以改变当前函数的 this 指向，三种方法具体的区别具体见 MDN
 * 5. 箭头函数不能使用上面三种方法改变 this 指向，因为箭头函数没有 this 如果要改变箭头函数的 this 指向，可以改变当前继承的 this 的指向
 * 6. apply, call, bind 非严格模式下，第一个参数为 null, undefined 时，会将 this 指向 window, global。传入其他原始值时，会指向被包装后的值，比如说 a.call('123') 那么 this 指向 String{'123'} 大概就是 new String('123')
 * 7. 匿名函数: 浏览器下匿名函数 this 指向 window，但是在 node 下，使用 setTimeout 进行测试，无论是否严格模式，this都指向 Timeout
 * */
// *https://juejin.cn/post/6844903496450310157 讲述了 call 执行过程，apply 的执行过程，比较两者之间的性能

const _call = require('./_call');
const _apply = require('./_apply');

Function.prototype._call = _call;
Function.prototype._apply = _apply;

// function a(a, b, c) {
//   console.log(this, a, b, c, 'a');
// }
//
// function b() {
//   console.log(this, 'b');
// }
//
// a._apply(b, [1, 2, 3]);

/**
 * *继续深入了解一下 call 和 apply 比如 call 的链式调用: https://juejin.cn/post/6999781802923524132
 * */

function a(){
  console.log(this,'a')
}
function b(){
  console.log(this,'b')
}
// a.call(b, 'b');// Function{'b'} a

// !两次链式调用 call 执行的是 b 函数呢？ 为什么更多次数的链式调用执行的依然是 b 函数呢
// 刚好这里手写了 call 虽然与原版不是一模一样，但是可以进行调试
/**
 * 分析
 * *使用 this 调用执行时的原生 this；使用 _this 代表自定义改变 this 指向的变量；_call-1 表示第一个 _call；_call-2 表示第二个 _call, thisArg 就是第一个参数；args 就是其他的参数
 * !1. 直接进入 _call-2 首先确定 this ，此时的 this 应该是 _call-1，因为当我们 a._call 时，_call 内部的 this 指向 a 函数，那么 a._call._call, _call-2 内部的 this 指向 _call-1 可以理解吧，而且这也符合 this 总是指向最后调用它的对象
 * !2. 传入的 thisArg 是 function b 被包装为 Object(thisArg) = Object(function b)
 * !3. 将 this 存放在 第二步包装的 thisArg 对象中去，记做 thisArg-2[_call-1] 这是为了改变调用函数的对象来改变 this 指向。
 * !4. 执行 thisArg-2[_call-1]，并且传入参数，args 是 'b'
 * !5. 进入到 _call-1 中了，注意此时的 this 指向的是 b 函数了，因为 _call-1 的 this 指向已经被改变了，也就是 3 中进行的操作，此时值传入了一个参数，那就是 'b' 所以此时的 thisArg 就是 'b'了
 * !6. 'b' 被包装为 String{"b"}, 把 this 放进这个对象中，记做 thisArg-1[b]
 * !7. 执行 thisArg-1[b] 打印 this, this 指向 String{"b"} 然后打印 'b'
 * !8. 函数执行完成 delete 中间变量，返回 res，根本不会执行到 a 函数中去
 *
 * *那么为什么更多次数的链式调用依然调用的的是 b 函数呢
 * !注意上面的第 3 步，因为此时的 this 指向的是一个 _call 所以才会链式调用 _call，然后在第 5 步，因为 this 指向 b 函数，所以指向完 b 函数就结束了。那么多次链式调用 _call 其实是一样的，第一次 _call this 指向 _call，然后执行这个 _call 这个 _call 的 this 已经指向 b 函数，所以最终只能执行 b 函数，并且执行完 b 函数后就停止了。
 *
 * */

console.log(a._call._call === _call);// true

// a._call._call(b,'b')  // String{"b"} "b"
a._call._call._call(b,'b')   // String{"b"} "b"
// a.call.call.call.call(b,'b')  // String{"b"} "b"
