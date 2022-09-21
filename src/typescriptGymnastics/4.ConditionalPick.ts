interface Example {
  a: string;
  b: string | number;
  c: () => void;
  d: {};
}

// !解法1:https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-1.html#key-remapping-in-mapped-types 使用了一个巧妙的 as 但是这样的用法是 ts 4.1 的新特性，所以4.1之前不能这样使用  这个 as 用于断言 I 而且还可以使用逻辑判断来进行断言，做这道题就很好做了
export type ConditionalPick<T, U> = {
  [I in keyof T as T[I] extends U ? I : never]: T[I];
};

// !解法2  这个解法可以兼容全部 ts 版本。这道题的难点就在于如何选出 类型对应的键名，所以这里定义了一个中间高级类型 PickKeys 用来选出指定键名。
type PickKeys<V, T> = {
  [K in keyof V]: V[K] extends T ? K : never; // *遍历 V 所有键名，然后对 V[K] 类型进行判断，如果 extends T 那么就返回 K 不然就返回 never 注意，这里返回的是 K 也就是键名，而不是当前键名的类型。
}[keyof V]; // !这里也很重要，这里可以得到当前 interface 的联合类型。 比如 interface A = { a:number, b: boolean, c: number | string }; A[keyof A] = number | boolean | string;

// *所以PickKeys<Example, string> 的结果就是 'a' | never， 因为返回的是键名 但是还有一个问题， string extends string | number 应该是 true 但是结果里面并没有 'b'
type a =  PickKeys<Example, string>;

export type ConditionalPick2<V, T> = {
  [K in PickKeys<V, T>]: V[K];
};

// 测试用例：
type StringKeysOnly = ConditionalPick<Example, string>;
//=> {a: string}

type StringKeysOnly2 = ConditionalPick2<Example, number>;

const string: StringKeysOnly = {
  a: '',
};

const string2: StringKeysOnly2 = {
  a: '2',
};