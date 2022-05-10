// *compose 函数用于将多个函数进行组合，形成一个管道，然后传入参数，在管道中进行操作，最终返回结果。
// *compose 函数对于函数式编程还是非常有用的，它可以将多个函数组合在一起，然后执行返回的 composed 函数就可以了，让我们不必在乎函数内部的操作，只是进行输入，然后得到输出就可以了
// TODO 是否需要针对 this 指向进行修改
function compose(...fnArgs) {
  return function composed(...args) {
    // *使用了 reduceRight 因为 compose 函数一般都是从右往左执行 也可以使用 reduce 从左向右
    // *根据测试 lodash 的 flowRight 函数支持第一次传入多个参数，但是因为函数只能返回一个结果，所以后续参数只能接受一个参数。
    return fnArgs.reduceRight((acc, fn, currentIndex, arr) => {
      // *因为第一次执行函数可能有多个参数，所以在这里进行判断是否是第一次，注意，因为使用的是 reduceRight 所以第一次的元素应该是最后一个元素
      if (currentIndex === arr.length - 1) {
        return fn(...acc);
      }
      return fn(acc);
    }, args);
  };
}
//
// function add(a) {
//   return a + 1;
// }
//
// const fn = compose(add, add, add);
// console.log(fn(1));

export default compose;