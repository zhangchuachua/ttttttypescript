//* 数据类型判断 这个还是比较简单 就是使用 Object.prototype.toString.call 方法
export default function _typeof(data: any): string {
  return Object.prototype.toString.call(data).slice(8, -1).toLowerCase();
}

console.log(_typeof(1));
console.log(_typeof([]));
console.log(_typeof(null));
