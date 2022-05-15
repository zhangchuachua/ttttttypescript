import utils from './utils';

const { getParent } = utils;

/***
 * @desc 返回祖先元素中是否含有 fixed 定位的元素。
 * @param element
 * @returns {boolean}
 */
export default function isAncestorFixed(element) {
  if (utils.isWindow(element) || element.nodeType === 9) {
    return false;
  }

  const doc = utils.getDocument(element);
  const body = doc.body;
  let parent = null;
  for (
    parent = getParent(element);
    // 修复元素位于 document.documentElement 下导致崩溃问题
    parent && parent !== body && parent !== doc;
    parent = getParent(parent)
  ) {
    const positionStyle = utils.css(parent, 'position');
    if (positionStyle === 'fixed') {
      return true;
    }
  }
  return false;
}
