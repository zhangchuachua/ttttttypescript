import utils from './utils';
import getOffsetParent from './getOffsetParent';
import isAncestorFixed from './isAncestorFixed';

/**
 * 获得元素的显示部分的区域
 */
function getVisibleRectForElement(element, alwaysByViewport) {
  // *默认先是范围
  const visibleRect = {
    left: 0,
    right: Infinity,
    top: 0,
    bottom: Infinity,
  };
  let el = getOffsetParent(element);
  const doc = utils.getDocument(element);
  const win = doc.defaultView || doc.parentWindow;
  const body = doc.body;
  const documentElement = doc.documentElement;

  // Determine the size of the visible rect by climbing the dom accounting for
  // all scrollable containers.
  while (el) {
    // clientWidth is zero for inline block elements in ie.
    if (
      (navigator.userAgent.indexOf('MSIE') === -1 || el.clientWidth !== 0) &&
      // body may have overflow set on it, yet we still get the entire
      // viewport. In some browsers, el.offsetParent may be
      // document.documentElement, so check for that too.
      // *offsetParent 会返回当前元素最近的祖先定位元素或 table, th, td, body 元素，当前元素的 display: none 时会返回 null， body 的 offsetParent 是 null。 当前元素的 offsetTop, offsetLeft 就是根据 offsetParent 进行定位的
      (el !== body &&
        el !== documentElement &&
        // *overflow 默认为 visible(body 和 html 也是默认为 visible), 这里需要挑选出父元素中 overflow 不为 visible 的部分，不为 visible 可能就是 hidden 或者 有滚动条，会影响其显示区域，所以进行操作
        utils.css(el, 'overflow') !== 'visible')
    ) {
      const pos = utils.offset(el);
      // *add border 添加 border, 而且如果内容是从右往左，并且有滚动条的话，那么 client[Left, Top] 会包含滚动条的大小
      pos.left += el.clientLeft;
      pos.top += el.clientTop;
      visibleRect.top = Math.max(visibleRect.top, pos.top);
      visibleRect.right = Math.min(
        visibleRect.right,
        // consider area without scrollBar
        pos.left + el.clientWidth,
      );
      visibleRect.bottom = Math.min(
        visibleRect.bottom,
        pos.top + el.clientHeight,
      );
      visibleRect.left = Math.max(visibleRect.left, pos.left);
    } else if (el === body || el === documentElement) {
      break;
    }
    el = getOffsetParent(el);
  }

  // Set element position to fixed
  // make sure absolute element itself don't affect it's visible area
  // ?确保绝对定位元素本身不会影响到它的可见区域 还不是很理解
  // http://react-component.github.io/cascader/demo/adjust-overflow 这是是否进行调整的效果
  // https://github.com/ant-design/ant-design/issues/7601
  let originalPosition = null;
  if (!utils.isWindow(element) && element.nodeType !== 9) {
    originalPosition = element.style.position;
    const position = utils.css(element, 'position');
    if (position === 'absolute') {
      element.style.position = 'fixed';
    }
  }

  // *已经滚动的 宽度和高度
  const scrollX = utils.getWindowScrollLeft(win);
  const scrollY = utils.getWindowScrollTop(win);
  // *获取视口宽度与高度 注意使用 viewport[Width, Height] 获取的值不包含滚动条
  const viewportWidth = utils.viewportWidth(win);
  const viewportHeight = utils.viewportHeight(win);
  // *整个页面的高度和宽度
  let documentWidth = documentElement.scrollWidth;
  let documentHeight = documentElement.scrollHeight;

  // scrollXXX on html is sync with body which means overflow: hidden on body gets wrong scrollXXX.
  // We should cut this ourself.
  // *当 body 的 overflow: hidden 时也就不会出现滚动条了 所以需要修改 document[Width, Height] 的值
  const bodyStyle = window.getComputedStyle(body);
  if (bodyStyle.overflowX === 'hidden') {
    // !inner[Width, Height] 包含滚动条，可能是避免即使没有滚动内容，但是滚动条依旧存在的情况
    documentWidth = win.innerWidth;
  }
  if (bodyStyle.overflowY === 'hidden') {
    documentHeight = win.innerHeight;
  }

  // Reset element position after calculate the visible area
  if (element.style) {
    element.style.position = originalPosition;
  }

  // *如果需要总是先是在视口内，或者祖先元素中有 fixed 的元素，那么进入这个 if
  if (alwaysByViewport || isAncestorFixed(element)) {
    // Clip by viewport's size.
    visibleRect.left = Math.max(visibleRect.left, scrollX);
    visibleRect.top = Math.max(visibleRect.top, scrollY);
    visibleRect.right = Math.min(visibleRect.right, scrollX + viewportWidth);
    visibleRect.bottom = Math.min(visibleRect.bottom, scrollY + viewportHeight);
  } else {
    // Clip by document's size.
    // *因为上面的循环中如果不满足条件是不会进行修改的，所以 right bottom 还是 infinity 这里需要根据 document 进行裁剪
    const maxVisibleWidth = Math.max(documentWidth, scrollX + viewportWidth);
    visibleRect.right = Math.min(visibleRect.right, maxVisibleWidth);

    const maxVisibleHeight = Math.max(documentHeight, scrollY + viewportHeight);
    visibleRect.bottom = Math.min(visibleRect.bottom, maxVisibleHeight);
  }

  // *保证显示区域是正常的，比如 top left 一定会大于 0
  return visibleRect.top >= 0 &&
    visibleRect.left >= 0 &&
    visibleRect.bottom > visibleRect.top &&
    visibleRect.right > visibleRect.left
    ? visibleRect
    : null;
}

export default getVisibleRectForElement;
