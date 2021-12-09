// * 枚举分为数字枚举和字符串枚举

// 数字枚举，回自动进行递增的赋值;
// *当给一个数赋初始值时，之后的数会按照初始值递增 比如下面的 Maintainer 的值为 1000， 那么后面两个就会为 1001 1002
enum Role {
  Reporter,
  Developer,
  Maintainer = 1000,
  Owner,
  Guest,
}

/* 这是数字枚举类型的js写法，可以看到 Role 其实就是一个对象，但是他这里的赋值方式比较有意思
 * Role[Role["Maintainer"] = 1000] = "Maintainer"; 这一句，先执行的 Role["Maintainer"] = 1000 而且注意赋值操作，其实会返回值，也就是说这里赋值操作完成后，返回了 1000，可以去浏览器控制台试一下，每次赋值完成后都会自动打印值。所以这里不仅是 Role["Maintainer"] = 1000 还同时声明了 Role["maintainer"] = 1000
 * var Role;
 * (function (Role) {
 *     Role[Role["Reporter"] = 0] = "Reporter";
 *     Role[Role["Developer"] = 1] = "Developer";
 *     Role[Role["Maintainer"] = 1000] = "Maintainer";
 *     Role[Role["Owner"] = 1001] = "Owner";
 *     Role[Role["Guest"] = 1002] = "Guest";
 * })(Role || (Role = {}));
 * */

console.log(Role);

// 字符串枚举
enum Message {
  Success = 'success',
  Error = 'error',
}

/* 对于字符串枚举，没有像数字枚举那样反向映射。
 * var Message;
 * (function (Message) {
 *     Message["Success"] = "success";
 *     Message["Error"] = "error";
 * })(Message || (Message = {}));
 * */

console.log(Message);

// *一把来说枚举的值是不能进行修改的，作为常量使用
// Role.Maintainer = 10000; // error
enum Char {
  // 这三个是常量变量 会在编译阶段进行计算
  // 1. 默认值
  a,
  // 2. 已有枚举的引用
  b = Char.a,
  // 3. 一些表达式，正常计算的应该都算
  c = 1 + 3,
  //这些属于 computed number需要被计算的值  这些值会在程序执行时才进行计算
  // 比如这里调用方法
  d = Math.random(),
  // 这里调用属性
  e = '123'.length,
  // * f, // *计算值后面的属性都必须进行赋值了，如果没有手动赋值就会报错，因为ts不知道该如何自动赋值了。
}

/*
 * var Char;
 * (function (Char) {
 *     Char[Char["a"] = 0] = "a";
 *     Char[Char["b"] = 0] = "b"; // 在编译时就进行计算了
 *     Char[Char["c"] = 4] = "c"; // 在编译时就进行计算了
 *     Char[Char["d"] = Math.random()] = "d";
 *     Char[Char["e"] = '123'.length] = "e";
 * })(Char || (Char = {}));
 * */

console.log(Char); // 每一次打印 Char.d 的值都不一样，因为式随机数

// *这是一种特殊的枚举，常量枚举 把这一段复制到 playground 没有任何代码，说明并不会进入编译阶段。
const enum Month {
  Jan,
  Feb,
  Mar,
}

// *按照视频的说法，常量枚举，应该就是为了让代码更语义化，在一些特殊情况下可以用到：比如说不想要定义一个对象，但是需要使用枚举的情况
const arr = [Month.Jan, Month.Feb, Month.Mar];
/*
 * const arr = [0 /* Jan *\/, 1 /* Feb *\/, 2 /* Mar *\/]; // 在编译阶段，这里直接被替换为常量了。
 * */

// *枚举类型
enum E {
  a,
  b,
}

enum F {
  a,
  b,
}

enum G {
  a = 'a',
  b = 'b',
}

// *枚举可以作为类型给变量进行定义
const e: E = 213; // * E 就是枚举，这里定义为枚举类型，而且可以赋值为number，number的大小没有因为枚举内部成员进行限制。
const f: F = 0;
const e1: E = 0;
// console.log(e === f, e === e1); // *两个不同枚举类型之间不能进行比较，会报错。
const e2: E.a = 1; // *枚举下的成员也可以
const e3: E.b = 2;
// console.log(e2 === e3); // *而且同样不能进行比较。

// *这个东西也太骚了把  字符串枚举类型 的值，只能为字符串枚举的成员，不能是number，不能是string
const g1: G = G.a; // 这样才不会报错
console.log(g1); // 输出 a

export {};
