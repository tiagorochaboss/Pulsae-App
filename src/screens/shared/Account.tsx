import React, { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import { colors, fonts } from '../../theme';
import { Btn, Card, Divider, Field, Icon, Notice, PasswordField, Radio, Screen, Tag, Text, Toggle, useToast } from '../../components/ui';
import { PhoneField, countryOf, emailError, flag, fullPhone, phoneError } from '../../components/Phone';
import { MyAvatar } from '../../components/MyAvatar';
import { useStore } from '../../store';
import { useApp } from '../../role';
import { useI18n } from '../../i18n';
import { biometricsAreReal, biometricsAvailable, authenticate, clearLogin, loadLogin, saveLogin } from '../../auth/device';

const DEMO_CODE = '123456';

function InfoRow({ label, value, verified, onChange }: { label: string; value: string; verified?: boolean; onChange?: () => void }) {
  return (
    <View style={{ gap: 6 }}>
      <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: colors.gray }}>{label}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 52, borderRadius: 14, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 14 }}>
        <Text style={{ flex: 1, fontFamily: fonts.regular, fontSize: 14, color: colors.ink }}>{value}</Text>
        {verified ? <Tag label="Verified" tone="outline" /> : null}
        {onChange ? (
          <Pressable onPress={onChange} accessibilityRole="button" hitSlop={8}>
            <Text style={{ fontFamily: fonts.semibold, fontSize: 13, color: colors.coralDark }}>Change</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

export function PersonalDetails({ navigation }: any) {
  const { s, api } = useStore();
  const { role } = useApp();
  const acc = s.account[role];
  const [first, setFirst] = useState(acc.first);
  const [last, setLast] = useState(acc.last);
  const toast = useToast();
  const dirty = first.trim() !== acc.first || last.trim() !== acc.last;
  const c = countryOf(acc.iso);
  return (
    <View style={{ flex: 1 }}>
      <Screen
        title="Personal details"
        onBack={() => navigation.goBack()}
        footer={<Btn label="Save changes" disabled={!dirty || !first.trim() || !last.trim()} onPress={() => { api.updateAccount(role, { first: first.trim(), last: last.trim() }); toast.show('Saved'); }} />}
      >
        <Pressable onPress={() => navigation.navigate('ProfilePhoto')} style={{ alignItems: 'center', gap: 8 }}>
          <MyAvatar role={role} size={88} />
          <Text style={{ fontFamily: fonts.semibold, fontSize: 13, color: colors.coralDark }}>Change photo</Text>
        </Pressable>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1 }}><Field label="First name" value={first} onChangeText={setFirst} /></View>
          <View style={{ flex: 1 }}><Field label="Last name" value={last} onChangeText={setLast} /></View>
        </View>
        <InfoRow label="Gender" value={acc.gender} />
        <InfoRow label="Mobile number" value={flag(c.iso) + '  +' + c.dial + ' ' + acc.phone} verified={acc.phoneVerified} onChange={() => navigation.navigate('ChangeContact', { kind: 'phone' })} />
        <InfoRow label="Email" value={acc.email} verified={acc.emailVerified} onChange={() => navigation.navigate('ChangeContact', { kind: 'email' })} />
        <InfoRow label="Password" value="••••••••••" onChange={() => navigation.navigate('ChangePassword')} />
        <Notice icon="info" text="Changing your mobile number or email needs a 6-digit code, so we know it is really you. To change your gender, contact us." />
        <Pressable onPress={() => navigation.navigate('DeleteAccount')} style={{ paddingVertical: 10 }}>
          <Text style={{ textAlign: 'center', fontFamily: fonts.medium, fontSize: 13, color: colors.coralDark }}>Delete my account</Text>
        </Pressable>
      </Screen>
      {toast.node}
    </View>
  );
}

