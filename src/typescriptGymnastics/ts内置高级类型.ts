//* 1. Partial 将类型里的所有属性变成可选的
type IPartial<T> = {
  [I in keyof T]?: T[I]
}

//* 2. Required 将类型里的所有属性变成必须的
type IRequired<T> = {
  [I in keyof T]-?: T[I]; // -? 就是去掉 ?
}

//* 3.Readonly 将类型的所有属性变成 只读的 也可以使用 -readonly 效果就是 将只读的变成不是只读的
type IReadonly<T> = {
  readonly [I in keyof T]: T[I] // *注意这里的 [I in keyof T]: T[I] 并不会将所有属性都变成必须的，这里会保持默认值，可选就是可选不会被修改
}

// *4. Record<K extends keyof any, T> 将 K 中所有属性的值转化为 T 类型
type IRecord<K extends keyof any, T> = {
  [P in K]: T;
};


// *7. Extract<T, U> extract 提取，从 T 中提取 U
type IExtract<T, U> = T extends U ? T : never;

const extract: IExtract<'a' | 'b' | 'c', 'b' | 'd'> = 'b';


// *8. Omit<T, K extends keyof any> Omit 的作用与 Pick 相反，从 T 中去掉 K 类型包含的属性。

// *使用这样的方式的话，是不可以的，对于枚举类型可以选择返回 never 表示删除，但是对于这种情况不能使用  这种方式想的是遍历 T 的属性，如果属于 K 那么就进行删除
// type IOmit<T, K extends keyof any> = {
//   [I in keyof T]: I extends K ? never : T[I]; never
// }

// *上面那种删除指定类型的方法不成功，这种就是选出可行的属性
type IOmit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>


interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

type TodoPreview = IOmit<Todo, "description">;

const todo: TodoPreview = {
  title: "Clean room",
  completed: false
};

// *9. NonNullable<T> 的作用是过滤掉 T 类型中的 null 以及 undefined 类型
type INonNullable<T> = T extends null | undefined ? never : T;

const nonNullable: INonNullable<'number' | 'string' | null | {} | undefined> = {};

interface A {
  b: number;
  c: string;
  d: {};
  e: null;
}

const aNonNullable: INonNullable<A> = {
  b: 0, c: "", d: {}, e: null
};

// *10. ReturnType<T> 的作用是 获取 T 函数类型的返回值类型
// *这里的理解可能有点困难， infer 专门用于声明一个 临时的类型  因为泛型只能使用在 <> 声明好了的类型，但是对于下面的函数,我们并不知道返回值的类型是什么，而且前 <> 并没有进行声明，所以可以使用 infer R 指定一个 临时类型，这个时候 这个 R 就是函数的返回类型。
// *这里的 T extends (...args: any[]) => any[] 是一个类型限制，限制 T 应当是一个函数。  然后后面大致意思就是  T 如果  extends (...args: any[]) => infer R 这个函数类型， 那么就返回 R 类型， 否则就返回 any 所以就可以函数的返回值类型了
type IReturnType<T extends (...args: any[]) => any> = T extends (...args: any[]) => infer R ? R : any;

const returnType: IReturnType<() => {}> = {};// * 这里的 () => {} 是一个类型 所以 {} 是一个 {} 类型 而不是函数体
