import React, { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { colors, fonts } from '../../theme';
import { Btn, Card, Chip, Divider, Notice, Panel, Screen, Section, Stepper, Text, Toggle } from '../../components/ui';
import { useStore } from '../../store';
import { useI18n } from '../../i18n';
import { DAYS_AR, DAYS_FULL_EN, addDaysIso, dayName, fmtDate, fromIso, hourLabel, fmtTime, todayIso } from '../../lib';

export default function Availability({ navigation }: any) {
  const { s, api } = useStore();
  const { lang, tf } = useI18n();
  const [adding, setAdding] = useState(false);
  const [date, setDate] = useState(addDaysIso(todayIso(), 1));
  const [from, setFrom] = useState(12);
  const [to, setTo] = useState(13);
  const days = Array.from({ length: 14 }, (_, i) => addDaysIso(todayIso(), i));

  return (
    <Screen title="Availability" onBack={() => navigation.goBack()}>
      <Notice text="Customers can book one-hour sessions inside these hours." icon="clock" />
      {s.avail.map((a, d) => (
        <Card key={d} style={{ gap: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ flex: 1, fontFamily: fonts.medium, fontSize: 15, color: colors.ink }}>{lang === 'ar' ? DAYS_AR[d] : DAYS_FULL_EN[d]}</Text>
            <Toggle on={a.on} onChange={(v) => api.setAvail(d, { on: v })} />
          </View>
          {a.on ? (
            <View style={{ gap: 10 }}>
              <Divider />
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ flex: 1, fontFamily: fonts.regular, fontSize: 13, color: colors.gray }}>{tf('From {t}', { t: fmtTime(hourLabel(a.start), lang) })}</Text>
                <Stepper value={a.start} min={5} max={a.end - 1} onChange={(v) => api.setAvail(d, { start: v })} />
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ flex: 1, fontFamily: fonts.regular, fontSize: 13, color: colors.gray }}>{tf('To {t}', { t: fmtTime(hourLabel(a.end), lang) })}</Text>
                <Stepper value={a.end} min={a.start + 1} max={23} onChange={(v) => api.setAvail(d, { end: v })} />
              </View>
            </View>
          ) : null}
        </Card>
      ))}

      <Section title="Blocked times">
        {s.blocks.length === 0 ? <Text style={{ fontFamily: fonts.regular, fontSize: 13, color: colors.gray }}>No blocked times.</Text> : null}
        {s.blocks.map((b) => (
          <Card key={b.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Text style={{ flex: 1, fontFamily: fonts.medium, fontSize: 14, color: colors.ink }}>{fmtDate(b.date, lang) + ' · ' + fmtTime(hourLabel(b.from), lang) + ' – ' + fmtTime(hourLabel(b.to), lang)}</Text>
            <Pressable onPress={() => api.removeBlock(b.id)}><Text style={{ fontFamily: fonts.medium, fontSize: 13, color: colors.coralDark }}>Remove</Text></Pressable>
          </Card>
        ))}
        {adding ? (
          <Panel title="Block a time">
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
              {days.map((d) => <Chip key={d} label={dayName(d, lang) + ' ' + fromIso(d).getDate()} on={date === d} onPress={() => setDate(d)} />)}
            </ScrollView>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ flex: 1, fontFamily: fonts.regular, fontSize: 13, color: colors.gray }}>{tf('From {t}', { t: fmtTime(hourLabel(from), lang) })}</Text>
              <Stepper value={from} min={5} max={to - 1} onChange={setFrom} />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ flex: 1, fontFamily: fonts.regular, fontSize: 13, color: colors.gray }}>{tf('To {t}', { t: fmtTime(hourLabel(to), lang) })}</Text>
              <Stepper value={to} min={from + 1} max={23} onChange={setTo} />
            </View>
            <Btn label="Save blocked time" onPress={() => { api.addBlock(date, from, to); setAdding(false); }} />
            <Btn label="Cancel" kind="outline" onPress={() => setAdding(false)} />
          </Panel>
        ) : (
          <Btn label="Block a time" kind="outline" onPress={() => setAdding(true)} />
        )}
      </Section>
    </Screen>
  );
}
