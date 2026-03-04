# 全局Loading状态封装使用指南

## 概述

本项目已经封装了全局loading状态管理，提供了简洁易用的API和组件。

## 核心文件

- `src/shared/hooks/useGlobalLoading.ts` - 全局loading状态管理hook
- `src/shared/components/GlobalLoading/` - 全局loading组件
- `src/core/store/slices/uiSlice.ts` - Redux状态存储

## 使用方法

### 1. 基础使用 - Hook方式

```typescript
import { useGlobalLoading } from '../../shared/hooks/useGlobalLoading';

const MyComponent = () => {
  const { 
    isLoading,      // 当前loading状态
    showLoading,    // 显示loading
    hideLoading,    // 隐藏loading
    toggleLoading,  // 切换loading状态
    withLoading     // 带loading的异步操作包装器
  } = useGlobalLoading();

  // 手动控制loading
  const handleClick = () => {
    showLoading();
    // 执行一些操作
    setTimeout(() => {
      hideLoading();
    }, 2000);
  };

  // 使用withLoading包装异步操作
  const loadData = async () => {
    await withLoading(async () => {
      const response = await fetch('/api/data');
      const data = await response.json();
      // 处理数据
      return data;
    });
  };

  return (
    <div>
      <button onClick={handleClick}>手动控制Loading</button>
      <button onClick={loadData}>自动Loading</button>
    </div>
  );
};
```

### 2. 高级使用 - withLoading选项

```typescript
const advancedExample = async () => {
  await withLoading(
    async () => {
      // 你的异步操作
      return await fetchData();
    },
    {
      autoHide: false, // 不自动隐藏loading
      onSuccess: (result) => {
        console.log('数据加载成功:', result);
      },
      onError: (error) => {
        console.error('数据加载失败:', error);
        // 显示错误提示
      }
    }
  );
  
  // 手动控制loading的显示/隐藏
  hideLoading(); // 在适当的时候手动隐藏
};
```

### 3. 组件方式使用

```typescript
import GlobalLoading from '../../shared/components/GlobalLoading';

const MyPage = () => {
  const { isLoading } = useGlobalLoading();
  
  return (
    <div>
      {/* 其他内容 */}
      
      {/* 全局loading覆盖层 */}
      <GlobalLoading 
        visible={isLoading}
        tip="正在加载数据..."
      />
    </div>
  );
};
```

### 4. 在BaseLayout中的集成

BaseLayout已经集成了全局loading组件，无需额外配置。当任何地方调用`showLoading()`时，整个页面都会显示loading覆盖层。

## API参考

### useGlobalLoading Hook

返回对象包含以下属性：

| 属性 | 类型 | 说明 |
|------|------|------|
| `isLoading` | `boolean` | 当前loading状态 |
| `showLoading` | `() => void` | 显示loading |
| `hideLoading` | `() => void` | 隐藏loading |
| `toggleLoading` | `() => void` | 切换loading状态 |
| `withLoading` | `<T>(asyncFn, options) => Promise<T>` | 带loading的异步操作包装器 |

### withLoading 选项

```typescript
interface WithLoadingOptions {
  autoHide?: boolean;        // 是否自动隐藏loading，默认true
  onError?: (error: any) => void;  // 错误处理回调
  onSuccess?: (result: T) => void; // 成功回调
}
```

### GlobalLoading 组件

Props接口：

```typescript
interface GlobalLoadingProps {
  visible?: boolean;      // 是否显示loading
  tip?: string;          // loading文本
  spinProps?: SpinProps; // Ant Design Spin组件属性
  className?: string;    // 自定义CSS类名
  style?: CSSProperties; // 自定义内联样式
}
```

## 最佳实践

1. **优先使用withLoading**: 对于异步操作，推荐使用`withLoading`包装器，它会自动处理loading状态的显示和隐藏。

2. **错误处理**: 在`withLoading`的`onError`回调中处理错误，确保用户体验良好。

3. **手动控制场景**: 只有在需要精确控制loading时机时才使用手动的`showLoading/hideLoading`。

4. **避免嵌套**: 不要在已经使用`withLoading`的函数内部再次调用loading相关的函数。

## 示例场景

### 场景1: 页面初始化加载
```typescript
useEffect(() => {
  withLoading(async () => {
    const userData = await fetchUserData();
    const orgData = await fetchOrganizationData();
    // 更新状态
  });
}, []);
```

### 场景2: 表单提交
```typescript
const handleSubmit = async (values) => {
  await withLoading(
    () => submitForm(values),
    {
      onSuccess: () => {
        message.success('提交成功');
        navigate('/success');
      },
      onError: (error) => {
        message.error('提交失败: ' + error.message);
      }
    }
  );
};
```

### 场景3: 长时间运行的任务
```typescript
const handleLongTask = async () => {
  await withLoading(
    async () => {
      // 执行长时间任务
      await longRunningProcess();
    },
    { autoHide: false } // 不自动隐藏
  );
  
  // 任务完成后手动隐藏
  setTimeout(hideLoading, 1000);
};
```

这样封装的好处是：
- 代码更加简洁清晰
- 统一的loading状态管理
- 自动的错误处理
- 可复用性强
- 易于维护和扩展