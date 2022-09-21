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
 * !注意：这里手写的 _Promise 是完全可以通过 Promise Aplus 测试的，也就是说，是完全符合标准的，至于为什么与 Promise 输出不一样，是 各种实现对 Promise 进行的优化，具体的看下面的解析
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

// _Promise
//   .resolve()
//   .then(() => {
//     console.log(0);
//     return _Promise.resolve(4);
//   })
//   .then((res) => {
//     console.log(res);
//   });
//
// _Promise
//   .resolve()
//   .then(() => {
//     console.log(1);
//   })
//   .then(() => {
//     console.log(2);
//   })
//   .then(() => {
//     console.log(3);
//   })
//   .then(() => {
//     console.log(5);
//   })
//   .then(() => {
//     console.log(6);
//   });

/** 解析 v8 源码的实现与我们的实现有些许不同
 *
 * *https://juejin.cn/post/6953452438300917790 掘金
 * *https://www.zhihu.com/question/453677175 知乎 有对于 V8 源码的解读，也有一步一步从代码分析，也有总结发言
 *
 * !1. 执行同步代码，将所有的 then 初始化完毕，入队的只有 log 0 和 log 1
 * !2. 出队 log 0 同时执行 return Promise.resolve(4); 注意不同在这里：这里返回了一个 Promise 我们的做法是直接调用 Promise 的 then(onFulfilled, onRejected)，然后 then 再将 onFulfilled 放入微队列；但是 v8 源码中，只要返回的值是 thenable 的也就是有 then 函数的，就会直接放到微队列去执行这个 then 也就是说，手写的代码是直接执行了这个 then 但是 v8 源码中是将 then 包装成一个 微任务区执行
 * !3. 出队 log 1 并且入队 log 2
 * !4. 出队包装 then 的任务，然后执行，也就相当于执行 then 再将 onFulfilled 入队
 * !5. log 2 入队 log 3
 * !6. 出队 onFulfilled 执行，得到 value = 4 然后将 log res 入队
 * !7. log 4 然后 log 5 log 6
 *
 * !所以要想让手写的代码达到原生 Promise 的输出就必须要在 执行 then 之前，将 then 放到微队列里面去
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

// *上面的解释在这里也可以适用。
Promise.resolve().then(() => {
  console.log(1);
  return {
    then(resolve, reject) {
      console.log('then')
      resolve('good');
    }
  }
}).then(res => {
  console.log(res)
})


Promise.resolve().then(() => {
  console.log(2)
}).then(() => {
  console.log(3)
})



const async1 = async () => {
  console.log('async1');
  setTimeout(() => {
    console.log('timer1')
  }, 2000)
  await new _Promise(resolve => {
    console.log('promise1')
  })
  console.log('async1 end')
  return 'async1 success'
}
console.log('script start');
async1().then(res => console.log(res));
console.log('script end');
_Promise.resolve(1)
  .then(2)
  .then(_Promise.resolve(3))
  .catch(4)
  .then(res => console.log(res))
setTimeout(() => {
  console.log('timer2')
}, 1000)


/**
 * !还是需要看一下 Promise 的源码
 * 实际输出是：
 * *script start -> async1 -> promise1 -> script end -> 1 -> timer2 -> timer1
 *
 * 让我没有想到的是 1 的位置。
 * !看了大半天才看到 async1 里面的 Promise 没有 resolve，没有 resolve 就会导致一直是 Pending 状态，所以进入后面的 `console.log('async1 end'); return 'async1 success';`
 * *其他的就都好解释了
 * *根据 Promise 的源码，Promise.resolve(1) 哪里可以注意一下
 * *Promise.resolve(1) 直接状态修改为 Fulfilled 然后这里的 .then(2) 因为 2 不是函数，所以替换为 (value) => value; 因为状态是 Fulfilled 所以直接放到微队列
 * *然后 .then(Promise.resolve(3)) 先执行 Promise.resolve(3) 返回一个 Promise 因为 Promise 不是函数所以替换为 value => value; 然后因为此时状态是 Pending (之所以是 Pending，是因为 .then(1) 哪里才放到了微队列，都还没开始执行，所以当前的 Promise 是 Pending)所以会把 value => value 放到 onFulfilledList 里面去，等到 resolve 时才会执行。
 * *.catch(4) 和 .then(res => console.log(res)) 都是一样，因为调用它们的 Promise 都是 Pending 所以不会立马放到微队列，而是等待之前的结果完成。
 * *
 */


// ------------------- Promise 面试题 -------------------
