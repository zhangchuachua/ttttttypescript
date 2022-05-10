## 手写源码

[题目来源](https://juejin.cn/post/6946022649768181774)

### 1. Promise
 
[_Promise](./_Promise/_Promise.js)

### 2. new

[_new](./_new/_new.js)

### 3. call apply bind 

[_call](./_call&_apply&_bind/_call.js)

[_apply](_call&_apply&_bind/_apply.js)

[_bind](_call&_apply&_bind/_bind.js)

### 4. curry

[curry](FP-函数式编程/curry/index.js)

### 纯函数

纯函数主要有两个性质：

1. 相同的输入一定会得到相同的输出
2. 没有任何可观察的副作用

副作用会让一个纯函数变得不纯；当纯函数依赖于外部状态时，就无法保证一定会得到相同的输出；假设一个纯函数依赖于外部的一个变量，当外部变量被隐式改变时，输出就会发生改变，导致函数不纯。