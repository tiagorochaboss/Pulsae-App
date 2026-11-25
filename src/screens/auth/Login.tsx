import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fonts } from '../../theme';
import { Btn, Check, Chip, Field, Icon, PasswordField, Segmented, Text, Notice } from '../../components/ui';
import { PhoneField, emailError, phoneError, fullPhone } from '../../components/Phone';
import { authenticate, biometricsAreReal, biometricsAvailable, clearLogin, loadLogin, saveLogin } from '../../auth/device';
import { Logo } from '../../components/Logo';
import { useI18n } from '../../i18n';
import { Role } from '../../store';

export default function Login({ onLogin, onSignup, onForgot }: { onLogin: (r: Role) => void; onSignup: (r: Role) => void; onForgot: () => void }) {
  const { lang, setLang } = useI18n();
  const [role, setRole] = useState<Role>('customer');
  const [mode, setMode] = useState<'mobile' | 'email'>('mobile');
  const [iso, setIso] = useState('SA');
  const [num, setNum] = useState('');
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const [remember, setRemember] = useState(false);
  const [useFace, setUseFace] = useState(false);
  const [faceReady, setFaceReady] = useState(false);
  const [bio, setBio] = useState(true);
  const [tried, setTried] = useState(false);

  // Bring back remembered details and show the Face ID button if it was switched on.
  useEffect(() => {
    biometricsAvailable().then(setBio);
    loadLogin().then((sv) => {
      if (!sv) return;
      try {
        const d = JSON.parse(sv.id);
        setMode(d.mode); setIso(d.iso); setNum(d.num); setEmail(d.email); setPw(sv.password);
        if (d.role) setRole(d.role);
        setRemember(true);
        setUseFace(sv.faceId);
        setFaceReady(sv.faceId);
      } catch (e) {}
    });
  }, []);

  const idError = mode === 'mobile' ? phoneError(iso, num) : emailError(email);
  const pwError = !pw ? 'Enter your password' : pw.length < 6 ? 'Password is too short' : '';

  const submit = async () => {
    setTried(true);
    if (idError || pwError) {
      setErr('');
      return;
    }
    setErr('');
    if (remember) await saveLogin(JSON.stringify({ mode, iso, num, email, role }), pw, useFace);
    else await clearLogin();
    onLogin(role);
  };

  const faceLogin = async () => {
    const ok = await authenticate('Log in to Pulsae');
    if (ok) onLogin(role);
    else setErr('Face ID did not recognise you. Use your password instead.');
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
          {faceReady && bio ? (
            <Pressable onPress={faceLogin} accessibilityRole="button" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, height: 52, borderRadius: 26, backgroundColor: colors.ink }}>
              <Icon name="smile" size={20} color={colors.white} />
              <Text style={{ color: colors.white, fontFamily: fonts.semibold, fontSize: 15 }}>Log in with Face ID</Text>
            </Pressable>
          ) : null}
          <Segmented value={mode} onChange={(k) => setMode(k as any)} options={[{ key: 'mobile', label: 'Mobile number' }, { key: 'email', label: 'Email' }]} />
          {mode === 'mobile' ? (
            <PhoneField iso={iso} number={num} onChange={(i, n) => { setIso(i); setNum(n); }} error={tried ? idError : undefined} />
          ) : (
            <Field label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" textContentType="emailAddress" placeholder="name@example.com" error={tried ? idError : undefined} />
          )}
          <PasswordField label="Password" value={pw} onChangeText={setPw} placeholder="Your password" error={tried ? pwError : undefined} />
          <Check on={remember} onPress={() => { setRemember(!remember); if (remember) setUseFace(false); }} label="Remember me on this phone" />
          {remember ? (
            <Check on={useFace} onPress={async () => { if (!useFace) { const ok = await authenticate('Turn on Face ID for Pulsae'); if (ok) setUseFace(true); } else setUseFace(false); }} label={biometricsAreReal() ? 'Use Face ID to log in next time' : 'Use Face ID to log in next time (works in the installed app, not in Expo Go)'} />
          ) : null}
          {err ? <Text style={{ color: colors.coralDark, fontFamily: fonts.regular, fontSize: 12 }}>{err}</Text> : null}
          <Pressable onPress={onForgot} accessibilityRole="button">
            <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: colors.coralDark }}>Forgot password?</Text>
          </Pressable>
          <Btn label="Log in" onPress={submit} />
          <Btn label={role === 'customer' ? 'Create a customer account' : 'Join as a professional'} kind="outline" onPress={() => onSignup(role)} />
          <Notice text="Prototype: any valid mobile number or email with a password of 6+ characters will log you in. Remembered details stay on this phone only." />
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
