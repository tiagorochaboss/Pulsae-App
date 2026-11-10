import React, { useState } from 'react';
import { View } from 'react-native';
import { colors, fonts } from '../../theme';
import { Avatar, BellButton, Btn, Card, Chip, Divider, Field, Notice, Panel, Screen, Section, Stepper, Tag, Text, Toggle, useToast } from '../../components/ui';
import { ME_PRO_ID } from '../../data';
import { useStore } from '../../store';
import { useI18n } from '../../i18n';
import { money, PACK_DISCOUNT } from '../../lib';

const SPECIALTIES = ['Sports injuries', 'Rehab', 'Back and neck', 'Strength', 'Weight loss', 'Mobility'];
const toggle = (a: string[], v: string) => (a.includes(v) ? a.filter((x) => x !== v) : [...a, v]);

export default function ProProfile({ navigation }: any) {
  const { s, api } = useStore();
  const { tf } = useI18n();
  const toast = useToast();
  const p = s.proProfile;
  const [about, setAbout] = useState(p.about);
  const [confirmOff, setConfirmOff] = useState(false);
  const active = s.series.filter((x) => x.proId === ME_PRO_ID && x.status === 'active');
  const unread = s.notifs.pro.filter((n) => n.unread).length;

  return (
    <View style={{ flex: 1 }}>
      <Screen title="My profile" right={<BellButton count={unread} onPress={() => navigation.navigate('Notifications')} />}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <Avatar size={64} />
          <View style={{ flex: 1, gap: 4 }}>
            <Text style={{ fontFamily: fonts.semibold, fontSize: 18, color: colors.ink }}>Sample Name A</Text>
            <Tag label="Live in Discover" tone="outline" />
          </View>
        </View>
        <Btn label="Preview how customers see me" kind="outline" onPress={() => navigation.navigate('ProDetail', { id: ME_PRO_ID })} />

        <Section title="About you">
          <Field label="Introduction" value={about} onChangeText={setAbout} multiline style={{ height: 110, paddingTop: 12 }} placeholder="Tell customers about your approach" />
          <Btn label="Save" kind="small" onPress={() => { api.setProProfile({ about }); toast.show('Saved'); }} />
        </Section>

        <Section title="Specialties">
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {SPECIALTIES.map((x) => <Chip key={x} label={x} on={p.specialties.includes(x)} onPress={() => api.setProProfile({ specialties: toggle(p.specialties, x) })} />)}
          </View>
        </Section>

        <Section title="Price per session">
          <Card style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ flex: 1, fontFamily: fonts.semibold, fontSize: 16, color: colors.ink }}>{money(p.price)}</Text>
            <Stepper value={p.price / 10} min={5} max={100} onChange={(v) => api.setProProfile({ price: v * 10 })} />
          </Card>
        </Section>

        <Section title="Discounts on packs">
          <Card style={{ gap: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ flex: 1, fontFamily: fonts.medium, fontSize: 14, color: colors.ink }}>{tf('4 sessions, {p}% off', { p: PACK_DISCOUNT[4] })}</Text>
              <Toggle on={p.d4} onChange={(v) => api.setProProfile({ d4: v })} />
            </View>
            <Divider />
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ flex: 1, fontFamily: fonts.medium, fontSize: 14, color: colors.ink }}>{tf('8 sessions, {p}% off', { p: PACK_DISCOUNT[8] })}</Text>
              <Toggle on={p.d8} onChange={(v) => api.setProProfile({ d8: v })} />
            </View>
            <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: colors.gray }}>You fund these discounts, as agreed in the Professional Terms.</Text>
          </Card>
        </Section>

        <Section title="Weekly repeat bookings">
          <Card style={{ gap: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: fonts.medium, fontSize: 14, color: colors.ink }}>Offer weekly repeats</Text>
                <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: colors.gray }}>Customers can book the same slot every week.</Text>
              </View>
              <Toggle on={p.weekly} onChange={(v) => { if (v) api.setWeekly(true); else setConfirmOff(true); }} />
            </View>
          </Card>
          {confirmOff ? (
            <Panel title="Turn off weekly repeats?">
              <Notice icon="alert-circle" text={tf('{n} running weekly series will stop. Customers are told. Sessions that are not paid yet are cancelled and removed. Sessions already paid are kept.', { n: active.length })} />
              <Btn label="Turn off and stop series" kind="danger" onPress={() => { api.setWeekly(false); setConfirmOff(false); toast.show('Weekly repeats are off.'); }} />
              <Btn label="Keep on" kind="outline" onPress={() => setConfirmOff(false)} />
            </Panel>
          ) : null}
        </Section>
      </Screen>
      {toast.node}
    </View>
  );
}
