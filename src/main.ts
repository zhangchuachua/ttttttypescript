// !这个main.ts的作用就是入口文件。这里使用了vite，可以直接在浏览器上看到ts的打印，比node的控制台方便得多。而且还可以顺便了解一下vite，现在看来vite真的比webpack简单好多。
// !https://www.typescriptlang.org/play?#code/Q 还可以通过这个网址观察typescript是如何进行解析的。 这个网址是typescript官方提供的在线转js的工具。

import './style.css';
// import './geekTimeTS/1.basicType'; // 需要查看哪个ts文件就直接引入就可以了。
// import './geekTimeTS/2.enumType';
// import './geekTimeTS/3.interface';
// import './geekTimeTS/4.function';
// import './geekTimeTS/5.class';
// import './geekTimeTS/6.class-interface';
// import './geekTimeTS/7.generic';
import './SourceCode/call'

const app = document.querySelector<HTMLDivElement>('#app')!;

app.innerHTML = `
  <h1>Hello Vite and Typescript!</h1>
  <a href='https://vitejs.dev/guide/features.html' target='_blank'>Documentation</a>
`;
