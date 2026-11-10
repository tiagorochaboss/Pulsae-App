import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import { colors, fonts } from '../../theme';
import { BellButton, Card, Chip, Empty, Icon, Line, Screen, Tag, Text, styles } from '../../components/ui';
import { ME_PRO_ID } from '../../data';
import { Booking, useStore } from '../../store';
import { useI18n } from '../../i18n';
import { fmtDate, fmtTime, money, startOf } from '../../lib';
import { earningsFor } from './Earnings';

const tag = (b: Booking) =>
  b.status === 'confirmed' ? <Tag label="Confirmed" tone="outline" /> : b.status === 'awaiting' ? <Tag label="Waiting for customer" tone="dark" /> : b.status === 'completed' ? <Tag label="Completed" tone="gray" /> : <Tag label="Cancelled" tone="gray" />;

export default function ProBookings({ navigation }: any) {
  const { s } = useStore();
  const { lang, tf } = useI18n();
  const [tab, setTab] = useState<'Upcoming' | 'Past'>('Upcoming');
  const mine = s.bookings.filter((b) => b.proId === ME_PRO_ID && b.status !== 'unpaid');
  const cmp = (a: Booking, b: Booking) => startOf(a.date, a.time).getTime() - startOf(b.date, b.time).getTime();
  const upcoming = mine.filter((b) => b.status === 'confirmed' || b.status === 'awaiting').sort(cmp);
  const past = mine.filter((b) => b.status === 'completed' || b.status === 'cancelled').sort((a, b) => cmp(b, a));
  const e = earningsFor(s);
  const unread = s.notifs.pro.filter((n) => n.unread).length;
  const list = tab === 'Upcoming' ? upcoming : past;

  return (
    <Screen title="Bookings" right={<BellButton count={unread} onPress={() => navigation.navigate('Notifications')} />}>
      <Pressable onPress={() => navigation.navigate('Earnings')}>
        <Card style={{ gap: 8, backgroundColor: colors.pale, borderColor: colors.pale }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ flex: 1, fontFamily: fonts.medium, fontSize: 13, color: colors.coralDark }}>Earnings</Text>
            <Icon name="chevron-right" size={18} color={colors.coralDark} />
          </View>
          <Text style={{ fontFamily: fonts.semibold, fontSize: 26, color: colors.coralDarkest }}>{money(e.paidOut + e.scheduled)}</Text>
          <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: colors.coralDark }}>{tf('{a} on the way after customer confirmations', { a: money(e.waiting) })}</Text>
        </Card>
      </Pressable>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <Chip label="Upcoming" on={tab === 'Upcoming'} onPress={() => setTab('Upcoming')} />
        <Chip label="Past" on={tab === 'Past'} onPress={() => setTab('Past')} />
      </View>
      {list.length === 0 ? <Empty icon="calendar" title="Nothing here yet" /> : null}
      {list.map((b) => (
        <Pressable key={b.id} onPress={() => navigation.navigate('ProBookingDetail', { id: b.id })}>
          <Card style={{ gap: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={{ flex: 1, fontFamily: fonts.semibold, fontSize: 15, color: colors.ink }}>{fmtDate(b.date, lang) + ' · ' + fmtTime(b.time, lang)}</Text>
              {tag(b)}
            </View>
            <Text style={styles.cap}>{b.customer + ' · ' + b.where}</Text>
            <View style={{ flexDirection: 'row', gap: 6 }}>
              {b.kind === 'series' ? <Tag label="Weekly" /> : null}
              {b.kind === 'pack' ? <Tag label="Pack" /> : null}
            </View>
          </Card>
        </Pressable>
      ))}
    </Screen>
  );
}
