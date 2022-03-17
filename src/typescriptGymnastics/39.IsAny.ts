// * 实现 IsAny 工具类型，用于判断类型 T 是否为 any 类型。
// * 使用 任何类型与 any 的交叉都等于 any 来进行判断。因为 1 & any = any; 1 & number = 1; 1 & other = never; 所以只有当 T = any 时才会返回true， 当然 这里也可以不使用 0 和 1，比如 '0', '1' 也是可以的。
export type IsAny<T> = 0 extends 1 & T ? true : false;

type I0 = IsAny<never> // false
type I1 = IsAny<unknown> // false
type I2 = IsAny<any> // true
