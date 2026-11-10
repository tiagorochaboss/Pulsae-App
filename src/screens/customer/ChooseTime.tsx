import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { colors, fonts } from '../../theme';
import { Btn, Icon, Radio, Screen, Section, Text, Chip, Notice } from '../../components/ui';
import { PROS } from '../../data';
import { slotsFor, useStore } from '../../store';
import { useI18n } from '../../i18n';
import { addDaysIso, dayName, fromIso, todayIso, fmtTime } from '../../lib';

export default function ChooseTime({ navigation, route }: any) {
  const { s } = useStore();
  const { lang, tf, t } = useI18n();
  const pro = PROS.find((p) => p.id === route.params.id) || PROS[0];
  const days = Array.from({ length: 14 }, (_, i) => addDaysIso(todayIso(), i));
  const [date, setDate] = useState(days.find((d) => slotsFor(s, pro.id, d).length > 0) || days[0]);
  const [time, setTime] = useState('');
  const [where, setWhere] = useState(pro.locations[0]);
  const [addrId, setAddrId] = useState('');
  const slots = slotsFor(s, pro.id, date);
  const needsAddress = where === 'Home' || where === 'Gym';
  const addresses = s.addresses.customer.filter((a) => (where === 'Gym' ? a.label === 'Gym' || a.label !== 'Home' : true));

  useEffect(() => {
    if (needsAddress && !addresses.find((a) => a.id === addrId)) {
      const d = addresses.find((a) => a.isDefault) || addresses[0];
      setAddrId(d ? d.id : '');
    }
  }, [where, s.addresses.customer.length]);

  const addr = s.addresses.customer.find((a) => a.id === addrId);
  const whereText = needsAddress ? (addr ? addr.line : where) : tf('{p}\'s place', { p: pro.name });
  const ready = time !== '' && (!needsAddress || !!addr);

  return (
    <Screen
      title="Choose a time"
      onBack={() => navigation.goBack()}
      footer={<Btn label="Continue" disabled={!ready} onPress={() => navigation.navigate('Checkout', { id: pro.id, date, time, where: whereText })} />}
    >
      <Section title="Day">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          {days.map((d) => {
            const on = d === date;
            const has = slotsFor(s, pro.id, d).length > 0;
            return (
              <Pressable key={d} onPress={() => { setDate(d); setTime(''); }} style={{ width: 58, height: 72, borderRadius: 16, borderWidth: 1, borderColor: on ? colors.ink : colors.border, backgroundColor: on ? colors.ink : colors.white, alignItems: 'center', justifyContent: 'center', opacity: has ? 1 : 0.4 }}>
                <Text style={{ fontFamily: fonts.regular, fontSize: 11, color: on ? colors.white : colors.gray }}>{dayName(d, lang)}</Text>
                <Text style={{ fontFamily: fonts.semibold, fontSize: 18, color: on ? colors.white : colors.ink }}>{String(fromIso(d).getDate())}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </Section>
      <Section title="Time">
        {slots.length === 0 ? (
          <Text style={{ fontFamily: fonts.regular, fontSize: 13, color: colors.gray }}>No free times on this day. Try another day.</Text>
        ) : (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {slots.map((x) => (
              <Chip key={x} label={fmtTime(x, lang)} on={time === x} onPress={() => setTime(x)} />
            ))}
          </View>
        )}
      </Section>
      <Section title="Where">
        <View style={{ gap: 8 }}>
          {pro.locations.map((l) => (
            <Radio key={l} on={where === l} onPress={() => setWhere(l)} label={l === 'Their place' ? 'At the professional\'s place' : l === 'Home' ? 'At my home' : 'At a gym'} />
          ))}
        </View>
      </Section>
      {needsAddress ? (
        <Section title="Address" right={<Pressable onPress={() => navigation.navigate('AddAddress', { role: 'customer' })}><Text style={{ fontFamily: fonts.medium, fontSize: 13, color: colors.coralDark }}>Add new</Text></Pressable>}>
          <View style={{ gap: 8 }}>
            {addresses.map((a) => (
              <Radio key={a.id} on={addrId === a.id} onPress={() => setAddrId(a.id)} label={a.label} sub={a.line} />
            ))}
            {addresses.length === 0 ? <Notice text="You have no saved address yet. Tap Add new." icon="map-pin" /> : null}
          </View>
        </Section>
      ) : (
        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
          <Icon name="map-pin" size={16} color={colors.gray} />
          <Text style={{ fontFamily: fonts.regular, fontSize: 13, color: colors.gray }}>{t(pro.area) + (lang === 'ar' ? '، ' : ', ') + t('Riyadh')}</Text>
        </View>
      )}
    </Screen>
  );
}
