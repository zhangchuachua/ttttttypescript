// *实现 Replace 工具类型，用于实现字符串类型的替换操作。
import { Join } from './Join';
import { Split3 } from './28.Split';

export type Replace<
  S extends string,
  From extends string,
  To extends string
> = S extends `${infer Prev}${From}${infer Next}` ? `${Prev}${To}${Next}` : S;

type R0 = Replace<'', '', ''>; // ''
type R1 = Replace<'foobar', 'bar', 'foo'>; // "foofoo"
type R2 = Replace<'foobarbar', 'bar', 'foo'>; // "foofoobar"
type R3 = Replace<'foobarbar', 'ob', 'b'>

export type ReplaceAll<
  S extends string,
  From extends string,
  To extends string> = Join<Split3<S, From>, To>;

type T0 = ReplaceAll<'', '', ''> // ''
type T1 = ReplaceAll<'barfoo', 'bar', 'foo'> // "foofoo"
type T2 = ReplaceAll<'foobarbar', 'bar', 'foo'> // "foofoofoo"
type T3 = ReplaceAll<'foobarfoobar', 'ob', 'b'> // "fobarfobar"

const t3: T3 = 'fobarfobar';

// *不能使用递归调用 Replace 的方式，因为 type T3 = ReplaceAll<'foobarfoobar', 'ob', 'b'> 得出的结果是 fbarfbar, 而不是 fobarfobar 因为第一次将 ob 替换为 b 后，变成了 fobarfoobar 会继续匹配 ob 然后继续替换为 b，这样就会导致结果不正确。
// export type ReplaceAll<
//   S extends string,
//   From extends string,
//   To extends string
// > = S extends `${any}${From}${any}`
//   ? ReplaceAll<Replace<S, From, To>, From, To>
//   : S;
//
// type T0 = ReplaceAll<'', '', ''> // ''
// type T1 = ReplaceAll<'barfoo', 'bar', 'foo'> // "foofoo"
// type T2 = ReplaceAll<'foobarbar', 'bar', 'foo'> // "foofoofoo"
// type T3 = ReplaceAll<'foobarfoobar', 'ob', 'b'> // "fobarfobar"
