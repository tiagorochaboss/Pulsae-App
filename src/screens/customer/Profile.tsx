import React, { useState } from 'react';
import { Pressable, Share, View } from 'react-native';
import { MyAvatar } from '../../components/MyAvatar';
import { colors, fonts } from '../../theme';
import { Avatar, Btn, BellButton, Card, Divider, Empty, Field, Icon, Line, Notice, RowItem, Screen, Tag, Text, Toggle, useToast } from '../../components/ui';
import { useStore } from '../../store';
import { PROS } from '../../data';
import { fmtShort } from '../../lib';
import { useApp } from '../../role';
import { useI18n } from '../../i18n';
import { fmtDate, money } from '../../lib';

export default function Profile({ navigation }: any) {
  const { s, api } = useStore();
  const { switchRole, logout } = useApp();
  const { lang, setLang, tf } = useI18n();
  const unread = s.notifs.customer.filter((n) => n.unread).length;
  return (
    <Screen title="Settings" right={<BellButton count={unread} onPress={() => navigation.navigate('Notifications')} />}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
        <Pressable onPress={() => navigation.navigate('ProfilePhoto')}><MyAvatar role="customer" size={64} /></Pressable>
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: fonts.semibold, fontSize: 18, color: colors.ink }}>{s.account.customer.first + ' ' + s.account.customer.last}</Text>
          <Text style={{ fontFamily: fonts.regular, fontSize: 13, color: colors.gray }}>Riyadh</Text>
        </View>
      </View>
      <View>
        <RowItem icon="user" title="Personal details" sub="Name, mobile, email, password" onPress={() => navigation.navigate('PersonalDetails')} />
        <RowItem icon="lock" title="Login and security" sub="Remember me, Face ID, password" onPress={() => navigation.navigate('Security')} />
        <RowItem icon="map-pin" title="Saved addresses" sub={tf('{n} saved', { n: s.addresses.customer.length })} onPress={() => navigation.navigate('SavedAddresses')} />
        <RowItem icon="credit-card" title="Payment methods" sub={tf('{n} saved', { n: s.cards.length })} onPress={() => navigation.navigate('PaymentMethods')} />
        <RowItem icon="gift" title="My prepaid sessions" sub={tf('{n} left', { n: s.packs.reduce((a, p) => a + (p.total - p.used), 0) })} onPress={() => navigation.navigate('Prepaid')} />
        <RowItem icon="tag" title="Credits and referrals" sub={money(s.credits.reduce((a, c) => a + c.amount, 0))} onPress={() => navigation.navigate('Credits')} />
        <RowItem icon="heart" title="Saved professionals" sub={tf('{n} saved', { n: s.favorites.length })} onPress={() => navigation.navigate('Saved')} />
        <RowItem icon="bell" title="Notification settings" onPress={() => navigation.navigate('NotifSettings')} />
        <RowItem icon="globe" title="Language" sub={lang === 'en' ? 'English' : 'العربية'} onPress={() => navigation.navigate('Language')} />
        <RowItem icon="file-text" title="Legal" sub="Terms and privacy" onPress={() => navigation.navigate('Legal')} />
        <RowItem icon="help-circle" title="Help centre" onPress={() => navigation.navigate('Help')} />
        <RowItem icon="message-square" title="Contact us" onPress={() => navigation.navigate('ContactUs')} />
      </View>
      <Divider />
      <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: colors.gray }}>Prototype tools</Text>
      <Btn label="See the professional app" kind="outline" onPress={() => switchRole('pro')} />
      <Btn label="Reset demo data" kind="outline" onPress={() => api.resetDemo()} />
      <Btn label="Log out" kind="danger" onPress={logout} />
    </Screen>
  );
}

