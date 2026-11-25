import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import { MyAvatar } from '../../components/MyAvatar';
import { colors, fonts } from '../../theme';
import { BellButton, Btn, Card, Chip, Divider, Field, Notice, Panel, RowItem, Screen, Section, Stepper, Tag, Text, Toggle, VerifiedBadge, useToast } from '../../components/ui';
import { StatTile } from '../../components/Fun';
import { ME_PRO_ID } from '../../data';
import { useStore } from '../../store';
import { useI18n } from '../../i18n';
import { money, PACK_DISCOUNT } from '../../lib';

const SPECIALTIES = ['Sports injuries', 'Rehab', 'Back and neck', 'Strength', 'Weight loss', 'Mobility'];
const PRICE_STEP = 25;
const PRICE_MIN = 100;
const PRICE_MAX = 1000;
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
  const mineReviews = s.reviews.filter((r) => r.proId === ME_PRO_ID);
  const avg = mineReviews.length ? mineReviews.reduce((a, r) => a + r.rating, 0) / mineReviews.length : 0;

  return (
    <View style={{ flex: 1 }}>
      <Screen title="Professional" right={<BellButton count={unread} onPress={() => navigation.navigate('Notifications')} />}>
        <View style={{ backgroundColor: colors.coral, borderRadius: 24, padding: 18, overflow: 'hidden', gap: 12 }}>
          <View style={{ position: 'absolute', end: -30, top: -40, width: 150, height: 150, borderRadius: 75, backgroundColor: colors.white, opacity: 0.14 }} />
          <View style={{ position: 'absolute', end: 70, bottom: -50, width: 100, height: 100, borderRadius: 50, backgroundColor: colors.white, opacity: 0.1 }} />
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            <Pressable onPress={() => navigation.navigate('ProfilePhoto')} style={{ borderWidth: 3, borderColor: colors.white, borderRadius: 40 }}><MyAvatar role="pro" size={64} /></Pressable>
            <View style={{ flex: 1, gap: 6 }}>
              <Text style={{ fontFamily: fonts.semibold, fontSize: 19, color: colors.white }}>{s.account.pro.first + ' ' + s.account.pro.last}</Text>
              <View style={{ flexDirection: 'row', gap: 6 }}>
                <Tag label="Live in Discover" tone="outline" />
                <VerifiedBadge cert="SCFHS licence" />
              </View>
            </View>
          </View>
        </View>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <StatTile tone="sun" value={avg ? avg.toFixed(1) : '-'} label="Average rating" />
          <StatTile tone="sky" value={String(mineReviews.length)} label="Reviews" />
          <StatTile tone="mint" value={String(active.length)} label="Weekly series" />
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

        <Section title="Photos and videos">
          <RowItem icon="image" title="Show your work" sub={s.media.length ? tf('{n} added', { n: s.media.length }) : 'Optional. Photos and videos appear on your profile.'} onPress={() => navigation.navigate('MyMedia')} />
        </Section>

        <Section title="Price per session">
          <Card style={{ gap: 6 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Text style={{ flex: 1, fontFamily: fonts.medium, fontSize: 14, color: colors.ink }}>Per session</Text>
              <Stepper value={p.price} step={PRICE_STEP} min={PRICE_MIN} max={PRICE_MAX} format={money} onChange={(v) => api.setProProfile({ price: v })} />
            </View>
            <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: colors.gray }}>{tf('Changes move in steps of {n} SAR.', { n: PRICE_STEP })}</Text>
          </Card>
        </Section>

        <Section title="Offers from Pulsae">
          <Card style={{ gap: 10 }}>
            <Text style={{ fontFamily: fonts.regular, fontSize: 13, lineHeight: 20, color: colors.gray }}>Pulsae runs offers that help bring you more regular customers. These are part of the Professional Terms and apply to all professionals.</Text>
            <Divider />
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ flex: 1, fontFamily: fonts.medium, fontSize: 14, color: colors.ink }}>{tf('4 prepaid sessions, {p}% off', { p: PACK_DISCOUNT[4] })}</Text>
              <Tag label="Active" tone="outline" />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ flex: 1, fontFamily: fonts.medium, fontSize: 14, color: colors.ink }}>{tf('8 prepaid sessions, {p}% off', { p: PACK_DISCOUNT[8] })}</Text>
              <Tag label="Active" tone="outline" />
            </View>
            <Text style={{ fontFamily: fonts.regular, fontSize: 12, lineHeight: 18, color: colors.gray }}>The discount is covered from your session price, and prepaid sessions are always honoured. We will tell you in the app when new offers are added. You can see the exact amount in Earnings.</Text>
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

        <Section title="Schedule and places">
          <View>
            <RowItem icon="clock" title="Availability" sub="Your weekly hours and days off" onPress={() => navigation.navigate('Availability')} />
            <RowItem icon="map" title="Service area" onPress={() => navigation.navigate('ServiceArea')} />
            <RowItem icon="map-pin" title="Saved places" sub={tf('{n} saved', { n: s.addresses.pro.length })} onPress={() => navigation.navigate('SavedAddresses')} />
          </View>
        </Section>

        <Section title="Clients and reviews">
          <View>
            <RowItem icon="users" title="Clients" onPress={() => navigation.navigate('ProClients')} />
            <RowItem icon="star" title="Reviews" onPress={() => navigation.navigate('ProReviews')} />
          </View>
        </Section>

        <Section title="Earnings and payouts">
          <View>
            <RowItem icon="credit-card" title="Earnings" onPress={() => navigation.navigate('Earnings')} />
            <RowItem icon="briefcase" title="Bank account" onPress={() => navigation.navigate('Bank')} />
          </View>
        </Section>

        <Section title="Credentials">
          <RowItem icon="file-text" title="Credentials and documents" sub="Licence, ID and certificates" onPress={() => navigation.navigate('Docs')} />
        </Section>
      </Screen>
      {toast.node}
    </View>
  );
}
