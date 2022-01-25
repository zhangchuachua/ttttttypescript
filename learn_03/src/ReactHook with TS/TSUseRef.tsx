import React, { ReactElement, useEffect, useRef, useState } from 'react';

const Cpt = (): ReactElement => {
  const [count, setCount] = useState<number>(0)
  // **注意哦**：对于React内置类型MutableRefObject RefObject：
  // 使用useRef()如果传递null返回的是RefObject，如果传递的是null之外的其他参数返回的是MutableRefObject
  // 使用React.createRef()返回的是RefObject
  const ref = useRef<number>(count) // 所以这里返回的是MutableRefObject
  const InputRef = useRef<number>(null)

  useEffect(() => {
    ref.current = count
  }, [count])

  function handleAlert() {
    setTimeout(() => {
      // 每一次执行函数组件都会有一个全新的执行期上下文，也都会重新执行函数组件中的代码 包括这里的定义handleAlert函数，定义完成后只能取到当前的执行期上下文的count所以取不到新的count
      // 而ref不会
      console.log(ref.current, count)
    }, 2000)
  }

  return <div>
    <button onClick={() => setCount(count + 1)}>+++</button>
    <button onClick={handleAlert}>显示弹窗</button>
  </div>
}

export default Cpt;