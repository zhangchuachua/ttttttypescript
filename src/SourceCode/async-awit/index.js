// *很早之前就听过 async-await 是 generator 函数的语法糖，但是因为一直不知道具体的实现过程，下面手动实现一下 async-await

// *首先需要了解 generator 函数，具体可以看 https://wangdoc.com/es6/generator.html

// *看文章，大家都没有具体实现 async-await 都只是写了一个 Generator 函数的执行器， 那么这里就先完成执行器
function spawn(genF) {
  // 返回一个 Promise
  return new Promise((resolve, reject) => {
    // 首先获取遍历器对象
    const gen = genF();

    // 自动执行器
    function step(nextF) {
      let next;

      try {
        // *获取函数执行的返回值，一般来说是执行遍历器的返回值 type: { value: any, done: boolean }
        next = nextF()
      } catch (e) {
        reject(e);
      }

      // *如果 done 为 true 就 resolve
      if (next.done) {
        // *注意 此时的 next.value 是 Generator 函数的 return 值，如果没有 return 那么就是 undefined
        return resolve(next.value);
      }

      // !疑问2：为什么这里直接使用了 Promise.resolve，next.value 可能是任何值，比如 Promise，原始类型，thenable 对象，对于 原始类型 直接 resolve 可以接受，为什么对于 Promise，thenable 对象也是这样处理
      // !原因很简单，Promise.resolve 中已经包含了对 Promise, thenable 对象的特殊处理，如果参数是 Promise 那么就会直接返回该 Promise 并不会将其状态改变为 fulfilled; 对于 thenable 对象，将会这样处理 new Promise(thenable.then) 。
      Promise.resolve(next.value).then(function (v) {
        // *这里直到 Promise 状态为 fulfilled 才会执行
        step(function () {
          return gen.next(v);
        });
      }, function (e) {
        // *这里直到  Promise 状态为 rejected 才会执行
        step(function () {
          return gen.throw(e);
        });
      });


    }

    // !疑问1 为什么这里需要传入一个函数，而不是直接传入 value 然后在 step 内部执行 gen.next(value)
    // !因为内部不只有 next 还有可能会 throw ，所以需要传入函数进行控制
    step(function () {
      return gen.next(undefined);
    });
  })

}
