import React, { useState } from 'react';
import { View } from 'react-native';
import { colors, fonts } from '../../theme';
import { Btn, Card, Divider, Line, Notice, Panel, Screen, Section, Tag, Text, useToast } from '../../components/ui';
import { PROS } from '../../data';
import { nextCharge, useStore } from '../../store';
import { useI18n } from '../../i18n';
import { fmtDate, fmtShort, fmtTime, money, startOf } from '../../lib';
import { DAYS_AR, DAYS_FULL_EN } from '../../lib';

export default function SeriesDetail({ navigation, route }: any) {
  const { s, api } = useStore();
  const { lang, tf } = useI18n();
  const toast = useToast();
  const [confirm, setConfirm] = useState(false);
  const x = s.series.find((y) => y.id === route.params.id);
  if (!x) {
    return (
      <Screen title="Weekly series" onBack={() => navigation.goBack()}>
        <Text>This series is no longer available.</Text>
      </Screen>
    );
  }
  const pro = PROS.find((p) => p.id === x.proId) || PROS[0];
  const nc = nextCharge(s, x.id);
  const list = s.bookings
    .filter((b) => b.seriesId === x.id)
    .sort((a, b) => startOf(a.date, a.time).getTime() - startOf(b.date, b.time).getTime());
  const dn = (d: number) => (lang === 'ar' ? DAYS_AR[d] : DAYS_FULL_EN[d]);

  return (
    <View style={{ flex: 1 }}>
      <Screen title="Weekly series" onBack={() => navigation.goBack()}>
        <Card style={{ gap: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ flex: 1, fontFamily: fonts.semibold, fontSize: 16, color: colors.ink }}>{pro.name}</Text>
            <Tag label={x.status === 'active' ? 'Active' : 'Stopped'} tone={x.status === 'active' ? 'outline' : 'gray'} />
          </View>
          <Divider />
          {x.slots.map((sl, i) => <Line key={i} label={tf('Session {n}', { n: i + 1 })} value={dn(sl.dow) + ', ' + fmtTime(sl.time, lang)} />)}
          <Line label="Where" value={x.where} />
          <Line label="Price per session" value={money(x.price)} />
        </Card>

        {x.status === 'stopped' ? (
          <Notice icon="info" text={x.stoppedBy === 'pro' ? 'The professional turned off weekly repeats, so this series stopped. Sessions already paid are kept. Sessions not yet charged were cancelled.' : 'You stopped this series. Sessions already paid are kept. Sessions not yet charged were cancelled and you will not be charged again.'} />
        ) : (
          <>
            {nc ? (
              <Card style={{ gap: 8, borderColor: colors.coral }}>
                <Text style={{ fontFamily: fonts.medium, fontSize: 14, color: colors.ink }}>Next charge</Text>
                <Line label="Amount" value={money(nc.amount)} bold />
                <Line label="Charged on" value={fmtDate(nc.date, lang)} />
                <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: colors.gray }}>Charged 48 hours before the first session of the week. If a payment fails we retry once, then pause the series and release held times after 24 hours.</Text>
                <Btn label="Demo: run this charge now" kind="small" onPress={() => { api.runWeeklyCharge(x.id); toast.show('Charged. Sessions for that week are now confirmed.'); }} />
              </Card>
            ) : null}
            {confirm ? (
              <Panel title="Stop this series?">
                <Text style={{ fontFamily: fonts.regular, fontSize: 13, lineHeight: 20, color: colors.gray }}>You will not be charged again. Sessions you already paid for stay booked. Stopping applies from the next charge.</Text>
                <Btn label="Yes, stop series" kind="danger" onPress={() => { api.stopSeries(x.id, 'customer'); setConfirm(false); }} />
                <Btn label="Keep series" kind="outline" onPress={() => setConfirm(false)} />
              </Panel>
            ) : (
              <Btn label="Stop weekly series" kind="danger" onPress={() => setConfirm(true)} />
            )}
          </>
        )}

        <Section title="Sessions">
          <View style={{ gap: 8 }}>
            {list.map((b) => (
              <Card key={b.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12 }}>
                <Text style={{ flex: 1, fontFamily: fonts.medium, fontSize: 13, color: colors.ink }}>{fmtShort(b.date, lang) + ' · ' + fmtTime(b.time, lang)}</Text>
                <Tag label={b.status === 'unpaid' ? 'Not charged yet' : b.status === 'confirmed' ? 'Paid' : b.status === 'cancelled' ? 'Cancelled' : 'Completed'} tone={b.status === 'confirmed' ? 'outline' : 'gray'} />
              </Card>
            ))}
          </View>
        </Section>
      </Screen>
      {toast.node}
    </View>
  );
}
