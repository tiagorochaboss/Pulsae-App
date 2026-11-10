import React, { useState } from 'react';
import { Share, View } from 'react-native';
import { colors, fonts } from '../../theme';
import { Avatar, Btn, BellButton, Card, Divider, Empty, Field, Icon, Line, Notice, RowItem, Screen, Tag, Text, Toggle, useToast } from '../../components/ui';
import { useStore } from '../../store';
import { PROS } from '../../data';
import { useApp } from '../../role';
import { useI18n } from '../../i18n';
import { fmtDate, money } from '../../lib';

export default function Profile({ navigation }: any) {
  const { s, api } = useStore();
  const { switchRole, logout } = useApp();
  const { lang, setLang, tf } = useI18n();
  const unread = s.notifs.customer.filter((n) => n.unread).length;
  return (
    <Screen title="Profile" right={<BellButton count={unread} onPress={() => navigation.navigate('Notifications')} />}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
        <Avatar size={64} />
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: fonts.semibold, fontSize: 18, color: colors.ink }}>{s.customerName}</Text>
          <Text style={{ fontFamily: fonts.regular, fontSize: 13, color: colors.gray }}>Riyadh</Text>
        </View>
      </View>
      <View>
        <RowItem icon="user" title="Personal details" onPress={() => navigation.navigate('PersonalDetails')} />
        <RowItem icon="map-pin" title="Saved addresses" sub={tf('{n} saved', { n: s.addresses.customer.length })} onPress={() => navigation.navigate('SavedAddresses')} />
        <RowItem icon="credit-card" title="Payment methods" onPress={() => navigation.navigate('PaymentMethods')} />
        <RowItem icon="gift" title="Credits and referrals" sub={money(s.credits.reduce((a, c) => a + c.amount, 0))} onPress={() => navigation.navigate('Credits')} />
        <RowItem icon="heart" title="Saved professionals" sub={tf('{n} saved', { n: s.favorites.length })} onPress={() => navigation.navigate('Saved')} />
        <RowItem icon="bell" title="Notification settings" onPress={() => navigation.navigate('NotifSettings')} />
        <RowItem icon="globe" title="Language" sub={lang === 'en' ? 'English' : 'العربية'} onPress={() => setLang(lang === 'en' ? 'ar' : 'en')} />
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

export function PersonalDetails({ navigation }: any) {
  const { s, api } = useStore();
  const [name, setName] = useState(s.customerName);
  const toast = useToast();
  return (
    <View style={{ flex: 1 }}>
      <Screen title="Personal details" onBack={() => navigation.goBack()} footer={<Btn label="Save" disabled={!name.trim()} onPress={() => { api.setCustomerName(name.trim()); toast.show('Saved'); }} />}>
        <Field label="Full name" value={name} onChangeText={setName} />
        <Card style={{ gap: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ flex: 1, fontFamily: fonts.regular, fontSize: 14, color: colors.gray }}>Mobile</Text>
            <Tag label="Verified" tone="outline" />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ flex: 1, fontFamily: fonts.regular, fontSize: 14, color: colors.gray }}>Email</Text>
            <Tag label="Verified" tone="outline" />
          </View>
        </Card>
        <Notice text="To change your gender, mobile number or email, contact us so we can verify the change." />
      </Screen>
      {toast.node}
    </View>
  );
}

export function PaymentMethods({ navigation }: any) {
  const { tf } = useI18n();
  const [cards, setCards] = useState([4242]);
  return (
    <Screen title="Payment methods" onBack={() => navigation.goBack()} footer={<Btn label="Add a card (demo)" onPress={() => setCards([...cards, 1000 + cards.length * 111])} />}>
      {cards.map((c, i) => (
        <Card key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Icon name="credit-card" color={colors.coralDark} />
          <Text style={{ flex: 1, fontFamily: fonts.medium, fontSize: 14, color: colors.ink }}>{tf('Card ending {n}', { n: c })}</Text>
          {i === 0 ? <Tag label="Default" /> : null}
        </Card>
      ))}
      <Notice icon="lock" text="Prototype: cards are placeholders. A secure payment provider will handle real card details." />
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

export function NotifSettings({ navigation }: any) {
  const [v, setV] = useState({ bookings: true, messages: true, offers: false, community: true });
  const rows: [keyof typeof v, string, string][] = [
    ['bookings', 'Bookings and reminders', 'Confirmations, changes and reminders'],
    ['messages', 'Messages', 'New messages from your professional'],
    ['offers', 'Offers', 'Promotions and credits'],
    ['community', 'Community', 'Events and posts'],
  ];
  return (
    <Screen title="Notification settings" onBack={() => navigation.goBack()}>
      {rows.map(([k, t, sub]) => (
        <View key={k} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: fonts.medium, fontSize: 14, color: colors.ink }}>{t}</Text>
            <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: colors.gray }}>{sub}</Text>
          </View>
          <Toggle on={v[k]} onChange={(x) => setV({ ...v, [k]: x })} />
        </View>
      ))}
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
