import { Checkbox, Dropdown } from 'antd';
import classNames from 'classnames';

import styles from './HeaderFilter.module.scss';

interface Props {
  title: React.ReactNode;
  value?: any;
  config: any;
  onChange?: (val: any) => void;
}

export default function HeaderFilter({ title, value, config, onChange }: Props) {
  const overlay = (
    <div className={styles.menu}>
      <Checkbox.Group options={config.options} value={value} onChange={onChange} />
    </div>
  );
  const isFilterActive = (val: any) => {
    if (Array.isArray(val)) return val.length > 0;
    return val !== undefined && val !== null && val !== '';
  };
  return (
    <Dropdown popupRender={() => overlay} trigger={['click']} placement="bottomLeft">
      <div
        className={classNames(styles.trigger, {
          [styles.active]: isFilterActive(value),
        })}
      >
        {title}
        <svg width="6" height="4" viewBox="0 0 6 4" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M4.80059 3.7334H0.400586C0.0709679 3.7334 -0.117185 3.35709 0.080586 3.0934L2.28059 0.160065C2.44059 -0.0532682 2.76059 -0.0532682 2.92059 0.160065L5.12059 3.0934C5.31836 3.35709 5.1302 3.7334 4.80059 3.7334Z"
            fill="#33C2C8"
          />
        </svg>
      </div>
    </Dropdown>
  );
}
