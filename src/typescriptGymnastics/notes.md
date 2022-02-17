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

## 需要多加记忆和理解的

### **选出对象中指定类型的键名**

[选出对象指定类型的键名](4.ConditionalPick.ts)

### **推断交叉类型**

[逆变推断交叉类型](18.UnionToIntersection.ts)

```ts
// !这里很重要，这里使用到了一个点 联合类型在 extends 时会自动分发， 比如说 'b' | 'd' extends 'a' | 'b' | 'c' 时其实相当于是： ('b' extends 'a' | 'b' | 'c') | ('d' extends 'a' | 'b' | 'c') 在高级类型中 Exclude， Extract 使用了这个方法
// TODO 答案： https://github.com/semlinker/awesome-typescript/issues/37 看答案里面的大佬评论 利用了函数参数类型逆变 逆变就是 父类型 变成 子类型 在 ./geekTimes/8.advanced_function_compatible.ts 中有介绍 https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html#type-inference-in-conditional-types 官方文档中也有介绍，目前只需要记住:
//  TODO ***协变可以推断联合类型，逆变可以推断出交叉类型*** 就可以了  还不是很能理解  期待后续
export type UnionToIntersection<U> = (U extends U ? (arg: U) => any : never) extends (arg: infer T) => any ? T : never;
// *再注意 一定要 U extends U ? (arg: U) => any : never 前后加 () 不然的话， never extends (arg: infer T) => any ? T : never; 就变成了一句语法了，见下面的 U2
export type UnionToIntersection2<U> = U extends U ? (arg: U) => any : never extends (arg: infer T) => any ? T : never;

type U0 = UnionToIntersection<string | number>; // never
type U1 = UnionToIntersection<{ name: string } | { age: number }>; // { name: string; } & { age: number; }
const u1: U1 = { name: 'zx', age: 99 };
type U2 = UnionToIntersection2<{ name: string } | { age: number }>;
const u2: U2 = (arg: { name: string }) => {
  console.log(arg);
};

// !注意 要得出 交叉类型 还有一个重要的点，那就是 同一类型变量，多个候选
// *比如下面 同一类型变量 U ，多个候选：T21 的 string, number 然后加上逆变，将 string, number 汇聚成 string & number
type Bar<T> = T extends { a: (x: infer U) => void; b: (x: infer U) => void }
  ? U
  : never;
type T20 = Bar<{ a: (x: string) => void; b: (x: string) => void }>; // string
type T21 = Bar<{ a: (x: string) => void; b: (x: number) => void }>; // string & number

// *这就是为什么上面不能直接使用 下面的类型，因为缺少了一个要素，多个候选，虽然这里的 T 是联合类型，但是并没有对 T 进行分发，而 T extends 时会自动进行分发， 所以才有了上面的 T extends T
type CC<T> = ((arg: T) => any) extends ((arg: infer R) => any) ? R : never;// *这里得出的结果就是 T 本身

type C = CC<{a:number} | {b:boolean}>


// *再注意一个点，发现没有上面的 CC 中两个函数都是加了 () 这里与执行顺序有关，如果不加的话就会变成 (arg:T) => (any extends (arg:infer R) => any ? R : never) 这应该与关键字优先级无关，就是单纯的顺序问题， 因为 any extends 任何类型都为真 所以直接返回 R 但是 R 的类型 unknown 所以得出的结果就是  (arg: T) => unknown;
type DD<T> = (arg: T) => any extends (arg: infer R) => any ? R : never;

type D = DD<{a:number} | {b:boolean}>


```
