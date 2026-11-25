import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import { colors, fonts } from '../../theme';
import { Avatar, Btn, Card, Chip, Icon, Line, Screen, Tag, Text, VerifiedBadge, styles, Notice } from '../../components/ui';
import { PROS, PRO_MEDIA, REVIEWS, ME_PRO_ID } from '../../data';
import { MediaStrip } from '../../components/Gallery';
import { pricedPros, useStore } from '../../store';
import { useApp } from '../../role';
import { useI18n } from '../../i18n';
import { money, PACK_DISCOUNT } from '../../lib';

export default function ProDetail({ navigation, route }: any) {
  const { s, api } = useStore();
  const { role } = useApp();
  const { tf, t } = useI18n();
  const pro = pricedPros(s).find((p) => p.id === route.params.id) || PROS[0];
  const [tab, setTab] = useState<'About' | 'Certifications' | 'Reviews'>('About');
  const fav = s.favorites.includes(pro.id);
  const weekly = pro.id === 'p1' ? s.proProfile.weekly : true;
  const own = s.reviews.filter((r) => r.proId === pro.id);
  const list = own.length ? own : REVIEWS.map((r) => ({ ...r, proId: pro.id, tags: [] as string[] }));
  const avg = list.reduce((a, r) => a + r.rating, 0) / list.length;
  const media = pro.id === ME_PRO_ID ? s.media : PRO_MEDIA[pro.id] || [];

  return (
    <Screen
      title=""
      onBack={() => navigation.goBack()}
      right={
        <Pressable accessibilityLabel="Save" onPress={() => api.toggleFavorite(pro.id)} style={styles.iconBtn}>
          <Icon name="heart" color={fav ? colors.coral : colors.ink} />
        </Pressable>
      }
      footer={role === 'customer' ? <Btn label="Book a session" onPress={() => navigation.navigate('ChooseTime', { id: pro.id })} /> : undefined}
    >
      <View style={{ alignItems: 'center', gap: 6 }}>
        <Avatar size={88} />
        <Text style={{ fontFamily: fonts.semibold, fontSize: 20, color: colors.ink }}>{pro.name}</Text>
        <Text style={styles.cap}>{pro.role}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Icon name="star" size={14} color={colors.coral} />
          <Text style={styles.cap}>{tf('{r} ({n} reviews) · {a}', { r: pro.rating, n: pro.reviews, a: t(pro.area) })}</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 6 }}>
          <VerifiedBadge cert={pro.cert} />
          <Tag label={pro.cert} />
          <Tag label={tf('{n} years', { n: pro.years })} tone="gray" />
          <Tag label={pro.gender} tone="gray" />
        </View>
      </View>
      {media.length ? <MediaStrip items={media} /> : null}
      <View style={{ flexDirection: 'row', gap: 8, justifyContent: 'center' }}>
        {(['About', 'Certifications', 'Reviews'] as const).map((x) => <Chip key={x} label={x} on={tab === x} onPress={() => setTab(x)} />)}
      </View>

      {tab === 'About' ? (
        <>
          <Text style={styles.p}>{pro.about}</Text>
          <Card style={{ gap: 10 }}>
            <Line label="Price per session" value={money(pro.price)} bold />
            <Line label="Languages" value={pro.languages.map(t).join('، ')} />
            <Line label="Session location" value={pro.locations.map(t).join('، ')} />
            <Line label="Area" value={pro.area} />
          </Card>
          <Card style={{ gap: 8 }}>
            <Text style={styles.h2}>Prepaid sessions and weekly repeat</Text>
            <Line label="4 prepaid sessions" value={tf('{p}% off', { p: PACK_DISCOUNT[4] })} accent />
            <Line label="8 prepaid sessions" value={tf('{p}% off', { p: PACK_DISCOUNT[8] })} accent />
            <Line label="Weekly repeat" value={weekly ? 'Available' : 'Not offered'} />
          </Card>
        </>
      ) : null}

      {tab === 'Certifications' ? (
        <View style={{ gap: 10 }}>
          {[pro.cert, 'First aid and CPR', 'Continuing education course'].map((c, i) => (
            <Card key={c} style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
              <Icon name={i === 0 ? 'shield' : 'award'} color={colors.coralDark} />
              <Text style={{ flex: 1, fontFamily: fonts.medium, fontSize: 14, color: colors.ink }}>{c}</Text>
              {i === 0 ? <VerifiedBadge cert={pro.cert} /> : null}
            </Card>
          ))}
        </View>
      ) : null}

      {tab === 'Reviews' ? (
        <View style={{ gap: 10 }}>
          <Card style={{ flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.pale, borderColor: colors.pale }}>
            <Text style={{ fontFamily: fonts.semibold, fontSize: 26, color: colors.coralDarkest }}>{avg.toFixed(1)}</Text>
            <Icon name="star" size={16} color={colors.coral} />
            <Text style={{ flex: 1, fontFamily: fonts.regular, fontSize: 12, color: colors.coralDark }}>{tf('{n} reviews from completed sessions', { n: list.length })}</Text>
          </Card>
          {list.map((r) => (
            <Card key={r.id} style={{ gap: 6 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={{ flex: 1, fontFamily: fonts.medium, fontSize: 14, color: colors.ink }}>{r.who}</Text>
                <Icon name="star" size={13} color={colors.coral} />
                <Text style={styles.cap}>{String(r.rating)}</Text>
              </View>
              <Text style={styles.p}>{r.text}</Text>
              {(pro.id === ME_PRO_ID ? s.replies[r.id] : r.id === 'r1' ? s.replies.r1 : '') ? (
                <View style={{ backgroundColor: colors.pale, borderRadius: 12, padding: 10 }}>
                  <Text style={{ fontFamily: fonts.medium, fontSize: 11, color: colors.coralDark }}>Reply from the professional</Text>
                  <Text style={{ fontFamily: fonts.regular, fontSize: 12.5, color: colors.coralDarkest }}>{(pro.id === ME_PRO_ID ? s.replies[r.id] : s.replies.r1) || ''}</Text>
                </View>
              ) : null}
            </Card>
          ))}
          <Notice text="Only customers who completed a booking can leave a review." />
        </View>
      ) : null}
    </Screen>
  );
}
