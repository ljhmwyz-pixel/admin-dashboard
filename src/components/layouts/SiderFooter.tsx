import React, { useState } from 'react'

import { Dropdown, Menu } from 'antd'
import type { MenuProps } from 'antd';
import avatarIcon from '@/assets/images/layout/avatar_icon.png'
import moreIcon from '@/assets/images/layout/more_icon.png'
import styles from './SiderFooter.module.scss'

interface Props {
  collapsed: boolean
}

const SiderFooter: React.FC<Props> = ({ collapsed }) => {
  const [expanded, setExpanded] = useState(false)
  const userMenuItems: MenuProps['items'] = [
    {
      key: '6',
      label: '6666',
    },
    {
      key: '7',
      label: '777',
    },
    {
      key: '8',
      label: '8888',
    },
  ]

  const languageItems: MenuProps['items'] = [
    {
      key: '1',
      label: '简体中文',
    },
    {
      key: '2',
      label: 'English',
    },
    {
      key: '3',
      label: 'Deutsch',
    },
    {
      key: '4',
      label: 'Italiano',
    },
    {
      key: '5',
      label: '日本语',
    },
  ]

  return (
    <div
      className={`${styles.sideMenuContainer} ${collapsed ? styles.sideMenuContainerCollapsed : ''} ${expanded ? styles.expanded : ''}`}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      {/* 展开后的内容 */}
      {!collapsed && (
        <>
          {/* 扩展内容 */}
          <div className={styles.expandArea}>
            <Dropdown
              trigger={['hover']}
              placement="bottomRight"
              align={{
                points: ['bl', 'tl'],
                offset: [186, 74],
              }}
              popupRender={() => (
                <div className={styles.dropdownStyle}>
                  {userMenuItems.map((item: any) => {
                    return <div key={item?.key} className={styles.dropdownItem}>{item.label}</div>
                  })}
                </div>
              )}
              onOpenChange={(open) => setExpanded(open)}
            >
              <div className={styles.extraItem}>
                <div className={styles.leftInfo}>
                  <div className={`${styles.leftIcon} ${styles.leftIcon1}`} />
                  <span className={`${styles.extraItemText} ${styles.extraItemText1}`}>Pylontech</span>
                </div>
                <div className={styles.arrowContainer}>
                  <div className={styles.rightArrowIcon} />
                </div>
              </div>
            </Dropdown>
            <Dropdown
              trigger={['hover']}
              placement="bottomRight"
              align={{
                points: ['bl', 'tl'],
                offset: [186, 74],
              }}
              popupRender={() => (
                <div className={styles.dropdownStyle}>
                  {languageItems.map((item: any) => {
                    return <div key={item?.key} className={styles.dropdownItem}>{item.label}</div>
                  })}
                </div>
              )}
              onOpenChange={(open) => setExpanded(open)}
            >
              <div className={styles.extraItem}>
                <div className={styles.leftInfo}>
                  <div className={`${styles.leftIcon} ${styles.leftIcon2}`} />
                  <span className={`${styles.extraItemText} ${styles.extraItemText2}`}>English</span>
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
                <div className={styles.userName}>Leyu.song</div>
                <div className={styles.roleName}>Admin</div>
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
    </div>
  )
}

export default SiderFooter
