import React from 'react'

import { Dropdown } from 'antd'
import {
  LogoutOutlined,
  BgColorsOutlined,
  GlobalOutlined
} from '@ant-design/icons';
import avatarIcon from '../../../public/avatar_icon.png'
import moreIcon from '../../../public/more_icon.png'
import footLanguageIcon from '../../../public/foot_language_icon.png'
import footUserIcon from '../../../public/foot_user_icon.png'
import footerArrowRightActiveIcon from '../../../public/footer_arrow_right_active_icon.png'
import footerArrowRightDefaultIcon from '../../../public/footer_arrow_right_default_icon.png'
import styles from './SiderFooter.module.scss'

interface Props {
  collapsed: boolean
}

const SiderFooter: React.FC<Props> = ({ collapsed }) => {

  const userMenuItems = [
    {
      key: 'theme',
      label: (
        <div style={{ display: 'flex', justifyContent: 'space-between', width: 140 }}>
          <span>
            <BgColorsOutlined /> Theme
          </span>
          {/* <Switch
            size="small"
            checked={mode === 'dark'}
            onChange={() => dispatch(toggleTheme())}
          /> */}
        </div>
      ),
    },
    {
      key: 'lang',
      label: (
        <div>
          <GlobalOutlined /> Language
          {/* <div style={{ marginTop: 8 }}>
            <div onClick={() => changeLang('en')}>English</div>
            <div onClick={() => changeLang('zh')}>中文</div>
          </div> */}
        </div>
      ),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
    },
  ]
  return (
    <div
      className={`${styles.sideMenuContainer} ${collapsed ? styles.sideMenuContainerCollapsed : ''}`}
    >
      {/* 展开后的内容 */}
      {!collapsed && (
        <>
          {/* 先放扩展内容 */}
          <div className={styles.expandArea}>
            <div className={styles.extraItem}>
              <div className={styles.leftInfo}>
                <img src={footUserIcon} className={styles.leftIcon} alt="footUserIcon" />
                <span className={styles.extraItemText}>Pylontech</span>
              </div>
              <img src={footerArrowRightDefaultIcon} className={styles.rightArrowIcon} alt="footerArrowRightDefaultIcon" />
            </div>
            <div className={styles.extraItem}>
              <div className={styles.leftInfo}>
                <img src={footLanguageIcon} className={styles.leftIcon} alt="footLanguageIcon" />
                <span className={styles.extraItemText}>English</span>
              </div>
              <img src={footerArrowRightActiveIcon} className={styles.rightArrowIcon} alt="footerArrowRightDefaultIcon" />
            </div>
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