// Change mobile number or email: enter the new one, then confirm it with a code.
export function ChangeContact({ navigation, route }: any) {
  const { s, api } = useStore();
  const { role } = useApp();
  const { tf } = useI18n();
  const kind: 'phone' | 'email' = route.params.kind;
  const acc = s.account[role];
  const [iso, setIso] = useState(acc.iso);
  const [num, setNum] = useState('');
  const [email, setEmail] = useState('');
  const [step, setStep] = useState(1);
  const [code, setCode] = useState('');
  const [err, setErr] = useState('');
  const target = kind === 'phone' ? fullPhone(iso, num) : email.trim();

  const send = () => {
    const bad = kind === 'phone' ? phoneError(iso, num) : emailError(email);
    if (bad) return setErr(bad);
    setErr('');
    setStep(2);
  };
  const verify = () => {
    if (code !== DEMO_CODE) return setErr('That code is not right. Try again.');
    if (kind === 'phone') api.updateAccount(role, { iso, phone: num.replace(/\D/g, '').replace(/^0+/, ''), phoneVerified: true });
    else api.updateAccount(role, { email: email.trim(), emailVerified: true });
    setStep(3);
  };

  if (step === 3) {
    return (
      <Screen title={kind === 'phone' ? 'Mobile number updated' : 'Email updated'} footer={<Btn label="Done" onPress={() => navigation.goBack()} />}>
        <Notice icon="check-circle" text={kind === 'phone' ? 'Your new mobile number is verified and saved.' : 'Your new email is verified and saved.'} />
      </Screen>
    );
  }
  return (
    <Screen title={kind === 'phone' ? 'Change mobile number' : 'Change email'} onBack={() => (step === 1 ? navigation.goBack() : setStep(1))} footer={<Btn label={step === 1 ? 'Send code' : 'Verify and save'} onPress={step === 1 ? send : verify} disabled={step === 2 && code.length < 6} />}>
      {step === 1 ? (
        kind === 'phone' ? (
          <PhoneField label="New mobile number" iso={iso} number={num} onChange={(i, n) => { setIso(i); setNum(n); }} error={err} />
        ) : (
          <Field label="New email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" error={err} />
        )
      ) : (
        <>
          <Text style={{ fontFamily: fonts.regular, fontSize: 14, lineHeight: 21, color: colors.gray }}>{tf('Enter the 6-digit code we sent to {target}.', { target })}</Text>
          <Field label="Verification code" value={code} onChangeText={(v) => setCode(v.replace(/\D/g, '').slice(0, 6))} keyboardType="number-pad" error={err} placeholder="000000" />
          <Notice text="Prototype: no message is sent. Use the code 123456." />
        </>
      )}
    </Screen>
  );
}

const pwIssues = (p: string) => {
  const out: string[] = [];
  if (p.length < 8) out.push('At least 8 characters');
  if (!/[0-9]/.test(p)) out.push('At least one number');
  if (!/[A-Za-z]/.test(p)) out.push('At least one letter');
  return out;
};

export function ChangePassword({ navigation }: any) {
  const [cur, setCur] = useState('');
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [tried, setTried] = useState(false);
  const [done, setDone] = useState(false);
  const issues = pwIssues(pw);
  const err = { cur: !cur ? 'Enter your current password' : '', pw: issues.length ? issues.join('. ') : pw === cur ? 'Choose a password you have not used here' : '', pw2: pw2 !== pw ? 'Passwords do not match' : '' };
  const save = async () => {
    setTried(true);
    if (err.cur || err.pw || err.pw2) return;
    // Keep a remembered login in step with the new password.
    const sv = await loadLogin();
    if (sv) await saveLogin(sv.id, pw, sv.faceId);
    setDone(true);
  };
  if (done) {
    return (
      <Screen title="Password updated" footer={<Btn label="Done" onPress={() => navigation.goBack()} />}>
        <Notice icon="check-circle" text="Your password has been changed. Use it the next time you log in." />
      </Screen>
    );
  }
  return (
    <Screen title="Change password" onBack={() => navigation.goBack()} footer={<Btn label="Update password" onPress={save} />}>
      <PasswordField label="Current password" value={cur} onChangeText={setCur} error={tried ? err.cur : undefined} />
      <PasswordField label="New password" value={pw} onChangeText={setPw} error={tried ? err.pw : undefined} />
      <PasswordField label="Confirm new password" value={pw2} onChangeText={setPw2} error={tried ? err.pw2 : undefined} />
      <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: colors.gray }}>Use at least 8 characters with letters and numbers.</Text>
    </Screen>
  );
}

