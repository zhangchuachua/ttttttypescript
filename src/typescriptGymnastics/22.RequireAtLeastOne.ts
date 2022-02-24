type Responder = {
  text?: () => string;
  json?: () => string;
  secure?: boolean;
};

export type RequireAtLeastOne<
  ObjectType,
  KeysType extends keyof ObjectType = keyof ObjectType
> = {
  [index in KeysType]-?: ObjectType[index];
} & {
  // *这里同样使用了 as； 不用 as 也可以做 参考 21
  [index in keyof ObjectType as index extends KeysType
    ? never
    : index]: ObjectType[index];
};

type A = RequireAtLeastOne<Responder, 'text' | 'json'>;

// 表示当前类型至少包含 'text' 或 'json' 键
const responder: RequireAtLeastOne<Responder, 'text' | 'json'> = {
  json: () => '{"message": "ok"}',
  text: () => 'text',
};
