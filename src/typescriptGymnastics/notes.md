# typescript 体操

专门用于写一些高级类型, 比如使用 typescript 类型完成加法之类的, 虽然看着没啥用, 但是很考验对 typescript 的熟悉程度.

[体操前置知识](https://juejin.cn/post/7039856272354574372)

[体操题目](https://juejin.cn/post/7009046640308781063#heading-1)

[题目答案-github仓库](https://juejin.cn/post/7009046640308781063#heading-1)

## 类型中的循环

```ts
// ! ts 中没有循环，所以这里使用递归和判断来形成循环
type CreateArr<Len = 0, Ele = undefined, Arr extends Ele[] = []> = Arr['length'] extends Len ? Arr : CreateArr<Len, Ele, [Ele, ...Arr]>;

// !ts 中没有运算符，可以使用 length 来实现加法
type Add<X, Y> = [...CreateArr<X>, ...CreateArr<Y>]['length'];

// !同样的循环
type Repeat<Str extends string, N extends number, Arr extends Str[] = [], Res extends string = ''> = Arr['length'] extends N
  ? Res
  : Repeat<Str, N, [Str, ...Arr], `${Str}${Res}`>

const a: Add<100, 200> = 300;

const abc: Repeat<'abc', 3> = 'abcabcabc'
```

## 推断交叉类型

```ts
// !这里很重要，这里使用到了一个点 联合类型在 extends 时会自动分发， 比如说 'b' | 'd' extends 'a' | 'b' | 'c' 时其实相当于是： ('b' extends 'a' | 'b' | 'c') | ('d' extends 'a' | 'b' | 'c') 在高级类型中 Exclude， Extract 使用了这个方法
// TODO 当U = string | number 时 U extends U  就会变成  (string extends string | number) | (number extends string | number) 然后分别进入逻辑判断中 最终汇聚到 T 中，但是这里按我目前的理解，这里应该还是 string | number 不应该是 string & number 期待以后理解～ 答案： https://github.com/semlinker/awesome-typescript/issues/37 看答案里面的大佬评论 利用了函数参数类型逆变 逆变就是 父类型 变成 子类型 在 ./geekTimes/8.advanced_function_compatible.ts 中有介绍 https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html#type-inference-in-conditional-types 官方文档中也有介绍，目前只需要记住，***协变可以推断联合类型，逆变可以推断出交叉类型*** 就可以了
export type UnionToIntersection<U> = (U extends U ? (arg: U) => any : never) extends (arg: infer T) => any ? T : never;
// *再注意 一定要 U extends U ? (arg: U) => any : never 前后加 () 不然的话， never extends (arg: infer T) => any ? T : never; 就变成了一句语法了，见下面的 U2
export type UnionToIntersection2<U> = U extends U ? (arg: U) => any : never extends (arg: infer T) => any ? T : never;

type U0 = UnionToIntersection<string | number>; // never
type U1 = UnionToIntersection<{ name: string } | { age: number }>; // { name: string; } & { age: number; }
const u1: U1 = { name: 'zx', age: 99 };
type U2 = UnionToIntersection2<{ name: string } | { age: number }>;
const u2: U2 = (arg: { name: string }) => {
  console.log(arg);
}

```
