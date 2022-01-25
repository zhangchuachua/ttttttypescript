import React, { ReactElement, FC } from 'react';

interface Cpt1Props {
  count: number;
  children: ReactElement;
}

export const Cpt1 = ({ count, children }: Cpt1Props): ReactElement => {
  return <div>
    component1
  </div>
}

interface Cpt2Props {
  count: number,
}

export const Cpt2: FC<Cpt2Props> = ({ count, children }) => {
  return <div>
    component2
  </div>
}

/**
 * 以上就是两种函数组件的写法
 * 第一种写法：就是直接声明一个函数组件，返回一个ReactElement。对于props需要自定义并且在参数地方进行声明。
 * 第二种写法：使用了react内部声明的FC类型
 * 优势：是我们只需要定义props的类型并且通过范型传递给它，而且它内部定义了children，如果有children就不需要在props类型中再添加children定义了  而第一种写法需要。
 * 劣势：代码的检查会更严格，有时候可能有一些报错不好解决
 * */