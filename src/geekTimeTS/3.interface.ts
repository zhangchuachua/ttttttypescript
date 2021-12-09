interface StringArray {
  [x: number]: string;
}
// *数字也是可以当作索引的，所以这里的
const a: StringArray = ['a', 'b', 'c', 'd'];

console.log(a);

export {};
