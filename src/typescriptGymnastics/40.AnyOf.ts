// *实现 AnyOf 工具类型，只要数组中任意元素的类型非 Falsy 类型、 {} 类型或 [] 类型，则返回 true，否则返回 false。如果数组为空的话，则返回 false。
type Falsy = undefined | null | false | 0 | '' | void | never | [];

import { IsEqual } from './11.IsEuqal';

// *还算有点点麻烦，因为需要判断 {} 然而在ts中，除了 undefined 其他元素 extends {} 都为 true。 所以这里需要把 {} 提出来单独判断。
// *但是在js 中 [] {} 都为 true
export type AnyOf<T extends any[]> = T extends [infer First, ...infer Rest]
  ? IsEqual<First, {}> extends true
    ? AnyOf<Rest>
    : First extends Falsy
    ? AnyOf<Rest>
    : true
  : false;

type A0 = AnyOf<[]>; // false
type A1 = AnyOf<[0, '', false, [], {}]>; // false
type A2 = AnyOf<[1, '', false, [], {}]>; // true