// Remember me and Face ID.
export function Security({ navigation }: any) {
  const [remember, setRemember] = useState(false);
  const [face, setFace] = useState(false);
  const [bio, setBio] = useState(true);
  const [hasSaved, setHasSaved] = useState(false);
  const toast = useToast();
  useEffect(() => {
    biometricsAvailable().then(setBio);
    loadLogin().then((sv) => {
      setHasSaved(!!sv);
      setRemember(!!sv);
      setFace(!!sv && sv.faceId);
    });
  }, []);
  const setRem = async (v: boolean) => {
    if (!v) {
      await clearLogin();
      setRemember(false);
      setFace(false);
      setHasSaved(false);
      toast.show('Saved login removed from this phone.');
    } else toast.show('Tick "Remember me" on the log-in screen next time you log in.');
  };
  const setFaceId = async (v: boolean) => {
    if (!v) {
      const sv = await loadLogin();
      if (sv) await saveLogin(sv.id, sv.password, false);
      setFace(false);
      return;
    }
    const sv = await loadLogin();
    if (!sv) return toast.show('First log in with "Remember me" ticked.');
    if (await authenticate('Turn on Face ID for Pulsae')) {
      await saveLogin(sv.id, sv.password, true);
      setFace(true);
      toast.show('Face ID is on.');
    }
  };
  return (
    <View style={{ flex: 1 }}>
      <Screen title="Login and security" onBack={() => navigation.goBack()}>
        <Card style={{ gap: 14 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: fonts.medium, fontSize: 14, color: colors.ink }}>Remember me on this phone</Text>
              <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: colors.gray }}>Your log-in details are kept safely on this phone only.</Text>
            </View>
            <Toggle on={remember && hasSaved} onChange={setRem} />
          </View>
          <Divider />
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: fonts.medium, fontSize: 14, color: colors.ink }}>Log in with Face ID</Text>
              <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: colors.gray }}>{bio ? 'Skip typing your password.' : 'Face ID is not set up on this phone.'}</Text>
            </View>
            <Toggle on={face} onChange={setFaceId} />
          </View>
        </Card>
        {!biometricsAreReal() ? <Notice icon="info" text="Face ID is simulated while the app runs inside Expo Go. In the installed app it uses the real Face ID of the phone." /> : null}
        <Pressable onPress={() => navigation.navigate('ChangePassword')} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 52 }}>
          <Icon name="lock" size={20} color={colors.coralDark} />
          <Text style={{ flex: 1, fontFamily: fonts.medium, fontSize: 14, color: colors.ink }}>Change password</Text>
          <Icon name="chevron-right" size={18} color={colors.gray} />
        </Pressable>
      </Screen>
      {toast.node}
    </View>
  );
}

export function LanguageScreen({ navigation }: any) {
  const { lang, setLang } = useI18n();
  return (
    <Screen title="Language" onBack={() => navigation.goBack()}>
      <Radio on={lang === 'en'} onPress={() => setLang('en')} label="English" />
      <Radio on={lang === 'ar'} onPress={() => setLang('ar')} label="العربية" sub="Arabic" />
      <Notice text="Some newer screens may still appear in English while the Arabic translation is being completed." />
    </Screen>
  );
}

type NRow = { key: string; title: string; sub: string; locked?: boolean };
const NOTIF_CUSTOMER: NRow[] = [
  { key: 'bookings', title: 'Bookings and reminders', sub: 'Confirmations, changes, cancellations and payments', locked: true },
  { key: 'messages', title: 'Messages', sub: 'New messages from your professional' },
  { key: 'offers', title: 'Offers', sub: 'Promotions and new prepaid offers' },
  { key: 'community', title: 'Community', sub: 'Events and posts' },
];
const NOTIF_PRO: NRow[] = [
  { key: 'bookings', title: 'Bookings', sub: 'New bookings, changes and cancellations', locked: true },
  { key: 'payouts', title: 'Payouts and earnings', sub: 'Session confirmations and payout dates', locked: true },
  { key: 'messages', title: 'Messages', sub: 'New messages from customers' },
  { key: 'reviews', title: 'Reviews', sub: 'When a customer reviews you' },
  { key: 'community', title: 'Community', sub: 'Your post approvals and events' },
  { key: 'news', title: 'News from Pulsae', sub: 'New features and offers for professionals' },
];

export function NotifSettings({ navigation }: any) {
  const { s, api } = useStore();
  const { role } = useApp();
  const rows = role === 'pro' ? NOTIF_PRO : NOTIF_CUSTOMER;
  const prefs = s.notifPrefs[role];
  const line = (r: { key: string; title: string; sub: string; locked?: boolean }) => (
    <View key={r.key} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 56 }}>
      <View style={{ flex: 1 }}>
        <Text style={{ fontFamily: fonts.medium, fontSize: 14, color: colors.ink }}>{r.title}</Text>
        <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: colors.gray }}>{r.sub}</Text>
      </View>
      {r.locked ? <Tag label="Always on" tone="gray" /> : <Toggle on={prefs[r.key] !== false} onChange={(x) => api.setNotifPref(role, r.key, x)} />}
    </View>
  );
  return (
    <Screen title="Notification settings" onBack={() => navigation.goBack()}>
      <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: colors.gray }}>What to tell me about</Text>
      {rows.map(line)}
      <Divider />
      <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: colors.gray }}>How to reach me</Text>
      {line({ key: 'push', title: 'Push notifications', sub: 'On this phone' })}
      {line({ key: 'email', title: 'Email', sub: s.account[role].email })}
      <Notice icon="info" text="Notifications about your bookings and payments can't be switched off, so you never miss something important. Everything also stays in the bell inside the app." />
    </Screen>
  );
}
