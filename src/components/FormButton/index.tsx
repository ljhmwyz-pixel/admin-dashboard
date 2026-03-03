import React from 'react';
import type { ButtonProps } from 'antd';
import { Button } from 'antd';
import classNames from 'classnames';

import styles from './index.module.scss';

interface CustomButtonProps extends ButtonProps {
  className?: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({ className, ...rest }) => {
  return (
    <Button
      color="primary"
      variant="outlined"
      {...rest}
      className={classNames(styles.button, className)}
    />
  );
};

export default CustomButton;
