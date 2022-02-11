// !这里很重要，这里使用到了一个点 联合类型在 extends 时会自动分发， 比如说 'b' | 'd' extends 'a' | 'b' | 'c' 时其实相当于是： ('b' extends 'a' | 'b' | 'c') | ('d' extends 'a' | 'b' | 'c') 在高级类型中 Exclude， Extract 使用了这个方法
// TODO 答案： https://github.com/semlinker/awesome-typescript/issues/37 看答案里面的大佬评论 利用了函数参数类型逆变 逆变就是 父类型 变成 子类型 在 ./geekTimes/8.advanced_function_compatible.ts 中有介绍 https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html#type-inference-in-conditional-types 官方文档中也有介绍，目前只需要记住，***协变可以推断联合类型，逆变可以推断出交叉类型*** 就可以了  还不是很能理解  期待后续
export type UnionToIntersection<U> = (U extends U ? (arg: U) => any : never) extends (arg: infer T) => any ? T : never;
// *再注意 一定要 U extends U ? (arg: U) => any : never 前后加 () 不然的话， never extends (arg: infer T) => any ? T : never; 就变成了一句语法了，见下面的 U2
export type UnionToIntersection2<U> = U extends U ? (arg: U) => any : never extends (arg: infer T) => any ? T : never;

type U0 = UnionToIntersection<string | number>; // never
type U1 = UnionToIntersection<{ name: string } | { age: number }>; // { name: string; } & { age: number; }
const u1: U1 = { name: 'zx', age: 99 };
type U2 = UnionToIntersection2<{name: string }| {age: number}>;
const u2:U2 = (arg: {name: string}) => {
  console.log(arg);
}
