import { Split3 } from './28.Split';
// *题目：实现一个 ToPath 工具类型，用于把属性访问（. 或 []）路径转换为元组的形式。
type DeleteEmpty<T> = T extends '' ? [] : [T];
// *这下面是我的做法，看下来还是比较齐全了，可以看下面测试的例子的结果。
// !大概的思路为，从第一个 . 分成两半，然后对这两半分别再进行 递归操作。前一段的变量 Prev 中肯定没有 . 了 我们就只需要匹配 []，然后将 index 或 Key 拿出来就可以了，有点类似于分而治之了。 但是我这里与 lodash 的 toPath 还是有些不同， 比如 ToPath<'.'> 结果为 [] 但是 _.toPath('.') 结果为 ['','']; 因为我这里最后做了判断，S 为空的话，就返回空。不然的话在递归过程中会产生很多 "" 空字符串，因为 Prev 和 Next 都没有带走 . 这个点 所以有时在传递到下一层递归时，很容易是空字符串，如果依然返回空字符串错误会更明显。
// *其实我一开始并没有像现在这样 前后两段分开递归，而是先判断 [] 这样有一个弊端那就是当遇到 '.a[2]' 这样的参数时，结果为 ['.a', 2];
export type ToPath<S extends string> = S extends `${infer Prev}.${infer Next}`
  ? [...ToPath<Prev>, ...ToPath<Next>]
  : S extends `${infer Prev}[${infer KeyOrPath}]${infer Next}`
    ? KeyOrPath extends `'${infer Path}'`
      ? [...DeleteEmpty<Prev>, Path, ...ToPath<Next>]
      : KeyOrPath extends `"${infer Path}"`
        ? [...DeleteEmpty<Prev>, Path, ...ToPath<Next>]
        : [...DeleteEmpty<Prev>, KeyOrPath, ...ToPath<Next>]
    : S extends ''
      ? []
      : [S];

type GetKey<S extends string> = S extends undefined // *主要用于处理上一层 Next 为 '' 的情况
  ? []
  : S extends `${infer Prev}[${infer Key}]${infer Next}`
    ? Key extends `'${infer Path}'`
      ? [...DeleteEmpty<Prev>, Path, ...GetKey<DeleteEmpty<Next>[0]>]// *Prev 为空时很好处理，但是 Next 为空，又不想夺取判断 Next 是否为空就可以使用这样的方式，比判断 Next extends '' 简单得多
      : Key extends `"${infer Path}"`
        ? [...DeleteEmpty<Prev>, Path, ...GetKey<DeleteEmpty<Next>[0]>]
        : [...DeleteEmpty<Prev>, Key, ...GetKey<DeleteEmpty<Next>[0]>]
    : [S];

type Loop<Arr extends any[]> = Arr extends [infer First, ...infer Rest]
  ? First extends string
    ? [...GetKey<First>, ...Loop<Rest>]
    : [First, ...Loop<Rest>]
  : [];
// *其实要想实现 lodash 的 toPath 也算比较简单把，它的源码应该就是先使用 split('.') 分组，然后再提取 []  这下面就是我的实现
// !知识点1：注意泛型不能传递高级类型，比如 type Map<Arr extends any[], Handle> = Handle<Arr> 这样是不可以的。这个时候的 Handle 不能是一个高级类型，如果你想要传递这里的 GetKey 的话，那么必须传递 GetKey<S> 也就是说这里的 Handle 其实是 GetKey<S> 处理后的结果了。
// !知识点2：目前想要为空的话 只能传递一个空数组，然后进行展开 例如 [...[]] ，而且要想展开数组，必须在数组中才能展开， ...[] 这样是错误的，因为我想在 ...GetKey<DeleteEmpty<Next>[0]> 这一步给 GetKey 传递空，然后就不会进行操作，导致返回空字符串，于是我使用 ...GetKey<...DeleteEmpty<Next>> 然后报错了。   其实也很好理解，如果传递一个空，那么应该如何判断呢？ extends 谁呢？
export type ToPath2<S extends string> = Loop<Split3<S, '.'>>;


type C = GetKey<''>

type A0 = ToPath<'foo.bar.baz'> //=> ['foo', 'bar', 'baz']
type A1 = ToPath<'foo[0].bar.baz'> //=> ['foo', '0', 'bar', 'baz']
type A2 = ToPath<'foo[\'info\'].bar.baz'>
type A3 = ToPath<'foo["path"][1][2][3]'>
type A4 = ToPath<'.a[2]'>
type A5 = ToPath<'[2][1].a[1].[2].b.c.a[1]'>
type A6 = ToPath<'.'>


type B0 = ToPath2<'foo.bar.baz'> //=> ['foo', 'bar', 'baz']
type B1 = ToPath2<'foo[0].bar.baz'> //=> ['foo', '0', 'bar', 'baz']
type B2 = ToPath2<'foo[\'info\'].bar.baz'>
type B3 = ToPath2<'foo["path"][1][2][3]'>
type B4 = ToPath2<'.a[2]'>
type B5 = ToPath2<'[2][1].a[1].[2].b.c.a[1]'>
type B6 = ToPath2<'.'>
