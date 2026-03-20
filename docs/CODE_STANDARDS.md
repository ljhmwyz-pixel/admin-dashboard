# 代码规范

### 文件结构

> 同一页面（组件）文件结构，类型定义抽出单独文件，同业务组件放在同一文件夹

#### 具体文件内容：

- index.tsx （主文件）
- index.module.scss （样式文件）
- dto.ts(定义类型)
- utils.ts（页面使用到的公共方法）/utils(文件夹)
- components（文件夹，页面组件）
- hooks(文件夹，页面使用到的hooks)

## 文件命名

```js
// 组件文件：PascalCase
UserProfile.jsx;
UserProfileCard.jsx;

// 工具函数：camelCase
formatDate.js;
validateForm.js;

// 常量文件：camelCase
apiConstants.ts;

// 类型定义：PascalCase
UserInterface;

// hooks：camelCase
useDebounce.ts;
```

## 文件夹命名

- 组件：PascalCase（`UserProfileCard`）
- 其他：kebab-case（`common-unit`）

## 变量命名

```js
// 常量：大写字母
const MAX_COUNT = 100;
const API_BASE_URL = 'https://api.example.com';

// 普通变量：camelCase
const userName = 'John';
const isLoading = true;

// 布尔值：is/has/should 开头
const isVisible = true;
const hasPermission = false;
const shouldShowModal = true;

// 数组：复数形式
const users = [];
const userList = [];

// 函数：动词开头
const getUserData = () => {};
const handleClick = () => {};
const onSearch = () => {};
```

## 组件命名

```js
// 组件名：PascalCase
const UserProfile = () => { ... }

// 高阶组件：with 开头
const withAuth = (Component) => { ... }

// 自定义 Hook：use 开头
const useWindowSize = () => { ... }
```

## 组件规范

> 默认使用函数式组件

### 组件结构

```js
import React, { useState, useEffect } from 'react';

/**
 * 用户资料组件
 */
const UserProfile = () => {
  return <div></div>;
};

export default UserProfile;
```

### 组件结构顺序

```js
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';

const UserProfile = ({ userId }) => {
  // 1. refs
  const inputRef = useRef(null);

  // 2. state
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // 3. context（省略）

  // 4. Redux（省略）

  // 5. 自定义 hooks（省略）

  // 6. useMemo/useCallback/useEffect
  const displayName = useMemo(() => {
    return user ? `${user.name} (${user.age}岁)` : '';
  }, [user]);

  const fetchUser = useCallback(async () => {
    setLoading(true);
    const data = await api.getUser(userId);
    setUser(data);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // 7. 辅助函数
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  // 8. 事件处理
  const handleClick = () => {
    console.log('用户点击');
  };

  // 9. render逻辑
  const renderContent = () => {
    if (loading) return <div>加载中...</div>;
    if (error) return <div>出错了：{error}</div>;
    return <div>内容：{count}</div>;
  };

  // 10. return JSX
  return (
    <div>
      <h1 ref={inputRef}>{displayName}</h1>
      <p>注册时间：{formatDate(user.createdAt)}</p>
      {renderContent()}
      <button onClick={handleClick}>点击</button>
    </div>
  );
};

export default UserProfile;
```

## 注释规范

```js
/**
 * XXX
 */
const getUserInfo = () => {
  // 实现代码
};

/**
 * XXX
 */
const findUser = () => {
  // ...
};
```

## 导入顺序

```js
// 1. 第三方库（核心库优先）
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

// 2. 第三方 UI 库/工具库
import { Button, Modal } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';

// 3. 绝对路径导入
import { API_BASE_URL } from '@/config';
import { formatDate } from '@/utils/helpers';
import { UserType } from '@/types';

// 4. 相对路径导入
import Header from './components/Header';
import { useAuth } from './hooks/useAuth';
import { userStore } from './store';

// 5. 样式文件
import styles from './index.module.scss';

const App = () => {
  return (
    <div>
      <Header />
    </div>
  );
};

export default App;
```

## 提交规范

- feat: 新功能

- fix: 修复 bug

- docs: 文档更新

- style: 代码格式（不影响功能）

- refactor: 重构

- perf: 性能优化

- test: 测试

- chore: 构建过程或辅助工具变动
