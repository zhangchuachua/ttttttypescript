// *枚举兼容性
enum Fruit {
  Apple,
  Banana,
}

enum Color {
  Red = 100,
  Yellow,
}

// *数字枚举与 number 完全兼容，但是字符串枚举不是，可以看 ./2.enumType.ts
let fruit: Fruit.Apple = 3;
let no: number = Fruit.Apple;
let color: Color = 123;
// let color1: Color = Fruit.Banana; // 这里会报错，枚举之间是完全不兼容的

// *类的兼容性
class A {
  id: number = 1;

  // private string: string = '123'; // 添加后 不兼容

  constructor(p: number, q: number) {
    console.log(p, q);
  }
}

class B {
  static s = 1;
  id: number = 2;

  // private string: string = '123'; // 添加后 不兼容

  constructor() {}
}

let aa = new A(1, 2);
let bb = new B();
// *可以看到两个 当两个类有相同的实例成员时完全兼容 这个时候 静态成员 和 构造函数 是不参加比较的
aa = bb;
bb = aa;

// *但是在添加了私有成员之后，即使两个类都添加相同的私有成员，依旧不兼容了
class C extends A {
  // od: number = 1; // 添加后不兼容
}

let cc = new C(1, 2);
// *使用子类的话 当两个 实例的成员完全一样时，依然互相兼容 但是如果不一样的话，就像之前说的 子类型可以赋值给父类型 父类型可以兼容子类
aa = cc;
cc = aa;

// *class 的兼容性应该与 interface 差不多，但是注意 private

// *泛型兼容性

interface Empty<T> {
  value: T; // 开启这里 就不再兼容了
}

let obj1: Empty<number> = { value: 1 };
let obj2: Empty<string> = { value: 's' };
// *可以看到 当 value: T 被注释时，两者可以互相兼容， 但是 value: T 开启了就不兼容，
obj1 = obj2;
obj2 = obj1;

// !这里其实也比较好理解，不指定泛型时可以看作 any 。

export {};
