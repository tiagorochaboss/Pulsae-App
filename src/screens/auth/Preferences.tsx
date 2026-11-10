import React, { useState } from 'react';
import { View } from 'react-native';
import { colors, fonts } from '../../theme';
import { Btn, Check, Chip, Screen, Section, Text, Tag } from '../../components/ui';

const GOALS = ['Recover from an injury', 'Build strength', 'Lose weight', 'Move more', 'Reduce pain', 'Prepare for an event'];
const SERVICES: { label: string; soon?: boolean }[] = [
  { label: 'Physiotherapy' },
  { label: 'Personal training' },
  { label: 'Nutrition', soon: true },
  { label: 'Yoga and Pilates', soon: true },
  { label: 'Mental health', soon: true },
];
const TIMES = ['Morning', 'Afternoon', 'Evening', 'Flexible'];

export default function Preferences({ onDone }: { onDone: () => void }) {
  const [goals, setGoals] = useState<string[]>([]);
  const [services, setServices] = useState<string[]>([]);
  const [gender, setGender] = useState('No preference');
  const [time, setTime] = useState('');
  const [consent, setConsent] = useState(false);
  const toggle = (arr: string[], v: string, set: (a: string[]) => void) => set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  return (
    <Screen
      title="Tell us what you like"
      footer={
        <>
          <Btn label="Finish" onPress={onDone} />
          <Btn label="Skip for now" kind="outline" onPress={onDone} />
        </>
      }
    >
      <Text style={{ fontFamily: fonts.regular, fontSize: 14, lineHeight: 21, color: colors.gray }}>Four quick questions. They help us suggest the right professionals. You can change them later in Profile.</Text>
      <Section title="What are your goals?">
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {GOALS.map((g) => (
            <Chip key={g} label={g} on={goals.includes(g)} onPress={() => toggle(goals, g, setGoals)} />
          ))}
        </View>
      </Section>
      <Section title="Which services interest you?">
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {SERVICES.map((s) => (
            <View key={s.label} style={{ alignItems: 'flex-start', gap: 4 }}>
              <Chip label={s.label} on={services.includes(s.label)} onPress={() => toggle(services, s.label, setServices)} />
              {s.soon ? <Tag label="Soon" /> : null}
            </View>
          ))}
        </View>
      </Section>
      <Section title="Preferred professional">
        <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
          {['No preference', 'Female', 'Male'].map((g) => (
            <Chip key={g} label={g} on={gender === g} onPress={() => setGender(g)} />
          ))}
        </View>
      </Section>
      <Section title="When do you usually train?">
        <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
          {TIMES.map((g) => (
            <Chip key={g} label={g} on={time === g} onPress={() => setTime(g)} />
          ))}
        </View>
      </Section>
      <Check on={consent} onPress={() => setConsent(!consent)} label="I agree that Pulsae may use my answers to personalise suggestions and send me relevant offers (PDPL consent). This is optional." />
    </Screen>
  );
}
