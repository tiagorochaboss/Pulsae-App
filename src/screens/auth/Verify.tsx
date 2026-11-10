import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { colors, fonts } from '../../theme';
import { Btn, Field, Icon, Notice, Screen, Text } from '../../components/ui';
import { useI18n } from '../../i18n';

const DEMO_CODE = '123456';

// Verifies the mobile number, then the email. Codes are simulated: use 123456.
export default function Verify({ mobile, email, onBack, onDone }: { mobile: string; email: string; onBack: () => void; onDone: () => void }) {
  const { tf } = useI18n();
  const [step, setStep] = useState<'mobile' | 'email'>('mobile');
  const [code, setCode] = useState('');
  const [err, setErr] = useState('');
  const [wait, setWait] = useState(30);

  useEffect(() => {
    if (wait <= 0) return;
    const id = setTimeout(() => setWait(wait - 1), 1000);
    return () => clearTimeout(id);
  }, [wait]);

  const target = step === 'mobile' ? mobile : email;
  const submit = () => {
    if (code !== DEMO_CODE) {
      setErr('That code is not right. Try again.');
      return;
    }
    setErr('');
    setCode('');
    if (step === 'mobile') {
      setStep('email');
      setWait(30);
    } else onDone();
  };

  return (
    <Screen title={step === 'mobile' ? 'Verify your mobile' : 'Verify your email'} onBack={onBack} footer={<Btn label={step === 'mobile' ? 'Verify mobile' : 'Verify email'} onPress={submit} disabled={code.length < 6} />}>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <View style={{ flex: 1, height: 4, borderRadius: 2, backgroundColor: colors.coral }} />
        <View style={{ flex: 1, height: 4, borderRadius: 2, backgroundColor: step === 'email' ? colors.coral : colors.line }} />
      </View>
      <Text style={{ fontFamily: fonts.regular, fontSize: 14, lineHeight: 21, color: colors.gray }}>{tf('Enter the 6-digit code we sent to {target}.', { target: target || '' })}</Text>
      <Field label="Verification code" value={code} onChangeText={(v) => setCode(v.replace(/[^0-9]/g, '').slice(0, 6))} keyboardType="number-pad" placeholder="000000" error={err} />
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Icon name="clock" size={16} color={colors.gray} />
        <Text style={{ fontFamily: fonts.regular, fontSize: 13, color: colors.gray }}>{wait > 0 ? tf('You can ask for a new code in {n}s', { n: wait }) : 'You can ask for a new code now'}</Text>
      </View>
      {wait <= 0 ? <Btn label="Send a new code" kind="small" onPress={() => setWait(30)} /> : null}
      <Notice text="Prototype: no message is sent. Use the code 123456." />
    </Screen>
  );
}
