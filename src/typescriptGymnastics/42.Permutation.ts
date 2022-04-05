//* 实现一个 Permutation 工具类型，当输入一个联合类型时，返回一个包含该联合类型的全排列类型数组。
// TODO 未完成笔记
type IsNever<T> = [T] extends [never] ? true : false;

type Permutation<T extends  string | number | symbol> = {
  [index in T]: IsNever<Exclude<T,index>> extends true ? [index] : [index, ...Permutation<Exclude<T ,index>>]
}[T];
type PP = Permutation<'a'>
// ["a", "b"] | ["b", "a"]
type P0 = Permutation<'a' | 'b'>  // ['a', 'b'] | ['b' | 'a']
// type P1 = ["a", "b", "c"] | ["a", "c", "b"] | ["b", "a", "c"]
// | ["b", "c", "a"] | ["c", "a", "b"] | ["c", "b", "a"]
type P1 = Permutation<'a' | 'b' | 'c'>
