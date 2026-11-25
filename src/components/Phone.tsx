import React, { useMemo, useState } from 'react';
import { FlatList, Modal, Pressable, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fonts } from '../theme';
import { useI18n } from '../i18n';
import { Icon, Text, styles } from './ui';

export type Country = { iso: string; name: string; dial: string };

export const COUNTRIES: Country[] = [
  { iso: 'SA', name: 'Saudi Arabia', dial: '966' },
  { iso: 'AE', name: 'United Arab Emirates', dial: '971' },
  { iso: 'KW', name: 'Kuwait', dial: '965' },
  { iso: 'QA', name: 'Qatar', dial: '974' },
  { iso: 'BH', name: 'Bahrain', dial: '973' },
  { iso: 'OM', name: 'Oman', dial: '968' },
  { iso: 'EG', name: 'Egypt', dial: '20' },
  { iso: 'JO', name: 'Jordan', dial: '962' },
  { iso: 'LB', name: 'Lebanon', dial: '961' },
  { iso: 'IQ', name: 'Iraq', dial: '964' },
  { iso: 'SY', name: 'Syria', dial: '963' },
  { iso: 'PS', name: 'Palestine', dial: '970' },
  { iso: 'YE', name: 'Yemen', dial: '967' },
  { iso: 'SD', name: 'Sudan', dial: '249' },
  { iso: 'MA', name: 'Morocco', dial: '212' },
  { iso: 'DZ', name: 'Algeria', dial: '213' },
  { iso: 'TN', name: 'Tunisia', dial: '216' },
  { iso: 'LY', name: 'Libya', dial: '218' },
  { iso: 'TR', name: 'Türkiye', dial: '90' },
  { iso: 'PK', name: 'Pakistan', dial: '92' },
  { iso: 'IN', name: 'India', dial: '91' },
  { iso: 'BD', name: 'Bangladesh', dial: '880' },
  { iso: 'LK', name: 'Sri Lanka', dial: '94' },
  { iso: 'NP', name: 'Nepal', dial: '977' },
  { iso: 'PH', name: 'Philippines', dial: '63' },
  { iso: 'ID', name: 'Indonesia', dial: '62' },
  { iso: 'MY', name: 'Malaysia', dial: '60' },
  { iso: 'SG', name: 'Singapore', dial: '65' },
  { iso: 'CN', name: 'China', dial: '86' },
  { iso: 'JP', name: 'Japan', dial: '81' },
  { iso: 'KR', name: 'South Korea', dial: '82' },
  { iso: 'AU', name: 'Australia', dial: '61' },
  { iso: 'NZ', name: 'New Zealand', dial: '64' },
  { iso: 'GB', name: 'United Kingdom', dial: '44' },
  { iso: 'IE', name: 'Ireland', dial: '353' },
  { iso: 'FR', name: 'France', dial: '33' },
  { iso: 'DE', name: 'Germany', dial: '49' },
  { iso: 'ES', name: 'Spain', dial: '34' },
  { iso: 'IT', name: 'Italy', dial: '39' },
  { iso: 'NL', name: 'Netherlands', dial: '31' },
  { iso: 'CH', name: 'Switzerland', dial: '41' },
  { iso: 'SE', name: 'Sweden', dial: '46' },
  { iso: 'RU', name: 'Russia', dial: '7' },
  { iso: 'US', name: 'United States', dial: '1' },
  { iso: 'CA', name: 'Canada', dial: '1' },
  { iso: 'MX', name: 'Mexico', dial: '52' },
  { iso: 'BR', name: 'Brazil', dial: '55' },
  { iso: 'ZA', name: 'South Africa', dial: '27' },
  { iso: 'NG', name: 'Nigeria', dial: '234' },
  { iso: 'KE', name: 'Kenya', dial: '254' },
  { iso: 'ET', name: 'Ethiopia', dial: '251' },
];

// Flag emoji from a two-letter country code.
export const flag = (iso: string) => iso.toUpperCase().replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0)));
export const countryOf = (iso: string) => COUNTRIES.find((c) => c.iso === iso) || COUNTRIES[0];

