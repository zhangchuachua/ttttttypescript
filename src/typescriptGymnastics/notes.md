# typescript 体操

专门用于写一些高级类型, 比如使用 typescript 类型完成加法之类的, 虽然看着没啥用, 但是很考验对 typescript 的熟悉程度. 

[体操前置知识](https://juejin.cn/post/7039856272354574372)

[体操题目](https://juejin.cn/post/7009046640308781063#heading-1)

[题目答案-github仓库](https://juejin.cn/post/7009046640308781063#heading-1)

## 类型中的循环

```ts
// ! ts 中没有循环，所以这里使用递归和判断来形成循环
type CreateArr<Len = 0, Ele = undefined, Arr extends Ele[] = []> = Arr['length']  extends Len ? Arr : CreateArr<Len, Ele, [Ele, ...Arr]>;

// !ts 中没有运算符，可以使用 length 来实现加法
type Add<X,Y> = [...CreateArr<X>, ...CreateArr<Y>]['length'];

// !同样的循环
type Repeat<Str extends string, N extends number, Arr extends Str[] = [], Res extends string = ''> = Arr['length'] extends N 
? Res 
: Repeat<Str, N, [Str,...Arr], `${Str}${Res}`>

const a:Add<100,200> = 300;

const abc: Repeat<'abc', 3> = 'abcabcabc'
```
