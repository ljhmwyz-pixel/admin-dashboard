# Montserrat 字体配置说明

## 已引入的字体文件

项目已成功引入 **4 种字重** 的 Montserrat 字体，按字重排序：

| 文件名 | 字重 | 样式 | 用途 |
|--------|------|------|------|
| `Montserrat-Regular.ttf` | 400 (Normal) | normal | 正文内容、普通文本 |
| `Montserrat-Medium.ttf` | 500 (Medium) | normal | 次级标题、强调文本 |
| `Montserrat-SemiBold.ttf` | 600 (SemiBold) | normal | 主标题、按钮文字 |
| `Montserrat-ExtraBold.ttf` | 800 (ExtraBold) | normal | 特大标题、重要标识 |

## CSS 变量

在 `_globals.scss` 中已定义以下 CSS 变量：

```scss
:root {
  /* 字体家族 - 中英文混排优化 */
  --font-family-base: 
    'Montserrat',           // 英文字体（字重完整）
    'PingFang SC',          // macOS 中文简体
    'Hiragino Sans GB',     // macOS 中文繁体/日文
    'Microsoft YaHei',      // Windows 中文
    'Noto Sans CJK SC',     // Linux/Android 中文简体
    'Noto Sans CJK TC',     // Linux/Android 中文繁体
    -apple-system,           // iOS/macOS 系统字体
    BlinkMacSystemFont,      // macOS Chrome
    'Segoe UI',             // Windows 系统字体
    'Roboto',               // Android 系统字体
    'Helvetica Neue',       // 经典西文字体
    Arial,                 // 通用西文字体
    sans-serif;            // 无衬线字体兜底

  /* 字重 */
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-extrabold: 800;
}
```

### 字体渲染策略

**英文字符**：使用 Montserrat 字体（4 种字重）
- ✅ 数字、字母、西文符号
- ✅ 支持 400/500/600/800 四种字重

**中文字符**：使用系统字体
- 🍎 macOS: PingFang SC / Hiragino Sans GB
- 🪟 Windows: Microsoft YaHei
- 🐧 Linux/Android: Noto Sans CJK

## 使用方式

### 1. 在 SCSS 中使用

```scss
// 使用 CSS 变量
.title {
  font-family: var(--font-family-base);
  font-weight: var(--font-weight-semibold); // 600
}

// 或使用 mixins（如果有）
.text {
  @include font-weight(medium); // 500
}
```

### 2. 在 React 组件中使用

```tsx
// 内联样式
<div style={{ 
  fontFamily: 'var(--font-family-base)',
  fontWeight: 'var(--font-weight-medium)' 
}}>
  中等粗细的文字
</div>

// 或使用 CSS 类
<div className="title">
  标题文字（使用 CSS 类）
</div>
```

### 3. 在 Ant Design 主题中使用

```typescript
// src/config/themes.ts
const baseTheme: ThemeConfig = {
  token: {
    fontFamily: 'var(--font-family-base)',
    fontWeightStrong: 600, // 对应 SemiBold
  },
};
```

## 字重使用规范

### Normal (400)
- ✅ 正文段落
- ✅ 表单输入框文字
- ✅ 表格内容
- ✅ 普通描述性文本

### Medium (500)
- ✅ 次级标题
- ✅ 标签文字
- ✅ 导航菜单项
- ✅ 卡片标题

### SemiBold (600)
- ✅ 主标题
- ✅ 按钮文字
- ✅ 重要提示文字
- ✅ Tab 选中状态

### ExtraBold (800)
- ✅ 页面大标题
- ✅ Logo 文字
- ✅ 数据展示（大数字）
- ✅ 特别强调的文字

## 性能优化

所有字体都使用了 `font-display: swap`，确保：
- ⚡ 字体加载期间文字仍然可见
- ⚡ 避免 FOIT（Flash of Invisible Text）
- ⚡ 提升页面加载性能

## 浏览器兼容性

Montserrat 字体支持所有现代浏览器：
- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari
- ✅ Opera

## 备用字体方案

如果 Montserrat 加载失败，会自动降级到系统字体：
```
'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif
```

## 示例代码

### 完整的标题样式

```scss
.pageTitle {
  font-family: var(--font-family-base);
  font-weight: var(--font-weight-extrabold); // 800
  font-size: 32px;
  line-height: 1.2;
  color: var(--color-text-primary);
}

.sectionTitle {
  font-family: var(--font-family-base);
  font-weight: var(--font-weight-semibold); // 600
  font-size: 24px;
  line-height: 1.3;
  color: var(--color-text-primary);
}

.cardTitle {
  font-family: var(--font-family-base);
  font-weight: var(--font-weight-medium); // 500
  font-size: 16px;
  line-height: 1.5;
  color: var(--color-text-primary);
}

.bodyText {
  font-family: var(--font-family-base);
  font-weight: var(--font-weight-normal); // 400
  font-size: 14px;
  line-height: 1.6;
  color: var(--color-text-secondary);
}
```

## 注意事项

1. **不要修改 `font-style`**：所有字体都设置为 `normal`，不需要 italic 斜体
2. **使用 CSS 变量**：优先使用 `--font-weight-*` 变量，而不是直接写数字
3. **保持一致性**：同一层级的文字应使用相同的字重
4. **适度使用粗体**：避免过多使用粗字重，会降低视觉层次

## 相关文件

- 字体文件位置：`/public/fonts/`
- 字体声明：`/src/index.module.scss`
- CSS 变量：`/src/shared/styles/_globals.scss`
- 主题配置：`/src/config/themes.ts`
