'use strict';
// let a:number ; // 对变量类型进行定义
// a= 10
// let b= false // 定义的同时赋值 会自动进行定义类型
// 函数也要进行类型定义 如果没有类型 默认为any
// ts中函数会限制参数个数 传多传少都会报错  返回值也可以定义类型
// function sum(a:number,b):number{
//   return a+b
// }
// sum(11,5,5,6)
// 使用字面量进行类型声明
// let a:10 // 这里将a的类型声明为10 注意这里并没有赋值 只是类型声明 10 作为一个类型
// a=10  // 这里进行赋值 只能为10  a=11都会报错
// console.log(a);// 这里如果没有a=10的话  只能输出undefined 因为只是定义 没有赋值
// let a:number|string   // 联合声明
// let a;//  自动定义为any类型 但是少用any
// let a: unknown; // 当不知道类型时设置为unknown 不要设置为any  设置为unknown时也可以赋值任意类型
// let b: string
// a = '123'
// //* 一般情况来说unknown的变量不能赋值给准确类型的变量 如果要赋值需要判断
// //* 注意 目前测试很多判断都会报错 但是验证a的类型时不会报错
// if(typeof a==='string'){
//   b=a
// }
// 如果想不报错 需要使用类型断言  下面是两种写法
// b=a as string
// b = <string>a
/*
 * 如果函数没有限制返回类型  函数会自动判断返回的类型
 * */
// function fn(a: number) {
//     if (a) return true
//     else return '123'
// }
/*
 * void 表示返回值为空 返回undefined 或者不返回都不会报错  返回null会报错! 视频中没有报错
 * */
// function fn(): void {
//     return
// }
/*
 * 注意 never表示不能返回任何东西 而且不能将该函数执行到底  主要用来抛出错误
 * */
// 如果有其他的业务逻辑即使什么都不返回也会报错  A function returning 'never' cannot have a reachable end point.
// 表示返回never的函数不能有可到达的终点 不行执行到底
// function fn(): never {
// throw new Error('报错了')
// }
/*
 * object 如果单纯的只是确定类型为一个对象的话 那么给他赋值空对象 函数 数组都不会报错 因为js中这些都属于对象
 * */
// let a: object
// a = {}
// a = function () {
// }
// a = []
// 所以应该规定对象的形状  这里的? 表示可选属性
// let a: { name: string,age?:number }
// a = {name: 'zxx'}、
// 下面规定的 name为必需属性 然后可以有其他键名为字符串，简直为any类型的属性
// let a: { name: string, [propName: string]: any }
// a = {name: 'zhangxu', b: 123, c: true}
/*
 * Function类型 指定变量的类型为函数  但是与object一样 意义不大
 * */
// let a: Function
// a = function () {
// }
// 下面规定是一个函数  使用的箭头函数的方法 有两个参数为number类型 返回number类型
// let a: (n1: number, n2: number) => number
/*
 * Array类型  注意 let a:Array会报错 必须添加范型限制
 * */
// let a:[]
// let a:number[]
// let a: Array<number>
/*
 * 元组tuple 元组就是固定长度的数组
 * */
// let a: [string, string]  // 这里就固定了长度为2
// a = ['1', '2','3']
/*
 * 枚举enum 类型
 * */
// enum Gender { // 这里进行定义枚举类型
//     Male, // 注意 这里真的就只是赋值了一个0
//     Female = 2,// 可以手动赋值  如果还有下面的会进行递增
// }
// console.log(0 === Gender.Male)  // 这里会返回true
// enum Ok {
//     Ok1,
//     Ok2
// }
//
// console.log(Ok.Ok1 === Gender.Male) // 这里在ts会报错 但是编译后返回依然为true (ts即使编译为报错依然会进行编译)
// let a: { name: string, gender: Gender }
/*
 * & 表示同时 一般来说 都是下面这样使用
 * */
// let a: { name: string } & { age: number }  // 这里就规定了a由两个对象内的属性组成 后面学了接口很有用
// a = {name: 'zhangxu', age: 21}
/*
 * 类型别名  也就相当于可以自定义类型组合了
 * */
// type myType = string // 这里给string起了一个别名 后面就可以用这个别名代替string
// let a: myType
// a = '123'
