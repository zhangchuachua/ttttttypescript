type Person = {
  id: string;
  name: string;
  age: number;
  un: undefined;
  from?: string;
  speak?: string;
};

// *这里一定要 -? 也就是把原本可选的属性变成必选的  不然的话会多出一个 undefined 属性 见下面的 type A  暂时还不知道为什么
export type OptionalKeys<T> = {
  [index in keyof T]-?: undefined extends T[index] ? index : never;
}[keyof T];
type PersonOptionalKeys = OptionalKeys<Person>; // "from" | "speak"

type F<T> = {
  [index in keyof T]: index;
}[keyof T];

type A = F<Person>;
