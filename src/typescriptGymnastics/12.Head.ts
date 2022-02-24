// *注意 never extends any = true;
// *做法1 最简单的方式  但是评论区里面的答案 并没有这样的答案 难道有什么缺陷因为测试式样不足所以没有测出来吗?
export type Head<T extends any[]> = T[0]; // * T[0] 如果没有值的话 类型也是 never 而不是 undefined
// *做法2
export type Head2<T extends any[]> = T['length'] extends 0 ? never : T[0];
// *做法3  使用 First 取出第一个
// !注意 可以不使用临时变量取出后续的元素，直接使用一个 ...any 就可以了
export type Head3<T extends any[]> = T extends [infer First, ...any]
  ? First
  : never;

// 测试用例
type H0 = Head3<[]>; // never
type H1 = Head3<[1]>; // 1
type H2 = Head3<[3, 2]>; // 3
type H3 = Head<['a', 'b', 'c']>; // "a"
type H4 = Head3<[undefined, 'b', 'c']>; // undefined
type H5 = Head<[null, 'b', 'c']>; // null
