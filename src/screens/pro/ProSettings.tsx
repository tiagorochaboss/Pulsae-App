import React, { useState } from 'react';
import { View } from 'react-native';
import { colors, fonts } from '../../theme';
import { Btn, Card, Divider, Field, Notice, RowItem, Screen, Tag, Text, useToast } from '../../components/ui';
import { useStore } from '../../store';
import { useApp } from '../../role';
import { useI18n } from '../../i18n';

export default function ProSettings({ navigation }: any) {
  const { s, api } = useStore();
  const { switchRole, logout } = useApp();
  const { lang, setLang, tf } = useI18n();
  return (
    <Screen title="Settings">
      <View>
        <RowItem icon="clock" title="Availability" onPress={() => navigation.navigate('Availability')} />
        <RowItem icon="map" title="Service area" onPress={() => navigation.navigate('ServiceArea')} />
        <RowItem icon="map-pin" title="Saved places" sub={tf('{n} saved', { n: s.addresses.pro.length })} onPress={() => navigation.navigate('SavedAddresses')} />
        <RowItem icon="credit-card" title="Earnings" onPress={() => navigation.navigate('Earnings')} />
        <RowItem icon="briefcase" title="Bank account" onPress={() => navigation.navigate('Bank')} />
        <RowItem icon="file-text" title="Credentials and documents" onPress={() => navigation.navigate('Docs')} />
        <RowItem icon="bell" title="Notification settings" onPress={() => navigation.navigate('NotifSettings')} />
        <RowItem icon="globe" title="Language" sub={lang === 'en' ? 'English' : 'العربية'} onPress={() => setLang(lang === 'en' ? 'ar' : 'en')} />
        <RowItem icon="help-circle" title="Help centre" onPress={() => navigation.navigate('Help')} />
        <RowItem icon="message-square" title="Contact us" onPress={() => navigation.navigate('ContactUs')} />
      </View>
      <Divider />
      <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: colors.gray }}>Prototype tools</Text>
      <Btn label="See the customer app" kind="outline" onPress={() => switchRole('customer')} />
      <Btn label="Reset demo data" kind="outline" onPress={() => api.resetDemo()} />
      <Btn label="Log out" kind="danger" onPress={logout} />
    </Screen>
  );
}

export function Bank({ navigation }: any) {
  const [name, setName] = useState('');
  const [iban, setIban] = useState('');
  const [saved, setSaved] = useState(false);
  const ok = name.trim().length > 2 && /^SA[0-9A-Z ]{20,28}$/i.test(iban.trim());
  const toast = useToast();
  return (
    <View style={{ flex: 1 }}>
      <Screen title="Bank account" onBack={() => navigation.goBack()} footer={<Btn label="Save bank details" disabled={!ok} onPress={() => { setSaved(true); toast.show('Saved'); }} />}>
        <Text style={{ fontFamily: fonts.regular, fontSize: 14, lineHeight: 21, color: colors.gray }}>Payouts are sent to this account 48 hours after customers confirm sessions.</Text>
        <Field label="Account holder name" value={name} onChangeText={setName} />
        <Field label="IBAN" value={iban} onChangeText={setIban} autoCapitalize="characters" placeholder="SA00 0000 0000 0000 0000 0000" />
        {saved ? <Tag label="Saved" tone="outline" /> : null}
        <Notice icon="lock" text="Prototype: bank details stay on this screen and are not stored." />
      </Screen>
      {toast.node}
    </View>
  );
}

export function Docs({ navigation }: any) {
  const docs = [['Professional licence', 'Verified'], ['National ID or Iqama', 'Verified'], ['Certificates', 'Verified']];
  return (
    <Screen title="Credentials and documents" onBack={() => navigation.goBack()}>
      {docs.map(([d, st]) => (
        <Card key={d} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Text style={{ flex: 1, fontFamily: fonts.medium, fontSize: 14, color: colors.ink }}>{d}</Text>
          <Tag label={st} tone="outline" />
        </Card>
      ))}
      <Notice text="To update a document, contact us and we will review the new file." />
    </Screen>
  );
}
