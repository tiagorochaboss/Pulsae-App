import React from 'react';
import { View } from 'react-native';
import { colors, fonts } from '../../theme';
import { Card, Chip, Notice, RowItem, Screen, Section, Stepper, Text } from '../../components/ui';
import { useStore } from '../../store';
import { useI18n } from '../../i18n';

const toggle = (a: string[], v: string) => (a.includes(v) ? a.filter((x) => x !== v) : [...a, v]);

export default function ServiceArea({ navigation }: any) {
  const { s, api } = useStore();
  const p = s.proProfile;
  const { tf } = useI18n();
  return (
    <Screen title="Service area" onBack={() => navigation.goBack()}>
      <Section title="Where do you work?">
        <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
          {[['Home', 'Customer\'s home'], ['Their place', 'My place'], ['Gym', 'A gym']].map(([k, l]) => (
            <Chip key={k} label={l} on={p.offers.includes(k)} onPress={() => api.setProProfile({ offers: toggle(p.offers, k) })} />
          ))}
        </View>
      </Section>
      {p.offers.includes('Home') ? (
        <Card style={{ gap: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: fonts.medium, fontSize: 14, color: colors.ink }}>Travel radius</Text>
              <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: colors.gray }}>{tf('{n} km from your base', { n: p.radius })}</Text>
            </View>
            <Stepper value={p.radius} min={1} max={50} onChange={(v) => api.setProProfile({ radius: v })} />
          </View>
        </Card>
      ) : null}
      <RowItem icon="map-pin" title="Saved places" sub={tf('{n} saved', { n: s.addresses.pro.length })} onPress={() => navigation.navigate('SavedAddresses')} />
      <Notice text="Customers only see professionals whose radius covers their address." icon="info" />
    </Screen>
  );
}
