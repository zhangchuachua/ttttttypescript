import React, { ReactElement, useMemo, memo, useState, useEffect } from 'react';

type ChildProps = {
  data: {
    name: string;
  };
};
type ChildProps2 = {
  data: string;
};
// 这里的memo就相当于类组件的PureComponent 所以它会做简单的比较，当没有变化时不会进行重新渲染 但是它只是简单的将两个值进行比较
// 如果是对象之类的就不起作用了，除非两个对象的地址一样
const Child = memo(({ data }: ChildProps): ReactElement => {
  console.log('child重新渲染');
  return <div>children:---{data.name}</div>;
});

const UseMemo = (): ReactElement => {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('ok');

  // useMemo会将上一次的结果进行暂存，然后与新的进行比较，这样对于对象来说也可以起作用
  // 当点击按钮时会重新进行执行当前这个函数组件，执行到这里的时候它就会与上次的name进行比较，再根据结果确定是否返回一个新的对象
  const data = useMemo(() => {
    return {
      name,
    };
  }, [name]);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>count</button>
      <p>{count}</p>
      <button onClick={() => setName(name + count)}>name</button>
      <p>{name}</p>
      <Child data={data} />
    </div>
  );
};

export default UseMemo;
