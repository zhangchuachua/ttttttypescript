type User = {
  id: number;
  kind: string;
};
// 为啥下面会报错
function makeCustomer<T extends User>(u: T): T {
  // Error（TS 编译器版本：v4.4.2）
  // Type '{ id: number; kind: string; }' is not assignable to type 'T'.
  // '{ id: number; kind: string; }' is assignable to the constraint of type 'T',
  // but 'T' could be instantiated with a different subtype of constraint 'User'.
  return {
    id: u.id,
    kind: 'customer',
  };
}

/*
 * 答案：T extends User，就代表 T 类型会有 User 的所有成员，而且这里使用范型，无法确定 T 的具体成员，所以就会报错。
 *     如果我们将返回 T 修改为 User 可以发现报错消失，说明 { id: u.id, kind: 'customer' } 是完全兼容 User 的（注意不要在意 id: u.id 这里其实无所谓，就是个障眼法。反正最后都只看类型）
 *     如果我们再往对象里面填充任意成员，可以发现报错依然存在，这就说明，因为使用范型无法确定 T 的准确类型，所以返回类型也就无法确定是否是 T 所以报错。
 *
 * 解决方案：
 *   1. return { ...u, id: u.id, kind: 'customer' } 这样以来返回的就是 T 类型了，因为 u 是 T ，返回的对象里面，有 u 的所有成员，这就是说当前返回的对象应该被 T 兼容。
 *   2. return { id: u.id, kind: 'customer' } as T 这里还是返回的 User 但是断言为 T
 *   3. 不定义返回类型，类型推导
 * */
