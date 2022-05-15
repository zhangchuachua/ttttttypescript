/**
 * 获取 node 上的 align 对齐点 相对于页面的坐标
 */

/***
 * @desc 获取需要对其的点位设置，例如许哟对其的点是 tl 即 top left 那么就返回 top, left 点所在的位置，如果是 br 即 bottom right 就返回 top + height, left + width
 * @param region
 * @param align
 * @returns {{top: number, left: number}}
 */
function getAlignOffset(region, align) {
  const V = align.charAt(0);
  const H = align.charAt(1);
  const w = region.width;
  const h = region.height;

  let x = region.left;
  let y = region.top;

  if (V === 'c') {
    y += h / 2;
  } else if (V === 'b') {
    y += h;
  }

  if (H === 'c') {
    x += w / 2;
  } else if (H === 'r') {
    x += w;
  }

  return {
    left: x,
    top: y,
  };
}

export default getAlignOffset;
