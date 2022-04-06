/**
 * 参考：
 * https://juejin.cn/post/6844903801799835655#heading-3 箭头函数与普通函数的区别
 * https://juejin.cn/post/6966860151311564836 javascript 中 class 的 this 指向
 * https://juejin.cn/post/6945319439772434469#heading-10 手写 Promise 还要 eventLoop 图例
 * https://danlevy.net/javascript-promises-quiz/ promise 运行题目
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
  onFulfilled = [];
  onRejected = [];

  constructor(executor) {
    executor(this._resolve, this._reject);
  }

  // *这里要使用箭头函数，不然的话就需要修改为 executor(this._resolve.bind(this), this._reject.bind(this));
  // *这是因为箭头函数没有自己的 prototype 所以箭头函数本身没有 this ，而是直接继承外层的 this 而且不能直接修改箭头函数的 this 指向
  // *根据上面的参考可以知道，箭头函数 this 指向定义时的所在的对象，所以说这里使用箭头函数 this 指向的是 _Promise 对象
  // *如果使用 _resolve() {} 那么 this 指向就会根据执行上下文确定 this 指向，导致报错
  _resolve = (value) => {
    if (this.status === Pending) {
      this.status = Fulfilled;
      this.value = value;
      while (this.onFulfilled.length) {
        const fn = this.onFulfilled.shift();
        fn(value);
      }
    }
  };

  _reject = (reason) => {
    if (this.status === Pending) {
      this.status = Rejected;
      this.reason = reason;
      while (this.onRejected.length) {
        const fn = this.onRejected.shift();
        fn(reason);
      }
    }
  };

  then = (onFulfilled, onRejected) => {
    const self = this;
    const promise2 = new _Promise((resolve, reject) => {
      // *因为 箭头函数 this 指向函数定义时的所在的对象，所以这里 self === this 为 true 不会因为后面执行而修改 this 指向
      console.log(self === this); // true
      if (this.status === Fulfilled) {
        onFulfilled(this.value);
      } else if (this.status === Rejected) {
        onRejected(this.reason);
      } else if (this.status === Pending) {
        this.onFulfilled.push(onFulfilled);
        this.onRejected.push(onRejected);
      }
    });
    return promise2;
  };
}

const promise1 = new _Promise((resolve) => {
  setTimeout(() => {
    resolve(1);
  }, 1000);
});

const xx = promise1.then((value) => {
  console.log(value, 1);
  return 'okok';
});
// .then((data) => {
//   console.log(data);
// });

promise1.then((value) => {
  console.log(value, 2);
});

promise1.then((value) => {
  console.log(value, 3);
});
