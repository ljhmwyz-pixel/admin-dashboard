import React from 'react'
import Logo from '@/assets/images/layout/logo.png'
import LogoText from '@/assets/images/layout/logo-text.png'
import collapsedOpen from '@/assets/images/layout/collapsed_open.png'
import collapsedClose from '@/assets/images/layout/collapsed_close.png'
import styles from './SiderHeader.module.scss'

interface Props {
  collapsed: boolean
  onToggle: () => void
}

const SiderHeader: React.FC<Props> = ({ collapsed, onToggle }) => {
  return (
    <div className={`${styles.siderHeader_container} ${collapsed ? styles.collapsed : ''}`} >
      {/* 展开时左侧 logo */}
      <div className={styles.logo_container}>
        <img src={Logo} className={styles.logo} />
        <img src={LogoText} className={styles.logo_text} />
      </div>

      {/* 右侧 toggle 区域 */}
      <div
        className={styles.toggle}
        onClick={onToggle}
      >

        {/* 折叠时显示的小 logo */}
        <img src={Logo} className={styles.logo_collapsed} />
        <img
          src={collapsed ? collapsedClose : collapsedOpen}
          className={styles.collapsedIcon}
        />
      </div>
    </div>
  )
}

export default SiderHeader
