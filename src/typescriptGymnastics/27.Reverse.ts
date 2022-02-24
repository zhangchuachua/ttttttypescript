// *题目: 实现一个 Reverse 工具类型，用于对元组类型中元素的位置颠倒，并返回该数组。元组的第一个元素会变成最后一个，最后一个元素变成第一个。

// *这个没啥好说的，就是一个简单的循环和临时类型变量
export type Reverse<
  T extends Array<any>,
  R extends Array<any> = []
> = T['length'] extends 0
  ? R
  : T extends [...infer Rest, infer Last]
  ? Reverse<Rest, [...R, Last]> // !这里需要稍微注意一下：Last 最后一个类型变量，在这里依然是放在最后的，跟着代码过一下就知道了 第一次是 Last = 3 R = []; 第二次 Last = 2 R = [3] 应该是 [...R, Last]
  : never;

// *还可以这样
export type Reverse2<T extends any[], R extends any[] = []> = T extends [
  ...infer Rest,
  infer Last
]
  ? [...R, Last]
  : R;

type R0 = Reverse<[]>; // []
type R1 = Reverse<[1, 2, 3]>; // [3, 2, 1]
