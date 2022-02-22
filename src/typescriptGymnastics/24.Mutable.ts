// * 题目：实现一个 Mutable 工具类型，用于移除对象类型上所有属性或部分属性的 readonly 修饰符。
type Foo = {
  readonly a: number;
  readonly b: string;
  readonly c: boolean;
};

// *这样写是不对的  因为 [index in Exclude<keyof T, Keys>]: T[index]; 这一步并不会保留原本的 readonly，我们这样会修改属性原本的 readonly 这样是不对的.
type MutableError<T, Keys extends keyof T = keyof T> = {
  [index in Exclude<keyof T, Keys>]: T[index];
} & {
  -readonly [index in Keys]: T[index];
};

export type Mutable<T, Keys extends keyof T = keyof T> = {
  -readonly [index in Keys]: T[index];
  // TODO 这里是正确的 但是我有一个疑问，当这里的 Pick 替换为 { [P in Exclude<keyof T, Keys>]: T[P] } 后 反而再次错误了，但是这样与 Pick 源码几乎是一样的，可是还是没有保留 readonly 属性，期待以后进行解答
} & Pick<T, Exclude<keyof T, Keys>>;// *注意 这里也可也直接替换为 Omit<T, Keys> 也是正确的

// *看下面的例子就可以知道如何不修改属性原本的 readonly （可选属性应该也是适用的）
// !不够完整
type A = {
  [index in keyof Foo]: Foo[index];
}

const a: A = {
  a: 1,
  b: '1',
  c: true
};

a.c = false; // a.c 不能修改

// *不同点 in 'c' 而不是 keyof Foo
type A2<T extends keyof Foo> = {
  [index in T]: Foo[index];
}

const a2: A2<'c'> = {
  c: false
};
a2.c = true;// a2.c 可以修改

// *不同点  属性值的类型都手动设置为 boolean
type A3 = {
  [index in keyof Foo]: boolean;
}

const a3: A3 = {
  a: true,
  b: true,
  c: true
};

a3.c = false; // a3.c 不能修改

// !所以得出结论，要想保留属性原本的限制，重点就在于遍历属性这方面

const mutableFoo: Mutable<Foo, 'a'> = { a: 1, b: '2', c: true };

mutableFoo.a = 3; // OK
mutableFoo.b = '6'; // Cannot assign to 'b' because it is a read-only property.
