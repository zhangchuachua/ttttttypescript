const _Promise = require('./_Promise');
const _typeof = (p) => {
  return Object.prototype.toString.call(p).slice(8, -1).toLowerCase();
};

// new Promise((r,s) => {
//   r(1)
// }).then(1,2) // 不会报错

// new Promise((r,s) => {
//   r(1)
// }).then(1,2).then().then().then(value => {console.log(value);}) // 输出1

// new Promise((r,s) => {
//   s(1)
// }).catch().catch(value => {console.log(value);}) // 输出1
// new _Promise((r,s) => {
//   s(1)
// }).catch().catch(value => {console.log(value);}) // 输出1

// new Promise((r) => {
//   r(1);
// }).then(() => {
//   return setTimeout(() => {
//     console.log(1);
//   }, 0);
// }).then(value => {
//   console.log(value);
// }).finally(() => {
//   console.log(123);
//   return 'finally'
// }).then(value => {console.log(value);});

// _Promise.all([
//   new _Promise((r, s) => {
//     r(1);
//   }),
//   new _Promise((r, s) => {
//     r(2);
//   }),
//   new _Promise((r, s) => {
//     s(3);
//   }),
// ]).then(value => {
//   console.log(value);
// }).catch(value => {
//   console.log(value);
// });

// new Promise((r, s) => {
//   s(123)
// })

// console.log(_typeof(Promise));

// Promise.all([
//   new Error('fuck'),
// ]).then((value) => {
//   console.log(value, 'then');
// }).catch(err => {
//   console.log(err, 'catch');
// });

// ------------------- Promise.resolve -------------------

// _Promise.resolve({
//   then: (resolve, reject) => {
//     resolve(42)
//   }
// }).then((value) => {
//   console.log(value)// 输出 42
// })
//
// Promise.resolve({
//   then: (resolve, reject) => {
//     resolve(42)
//   }
// }).then((value) => {
//   console.log(value) // 输出 42
// })

// ------------------- Promise.resolve -------------------

// ------------------- Promise 面试题 -------------------

// *输出 0 1 2 4 3 5 6
/** 解析
 * !注意：根据在 then 里面进行打印可以知道，所有的 then 的声明都是同步代码。 也就是说 所有的 then 都是直接执行了
 *
 * !1. 执行同步代码: 这里执行的是所有的 then 但是入队的只有两个，第一个是 log 0 的函数，第二个是 log 1 的函数，因为只有在状态 !== Pending 的情况下才会将操作进行入队，但是其他的 then 状态都是 Pending 所以都将操作 push 到了 onFulfilledList 中了
 * !2. log 0 然后 return _Promise.resolve(4) 因为返回的是一个 Promise 所以在 resolvePromise 中还会执行它的 then，因为状态是 fulfilled 所以立即执行 onFulfilled 也就是又入队了
 * !3. 此时出队的是 log 1 然后入队 log 2
 * !4. 此时出队的是 2 中的操作，执行后得到 value = 4 后执行 then 将 log res 入队
 * !5. 出队 log 2 入队 log 3
 * !6. 出队 log res 打印 4
 * !7. 然后依次 log 3, log 5 log 6
 * */
_Promise.resolve().then(() => {
  console.log(0)
  return _Promise.resolve(4);
}).then((res) => {
  console.log(res)
})

_Promise.resolve().then(() => {
  console.log(1);
}).then(() => {
  console.log(2);
}).then(() => {
  console.log(3);
}).then(() => {
  console.log(5);
}).then(() =>{
  console.log(6);
})

/**
 *
 */
// *这里的输出为 0 1 2 3 4 5 6
// Promise.resolve().then(() => {
//   console.log(0)
//   return Promise.resolve(4);
// }).then((res) => {
//   console.log(res)
// })
//
// Promise.resolve().then(() => {
//   console.log(1);
// }).then(() => {
//   console.log(2);
// }).then(() => {
//   console.log(3);
// }).then(() => {
//   console.log(5);
// }).then(() =>{
//   console.log(6);
// })

// ------------------- Promise 面试题 -------------------
