// *除法

// * 与减法类似：x / y = z -->  x = z * y  .
import { Times } from './Times';
import { SmallerThan } from './34.SmallerThan';

type _Division<T extends number, R extends number, Arr extends T[] = [T]> = Times<Arr['length'], R> extends T
  ? Arr['length']
  : _Division<T, R, [...Arr, T]>;

export type Division<T extends number, R extends number> = SmallerThan<T, R> extends true
  ? never
  : R extends 0
    ? never
    : T extends 0
      ? 0
      : T extends R
        ? 1
        : _Division<T, R>;

const T1: Division<9, 3> = 3;
const T2: Division<9, 0> = 3;
const T3: Division<3, 3> = 1;
const T4: Division<0, 3> = 0;

