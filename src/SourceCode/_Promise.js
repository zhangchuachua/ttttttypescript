/**
 * 参考：
 * https://juejin.cn/post/6844903801799835655#heading-3 箭头函数与普通函数的区别
 * https://juejin.cn/post/6966860151311564836 javascript 中 class 的 this 指向
 * https://juejin.cn/post/6945319439772434469#heading-10 手写 Promise 还要 eventLoop 图例
 * https://danlevy.net/javascript-promises-quiz/ promise 运行题目
 * */

const _typeof = (p) => {
  return Object.prototype.toString.call(p).slice(8, -1).toLowerCase();
};

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

const resolvePromise = (promise, x, resolve, reject) => {
  // *then 可以返回 Promise 对象，但是不能返回本身的 Promise 对象 否则就会发生循环调用 所以这里需要进行判断
  /**
   * 就是这样的情况：
   * const promise = new Promise((resolve) => {
   *   resolve(1);
   * }).then((res) => {
   *   console.log(res);
   *   return promise;
   * }
   */
  if(promise === x) {
    return reject(new TypeError('Chaining cycle detected for promise'));
  }
  // *当 onFulfilled 返回 _Promise 时就会触发这里，返回 _Promise 并不只是指显式的返回，比如 async () => {} 就会返回一个 Promise 与之类似
  if(x instanceof _Promise) {
    x.then(resolve, reject);
  } else {
    resolve(x);
  }
};

class _Promise {
  status = Pending;
  value = null;
  reason = null;
  onFulfilledList = [];
  onRejectedList = [];

  constructor(executor) {
    if(_typeof(executor) !== 'function') {
      throw new TypeError(
        'Promise resolver ' + executor + ' is not a function');
    }
    try {
      executor(this._resolve, this._reject);
    } catch(e) {
      this._reject(e);
    }
  }

  // *这里要使用箭头函数，不然的话就需要修改为 executor(this._resolve.bind(this), this._reject.bind(this));
  // *这是因为箭头函数没有自己的 prototype 所以箭头函数本身没有 this ，而是直接继承外层的 this 而且不能直接修改箭头函数的 this 指向
  // *根据上面的参考可以知道，箭头函数 this 指向定义时的所在的对象，所以说这里使用箭头函数 this 指向的是 _Promise 对象
  // *如果使用 _resolve() {} 那么 this 指向就会根据执行上下文确定 this 指向，导致报错
  _resolve = (value) => {
    if(this.status === Pending) {
      this.status = Fulfilled;
      this.value = value;
      while(this.onFulfilledList.length) {
        const fn = this.onFulfilledList.shift();
        fn(value);
      }
    }
  };

  _reject = (reason) => {
    if(this.status === Pending) {
      this.status = Rejected;
      this.reason = reason;
      while(this.onRejectedList.length) {
        const fn = this.onRejectedList.shift();
        fn(reason);
      }
    }
  };

  then = (onFulfilled, onRejected) => {
    // const self = this;
    const promise2 = new _Promise((resolve, reject) => {
      // *因为 箭头函数 this 指向函数定义时的所在的对象，所以这里 self === this 为 true 不会因为后面执行而修改 this 指向
      // console.log(self === this); // true
      if(this.status === Fulfilled) {
        // *将这里的代码放到微任务队列中去。 目前在解决 onFulfilled 返回 promise2 (即返回当前 _Promise 对象时，也就是resolvePromise 中第一个if判断) 时应该进行报错。也就是 res === promise2 但是这里全都是同步代码，获得 res 的时候 promise2 都还没有返回 这是一个悖论，所以将这里的 onFulfilled 放到微队列中执行
        // *当然不只是因为需要返回值，因为 Promise 的 then 本身就是属于微任务，而且 Promise 本身就是处理异步任务的，即使这个 then 里面全都是同步代码，也依然要放到微任务队列中去
        queueMicrotask(() => {
          try {
            const res = onFulfilled(this.value);
            resolvePromise(promise2, res, resolve, reject);
          } catch(e) {
            reject(e);
          }
        });
      } else if(this.status === Rejected) {
        // *同理，这里也需要放到微队列中去运行
        queueMicrotask(() => {
          try {
            const res = onRejected(this.reason);
            resolvePromise(promise2, res, resolve, reject);
          } catch(e) {
            reject(e);
          }
        });
      } else if(this.status === Pending) {
        // *这里因为异步请求还没有完成，所以我们在这里构建一个函数，并且存储到 onFulfilledList 中去。
        this.onFulfilledList.push(() => {
          // 同样的也是放到微队列中
          queueMicrotask(() => {
            try {
              const res = onFulfilled(this.value);// *注意在这里，就可以直接调用 onFulfilled 函数了，因为 _resolve 会判断 status === Resolved ，第二个是，此时 this.value 已经准备好了，所以完全没有问题
              resolvePromise(promise2, res, resolve, reject);
            } catch(e) {
              reject(e);
            }
          });
        });
        // *这里也是同理
        this.onRejectedList.push(() => {
          queueMicrotask(() => {
            try {
              const res = onRejected(this.reason);
              resolvePromise(promise2, res, resolve, reject);
            } catch(e) {
              reject(e);
            }
          });
        });
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
  console.log(value, 1, '链式');
  return 'okok';
}).then((data) => {
  console.log(data);
});

promise1.then((value) => {
  console.log(value, 2);
});

promise1.then((value) => {
  console.log(value, 3);
});
