const _Promise = require('./_Promise');

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
