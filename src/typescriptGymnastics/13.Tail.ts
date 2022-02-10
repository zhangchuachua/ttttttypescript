export type Tail<T extends Array<any>> =  T extends [any, ...infer Rest] ? Rest : [];

// 测试用例
type T0 = Tail<[]> // []
type T1 = Tail<[1, 2]> // [2]
type T2 = Tail<[1, 2, 3, 4, 5]> // [2, 3, 4, 5]
