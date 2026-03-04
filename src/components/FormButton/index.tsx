import React from 'react';
import classNames from 'classnames';

import type { ButtonProps } from '@/shared/components/antd-imports';
import { AntButton } from '@/shared/components/antd-imports';

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
