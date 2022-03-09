// *乘法

import {CreateArr} from './CreateArr';

type _Times<T extends number, R extends number, Arr extends any[] = [], N extends T[] = []> = N['length'] extends T ? Arr['length'] : _Times<T, R, [...Arr, ...CreateArr<R>], [T, ...N]>;

// *基本思路 乘法：m*n 可以转换为 m 个 n 但是不能直接 CreateArr<T,CreateArr<R>> 比如 CreateArr<2,CreateArr<2>> 得出的结果就是 [[undefined, undefined],[undefined,undefined]] 然后也没有很好的方法将它扁平化 所以就是用上面暗中方式，进行循环，创建一维数组。
export type Times<T extends number, R extends number> = T extends 0 ? 0 : R extends 0 ? 0 : _Times<T, R>;

//* 注意这里
type Test<T extends any[]> = keyof T;

const T1: Times<3, 6> = 18
const T2: Times<2, 5> = 10
const T3: Times<3, 1> = 3
const T4: Times<0, 1> = 0
let test1: Test<[1,2,3]> = 'length'; // *可以是属性
test1 = 'push'; // *可以是方法名
test1 = '0';
test1 = '1';
test1 = '2';
// test1 = '3'; // *可以是索引，并且不能超过最大索引
test1 = 4;// *可以是数字
