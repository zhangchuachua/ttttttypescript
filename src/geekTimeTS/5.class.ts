class Dog {
  private name: string;

  constructor(name: string) {
    this.name = name;
  }

  run() {
    console.log(this.name);
  }

  static eat() {
    console.log('eat');
  }
}

console.log(Dog.prototype); // 打印 {constructor: f, run: f} 说明 class 中的方法都是原型方法 但是属性都是实例属性
Dog.prototype.run(); // *所以这里可以直接进行执行  如果是 static 方法，可以不要 prototype 直接执行。
const dog = new Dog('wangfu');
console.log(dog);

class Husky extends Dog {
  // private color: string;// *这里就是被省去的 声明 的步骤
  // *ts 中可以给 constructor 加 private 那么这个 class 既不能 实例化 也不能 被继承， 那么同样的 protected 修饰词也是可以的  readonly 却不行，readonly 只能对属性成员，或者索引添加（这个索引是报错中提到的，暂时并不知道 ts class 中的索引）
  private constructor(name: string, private readonly color: string) {
    // !constructor 中的参数居然也可以添加修饰符，这样添加的话，就可以省去声明的步骤了。注意 readonly 的位置 在后面
    super(name);
    this.color = color;
  }
}

Husky.eat(); // *静态成员也可以被继承

// !抽象类：抽象类不能创造实例，只能被继承，抽象类中的方法也可以被继承，同时还可以声明抽象方法，有后代决定方法具体的实现。
// *抽象类的好处就是 抽离出一些事物的共性，利于代码的复用，而抽象方法很明显就是多态的表现了
abstract class Person {
  eat() {
    console.log('eat');
  }

  // *抽象方法
  abstract sleep(): void;
}

class Boss extends Person {
  // *抽象方法的具体实现，多态的展现
  sleep() {
    console.log('boss sleep');
  }
}

const boss = new Boss();
boss.eat();
boss.sleep();

// *视频的最后介绍了一种比较少见的类，目前还不知道其主要的用法
class WorkFlow {
  step1() {
    return this;
  }

  step2() {
    return this;
  }
}

class MyWorkFlow extends WorkFlow {
  next() {
    return this;
  }
}
// *因为三个方法都是返回 this 所以三个方法可以一直进行调用。 这里使用的应该都是 MyWorkFlow 的 this 因为 MyWorkFlow 继承了 WorkFLow 那么两个方法也就都继承了，所以这里执行 step1 step2 返回的 this 应该也是 MyWorkFlow 的，但是具体实现实在 WorkFlow
new MyWorkFlow().next().step1().next().step2();

export {};
