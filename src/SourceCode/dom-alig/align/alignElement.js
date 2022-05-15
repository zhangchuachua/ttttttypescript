import doAlign from './align';
import getOffsetParent from '../getOffsetParent';
import getVisibleRectForElement from '../getVisibleRectForElement';
import getRegion from '../getRegion';

/***
 * @desc 返回指定元素是否在显示区域外
 * @param target {HTMLElement}
 * @param alwaysByViewport {Boolean}
 * @returns {boolean}
 */
function isOutOfVisibleRect(target, alwaysByViewport) {
  const visibleRect = getVisibleRectForElement(target, alwaysByViewport);
  const targetRegion = getRegion(target);

  // 如果显示区域不存在，那么就直接返回 true 表示在显示区域外
  // *
  return (
    !visibleRect ||
    targetRegion.left + targetRegion.width <= visibleRect.left ||
    targetRegion.top + targetRegion.height <= visibleRect.top ||
    targetRegion.left >= visibleRect.right ||
    targetRegion.top >= visibleRect.bottom
  );
}

function alignElement(el, refNode, align) {
  const target = align.target || refNode;
  // *这里获取了 target 元素的区域： left, top, width, height
  const refNodeRegion = getRegion(target);

  // *isOutOfVisibleRect 是 是否在显示区域之外， !isOutOfVisibleRect 就是 是否在显示区域之内了 如果为 true 表示 target 在它的显示区域内
  const isTargetNotOutOfVisible = !isOutOfVisibleRect(
    target,
    align.overflow && align.overflow.alwaysByViewport,
  );
  debugger
  return doAlign(el, refNodeRegion, align, isTargetNotOutOfVisible);
}

alignElement.__getOffsetParent = getOffsetParent;

alignElement.__getVisibleRectForElement = getVisibleRectForElement;

export default alignElement;
