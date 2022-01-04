// !函数重载，平时使用较少
// !ts 中的函数重载居然是这样，与 C++ 这样的语言不一样， ts中的函数重载需要提前声明不同的函数类型，然后紧接着对函数进行重载，就像下面这样！  中间不能有其他语句。
function add(...rest: number[]): number;
function add(...rest: string[]): string;
// const a = 1;
function add(...rest: any[]): any {
  let first = rest[0];
  if (typeof first === 'string') {
    return rest.join('');
  } else if (typeof first === 'number') {
    return rest.reduce((prev, cur) => prev + cur, 0);
  }
  return true;
}

// *不同的参数个数也可以进行重载
function add1(a: number, b: number): number;
function add1(a: number, b: number, c: number): number;
function add1(a: number, b: number, c?: number): number {
  if (c !== undefined) return a + b + c;
  return a + b;
}

export {};
