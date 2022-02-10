// *开始我的答案是 A extends B ? true : false; 这样的 但是这样有一个错误， 因为 extends 不完全是比较是否相等，还可以用于判断是否 继承 所以当 A 继承于 B 时 也会返回 true
type IsEqual<A, B> = A extends B ? B extends A ? true : false : false;

// 测试用例
type E0 = IsEqual<1, 2>; // false
type E1 = IsEqual<{ a: 1 }, { a: 1 }> // true
type E2 = IsEqual<[1], []>; // false
type E3 = IsEqual<{ a: 1, b: 2 }, { a: 1 }>; // false
type E4 = IsEqual<{ a: 1 }, { a: 1, b: 2 }>; // false
