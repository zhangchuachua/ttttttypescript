// *Link: https://github.com/semlinker/awesome-typescript/issues/45
// *题目：实现一个 IsNever 工具类型，判断指定的类型是否为 never 类型
// *官方对应解释：https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#distributive-conditional-types

// *never应该没有子类型 所以应该可以直接 T extends never 但是这样是不对的 当 T = never 时, 根本就不会进入比较中，所以直接返回了 never 使用 [T] extends [never] 就直接变成了普通类型。
export type IsNever<T> = [T] extends [never] ? true : false;

type I0 = IsNever<never>; // true
type I1 = IsNever<never | string>; // false
type I2 = IsNever<null>; // false
type I3 = IsNever<any>

type ToArray<Type> = Type extends string ? Type[] : Type;

type A = ToArray<string | number>

type B = string extends string | number ? true : false;