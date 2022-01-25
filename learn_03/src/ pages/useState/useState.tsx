import React, { ReactElement, useState } from "react";

interface ChildProps{
  data:string
}
const Child = (({ data }: ChildProps):ReactElement => {
  console.log('child render...', data)
  // *这里有一个坑，这里收到了父组件传递过来的data，然后根据这个data创建了属于自己的name属性，但是当父组件的data修改时 这里的name并没有发生修改
  // *但是我觉得这是正常的。
  const [name, setName] = useState(data)
  return (
    <div>
      <div>child</div>
      <div>{name} --- {data}</div>
    </div>
  );
})

const Hook = ():ReactElement => {
  console.log('Hook render...')
  const [count, setCount] = useState(0)
  const [name, setName] = useState('rose')

  return (
    <div>
      <div>
        {count}
      </div>
      <button onClick={() => setCount(count + 1)}>update count</button>
      <button onClick={() => setName('jack')}>update name</button>
      <Child data={name}/>
    </div>
  )
}

export default Hook