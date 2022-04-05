/**
 * 参考：
 * https://juejin.cn/post/6844903801799835655#heading-3 箭头函数与普通函数的区别
 * https://juejin.cn/post/6966860151311564836 javascript 中 class 的 this 指向
 * https://juejin.cn/post/6945319439772434469#heading-10 手写 Promise 还要 eventLoop 图例
 * */


// type Func = (...args: any) => any;
// type Status = 'PENDING' | 'FULFILLED' | 'REJECTED';
// const Pending: Status = 'PENDING';
// const Fulfilled: Status = 'FULFILLED';
// const Rejected: Status = 'REJECTED';
//
//
// const _resolve = function(this: _Promise, value?: any) {
//   if (this.status === Pending) {
//     this.status = Fulfilled;
//     this.value = value;
//   }
// };
//
// const _reject = function(this: _Promise, reason: any) {
//   if (this.status === Pending) {
//     this.status = Rejected;
//     this.reason = reason;
//   }
// };
//
//
// class _Promise {
//   status: Status = Pending;
//   value: any = null;
//   reason: any = null;
//
//
//   constructor(executor: (resolve?: typeof _resolve, reject?: typeof _reject) => any) {
//     const self = this;
//     executor(_resolve.bind(self), _reject.bind(self));
//   }
//
//   then = (onFulfilled: Function, onRejected: Function) => {
//
//   }
//
//    catch = () => {
//
//    }
// }
//
//
// new _Promise((resolve, reject) => {
//   resolve?.(1);
// });

const Pending = 'PENDING';
const Fulfilled = 'FULFILLED';
const Rejected = 'REJECTED';

class _Promise {
  status = Pending;
  value = null;
  reason = null;

  constructor(executor) {
    executor(this._resolve, this._reject);
  }
  // *这里要使用箭头函数，不然的话就需要修改为 executor(this._resolve.bind(this), this._reject.bind(this));
  // *这是因为箭头函数没有自己的 prototype 所以箭头函数本身没有 this ，而是直接继承外层的 this 而且不能直接修改箭头函数的 this 指向
  // *根据上面的参考可以知道，箭头函数 this 指向定义时的所在的对象，所以说这里使用箭头函数 this 指向的是 _Promise 对象
  // *如果使用 _resolve() {} 那么 this 指向就会根据执行上下文确定 this 指向，导致报错
  _resolve = (value) => {
    if(this.status === Pending) {
      this.status = Fulfilled;
      this.value = value;
    }
  }

  _reject = (reason) => {
    if(this.status === Pending) {
      this.status = Rejected;
      this.reason = reason;
    }
  }

  then(onFulfilled, onRejected) {
    if(this.status === Fulfilled) {
      onFulfilled(this.value);
    } else if(this.status === Rejected) {
      onRejected(this.reason);
    }
  }
}

new _Promise((resolve) => {
  resolve(1);
}).then((res) => {
  console.log(res);
});
