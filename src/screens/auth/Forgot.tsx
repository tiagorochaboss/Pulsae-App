import React, { useState } from 'react';
import { colors, fonts } from '../../theme';
import { Btn, Field, Notice, Screen, Text } from '../../components/ui';
import { useI18n } from '../../i18n';

// Forgot password: contact -> code -> new password. Simulated; the code is 123456.
export default function Forgot({ onBack, onDone }: { onBack: () => void; onDone: () => void }) {
  const { tf } = useI18n();
  const [step, setStep] = useState(1);
  const [contact, setContact] = useState('');
  const [code, setCode] = useState('');
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [err, setErr] = useState('');

  const next = () => {
    if (step === 1) {
      if (contact.trim().length < 5) return setErr('Enter your verified mobile number or email.');
      setErr('');
      setStep(2);
    } else if (step === 2) {
      if (code !== '123456') return setErr('That code is not right. Try again.');
      setErr('');
      setStep(3);
    } else {
      if (pw.length < 8) return setErr('Password must be at least 8 characters.');
      if (pw !== pw2) return setErr('Passwords do not match.');
      setErr('');
      setStep(4);
    }
  };

  if (step === 4) {
    return (
      <Screen title="Password updated" footer={<Btn label="Back to log in" onPress={onDone} />}>
        <Text style={{ fontFamily: fonts.regular, fontSize: 14, lineHeight: 21, color: colors.gray }}>Your password has been changed. Log in with your new password.</Text>
      </Screen>
    );
  }
  return (
    <Screen title="Reset your password" onBack={step === 1 ? onBack : () => setStep(step - 1)} footer={<Btn label={step === 1 ? 'Send code' : step === 2 ? 'Verify code' : 'Save new password'} onPress={next} />}>
      {step === 1 ? (
        <>
          <Text style={{ fontFamily: fonts.regular, fontSize: 14, lineHeight: 21, color: colors.gray }}>We will send a code to your verified mobile number or email.</Text>
          <Field label="Mobile number or email" value={contact} onChangeText={setContact} autoCapitalize="none" error={err} />
        </>
      ) : null}
      {step === 2 ? (
        <>
          <Text style={{ fontFamily: fonts.regular, fontSize: 14, lineHeight: 21, color: colors.gray }}>{tf('Enter the 6-digit code sent to {target}.', { target: contact })}</Text>
          <Field label="Verification code" value={code} onChangeText={(v) => setCode(v.replace(/[^0-9]/g, '').slice(0, 6))} keyboardType="number-pad" error={err} />
          <Notice text="Prototype: no message is sent. Use the code 123456." />
        </>
      ) : null}
      {step === 3 ? (
        <>
          <Field label="New password" value={pw} onChangeText={setPw} secureTextEntry autoCapitalize="none" />
          <Field label="Confirm new password" value={pw2} onChangeText={setPw2} secureTextEntry autoCapitalize="none" error={err} />
        </>
      ) : null}
    </Screen>
  );
}
