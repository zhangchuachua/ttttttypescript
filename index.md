## 注意点

### typescript 注意点

#### 函数重载

##### 类型推断错误

如下 **函数重载** 将会报错，[typescript playground](https://www.typescriptlang.org/play?#code/JYOwLgpgTgZghgYwgAgCoQM5gEJwxAeQAcxgB7EZAbwChlkBXKAGwC5kspQBzAbhoC+NUJFiIU6LMVIVkEAB6QQAEwxpMOPIRLlKtehgYIkGDOwAUUTOyrIEZZRHYgGAWwBG0XsmVwwcdjgQAE9kAQBKZABeAD5kADcyYGV+IRoYBhAEGUpILAAxTIRzMh0KM3UsXHxpXXD2AAUoMldgfAAeIOCY-gysnOQ8sEKskrKQCskwWop6hKSUmho8YKzkPuzdQY0R4siqNKHd831GFnYAIguAGjoOIxMKy0xI2Oo7+nsJsmYIADpmGRuOYLlYMDdkGDwvx6AJbhFeEA)

```ts
interface TestBaseOption {
  url: string;
}
interface TestOption extends TestBaseOption {
  success: (res: { code: number; data: any }) => void;
}

function testFunc(options: TestBaseOption): Promise<any>;
function testFunc(options: TestOption): void;
async function testFunc(options: TestBaseOption | TestOption) {}

testFunc({
  url: "",
  // *这里的 res 将会被推断为 any 
  success: (res) => {
    console.log("res", res);
  },
});
```

> 注意：函数重载，需要把最丰富的类型签名放在最后

如下代码，报错将被修复，[typescript playground](https://www.typescriptlang.org/play?#code/JYOwLgpgTgZghgYwgAgCoQM5gEJwxAeQAcxgB7EZAbwChlkBXKAGwC5kspQBzAbhoC+NUJFiIU6LMVIVkEAB6QQAEwxpMOPIRLlKtehgYIkGDOwAUUTOyrIEZZRHYgGAWwBG0XsmVwwcdjgQAE9kAQBKZABeAD5kADcyYGV+IRoYBhAEGUpILAAxTIRzMh0KM3UpMpBw9kTk-gysnOQ8sEKskuqKyU18aV1a5AAFKDJXYHwAHiDgmP4aPGCs5Cbs3VaNDuLIqjS27fN9RhZ2ACIzgBo6DiMTCstMSNjqG-p7EAwyZggAOmYyNxzGcrBgrshQeF+PQBNcIrwgA)

```ts
interface TestBaseOption {
  url: string;
}
interface TestOption extends TestBaseOption {
  success: (res: { code: number; data: any }) => void;
}

function testFunc(options: TestOption): void;
function testFunc(options: TestBaseOption): Promise<any>;
async function testFunc(options: TestBaseOption | TestOption) {}

testFunc({
  url: "",
  // *这里的 res 将会被推断为 any 
  success: (res) => {
    console.log("res", res);
  },
});
```

##### 重载函数不能接受模糊的类型

```ts
function len(s: string): number;
function len(arr: any[]): number;
// *返回字符串或数组的长度
function len(x: string | any[]) {
    return x.length;
}
// ---cut---
len(""); // OK
len([0]); // OK
// !这里将会报错，因为重载函数只能将函数调用解析为单个重载
len(Math.random() > 0.5 ? "hello" : [0]);

// *这样不会报错
function l(x: string | any[]) {
  return x.length;
}
```