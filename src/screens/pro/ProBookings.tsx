import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import { colors, fonts } from '../../theme';
import { BellButton, MessagesButton, Card, Chip, Empty, Icon, Line, Screen, Tag, Text, styles } from '../../components/ui';
import { ME_PRO_ID } from '../../data';
import { Booking, unreadChats, useStore } from '../../store';
import { useI18n } from '../../i18n';
import { fmtDate, fmtTime, money, startOf } from '../../lib';
import { earningsFor } from './Earnings';
import { StatTile } from '../../components/Fun';

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
    <Screen title="Bookings" right={<View style={{ flexDirection: 'row', gap: 8 }}><MessagesButton count={unreadChats(s, 'pro')} onPress={() => navigation.navigate('Inbox')} /><BellButton count={unread} onPress={() => navigation.navigate('Notifications')} /></View>}>
      <Pressable onPress={() => navigation.navigate('Earnings')}>
        <View style={{ backgroundColor: colors.coral, borderRadius: 24, padding: 18, gap: 6, overflow: 'hidden' }}>
          <View style={{ position: 'absolute', end: -30, top: -40, width: 150, height: 150, borderRadius: 75, backgroundColor: colors.white, opacity: 0.14 }} />
          <View style={{ position: 'absolute', end: 70, bottom: -50, width: 100, height: 100, borderRadius: 50, backgroundColor: colors.white, opacity: 0.1 }} />
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ flex: 1, fontFamily: fonts.medium, fontSize: 13, color: colors.white, opacity: 0.92 }}>{tf('Hello, {name}', { name: s.account.pro.first }) + ' 👋'}</Text>
            <Icon name="chevron-right" size={18} color={colors.white} />
          </View>
          <Text style={{ fontFamily: fonts.semibold, fontSize: 28, color: colors.white }}>{money(e.paidOut + e.scheduled)}</Text>
          <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: colors.white, opacity: 0.92 }}>{tf('{a} on the way after customer confirmations', { a: money(e.waiting) })}</Text>
        </View>
      </Pressable>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <StatTile tone="sky" value={String(upcoming.filter((b) => b.status === 'confirmed').length)} label="Confirmed" />
        <StatTile tone="sun" value={String(upcoming.filter((b) => b.status === 'awaiting').length)} label="Waiting for customer" />
        <StatTile tone="mint" value={String(past.filter((b) => b.status === 'completed').length)} label="Completed" />
      </View>
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
              {b.kind === 'pack' ? <Tag label="Prepaid" /> : null}
            </View>
          </Card>
        </Pressable>
      ))}
    </Screen>
  );
}
