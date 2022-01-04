interface StringArray {
  [x: number]: string;
}

// *数字也是可以当作索引的，所以这里的接口其实就相当于是字符串数组。
const a: StringArray = ['a', 'b', 'c', 'd'];

console.log(a);

// !情况比较多，比较复杂，在以后开发中进行扩充
interface Names {
  [x: string]: string; // !表示使用字符串类型来索引key，也就是所有的key的类型都是字符串；value的类型也是字符串，注意这样声明过后，就不能在声明其他类型的value了
  // * y: number; // *比如这里声明y为number，明显是不可以的，因为上面的签名已经包含了这个接口内的所有成员的，而且这个与定义先后没有关系， 就算这个 y:number 在前面也不可以。 所以如果还需要定义具体的类型，那么这个类型要与签名的类型互相包含。 具体的包含关系也不是很了解， 反正any一定包含其他的类型
  y: any; // *比如这里的y 类型为 any 包含 string
  // [z: string]: any; // *但是不能再次声明其他类型的签名了 比如这里会报错
  [z: number]: string; // *但是这里却没有问题。签名的类型为string，但是 key 的类型遍了，因为 number 最终都会被转成字符串类型，js中一向如此
  // [j: string]: string; // *会报错，属于重复声明了，不想上面那样key的类型变了。
}

// !还可以使用接口定义函数 之前一直没有见过这样的方式。
interface Add {
  (x: number, y: number): number;
}

const add: Add = (a, b) => a + b;

// *还可以定义混合类型的 interface
interface Lib {
  (): void;

  version: string;

  doSomething(): void;
}

// *这样的 interface 应该像下面一样进行使用
function getLib() {
  // 这里 ts 会报错，因为 Lib 还有 version 和 doSomething 属性和方法，但是这里的赋值并不能体现这一点。所以报错了
  let lib: Lib = (() => {}) as Lib;
  lib.version = '1.0';
  lib.doSomething = () => {
    console.log('do something');
  };
}

export {};
