import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fonts } from '../../theme';
import { Btn, Chip, Field, Text, Notice } from '../../components/ui';
import { Logo } from '../../components/Logo';
import { useI18n } from '../../i18n';
import { Role } from '../../store';

export default function Login({ onLogin, onSignup, onForgot }: { onLogin: (r: Role) => void; onSignup: (r: Role) => void; onForgot: () => void }) {
  const { lang, setLang } = useI18n();
  const [role, setRole] = useState<Role>('customer');
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');

  const submit = () => {
    if (!id.trim() || !pw) {
      setErr('Enter your mobile number or email and your password.');
      return;
    }
    if (pw.length < 6) {
      setErr('Password is too short.');
      return;
    }
    setErr('');
    onLogin(role);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={{ padding: 24, gap: 18 }} keyboardShouldPersistTaps="handled">
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
            <Pressable onPress={() => setLang(lang === 'en' ? 'ar' : 'en')} accessibilityRole="button">
              <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: colors.coralDark }}>{lang === 'en' ? 'العربية' : 'English'}</Text>
            </Pressable>
          </View>
          <View style={{ alignItems: 'center', paddingTop: 12, paddingBottom: 8 }}>
            <Logo size={44} center />
            <Text style={{ fontFamily: fonts.regular, fontSize: 13, color: colors.gray, marginTop: 10 }}>Feel the pulse of a life in motion.</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 8, justifyContent: 'center' }}>
            <Chip label="I am a customer" on={role === 'customer'} onPress={() => setRole('customer')} />
            <Chip label="I am a professional" on={role === 'pro'} onPress={() => setRole('pro')} />
          </View>
          <Text style={{ fontFamily: fonts.semibold, fontSize: 22, color: colors.ink }}>Log in</Text>
          <Field label="Mobile number or email" value={id} onChangeText={setId} autoCapitalize="none" keyboardType="email-address" placeholder="+966 5X XXX XXXX" />
          <Field label="Password" value={pw} onChangeText={setPw} secureTextEntry autoCapitalize="none" placeholder="Your password" />
          {err ? <Text style={{ color: colors.coralDark, fontFamily: fonts.regular, fontSize: 12 }}>{err}</Text> : null}
          <Pressable onPress={onForgot} accessibilityRole="button">
            <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: colors.coralDark }}>Forgot password?</Text>
          </Pressable>
          <Btn label="Log in" onPress={submit} />
          <Btn label={role === 'customer' ? 'Create a customer account' : 'Join as a professional'} kind="outline" onPress={() => onSignup(role)} />
          <Notice text="Prototype: any mobile number or email with a password of 6+ characters will log you in. Nothing is sent or stored outside this device." />
          <View style={{ gap: 8, paddingTop: 4 }}>
            <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: colors.gray, textAlign: 'center' }}>Demo shortcuts</Text>
            <View style={{ flexDirection: 'row', gap: 8, justifyContent: 'center' }}>
              <Btn label="Preview customer" kind="small" onPress={() => onLogin('customer')} />
              <Btn label="Preview professional" kind="small" onPress={() => onLogin('pro')} />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
