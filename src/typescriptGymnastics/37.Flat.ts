// *实现一个 Flat 工具类型，支持把数组类型拍平（扁平化）。

type _Flat<T extends any[], Arr extends any[] = []> = T extends [infer First, ...infer Rest]
  ? First extends any[]
    ? _Flat<Rest, [...Arr, ..._Flat<First>]>
    : _Flat<Rest, [...Arr, First]>
  : Arr;

export type Flat<T extends any[]> =  _Flat<T>;

type F0 = Flat<[]> // []
type F1 = Flat<['a', 'b', 'c']> // ["a", "b", "c"]
type F2 = Flat<['a', ['b', 'c'], ['d', ['e', ['f']]]]> // ["a", "b", "c", "d", "e", "f"]
