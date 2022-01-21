type SetOptional<> = {

};

type Foo = {
  a: number;
  b?: string;
  c: boolean;
};
type SomeOptional = SetOptional<Foo, 'a' | 'b'>;
