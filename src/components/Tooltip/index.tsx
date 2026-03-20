import React from 'react';
import type { TooltipProps } from 'antd';
import { Tooltip } from 'antd';
import classNames from 'classnames';

import styles from './index.module.scss';

const MyTooltip: React.FC<TooltipProps> = ({ overlayClassName, children, ...rest }) => {
  return (
    <Tooltip overlayClassName={classNames(styles.tooltip, overlayClassName)} {...rest}>
      {children}
    </Tooltip>
  );
};

export default MyTooltip;
