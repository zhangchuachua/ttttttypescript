// *函数柯里化
export type Curry<
  F extends (...args: any[]) => any,
  P extends any[] = Parameters<F>,
  R = ReturnType<F>
> = P extends [infer First, ...infer Rest]
  ? Rest['length'] extends 0
    ? F
    : (...args: [First]) => Curry<(...args: Rest) => R>// ! ts 中函数参数不能通过字符串拼接定义名称即 (`arg${P['length']}`) => any，但是可以使用 (...args: [First]) => any
  : F;

type F0 = Curry<() => Date>; // () => Date
type F1 = Curry<(a: number) => Date>; // (arg: number) => Date
type F2 = Curry<(a: number, b: string) => Date>; //  (arg_0: number) => (b: string) => Date
type F3 = Curry<(a: number, b: string, c: boolean, d: string[], e: number) => void>
