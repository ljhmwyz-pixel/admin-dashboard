/**
 * REM适配工具函数
 */

// 设计稿基准宽度
const BASE_WIDTH = 1920;
// 根元素字体大小
const ROOT_FONT_SIZE = 16;

/**
 * 将PX转换为REM
 * @param px 像素值
 * @returns REM字符串
 */
export const pxToRem = (px: number): string => {
  const rem = px / ROOT_FONT_SIZE;

  return `${rem}rem`;
};

/**
 * 批量转换PX到REM
 * @param pxValues 像素值数组
 * @returns REM字符串数组
 */
export const pxToRemBatch = (...pxValues: number[]): string[] => {
  return pxValues.map((px) => pxToRem(px));
};

/**
 * 设置根字体大小以实现REM适配
 */
export const setupREM = () => {
  const handleResize = () => {
    const screenWidth = window.innerWidth;
    const scale = screenWidth / BASE_WIDTH;
    const fontSize = Math.max(12, Math.min(20, ROOT_FONT_SIZE * scale));
    document.documentElement.style.fontSize = `${fontSize}px`;
  };

  // 初始化
  handleResize();

  // 监听窗口变化
  window.addEventListener('resize', handleResize);

  // 返回清理函数
  return () => {
    window.removeEventListener('resize', handleResize);
  };
};

/**
 * 获取当前REM基准值
 * @returns 当前根字体大小
 */
export const getCurrentRootFontSize = (): number => {
  return parseFloat(getComputedStyle(document.documentElement).fontSize);
};
