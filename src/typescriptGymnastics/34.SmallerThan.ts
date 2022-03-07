//* 实现一个 SmallerThan 工具类型，用于比较数值类型的大小。

// *这个也比较简单，因为不能直接比较大小，也是通过循环，构建一个数组，不断的让数组['length'] + 1 ，让 Arr['length'] 不断的与两个数进行比较，肯定是比较小的那个先到，就可以根据结果进行返回了  使用一个中间类型，避免 SmallerThan 可以传入额外的泛型
type Smaller<N extends number, M extends number, Arr extends number[] = []> = Arr['length'] extends N
  ? true
  : Arr['length'] extends M
    ? false
    : Smaller<N, M, [N, ...Arr]>

export type SmallerThan<N extends number,
  M extends number,
  > = N extends M ? false : Smaller<N, M>; //* 当 N extends M 时两者相等不是小于 返回 false

type S0 = SmallerThan<0, 1>; // true
type S1 = SmallerThan<2, 0>; // false
type S2 = SmallerThan<8, 10>; // true
