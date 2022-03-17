// *实现 StartsWith 工具类型，判断字符串字面量类型 T 是否以给定的字符串字面量类型 U 开头，并根据判断结果返回布尔值。
export type StartsWith<T extends string, U extends string> = T extends `${U}${any}` ? true : false;

type S0 = StartsWith<'123', '12'> // true
type S1 = StartsWith<'123', '13'> // false
type S2 = StartsWith<'123', '1234'> // false


// *实现 EndsWith 工具类型，判断字符串字面量类型 T 是否以给定的字符串字面量类型 U 结尾，并根据判断结果返回布尔值。
export type EndsWith<T extends string, U extends string> = T extends `${any}${U}` ? true : false;

type E0 = EndsWith<'123', '23'> // true
type E1 = EndsWith<'123', '13'> // false
type E2 = EndsWith<'123', '123'> // true
