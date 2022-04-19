// !开始一直没有想到如何截取字符串， 没有想到使用 infer 临时变量就可以了！
type TrimRight<V extends string> = V extends ` ${infer R}` ? TrimRight<R> : V;
type TrimLeft<V extends string> = V extends `${infer R} ` ? TrimLeft<R> : V;

export type Trim<V extends string> = TrimLeft<TrimRight<V>>;

// 测试用例
const a: Trim<' semlinker '> = 'semlinker';
