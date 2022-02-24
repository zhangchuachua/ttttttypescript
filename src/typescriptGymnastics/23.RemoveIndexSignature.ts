// ! ts 索引签名的类型只能为 string number symbol 所以只需要对这三种情况的签名进行过滤就可以了
interface Foo {
  [key: string]: any;

  [key: number]: any;

  [key: symbol]: any;

  bar(): void;
}

// *这道题需要除去所有的索引签名
export type RemoveIndexSignature<T> = {
  [index in keyof T as string extends index
    ? never
    : number extends index
    ? never
    : symbol extends index
    ? never
    : index]: T[index];
};

// *这里不能使用 Exclude 因为 Exclude 的源码是 type Exclude<T, U> = T extends U ? never : T; 但是这里的索引签名使用的是 string 这样会删除所有的 属性
export type RemoveIndexSignature2<T> = {
  [index in Exclude<keyof T, string | number | symbol>]: T[index];
};

type A = keyof Foo;

type FooWithOnlyBar = RemoveIndexSignature<Foo>; //{ bar: () => void; }
