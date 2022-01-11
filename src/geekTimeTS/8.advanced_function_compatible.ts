// *类型兼容性

// *1. 接口兼容性，简单的来说，就是接口属性少的，兼容接口属性多的
interface A {
  a: number;
}

interface B {
  a: number;
  b: number;
}

let a: A = {
  a: 1,
  // *这里会报错，也就是说，除了类型兼容之外，不能赋予多的成员
  // b: 2,
};
let b: B = {
  a: 1,
  b: 2,
};
// *这里不会报错，因为有类型兼容， B 类型包含 A 的所有成员，所以可以将 B 赋予给 A。这个时候叫做， A 包含（兼容） B，不要搞反了。
a = b;

// *2. 函数类型兼容
type Handler = (a: number, b: number) => void;

function hoc(handler: Handler) {
  return handler;
}

// *1) 函数类型兼容又分三个部分：参数个数 参数多的兼容参数少的
// !这里如果使用下面的 逆变协变 来判断的话，这里参数应该使用集合来判断，而不是类型，因为都是类型一样的，但是参数个数不同，应该判断集合，所以 应该是 等号右边是等号左边的子集
let handler1 = (a: number) => {
  console.log(a);
};
// *这里是可以的，因为此时 Handler 兼容 handler1 的类型
hoc(handler1);

let handler2 = (a: number, b: number, c: number) => {
  console.log(a, b, c);
};
// *这里就会报错，因为 Handler 不兼容 handler2 的类型
hoc(handler2);

// *2) 可选参数和剩余参数
let a1 = (p1: number, p2: number) => {
  console.log(p1, p2);
};
let b1 = (p3?: number, p4?: number) => {
  console.log(p3, p4);
};
let c1 = (...args: number[]) => {
  console.log(args);
};
// TODO 这里的类型兼容很重要！ 可以使用下面将 ”等号右边的函数放到等号左边的函数内部执行的方法“ 进行判断，连上面的参数个数的兼容也可以判断。
// !https://juejin.cn/post/7019565189624250404#heading-3 这篇文章解释了这里的类型兼容，函数之间的兼容， 函数参数之间是逆变， 函数返回值之间是协变。 协变是 子类型 -> 父类型 (等号右边是右边的子类型)。 逆变是 父类型 -> 子类型 (等号右边是左边的父类型)
b1 = a1; // *b1 的参数类型是 (p3: number | undefined, p4: number | undefined) a1 的参数类型是 (p1: number, p2: number) 参数之间是逆变，也就是说 b1 接受参数的父类型，但是现在 a1 的类型属于 b1 的子类型。这明显是错误的，所以报错了。 根据上面文章中的例子，可以发现， visitDog 接受 Dog , visitAnimal 接受 Animal, 但是 visitDog = visitAnimal 函数兼容，就说明了这一点， Animal 是 Dog 的父类型。
// !注意 如果不明白 number | undefined 为啥是 number 的父类型，可以看看这篇文章 概括一下说， 子类型比父类型更加具体，所以联合类型与 class interface 不一样，联合类型中，类型越少越具体。 interface class 中成员越多越具体。
// ! 或者也可以使用 文章中，将 a1 放在 b1 执行。 大概过程如下
let bTest = (p3?: number, p4?: number) => {
  // *还是 b 的参数
  a1(p3, p4); // 使用 b 的参数执行 a 很明显发生了错误
};
b1 = c1;
a1 = b1;
a1 = c1;
// *可以看到正确的逆变就不会报错
let aTest = (p1: number, p2: number) => {
  // 这里依旧使用 a 的参数
  c1(p1, p2); // 可以看到 c 并没有报错
};

c1 = a1;
c1 = b1;

let man = (arg: string | number): void => {
  console.log(arg);
};
let player = (arg: string): void => {
  console.log(arg);
};
player = man;

/*
 * 在老版本的 TS 中，函数参数是双向协变的。也就是说，既可以协变又可以逆变，但是这并不是类型安全的。在新版本 TS (2.6+) 中 ，你可以通过开启 strictFunctionTypes 或 strict 来修复这个问题。设置之后，函数参数就不再是双向协变的了。
 **/

interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface Point2D {
  x: number;
  y: number;
}

let p3d = (p: Point3D) => {
  console.log(p);
};

let p2d = (p: Point2D) => {
  console.log(p);
};
// *下面的类型兼容也可以使用上面的 协变逆变来解释 函数参数是逆变，也就是 等号右边参数 应该是 等号左边参数的 父类型或子集 这里的 Point2D 明显是 Point3D 的父类型 因为 Point3D 明显可以 extends Point2D 然后多加一个 z 属性得到。
p3d = p2d; // 所以这里兼容
p2d = p3d; // 这里不兼容

// *返回值类型
let f = () => ({ name: 'alice' });
let g = () => ({ name: 'alice', location: 'beijing' });
f = g;
g = f; // *这里使用 函数返回值是 协变 就可以解释 等号右边的返回值 是 等号左边返回值的 子类型。

// *函数重载 这里不能使用上面的 协变逆变 理论，参数的逆变是可以解释的，但是返回值的协变无法解释。 只需要记住：参数和返回值都应该包含函数重载的所有类型就可以了。 比如下面的函数重载 参数必须包含 number | string, 返回值必须包含 number | string
function overflow(a: number, b: number): number;
function overflow(a: string, b: string): string;
function overflow(a: any, b?: number | string): number | string | void {
  return a + b;
}

// *泛型函数
let log1 = <T>(x: T): T => {
  console.log(x);
  return x;
};

let log2 = <U>(y: U): U => {
  console.log(y);
  return y;
};

// *可以看到不指定泛型时互相兼容，其实比较好理解，不指定泛型时可以看作 any
log1 = log2;
log2 = log1;

export {};
