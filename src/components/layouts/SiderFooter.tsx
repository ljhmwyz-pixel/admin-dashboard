import React from 'react'

import { Dropdown } from 'antd'
import type { MenuProps } from 'antd';
import avatarIcon from '@/assets/images/layout/avatar_icon.png'
import moreIcon from '@/assets/images/layout/more_icon.png'
import { useLanguage } from '../../hooks/useLanguage'
import { useTranslation } from 'react-i18next'
import styles from './SiderFooter.module.scss'

interface Props {
  collapsed: boolean
}

const SiderFooter: React.FC<Props> = ({ collapsed }) => {
  const { currentLanguage, changeLanguage } = useLanguage();
  const { t } = useTranslation();

  // 语言映射
  const languageMap: Record<string, { key: string; label: string }> = {
    'zh-CN': { key: '1', label: t('lang.chinese') },
    'en-US': { key: '2', label: t('lang.english') },
    'de-DE': { key: '3', label: t('lang.german') },
    'it-IT': { key: '4', label: t('lang.italian') },
    'ja-JP': { key: '5', label: t('lang.japanese') }
  };

  // 获取当前语言标签
  const currentLanguageLabel = languageMap[currentLanguage]?.label || t('lang.english');

  const userMenuItems: MenuProps['items'] = [
    {
      key: '1',
      label: t('lang.chinese'),
      onClick: () => changeLanguage('zh-CN')
    },
    {
      key: '2',
      label: t('lang.english'),
      onClick: () => changeLanguage('en-US')
    },
    {
      key: '3',
      label: t('lang.german'),
      onClick: () => changeLanguage('de-DE')
    },
    {
      key: '4',
      label: t('lang.italian'),
      onClick: () => changeLanguage('it-IT')
    },
    {
      key: '5',
      label: t('lang.japanese'),
      onClick: () => changeLanguage('ja-JP')
    },
  ]

  return (
    <div
      className={`${styles.sideMenuContainer} ${collapsed ? styles.sideMenuContainerCollapsed : ''}`}
    >
      {/* 展开后的内容 */}
      {!collapsed && (
        <>
          {/* 扩展内容 */}
          <div className={styles.expandArea}>
            <div className={styles.extraItem}>
              <div className={styles.leftInfo}>
                <div className={`${styles.leftIcon} ${styles.leftIcon1}`} />
                <span className={`${styles.extraItemText} ${styles.extraItemText1}`}>{t('layout.pylontech', 'Pylontech')}</span>
              </div>
              <div className={styles.arrowContainer}>
                <div className={styles.rightArrowIcon} />
              </div>
            </div>
            <Dropdown
              // menu={{ items:  }}
              trigger={['hover']}
              placement="bottomRight"
              align={{
                points: ['bl', 'tl'],
                offset: [186, 74],
              }}
              popupRender={() => (
                <div className={styles.dropdownStyle}>
                  {userMenuItems.map((item: any) => {
                    return <div key={item?.key} className={styles.dropdownItem} onClick={item.onClick}>{item.label}</div>
                  })}
                </div>
              )}
            >
              <div className={styles.extraItem}>
                <div className={styles.leftInfo}>
                  <div className={`${styles.leftIcon} ${styles.leftIcon2}`} />
                  <span className={`${styles.extraItemText} ${styles.extraItemText2}`}>{currentLanguageLabel}</span>
                </div>
                <div className={styles.arrowContainer}>
                  <div className={styles.rightArrowIcon}></div>
                </div>
              </div>
            </Dropdown>
          </div>

          {/* 最底部固定显示的 */}
          <div className={styles.bottomRow}>
            <div className={styles.userContainer}>
              <img src={avatarIcon} className={styles.avatar} alt="avatar" />
              <div className={styles.userInfoContainer}>
                <div className={styles.userName}>{t('layout.userName', 'Leyu.song')}</div>
                <div className={styles.roleName}>{t('layout.admin', 'Admin')}</div>
              </div>
            </div>
            <img src={moreIcon} className={styles.more} alt="more" />
          </div>
        </>
      )}

      {/* 收缩后的内容 */}
      {collapsed && <div className={styles.userContainerCollapsed}>
        <img src={avatarIcon} className={styles.avatar} alt='avatar' />
      </div>}
      {/* 第二层级弹出框 */}
      {/* <div className={styles.dropdownContainer}>12312</div> */}
    </div>
  )
}

export default SiderFooter
