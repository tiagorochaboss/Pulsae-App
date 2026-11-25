import React from 'react';
import { Pressable, Text as RNText, View } from 'react-native';
import { colors, fonts } from '../theme';
import { Text } from './ui';
import { Lang } from '../i18n';

// Colour and artwork used to make Community and the professional app feel lively.
// Artwork is built from colour, shapes and emoji, so it needs no image files.
export type CatTheme = { solid: string; pale: string; dark: string; emoji: string };

export const CAT: Record<string, CatTheme> = {
  All: { solid: colors.coral, pale: colors.pale, dark: colors.coralDark, emoji: '✨' },
  Events: { solid: colors.plum, pale: colors.plumPale, dark: colors.plumDark, emoji: '🎉' },
  Tips: { solid: colors.sun, pale: colors.sunPale, dark: colors.sunDark, emoji: '💡' },
  Exercise: { solid: colors.coral, pale: colors.pale, dark: colors.coralDark, emoji: '💪' },
  Recovery: { solid: colors.sky, pale: colors.skyPale, dark: colors.skyDark, emoji: '🧘' },
  Nutrition: { solid: colors.mint, pale: colors.mintPale, dark: colors.mintDark, emoji: '🥗' },
};
export const catOf = (category?: string, event?: boolean): CatTheme => CAT[event ? 'Events' : category || 'All'] || CAT.All;

// Filter chip in the colour of its topic.
export function CatChip({ label, on, onPress }: { label: string; on?: boolean; onPress?: () => void }) {
  const c = CAT[label] || CAT.All;
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={{ height: 38, paddingHorizontal: 14, borderRadius: 19, backgroundColor: on ? c.solid : c.pale, flexDirection: 'row', alignItems: 'center', gap: 6 }}
    >
      <RNText style={{ fontSize: 15 }}>{c.emoji}</RNText>
      <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: on ? colors.white : c.dark }}>{label}</Text>
    </Pressable>
  );
}

// A coloured banner with soft circles and a big emoji. Children sit on top of it.
export function ArtBand({ theme, height = 92, emoji, children }: { theme: CatTheme; height?: number; emoji?: string; children?: React.ReactNode }) {
  return (
    <View style={{ height, backgroundColor: theme.pale, overflow: 'hidden', justifyContent: 'center' }}>
      <View style={{ position: 'absolute', end: -26, top: -34, width: 130, height: 130, borderRadius: 65, backgroundColor: theme.solid, opacity: 0.2 }} />
      <View style={{ position: 'absolute', end: 70, bottom: -40, width: 84, height: 84, borderRadius: 42, backgroundColor: theme.solid, opacity: 0.12 }} />
      <View style={{ position: 'absolute', start: -20, bottom: -36, width: 90, height: 90, borderRadius: 45, backgroundColor: theme.solid, opacity: 0.1 }} />
      <RNText style={{ position: 'absolute', end: 22, bottom: 10, fontSize: Math.round(height * 0.5) }}>{emoji || theme.emoji}</RNText>
      {children}
    </View>
  );
}

const MONTHS: Record<Lang, string[]> = {
  en: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
  ar: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
};

// Small calendar tile for events.
export function DateBadge({ iso, lang }: { iso: string; lang: Lang }) {
  const m = Number(iso.slice(5, 7)) - 1;
  const d = Number(iso.slice(8, 10));
  return (
    <View style={{ width: 54, paddingVertical: 6, borderRadius: 14, backgroundColor: colors.white, alignItems: 'center' }}>
      <RNText style={{ fontFamily: lang === 'ar' ? 'Cairo_600SemiBold' : fonts.semibold, fontSize: 10, color: colors.plumDark }}>{MONTHS[lang][m] || ''}</RNText>
      <RNText style={{ fontFamily: fonts.semibold, fontSize: 20, lineHeight: 24, color: colors.ink }}>{String(d)}</RNText>
    </View>
  );
}

export const QUOTES = [
  'Small steps every day add up.',
  'Move today. Thank yourself tomorrow.',
  'Strong body, calm mind.',
  'Progress, not perfection.',
  'Recovery is part of the plan.',
  'You showed up. That is the win.',
  'Be kind to your body. It carries you.',
];
export const dailyQuote = () => QUOTES[Math.floor(Date.now() / 86400000) % QUOTES.length];

// Big friendly banner at the top of a screen.
export function Hero({ kicker, title, emoji = '🌟', tone = 'coral', children }: { kicker?: string; title: string; emoji?: string; tone?: 'coral' | 'mint' | 'plum' | 'sky'; children?: React.ReactNode }) {
  const bg = tone === 'mint' ? colors.mint : tone === 'plum' ? colors.plum : tone === 'sky' ? colors.sky : colors.coral;
  return (
    <View style={{ backgroundColor: bg, borderRadius: 24, padding: 18, overflow: 'hidden', gap: 6 }}>
      <View style={{ position: 'absolute', end: -30, top: -40, width: 150, height: 150, borderRadius: 75, backgroundColor: colors.white, opacity: 0.14 }} />
      <View style={{ position: 'absolute', end: 60, bottom: -50, width: 100, height: 100, borderRadius: 50, backgroundColor: colors.white, opacity: 0.1 }} />
      <RNText style={{ position: 'absolute', end: 18, top: 12, fontSize: 40 }}>{emoji}</RNText>
      {kicker ? <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: colors.white, opacity: 0.9, paddingEnd: 56 }}>{kicker}</Text> : null}
      <Text style={{ fontFamily: fonts.semibold, fontSize: 19, lineHeight: 27, color: colors.white, paddingEnd: 56 }}>{title}</Text>
      {children}
    </View>
  );
}

// Small coloured number tile.
export function StatTile({ value, label, tone }: { value: string; label: string; tone: 'sky' | 'sun' | 'mint' | 'plum' }) {
  const pal = { sky: [colors.skyPale, colors.skyDark], sun: [colors.sunPale, colors.sunDark], mint: [colors.mintPale, colors.mintDark], plum: [colors.plumPale, colors.plumDark] }[tone];
  return (
    <View style={{ flex: 1, backgroundColor: pal[0], borderRadius: 18, padding: 12, gap: 2 }}>
      <RNText style={{ fontFamily: fonts.semibold, fontSize: 22, color: pal[1] }}>{value}</RNText>
      <Text style={{ fontFamily: fonts.medium, fontSize: 11, lineHeight: 15, color: pal[1] }}>{label}</Text>
    </View>
  );
}
