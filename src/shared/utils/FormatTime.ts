import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

import 'dayjs/locale/zh-cn';
import 'dayjs/locale/ja';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);

/** 获取用户时区 */
export const getUserTimezone = () => dayjs.tz.guess();

/** 设置语言 */
export const setDayjsLocale = (lang?: string) => {
  if (!lang) return;
  if (lang.startsWith('zh')) dayjs.locale('zh-cn');
  else if (lang.startsWith('ja')) dayjs.locale('ja');
  else dayjs.locale('en');
};

/** UTC → 本地完整时间 */
export const formatDateTime = (time?: string) => {
  if (!time) return '-';
  return dayjs.utc(time).tz(getUserTimezone()).format('YYYY-MM-DD HH:mm:ss');
};

/** 只日期 */
export const formatDate = (time?: string) => {
  if (!time) return '-';
  return dayjs.utc(time).tz(getUserTimezone()).format('YYYY-MM-DD');
};

/** 只时间 */
export const formatTime = (time?: string) => {
  if (!time) return '-';
  return dayjs.utc(time).tz(getUserTimezone()).format('HH:mm:ss');
};

/** 相对时间 */
export const formatFromNow = (time?: string) => {
  if (!time) return '-';
  return dayjs.utc(time).tz(getUserTimezone()).fromNow();
};

/** Table 时间排序 */
export const sortByTime = (a?: string, b?: string) => {
  return dayjs(a).valueOf() - dayjs(b).valueOf();
};

/** DatePicker 默认值转换 */
export const toDayjs = (time?: string) => {
  if (!time) return null;
  return dayjs.utc(time).tz(getUserTimezone());
};
