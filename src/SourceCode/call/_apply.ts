import './_call';
function _apply<T, A extends any[], R>(
  this: (thisArg: T, args?: A) => R,
  thisArg: T,
  args?: A
): R {
  // *因为 _apply 是 _call 的语法糖，所以不需要处理 thisArg 在 _call 内部会进行处理
  if (args === undefined || args === null) return this._call(this, thisArg, []);
  // *排除原始类型
  if (typeof args !== 'object')
    throw new TypeError('CreateListFromArrayLike called on non-object');
  if (Array.isArray(args)) return this._call(_this, ...args);
  // *如果传入的是未数组的话，通过循环将值取出来，这里需要通过循环将值取出来的原因是：因为 args 是一个类数组，例如：{ length: 1, 0: 'a', a: 'b' } 但是我们只需要取出索引为 0 的值，如果直接使用展开运算符，还会获得其他的属性。所以需要通过循环将值取出来
  if (isArrayLike(args)) {
    let result = [];
    for (let i = 0; i < args.length; i++) {
      result.push(args[i]);
    }
    return this._call(_this, ...result);
  } else return this._call(_this);
}

function isArrayLike(obj: any): obj is ArrayLike<any> {
  if (typeof obj?.length !== 'number') return false;
  if (obj.length < 0) return false;
  if (Math.floor(obj.length) !== obj.length) return false;
  if (!isFinite(obj.length)) return false;
  return true;
}

// @ts-ignore
Function.prototype._apply = _apply;

function f() {
  console.log();
}

f.call({a: 123});

export default _apply;
