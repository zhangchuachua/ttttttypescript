// * 实现 IndexOf 工具类型，用于获取数组类型中指定项的索引值。若不存在的话，则返回 -1 字面量类型。
import { IsEqual } from './11.IsEuqal';

type _IndexOf<A extends any[], Item, Arr extends any[] = []> = A extends [any, ...infer Rest]
  ? IsEqual<A[0], Item> extends true
    ? Arr['length']
    : _IndexOf<Rest, Item, [...Arr, A[0]]>
  : -1;
export type IndexOf<A extends any[], Item> = _IndexOf<A, Item>;

type Arr = [1, 2, 3, 4, 5]
type I0 = IndexOf<Arr, 0> // -1
type I1 = IndexOf<Arr, 1> // 0
type I2 = IndexOf<Arr, 3> // 2
