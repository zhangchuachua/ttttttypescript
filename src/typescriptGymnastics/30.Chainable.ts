// *题目：完善 Chainable 类型的定义，使得 TS 能成功推断出 result 变量的类型。调用 option 方法之后会不断扩展当前对象的类型，使得调用 get 方法后能获取正确的类型。  https://github.com/semlinker/awesome-typescript/issues/49
declare const config: Chainable;

type Simplify<T> = {
  [key in keyof T]: T[key];
}

// *原始 Chainable 类型
// type Chainable = {
//   option(key: string, value: any): any
//   get(): any
// }

// *一开始根本想不到怎么做，只看到了 option 可以链式调用，就知道 option 肯定会返回 Chainable 但是其他的根本找不到如何实现
export type Chainable<T = {}> = {// *知识点1：多次调用 option 需要将参数存储起来，所以这里声明一个泛型进行存储，可以在 option 中使用递归，不断传递已有的参数，存储起来
  // *知识点2：不能直接使用参数， 就对函数添加泛型，然后将参数类型设置为类型，就可以在接下来进行使用了
  option<K extends string, V extends any>(key: K, value: V): Chainable<Simplify<T> & {// *这里 Chainable 就是进入递归，然后传入的泛型不仅有之前的参数，还有现在新的参数
    // !知识点3：这里可以直接 P in K ,但是这里不能使用 `${K}` 也不能直接使用 K: V.
    // *还可以使用 as 直接赋值，比如 [P in keyof {K:K} as `${K}`]: V，使用 as 时只能这样，不能直接使用 [K as `${K}`] 目前见到的用法都是 in 时进行 as 的。
    [P in K]: V
  }>;
  get(): Simplify<T>;
}

type GetObj<K extends number, V extends any> = (key: K, value: V) => {
  [P in K]: V
}

type A = GetObj<1, 'zx'>

const result = config
  .option('age', 7)
  .option('name', 'lolo')
  .option('address', { value: 'XiaMen' })
  .get();

type ResultType = typeof result
// 期望 ResultType 的类型是：
// {
//   age: number
//   name: string
//   address: {
//     value: string
//   }
// }

