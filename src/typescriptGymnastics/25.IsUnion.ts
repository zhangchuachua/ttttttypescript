// *题目：实现一个 IsUnion 工具类型，判断指定的类型是否为联合类型。

// !答案：
export type IsUnion<T, U = T> = T extends any
  ? [U] extends [T]
    ? false
    : true
  : never;
// !运用到的知识点： 联合类型在 extends 时会自动分发， 但是 [T] extends [U] 就变成了普通类型，不会自动分发。
// *假设 T = string | number 大致过程为：T extends any 时自动分发，变成了 string 与 number 然后 [U] extends [T] 就是 string | number extends string 这样得出的结论肯定是 false 然后就返回 true 了，这样的话 IsUnion<string> 就会返回 false 了
// ! 至于为什么 IsUnion<string | never> 与 IsUnion<string | unknown> 为什么为 false 是因为 string | never extends string 得出结果为 true 所以返回 false。 而 string | unknown extends unknown 得出结果也为 true 所以为 false。

// 这里webstorm 显示的是 false 其实为 true  一切以 typescript 的 playground 为准
type I0 = IsUnion<string | number>; // true
type I1 = IsUnion<string | never>; // false
type I2 = IsUnion<string | unknown>; // false
type I3 = IsUnion<string>;

const i0: I0 = false;

type A = string | unknown extends unknown ? true : false; // *一切值都可以赋给 unknown 所以 string | unknown extends unknown 为 true

type B = string | never extends string ? true : false; // *never 感觉根本不会进入到式子中去?
