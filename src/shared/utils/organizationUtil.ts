/**
 * 检测字符串是否包含 emoji
 * @param str - 待检测的字符串
 * @returns 如果包含 emoji 返回 true，否则返回 false
 */
export const containsEmoji = (str: string): boolean => {
  if (!str) return false;

  // emoji 正则表达式模式
  const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/u;
  return emojiRegex.test(str);
};

/**
 * 获取字符串的实际字符数（考虑 emoji 和多字节字符）
 * @param str - 待计算的字符串
 * @returns 字符长度
 */
export const getStringLength = (str: string): number => {
  if (!str) return 0;

  // 使用 Array.from 正确处理 emoji 和多字节字符
  return Array.from(str).length;
};

/**
 * 移除字符串中的所有 emoji
 * @param str - 待处理的字符串
 * @returns 移除 emoji 后的字符串
 */
export const removeEmoji = (str: string): string => {
  if (!str) return '';

  const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;
  return str.replace(emojiRegex, '');
};
