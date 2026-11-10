import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import { colors, fonts } from '../../theme';
import { Avatar, Btn, Card, Chip, Icon, Line, Screen, Tag, Text, styles, Notice } from '../../components/ui';
import { PROS } from '../../data';
import { useStore } from '../../store';
import { useApp } from '../../role';
import { useI18n } from '../../i18n';
import { money, PACK_DISCOUNT } from '../../lib';

const REVIEWS = [
  { who: 'Customer A', rating: 5, text: 'Very professional and on time. My back feels much better after three sessions.', reply: 'Thank you, it was a pleasure working with you.' },
  { who: 'Customer B', rating: 5, text: 'Clear plan and great communication.', reply: '' },
  { who: 'Customer C', rating: 4, text: 'Good session, would book again.', reply: '' },
];

export default function ProDetail({ navigation, route }: any) {
  const { s, api } = useStore();
  const { role } = useApp();
  const { tf, t } = useI18n();
  const pro = PROS.find((p) => p.id === route.params.id) || PROS[0];
  const [tab, setTab] = useState<'About' | 'Certifications' | 'Reviews'>('About');
  const fav = s.favorites.includes(pro.id);
  const weekly = pro.id === 'p1' ? s.proProfile.weekly : true;

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
          <Tag label={pro.cert} />
          <Tag label={tf('{n} years', { n: pro.years })} tone="gray" />
          <Tag label={pro.gender} tone="gray" />
        </View>
      </View>
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
            <Text style={styles.h2}>Packs and weekly repeat</Text>
            <Line label="4 sessions" value={tf('{p}% off', { p: PACK_DISCOUNT[4] })} accent />
            <Line label="8 sessions" value={tf('{p}% off', { p: PACK_DISCOUNT[8] })} accent />
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
              {i === 0 ? <Tag label="Verified" tone="outline" /> : null}
            </Card>
          ))}
        </View>
      ) : null}

      {tab === 'Reviews' ? (
        <View style={{ gap: 10 }}>
          {REVIEWS.map((r, i) => (
            <Card key={i} style={{ gap: 6 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={{ flex: 1, fontFamily: fonts.medium, fontSize: 14, color: colors.ink }}>{r.who}</Text>
                <Icon name="star" size={13} color={colors.coral} />
                <Text style={styles.cap}>{String(r.rating)}</Text>
              </View>
              <Text style={styles.p}>{r.text}</Text>
              {r.reply ? (
                <View style={{ backgroundColor: colors.pale, borderRadius: 12, padding: 10 }}>
                  <Text style={{ fontFamily: fonts.medium, fontSize: 11, color: colors.coralDark }}>Reply from the professional</Text>
                  <Text style={{ fontFamily: fonts.regular, fontSize: 12.5, color: colors.coralDarkest }}>{r.reply}</Text>
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
