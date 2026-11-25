import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import { colors, fonts } from '../../theme';
import { Btn, Card, Chip, Field, Icon, Notice, Screen, Tag, Text } from '../../components/ui';
import { useStore } from '../../store';
import { useI18n } from '../../i18n';

export function PaymentMethods({ navigation }: any) {
  const { s, api } = useStore();
  const { tf, t } = useI18n();
  return (
    <Screen title="Payment methods" onBack={() => navigation.goBack()} footer={<Btn label="Add a credit or debit card" onPress={() => navigation.navigate('AddCard')} />}>
      <Card style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <Icon name="smartphone" color={colors.coralDark} />
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: fonts.medium, fontSize: 14, color: colors.ink }}>Apple Pay</Text>
          <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: colors.gray }}>Available at checkout</Text>
        </View>
      </Card>
      {s.cards.map((c) => (
        <Card key={c.id} style={{ gap: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Icon name="credit-card" color={colors.coralDark} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: fonts.medium, fontSize: 14, color: colors.ink }}>{c.brand + ' ' + tf('ending {n}', { n: c.last4 })}</Text>
              <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: colors.gray }}>{(c.type === 'credit' ? t('Credit card') : t('Debit card')) + ' · ' + tf('Expires {d}', { d: c.exp })}</Text>
            </View>
            {c.isDefault ? <Tag label="Default" /> : null}
          </View>
          <View style={{ flexDirection: 'row', gap: 16 }}>
            {!c.isDefault ? (
              <Pressable onPress={() => api.setDefaultCard(c.id)}>
                <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: colors.coralDark }}>Make default</Text>
              </Pressable>
            ) : null}
            <Pressable onPress={() => api.removeCard(c.id)}>
              <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: colors.gray }}>Remove</Text>
            </Pressable>
          </View>
        </Card>
      ))}
      {s.cards.length === 0 ? <Notice icon="credit-card" text="No saved cards yet. Add one to pay faster and to use weekly repeat." /> : null}
      <Notice icon="lock" text="Prototype: card details are not stored or sent anywhere. In the real app a secure payment provider handles your card, and Pulsae only keeps the last 4 digits." />
    </Screen>
  );
}

const luhn = (n: string) => {
  let sum = 0;
  let alt = false;
  for (let i = n.length - 1; i >= 0; i--) {
    let d = parseInt(n[i], 10);
    if (alt) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    alt = !alt;
  }
  return sum % 10 === 0;
};
const brandOf = (n: string) => (/^3[47]/.test(n) ? 'Amex' : /^4/.test(n) ? 'Visa' : /^(5[1-5]|2[2-7])/.test(n) ? 'Mastercard' : 'Card');

export function AddCard({ navigation }: any) {
  const { s, api } = useStore();
  const [kind, setKind] = useState<'credit' | 'debit' | 'mada'>('credit');
  const [num, setNum] = useState('');
  const [name, setName] = useState('');
  const [exp, setExp] = useState('');
  const [cvc, setCvc] = useState('');
  const [tried, setTried] = useState(false);

  const digits = num.replace(/\D/g, '');
  const mm = parseInt(exp.slice(0, 2), 10);
  const yy = parseInt(exp.slice(3, 5), 10);
  const now = new Date();
  const expOk = exp.length === 5 && mm >= 1 && mm <= 12 && (2000 + yy > now.getFullYear() || (2000 + yy === now.getFullYear() && mm >= now.getMonth() + 1));
  const errors = {
    num: digits.length < 13 || digits.length > 19 || !luhn(digits) ? 'Check the card number' : '',
    name: name.trim().length < 3 ? 'Enter the name on the card' : '',
    exp: expOk ? '' : 'Enter a valid expiry date (MM/YY)',
    cvc: cvc.length < 3 ? 'Enter the security code' : '',
  };
  const ok = !errors.num && !errors.name && !errors.exp && !errors.cvc;
  const e = (k: keyof typeof errors) => (tried ? errors[k] : undefined);

  const save = () => {
    setTried(true);
    if (!ok) return;
    api.addCard({ type: kind === 'credit' ? 'credit' : 'debit', brand: kind === 'mada' ? 'mada' : brandOf(digits), last4: digits.slice(-4), holder: name.trim(), exp });
    navigation.goBack();
  };

  return (
    <Screen title="Add a card" onBack={() => navigation.goBack()} footer={<Btn label="Save card" onPress={save} />}>
      <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
        <Chip label="Credit card" on={kind === 'credit'} onPress={() => setKind('credit')} />
        <Chip label="Debit card" on={kind === 'debit'} onPress={() => setKind('debit')} />
        <Chip label="mada debit card" on={kind === 'mada'} onPress={() => setKind('mada')} />
      </View>
      <Field label="Card number" value={num} onChangeText={(v) => setNum(v.replace(/\D/g, '').slice(0, 19).replace(/(.{4})/g, '$1 ').trim())} keyboardType="number-pad" placeholder="1234 5678 9012 3456" error={e('num')} />
      <Field label="Name on card" value={name} onChangeText={setName} autoCapitalize="characters" error={e('name')} />
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <View style={{ flex: 1 }}>
          <Field label="Expiry (MM/YY)" value={exp} onChangeText={(v) => { const d = v.replace(/\D/g, '').slice(0, 4); setExp(d.length > 2 ? d.slice(0, 2) + '/' + d.slice(2) : d); }} keyboardType="number-pad" placeholder="MM/YY" error={e('exp')} />
        </View>
        <View style={{ flex: 1 }}>
          <Field label="Security code" value={cvc} onChangeText={(v) => setCvc(v.replace(/\D/g, '').slice(0, 4))} keyboardType="number-pad" secureTextEntry placeholder="CVC" error={e('cvc')} />
        </View>
      </View>
      <Notice icon="lock" text="Prototype: try 4242 4242 4242 4242. Nothing is stored or sent. In the real app a secure payment provider handles your card." />
      {s.cards.length === 0 ? <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: colors.gray }}>This will be your default card.</Text> : null}
    </Screen>
  );
}
