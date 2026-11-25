import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import { colors, fonts } from '../../theme';
import { Btn, Card, Empty, Field, Icon, Notice, Screen, Tag, Text, styles, useToast } from '../../components/ui';
import { ME_PRO_ID } from '../../data';
import { useStore } from '../../store';
import { useI18n } from '../../i18n';
import { fmtDate } from '../../lib';

export default function ProReviews({ navigation }: any) {
  const { s, api } = useStore();
  const { lang, tf } = useI18n();
  const toast = useToast();
  const [open, setOpen] = useState('');
  const [text, setText] = useState('');
  const list = s.reviews.filter((r) => r.proId === ME_PRO_ID);
  const avg = list.length ? list.reduce((a, r) => a + r.rating, 0) / list.length : 0;
  return (
    <View style={{ flex: 1 }}>
      <Screen title="Reviews" onBack={() => navigation.goBack()}>
        <Card style={{ alignItems: 'center', gap: 4, backgroundColor: colors.pale, borderColor: colors.pale }}>
          <Text style={{ fontFamily: fonts.semibold, fontSize: 30, color: colors.coralDarkest }}>{avg.toFixed(1)}</Text>
          <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: colors.coralDark }}>{tf('{n} reviews', { n: list.length })}</Text>
        </Card>
        {list.length === 0 ? <Empty icon="star" title="No reviews yet" sub="Reviews appear after customers complete a session with you." /> : null}
        {list.map((r) => {
          const reply = s.replies[r.id];
          return (
            <Card key={r.id} style={{ gap: 8 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={{ flex: 1, fontFamily: fonts.medium, fontSize: 14, color: colors.ink }}>{r.who}</Text>
                <Icon name="star" size={13} color={colors.coral} />
                <Text style={styles.cap}>{String(r.rating)}</Text>
              </View>
              <Text style={styles.cap}>{fmtDate(r.date, lang)}</Text>
              {r.tags && r.tags.length ? <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>{r.tags.map((t) => <Tag key={t} label={t} tone="gray" />)}</View> : null}
              {r.text ? <Text style={styles.p}>{r.text}</Text> : null}
              {reply ? (
                <View style={{ backgroundColor: colors.pale, borderRadius: 12, padding: 10, gap: 2 }}>
                  <Text style={{ fontFamily: fonts.medium, fontSize: 11, color: colors.coralDark }}>Your reply</Text>
                  <Text style={{ fontFamily: fonts.regular, fontSize: 12.5, color: colors.coralDarkest }}>{reply}</Text>
                </View>
              ) : null}
              {open === r.id ? (
                <View style={{ gap: 8 }}>
                  <Field label="Your reply (public)" value={text} onChangeText={setText} multiline style={{ height: 90, paddingTop: 12 }} />
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    <Btn label="Post reply" kind="smallPrimary" disabled={!text.trim()} onPress={() => { api.replyToReview(r.id, text.trim()); setOpen(''); setText(''); toast.show('Reply posted.'); }} />
                    <Btn label="Cancel" kind="small" onPress={() => { setOpen(''); setText(''); }} />
                  </View>
                </View>
              ) : (
                <Pressable onPress={() => { setOpen(r.id); setText(reply || ''); }}>
                  <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: colors.coralDark }}>{reply ? 'Edit reply' : 'Reply'}</Text>
                </Pressable>
              )}
            </Card>
          );
        })}
        <Notice text="Reviews come only from customers who completed a session. They cannot be removed by professionals. To report an unfair review, contact us." />
      </Screen>
      {toast.node}
    </View>
  );
}
