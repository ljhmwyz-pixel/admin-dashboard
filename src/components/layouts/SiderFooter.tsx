import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import type { MenuProps } from 'antd';
import { Dropdown } from 'antd';

import { ImageIcons } from '@/components';
import ThemeSwitcher from '@/components/ThemeSwitcher/ThemeSwitcher';
import type { RootState } from '@/core/store';

import { useLanguage } from '../../shared/hooks/useLanguage';

import styles from './SiderFooter.module.scss';

interface Props {
  collapsed: boolean;
}

const SiderFooter: React.FC<Props> = ({ collapsed }) => {
  // 控制底部整体展开
  const [expanded, setExpanded] = useState(false);
  const { t, currentLanguage, changeLanguage } = useLanguage();
  // 获取 auth slice 的 user
  const user = useSelector((state: RootState) => state.auth.user);
  // 控制哪个菜单激活
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const userMenuItems: MenuProps['items'] = [
    // { key: '6', label: '6666' },
    // { key: '7', label: '777' },
    // { key: '8', label: '8888' },
  ];

  const languageItems: MenuProps['items'] = [
    { key: 'zh-CN', label: t('lang.chinese') },
    { key: 'en-US', label: t('lang.english') },
    { key: 'de-DE', label: t('lang.german') },
    { key: 'it-IT', label: t('lang.italian') },
    { key: 'ja-JP', label: t('lang.japanese') },
  ];

  const languageMap: Record<string, string> = {
    'zh-CN': t('lang.chinese'),
    'en-US': t('lang.english'),
    'de-DE': t('lang.german'),
    'it-IT': t('lang.italian'),
    'ja-JP': t('lang.japanese'),
  };

  return (
    <div
      className={`
        ${styles.sideMenuContainer}
        ${collapsed && !expanded && styles.sideMenuContainerCollapsed}
        ${expanded && styles.expanded}
        ${(collapsed || expanded) && styles.expandedHover}
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
                    <div
                      key={item.key}
                      className={styles.dropdownItem}
                      onClick={() => changeLanguage(item.key)}
                    >
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
                    {languageMap[currentLanguage]}
                  </span>
                </div>
                <div className={styles.arrowContainer}>
                  <div className={styles.rightArrowIcon} />
                </div>
              </div>
            </Dropdown>

            {/* 主题切换器 */}
            <div className={styles.extraItem}>
              <div className={styles.leftInfo}>
                <ThemeSwitcher size="small" />
              </div>
            </div>
          </div>

          {/* 底部用户信息 */}
          <div className={styles.bottomRow}>
            <div className={styles.userContainer}>
              <img
                src={user?.avatar ? user.avatar : ImageIcons.footer.avatarIcon}
                className={styles.avatar}
                alt="avatar"
              />
              <div className={styles.userInfoContainer}>
                <div className={styles.userName}>{user?.username}</div>
                <div className={styles.roleName}>{user?.userType}</div>
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
