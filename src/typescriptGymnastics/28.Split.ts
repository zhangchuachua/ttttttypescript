// *题目：实现一个 Split 工具类型，根据给定的分隔符（Delimiter）对包含分隔符的字符串进行切割。可用于定义 String.prototype.split 方法的返回值类型。
type Item = 'semlinker,lolo,kakuqo';

// *下面是我的做法，虽然看着貌似没有错误，但是其实是不完全的，比如说 Split<'0', ''>结果为：['o', ''] 在 'o'.split('') 中得出的结果是 ['o']
export type Split<S extends string,
  Delimiter extends string,
  > = S extends `${infer R}${Delimiter}${infer X}`
  ? [R, ...Split<X, Delimiter>]
  : [S];

// *这下面是 gitHub 上的答案，这个答案与我的不同之处，在于当 S 为空时，会返回一个空数组, 也就相当于直接删除了最后一个空字符串，这样也不是正确的，例如 Split2<'o','o'> 得出的结果是 [''] 但是 'o'.split('o') 得到的结果时 ['','']; 而且对于这样的结果， Split2 总是会删除掉最后一个空字符串。
export type Split2<S extends string,
  Delimiter extends string,
  > = S extends `${infer Key}${Delimiter}${infer Rest}`
  ? [Key, ...Split2<Rest, Delimiter>]
  : S extends ''   /* 处理空字符串 */
    ? []
    : [S]

// *研究了一下 string.split() 的结果，发现 ''.split('') 得出结果为 [] 'o'.split('o') 得出结果为 ['',''] 'o'.split('') 结果为 ['o']
// *这是改良版后的 Split 经过下面的测试，基本完成了  其实经过上面的对 string.split() 的分析，很容易得出结论，那就是当 S 为空字符串时，去检查 Delimiter 是否也为空字符串，如果也为空字符串，那么就返回 [] 空数组，如果不是的话 就返回 [S]
export type Split3<S extends string, Delimiter extends string> = S extends `${infer Key}${Delimiter}${infer Rest}`
  ? [Key, ...Split3<Rest, Delimiter>]
  : S extends ''
    ? Delimiter extends ''
      ? []
      : [S]
    : [S];

// *也要注意下，这里的返回方式，split 每一步都会返回数组，所以就可以使用 ... 展开数组，这样就不必使用额外的数组变量进行循环了，直接使用递归进行循环，每一步的过程类似于 [key0, ...[key1, ...[key2, ...[key3]]]] 就可以得到一维数组， 开始还有点不理解

type ElementType = Split<Item, ','>; // ["semlinker", "lolo", "kakuqo"]
type A0 = Split<'o', ''>
type A1 = Split2<'o', 'o'>
type A3 = Split3<'', ''>
type B3 = Split3<'o', ''>
type C3 = Split3<'o', 'o'>
type D3 = Split3<Item, ','>
type E3 = Split3<Item, 'o'>
type F3 = Split3<Item, ''>
