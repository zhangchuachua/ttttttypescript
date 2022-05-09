// *函数的柯里化
function curry(fn) {
  const judge = (...args) => {
    console.log(args, fn.length);
    if (args.length === fn.length) return fn(...args);
    return (..._args) => judge(...args, ..._args);
  };
  return judge;
}

function add(a, b, c) {
  return a + b + c;
}

const curryAdd = curry(add);

console.log(curryAdd(1)(2)(3));
