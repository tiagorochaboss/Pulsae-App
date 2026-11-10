import React, { useState } from 'react';
import { View } from 'react-native';
import { colors, fonts } from '../../theme';
import { Btn, Check, Chip, Field, Screen, Text } from '../../components/ui';
import { Role } from '../../store';

export type SignupData = { first: string; last: string; gender: string; mobile: string; email: string; profession: string };

export default function Signup({ role, onBack, onContinue }: { role: Role; onBack: () => void; onContinue: (d: SignupData) => void }) {
  const [first, setFirst] = useState('');
  const [last, setLast] = useState('');
  const [gender, setGender] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [profession, setProfession] = useState('Physiotherapist');
  const [agree, setAgree] = useState(false);
  const [tried, setTried] = useState(false);

  const errors: Record<string, string> = {};
  if (!first.trim()) errors.first = 'Required';
  if (!last.trim()) errors.last = 'Required';
  if (!gender) errors.gender = 'Please choose one';
  if (!/^\+?[0-9 ]{9,15}$/.test(mobile.trim())) errors.mobile = 'Enter a valid mobile number';
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) errors.email = 'Enter a valid email';
  if (pw.length < 8) errors.pw = 'At least 8 characters';
  if (pw2 !== pw) errors.pw2 = 'Passwords do not match';
  if (!agree) errors.agree = 'Please accept to continue';
  const ok = Object.keys(errors).length === 0;

  const go = () => {
    setTried(true);
    if (ok) onContinue({ first, last, gender, mobile, email, profession });
  };
  const e = (k: string) => (tried ? errors[k] : undefined);

  return (
    <Screen title={role === 'customer' ? 'Create your account' : 'Join as a professional'} onBack={onBack} footer={<Btn label="Continue" onPress={go} />}>
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <View style={{ flex: 1 }}><Field label="First name" value={first} onChangeText={setFirst} error={e('first')} /></View>
        <View style={{ flex: 1 }}><Field label="Last name" value={last} onChangeText={setLast} error={e('last')} /></View>
      </View>
      <View style={{ gap: 6 }}>
        <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: colors.gray }}>Gender</Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Chip label="Female" on={gender === 'Female'} onPress={() => setGender('Female')} />
          <Chip label="Male" on={gender === 'Male'} onPress={() => setGender('Male')} />
        </View>
        {e('gender') ? <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: colors.coralDark }}>{errors.gender}</Text> : null}
      </View>
      {role === 'pro' ? (
        <View style={{ gap: 6 }}>
          <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: colors.gray }}>I am a</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Chip label="Physiotherapist" on={profession === 'Physiotherapist'} onPress={() => setProfession('Physiotherapist')} />
            <Chip label="Personal trainer" on={profession === 'Personal trainer'} onPress={() => setProfession('Personal trainer')} />
          </View>
        </View>
      ) : null}
      <Field label="Mobile number" value={mobile} onChangeText={setMobile} keyboardType="phone-pad" placeholder="+966 5X XXX XXXX" error={e('mobile')} />
      <Field label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" error={e('email')} />
      <Field label="Create a password" value={pw} onChangeText={setPw} secureTextEntry autoCapitalize="none" error={e('pw')} />
      <Field label="Confirm password" value={pw2} onChangeText={setPw2} secureTextEntry autoCapitalize="none" error={e('pw2')} />
      <Check on={agree} onPress={() => setAgree(!agree)} label="I agree to the Terms of Use and the Privacy Policy. I understand Pulsae will verify my mobile number and email." />
      {e('agree') ? <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: colors.coralDark }}>{errors.agree}</Text> : null}
    </Screen>
  );
}
