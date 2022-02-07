//  !解法1 直接在范型里面定义一个类型，作为递归循环的次数计数
type JoinStrArray<
  Arr extends string[],
  Separator extends string,
  Result extends string = '',
  InferArr extends string[] = [] // *这里定义一个类型，作为循环次数  因为类型里面不能进行数字的计算，所以只能通过填充数组，然后根据数组的长度来进行判断。
> = InferArr['length'] extends Arr['length']
  ? Result
  : JoinStrArray<
      Arr,
      Separator,
      Result extends ''
        ? `${Arr[InferArr['length']]}`
        : `${Result}${Separator}${Arr[InferArr['length']]}`,
      [...InferArr, Result]
    >;

// !解法2 是博客中给出的答案  更倾向于这种答案，因为没有在范型中定义多余的类型，在使用时更清晰
type JoinStrArray2<
  Arr extends string[],
  Separator extends string,
  Result extends string = ''
> = Arr extends [infer El, ...infer Rest] // *使用临时类型 infer 这里相当于提取当前循环元素 El 与后续元素数组 Rest 比如第一次循环时 El: Sem; Rest = ['Lolo', 'Kaguko'];
  ? Rest extends string[]
    ? El extends string
      ? Result extends ''
        ? JoinStrArray<Rest, Separator, `${El}`>
        : JoinStrArray<Rest, Separator, `${Result}${Separator}${El}`>
      : `${Result}`
    : `${Result}`
  : `${Result}`;

// 测试用例
type Names = ['Sem', 'Lolo', 'Kaquko'];
type NamesComma = JoinStrArray<Names, ','>; // "Sem,Lolo,Kaquko"
type NamesSpace = JoinStrArray<Names, ' '>; // "Sem Lolo Kaquko"
type NamesStars = JoinStrArray<Names, '⭐️'>; // "Sem⭐️Lolo⭐️Kaquko"

const nameCommand: NamesComma = 'Sem,Lolo,Kaquko';
