// *很早之前就听过 async-await 是 generator 函数的语法糖，但是因为一直不知道具体的实现过程，下面手动实现一下 async-await

// *首先需要了解 generator 函数，具体可以看 https://wangdoc.com/es6/generator.html

const obj = {
  then(resolve: any, reject: any) {
    resolve(123)
  }
}

export async function name() {
  // @ts-ignore
  const c = await obj;
  console.log(c);
}

name();