// The number is typed without the country code and without a leading zero.
export const cleanNumber = (v: string) => v.replace(/\D/g, '').replace(/^0+/, '');
export function phoneError(iso: string, raw: string): string {
  const n = cleanNumber(raw);
  if (!n) return 'Enter your mobile number';
  if (iso === 'SA') return /^5\d{8}$/.test(n) ? '' : 'Saudi mobile numbers have 9 digits and start with 5, for example 5X XXX XXXX';
  return n.length >= 6 && n.length <= 12 ? '' : 'Check the number. It should have 6 to 12 digits';
}
export const fullPhone = (iso: string, raw: string) => '+' + countryOf(iso).dial + ' ' + cleanNumber(raw);
export const emailError = (v: string) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Enter a valid email address');

function CountryPicker({ visible, onClose, onPick, current }: { visible: boolean; onClose: () => void; onPick: (c: Country) => void; current: string }) {
  const { t } = useI18n();
  const [q, setQ] = useState('');
  const list = useMemo(() => {
    const k = q.trim().toLowerCase().replace('+', '');
    if (!k) return COUNTRIES;
    return COUNTRIES.filter((c) => c.name.toLowerCase().includes(k) || c.dial.startsWith(k) || t(c.name).toLowerCase().includes(k));
  }, [q, t]);
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 20, paddingBottom: 10 }}>
          <Text style={{ flex: 1, fontFamily: fonts.semibold, fontSize: 18, color: colors.ink }}>Select country</Text>
          <Pressable accessibilityLabel="Close" onPress={onClose} style={styles.iconBtn}>
            <Icon name="x" />
          </Pressable>
        </View>
        <View style={{ paddingHorizontal: 20, paddingBottom: 8 }}>
          <TextInput value={q} onChangeText={setQ} placeholder={t('Search country or code')} placeholderTextColor="#9A908B" style={styles.input} autoCorrect={false} />
        </View>
        <FlatList
          data={list}
          keyExtractor={(c) => c.iso}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <Pressable onPress={() => { onPick(item); setQ(''); }} style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 20, height: 54, backgroundColor: item.iso === current ? colors.pale : colors.white }}>
              <Text style={{ fontSize: 24 }}>{flag(item.iso)}</Text>
              <Text style={{ flex: 1, fontFamily: fonts.medium, fontSize: 14, color: colors.ink }}>{item.name}</Text>
              <Text style={{ fontFamily: fonts.regular, fontSize: 14, color: colors.gray }}>{'+' + item.dial}</Text>
            </Pressable>
          )}
        />
      </SafeAreaView>
    </Modal>
  );
}

// Mobile number with a country selector (flag + code). The person types only the local number.
export function PhoneField({ label = 'Mobile number', iso, number, onChange, error }: { label?: string; iso: string; number: string; onChange: (iso: string, number: string) => void; error?: string }) {
  const { t, rtl } = useI18n();
  const [open, setOpen] = useState(false);
  const c = countryOf(iso);
  return (
    <View style={{ gap: 6 }}>
      <Text style={styles.label}>{label}</Text>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <Pressable accessibilityRole="button" accessibilityLabel="Select country" onPress={() => setOpen(true)} style={[styles.input, { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12 }, error ? { borderColor: colors.coral } : null]}>
          <Text style={{ fontSize: 22 }}>{flag(c.iso)}</Text>
          <Text style={{ fontFamily: fonts.medium, fontSize: 14, color: colors.ink }}>{'+' + c.dial}</Text>
          <Icon name="chevron-down" size={16} color={colors.gray} />
        </Pressable>
        <TextInput
          value={number}
          onChangeText={(v) => onChange(iso, v.replace(/[^\d ]/g, ''))}
          keyboardType="phone-pad"
          textContentType="telephoneNumber"
          placeholder={t(iso === 'SA' ? '5X XXX XXXX' : 'Mobile number')}
          placeholderTextColor="#9A908B"
          style={[styles.input, { flex: 1, textAlign: rtl ? 'right' : 'left' }, error ? { borderColor: colors.coral } : null]}
        />
      </View>
      {error ? <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: colors.coralDark }}>{error}</Text> : null}
      <CountryPicker visible={open} current={iso} onClose={() => setOpen(false)} onPick={(x) => { setOpen(false); onChange(x.iso, number); }} />
    </View>
  );
}
