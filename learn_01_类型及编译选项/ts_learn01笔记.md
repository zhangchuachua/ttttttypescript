# ts重新学习笔记1

## ts官网 <https://www.typescriptlang.org/zh/docs/>

### 1. 搭建环境

1. 下载nodejs

2. 下载typescript `npm i typescript -g`

3. 使用初始化环境 命令行工具中输入`tsc --init`与`npm init`差不多的作用,会自动创建一个tsconfig.json

4. 编写代码

5. 手动编译 直接 `tsc index.ts` 就可以了

6. 自动编译 在vscode上终端->运行生成任务->tsc:监视 注意 只有使用 `tsc --init`才有任务列表

7. 修改tsconfig.json的配置:tsconfig.json具体每一项的配置看文档

### 2. 类型讲解

主要看ts文件

```ts
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

```

### 3. 编译选项

<https://blog.csdn.net/weixin_42185305/article/details/105652819>
按理来说json文件里面不能写注释 但是tsconfig.json可以写注释

1. 自动编译选项 `tsc xxx.ts -w` ts编译器就会自动监听该文件 然后进行编译

2. 自动编译整个项目 这个需要在有tsconfig.json文件的情况下才能使用 直接 `tsc` 会直接编译所有ts文件 那么 `tsc -w` 就会监视所有的ts文件,e 而且还会编译子目录下的所有ts文件

3. 其他的编译选项,这些编译选项都是放在tsconfig.json文件中的

    - include: 用来指定那些ts文件需要进行编译, `{ 'include':['./src/**/*'] }` **表示任意目录 *表示任意文件 这里就是表示src下的所有ts文件进行编译
    - exclude: 用来指定那些ts文件不编译,`{ 'exclude':['./src/hello/**/*'] }` 意思见上
    - extends: 定义被继承的配置文件 配置文件太复杂了 我不想写 就可以继承之前设置过的配置文件 `{ 'extends': './config/base' }`
      意思是当前配置文件会包含config目录下的base.json的所有配置信息
    - files: 指定需要被编译的ts文件的列表,文件少时才会使用 `{ 'files':[ 'base.ts', 'index.ts' ] }` 就会编译base,index,ts文件
    - compilerOptions: 这是最重要的，我们初始化的tsconfig.json就会有这个对象，上面的选项与compilerOptions痛击，这个对象是编译器的选项，
      是一个对象，包含了很多很多的子选项，具体的可以看tsconfig.json的初始化信息。
        - target：编译为什么版本的js，默认为es3兼容性好
        - module：使用怎样的模块化规则，比如commonjs，amd，es6，es2015 注意es2015=es6
        - lib: 这是一个数组，用来指定项目中需要什么库，比如dom，bom,webworker等都是js库
        - outDir：用来指定编译后文件的存放地址
        - outFile：将编译后的文件合并为一个文件，outFile就是指定输出文件的名字
        - allowJs：是否对js文件进行编译，当批量编译时，很可能选择到js文件，所以就有这个选项了
        - checkJs：是否检查js代码符合当前规范
        - removeComments：是否移除注释，默认为false comments注释 comment评论，注解
        - noEmit：不生成编译后的文件，默认为false emit发射，发出
        - noEmitOnError：当有错误的时候不生成编译后的文件，默认为false
        - alwaysStrict：这个属性与strict不一样！！看上面的编译选项详解，用来设置编译后的文件是否使用严格模式，视频中说的默认为false，
          但是我实际使用注释了alwaysStrict还是会加上严格模式，不知道是不是其他选项起作用
        - noImplicitAny：不要隐式any，any是ts一个类型，比如`let a;`这样a的类型就是any，这个选项用于设置不允许隐式any，如果有就会报错，
          比如在`function sum(a,b){ return a+b }` a,b都是隐式的any，就会报错 默认为false
        - noImplicitThis：不允许不明确类型的this，默认值为false，不是很理解
        - strictNullChecks：严格检查空值 当有一个数据可能为空时，但是还对他有一系列的操作，就会报错，因为数据为空的话进行操作很有可能报错，所以这里严格检查控制，默认为false不会严格检查
        - strict：所有严格检查的总开关， 默认为false 所以这里会导致alwaysStrict为true 找到原因，可以看tsconfig.json，在strict 下面的，就是它管理的
