import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import { colors, fonts } from '../../theme';
import { Btn, Card, Field, Icon, Notice, Screen, Tag, Text, VerifiedBadge, styles, useToast } from '../../components/ui';
import { DocItem, useStore } from '../../store';
import { useI18n } from '../../i18n';
import { addDaysIso, fmtDate, todayIso } from '../../lib';

const EXPIRING_DAYS = 60;

const stateOf = (d: DocItem) => {
  if (d.status === 'missing') return 'missing';
  if (d.status === 'review') return 'review';
  if (d.expires && d.expires < todayIso()) return 'expired';
  if (d.expires && d.expires <= addDaysIso(todayIso(), EXPIRING_DAYS)) return 'expiring';
  return 'verified';
};

export function Docs({ navigation }: any) {
  const { s, api } = useStore();
  const { lang, tf } = useI18n();
  const toast = useToast();
  const needs = s.docs.filter((d) => d.required && ['expired', 'expiring', 'missing'].includes(stateOf(d)));
  return (
    <View style={{ flex: 1 }}>
      <Screen title="Credentials and documents" onBack={() => navigation.goBack()}>
        {needs.length === 0 ? <Notice icon="check-circle" text="All your required documents are verified." /> : <Notice icon="alert-circle" text="Some documents need your attention. Upload new files so customers can keep booking you." />}
        {s.docs.map((d) => {
          const st = stateOf(d);
          return (
            <Card key={d.key} style={{ gap: 10 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Icon name={st === 'missing' ? 'file-plus' : 'file-text'} color={colors.coralDark} />
                <Text style={{ flex: 1, fontFamily: fonts.medium, fontSize: 14, color: colors.ink }}>{d.label}</Text>
                {st === 'verified' ? <VerifiedBadge /> : null}
                {st === 'expiring' ? <Tag label="Expires soon" tone="dark" /> : null}
                {st === 'expired' ? <Tag label="Expired" tone="dark" /> : null}
                {st === 'review' ? <Tag label="In review" tone="gray" /> : null}
                {st === 'missing' ? <Tag label={d.required ? 'Required' : 'Optional'} tone="gray" /> : null}
              </View>
              {d.file ? <Text style={styles.cap}>{d.file}</Text> : null}
              {d.expires ? <Text style={styles.cap}>{tf('Valid until {d}', { d: fmtDate(d.expires, lang) })}</Text> : null}
              {d.pending ? (
                <View style={{ backgroundColor: colors.pale, borderRadius: 12, padding: 10, gap: 2 }}>
                  <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: colors.coralDark }}>New file in review</Text>
                  <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: colors.coralDarkest }}>Your current document stays valid while we check the new one.</Text>
                </View>
              ) : null}
              <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
                <Btn label={st === 'missing' ? 'Upload' : 'Upload a new file'} kind={st === 'expired' || st === 'expiring' || st === 'missing' ? 'smallPrimary' : 'small'} onPress={() => navigation.navigate('DocUpload', { key: d.key })} />
                {st === 'review' || d.pending ? <Btn label="Demo: simulate approval" kind="small" onPress={() => { api.approveDoc(d.key); toast.show('Document approved.'); }} /> : null}
              </View>
            </Card>
          );
        })}
        <Notice icon="info" text="Keep your licence and ID valid. We check every new document before it replaces the old one, and you are notified when it is approved." />
      </Screen>
      {toast.node}
    </View>
  );
}

const parseDate = (v: string) => {
  const m = v.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m) return '';
  const iso = m[3] + '-' + m[2] + '-' + m[1];
  const d = new Date(iso + 'T00:00:00');
  return isNaN(d.getTime()) || d.getMonth() + 1 !== parseInt(m[2], 10) ? '' : iso;
};

export function DocUpload({ navigation, route }: any) {
  const { s, api } = useStore();
  const d = s.docs.find((x) => x.key === route.params.key) as DocItem;
  const needsExpiry = d.key === 'licence' || d.key === 'id';
  const [file, setFile] = useState('');
  const [exp, setExp] = useState('');
  const [tried, setTried] = useState(false);
  const [done, setDone] = useState(false);
  const expIso = parseDate(exp);
  const expError = needsExpiry ? (!expIso ? 'Enter the expiry date as DD/MM/YYYY' : expIso <= todayIso() ? 'This date has already passed' : '') : '';

  const submit = () => {
    setTried(true);
    if (!file || expError) return;
    api.submitDoc(d.key, file, needsExpiry ? expIso : undefined);
    setDone(true);
  };

  if (done) {
    return (
      <Screen title="Document sent" footer={<Btn label="Back to documents" onPress={() => navigation.goBack()} />}>
        <Notice icon="check-circle" text={d.status === 'verified' ? 'We received your new file and are reviewing it. Your current document stays valid until it is approved. We will notify you.' : 'We received your file and are reviewing it. We will notify you when it is approved.'} />
      </Screen>
    );
  }
  return (
    <Screen title={d.label} onBack={() => navigation.goBack()} footer={<Btn label="Send for review" onPress={submit} />}>
      <Text style={styles.p}>Upload a clear photo or PDF. Make sure the name, number and dates are readable.</Text>
      <View style={{ gap: 10 }}>
        <Pressable onPress={() => setFile('photo_' + d.key + '.jpg')} style={[styles.card, { flexDirection: 'row', alignItems: 'center', gap: 12 }]}>
          <Icon name="camera" color={colors.coralDark} />
          <Text style={{ flex: 1, fontFamily: fonts.medium, fontSize: 14, color: colors.ink }}>Take a photo</Text>
        </Pressable>
        <Pressable onPress={() => setFile(d.key + '_document.pdf')} style={[styles.card, { flexDirection: 'row', alignItems: 'center', gap: 12 }]}>
          <Icon name="folder" color={colors.coralDark} />
          <Text style={{ flex: 1, fontFamily: fonts.medium, fontSize: 14, color: colors.ink }}>Choose a PDF or image</Text>
        </Pressable>
      </View>
      {file ? (
        <Card style={{ flexDirection: 'row', alignItems: 'center', gap: 10, borderColor: colors.coral }}>
          <Icon name="check-circle" color={colors.coral} />
          <Text style={{ flex: 1, fontFamily: fonts.medium, fontSize: 14, color: colors.ink }}>{file}</Text>
          <Pressable onPress={() => setFile('')}><Text style={{ fontFamily: fonts.medium, fontSize: 13, color: colors.coralDark }}>Remove</Text></Pressable>
        </Card>
      ) : tried ? <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: colors.coralDark }}>Add a file to continue.</Text> : null}
      {needsExpiry ? <Field label="Expiry date (DD/MM/YYYY)" value={exp} onChangeText={(v) => setExp(v.replace(/[^\d/]/g, '').slice(0, 10))} keyboardType="number-pad" placeholder="DD/MM/YYYY" error={tried ? expError : undefined} /> : null}
      <Notice icon="lock" text="Prototype: no file is actually uploaded or sent." />
    </Screen>
  );
}
