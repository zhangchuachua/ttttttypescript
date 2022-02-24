type Foo = {
  a: number;
  b: string;
};

type Bar = {
  b: number;
};

// *这样在 keyof 时 as 的写法 在 4.ConditionalPick 里第一次遇到，这个有兼容问题，需要一定版本的 ts
export type Merge<FirstType, SecondType> = {
  // *在这里直接对 index 进行判断，如果 index extends keyof SecondType 那么就直接返回 never 表示跳过这个属性
  [index in keyof FirstType as index extends keyof SecondType
    ? never
    : index]: FirstType[index];
} & {
  [index in keyof SecondType]: SecondType[index];
};

// *不适用 as 的做法，使用一个中间变量 排除两个类型交集的属性
type GetSecond<T, U> = {
  [index in keyof T]: index extends keyof U ? never : index;
}[keyof T];

export type Merge2<T, U> = {
  [index in GetSecond<T, U>]: T[index];
} & {
  [index in keyof U]: U[index];
};

// *还可以使用 Exclude
export type Merge3<T, U> = {
  [index in Exclude<keyof T, keyof U>]: T[index];
} & {
  [index in keyof U]: U[index];
};

// *还可以使用 Omit
export type Merge4<T, U> = Omit<T, keyof U> & {
  [index in keyof U]: U[index];
};

type A2 = Merge2<Foo, Bar>;
type A3 = Merge3<Foo, Bar>;
type A4 = Merge4<Foo, Bar>;
type B2 = Merge2<Bar, Foo>;
type B3 = Merge3<Bar, Foo>;
type B4 = Merge4<Bar, Foo>;

const ab: Merge<Foo, Bar> = { a: 1, b: 2 };
const a4: A4 = { a: 1, b: 2 };
const b4: B4 = { a: 1, b: '2' };
