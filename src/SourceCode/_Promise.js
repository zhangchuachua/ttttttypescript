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
    // *x 是 Promise 时，例如 return fetch() 因为不知道 x 的状态，所以我们直接调用 x.then() 然后将 resolve 和 reject 传递过去 在 then 内部会改变状态，同时执行我们传入的 resolve reject 参数，这样就将 fetch 的状态和值同步到 当前的 Promise 中了， 而且这里 then 还返回了一个 Promise 不过我们不需要了，因为状态和值都同步了
    x.then(resolve, reject);
  } else {
    /**
     * 其他的值通通 resolve 也就是标记为 Fulfilled 这是为什么呢，这里的 x 是函数的返回值，不管是 onFulfilled 还是 onRejected 返回的值。 这个时候 x 的值总共可以分为三种情况
     * !1. x 返回普通的值，也就是 比如对象啊，数组啊这些，那么这些就直接 resolve，resolve 之后新的 Promise 对象就会变成 Fulfilled 状态，这也就是为什么 catch 后的 then 可以获取到这个值的原因
     * !2. 返回不确定的值，我能想到的不确定的值，就是等待异步返回的结果，也就是 Promise 注意 setTimeout 虽然是异步，但是它实在内部执行回调，不用等待返回值，而且 setTimeout 的返回值在 node 是一个对象，在浏览器就是 timeoutId
     * !3. 返回错误，其实没有返回错误，只有抛出错误，抛出错误就已经在上一层中被 catch 到了。就算返回错误 return new Error() 其实也算是普通值了，直接 resolve （注意：在浏览器试的时候发现 new Error() 只能被分配给 const）
     * *所以这里安心使用 resolve 是没有问题的
     * */
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
    // *这里的处理是为了应对 then 中不传参数，或者传入不是函数的情况，当这种情况，不会报错，而是将值继续进行传递 所以Promise.then().then().then(value => console.log(value))  最后一个 then 还是能够获得 value
    if(_typeof(onFulfilled) !== 'function') {
      onFulfilled = value => value;
    }
    // *这里有所不同，这里需要 throw 因为是错误，需要走 reject 将状态修改为 Rejected
    if(_typeof(onRejected) !== 'function') {
      onRejected = reason => {
        throw reason;
      };
    }
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

  // *其实这种写法，也是正确的，与 then 差不多
  // catch = (onRejected) => {
  //   if(_typeof(onRejected) !== 'function') {
  //     onRejected = (reason) => {
  //       throw reason;
  //     };
  //   }
  //   const p = new _Promise((resolve, reject) => {
  //     if(this.status === Rejected) {
  //       queueMicrotask(() => {
  //         try {
  //           const res = onRejected(this.reason);
  //           resolvePromise(p, res, resolve, reject);
  //         } catch(e) {
  //           reject(e);
  //         }
  //       });
  //     } else if(this.status === Pending) {
  //       this.onRejectedList.push(() => {
  //         queueMicrotask(() => {
  //           try {
  //             const res = onRejected(this.reason);
  //             resolvePromise(p, res, resolve, reject);
  //           } catch(e) {
  //             reject(e);
  //           }
  //         });
  //       });
  //     }
  //   });
  //   return p;
  // };

  // *finally 接收一个回调函数，且不会向回调函数中传递任何参数，这说明了 finally 应该与 Promise 的状态无关，不依赖于 Promise 的结果  finally 应该也是微任务 根据 阮一峰-ES6-Promise.finally 推断 https://wangdoc.com/es6/promise.html#promiseprototypefinally [finally 本质上是 then 方法的特例]
  finally = (func) => {
    // *因为 finally 是 then 的特例，所以可以这样实现
    // *注意 这里依然需要返回，Promise 的 finally 后续依然可以接 then
    return this.then((value) => {// !不能直接将 func 传入因为 onFulfilled 调用时会传入参数
      func();
      return value;// 注意这里的value要返回
    }, (reason) => {// 同理
      func();
      throw reason;
    });
  };

  // *收到 finally 的启发 那么 catch 应该也是 then 的特殊形式
  catch = (onRejected) => {
    return this.then(null, onRejected);
  };

  // *resolve 和 reject 比较简单，就是直接改变 Promise 的状态就行
  static reject(reason) {
    return new _Promise((resolve, reject) => {
      reject(reason);
    });
  }

  static resolve(value) {
    return new _Promise((resolve) => {
      resolve(value);
    });
  }

  /**
   * @desc 经过测试可得 Promise.all() 可以直接传入值 不像 Promise() 的值必须是一个函数
   * @desc 经过测试 Promise.all() 传入 Error() 时依然经过 then 而不是 catch
   * @param values {(_Promise|any)[]}
   * */
  static all(values) {
    // *实现的思路也比较简单，但是不确定是否正确
    // *使用一个临时数组存储多个 Promise 的结果值
    const tempArr = [];
    // *新建一个 Promise 记录所有的 value
    const p = new _Promise((resolve, reject) => {
      values.forEach((item, index) => {
        // 判断类型，如果是 _Promise 就需要等待结果 如果是一个普通的值，就直接记为 resolve
        if(!item instanceof _Promise) tempArr[index] = item;
        item.then((value) => {
          // *这里我没有使用 push 因为传入的数组，与结果之间是一一对应的， 但是使用 push 应该也是一样的结果，因为 onFulfilled 会放到 微队列里面进行，根据队列先入先出的性质顺序应该也不会发生改变。
          tempArr[index] = value;
        }, (err) => {
          // *当有一个 reject 了 直接让当前 p 变成 rejected 状态。
          reject(err);
        });
      });
      // 如果都进行成功了,那么这使用 resolvePromise 将 tempArr 放到 p 的 value 中去
      queueMicrotask(() => {
        resolvePromise(p, tempArr, resolve, reject);
      });
    });
    // 返回 p
    return p;
  }
}

module.exports = _Promise;
