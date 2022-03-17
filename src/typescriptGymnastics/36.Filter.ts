// *题目: 实现一个 Filter 工具类型，用于根据类型变量 F 的值进行类型过滤。

type C<T extends any[]> = {
  [index in keyof T]: T[index]
}
type C0 = C<[6, 'lolo', 7, 'semlinker', false]>;
const c: C0 = [6, 'lolo', 7, 'semlinker', false];

// !注意这道题不能像下面这样做！！ 虽然可以直接在遍历键名的时候就进行判断，但是得出的结果是错误的。 比如 type F0 = Filter<[6, "lolo", 7, "semlinker", false], number>; 得出的结果是：{ 0: 6, 2: 7, length: 5 } 变成一个对象了。但是使用 C 遍历数组，却是没有一点问题，说明使用这样的方式遍历数组，不能对元素的长度进行操作。
type FilterError<T extends any[], F> = {
  [index in keyof T as T[index] extends F ? index : never]: T[index];
};

type F0 = FilterError<[6, 'lolo', 7, 'semlinker', false], number>; // [6, 7]
type F1 = FilterError<['kakuqo', 2, ['ts'], 'lolo'], string>; // ["kakuqo", "lolo"]
type F2 = FilterError<[0, true, any, 'abao'], string>; // [any, "abao"]

// !注意 有一个难点 any 在 extends 判断中放在左边时，会触发所有结果
export type Filter<T extends any[], F> = T extends [infer First, ...infer Rest]
  ? [First] extends [F] // !这里就是难点，因为 any 兼容所有类型，所以当 First extends F; First 是 any 时，会触发所有结果，即 any 可能满足这个条件，也可能不满足这个条件，很合理吧。 可以在下面的测试中看到. 这个其实就是因为 any 产生了分发，所以需要使用数组来禁止发生分发。
    ? [F, ...Filter<Rest, F>]
    : [...Filter<Rest, F>]
  : [];

type T0 = Filter<[6, 'lolo', 7, 'semlinker', false], number>; // [6, 7]
type T1 = Filter<['kakuqo', 2, ['ts'], 'lolo'], string>; // ["kakuqo", "lolo"]
// *如果上面没有没有进行限制的话，那么这里的结果就是 [any, 'abao'] | ['abao']
type T2 = Filter<[0, true, any, 'abao'], string>; // [any, "abao"]

type Test<T> = any extends T ? 'a' : 'b';
type TestNo<T> = [any] extends [T] ? 'a' : 'b';

// !可以发现下面的所有结果都是 'a' | 'b'
type Test0 = Test<number>
type Test1 = Test<null>
type Test2 = Test<string>
type Test3 = Test<boolean>
type Test4 = Test<{}>
type Test5 = Test<[]>
type Test6 = Test<undefined>
type Test7 = Test<never>
type Test8 = Test<any>

// !发现结果正常了不会进行分发了
type TestNo0 = TestNo<number>
type TestNo1 = TestNo<null>
type TestNo2 = TestNo<string>
type TestNo3 = TestNo<boolean>
type TestNo4 = TestNo<{}>
type TestNo5 = TestNo<[]>
type TestNo6 = TestNo<undefined>
type TestNo7 = TestNo<never>
type TestNo8 = TestNo<any>
