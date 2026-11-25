import React, { useState } from 'react';
import {
  Image,
  Modal,
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

export function Avatar({ size = 48, icon = 'user', uri, bg }: { size?: number; icon?: any; uri?: string; bg?: string }) {
  if (uri) return <Image source={{ uri }} style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: colors.pale }} />;
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: bg || colors.pale, alignItems: 'center', justifyContent: 'center' }}>
      <Icon name={icon} size={size * 0.5} color={bg ? colors.white : colors.coralLight} />
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
      {onBack ? null : <LangButton />}
      {right}
    </View>
  );
}

// One-tap English / Arabic switch. It sits at the end of the top bar on the main screens of both apps
// (right in English, left in Arabic), next to the bell, where people look for it.
export function LangButton() {
  const { lang, setLang } = useI18n();
  return (
    <Pressable
      accessibilityLabel="Language"
      accessibilityRole="button"
      hitSlop={6}
      onPress={() => setLang(lang === 'en' ? 'ar' : 'en')}
      style={{ height: 36, paddingHorizontal: 12, borderRadius: 18, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.white, flexDirection: 'row', alignItems: 'center', gap: 6 }}
    >
      <Feather name="globe" size={15} color={colors.coralDark} />
      <RNText style={{ fontFamily: lang === 'en' ? 'Cairo_600SemiBold' : fonts.semibold, fontSize: 13, color: colors.ink }}>{lang === 'en' ? 'عربي' : 'EN'}</RNText>
    </Pressable>
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

export function MessagesButton({ count, onPress }: { count: number; onPress: () => void }) {
  return (
    <Pressable accessibilityLabel="Messages" onPress={onPress} style={styles.iconBtn}>
      <Icon name="message-circle" />
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

export function Stepper({ value, onChange, min = 0, max = 99, step = 1, format }: { value: number; onChange: (v: number) => void; min?: number; max?: number; step?: number; format?: (v: number) => string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      <Pressable accessibilityLabel="Decrease" onPress={() => onChange(Math.max(min, value - step))} style={[styles.iconBtn, { width: 36, height: 36 }]}>
        <Icon name="minus" size={16} />
      </Pressable>
      <Text style={{ fontFamily: fonts.semibold, fontSize: 15, minWidth: format ? 76 : 28, textAlign: 'center', color: colors.ink }}>{format ? format(value) : String(value)}</Text>
      <Pressable accessibilityLabel="Increase" onPress={() => onChange(Math.min(max, value + step))} style={[styles.iconBtn, { width: 36, height: 36 }]}>
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

// Password input with a show/hide button.
export function PasswordField({ label, error, ...props }: { label: string; error?: string } & TextInputProps) {
  const { t, rtl } = useI18n();
  const [show, setShow] = useState(false);
  return (
    <View style={{ gap: 6 }}>
      <Text style={styles.label}>{label}</Text>
      <View>
        <TextInput
          placeholderTextColor="#9A908B"
          autoCapitalize="none"
          autoCorrect={false}
          {...props}
          secureTextEntry={!show}
          placeholder={props.placeholder ? t(props.placeholder) : undefined}
          style={[styles.input, { textAlign: rtl ? 'right' : 'left', paddingEnd: 48 }, error ? { borderColor: colors.coral } : null, props.style]}
        />
        <Pressable accessibilityLabel={show ? 'Hide password' : 'Show password'} onPress={() => setShow(!show)} style={{ position: 'absolute', end: 6, top: 0, bottom: 0, width: 40, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name={show ? 'eye-off' : 'eye'} size={18} color={colors.gray} />
        </Pressable>
      </View>
      {error ? <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: colors.coralDark }}>{error}</Text> : null}
    </View>
  );
}

// Two or three way switch, e.g. Mobile / Email.
export function Segmented({ options, value, onChange }: { options: { key: string; label: string }[]; value: string; onChange: (k: string) => void }) {
  return (
    <View style={{ flexDirection: 'row', backgroundColor: colors.soft, borderRadius: 14, padding: 4 }}>
      {options.map((o) => (
        <Pressable key={o.key} onPress={() => onChange(o.key)} accessibilityRole="button" style={{ flex: 1, height: 40, borderRadius: 11, alignItems: 'center', justifyContent: 'center', backgroundColor: value === o.key ? colors.white : 'transparent' }}>
          <Text style={{ fontFamily: value === o.key ? fonts.semibold : fonts.medium, fontSize: 13, color: value === o.key ? colors.ink : colors.gray }}>{o.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

// Centered message box over a dimmed background.
export function Popup({ visible, title, onClose, children, action, actionLabel = 'Got it' }: { visible: boolean; title: string; onClose: () => void; children: React.ReactNode; action?: () => void; actionLabel?: string }) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable onPress={onClose} style={{ flex: 1, backgroundColor: 'rgba(35,24,21,0.55)', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <Pressable onPress={() => {}} style={{ width: '100%', maxWidth: 420, maxHeight: '85%', backgroundColor: colors.white, borderRadius: 24, padding: 20, gap: 14 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Text style={[styles.h2, { flex: 1, fontSize: 18 }]}>{title}</Text>
            <Pressable accessibilityLabel="Close" onPress={onClose} style={[styles.iconBtn, { width: 36, height: 36 }]}>
              <Icon name="x" size={16} />
            </Pressable>
          </View>
          <ScrollView contentContainerStyle={{ gap: 12 }}>{children}</ScrollView>
          <Btn label={actionLabel} onPress={action || onClose} />
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// "Verified" badge. Tapping it explains what the badge means.
export function VerifiedBadge({ cert, tone = 'pale' }: { cert?: string; tone?: 'pale' | 'dark' }) {
  const [open, setOpen] = useState(false);
  const row = (icon: any, t1: string, t2: string) => (
    <View style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-start' }}>
      <View style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: colors.pale, alignItems: 'center', justifyContent: 'center' }}>
        <Icon name={icon} size={17} color={colors.coralDark} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontFamily: fonts.medium, fontSize: 14, color: colors.ink }}>{t1}</Text>
        <Text style={styles.cap}>{t2}</Text>
      </View>
    </View>
  );
  return (
    <>
      <Pressable accessibilityRole="button" accessibilityLabel="What does Verified mean?" onPress={() => setOpen(true)} hitSlop={8} style={{ flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start', height: 22, paddingHorizontal: 8, borderRadius: 11, backgroundColor: tone === 'dark' ? colors.ink : colors.pale }}>
        <Icon name="check-circle" size={12} color={tone === 'dark' ? colors.white : colors.coralDark} />
        <Text style={{ color: tone === 'dark' ? colors.white : colors.coralDark, fontFamily: fonts.medium, fontSize: 10 }}>Verified</Text>
      </Pressable>
      <Popup visible={open} title="What “Verified” means" onClose={() => setOpen(false)}>
        <Text style={styles.p}>Before a professional appears on Pulsae, our team checks their documents. A Verified badge means these checks were completed:</Text>
        {row('user-check', 'Identity', 'Their national ID or Iqama matches the person who signed up.')}
        {row('award', 'Licence or certificate', cert ? 'Their ' + cert + ' was checked against the document they uploaded.' : 'Their professional licence or certificate was checked against the document they uploaded.')}
        {row('briefcase', 'Experience', 'The years of experience shown on the profile were reviewed.')}
        <Text style={styles.cap}>Verification is about who the professional is and what they are qualified to do. Ratings and reviews come only from real, completed sessions on Pulsae.</Text>
      </Popup>
    </>
  );
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
