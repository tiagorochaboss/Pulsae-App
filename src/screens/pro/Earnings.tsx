import React from 'react';
import { View } from 'react-native';
import { colors, fonts } from '../../theme';
import { Card, Divider, Line, Notice, Screen, Section, Text } from '../../components/ui';
import { ME_PRO_ID } from '../../data';
import { State, useStore } from '../../store';
import { useI18n } from '../../i18n';
import { fmtDate, money, startOf, todayIso } from '../../lib';

const COMMISSION = 0.25;
const FEE = 0.05;

export function earningsFor(s: State) {
  const mine = s.bookings
    .filter((b) => b.proId === ME_PRO_ID && (b.status === 'completed' || b.status === 'awaiting' || b.status === 'confirmed'))
    .sort((a, b) => startOf(a.date, a.time).getTime() - startOf(b.date, b.time).getTime());
  const firstSeen: Record<string, boolean> = {};
  const rows = mine.map((b) => {
    const first = !firstSeen[b.customer];
    firstSeen[b.customer] = true;
    const commission = first ? Math.round(b.price * COMMISSION) : 0;
    const fee = Math.round(b.price * FEE);
    return { b, commission, fee, net: b.price - commission - fee };
  });
  const today = todayIso();
  let paidOut = 0, scheduled = 0, waiting = 0;
  rows.forEach((r) => {
    if (r.b.status === 'completed') {
      if (r.b.payoutDate && r.b.payoutDate <= today) paidOut += r.net;
      else scheduled += r.net;
    } else waiting += r.net;
  });
  return { rows, paidOut, scheduled, waiting };
}

export default function Earnings({ navigation }: any) {
  const { s } = useStore();
  const { lang } = useI18n();
  const e = earningsFor(s);
  const done = e.rows.filter((r) => r.b.status === 'completed');
  return (
    <Screen title="Earnings" onBack={() => navigation.goBack()}>
      <Card style={{ gap: 10 }}>
        <Line label="Paid out" value={money(e.paidOut)} bold />
        <Line label="Scheduled payout" value={money(e.scheduled)} />
        <Line label="After customer confirmation or sessions to come" value={money(e.waiting)} />
      </Card>
      <Notice icon="credit-card" text="You are paid 48 hours after the customer confirms a session, or 48 hours after the 24-hour automatic confirmation." />
      <Section title="Completed sessions">
        {done.length === 0 ? <Text style={{ fontFamily: fonts.regular, fontSize: 13, color: colors.gray }}>No completed sessions yet.</Text> : null}
        {done.map((r) => (
          <Card key={r.b.id} style={{ gap: 6 }}>
            <Line label={fmtDate(r.b.date, lang)} value={money(r.b.price)} bold />
            {r.commission > 0 ? <Line label="Pulsae commission (25%, first booking)" value={'− ' + money(r.commission)} /> : <Line label="Pulsae commission (repeat booking)" value={money(0)} />}
            <Line label="Payment fee (5%)" value={'− ' + money(r.fee)} />
            <Divider />
            <Line label="You receive" value={money(r.net)} accent bold />
            {r.b.payoutDate ? <Line label="Payout date" value={fmtDate(r.b.payoutDate, lang)} /> : null}
          </Card>
        ))}
      </Section>
    </Screen>
  );
}
