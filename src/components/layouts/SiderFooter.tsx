import React, { useState } from 'react';
import type { MenuProps } from 'antd';
import { Dropdown } from 'antd';

import { ImageIcons } from '@/assets/images';

import styles from './SiderFooter.module.scss';

interface Props {
  collapsed: boolean;
}

const SiderFooter: React.FC<Props> = ({ collapsed }) => {
  // 控制底部整体展开
  const [expanded, setExpanded] = useState(false);

  // 控制哪个菜单激活
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const userMenuItems: MenuProps['items'] = [
    { key: '6', label: '6666' },
    { key: '7', label: '777' },
    { key: '8', label: '8888' },
  ];

  const languageItems: MenuProps['items'] = [
    { key: '1', label: '简体中文' },
    { key: '2', label: 'English' },
    { key: '3', label: 'Deutsch' },
    { key: '4', label: 'Italiano' },
    { key: '5', label: '日本语' },
  ];

  return (
    <div
      className={`
        ${styles.sideMenuContainer}
        ${collapsed && !expanded && styles.sideMenuContainerCollapsed}
        ${expanded && styles.expanded}
        ${(!collapsed || expanded) && styles.expandedHover}
      `}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => {
        setExpanded(false);
        setActiveMenu(null);
      }}
    >
      {(!collapsed || expanded) && (
        <>
          <div className={styles.expandArea}>
            {/* 用户菜单 */}
            <Dropdown
              trigger={['hover']}
              placement="bottomRight"
              align={{
                points: ['bl', 'tl'],
                offset: [186, 74],
              }}
              popupRender={() => (
                <div
                  className={styles.dropdownStyle}
                  onMouseEnter={() => setActiveMenu('user')}
                  onMouseLeave={() => setActiveMenu(null)}
                >
                  {userMenuItems?.map((item: any) => (
                    <div key={item.key} className={styles.dropdownItem}>
                      {item.label}
                    </div>
                  ))}
                </div>
              )}
              onOpenChange={(open) => setActiveMenu(open ? 'user' : null)}
            >
              <div
                className={`${styles.extraItem} ${activeMenu === 'user' && styles.extraItemActive}`}
                onMouseEnter={() => setActiveMenu('user')}
              >
                <div className={styles.leftInfo}>
                  <div className={`${styles.leftIcon} ${styles.leftIcon1}`} />
                  <span className={`${styles.extraItemText} ${styles.extraItemText1}`}>
                    Pylontech
                  </span>
                </div>
                <div className={styles.arrowContainer}>
                  <div className={styles.rightArrowIcon} />
                </div>
              </div>
            </Dropdown>

            {/* 语言菜单 */}
            <Dropdown
              trigger={['hover']}
              placement="bottomRight"
              align={{
                points: ['bl', 'tl'],
                offset: [186, 74],
              }}
              popupRender={() => (
                <div
                  className={styles.dropdownStyle}
                  onMouseEnter={() => setActiveMenu('language')}
                  onMouseLeave={() => setActiveMenu(null)}
                >
                  {languageItems?.map((item: any) => (
                    <div key={item.key} className={styles.dropdownItem}>
                      {item.label}
                    </div>
                  ))}
                </div>
              )}
              onOpenChange={(open) => setActiveMenu(open ? 'language' : null)}
            >
              <div
                className={`${styles.extraItem} ${
                  activeMenu === 'language' && styles.extraItemActive
                }`}
                onMouseEnter={() => setActiveMenu('language')}
              >
                <div className={styles.leftInfo}>
                  <div className={`${styles.leftIcon} ${styles.leftIcon2}`} />
                  <span className={`${styles.extraItemText} ${styles.extraItemText2}`}>
                    English
                  </span>
                </div>
                <div className={styles.arrowContainer}>
                  <div className={styles.rightArrowIcon} />
                </div>
              </div>
            </Dropdown>
          </div>

          {/* 底部用户信息 */}
          <div className={styles.bottomRow}>
            <div className={styles.userContainer}>
              <img src={ImageIcons.footer.avatarIcon} className={styles.avatar} alt="avatar" />
              <div className={styles.userInfoContainer}>
                <div className={styles.userName}>Leyu.song</div>
                <div className={styles.roleName}>Admin</div>
              </div>
            </div>
            <img src={ImageIcons.footer.moreIcon} className={styles.more} alt="more" />
          </div>
        </>
      )}

      {collapsed && !expanded && (
        <div className={styles.userContainerCollapsed}>
          <img src={ImageIcons.footer.avatarIcon} className={styles.avatar} alt="avatar" />
        </div>
      )}
    </div>
  );
};

export default SiderFooter;
