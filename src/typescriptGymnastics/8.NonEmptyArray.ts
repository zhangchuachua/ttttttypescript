// *做法1 这个做法应该是最容易想到的
export type NonEmptyArray<T> = [T, ...T[]];
// *做法2 这个做法有点不懂 这里只能是 { 0: T } 如果是 { 1: T } 非空数组也会报错，但是 { 0: T, 1: T } 不会报错，可能是数组必须按照顺序来，如果直接跳过索引 那么就会被理解为是对象？？？
export type NonEmptyArray2<T> = T[] & { 0: T }; // *这样就可以限制数组中必须有一个元素了
type Test<T> = T[]['length'] extends 0 ? never : T[];// *这是错误的做法，这里无论如何 都会返回 T[]  因为 T[]['length'] 的结果是 number 是类型 而不是具体的值

// const a: NonEmptyArray2<string> = []; // 将出现编译错误
const b: NonEmptyArray2<string> = ['Hello TS', 'T', '213']; // 非空数据，正常使用
