> 要想实现一个 Promise 源码, 那么 [Promise A+ 标准](https://promisesaplus.com/)一定得看一下, 其实仔细阅读标准就能够写出 `Promise` 的基本源码了, 建议尽量看标准,
> 不理解的地方再找教程.

## Promise 基本结构

`Promise` 有三种状态:

1. `pending` 表示待处理, 进行中; 是 `Promise` 的初始状态
2. `fulfilled` 表示成功状态
3. `rejected` 表示失败状态

`Promise` 的基本使用是这样的：

```js
new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('data');
  }, 1000);
})
```

综上所诉，所以 `Promise` 的基本结构应该是这样的

```js
// *使用变量存储三种状态的值，可以避免拼错的情况。
const PENDING = "PEDNING";
const FULFILLED = "FULFILLED";
const REJECTED = "REJECTED";

class _Promise {
  // *status 应该是私有变量，不能暴露出去，默认为 pending
  private status = PENDING;

  constructor(func) {
    // 对 func 进行判断，经过测试 Promise 只能接受函数参数
    if (typeof func !== 'function') throw new TypeError('func is not a function');
    try {
      // *这里也经过了测试，不需要
      func(this._resolve, this._reject);
    } catch (e) {
      this._resolve(e);
    }
  }

  private _resolve() {
    // code
  }

  private _reject() {
    // code
  }

}
```