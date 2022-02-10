import type { Equal } from "./Equal";
// * 做法1 T[number] 直接得到 所有元素的联合类型
export type Includes<T extends Array<any>, E> = E extends T[number] ? true : false;
// * 做法2 使用循环和递归  注意 因为 1 extends {} 为 true
export type Includes2<T extends any[], E> = T extends [infer Current, ...infer Rest]
  ? E extends Current // 注意 因为 extends {} 为true 所以需要多加一次判断
    ? Current extends E
      ? true
      : Includes2<Rest, E>
    : Includes2<Rest, E>
  : false;

type I0 = Includes2<[], 1> // false
type I1 = Includes2<[2, 2, 3, 1], 2> // true
type I2 = Includes2<[2, 3, 3, 1], 1> // true
type I3 = Includes2<[{}, 'asd', true, never], 1>// TODO 记住！！ 1 extends {} = true  而且目前发现除了 undefined 其他的类型全都 extends {} = true

type A = Equal<'any', {}>;
type b = Equal<true, {}>;
type n = Equal<number, {}>
type nu = Equal<null, {}>
type s = Equal<string, {}>
type arr = Equal<[], {}>
type nev = Equal<never, {}>
type un = Equal<undefined, {}>

// TODO 再次注意 typescript 不能进行 & 得到 boolean 的结果值 比如
type Boo = true & false;// never
