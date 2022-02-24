import React, { FC, useState } from 'react';

interface Article {
  title: string;
  content: string;
}

const Cpt: FC = () => {
  // 下面就是useState的两种使用方式
  // 第一种可以通过范型传递类型来 规定state的形状
  const [article, setArticle] = useState<Article>({
    title: '号外号外！',
    content: '特大新闻',
  });
  // 第二种就是不使用范型传递类型 由ts自己进行推断，当前使用的什么类型 如果后续设置不符合同样会报错
  const [count, setCount] = useState(0);
  // 肯定推荐使用第一种方式
  // setCount('fuck')
  return <div>component</div>;
};
export default Cpt;
