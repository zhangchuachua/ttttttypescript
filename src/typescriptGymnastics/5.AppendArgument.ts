type Fn = (a: number, b: string) => number;
// *这里其实也可以使用 Parameters 与 ReturnType 解答 下面这个方法就相当于是这两个高级类型的结合。
// !注意 我开始的答案是  (...infer P) => infer R extends F ? (x: A, ...P) => R : any; 这样是不可以的！ 第一 infer 指定只能是类型，但是 ...infer P 这里其实是声明参数，所以必须修改为 ...args: infer P . 第二 应该是 F extends (...args: infer P) => infer R 而不是 (...args: infer P) => infer R extends F 这样的话 好像无法使用临时变量 P 与 R 具体原因还不清楚
export type AppendArgument<F, A> = F extends (...args: infer P) => infer R ? (x: A, ...args: P) => R : any;
// type AppendArgument2<F, A> = (...args: infer P) => infer R extends F ? (x: A, ...args: P) => R : any;

type FinalFn = AppendArgument<Fn, boolean>;
// (x: boolean, a: number, b: string) => number
