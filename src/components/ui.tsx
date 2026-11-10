import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text as RNText,
  TextInput,
  TextInputProps,
  TextProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { arFonts, colors, fonts, radius } from '../theme';
import { useI18n } from '../i18n';

// Text that translates plain-string children and swaps Poppins for Cairo in Arabic.
export function Text({ children, style, ...rest }: TextProps) {
  const { lang, t } = useI18n();
  let content: React.ReactNode = children;
  if (lang === 'ar' && typeof children === 'string') content = t(children).replace(/SAR/g, 'ر.س');
  let st: StyleProp<TextStyle> = style;
  if (lang === 'ar') {
    const flat = StyleSheet.flatten(style) || {};
    const ff = flat.fontFamily as string | undefined;
    st = [flat, { fontFamily: (ff && arFonts[ff]) || arFonts[fonts.regular] }];
  }
  return (
    <RNText {...rest} style={st}>
      {content}
    </RNText>
  );
}

export function Icon({ name, size = 22, color = colors.ink }: { name: any; size?: number; color?: string }) {
  const { rtl } = useI18n();
  let n = name as string;
  if (rtl) {
    if (n === 'chevron-right') n = 'chevron-left';
    else if (n === 'chevron-left') n = 'chevron-right';
    else if (n === 'arrow-right') n = 'arrow-left';
    else if (n === 'arrow-left') n = 'arrow-right';
  }
  return <Feather name={n as any} size={size} color={color} />;
}

export function Btn({
  label,
  onPress,
  kind = 'primary',
  disabled,
  style,
}: {
  label: string;
  onPress?: () => void;
  kind?: 'primary' | 'outline' | 'small' | 'smallPrimary' | 'danger';
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const s = btnStyles[kind];
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [s.box, pressed && { opacity: 0.85 }, disabled && { opacity: 0.4 }, style]}
    >
      <Text style={s.text}>{label}</Text>
    </Pressable>
  );
}

const btnStyles = {
  primary: StyleSheet.create({
    box: { height: 52, borderRadius: 26, backgroundColor: colors.coral, alignItems: 'center', justifyContent: 'center' },
    text: { color: colors.white, fontFamily: fonts.semibold, fontSize: 16 },
  }),
  outline: StyleSheet.create({
    box: { height: 52, borderRadius: 26, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
    text: { color: colors.ink, fontFamily: fonts.medium, fontSize: 15 },
  }),
  danger: StyleSheet.create({
    box: { height: 52, borderRadius: 26, borderWidth: 1.5, borderColor: colors.coral, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
    text: { color: colors.coralDark, fontFamily: fonts.medium, fontSize: 15 },
  }),
  small: StyleSheet.create({
    box: { height: 40, paddingHorizontal: 16, borderRadius: 20, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
    text: { color: colors.ink, fontFamily: fonts.medium, fontSize: 13 },
  }),
  smallPrimary: StyleSheet.create({
    box: { height: 40, paddingHorizontal: 16, borderRadius: 20, backgroundColor: colors.coral, alignItems: 'center', justifyContent: 'center' },
    text: { color: colors.white, fontFamily: fonts.semibold, fontSize: 13 },
  }),
};

export function Chip({ label, on, onPress }: { label: string; on?: boolean; onPress?: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[styles.chip, on && { backgroundColor: colors.ink, borderColor: colors.ink }]}
    >
      <Text style={[styles.chipText, on && { color: colors.white }]}>{label}</Text>
    </Pressable>
  );
}

export function Tag({ label, tone = 'pale' }: { label: string; tone?: 'pale' | 'gray' | 'dark' | 'outline' }) {
  const map = {
    pale: { bg: colors.pale, fg: colors.coralDark, bd: colors.pale },
    gray: { bg: '#F4F1EF', fg: '#4A4543', bd: '#F4F1EF' },
    dark: { bg: colors.ink, fg: colors.white, bd: colors.ink },
    outline: { bg: colors.white, fg: colors.coralDark, bd: colors.coral },
  }[tone];
  return (
    <View style={{ backgroundColor: map.bg, borderColor: map.bd, borderWidth: 1, borderRadius: 11, paddingHorizontal: 8, height: 22, justifyContent: 'center', alignSelf: 'flex-start' }}>
      <Text style={{ color: map.fg, fontFamily: fonts.medium, fontSize: 10 }}>{label}</Text>
    </View>
  );
}

export function Card({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function Field({ label, error, ...props }: { label: string; error?: string } & TextInputProps) {
  const { t, rtl } = useI18n();
  return (
    <View style={{ gap: 6 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholderTextColor="#9A908B"
        {...props}
        placeholder={props.placeholder ? t(props.placeholder) : undefined}
        style={[styles.input, { textAlign: rtl ? 'right' : 'left' }, error ? { borderColor: colors.coral } : null, props.style]}
      />
      {error ? <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: colors.coralDark }}>{error}</Text> : null}
    </View>
  );
}

export function Avatar({ size = 48, icon = 'user' }: { size?: number; icon?: any }) {
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: colors.pale, alignItems: 'center', justifyContent: 'center' }}>
      <Icon name={icon} size={size * 0.5} color={colors.coralLight} />
    </View>
  );
}

export function RowItem({ icon, title, sub, onPress, right }: { icon: any; title: string; sub?: string; onPress?: () => void; right?: React.ReactNode }) {
  return (
    <Pressable onPress={onPress} style={{ flexDirection: 'row', alignItems: 'center', gap: 14, minHeight: 58, paddingVertical: 6 }}>
      <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: colors.pale, alignItems: 'center', justifyContent: 'center' }}>
        <Icon name={icon} size={20} color={colors.coralDark} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontFamily: fonts.medium, fontSize: 14, color: colors.ink }}>{title}</Text>
        {sub ? <Text style={styles.cap}>{sub}</Text> : null}
      </View>
      {right ? right : onPress ? <Icon name="chevron-right" size={18} color={colors.gray} /> : null}
    </Pressable>
  );
}

