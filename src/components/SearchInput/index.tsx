import React from 'react';
import { AntInput, AntTooltip } from '@shared/components';
import type { InputProps, TooltipProps } from '@shared/components/antd-imports';
import classNames from 'classnames';

import styles from './index.module.scss';

interface Props extends Omit<InputProps, 'prefix' | 'onPressEnter'> {
  onSearch?: (value: string) => void;
  searchFields?: string[];
  tooltipTitle?: React.ReactNode;
  tooltipProps?: TooltipProps;
  inputRef?: React.RefObject<any>; // 输入框的 ref
}

const SearchInput: React.FC<Props> = ({
  className,
  onSearch,
  searchFields,
  tooltipTitle = 'Support searchable fields',
  tooltipProps,
  inputRef,
  ...rest
}) => {
  const inputNode = (
    <AntInput
      allowClear
      {...rest}
      ref={inputRef} // 传递 ref
      className={classNames(styles.searchInput, className)}
      prefix={
        <svg width="14" height="14" style={{ marginRight: 2 }} viewBox="0 0 15 15" fill="none">
          <path
            d="M13.6001 13.6L10.1001 10.1M11.6001 6.1C11.6001 9.13757 9.13766 11.6 6.1001 11.6C3.06253 11.6 0.600098 9.13757 0.600098 6.1C0.600098 3.06243 3.06253 0.6 6.1001 0.6C9.13766 0.6 11.6001 3.06243 11.6001 6.1Z"
            stroke="currentColor"
            strokeOpacity="0.4"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
      }
      onPressEnter={() => {
        const value = inputRef?.current?.input?.value || '';
        onSearch?.(value);
      }}
    />
  );

  if (!searchFields?.length) return inputNode;

  const tooltipContent = (
    <div className={styles.tooltipContent}>
      <div className={styles.tooltipTitle}>{tooltipTitle}</div>
      {searchFields.map((item, index) => (
        <div key={item} className={styles.tooltipItem}>
          {index + 1}. {item}
        </div>
      ))}
    </div>
  );

  return (
    <AntTooltip
      className={styles.toolTip}
      placement="bottomLeft"
      title={tooltipContent}
      {...tooltipProps}
    >
      {inputNode}
    </AntTooltip>
  );
};

export default SearchInput;
