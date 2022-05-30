> 要想实现一个 Promise 源码, 那么 [Promise A+ 标准](https://promisesaplus.com/)一定得看一下, 其实仔细阅读标准就能够写出 `Promise` 的基本源码了, 建议尽量看标准,
> 不理解的地方再找教程.

## Promise 基本结构

`Promise` 有三种状态:

1. `pending` 表示待处理, 进行中; 是 `Promise` 的初始状态
2. `fulfilled` 表示成功状态
3. `rejected` 表示失败状态

`Promise` 的基本使用是这样的：

```js
// Promise 参数是一个函数，该函数又可以接收 resolve 与 reject 两个函数作为参数
new Promise((resolve, reject) => {
  setTimeout(() => {
    // 使用 resolve 将状态转变为 fulfilled, 并传递 value
    resolve('data');
    // 使用 reject 将状态转变为 rejected，并传递 reason
    // 但是注意，状态一旦变化，就不能再改变了
    reject('error');
  }, 1000);
})
```

综上所诉，所以 `Promise` 的基本结构应该是这样的:

```js
// *使用变量存储三种状态的值，可以避免拼错的情况。
const PENDING = "PEDNING";
const FULFILLED = "FULFILLED";
const REJECTED = "REJECTED";

class _Promise {
  // *status 应该是私有变量，不能暴露出去，默认为 pending
  private status = PENDING;
  // value 用于存储 _Promise 状态为 fulfilled 时的数据
  private value;
  // reason 用于存储 _Promise 状态为 reejcted 时的数据
  private reason;

  constructor(func) {
    // 对 func 进行判断，Promise 只能接受函数参数
    if (typeof func !== 'function') throw new TypeError('func is not a function');
    try {
      // 执行该函数，该函数的返回值并不去关心，只有 _resolve 与 _reject 能够改变 _Promise 的状态
      func(this._resolve, this._reject);
    } catch (e) {
      // 捕获到错误时，触发 _reject
      this._reject(e);
    }
  }

  private _resolve(value) {
    // 只能当状态是 pending 时才能改变
    if (this.status === PENDING) {
      this.status = FULFILLED;
      this.value = value;
    }
  }

  private _reject(reason) {
    // 只能当状态是 pending 时才能改变
    if (this.status === PENDING) {
      this.status = REJECTED
      this.reason = reason;
    }
  }

}
```

## 实现 Promise 的 then 及其链式调用

### then 的基本实现

`Promise A+` 标准中规定（部分）：

1. `then` 方法接受两个可选参数(这里使用 `onFulfilled, onRejected` 代替)
   - `onFulfilled`, `onRejected` 不是函数时，则忽略它
2. 如果 `onFulfilled` 是一个函数
   - 它必须在状态为 `fulfilled` 时才能调用，并且使用 `Promise` 内部的 `value` 作为它的第一个参数
   - 不能多次调用 `onFulfilled`
3. 如果 onRejected 是一个函数
   - 它必须在状态为 `rejected` 时才能调用，并且使用 `Promise` 内部的 `reason` 作为它的第一个参数
   - 不能多次调用 `onRejected`
4. `then` 可以在同一个 `Promise` 上多次调用
5. `then` 必须返回一个新的 `Promise`.

关于 `then` 的链式调用如下所示：

```js
new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('data')
  }, 1000)
}).then((res) => {// 第一个函数参数， 当状态为 fulfilled 时执行
  // 此时获取到的 res 就是当前 Promise 的 value
  console.log(res); // log: data
  return 123
}).then((res) => {
  console.log(res); // log: 123
}, (reason) => {// 还可以传入第二个函数参数，当状态为 rejected 时执行
  console.log(reason);
})
```

可以发现 `then` 是 `_Promise` 的实例方法，那么要想链式调用 `then` 就需要在 `then` 里面返回一个新的 `_Promise` 即可。

```js
class _Promise {
  // ...上面的代码

  // *注意，这里不能使用箭头函数，后面会进行解释
  then(onFulfilled, onRejected) {
    // *因为是根据当前 _Promise 的状态进行决定的，所以这里存储当前 _Promise 的 this
    const self = this;
    // 创建一个新的 _Promise 对象
    const tempP = new _Promise((resolve, reject) => {
      // 当状态是 fulfilled 时，执行 onFulfilled 函数
      if (self.status === FULFILLED) {
        try {
          // 执行出错时，需要捕获错误，并且修改 tempP 的状态
          const res = onFulfilled(self.value);
        } catch (e) {
          reject(e)
        }
        // 当状态是 rejected 时，执行 onRejected 函数
      } else if (self.status === REJECTED) {
        try {
          const res = onRejected(self.reason);
        } catch (e) {
          reject(e)
        }
      }
    });

    // 返回这个 _Promise 对象
    return tempP;
  }
}
```

### onFulfilled 与 onRejected 的默认值
其中 `onFulfilled` 与 `onRejected` 为 `undefined` 时，我们应该给一个默认值，下面是原生 `Promise` 的行为:

```js
new Promise((resolve) => {
  resolve('data')
}).then().then().then((value) => {
  console.log(value); // log: data
})

new Promise((resolve, rejected) => {
  rejected('error');
}).then().then(undefined, (reason) => {
  console.log(reason); // log: error
})
```

从上面的代码可以看出，当 `onFulfilled` 与 `onRejected` 为 `undefined` 时，就会默认向下传递 `value` 或 `reason`，所以将 `then` 的代码添加:

```js
class _Promise {
  then(onFullfiled, onRejected) {
    if (typeof onFullfiled !== "function") onFullfiled = (value) => value;
    // *注意：这里要将当前的 reason 传递给下一个 _Promise 的 reason，那么需要将下一个 _Promise 的状态变为 rejected 
    // 所以需要使用 throw 而不是 return
    if (typeof onRejected !== "function") onRejected = (reason) => {
      throw reason
    };

    // ...
  }
}
```

### 添加 onFulfilled, onRejected 返回值处理函数