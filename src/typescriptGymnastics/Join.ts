// *在 9.JoinStrArray 中已经又类似的了，但是这里的 Join 做法更好

// * 这样的做法不够美观，需要加上  First extends number | string | null | bigint | undefined 因为 Arr extends [infer First, ...infer Rest] 为 true 时， First 的类型其实时 unknown 不能直接放到模板字符串中，所以需要再进行判断
// type Join<Arr extends any[], S extends string = ''> = Arr extends [infer First, ...infer Rest]
//   ? First extends number | string | null | bigint | undefined
//     ? Rest['length'] extends 0
//       ? `${First}`
//       : `${First}${S}${Join<Rest, S>}`
//     : ''
//   : '';

// *更推荐的做法  使用 Arr[0] 代替临时变量
export type Join<Arr extends any[], S extends string = ''> = Arr extends [unknown, ...infer Rest]
  ? Rest['length'] extends 0
    ? `${Arr[0]}`
    : `${Arr[0]}${S}${Join<Rest, S>}`
  : '';

type List = ['linux', 'windows', 'macos']

type A0 = Join<List, '😫'>
