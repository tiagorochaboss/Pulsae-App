import { Lang } from './i18n';

export const DAYS_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const DAYS_AR = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
export const DAYS_FULL_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const MONTHS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const MONTHS_AR = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];

const pad = (n: number) => (n < 10 ? '0' + n : '' + n);

// Dates are stored as local "YYYY-MM-DD" strings.
export const toIso = (d: Date) => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
export const fromIso = (s: string) => {
  const p = s.split('-').map((x) => parseInt(x, 10));
  return new Date(p[0], p[1] - 1, p[2]);
};
export const addDays = (d: Date, n: number) => {
  const x = new Date(d.getTime());
  x.setDate(x.getDate() + n);
  return x;
};
export const addDaysIso = (s: string, n: number) => toIso(addDays(fromIso(s), n));
export const todayIso = () => toIso(new Date());

export function dayName(iso: string, lang: Lang) {
  const d = fromIso(iso).getDay();
  return lang === 'ar' ? DAYS_AR[d] : DAYS_EN[d];
}
export function fmtDate(iso: string, lang: Lang) {
  const d = fromIso(iso);
  const mo = lang === 'ar' ? MONTHS_AR[d.getMonth()] : MONTHS_EN[d.getMonth()];
  return dayName(iso, lang) + ' ' + d.getDate() + ' ' + mo;
}
export function fmtShort(iso: string, lang: Lang) {
  const d = fromIso(iso);
  const mo = lang === 'ar' ? MONTHS_AR[d.getMonth()] : MONTHS_EN[d.getMonth()];
  return d.getDate() + ' ' + mo;
}
export function fmtTime(time: string, lang: Lang) {
  return lang === 'ar' ? time.replace('AM', 'ص').replace('PM', 'م') : time;
}

// "5:00 PM" <-> hour number 17
export function hourLabel(h: number) {
  const suffix = h >= 12 ? 'PM' : 'AM';
  const hh = h % 12 === 0 ? 12 : h % 12;
  return hh + ':00 ' + suffix;
}
export function hourOf(time: string) {
  const m = time.match(/(\d+):(\d+)\s*(AM|PM)/);
  if (!m) return 0;
  let h = parseInt(m[1], 10) % 12;
  if (m[3] === 'PM') h += 12;
  return h;
}
export function startOf(iso: string, time: string) {
  const d = fromIso(iso);
  d.setHours(hourOf(time), 0, 0, 0);
  return d;
}
export function hoursUntil(iso: string, time: string) {
  return (startOf(iso, time).getTime() - Date.now()) / 3600000;
}

export const money = (n: number) => 'SAR ' + (Math.round(n * 100) / 100).toLocaleString('en-US');

export const PACK_DISCOUNT: Record<number, number> = { 4: 5, 8: 10 };
export const PROMOS: Record<string, number> = { WELCOME: 25 };
