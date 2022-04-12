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

// _Promise.resolve().then(() => {
//   console.log(0)
//   return _Promise.resolve(4);
// }).then((res) => {
//   console.log(res)
// })
//
// _Promise.resolve().then(() => {
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


Promise.resolve().then(() => {
  console.log(0)
  return Promise.resolve(4);
}).then((res) => {
  console.log(res)
})

Promise.resolve().then(() => {
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