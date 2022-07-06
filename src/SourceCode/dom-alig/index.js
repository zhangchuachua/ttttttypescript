// !getElFuturePos 这个方法也很重要；还有 getWHIgnoreDisplay 小技巧，可以获取 display: none 元素的大小；还有 getPBMWidth
import alignElement from './align/alignElement';
import alignPoint from './align/alignPoint';

export { alignElement, alignPoint };

export default alignElement;

// TODO 项目中的 SelectMenu 组件的对齐依然有问题，使用 rc-align 解决了问题，需要看一下 rc-align 的源码。
/** 问题
 * !1. SelectMenu 有 scale 缩放，所以在切换的时候使用 getBoundingClientRect() 获取到 height top 是不对的， height 可以使用 getComputedStyle 获取正确的，但是 top 呢。而且如果不使用 rc-align，使用 dom-align 也是一样的。
 * !2. 依然没有解决 SelectMenu 定位错误的问题，有时会定位到超出文档的右下角。需要解决
 */
// *重点代码 以下代码是用于我的 SelectMenu 对齐的，与 dom-align 得到的效果差不多
// const getRegion = (ele) => {
//   const offset = {
//     left: 0,
//     top: 0,
//     width: 0,
//     height: 0,
//   };
//   if (document && ele) {
//     // !因为当前动画存在 scale 所以获取的 height 有时并不正常, 所以使用 computedStyle
//     const { width, height } = window.getComputedStyle(ele);
//     // TODO 影响了高度，那么 top 也会受到影响，目前没有好的方法去解决，只有去掉 scale
//     const { left, top } = ele.getBoundingClientRect();
//     const { scrollTop, scrollLeft } = document.documentElement;
//     offset.width = parseInt(width, 10);
//     offset.height = parseInt(height, 10);
//     offset.top = Math.floor(top + scrollTop);
//     offset.left = Math.floor(left + scrollLeft);
//   }
//
//   return offset;
// };
// const getFutureOffset = (elRegion, targetRegion) => {
//   // 默认使用 el 的 bl 对齐 target 的 tl
//   const { left: elLeft, top: elTop, height: elHeight } = elRegion;
//   const { left: targetLeft, top: targetTop } = targetRegion;
//   // *计算 el 的 bottom left 点位
//   const elBl = {
//     left: elLeft,
//     top: elTop + elHeight,
//   };
//   // *计算 target 的 top left 点位
//   const targetTl = {
//     left: targetLeft,
//     top: targetTop,
//   };
//   // 计算出差距
//   const diff = [targetTl.left - elBl.left, targetTl.top - elBl.top];
//   return {
//     left: elRegion.left + diff[0],
//     top: elRegion.top + diff[1] + offsetY,
//   };
// };
// const setLeftTop = (el, offset) => {
//   el.style.left = `${offset.left}px`;
//   el.style.top = `${offset.top}px`;
// };
// // *强制重绘该元素
// const forceReLayout = (elem) => {
//   const originalStyle = elem.style.display;
//   elem.style.display = 'none';
//   elem.offsetHeight; // eslint-disable-line
//   elem.style.display = originalStyle;
// };
// // *对齐
// const align = (el, futureOffset) => {
//   const originOffset = getRegion(el);
//   const presetX = 0;
//   const presetY = 0;
//   setLeftTop(el, {
//     left: presetX,
//     top: presetY,
//   });
//   forceReLayout(el);
//   const presetOffset = getRegion(el);
//   // *计算出 originOffset 的偏移量
//   // const originStyle = {
//   //   left: originOffset.left - presetOffset.left,
//   //   top: originOffset.top - presetOffset.top,
//   // };
//   // setLeftTop(el, originStyle);
//   // forceReLayout(el);
//   setLeftTop(el, {
//     left: futureOffset.left - presetOffset.left,
//     top: futureOffset.top - presetOffset.top,
//   });
//   forceReLayout(el);
// };