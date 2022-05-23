# 手写 async-await

很早之前就听过 async-await 是 generator 函数的语法糖，但是因为一直不知道具体的实现过程，下面手动实现一下 async-await

## generator

首先需要了解 generator 函数，具体可以看阮大的[教程](https://wangdoc.com/es6/generator.html)

### generator 的声明

generator 函数与普通函数声明最大的不同在于它在 `function` 与函数名之间多了一个 * 号，* 号具体的位置没有规定，如下所示都可以成功声明一个 generator
函数，一般使用较多的是第一种方式：`function* func(){};`

```js
function* func() {
};

function* func() {
};

function* func() {
};

function* func() {
};
```

### generator 函数的返回值

generator 函数会返回一个*遍历器对象*。

```js
function* func() {
  console.log(1);
  yield 'hello';
  console.log(2);
  yield 'world';
  console.log(3);
  return 'return'
}

const f = func(); // 此时的 f 是一个遍历器对象，我们可以使用它的 `next` 方法

f.next() // *首先输出 1，然后此时的状态为 { value: 'hello', done: fasle };
f.next() // *首先输出 2，然后此时的状态为：{ value: 'world', done: false };
f.next() // *首先是输出 3，然后此时的状态为：{value: 'return', done: true };
f.next() // *此时的状态为：{ value: undefined, done: true };
f.next() // *此时的状态为：{ value: undefined, done: true };
```

可以发现 `f` 的第一次 `next` 先输出了 1，然后才改变了状态，这说明在 `func` 执行时，并没有执行内部的代码，而是直接返回了遍历器对象；

`f` 的第二次 `next` 先输出了 2 然后才改变了状态，这又说明，每一次遇到 `yield` 的时候，内部代码的执行都会被暂停，直到下一次 `next` 而且每次的 `value` 值都是 `yield` 的返回值。

第三次 `next` 先输出了 3 返回状态改变为 `{ value: 'return', done: true }` 此时的 `value` 就是 `func` 函数的返回值。经过测试，当没有返回值时，`value`
为 `undefined`

### yield 表达式

`yield` 只能用在 `generator` 函数中，用在其他地方都会报错

`generator` 函数返回的遍历器对象的逻辑如下：

1. 遇到`yield`表达式，就暂停执行后面的操作，并将紧跟在`yield`后面的那个表达式的值，作为返回的对象的`value`属性值。
2. 下一次调用`next`方法时，再继续往下执行，直到遇到下一个`yield`表达式。
3. 如果没有再遇到新的`yield`表达式，就一直运行到函数结束，直到`return`语句为止，并将 `return` 语句后面的表达式的值，作为返回的对象的 `value` 属性值。
4. 如果该函数没有 `return` 语句，则返回的对象的 `value` 属性值为 `undefined`。

在 generator 函数中，可以使用 `yield` 表达式来暂停代码的执行，上面的例子已经非常清楚了。但是有一个注意的点：**`yield` 后面的代码并不是立即执行，而是执行到 `yield` 暂停时才会去执行后面代码**

```js
function* gen() {
  yield  123 + 456;
}

const g = gen();
g.next() // { value: 579, done: true }
```

上面的代码中，在执行 `gen()` 并没有计算 `123 + 456` 而是 `g.next()` 遇到 `yield` 时才去进行计算。

下面是使用 `generator` 函数改写 `for-of` 循环，使其可以遍历嵌套数组的例子：

```js
var arr = [1, [[2, 3], 4], [5, 6]];

var flat = function* (a) {
  var length = a.length;
  for (var i = 0; i < length; i++) {
    var item = a[i];
    if (typeof item !== 'number') {
      yield* flat(item);// *这里 * 号的使用后续会讲
    } else {
      yield item;// 使其 value 值为当前的 item
    }
  }
};

// *for-of 循环就是输出当前的 value，并且自动调用 next
for (var f of flat(arr)) {
  console.log(f);
}
// 1, 2, 3, 4, 5, 6
```

**注意**：`for-of` 循环不会打印 `done` 为 `true` 的 `value` 值

另外，`yield` 表达式如果用在另一个表达式之中，必须放在圆括号里面。

```js
function* demo() {
  // console.log('Hello' + yield); // SyntaxError
  // console.log('Hello' + yield 123); // SyntaxError

  console.log('Hello' + (yield)); // OK
  console.log('Hello' + (yield 123)); // OK
}
```

`yield` 表达式用作函数参数或放在赋值表达式的右边，可以不加括号。

```js
function* demo() {
  foo(yield 'a', yield 'b'); // OK
  let input = yield; // OK
}
```

### next 方法的参数

`next` 方法可以传入参数，并且这个参数会作为 `yield` 的表达式的返回值，比如下面的例子：

```js
function* foo(x) {
  var y = 2 * (yield (x + 1));// yield 在表达式中，必须使用括号包裹
  var z = yield (y / 3);
  return (x + y + z);
}

var a = foo(5);// *这里传入参数 5
a.next() // *内部代码开始执行，遇到 yield 暂停，x = 5，yield (x+1) 自然 value = 6，Object{value:6, done:false} 
a.next() // *执行到下一个 yield，此时我们要知道 y 的值，y 是上个 yield 的返回值 * 2，然是上个 next 没有传入参数，所以 yield 的返回值是 undefined 所以 y = 2 * undefined = NaN，所以这里的结果是：Object{value:NaN, done:false}
a.next() // *这里同理，上个 next 也没有传入参数，所以上个 z 是undefined，5 + NaN + undefined 得到的结果：Object{value:NaN, done:true}

var b = foo(5); // *分析就如上所示
b.next() // { value:6, done:false }
b.next(12) // { value:8, done:false }
b.next(13) // { value:42, done:true }
```

### Generator.prototype.throw

Generator 函数返回的遍历器对象都有一个 throw 方法可以在函数体外抛出错误，然后在函数体内捕获错误。例如：

```js
var g = function* () {
  try {
    yield;
  } catch (e) {
    console.log('内部捕获', e);
  }
};

var i = g();
i.next();// 执行到 yield

try {
  // !按理来说被抛出错误后就应该进入 catch 模块了，不会在 try 中，了，但是下面的结果输出依旧是 内部捕获 a，外部捕获 b
  i.throw('a');// !注意，这里抛出错误，在 g 函数内部的 catch 中捕获，但是并没有进入外部的 catch 中，所以才会执行下面那句代码
  i.throw('b');// !执行这行代码时，已经进入内部的 catch 了，也就是说 catch 已经执行过了，所以就不会执行内部的 try-catch 了，于是就将该错误继续抛出，于是在外部的 try-catch 中进行捕获
} catch (e) {
  console.log('外部捕获', e);
}
// *打印结果
// 内部捕获 a
// 外部捕获 b
```

> **注意**：`Generator.prototype.throw()` 与 `throw` 是不一样的，前面的那个，可以触发 `generator` 内部的 `try-catch`
> 但是的那个不会触发函数体内部的 `try-catch`

`Generator.prototype.throw` 方法要被函数体内部的 `try-catch` 捕获的话，那么必须至少执行一次 `next` ，例如：

```js
function* gen() {
  yield 123;
  try {
    yield 1;
  } catch (e) {
    console.log('内部捕获');
  }
}

var g = gen();
g.throw(1);
// *直接报错，没有被捕获，而是直接在外部抛出
// Uncaught 1
```

其实非常好理解，没有执行 `next` 就相当于没有启动内部的代码，此时调用 `throw` 自然不会进入内部的 `try-catch`。

`throw` 方法被捕获后，会附带执行下一条 `yield` 代码，也就是说附带执行一次 `next` 方法，那么可以把 `throw` 看作特殊的 `next`, 例如：

```js
var gen = function* gen() {
  try {
    yield console.log('a');
  } catch (e) {
    // ...
  }
  yield console.log('b');
  yield console.log('c');
}

var g = gen();
g.next() // a
g.throw() // !抛出错误的后，还打印了 b 说明执行到了第二个 yield
g.next() // c
```

**注意**：`Generator.prototype.throw` 抛出的错误，如果没有被内部捕获，那么这个 `generator` 函数就不会再执行下去了，即使并没有执行完成，如果再调用 `next`
那么状态为 `{ value: undefined, done: true }` 例如：

```js
function* g() {
  yield 1;
  console.log('throwing an exception');
  throw new Error('generator broke!');
  yield 2;
  yield 3;
}

function log(generator) {
  var v;
  console.log('starting generator');
  try {
    v = generator.next();
    console.log('第一次运行next方法', v);
  } catch (err) {
    console.log('捕捉错误', v);
  }
  try {
    // !注意，就是这个 next 引起了 throw new Error() 相当于在 next() 内部抛出了错误，所以就不会顺利执行到 yield 返回，所以直接进入 catch 打印出来的 v 还是 1 并不是 2
    v = generator.next();
    console.log('第二次运行next方法', v);
  } catch (err) {
    console.log('捕捉错误', v);
  }
  try {
    v = generator.next();
    console.log('第三次运行next方法', v);
  } catch (err) {
    console.log('捕捉错误', v);
  }
  console.log('caller done');
}

log(g());
// *下面是执行的打印结果
// starting generator
// 第一次运行next方法 { value: 1, done: false }
// throwing an exception
// !捕捉错误 { value: 1, done: false }  注意此时的 v 还是 1 并不是 2
// *第三次运行next方法 { value: undefined, done: true } 因为抛出的错误没有在内部捕获，所以认为遍历器已经遍历完成了，所以这里返回 {value: undefined, done: true}
// caller done
```

### Generator.prototype.return 方法

这个方法就相当于函数体内的 `return` 可以用于提前结束 `Generator` 函数，传入的参数可以作为返回值，如果没有传入参数，那么返回 undefined 例如：

```js
function* gen() {
  yield 1;
  yield 2;
  yield 3;
}

var g = gen();

g.next()        // { value: 1, done: false }
g.return('foo') // *在这里相当于在第一次 yield 后添加了一个 return，提前结束 generator 函数了，此时传入的参数 foo 就变成了此时的 value： { value: "foo", done: true }
g.next()        // { value: undefined, done: true }
```

如果 `Generator` 函数内部有 `try...finally` 代码块，且正在执行 `try` 代码块，那么 `return()` 方法会导致立刻进入 `finally` 代码块，执行完以后，整个函数才会结束。例如：

```js
function* numbers() {
  yield 1;
  try {
    yield 2;
    yield 3;
  } finally {
    yield 4;
    yield 5;
  }
  yield 6;
}

var g = numbers();
g.next() // { value: 1, done: false }
g.next() // { value: 2, done: false }
g.return(7) // *到这里就直接进入 finally，而且也自动触发了一次 next 所以才会输出: { value: 4, done: false }
g.next() // { value: 5, done: false }
g.next() // { value: 7, done: true }
```

在代码中可以看到，`return` 也会自动触发一次 `next` 所以，`return` 应该也可以看成一种特殊的 `next`。

### yield* 表达式

这个表达式，在 `yield` 表达式 中出现过，其实很明显，当 `yield` 后面的结果是一个遍历器时，那么就可以使用到 `yield*` 表达式，例如：

```js
function* bar() {
  yield 'x';
  yield* foo();// !foo 返回一个遍历器，所以使用 yield* 。如果这里不使用 yield* 而是只使用 yield 那么这里返回的是一个 遍历器对象
  yield 'y';
}

// 等同于
function* bar() {
  yield 'x';
  yield 'a';
  yield 'b';
  yield 'y';
}

// 等同于
function* bar() {
  yield 'x';
  for (let v of foo()) {
    yield v;
  }
  yield 'y';
}

for (let v of bar()) {
  console.log(v);
}
// "x"
// "a"
// "b"
// "y"

// !如果上面使用的不是 yield* 那么输出的结果应该是
// "x"
// *foo { <suspended> } 
// "y"
```

因为 `yield*` 后面的值主要是遍历器，那么只要 `yield*` 后面的值支持遍历器接口，那么都应该可以使用 `yield*`，例如：

```js
function* gen() {
  yield* ["a", "b", "c"];
}

gen().next() // { value:"a", done:false }

function* gen() {
  yield* 'string';
}

gen().next(); // { value: "s", done: false }
```

如果被代理的 Generator 函数有return语句，那么就可以向代理它的 Generator 函数返回数据。例如：

```js
function* foo() {
  yield 2;
  yield 3;
  return "foo";
}

function* bar() {
  yield 1;
  var v = yield* foo();
  console.log("v: " + v);
  yield 4;
}

var it = bar();

it.next()
// {value: 1, done: false}
it.next()
// {value: 2, done: false}
it.next()
// {value: 3, done: false}
it.next();
// "v: foo"
// {value: 4, done: false}
it.next()
// {value: undefined, done: true}
```

再看一个例子：

```js
function* genFuncWithReturn() {
  yield 'a';
  yield 'b';
  return 'The result';
}

function* logReturned(genObj) {
  let result = yield* genObj;
  console.log(result);
}

[...logReturned(genFuncWithReturn())]
/***
 * 分析,为什么会先打印 'The result' 才得到数组
 * *首先执行 genFuncWithReturn 返回一个遍历器 iter
 * *然后执行 logReturned 并且将 iter 作为参数传入，传入后将返回值传递给 result 然后打印 result
 * *最后才是 展开运算符，展开 logReturned 返回的遍历器，应该是 'a', 'b'
 */
// *The result
// *值为 [ 'a', 'b' ]
```

### 作为对象属性的 Generator 函数

如下:

```js
const obj = {
  * gen1() {

  },
  gen2: function* () {

  }
}
// *上面两种方式完全等价
```

### Generator 函数中的 this

Generator 函数总是返回一个遍历器，ES6 规定这个遍历器是 Generator 函数的实例，也继承了 Generator 函数的 `prototype` 对象上的方法。

```js
function* g() {
}

// *向 g 的原型链上挂在方法
g.prototype.hello = function () {
  return 'hi!';
};

// *得到遍历器
let obj = g();

obj instanceof g // *输出 true，证明遍历器是 g 的实例
obj.hello() // 'hi!' 也可以访问到原型链上的方法
```

上面代码表明，Generator 函数`g`返回的遍历器`obj`，是`g`的实例，而且继承了`g.prototype`。但是，如果把`g`当作普通的构造函数，并不会生效，因为`g`返回的总是遍历器对象，而不是`this`对象。

```js
function* g() {
  console.log(this);// !注意这里的 this 指向与普通函数的 this 指向一致 
  this.a = 11;
}

// 返回遍历器
let obj = g();// *这里的 g 相当于是 window.g() 所以 g 中的 this 应该指向 window
obj.next();
obj.a // *undefined  这里是 undefined 的原因是，当前 g 内部的 this 指向 window，应该是 window.a = 11, 但是这里返回的却是遍历器对象，所以是 undefined
```

Generator 函数也不能跟 `new` 一起使用，会报错。

```js
function* F() {
  yield this.x = 2;
  yield this.y = 3;
}

new F()
// TypeError: F is not a constructor
```

有什么办法可以 Generator 函数返回一个正常的对象实例，既可以使用 next 方法，又可以获得正常的 `this`，很简单，只需要使用 `call` 改变 `this` 的指向就可以了

如果想使用 `new` 呢, 因为 Generator 函数没有构造函数，不能直接 `new` 所以需要使用一个函数进行包装，包装的同时将 `this` 指向修改为 generator 函数的原型链即可。

```js
function* gen() {
  this.a = 1;
  yield this.b = 2;
  yield this.c = 3;
}

// *使用构造函数包裹
function F() {
  // *修改 this 指向
  return gen.call(gen.prototype);
}

// *还记得 new 的原理吗？
// 第一步，创建空对象 obj
// 第二步，将 obj 的 __proto__ 赋值为 构造函数的原型链
// 第三步，使用 obj 作为 this，执行构造函数
// *第四步，如果构造函数返回的不是对象，那么就返回 obj，如果是对象就返回该对象。 因为 F 返回了一个遍历器对象，所以这里返回的是遍历器对象
var f = new F();

f.next();  // Object {value: 2, done: false}
f.next();  // Object {value: 3, done: false}
f.next();  // Object {value: undefined, done: true}

f.a // 1
f.b // 2
f.c // 3
```

### Generator 的上下文

js 的执行期上下文相对来说比较熟悉了，但是 Generator 函数的上下文与普通函数的执行期上下文完全不一样。

普通函数的执行时，是按照执行顺序放进了一个堆栈里面，奉行**先进后出**的规律。Generator 函数不是这样，它执行时产生的上下文，一旦遇到 `yield`
命令，就会暂时退出堆栈，但是不会销毁这个堆栈，暂时冻结里面所有的对象和变量。等到它再次执行 `next` 时，这个上下文又会重新加入调用栈，冻结的变量和对象恢复执行。

```js
function* gen() {
  yield 1;
  return 2;
}

let g = gen();

console.log(
  g.next().value,
  g.next().value,
);
```

上面代码中，第一次执行`g.next()`时，Generator 函数gen的上下文会加入堆栈，即开始运行gen内部的代码。等遇到`yield 1`时，gen上下文退出堆栈，内部状态冻结。第二次执行`g.next()`
时，gen上下文重新加入堆栈，变成当前的上下文，重新恢复执行。

### 其他

Generator 函数的应用，及其异步应用，在这里没有列出来，感兴趣可以去看看。

Generator 函数的异步应用其实并不像 `async-await` 那样等待异步完成，而是将异步函数包装成 `Thunk` 或 `Promise` 使用回调函数或 `then` 然后使用执行器，自动调用 `next`
函数，最后完成异步任务。

## async-await

先来学习一下 async-await 的一些不知道的基础用法和语法

### 基础用法

`await` 后面接 `Promise` 时，必须等该 `Promise` 状态变为 `fulfilled` 或 `rejected` 才会执行下一句代码 （这一条也适用于所有 `Promise`）

为什么需要记这一条呢？因为开始以为，只要 `Promise` 内部代码执行完成，状态就会变为 `fulfilled` 这是不对的，需要在 `Promise` 中显式的调用 `resolve` 或 `reject` 才能够改变其状态。

```js
async function name() {
  const c = await new Promise(() => {
    return '123';// *因为并没有执行 resolve， reject 所以该 Promise 状态不会改变，这里的 return 没有意义
  })
  // *这里不会执行
  console.log(c);
}

async function name() {
  const c = await new Promise(function (resolve, reject) {
    resolve(213)// *状态改变为 fulfilled
  }).then((data) => data);
  console.log(c)// *打印 213 
}

name();
```

当 `await` 后面是原始类型时，会将原始类型包装成 `Promise.resolve(?) `

为什么会记录这条呢？一开始读到这句话，一直以为是将 `await 123` 的返回值包装成 `Promise` 对象，但是后来才想到，是先将 `123` 包装成 `Promise.resolve(123)`
然后使用 `await Promise.resolve(123)` 直接返回 `123`

```js
async function name() {
  const c = await 123;
  console.log(c);// *这里会打印 123
}

name();
```

当 `await` 后面是 `thenable` 对象时，会将其看待成 `Promise` 去执行它的 `then` 方法。

为什么记录这条呢？手写的 `Promise` 已经忘记很多了，不清楚对于 `thenable` 对象是如何执行的，因为 `Promise` 源码中也有对 `thenable` 对象的处理。

```js

async function name1() {
  const c = await {
    then(resolve, reject) {
      return '123'
    }
  }
  console.log(c);// *这里不会执行
}

async function name2() {
  const c = await {
    then(resolve, reject) {
      resolve(3)
    }
  }
  console.log(c);// *打印 3
}

/***
 * 为什么上面的 console.log(c) 不会执行，下面的 console.log(c) 执行了呢
 * !await 对于 thenable 对象，也会将其视为 Promise 对象处理。
 * !Promise 对象中对于 thenable 对象，其实很简单，就是直接将 then 方法拿出来，并且进行执行。这一段在 resolveProsmie 函数中
 * !但是要注意一个点，我们平常使用的 Promise.resolve(123).then(()=>{},()=>{}) 这里的 then 是在执行，然后传入了两个方法也就是 onFulfilled, onRejected 也就是说，我们只是传入回调，对 then 内部的实现并不清楚，传入的参数如果有返回值，那么也是 onFulfilled 的返回值，而不是 then 函数的返回值。
 * !所以说，上面 then 执行后的返回值，我们根本不在乎，我们在乎的是 onFulfilled, onRejected 的执行。因为 onFulfilled, onRejected 的执行可以改变状态。
 *
 *
 * !但是再注意,这只是一个 thenable 对象,并不是 Promise 对象,应该没有状态可言，而且根据 Promise 源码，如果没有经过 then 那么就根本不会进入 resolvePromise 函数，就更别说针对 thenable 对象进行处理了。
 * !我更倾向于， await 将 thenable 对象也也包装成了一个 Promise.resolve(thenable) 因为查看手写的源码可以发现，Promise.resolve() 传入一个 thenable 时，等于 new Promise(thenable.then) 。这样解释目前来看更解释得通。
 */
```

`await` 可以直接获得其 `value` 或抛出其 `reason`

```js
async function name() {
  const c = await new Promise((resolve) => {
    resolve(3)
  })
  console.log(c); // *打印 3
}

// *为什么上面那里只有 resolve，没有 then 没有 return 依然会打印 3 呢？这里应该是 await 的特性，经过测试如果只是 new Promise((resolve) => { resolve('value') }) 并不会直接返回其值，但是 await 却可以。这里其实与 name2 中类似，name2 中也只是 resolve 并未 return。
// *await直接获取了状态为 fulfilled 的 Promise 的 value

async function reject_test() {
  await Promise.reject('内部报错')
}

reject_test()
  .then(data => console.log(data))
  .catch(e => console.log(e));// !打印 内部报错 

// *这里与上面也是类似的，明明没有抛出错误，但是外部依然可以捕获错误。
// *await 直接获取了状态为 rejected 的 Promise 的 reason

// *在 async-await 源码中应该有实现
```