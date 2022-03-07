// *题目：实现一个 ToNumber 工具类型，用于实现把数值字符串类型转换为数值类型。

// *TS 中不能直接进行类型转换，也不能直接进行数据计算，要想获得整数可以通过数组的 length ，然后通过循环来获得数组。
// !注意不能直接使用  T extends ${infer N} ? N : never 因为这样返回的 N 也是字符串不是数字类型
type ToNumber<T extends string, Arr extends T[]= []> = T extends `${number}`
  ? T extends `${Arr['length']}`
    ? Arr['length']
    : ToNumber<T,  [T, ...Arr]>
  : never;

type T0 = ToNumber<'0'>; // 0
type T1 = ToNumber<'10'>; // 10
type T2 = ToNumber<'20'>; // 20
