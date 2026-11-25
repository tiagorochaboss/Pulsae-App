import React from 'react';
import { Pressable, View } from 'react-native';
import { colors, fonts } from '../../theme';
import { Avatar, Card, Empty, Line, Notice, Screen, Tag, Text } from '../../components/ui';
import { ME_PRO_ID } from '../../data';
import { useStore } from '../../store';
import { useI18n } from '../../i18n';
import { addDaysIso, fmtDate, money, todayIso } from '../../lib';

export const COMMISSION_FREE_DAYS = 60;

export default function ProClients({ navigation }: any) {
  const { s } = useStore();
  const { lang, tf } = useI18n();
  const today = todayIso();
  const mine = s.bookings.filter((b) => b.proId === ME_PRO_ID && (b.status === 'completed' || b.status === 'confirmed' || b.status === 'awaiting'));
  const names = Array.from(new Set(mine.map((b) => b.customer)));
  const clients = names.map((n) => {
    const list = mine.filter((b) => b.customer === n).sort((a, b) => (a.date < b.date ? -1 : 1));
    const done = list.filter((b) => b.status === 'completed');
    const next = list.find((b) => b.status === 'confirmed' && b.date >= today);
    const lastDone = done.length ? done[done.length - 1] : undefined;
    const anchor = lastDone ? lastDone.date : next ? next.date : list[list.length - 1].date;
    const until = addDaysIso(anchor, COMMISSION_FREE_DAYS);
    return { name: n, sessions: done.length, next, lastDone, until, free: until >= today, spent: done.reduce((a, b) => a + b.price, 0) };
  });
  return (
    <Screen title="Clients" onBack={() => navigation.goBack()}>
      <Notice icon="users" text="Everyone you have worked with on Pulsae. Repeat bookings within 2 months of a client's last session have no commission." />
      {clients.length === 0 ? <Empty icon="users" title="No clients yet" sub="Your clients will appear here after their first booking." /> : null}
      {clients.map((c) => (
        <Card key={c.name} style={{ gap: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Avatar size={44} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: fonts.semibold, fontSize: 15, color: colors.ink }}>{c.name}</Text>
              <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: colors.gray }}>{tf('{n} completed sessions', { n: c.sessions })}</Text>
            </View>
            <Tag label={c.free ? 'No commission' : '25% on next booking'} tone={c.free ? 'outline' : 'gray'} />
          </View>
          {c.lastDone ? <Line label="Last session" value={fmtDate(c.lastDone.date, lang)} /> : null}
          {c.next ? <Line label="Next session" value={fmtDate(c.next.date, lang)} /> : null}
          <Line label={c.free ? 'Commission-free until' : 'Commission-free period ended'} value={fmtDate(c.until, lang)} />
          <Line label="Total from this client" value={money(c.spent)} />
          {c.next ? (
            <Pressable onPress={() => navigation.navigate('Chat', { bookingId: c.next!.id })}>
              <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: colors.coralDark }}>Message client</Text>
            </Pressable>
          ) : null}
        </Card>
      ))}
    </Screen>
  );
}
