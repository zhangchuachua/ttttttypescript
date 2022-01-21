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
