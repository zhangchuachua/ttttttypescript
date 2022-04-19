/**
 * 先补充一点 this 的知识： https://juejin.cn/post/6844903496253177863
 * 1. 在 es5 中，this 永远指向最后调用它的对象
 * 2. 箭头函数没有 this 直接继承当前对象的 this，箭头函数嵌套就一直向上查找
 * 3. 在非严格模式中，this 默认是指向 window, node 中指向 global, 严格模式中，默认指向 undefined
 * 4. 函数使用 apply, call, bind 可以改变当前函数的 this 指向，三种方法具体的区别具体见 MDN
 * 5. 箭头函数不能使用上面三种方法改变 this 指向，因为箭头函数没有 this 如果要改变箭头函数的 this 指向，可以改变当前继承的 this 的指向
 * 6. apply, call, bind 非严格模式下，第一个参数为 null, undefined 时，会将 this 指向 window, global。传入其他原始值时，会指向被包装后的值，比如说 a.call('123') 那么 this 指向 String{'123'} 大概就是 new String('123')
 * 7. 匿名函数: 浏览器下匿名函数 this 指向 window，但是在 node 下，使用 setTimeout 进行测试，无论是否严格模式，this都指向 Timeout
 * */
// *https://juejin.cn/post/6844903496450310157 讲述了 call 执行过程，apply 的执行过程，比较两者之间的性能
