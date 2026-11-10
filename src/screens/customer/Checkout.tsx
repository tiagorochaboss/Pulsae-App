import React, { useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { colors, fonts } from '../../theme';
import { Btn, Card, Check, Chip, Divider, Field, Line, Notice, Radio, Screen, Section, Stepper, Text } from '../../components/ui';
import { PROS } from '../../data';
import { nextDow, slotsFor, useStore } from '../../store';
import { useI18n } from '../../i18n';
import { addDaysIso, dayName, fmtDate, fmtTime, fromIso, money, PACK_DISCOUNT, PROMOS } from '../../lib';

type Mode = 'single' | 'pack4' | 'pack8' | 'weekly';

export default function Checkout({ navigation, route }: any) {
  const { s, api } = useStore();
  const { lang, tf, t } = useI18n();
  const { id, date, time, where } = route.params;
  const pro = PROS.find((p) => p.id === id) || PROS[0];
  const weeklyOffered = pro.id === 'p1' ? s.proProfile.weekly : true;
  const packsOffered = pro.id === 'p1' ? { 4: s.proProfile.d4, 8: s.proProfile.d8 } : { 4: true, 8: true };

  const [mode, setMode] = useState<Mode>('single');
  const [spw, setSpw] = useState(1);
  const [extra, setExtra] = useState<{ dow: number; time: string }[]>([{ dow: (fromIso(date).getDay() + 2) % 7, time }, { dow: (fromIso(date).getDay() + 4) % 7, time }]);
  const [promoIn, setPromoIn] = useState('');
  const [promo, setPromo] = useState(0);
  const [promoErr, setPromoErr] = useState('');
  const [useCredit, setUseCredit] = useState(false);
  const [method, setMethod] = useState('card');
  const [paying, setPaying] = useState(false);

  const unit = pro.price;
  const creditTotal = s.credits.reduce((a, c) => a + c.amount, 0);
  const count = mode === 'pack4' ? 4 : mode === 'pack8' ? 8 : 1;
  const discPct = mode === 'pack4' ? PACK_DISCOUNT[4] : mode === 'pack8' ? PACK_DISCOUNT[8] : 0;

  const slots = [{ dow: fromIso(date).getDay(), time }, ...extra.slice(0, spw - 1)];
  const sessionsFirstCharge = mode === 'weekly' ? spw : count;
  const gross = unit * sessionsFirstCharge;
  const discount = Math.round((gross * discPct) / 100);
  const afterDisc = gross - discount;
  const promoUsed = Math.min(promo, afterDisc);
  const creditUsed = useCredit ? Math.min(creditTotal, afterDisc - promoUsed) : 0;
  const total = afterDisc - promoUsed - creditUsed;

  const applyPromo = () => {
    const v = PROMOS[promoIn.trim().toUpperCase()];
    if (v) {
      setPromo(v);
      setPromoErr('');
    } else {
      setPromo(0);
      setPromoErr('This code is not valid.');
    }
  };

  const slotFree = (sl: { dow: number; time: string }) => {
    const d = nextDow(date, sl.dow);
    return slotsFor(s, pro.id, d).includes(sl.time);
  };
  const weeklyConflict = mode === 'weekly' && slots.slice(1).some((sl) => !slotFree(sl) || (sl.dow === slots[0].dow && sl.time === slots[0].time));

  const pay = () => {
    setPaying(true);
    setTimeout(() => {
      const r = api.book({
        proId: pro.id,
        mode: mode === 'single' ? 'single' : mode === 'weekly' ? 'weekly' : 'pack',
        date,
        time,
        where,
        count: count,
        slots,
        unit: mode === 'single' || mode === 'weekly' ? unit : Math.round((unit * (100 - discPct)) / 100),
        creditUsed: creditUsed,
      });
      setPaying(false);
      navigation.replace('Confirmed', { ids: r.ids, seriesId: r.seriesId, total, mode, proId: pro.id, date, time });
    }, 1300);
  };

  const modeCard = (m: Mode, title: string, sub: string, badge?: string) => (
    <Radio on={mode === m} onPress={() => setMode(m)} label={badge ? t(title) + ' · ' + badge : title} sub={sub} />
  );

  return (
    <Screen
      title="Checkout"
      onBack={() => navigation.goBack()}
      footer={
        <>
          <Btn label={paying ? 'Processing…' : tf('Pay {amount}', { amount: money(total) })} disabled={paying || weeklyConflict} onPress={pay} />
          {paying ? <ActivityIndicator color={colors.coral} /> : null}
        </>
      }
    >
      <Card style={{ gap: 4 }}>
        <Text style={{ fontFamily: fonts.semibold, fontSize: 15, color: colors.ink }}>{pro.name}</Text>
        <Text style={{ fontFamily: fonts.regular, fontSize: 13, color: colors.gray }}>{fmtDate(date, lang) + ' · ' + fmtTime(time, lang)}</Text>
        <Text style={{ fontFamily: fonts.regular, fontSize: 13, color: colors.gray }}>{where}</Text>
      </Card>

      <Section title="How many sessions?">
        <View style={{ gap: 8 }}>
          {modeCard('single', '1 session', money(unit))}
          {packsOffered[4] ? modeCard('pack4', '4 sessions', 'Once a week, same day and time', tf('{p}% off', { p: PACK_DISCOUNT[4] })) : null}
          {packsOffered[8] ? modeCard('pack8', '8 sessions', 'Once a week, same day and time', tf('{p}% off', { p: PACK_DISCOUNT[8] })) : null}
          {weeklyOffered ? modeCard('weekly', 'Repeat weekly', 'Charged each week, stop any time') : null}
        </View>
      </Section>

      {mode === 'weekly' ? (
        <Section title="Weekly plan">
          <Card style={{ gap: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ flex: 1, fontFamily: fonts.medium, fontSize: 14, color: colors.ink }}>Sessions per week</Text>
              <Stepper value={spw} min={1} max={3} onChange={setSpw} />
            </View>
            <Divider />
            <Text style={{ fontFamily: fonts.regular, fontSize: 13, color: colors.gray }}>{tf('Session 1: every {d}, {t}', { d: dayName(date, lang), t: fmtTime(time, lang) })}</Text>
            {extra.slice(0, spw - 1).map((sl, i) => {
              const first = nextDow(date, sl.dow);
              const free = slotsFor(s, pro.id, first);
              return (
                <View key={i} style={{ gap: 8 }}>
                  <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: colors.ink }}>{tf('Session {n}', { n: i + 2 })}</Text>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                    {[0, 1, 2, 3, 4, 5, 6].map((d) => (
                      <Chip key={d} label={lang === 'ar' ? dayName(addDaysIso('2026-11-01', d), lang) : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d]} on={sl.dow === d} onPress={() => setExtra(extra.map((x, j) => (j === i ? { ...x, dow: d } : x)))} />
                    ))}
                  </View>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                    {free.length === 0 ? <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: colors.gray }}>No free times that day</Text> : null}
                    {free.map((x) => (
                      <Chip key={x} label={fmtTime(x, lang)} on={sl.time === x} onPress={() => setExtra(extra.map((y, j) => (j === i ? { ...y, time: x } : y)))} />
                    ))}
                  </View>
                </View>
              );
            })}
            {weeklyConflict ? <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: colors.coralDark }}>Choose a free time for each session.</Text> : null}
          </Card>
          <Notice text="You pay for this week's sessions now. After that you are charged every week, 48 hours before the first session of that week. Stop any time. Stopping applies from the next charge." icon="repeat" />
        </Section>
      ) : null}

      {mode === 'pack4' || mode === 'pack8' ? (
        <Notice text="All sessions are paid now. Sessions are booked on the same day and time each week. Cancelling a session more than 24 hours ahead gives you a rebooking credit." icon="calendar" />
      ) : null}

      <Section title="Promo code">
        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-end' }}>
          <View style={{ flex: 1 }}><Field label="Code" value={promoIn} onChangeText={setPromoIn} autoCapitalize="characters" placeholder="Try WELCOME" error={promoErr} /></View>
          <Btn label="Apply" kind="small" onPress={applyPromo} style={{ marginBottom: promoErr ? 22 : 6 }} />
        </View>
      </Section>

      {creditTotal > 0 ? <Check on={useCredit} onPress={() => setUseCredit(!useCredit)} label={tf('Use my credits ({a} available)', { a: money(creditTotal) })} /> : null}

      <Section title="Payment method">
        <View style={{ gap: 8 }}>
          <Radio on={method === 'card'} onPress={() => setMethod('card')} label={tf('Card ending {n}', { n: 4242 })} sub="Demo card" />
          <Radio on={method === 'apple'} onPress={() => setMethod('apple')} label="Apple Pay" sub="Demo" />
        </View>
      </Section>

      <Card style={{ gap: 10 }}>
        <Line label={mode === 'weekly' ? tf('{n} sessions this week', { n: spw }) : tf('{n} × session', { n: count })} value={money(gross)} />
        {discount > 0 ? <Line label={tf('Pack discount ({p}%)', { p: discPct })} value={'− ' + money(discount)} accent /> : null}
        {promoUsed > 0 ? <Line label="Promo code" value={'− ' + money(promoUsed)} accent /> : null}
        {creditUsed > 0 ? <Line label="Credits" value={'− ' + money(creditUsed)} accent /> : null}
        <Divider />
        <Line label="Total today" value={money(total)} bold />
      </Card>
      <Notice text="Prototype: no real payment is taken." icon="lock" />
    </Screen>
  );
}
