import React, { useState } from 'react';
import { View } from 'react-native';
import { colors, fonts } from '../../theme';
import { Btn, Card, Divider, Field, Notice, RowItem, Screen, Tag, Text, useToast } from '../../components/ui';
import { useStore } from '../../store';
import { useApp } from '../../role';
import { useI18n } from '../../i18n';

export default function ProSettings({ navigation }: any) {
  const { api } = useStore();
  const { switchRole, logout } = useApp();
  const { lang } = useI18n();
  return (
    <Screen title="Settings">
      <View>
        <RowItem icon="user" title="Personal details" sub="Name, mobile, email, password" onPress={() => navigation.navigate('PersonalDetails')} />
        <RowItem icon="lock" title="Login and security" sub="Remember me, Face ID, password" onPress={() => navigation.navigate('Security')} />
        <RowItem icon="bell" title="Notification settings" onPress={() => navigation.navigate('NotifSettings')} />
        <RowItem icon="globe" title="Language" sub={lang === 'en' ? 'English' : 'العربية'} onPress={() => navigation.navigate('Language')} />
        <RowItem icon="shield" title="Legal and Professional Terms" onPress={() => navigation.navigate('Legal')} />
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
