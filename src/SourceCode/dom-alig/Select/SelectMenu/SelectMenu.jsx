import React, { useContext, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import classNames from 'classnames/bind';
import Align from 'rc-align';
import RenderToContainer from '@/components/common/RenderToContainer';
import styles from './SelectMenu.module.scss';
import { SelectContext } from '../Select';

const cx = classNames.bind(styles);

const SelectMenu = ({ children, open, style, selector }) => {
  const menuRef = useRef(null);
  const { container } = useContext(SelectContext);

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
