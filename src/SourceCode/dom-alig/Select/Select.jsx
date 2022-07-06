import React, { useCallback, useContext, useEffect, useRef } from 'react';
import { throttle } from 'lodash';
import { CSSTransition } from 'react-transition-group';
import classNames from 'classnames/bind';
import Align from 'rc-align';
import RenderToContainer from '@/components/common/RenderToContainer';
import styles from './SelectMenu.module.scss';
import { SelectContext } from '../Select';

const cx = classNames.bind(styles);
const offsetY = -10;
const getRegion = (ele) => {
  const offset = {
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  };
  if (document && ele) {
    // !因为当前动画存在 scale 所以获取的 height 有时并不正常, 所以使用 computedStyle
    const { width, height } = window.getComputedStyle(ele);
    // TODO 影响了高度，那么 top 也会受到影响，目前没有好的方法去解决，只有去掉 scale
    const { left, top } = ele.getBoundingClientRect();
    const { scrollTop, scrollLeft } = document.documentElement;
    offset.width = parseInt(width, 10);
    offset.height = parseInt(height, 10);
    offset.top = Math.floor(top + scrollTop);
    offset.left = Math.floor(left + scrollLeft);
  }

  return offset;
};
const getFutureOffset = (elRegion, targetRegion) => {
  // 默认使用 el 的 bl 对齐 target 的 tl
  const { left: elLeft, top: elTop, height: elHeight } = elRegion;
  const { left: targetLeft, top: targetTop } = targetRegion;
  // *计算 el 的 bottom left 点位
  const elBl = {
    left: elLeft,
    top: elTop + elHeight,
  };
  // *计算 target 的 top left 点位
  const targetTl = {
    left: targetLeft,
    top: targetTop,
  };
  // 计算出差距
  const diff = [targetTl.left - elBl.left, targetTl.top - elBl.top];
  return {
    left: elRegion.left + diff[0],
    top: elRegion.top + diff[1] + offsetY,
  };
};
const setLeftTop = (el, offset) => {
  el.style.left = `${offset.left}px`;
  el.style.top = `${offset.top}px`;
};
// *强制重绘该元素
const forceReLayout = (elem) => {
  const originalStyle = elem.style.display;
  elem.style.display = 'none';
  elem.offsetHeight; // eslint-disable-line
  elem.style.display = originalStyle;
};
// *对齐
const align = (el, futureOffset) => {
  // const originOffset = getRegion(el);
  const presetX = 0;
  const presetY = 0;
  setLeftTop(el, {
    left: presetX,
    top: presetY,
  });
  forceReLayout(el);
  const presetOffset = getRegion(el);
  // *计算出 originOffset 的偏移量
  // const originStyle = {
  //   left: originOffset.left - presetOffset.left,
  //   top: originOffset.top - presetOffset.top,
  // };
  // setLeftTop(el, originStyle);
  // forceReLayout(el);
  setLeftTop(el, {
    left: futureOffset.left - presetOffset.left,
    top: futureOffset.top - presetOffset.top,
  });
  forceReLayout(el);
};
const SelectMenu = ({ children, open, style, selector }) => {
  const menuRef = useRef(null);
  const { container } = useContext(SelectContext);

  // const setPosition = useCallback(() => {
  //   if (menuRef.current && selector.current) {
  //     const menuRegion = getRegion(menuRef.current);
  //     const targetRegion = getRegion(selector.current);
  //     const futureOffset = getFutureOffset(menuRegion, targetRegion);
  //     console.log(menuRegion, targetRegion, futureOffset);
  //     align(menuRef.current, futureOffset);
  //   }
  // }, [selector]);

  // const handleResize = throttle(() => {
  //   setPosition();
  // }, 1000);
  //
  // useEffect(() => {
  //   setPosition();
  // }, [setPosition]);

  // useEffect(() => {
  //   window.addEventListener('resize', handleResize);
  //
  //   return () => {
  //     window.removeEventListener('resize', handleResize);
  //   };
  // }, [handleResize]);

  return (
    <RenderToContainer container={container}>
      <CSSTransition in={open} timeout={150} appear classNames="fade" unmountOnExit={false}>
        <Align
          monitorWindowResize
          align={{
            points: ['bl', 'tl'],
            offset: [0, -10],
          }}
          target={() => selector.current}>
          <div style={style} ref={menuRef} className={cx('select-menu', 'hidden')}>
            {children}
          </div>
        </Align>
      </CSSTransition>
    </RenderToContainer>
  );
};

export default SelectMenu;
