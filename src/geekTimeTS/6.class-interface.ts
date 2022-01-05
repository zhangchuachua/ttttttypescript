// *这一节讲 class 与 interface 之间的联系
interface Human {
  // !新知识点，interface 里面可以声明一个 new ，注意这样声明并不是在这个对象里面有一个 new 函数，因为 new 是一个关键字，所以这样声明指的就是 constructor
  new (name: string): any;

  name: string;

  eat(): void;
}

// *class 可以使用 interface 进行实现，这个时候不叫继承，叫实现 需要使用 implements 关键字, 而且 interface 中所有的成员都必须要进行实现
class Asian implements Human {
  // *通过 interface 实现的 class 不能在 constructor 上使用 private 这样的修饰词，不然会被认为没有实现所有的成员
  // !如果 interface 中定义了 new 的话，那么实现这个接口的 class 就会报错，
  // !猜测一下 可能因为 interface 中的成员，全部都是 实例属性或方法， 但是 constructor 一直都是 原型方法，不符合 new 应该是实例方法的前提。 当 Asian 被 new 后 eat 就是实例方法了，所以不会报错 但是为什么下面的 const a: Human = class XX { 不会报错？
  // TODO 弄清楚 interface 中的 new; class 实现有 new 的 interface 时，究竟是为什么会报错，如果是上面的原因的话，为什么下面的赋值不会报错
  constructor(name: string) {
    this.name = name;
  }

  // *接口实现的 class 属性 只能是公有的 也就是 public 如果使用 private protected 都会报错 使用 readonly 不会报错
  readonly name: string;

  eat() {
    console.log('asian eat');
  }

  // *不能少，但是可以多
  sleep() {
    console.log('asian sleep');
  }
}

console.log(Asian.constructor);

// *搞不清楚这里为什么不会报错， 这里的 constructor 也是原型方法啊。 但是如果 eat 是静态方法（可以直接 a.eat() 调用） 就不会报错，
const a: Human = class XX {
  constructor(name: string) {
    this.name = name;
  }

  name: string;

  static eat() {
    console.log('1');
  }
};
console.log(a.prototype);

// *interface 可以继承 class
class Auto {
  state = 1;
  private state2 = 3;
}

// *interface 继承 class
interface AutoInterface extends Auto {
  state3: number;
}

// *这个时候，state 只需要类型为 number 就可以了，并不需要 值也等于 1
// *上面使用了 private 修饰词 这里的 C 就会报错，因为 这里的 C 并不能实现 Auto 的私有属性
class C implements AutoInterface {
  state: number = 2;
  private state2: number = 1;
  state3 = 1;
}

// !这一步也太魔幻了 不知道具体的解释是什么，我这里猜测一下：应该就是从左向右执行， Bus 首先继承于 Auto ，然后 Bus 还需要实现 AutoInterface 因为 Bus 继承于 Auto 所以已经有了 state ，然后再实现 AutoInterface 时，就不需要再声明 state 了，直接声明一个 state3 就可以了。 不清楚是不是这样  也有可能是 Auto 先实现 AutoInterface ? 是一个先后顺序的问题
// TODO 看一下这个网址 好像有类似的代码 https://blog.csdn.net/hd101367816/article/details/108813941
class Bus extends Auto implements AutoInterface {
  state3: number = 1;
}

const bus = new Bus();
console.log(bus.state, bus.state3);
export {};
