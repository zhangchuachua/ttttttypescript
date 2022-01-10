class Log<T> {
  // *对于静态方法不能使用泛型所以这里一加 static 就会报错，很好理解，static 不需要实例化就可以调用，但是 泛型 必须传入一个类型
  run(value: T): T {
    console.log(value);
    return value;
  }
}

// *泛型约束  下面这就叫泛型约束 T extends {length:number} 后 log 就只会接收有 length 属性的参数。
function log<T extends { length: number }>(val: T): T {
  console.log(val, val.length);
  return val;
}

log([12, 2, 3]);

// log(1); // 会报错，因为没有 length 属性

export {};
