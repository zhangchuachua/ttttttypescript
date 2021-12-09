// *typescript中也有 Symbol 类型，这个类型表示是独一无二的标识，具体的 看 es6 symbol
const s1: Symbol = Symbol();
const s2 = Symbol();

console.log(s1 == s2); // 这里输出false

// * js 中 undefined 不是关键字，可以自己定义undefined变量覆盖全局的undefined
(function () {
  const undefined = 0;
  console.log(undefined); // 在ts中居然也可以这样打印
})();

// *never就是永远不可能达到的类型
function a(): never {
  throw new Error('never'); // 抛出错误
}

function b(): never {
  while (true) {} // 死循环也是never
}

export {};
