# Redux Toolkit 状态管理

## 概述
项目集成了Redux Toolkit作为全局状态管理解决方案，目前实现了全局loading状态管理。

## 目录结构
```
src/
├── store/
│   ├── index.ts              # Redux store配置
│   └── slices/
│       └── loadingSlice.ts   # loading状态slice
├── hooks/
│   └── redux.ts             # Redux相关自定义hooks
└── components/
    ├── GlobalLoading/       # 全局loading组件
    └── LoadingDemo/         # loading演示组件
```

## 核心功能

### 1. 全局Loading状态
- 支持多个并发loading任务
- 自动管理loading状态的开启和关闭
- 提供全局遮罩层显示

### 2. 使用方式

#### 基础使用
```typescript
import { useLoading } from '@/hooks/redux';

const MyComponent = () => {
  const { showLoading, hideLoading, globalLoading } = useLoading();
  
  const handleClick = () => {
    showLoading('my-task');
    // 执行一些操作
    setTimeout(() => {
      hideLoading('my-task');
    }, 1000);
  };
  
  return (
    <div>
      <button onClick={handleClick}>开始加载</button>
      {globalLoading && <div>正在加载...</div>}
    </div>
  );
};
```

#### 异步操作包装
```typescript
import { useAsyncLoading } from '@/hooks/redux';

const MyComponent = () => {
  const { withLoading } = useAsyncLoading();
  
  const fetchData = async () => {
    await withLoading('fetch-data', async () => {
      const response = await fetch('/api/data');
      const data = await response.json();
      // 处理数据
      return data;
    });
  };
  
  return <button onClick={fetchData}>获取数据</button>;
};
```

### 3. API参考

#### useLoading Hook
```typescript
const {
  globalLoading,     // 全局loading状态
  showLoading,       // 显示loading (key: string)
  hideLoading,       // 隐藏loading (key: string)
  clearAllLoading    // 清除所有loading
} = useLoading();
```

#### useAsyncLoading Hook
```typescript
const {
  withLoading        // 包装异步操作的高阶函数
} = useAsyncLoading();

// 使用方式
await withLoading('task-key', async () => {
  // 异步操作
});
```

## 状态管理机制

### Loading计数器模式
- 每个loading任务都有唯一的key标识
- 使用计数器避免重复调用导致的状态异常
- 支持同一任务的多次并发请求

### 自动状态清理
- 当所有loading任务完成时，自动关闭全局loading
- 组件卸载时自动清理相关状态

## 最佳实践

1. **使用有意义的key命名**
   ```typescript
   // 推荐
   showLoading('user-profile-fetch');
   
   // 不推荐
   showLoading('loading1');
   ```

2. **及时清理loading状态**
   ```typescript
   // 在try-finally中使用
   try {
     showLoading('task');
     await doSomething();
   } finally {
     hideLoading('task');
   }
   ```

3. **合理使用异步包装**
   ```typescript
   // 适合网络请求、数据处理等场景
   await withLoading('data-processing', async () => {
     // 复杂的异步操作
   });
   ```

## 扩展建议

未来可以根据需要添加更多的状态slice：
- 用户认证状态
- 应用配置状态
- 表单状态管理
- 缓存状态管理