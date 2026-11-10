import React, { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { colors, fonts, radius } from '../../theme';
import { Avatar, BellButton, Card, Chip, Empty, Icon, Screen, Tag, Text, styles } from '../../components/ui';
import { Pro, PROS } from '../../data';
import { DEFAULT_FILTERS, Filters, nextSlot, useStore } from '../../store';
import { useI18n } from '../../i18n';
import { fmtShort, money } from '../../lib';

export function applyFilters(list: Pro[], f: Filters, q: string): Pro[] {
  const query = q.trim().toLowerCase();
  return list.filter((p) => {
    if (f.cat !== 'All' && p.category !== f.cat) return false;
    if (f.gender !== 'Any' && p.gender !== f.gender) return false;
    if (p.years < f.minYears) return false;
    if (f.certs.length && !f.certs.includes(p.cert)) return false;
    if (f.langs.length && !f.langs.some((l) => p.languages.includes(l))) return false;
    if (f.locs.length && !f.locs.some((l) => p.locations.includes(l))) return false;
    if (p.price > f.maxPrice) return false;
    if (p.distance > f.maxDist) return false;
    if (query && !(p.name + ' ' + p.role + ' ' + p.area).toLowerCase().includes(query)) return false;
    return true;
  });
}

export function activeFilterCount(f: Filters) {
  let n = 0;
  if (f.gender !== 'Any') n++;
  if (f.minYears > 0) n++;
  if (f.certs.length) n++;
  if (f.langs.length) n++;
  if (f.locs.length) n++;
  if (f.maxPrice < DEFAULT_FILTERS.maxPrice) n++;
  if (f.maxDist < DEFAULT_FILTERS.maxDist) n++;
  return n;
}

export default function Discover({ navigation }: any) {
  const { s, api } = useStore();
  const { t, tf, lang } = useI18n();
  const [q, setQ] = useState('');
  const list = applyFilters(PROS, s.filters, q);
  const count = activeFilterCount(s.filters);
  const unread = s.notifs.customer.filter((n) => n.unread).length;

  return (
    <Screen
      title="Discover"
      right={<BellButton count={unread} onPress={() => navigation.navigate('Notifications')} />}
    >
      <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, height: 48, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 14 }}>
          <Icon name="search" size={18} color={colors.gray} />
          <TextInput value={q} onChangeText={setQ} placeholder={t('Search by name or area')} placeholderTextColor="#9A908B" style={{ flex: 1, fontFamily: fonts.regular, fontSize: 14, color: colors.ink, textAlign: lang === 'ar' ? 'right' : 'left' }} />
        </View>
        <Pressable accessibilityLabel="Filters" onPress={() => navigation.navigate('Filters')} style={styles.iconBtn}>
          <Icon name="sliders" size={20} />
          {count > 0 ? (
            <View style={{ position: 'absolute', top: 4, end: 4, minWidth: 16, height: 16, borderRadius: 8, backgroundColor: colors.coral, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: colors.white, fontSize: 9, fontFamily: fonts.semibold }}>{String(count)}</Text>
            </View>
          ) : null}
        </Pressable>
      </View>
      <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
        {['All', 'Physiotherapists', 'Trainers'].map((c) => (
          <Chip key={c} label={c} on={s.filters.cat === c} onPress={() => api.setFilters({ ...s.filters, cat: c })} />
        ))}
      </View>
      {list.length === 0 ? (
        <View style={{ gap: 12 }}>
          <Empty icon="search" title="No professionals match" sub="Try removing a filter or searching a different area." />
          <Pressable onPress={() => api.setFilters(DEFAULT_FILTERS)}>
            <Text style={{ textAlign: 'center', fontFamily: fonts.medium, color: colors.coralDark }}>Clear all filters</Text>
          </Pressable>
        </View>
      ) : (
        list.map((p) => {
          const ns = nextSlot(s, p.id);
          return (
            <Pressable key={p.id} onPress={() => navigation.navigate('ProDetail', { id: p.id })}>
              <Card style={{ gap: 12 }}>
                <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
                  <Avatar size={56} />
                  <View style={{ flex: 1, gap: 2 }}>
                    <Text style={{ fontFamily: fonts.semibold, fontSize: 15, color: colors.ink }}>{p.name}</Text>
                    <Text style={styles.cap}>{p.role}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <Icon name="star" size={13} color={colors.coral} />
                      <Text style={styles.cap}>{tf('{r} ({n} reviews) · {a}', { r: p.rating, n: p.reviews, a: t(p.area) })}</Text>
                    </View>
                  </View>
                  <Pressable accessibilityLabel="Save" onPress={() => api.toggleFavorite(p.id)} hitSlop={8}>
                    <Icon name="heart" size={20} color={s.favorites.includes(p.id) ? colors.coral : colors.gray} />
                  </Pressable>
                </View>
                <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap' }}>
                  <Tag label={p.cert} />
                  <Tag label={tf('{n} years', { n: p.years })} tone="gray" />
                  <Tag label={p.gender} tone="gray" />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ flex: 1, fontFamily: fonts.regular, fontSize: 12, color: colors.gray }}>
                    {ns ? tf('Next: {d}, {time}', { d: fmtShort(ns.date, lang), time: ns.time }) : 'No free times soon'}
                  </Text>
                  <Text style={{ fontFamily: fonts.semibold, fontSize: 14, color: colors.coralDark }}>{money(p.price) + ' / ' + t('session')}</Text>
                </View>
              </Card>
            </Pressable>
          );
        })
      )}
    </Screen>
  );
}
