// *题目： 实现一个 RepeatString 工具类型，用于根据类型变量 C 的值，重复 T 类型并以字符串的形式返回新的类型。

// *这种方式虽然可以实现 但是我不喜欢  因为可以传入额外的泛型
export type RepeatString<T extends string,
  C extends number,
  Arr extends string[] = [T]> = C extends 0
  ? ''
  : Arr['length'] extends C
    ? Arr[0]
    : RepeatString<T, C, [`${T}${Arr[0]}`, ...Arr]>;

import { Repeat } from './31.Repeat';
import {Join} from './Join';


export type RepeatString1<T extends string, C extends number> = Join<Repeat<T, C>>

type S0 = RepeatString<'a', 0>; // ''
type S1 = RepeatString<'a', 2>; // 'aa'
type S2 = RepeatString<'ab', 3>; // 'ababab'
type A0 = RepeatString1<'a', 0>; // ''
type A1 = RepeatString1<'a', 2>; // 'aa'
type A2 = RepeatString1<'ab', 3>; // 'ababab'

