import React from 'react';

interface ProductManagementProps {
  tab?: string;
}

const ProductManagement: React.FC<ProductManagementProps> = ({ tab = 'list' }) => {
  return (
    <div>
      <h1>商品管理页面</h1>
      <p>当前标签页: {tab}</p>
      <p>这里将展示商品管理功能</p>
    </div>
  );
};

export default ProductManagement;