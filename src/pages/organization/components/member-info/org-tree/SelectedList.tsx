import React, { useMemo } from 'react';
import type { PlantTreeDatum, SelectedListProps } from '@pages/organization/dto';
import { AntEmpty, AntInput, AntList, AntSpin, AntTooltip } from '@shared/components';
import clsx from 'classnames';

import styles from './SelectedList.module.scss';
/**
 * 已选列表组件
 * 支持编辑态（可移除）和展示态（只读）
 *
 * 功能特性：
 * - 支持搜索过滤
 * - 支持重置操作
 * - 支持编辑态和展示态切换
 * - 支持组织和电站两种图标类型
 */
const SelectedList: React.FC<SelectedListProps> = ({
  title,
  data,
  onChange,
  showReset = false,
  onReset,
  className = '',
  style,
  loading = false,
  iconType = 'org',
  showTips = false,
  showSearch = false,
  searchValue = '',
  onSearch,
  searchPlaceholder = '',
}) => {
  /**
   * 处理移除项
   */
  const handleRemove = (nodeData: PlantTreeDatum) => {
    onChange?.(nodeData);
  };

  /**
   * 处理重置
   */
  const handleReset = () => {
    onReset?.();
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch?.(e.target.value);
  };

  const headerIcon = useMemo(() => {
    return iconType === 'org' ? (
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4.57774 9.24961L4.15586 6.99961M6.60131 5.24431L9.37971 6.80717M9.37971 9.14109L7.18966 10.3204M6.59961 3.59961C6.59961 5.25646 5.25646 6.59961 3.59961 6.59961C1.94276 6.59961 0.599609 5.25646 0.599609 3.59961C0.599609 1.94276 1.94276 0.599609 3.59961 0.599609C5.25646 0.599609 6.59961 1.94276 6.59961 3.59961ZM13.3996 7.99961C13.3996 9.10418 12.5042 9.99961 11.3996 9.99961C10.295 9.99961 9.39961 9.10418 9.39961 7.99961C9.39961 6.89504 10.295 5.99961 11.3996 5.99961C12.5042 5.99961 13.3996 6.89504 13.3996 7.99961ZM6.99961 11.3996C6.99961 12.5042 6.10418 13.3996 4.99961 13.3996C3.89504 13.3996 2.99961 12.5042 2.99961 11.3996C2.99961 10.2951 3.89504 9.39963 4.99961 9.39963C6.10418 9.39963 6.99961 10.2951 6.99961 11.3996Z"
          stroke="#31C47F"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>
    ) : (
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10.9919 13.3996L9.53659 1.56118C9.51594 1.02424 9.07466 0.599609 8.53733 0.599609H5.46189C4.92456 0.599609 4.48328 1.02424 4.46263 1.56118L3.0073 13.3996M10.9919 13.3996H3.0073M10.9919 13.3996H13.3996M3.0073 13.3996H0.599609M1.99961 4.99963H11.9996"
          stroke="#33C2C8"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>
    );
  }, [iconType]);

  return (
    <div className={clsx(styles.editableContainer, className)} style={style}>
      <div className={styles.header}>
        <div
          className={clsx(styles.title, {
            [styles.orgIconType]: iconType === 'plant',
          })}
        >
          <span>{headerIcon}</span>
          <span>{title}</span>
          {showTips && (
            <AntTooltip
              placement="bottom"
              title="By selecting an organization, the uesr will be granted access to all current and future plants under that organization."
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.99961 2.99961V8.33294M6.99961 10.4663V10.9996M13.3996 6.99961C13.3996 10.5342 10.5342 13.3996 6.99961 13.3996C3.46499 13.3996 0.599609 10.5342 0.599609 6.99961C0.599609 3.46499 3.46499 0.599609 6.99961 0.599609C10.5342 0.599609 13.3996 3.46499 13.3996 6.99961Z"
                  stroke="#191B1F"
                  strokeOpacity="0.4"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </svg>
            </AntTooltip>
          )}
        </div>
        {/* {showSearch && (
          <AntInput
            prefix={
              <svg
                width="13"
                height="13"
                viewBox="0 0 13 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.7425 11.7425L8.74247 8.74247M10.0282 5.3139C10.0282 7.91752 7.91752 10.0282 5.3139 10.0282C2.71027 10.0282 0.599609 7.91752 0.599609 5.3139C0.599609 2.71027 2.71027 0.599609 5.3139 0.599609C7.91752 0.599609 10.0282 2.71027 10.0282 5.3139Z"
                  stroke="#191B1F"
                  strokeOpacity="0.4"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </svg>
            }
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={handleSearchChange}
            className={styles.searchInput}
          />
        )} */}
      </div>
      <div className={styles.listContainer}>
        <AntSpin spinning={loading}>
          {data.length === 0 ? (
            <AntEmpty />
          ) : (
            <AntList
              dataSource={data}
              renderItem={(item) => (
                <div key={item.nodeId} className={styles.selectedItem}>
                  <span className={styles.itemText}>{item.nodeName}</span>
                  <span onClick={() => handleRemove(item)}>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2.00273 2.00114L6.99943 6.99864M6.99943 6.99864L12 12M6.99943 6.99864L2 11.9989M6.99943 6.99864L11.9973 2"
                        stroke="#191B1F"
                        strokeOpacity="0.4"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </div>
              )}
            />
          )}
        </AntSpin>
      </div>

      {showReset && (
        <div className={styles.footer}>
          <span>Reset</span>
          <span onClick={handleReset} className={styles.resetCheckbox}>
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13.3996 6.99961C13.3996 3.46499 10.5342 0.599609 6.99961 0.599609C3.46499 0.599609 0.599609 3.46499 0.599609 6.99961C0.599609 10.5342 3.46499 13.3996 6.99961 13.3996C8.51099 13.3996 9.90002 12.8757 10.995 11.9996M10.995 11.9996L9.8 11.4996M10.995 11.9996L10.7701 13.3996M8 6.99961C8 7.5519 7.55228 7.99961 7 7.99961C6.44772 7.99961 6 7.5519 6 6.99961C6 6.44733 6.44772 5.99961 7 5.99961C7.55228 5.99961 8 6.44733 8 6.99961Z"
                stroke="#191B1F"
                strokeOpacity="0.4"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </div>
      )}
    </div>
  );
};

export default SelectedList;
