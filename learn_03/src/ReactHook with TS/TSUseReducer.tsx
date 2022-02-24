import React, { ReactElement, useReducer } from 'react';

interface StateType {
  count: number;
}

interface ActionType {
  type: string;

  [key: string]: any;
}

// 第一种方法： 使用内部类型React.Reducer定义 使用范型的方式传递state类型和action类型
const reducer: React.Reducer<StateType, ActionType> = (state, action) => {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    // 使用这种方式定义reducer必须有default
    default:
      return state;
  }
};

const reducer2 = (state: StateType, action: ActionType) => {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    // 使用这种方式定义reducer可以没有default 不够严谨
    default:
      return state;
  }
};

const Cpt = (): ReactElement => {
  // 这里useReducer不用加范型 会自动进行推断！！
  const [state, dispatch] = useReducer(reducer, { count: 0 });
  const [state2, dispatch2] = useReducer(reducer2, { count: 0 });

  return <div>cpt</div>;
};

export default Cpt;
