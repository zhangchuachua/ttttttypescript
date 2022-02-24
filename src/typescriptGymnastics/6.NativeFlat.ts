// *这个还是有局限性，不仅是因为使用了一个中间高级类型 还多使用了一个范型，而且这样的返回只能是一个数组：['a', 'b', 'c', 'd'] 而不是一个联合类型 'a'|'b'|'c'|'d'
type Loop<T extends any[], Arr extends any[] = []> = T extends [
  infer Current,
  ...infer Rest
]
  ? Current extends any[]
    ? Loop<Rest, [...Arr, ...Current]>
    : Loop<Rest, [...Arr, Current]>
  : Arr;
export type NaiveFlat<T extends any[]> = Loop<T>;

// !要返回联合类型，对于对象来说可以使用 {}[keyof] 的方式，虽然对于数组也可以这样使用 但是对于 length 以及原型上的属性和方法都会被遍历到
// !所以对于数组来说可以直接使用 [][number] !!!   例如 ['a','b','d'][number] = 'a'|'b'|'d'
export type NaiveFlat2<T extends any[]> = {
  [Index in keyof T]: T[Index] extends any[] ? T[Index][number] : never;
}[number];
// !递归 遍历更深的数组。 假设例子为：[[['a']], ['b', ['c']], 'd', [[[[[[['d']]]], 'e']]]] 在 [Index in keyof T] 时，其实还是遍历四次，但是四次的结果为 ['a','b'|'c', 'd', 'd'|'e'] 所以最后的结果为 'a' | 'b' | 'c' | 'd' | 'e'
export type DeepFlat<T extends any[]> = {
  [Index in keyof T]: T[Index] extends any[] ? DeepFlat<T[Index]> : T[Index];
}[number];

// 测试用例：
type NaiveResult = NaiveFlat2<[['a'], ['b', 'c'], ['d']]>; // 'a' | 'b' | 'c' | 'd'
const aaa: NaiveResult = 'a';
type deepResult = DeepFlat<
  [[['a']], ['b', ['c']], 'd', [[[[[[['d']]]], 'e']]]]
>;
