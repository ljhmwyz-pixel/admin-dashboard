import React from 'react';
import type { TooltipProps } from 'antd';
import { Tooltip } from 'antd';
import classNames from 'classnames';

import styles from './index.module.scss';

const MyTooltip: React.FC<TooltipProps> = ({ classNames: userClassNames, children, ...rest }) => {
  return (
    <Tooltip
      {...rest}
      classNames={{
        ...userClassNames,
        root: classNames(styles.tooltip),
      }}
    >
      {children}
    </Tooltip>
  );
};

export default MyTooltip;
