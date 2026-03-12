import React from 'react';
import { AntButton } from '@shared/components';
import type { ButtonProps } from 'antd';
import classNames from 'classnames';

import styles from './index.module.scss';

interface CustomButtonProps extends ButtonProps {
  className?: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({ className, ...rest }) => {
  return (
    <AntButton
      color="primary"
      variant="outlined"
      {...rest}
      className={classNames(styles.button, className)}
    />
  );
};

export default CustomButton;
