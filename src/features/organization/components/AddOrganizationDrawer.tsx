import React from 'react';
import { Drawer } from 'antd';

import type { OrganizationType, TreeNodeData } from '@/shared/types/organization';

interface AddOrganizationProps {
  visible: boolean;
  onChange: (visible: boolean) => void;
  currentParentNode?: TreeNodeData;

  parentOrgType?: OrganizationType; // 当前组织的类型，用于决定可选的组织类型
}

const AddOrganizationDrawer: React.FC<AddOrganizationProps> = ({
  visible,
  onChange,
  parentOrgType,
}) => {
  return (
    <Drawer
      size="large"
      placement="right"
      closable={false}
      // onClose={handleCancel}
      open={visible}
    />
  );
};

export default AddOrganizationDrawer;