export function Header({ title, onBack, right }: { title: string; onBack?: () => void; right?: React.ReactNode }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingTop: 8, paddingBottom: 8 }}>
      {onBack ? (
        <Pressable accessibilityLabel="Back" onPress={onBack} style={styles.iconBtn}>
          <Icon name="chevron-left" />
        </Pressable>
      ) : null}
      <Text style={{ flex: 1, fontFamily: fonts.semibold, fontSize: onBack ? 18 : 24, color: colors.ink }}>{title}</Text>
      {right}
    </View>
  );
}

export function BellButton({ count, onPress }: { count: number; onPress: () => void }) {
  return (
    <Pressable accessibilityLabel="Notifications" onPress={onPress} style={styles.iconBtn}>
      <Icon name="bell" />
      {count > 0 ? (
        <View style={{ position: 'absolute', top: 6, end: 6, minWidth: 16, height: 16, borderRadius: 8, backgroundColor: colors.coral, borderWidth: 2, borderColor: colors.white, alignItems: 'center', justifyContent: 'center' }}>
          <RNText style={{ color: colors.white, fontSize: 8, fontFamily: fonts.semibold }}>{count}</RNText>
        </View>
      ) : null}
    </Pressable>
  );
}

export function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: on }}
      onPress={() => onChange(!on)}
      style={{ width: 46, height: 28, borderRadius: 14, backgroundColor: on ? colors.coral : '#D9CFCA', justifyContent: 'center', paddingHorizontal: 3, alignItems: on ? 'flex-end' : 'flex-start' }}
    >
      <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: colors.white }} />
    </Pressable>
  );
}

export function Check({ on, label, onPress }: { on: boolean; label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="checkbox" accessibilityState={{ checked: on }} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
      <View style={{ width: 24, height: 24, borderRadius: 7, borderWidth: 1.5, borderColor: on ? colors.coral : colors.border, backgroundColor: on ? colors.coral : colors.white, alignItems: 'center', justifyContent: 'center', marginTop: 1 }}>
        {on ? <Icon name="check" size={15} color={colors.white} /> : null}
      </View>
      <Text style={{ flex: 1, fontFamily: fonts.regular, fontSize: 13, lineHeight: 20, color: colors.ink }}>{label}</Text>
    </Pressable>
  );
}

export function Radio({ on, label, sub, onPress }: { on: boolean; label: string; sub?: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="radio" accessibilityState={{ selected: on }} style={[styles.card, { flexDirection: 'row', alignItems: 'center', gap: 12 }, on && { borderColor: colors.coral, backgroundColor: colors.pale }]}>
      <View style={{ width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: on ? colors.coral : colors.border, alignItems: 'center', justifyContent: 'center' }}>
        {on ? <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: colors.coral }} /> : null}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontFamily: fonts.medium, fontSize: 14, color: colors.ink }}>{label}</Text>
        {sub ? <Text style={styles.cap}>{sub}</Text> : null}
      </View>
    </Pressable>
  );
}

export function Stepper({ value, onChange, min = 0, max = 99 }: { value: number; onChange: (v: number) => void; min?: number; max?: number }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      <Pressable accessibilityLabel="Decrease" onPress={() => onChange(Math.max(min, value - 1))} style={[styles.iconBtn, { width: 36, height: 36 }]}>
        <Icon name="minus" size={16} />
      </Pressable>
      <Text style={{ fontFamily: fonts.semibold, fontSize: 15, minWidth: 28, textAlign: 'center', color: colors.ink }}>{String(value)}</Text>
      <Pressable accessibilityLabel="Increase" onPress={() => onChange(Math.min(max, value + 1))} style={[styles.iconBtn, { width: 36, height: 36 }]}>
        <Icon name="plus" size={16} />
      </Pressable>
    </View>
  );
}

