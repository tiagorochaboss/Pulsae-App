import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import { colors, fonts } from '../../theme';
import { Btn, Card, Chip, Field, Icon, Notice, Screen, Text, styles } from '../../components/ui';
import { FAQ } from '../../data';

export function HelpCenter({ navigation }: any) {
  const [open, setOpen] = useState(-1);
  return (
    <Screen title="Help centre" onBack={() => navigation.goBack()} footer={<Btn label="Contact us" kind="outline" onPress={() => navigation.navigate('ContactUs')} />}>
      {FAQ.map((f, i) => (
        <Pressable key={i} onPress={() => setOpen(open === i ? -1 : i)}>
          <Card style={{ gap: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={{ flex: 1, fontFamily: fonts.medium, fontSize: 14, color: colors.ink }}>{f.q}</Text>
              <Icon name={open === i ? 'chevron-up' : 'chevron-down'} size={18} color={colors.gray} />
            </View>
            {open === i ? <Text style={styles.p}>{f.a}</Text> : null}
          </Card>
        </Pressable>
      ))}
    </Screen>
  );
}

export function ContactUs({ navigation }: any) {
  const [topic, setTopic] = useState('');
  const [msg, setMsg] = useState('');
  const [sent, setSent] = useState(false);
  if (sent) {
    return (
      <Screen title="Contact us" onBack={() => navigation.goBack()} footer={<Btn label="Done" onPress={() => navigation.goBack()} />}>
        <Notice icon="check-circle" text="Thank you. We received your message and will reply within one working day." />
      </Screen>
    );
  }
  return (
    <Screen title="Contact us" onBack={() => navigation.goBack()} footer={<Btn label="Send message" disabled={!topic || !msg.trim()} onPress={() => setSent(true)} />}>
      <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
        {['Booking', 'Payment', 'Account', 'Feedback', 'Other'].map((t) => <Chip key={t} label={t} on={topic === t} onPress={() => setTopic(t)} />)}
      </View>
      <Field label="Your message" value={msg} onChangeText={setMsg} multiline style={{ height: 140, paddingTop: 12 }} />
      <Notice text="Prototype: messages are not sent anywhere." />
    </Screen>
  );
}
