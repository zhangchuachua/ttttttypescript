// *函数的柯里化
// !柯里化函数的作用：配合 compose 函数，因为 compose 函数的特性，除了第一个函数可以接收多个参数外，后面的函数都只能接收一个参数，所以可以通过柯里化，将多个参数的函数进行转化
/**
 * 例如：
 * 将字符串 ['HELLO', 'WORLD'] => goodbye-world
 * 因为需要将 HELLO 替换为 goodbye 需要传入两个参数；将数组 join 成字符串，也需要传入两个数组，所以单纯的使用 compose 函数无法完成
 * 这个时候就可以使用 curry
 * */
import compose from "../compose";

function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) return fn(...args);
    return (..._args) => curried(...args, ..._args);
  };
}

// ------------------- curry test -------------------

// function add(a, b, c) {
//   return a + b + c;
// }
//
// const curryAdd = curry(add);
//
// console.log(curryAdd(1)(2)(3));

// ------------------- curry test -------------------

// -------------------  -------------------
// 这种编程方式叫做 point-free
const a = ['HELLO', 'WORLD'];
// *因为在 composed 函数执行时才会传入数据，所以需要将数据放在最后，所以这里自定义了 join 和 replace
const join = (spe, arr) => arr.join(spe);
const replace = (from, to, str) => str.replace(from, to);
// 进行柯里化
const curriedJoin = curry(join);
const curriedReplace = curry(replace);
// !curried 函数与 compose 函数相互结合，先将函数柯里化，让函数可以分多次传入参数；然后在 compose 组合过程中传入需要用到的参数，返回一个 composed 函数
const fn = compose(_.toLower, curriedReplace('HELLO', 'goodbye'), curriedJoin('-'));
// !最后在执行 fn 时再传入数据
console.log(fn(a));
// -------------------  -------------------
