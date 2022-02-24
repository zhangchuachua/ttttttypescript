type Foo = {
  a: number;
  b?: string;
  c: boolean;
};

export type SetOptional<O, U extends keyof O> = Partial<Pick<O, U>> &
  Omit<O, U>;

// 测试用例
type SomeOptional = SetOptional<Foo, 'a' | 'b'>;

/*
 * type SomeOptional = {
 *   a?: number;
 *   b?: string;
 *   c: boolean;
 * }
 * */

const s: SomeOptional = {
  c: true,
};

const s2: SomeOptional = {
  a: 1,
  c: false,
};
