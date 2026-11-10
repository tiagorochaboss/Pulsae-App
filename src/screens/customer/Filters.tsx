import React, { useState } from 'react';
import { View } from 'react-native';
import { Btn, Chip, Screen, Section, Stepper, Text } from '../../components/ui';
import { DEFAULT_FILTERS, useStore } from '../../store';
import { colors, fonts } from '../../theme';
import { useI18n } from '../../i18n';
import { money } from '../../lib';

const toggle = (arr: string[], v: string) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

export default function Filters({ navigation }: any) {
  const { s, api } = useStore();
  const [f, setF] = useState(s.filters);
  const { tf } = useI18n();
  const wrap = { flexDirection: 'row' as const, flexWrap: 'wrap' as const, gap: 8 };
  return (
    <Screen
      title="Filters"
      onBack={() => navigation.goBack()}
      footer={
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Btn label="Reset" kind="outline" style={{ flex: 1 }} onPress={() => setF({ ...DEFAULT_FILTERS, cat: f.cat })} />
          <Btn label="Apply" style={{ flex: 2 }} onPress={() => { api.setFilters(f); navigation.goBack(); }} />
        </View>
      }
    >
      <Section title="Gender of professional">
        <View style={wrap}>
          {['Any', 'Female', 'Male'].map((g) => <Chip key={g} label={g} on={f.gender === g} onPress={() => setF({ ...f, gender: g })} />)}
        </View>
      </Section>
      <Section title="Experience">
        <View style={wrap}>
          {[0, 3, 5, 10].map((y) => <Chip key={y} label={y === 0 ? 'Any' : tf('{n}+ years', { n: y })} on={f.minYears === y} onPress={() => setF({ ...f, minYears: y })} />)}
        </View>
      </Section>
      <Section title="Certification">
        <View style={wrap}>
          {['SCFHS licensed', 'MoS certified'].map((c) => <Chip key={c} label={c} on={f.certs.includes(c)} onPress={() => setF({ ...f, certs: toggle(f.certs, c) })} />)}
        </View>
      </Section>
      <Section title="Languages">
        <View style={wrap}>
          {['Arabic', 'English'].map((c) => <Chip key={c} label={c} on={f.langs.includes(c)} onPress={() => setF({ ...f, langs: toggle(f.langs, c) })} />)}
        </View>
      </Section>
      <Section title="Where the session happens">
        <View style={wrap}>
          {['Home', 'Gym', 'Their place'].map((c) => <Chip key={c} label={c} on={f.locs.includes(c)} onPress={() => setF({ ...f, locs: toggle(f.locs, c) })} />)}
        </View>
      </Section>
      <Section title="Maximum price per session">
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={{ fontFamily: fonts.medium, fontSize: 14, color: colors.ink }}>{money(f.maxPrice)}</Text>
          <Stepper value={f.maxPrice / 50} min={2} max={12} onChange={(v) => setF({ ...f, maxPrice: v * 50 })} />
        </View>
      </Section>
      <Section title="Distance from you">
        <View style={wrap}>
          {[5, 10, 20, 30].map((d) => <Chip key={d} label={d === 30 ? 'Any' : tf('Within {n} km', { n: d })} on={f.maxDist === d} onPress={() => setF({ ...f, maxDist: d })} />)}
        </View>
      </Section>
    </Screen>
  );
}
