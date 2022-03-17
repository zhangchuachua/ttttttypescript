// *判断是否是 any
// *关联的文件 36.Filter.ts
export type IsAny<T> = 0 extends (1 & T) ? true : false;
