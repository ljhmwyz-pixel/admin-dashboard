import React from 'react';

// import { useTheme } from '@shared/hooks/theme';
import { ImageIcons } from '@/components';

import styles from './SiderHeader.module.scss';

interface Props {
  collapsed: boolean;
  onToggle: () => void;
}

const SiderHeader: React.FC<Props> = ({ collapsed, onToggle }) => {
  // const { isDarkMode } = useTheme();

  return (
    <div className={`${styles.siderHeader_container} ${collapsed && styles.collapsed}`}>
      {/* 展开时左侧 logo */}
      <div className={styles.logo_container}>
        <img src={ImageIcons.header.Logo} className={styles.logo} />
        <img src={ImageIcons.header.LogoText} className={styles.logo_text} />
      </div>

      {/* toggle 区域 */}
      <div className={styles.toggle} onClick={onToggle}>
        {/* 折叠时显示的小 logo */}
        <img src={ImageIcons.header.Logo} className={styles.logo_collapsed} />
        <img
          src={collapsed ? ImageIcons.header.collapsedClose : ImageIcons.header.collapsedOpen}
          className={styles.collapsedIcon}
        />
      </div>
    </div>
  );
};

export default SiderHeader;
