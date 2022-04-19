// !不能是箭头函数，箭头函数没有 this 也就无法获取当前正在调用的函数，当前的 this 就是当前被调用的函数
// TODO 其实第一步应该判断 当前被调用的函数是否可以执行 isCallable 但是目前不知道如何判断，但是有一个库：https://github.com/inspect-js/is-callable/blob/main/index.js 后续可以看一下
function _call<T, A extends any[], R>(this: (thisArg: T) => R, thisArg: T): R;
function _call<T, A extends any[], R>(
  this: (thisArg: T, ...args: A) => R,
  thisArg: T,
  ...args: A
): R {
  let _this;
  if (thisArg === null || thisArg === undefined) {
    _this = typeof window === 'undefined' ? global : window;
  } else {
    _this = Object(thisArg);
  }
  // !此时的 this 就是被调用的函数
  // console.log(this);
  // 使用 Symbol 创建独一无二的键名
  const sym = Symbol('secret');
  _this[sym] = this;
  // *在这里进行调用，这里就把函数放到了对象中去调用，所以这个时候的 this 指向该对象，也就是 _this
  // *但是因为对 _this 新增了一个 sym 属性，所以如果在被调用函数中打印 this 是可以看到这个 sym 属性的，因为被调用时还没有被删除。但是官方的 call 函数中打印并没有看到中间属性。 看来使用了更高级的做法
  const res = _this[sym](...args);
  // 这里删除这个属性
  delete _this[sym];
  // 然后返回
  return res;
}

// @ts-ignore
Function.prototype._call = _call;

export default _call;