export function Section({ title, children, right }: { title: string; children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <View style={{ gap: 10 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={[styles.h2, { flex: 1 }]}>{title}</Text>
        {right}
      </View>
      {children}
    </View>
  );
}

export function Line({ label, value, bold, accent }: { label: string; value: string; bold?: boolean; accent?: boolean }) {
  const f = bold ? fonts.semibold : fonts.regular;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Text style={{ flex: 1, fontFamily: f, fontSize: 14, color: bold ? colors.ink : colors.gray }}>{label}</Text>
      <Text style={{ fontFamily: bold ? fonts.semibold : fonts.medium, fontSize: 14, color: accent ? colors.coralDark : colors.ink }}>{value}</Text>
    </View>
  );
}

export function Divider() {
  return <View style={{ height: 1, backgroundColor: colors.line }} />;
}

export function Notice({ text, icon = 'info' }: { text: string; icon?: any }) {
  return (
    <View style={{ flexDirection: 'row', gap: 10, backgroundColor: colors.pale, borderRadius: 14, padding: 12, alignItems: 'flex-start' }}>
      <Icon name={icon} size={18} color={colors.coralDark} />
      <Text style={{ flex: 1, fontFamily: fonts.regular, fontSize: 12.5, lineHeight: 19, color: colors.coralDarkest }}>{text}</Text>
    </View>
  );
}

export function Empty({ icon, title, sub }: { icon: any; title: string; sub?: string }) {
  return (
    <View style={{ alignItems: 'center', gap: 8, paddingVertical: 36 }}>
      <Avatar size={64} icon={icon} />
      <Text style={styles.h2}>{title}</Text>
      {sub ? <Text style={[styles.p, { textAlign: 'center' }]}>{sub}</Text> : null}
    </View>
  );
}

// Modal-free confirmation panel shown inline.
export function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ borderWidth: 1.5, borderColor: colors.coral, borderRadius: radius.card, padding: 16, gap: 12, backgroundColor: colors.white }}>
      <Text style={styles.h2}>{title}</Text>
      {children}
    </View>
  );
}

// Standard screen: safe area, optional header, scrolling body, optional sticky footer.
export function Screen({
  title,
  onBack,
  right,
  children,
  footer,
  scroll = true,
  noHeader,
}: {
  title?: string;
  onBack?: () => void;
  right?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  scroll?: boolean;
  noHeader?: boolean;
}) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }} edges={['top', 'left', 'right']}>
      {noHeader ? null : <Header title={title || ''} onBack={onBack} right={right} />}
      {scroll ? (
        <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 8, gap: 16, paddingBottom: footer ? 24 : 40 }} keyboardShouldPersistTaps="handled">
          {children}
        </ScrollView>
      ) : (
        <View style={{ flex: 1 }}>{children}</View>
      )}
      {footer ? <View style={{ padding: 16, paddingBottom: 20, borderTopWidth: 1, borderTopColor: colors.line, gap: 10, backgroundColor: colors.white }}>{footer}</View> : null}
    </SafeAreaView>
  );
}

export function useToast() {
  const [msg, setMsg] = useState('');
  const show = (m: string) => {
    setMsg(m);
    setTimeout(() => setMsg(''), 2600);
  };
  const node = msg ? (
    <View style={{ position: 'absolute', bottom: 90, start: 20, end: 20, backgroundColor: colors.ink, borderRadius: 14, padding: 14 }}>
      <Text style={{ color: colors.white, fontFamily: fonts.medium, fontSize: 13, textAlign: 'center' }}>{msg}</Text>
    </View>
  ) : null;
  return { show, node };
}

export const styles = StyleSheet.create({
  chip: { height: 36, paddingHorizontal: 16, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  chipText: { fontFamily: fonts.medium, fontSize: 13, color: colors.ink },
  card: { borderWidth: 1, borderColor: colors.line, borderRadius: radius.card, padding: 14, backgroundColor: colors.white },
  label: { fontFamily: fonts.medium, fontSize: 12, color: colors.gray },
  input: { height: 52, borderRadius: radius.field, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 14, fontFamily: fonts.regular, fontSize: 14, color: colors.ink, backgroundColor: colors.white },
  iconBtn: { width: 44, height: 44, borderRadius: 22, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  cap: { fontFamily: fonts.regular, fontSize: 12, color: colors.gray },
  h1: { fontFamily: fonts.semibold, fontSize: 24, color: colors.ink },
  h2: { fontFamily: fonts.medium, fontSize: 16, color: colors.ink },
  p: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 21, color: colors.gray },
});
