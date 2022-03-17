// *减法

import { CreateArr } from './CreateArr';
import { SmallerThan } from './34.SmallerThan';

//TODO 加减乘除操作都只是完成了针对于正整数的那部分，对于负数和小数不知道如何处理~。

// *减法的思路： x - y = z 所以 x = z + y ，所以先创建一个 y 长度的数组，然后循环以 1 为步长的数组，两个数组合并成一个新数组，每次都使用新数组的长度去与 x 比较，当相等时返回。
type _Minus<T extends number, R extends number, Arr extends any[] = [], RArr extends any[] = CreateArr<R>> = [...Arr, ...RArr]['length'] extends T ? Arr['length'] : _Minus<T, R, [...Arr, R], RArr>;

export type Minus<T extends number, R extends number> = SmallerThan<T, R> extends true ? never : _Minus<T, R>;

const T1: Minus<6, 3> = 3;
const T2: Minus<8, 3> = 5;
const T3: Minus<2, 0> = 2;
const T4: Minus<2, 2> = 0;
const T5: Minus<999, 3> = 996;
