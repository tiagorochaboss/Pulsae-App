import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import { colors, fonts } from '../../theme';
import { Btn, Card, Chip, Field, Icon, Notice, Screen, Text, styles } from '../../components/ui';
import { FAQ_CUSTOMER, FAQ_PRO } from '../../faq';
import { useApp } from '../../role';

export function HelpCenter({ navigation }: any) {
  const { role } = useApp();
  const groups = role === 'pro' ? FAQ_PRO : FAQ_CUSTOMER;
  const [open, setOpen] = useState('');
  const [q, setQ] = useState('');
  const k = q.trim().toLowerCase();
  return (
    <Screen title={role === 'pro' ? 'Help centre for professionals' : 'Help centre'} onBack={() => navigation.goBack()} footer={<Btn label="Contact us" kind="outline" onPress={() => navigation.navigate('ContactUs')} />}>
      <Field label="Search" value={q} onChangeText={setQ} placeholder="Search the help centre" />
      {groups.map((g) => {
        const items = g.items.filter((f) => !k || (f.q + ' ' + f.a).toLowerCase().includes(k));
        if (items.length === 0) return null;
        return (
          <View key={g.title} style={{ gap: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingTop: 6 }}>
              <Icon name={g.icon} size={18} color={colors.coralDark} />
              <Text style={styles.h2}>{g.title}</Text>
            </View>
            {items.map((f) => {
              const id = g.title + f.q;
              const on = open === id || !!k;
              return (
                <Pressable key={id} onPress={() => setOpen(open === id ? '' : id)}>
                  <Card style={{ gap: 8 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <Text style={{ flex: 1, fontFamily: fonts.medium, fontSize: 14, color: colors.ink }}>{f.q}</Text>
                      <Icon name={on ? 'chevron-up' : 'chevron-down'} size={18} color={colors.gray} />
                    </View>
                    {on ? <Text style={styles.p}>{f.a}</Text> : null}
                  </Card>
                </Pressable>
              );
            })}
          </View>
        );
      })}
      <Text style={[styles.cap, { textAlign: 'center' }]}>Cannot find your answer? Contact us and we will help.</Text>
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
