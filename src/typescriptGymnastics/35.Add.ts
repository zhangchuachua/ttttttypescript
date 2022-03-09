// *题目：实现一个 Add 工具类型，用于实现对数值类型对应的数值进行加法运算。

import { CreateArr } from './CreateArr';

export type Add<T, R> = T extends number
  ? R extends number
    ? [...CreateArr<T>, ...CreateArr<R>]['length']
    : never
  : never;

type A0 = Add<5, 5>; // 10
type A1 = Add<8, 20>; // 28
type A2 = Add<10, 30>; // 40
