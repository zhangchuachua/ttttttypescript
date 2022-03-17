# typescript 体操

专门用于写一些高级类型, 比如使用 typescript 类型完成加法之类的, 虽然看着没啥用, 但是很考验对 typescript 的熟悉程度.

[体操前置知识](https://juejin.cn/post/7039856272354574372)

[体操题目](https://juejin.cn/post/7009046640308781063#heading-1)

[题目答案-github 仓库](https://juejin.cn/post/7009046640308781063#heading-1)

## 类型中的循环

```ts
// ! ts 中没有循环，所以这里使用递归和判断来形成循环
type CreateArr<
  Len = 0,
  Ele = undefined,
  Arr extends Ele[] = []
> = Arr['length'] extends Len ? Arr : CreateArr<Len, Ele, [Ele, ...Arr]>;

// !ts 中没有运算符，可以使用 length 来实现加法
type Add<X, Y> = [...CreateArr<X>, ...CreateArr<Y>]['length'];

// !同样的循环
type Repeat<
  Str extends string,
  N extends number,
  Arr extends Str[] = [],
  Res extends string = ''
> = Arr['length'] extends N
  ? Res
  : Repeat<Str, N, [Str, ...Arr], `${Str}${Res}`>;

const a: Add<100, 200> = 300;

const abc: Repeat<'abc', 3> = 'abcabcabc';
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
export type UnionToIntersection<U> = (
  U extends U ? (arg: U) => any : never
) extends (arg: infer T) => any
  ? T
  : never;
// *再注意 一定要 U extends U ? (arg: U) => any : never 前后加 () 不然的话， never extends (arg: infer T) => any ? T : never; 就变成了一句语法了，见下面的 U2
export type UnionToIntersection2<U> = U extends U
  ? (arg: U) => any
  : never extends (arg: infer T) => any
  ? T
  : never;

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
type CC<T> = ((arg: T) => any) extends (arg: infer R) => any ? R : never; // *这里得出的结果就是 T 本身

type C = CC<{ a: number } | { b: boolean }>;

// *再注意一个点，发现没有上面的 CC 中两个函数都是加了 () 这里与执行顺序有关，如果不加的话就会变成 (arg:T) => (any extends (arg:infer R) => any ? R : never) 这应该与关键字优先级无关，就是单纯的顺序问题， 因为 any extends 任何类型都为真 所以直接返回 R 但是 R 的类型 unknown 所以得出的结果就是  (arg: T) => unknown;
type DD<T> = (arg: T) => any extends (arg: infer R) => any ? R : never;

type D = DD<{ a: number } | { b: boolean }>;
```

### **readonly, 可选等限制属性的遍历**

[去掉指定属性的 readonly](./24.Mutable.ts)

```ts
// * 题目：实现一个 Mutable 工具类型，用于移除对象类型上所有属性或部分属性的 readonly 修饰符。
type Foo = {
  readonly a: number;
  readonly b: string;
  readonly c: boolean;
};

// *这样写是不对的  因为 [index in Exclude<keyof T, Keys>]: T[index]; 这一步并不会保留原本的 readonly，我们这样会修改属性原本的 readonly 这样是不对的.
type MutableError<T, Keys extends keyof T = keyof T> = {
  [index in Exclude<keyof T, Keys>]: T[index];
} & {
  -readonly [index in Keys]: T[index];
};

export type Mutable<T, Keys extends keyof T = keyof T> = {
  -readonly [index in Keys]: T[index];
  // TODO 这里是正确的 但是我有一个疑问，当这里的 Pick 替换为 { [P in Exclude<keyof T, Keys>]: T[P] } 后 反而再次错误了，但是这样与 Pick 源码几乎是一样的，可是还是没有保留 readonly 属性，期待以后进行解答
} & Pick<T, Exclude<keyof T, Keys>>; // *注意 这里也可也直接替换为 Omit<T, Keys> 也是正确的

// *看下面的例子就可以知道如何不修改属性原本的 readonly （可选属性应该也是适用的）
// !不够完整
type A = {
  [index in keyof Foo]: Foo[index];
};

const a: A = {
  a: 1,
  b: '1',
  c: true,
};

a.c = false; // a.c 不能修改

// *不同点 in 'c' 而不是 keyof Foo
type A2<T extends keyof Foo> = {
  [index in T]: Foo[index];
};

const a2: A2<'c'> = {
  c: false,
};
a2.c = true; // a2.c 可以修改

// *不同点  属性值的类型都手动设置为 boolean
type A3 = {
  [index in keyof Foo]: boolean;
};

const a3: A3 = {
  a: true,
  b: true,
  c: true,
};

a3.c = false; // a3.c 不能修改

// !所以得出结论，要想保留属性原本的限制，重点就在于遍历属性这方面

const mutableFoo: Mutable<Foo, 'a'> = { a: 1, b: '2', c: true };

mutableFoo.a = 3; // OK
mutableFoo.b = '6'; // Cannot assign to 'b' because it is a read-only property.
```

### **判断类型是否为联合类型**

[25.isUnion](./25.IsUnion.ts)

```ts
// *题目：实现一个 IsUnion 工具类型，判断指定的类型是否为联合类型。

// !答案：
export type IsUnion<T, U = T> = T extends any
  ? [U] extends [T]
    ? false
    : true
  : never;
// !运用到的知识点： 联合类型在 extends 时会自动分发， 但是 [T] extends [U] 就变成了普通类型，不会自动分发。
// *假设 T = string | number 大致过程为：T extends any 时自动分发，变成了 string 与 number 然后 [U] extends [T] 就是 string | number extends string 这样得出的结论肯定是 false 然后就返回 true 了，这样的话 IsUnion<string> 就会返回 false 了
// ! 至于为什么 IsUnion<string | never> 与 IsUnion<string | unknown> 为什么为 false 是因为 string | never extends string 得出结果为 true 所以返回 false。 而 string | unknown extends unknown 得出结果也为 true 所以为 false。

// 这里webstorm 显示的是 false 其实为 true  一切以 typescript 的 playground 为准
type I0 = IsUnion<string | number>; // true
type I1 = IsUnion<string | never>; // false
type I2 = IsUnion<string | unknown>; // false
type I3 = IsUnion<string>;

const i0: I0 = false;

type A = string | unknown extends unknown ? true : false; // *一切值都可以赋给 unknown 所以 string | unknown extends unknown 为 true

type B = string | never extends string ? true : false; // *never 感觉根本不会进入到式子中去?
```


### **any 引起的分发**

[any引起的分发](./36.Filter.ts)

[判断是否是any](./IsAny.ts)

```ts
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
```
