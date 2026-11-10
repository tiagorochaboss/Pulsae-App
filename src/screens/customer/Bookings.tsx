import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import { colors, fonts } from '../../theme';
import { BellButton, Card, Chip, Empty, Icon, Screen, Tag, Text, styles, Notice } from '../../components/ui';
import { PROS } from '../../data';
import { Booking, nextCharge, useStore } from '../../store';
import { useI18n } from '../../i18n';
import { fmtDate, fmtShort, fmtTime, money, startOf } from '../../lib';

export function statusTag(b: Booking) {
  if (b.status === 'confirmed') return <Tag label="Confirmed" tone="outline" />;
  if (b.status === 'awaiting') return <Tag label="Please confirm" tone="dark" />;
  if (b.status === 'completed') return <Tag label="Completed" tone="gray" />;
  if (b.status === 'unpaid') return <Tag label="Not charged yet" tone="gray" />;
  return <Tag label="Cancelled" tone="gray" />;
}

export default function Bookings({ navigation }: any) {
  const { s } = useStore();
  const { lang, tf } = useI18n();
  const [tab, setTab] = useState<'Upcoming' | 'Past'>('Upcoming');
  const credits = s.credits.reduce((a, c) => a + c.amount, 0);
  const unread = s.notifs.customer.filter((n) => n.unread).length;
  const byTime = (a: Booking, b: Booking) => startOf(a.date, a.time).getTime() - startOf(b.date, b.time).getTime();

  const upcoming = s.bookings.filter((b) => b.status === 'confirmed' || b.status === 'awaiting').sort(byTime);
  const past = s.bookings.filter((b) => b.status === 'completed' || b.status === 'cancelled').sort((a, b) => byTime(b, a));
  const events = s.posts.filter((p) => p.event && s.going.includes(p.id));
  const activeSeries = s.series.filter((x) => x.status === 'active');
  const stoppedSeries = s.series.filter((x) => x.status === 'stopped');

  const card = (b: Booking) => {
    const pro = PROS.find((p) => p.id === b.proId);
    return (
      <Pressable key={b.id} onPress={() => navigation.navigate('BookingDetail', { id: b.id })}>
        <Card style={{ gap: 8 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={{ flex: 1, fontFamily: fonts.semibold, fontSize: 15, color: colors.ink }}>{fmtDate(b.date, lang) + ' · ' + fmtTime(b.time, lang)}</Text>
            {statusTag(b)}
          </View>
          <Text style={styles.cap}>{(pro ? pro.name : '') + ' · ' + b.where}</Text>
          <View style={{ flexDirection: 'row', gap: 6 }}>
            {b.kind === 'series' ? <Tag label="Weekly" /> : null}
            {b.kind === 'pack' ? <Tag label="Pack" /> : null}
          </View>
        </Card>
      </Pressable>
    );
  };

  return (
    <Screen title="Bookings" right={<BellButton count={unread} onPress={() => navigation.navigate('Notifications')} />}>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <Chip label="Upcoming" on={tab === 'Upcoming'} onPress={() => setTab('Upcoming')} />
        <Chip label="Past" on={tab === 'Past'} onPress={() => setTab('Past')} />
      </View>
      {credits > 0 ? (
        <Pressable onPress={() => navigation.navigate('Credits')}>
          <Notice icon="gift" text={tf('You have {a} in credits to use on your next booking.', { a: money(credits) })} />
        </Pressable>
      ) : null}

      {tab === 'Upcoming' ? (
        <>
          {activeSeries.map((x) => {
            const nc = nextCharge(s, x.id);
            const pro = PROS.find((p) => p.id === x.proId);
            return (
              <Pressable key={x.id} onPress={() => navigation.navigate('SeriesDetail', { id: x.id })}>
                <Card style={{ gap: 6, borderColor: colors.coral }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Icon name="repeat" size={18} color={colors.coralDark} />
                    <Text style={{ flex: 1, fontFamily: fonts.semibold, fontSize: 15, color: colors.ink }}>{tf('Weekly with {p}', { p: pro ? pro.name : '' })}</Text>
                    <Icon name="chevron-right" size={18} color={colors.gray} />
                  </View>
                  <Text style={styles.cap}>{nc ? tf('Next charge {a} on {d}', { a: money(nc.amount), d: fmtShort(nc.date, lang) }) : 'No further charges'}</Text>
                </Card>
              </Pressable>
            );
          })}
          {upcoming.map(card)}
          {events.map((e) => (
            <Card key={e.id} style={{ gap: 8 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Icon name="users" size={18} color={colors.coralDark} />
                <Text style={{ flex: 1, fontFamily: fonts.semibold, fontSize: 15, color: colors.ink }}>{e.title}</Text>
                <Tag label="Event" />
              </View>
              <Text style={styles.cap}>{e.date ? fmtDate(e.date, lang) : ''}</Text>
              <Text style={styles.cap}>{e.meta}</Text>
              <Pressable onPress={() => navigation.navigate('Tabs', { screen: 'Community' })}>
                <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: colors.coralDark }}>Manage RSVP in Community</Text>
              </Pressable>
            </Card>
          ))}
          {upcoming.length === 0 && events.length === 0 && activeSeries.length === 0 ? <Empty icon="calendar" title="No upcoming bookings" sub="Find a professional in Discover and book your first session." /> : null}
        </>
      ) : (
        <>
          {stoppedSeries.map((x) => (
            <Pressable key={x.id} onPress={() => navigation.navigate('SeriesDetail', { id: x.id })}>
              <Card style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Icon name="repeat" size={18} color={colors.gray} />
                <Text style={{ flex: 1, fontFamily: fonts.medium, fontSize: 14, color: colors.ink }}>Weekly series (stopped)</Text>
                <Icon name="chevron-right" size={18} color={colors.gray} />
              </Card>
            </Pressable>
          ))}
          {past.map(card)}
          {past.length === 0 && stoppedSeries.length === 0 ? <Empty icon="clock" title="No past bookings yet" /> : null}
        </>
      )}
    </Screen>
  );
}
