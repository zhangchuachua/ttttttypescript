import utils from './utils';

/***
 * @desc 获取元素的区域和大小
 * @param node
 * @returns {{top: number, left: number, width: number, height: number}}
 */
function getRegion(node) {
  let offset;
  let w;
  let h;
  if (!utils.isWindow(node) && node.nodeType !== 9) {
    offset = utils.offset(node);
    w = utils.outerWidth(node);
    h = utils.outerHeight(node);
  } else {
    const win = utils.getWindow(node);
    offset = {
      left: utils.getWindowScrollLeft(win),
      top: utils.getWindowScrollTop(win),
    };
    w = utils.viewportWidth(win);
    h = utils.viewportHeight(win);
  }
  offset.width = w;
  offset.height = h;
  return offset;
}

export default getRegion;