export function Credits({ navigation }: any) {
  const { s } = useStore();
  const { lang } = useI18n();
  const total = s.credits.reduce((a, c) => a + c.amount, 0);
  const share = () => {
    try {
      Share.share({ message: 'Join me on Pulsae. Use my code PULSAE25 and we both get SAR 25.' });
    } catch (e) {}
  };
  return (
    <Screen title="Credits and referrals" onBack={() => navigation.goBack()}>
      <Card style={{ gap: 6, alignItems: 'center', backgroundColor: colors.pale, borderColor: colors.pale }}>
        <Text style={{ fontFamily: fonts.regular, fontSize: 13, color: colors.coralDark }}>Available credits</Text>
        <Text style={{ fontFamily: fonts.semibold, fontSize: 30, color: colors.coralDarkest }}>{money(total)}</Text>
      </Card>
      {s.credits.map((c) => (
        <Card key={c.id} style={{ gap: 8 }}>
          <Line label={c.source} value={money(c.amount)} bold />
          <Line label="Expires" value={fmtDate(c.expires, lang)} />
        </Card>
      ))}
      <Card style={{ gap: 8 }}>
        <Text style={{ fontFamily: fonts.medium, fontSize: 15, color: colors.ink }}>Invite a friend</Text>
        <Text style={{ fontFamily: fonts.regular, fontSize: 13, lineHeight: 20, color: colors.gray }}>You and your friend each get SAR 25 after their first session.</Text>
        <Text style={{ fontFamily: fonts.semibold, fontSize: 18, color: colors.coralDark }}>PULSAE25</Text>
        <Btn label="Share my code" kind="outline" onPress={share} />
      </Card>
    </Screen>
  );
}

export function SavedPros({ navigation }: any) {
  const { s } = useStore();
  const list = PROS.filter((p) => s.favorites.includes(p.id));
  return (
    <Screen title="Saved professionals" onBack={() => navigation.goBack()}>
      {list.length === 0 ? <Empty icon="heart" title="No saved professionals" sub="Tap the heart on a profile to save it." /> : null}
      {list.map((p) => (
        <RowItem key={p.id} icon="user" title={p.name} sub={p.role} onPress={() => navigation.navigate('ProDetail', { id: p.id })} />
      ))}
    </Screen>
  );
}

export function Prepaid({ navigation }: any) {
  const { s } = useStore();
  const { lang, tf } = useI18n();
  return (
    <Screen title="My prepaid sessions" onBack={() => navigation.goBack()}>
      <Notice icon="gift" text="Sessions you paid for in advance. They are used with the same professional, whenever you want. Book each one when you are ready." />
      {s.packs.length === 0 ? <Empty icon="gift" title="No prepaid sessions" sub="Buy 4 or 8 sessions with a professional at checkout and save." /> : null}
      {s.packs.map((pk) => {
        const pro = PROS.find((p) => p.id === pk.proId);
        const left = pk.total - pk.used;
        const mine = s.bookings.filter((b) => b.packId === pk.id && b.status !== 'cancelled').sort((a, b) => (a.packNo || 0) - (b.packNo || 0));
        return (
          <Card key={pk.id} style={{ gap: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ flex: 1, fontFamily: fonts.semibold, fontSize: 15, color: colors.ink }}>{pro ? pro.name : ''}</Text>
              <Tag label={tf('{n} of {t} left', { n: left, t: pk.total })} tone={left > 0 ? 'outline' : 'gray'} />
            </View>
            <Line label="Bought on" value={fmtDate(pk.boughtOn, lang)} />
            <Line label="Price per session" value={money(pk.unit)} />
            {pk.discountPct ? <Line label="Discount" value={tf('{p}% off', { p: pk.discountPct })} accent /> : null}
            {mine.map((b) => (
              <Line key={b.id} label={tf('Session {n}', { n: b.packNo || 1 })} value={fmtShort(b.date, lang)} />
            ))}
            {left > 0 ? <Btn label="Book next session" kind="smallPrimary" onPress={() => navigation.navigate('ChooseTime', { id: pk.proId, packId: pk.id })} /> : null}
          </Card>
        );
      })}
    </Screen>
  );
}
