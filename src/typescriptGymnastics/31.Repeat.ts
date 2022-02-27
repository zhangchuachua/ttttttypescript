// *题目 实现一个 Repeat 工具类型，用于根据类型变量 C 的值，重复 T 类型并以元组的形式返回新的类型。
type CreateArr<Ele extends any, N extends number, Arr extends Ele[] = []> = Arr['length'] extends N ? Arr : CreateArr<Ele, N, [...Arr, Ele]>;
export type Repeat<T, C extends number> = CreateArr<T, C>;

type R0 = Repeat<0, 0>; // []
type R1 = Repeat<1, 1>; // [1]
type R2 = Repeat<number, 100>; // [number, number]
