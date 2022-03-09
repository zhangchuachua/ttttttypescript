type Create<Length extends number, Ele extends any = undefined, Arr extends Ele[] = [Ele]> = Arr['length'] extends Length ? Arr : Create<Length, Ele, [Ele, ...Arr]>;

export type CreateArr<Length extends number = 0, Ele extends any = undefined> = Length extends 0 ? [] : Create<Length, Ele>;
