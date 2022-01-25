import React, { ReactElement, useState, useEffect, useRef, useReducer } from 'react';

// 自定义hook
function useInterval(callback: () => void, delay: number) {
  const savedCallback = useRef<() => void>();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  });

  // Set up the interval.
  useEffect(() => {
    function tick() {
      (savedCallback.current as (() => void))();
    }

    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

// 使用reducer的方式
type StateType = {
  count:number
}

type ActionType ={
  type: 'increment' | 'decrement'
}

const countReducer = (state :StateType, action: ActionType):StateType => {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    default :
      return state;
  }
}

const UseEffect = ({initalCount=0}): ReactElement => {
  // const [count, setCount] = useState(0)
  // 记住 应该这样使用useReducer  只需要将state与action的type定义好就是了
  const [state, dispatch] = useReducer(countReducer, { count: initalCount })

  // 这里的useEffect会在第一次的时候执行 执行的时候产生执行期上下文， 然后传入的参数相当于是一个闭包进行使用，闭包中获取到的count只能是未更新之前的count，所以这里就会一直
  // setCount(1)
  // useEffect(() => {
  //   const timeId = setInterval(() => {
  //     setCount(count + 1)
  //   }, 1000)
  //   return () => {
  //     clearInterval(timeId)
  //   }
  // }, [])

  // 这里虽然解决了上面的问题 但是由于在count改变时就触发useEffect 会导致一直绑定setInterval然后又一直清除上一次的timeId，这样不好
  // useEffect(() => {
  //   const timeId = setInterval(() => {
  //     console.log(count)
  //     setCount(count + 1)
  //   }, 1000)
  //   console.log(timeId)
  //   return () => {
  //     console.log(1)
  //     clearInterval(timeId)
  //   }
  // }, [count])

  // 解决方式1 自定义hook
  //  useInterval(() => {
  //   // Your custom logic here
  //   setCount(count + 1);
  // }, 1000);

  // 解决方式2 使用setCount(function) 的方式 function可以获取到最新的count
  // useEffect(() => {
  //   const timeId = setInterval(() => {
  //     setCount(count => (count + 1))
  //   }, 1000)
  //   return () => {
  //     console.log(1)
  //     clearInterval(timeId)
  //   }
  // }, [])

  // 解决方案3 使用useReducer
  // useEffect(() => {
  //   const timeId = setInterval(() => {
  //     dispatch({type: 'increment'})
  //   }, 1000);
  //   return ()=>{
  //     clearInterval(timeId)
  //   }
  // }, [])


  return <div>
    {state.count}
  </div>
}

export default UseEffect