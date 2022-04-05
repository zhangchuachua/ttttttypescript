export default function num2Chinese(num: number | string): string | TypeError {
  const n = Number(num);
  if (Number.isNaN(n)) return TypeError('isn`t number');
  const numList = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  const unitList = ['十', '百', '千'];
  const unitList2 = ['万', '亿', '兆'];

}
