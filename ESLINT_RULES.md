# ESLint 规范说明

## 导入顺序规范

按照以下顺序组织导入语句：

1. **第三方库**（核心库优先）
   - React相关：`react`, `react-dom`
   - 其他第三方库

2. **第三方UI库/工具库**
   - Ant Design：`antd`, `@ant-design/*`
   - 其他UI组件库和工具库

3. **绝对路径导入**
   - 项目内部模块：`components`, `config`, `hooks`, `styles`, `types`, `utils`

4. **相对路径导入**
   - 同级和上级目录引用

5. **样式文件**
   - CSS/SCSS文件

## 代码规范要点

### TypeScript规范
- 显式声明函数返回类型
- 避免使用 `any` 类型
- 正确处理未使用的变量（使用 `_` 前缀）

### React规范
- 使用函数式组件和Hooks
- 正确使用useEffect依赖数组
- 组件导出使用默认导出

### 代码质量
- 禁止使用 `console.log`（允许 `console.warn` 和 `console.error`）
- 禁止使用 `debugger`
- 优先使用 `const` 和箭头函数
- 对象属性使用简写形式

## 自动化检查

### 提交前检查
每次 `git commit` 时会自动执行：
- ESLint代码检查和自动修复
- TypeScript类型检查

### 手动检查命令
```bash
# 运行ESLint检查
pnpm lint

# 运行ESLint并自动修复
pnpm lint:fix

# 运行TypeScript类型检查
pnpm type-check
```

## 配置文件说明

- `.eslintrc.js` - ESLint核心配置
- `.lintstagedrc.json` - lint-staged配置
- `.husky/pre-commit` - Git pre-commit钩子