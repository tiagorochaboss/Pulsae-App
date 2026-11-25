import React, { useState } from 'react';
import { View } from 'react-native';
import { colors, fonts } from '../../theme';
import { Btn, Card, Field, Notice, PasswordField, Screen, Text, styles } from '../../components/ui';
import { ME_PRO_ID } from '../../data';
import { useStore } from '../../store';
import { useApp } from '../../role';
import { useI18n } from '../../i18n';
import { clearLogin } from '../../auth/device';
import { earningsFor } from '../pro/Earnings';
import { money } from '../../lib';

export default function DeleteAccount({ navigation }: any) {
  const { s, api } = useStore();
  const { role, logout } = useApp();
  const { tf } = useI18n();
  const [pw, setPw] = useState('');
  const [word, setWord] = useState('');
  const [tried, setTried] = useState(false);

  const open = s.bookings.filter((b) => (role === 'pro' ? b.proId === ME_PRO_ID : true) && (b.status === 'confirmed' || b.status === 'awaiting')).length;
  const e = earningsFor(s);
  const owed = role === 'pro' ? e.waiting + e.scheduled : 0;
  const packsLeft = role === 'customer' ? s.packs.reduce((a, p) => a + (p.total - p.used), 0) : 0;
  const weekly = role === 'customer' ? s.series.filter((x) => x.status === 'active').length : 0;
  const blocked = open > 0 || owed > 0;
  const ok = pw.length >= 6 && word.trim().toUpperCase() === 'DELETE';

  const go = async () => {
    setTried(true);
    if (!ok || blocked) return;
    await clearLogin();
    api.resetDemo();
    logout();
  };

  return (
    <Screen title="Delete my account" onBack={() => navigation.goBack()} footer={<Btn label="Delete my account permanently" kind="danger" disabled={blocked} onPress={go} />}>
      <Text style={styles.p}>This permanently deletes your Pulsae account. You can't undo it.</Text>
      <Card style={{ gap: 6 }}>
        <Text style={{ fontFamily: fonts.medium, fontSize: 14, color: colors.ink }}>What happens</Text>
        <Text style={styles.p}>{role === 'pro' ? '• Your profile is removed from Discover.\n• Your personal details, documents, posts and messages are deleted.\n• Reviews and records we must keep for legal and payment reasons are kept, without your personal details where the law allows.' : '• Your personal details, saved addresses, cards and messages are deleted.\n• Records we must keep for legal and payment reasons are kept as the law requires.'}</Text>
      </Card>
      {open > 0 ? <Notice icon="alert-circle" text={tf('You have {n} upcoming sessions. Please complete or cancel them before you delete your account.', { n: open })} /> : null}
      {owed > 0 ? <Notice icon="alert-circle" text={tf('You still have {a} on the way to you. Wait for the payouts to finish before deleting your account.', { a: money(owed) })} /> : null}
      {packsLeft > 0 ? <Notice icon="gift" text={tf('You have {n} prepaid sessions left. They are lost if you delete your account. Contact us first if you want to talk about them.', { n: packsLeft })} /> : null}
      {weekly > 0 ? <Notice icon="repeat" text="Your weekly repeats will stop." /> : null}
      {!blocked ? (
        <View style={{ gap: 14 }}>
          <PasswordField label="Your password" value={pw} onChangeText={setPw} error={tried && pw.length < 6 ? 'Enter your password' : undefined} />
          <Field label="Type DELETE to confirm" value={word} onChangeText={setWord} autoCapitalize="characters" error={tried && word.trim().toUpperCase() !== 'DELETE' ? 'Type DELETE' : undefined} />
        </View>
      ) : null}
      <Text style={styles.cap}>You can also ask us to export or correct your data. Contact us from the Help centre.</Text>
    </Screen>
  );
}
