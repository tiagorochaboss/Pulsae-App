import React, { useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, TextInput, View } from 'react-native';
import { colors, fonts } from '../../theme';
import { Icon, Screen, Text } from '../../components/ui';
import { PROS } from '../../data';
import { useStore } from '../../store';
import { useApp } from '../../role';
import { useI18n } from '../../i18n';
import { fmtShort, fmtTime } from '../../lib';

export default function Chat({ navigation, route }: any) {
  const { s, api } = useStore();
  const { role } = useApp();
  const { t, lang, rtl } = useI18n();
  const [text, setText] = useState('');
  const ref = useRef<ScrollView>(null);
  const b = s.bookings.find((x) => x.id === route.params.bookingId);
  const pro = PROS.find((p) => p.id === (b ? b.proId : 'p1')) || PROS[0];
  const msgs = s.chats[route.params.bookingId] || [];
  const other = role === 'customer' ? pro.name : b ? b.customer : 'Customer';

  const send = () => {
    if (!text.trim() || !b) return;
    api.send(b.id, role, text.trim());
    setText('');
    setTimeout(() => ref.current && ref.current.scrollToEnd({ animated: true }), 50);
  };

  return (
    <Screen title={other} onBack={() => navigation.goBack()} scroll={false}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView ref={ref} contentContainerStyle={{ padding: 20, gap: 10 }} onContentSizeChange={() => ref.current && ref.current.scrollToEnd({ animated: false })}>
          {b ? <Text style={{ textAlign: 'center', fontFamily: fonts.regular, fontSize: 12, color: colors.gray }}>{fmtShort(b.date, lang) + ' · ' + fmtTime(b.time, lang)}</Text> : null}
          {msgs.length === 0 ? <Text style={{ textAlign: 'center', fontFamily: fonts.regular, fontSize: 13, color: colors.gray, paddingTop: 20 }}>No messages yet. Say hello.</Text> : null}
          {msgs.map((m, i) => {
            const mine = m.from === role;
            return (
              <View key={i} style={{ alignSelf: mine ? 'flex-end' : 'flex-start', maxWidth: '80%', backgroundColor: mine ? colors.coral : colors.soft, borderRadius: 18, paddingHorizontal: 14, paddingVertical: 10, gap: 2 }}>
                <Text style={{ fontFamily: fonts.regular, fontSize: 14, color: mine ? colors.white : colors.ink }}>{m.text}</Text>
                <Text style={{ fontFamily: fonts.regular, fontSize: 10, color: mine ? '#FBE3DA' : colors.gray }}>{m.at}</Text>
              </View>
            );
          })}
        </ScrollView>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderTopWidth: 1, borderTopColor: colors.line }}>
          <TextInput value={text} onChangeText={setText} placeholder={t('Write a message')} placeholderTextColor="#9A908B" style={{ flex: 1, height: 46, borderRadius: 23, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 16, fontFamily: fonts.regular, fontSize: 14, color: colors.ink, textAlign: rtl ? 'right' : 'left' }} onSubmitEditing={send} returnKeyType="send" />
          <Pressable accessibilityLabel="Send" onPress={send} style={{ width: 46, height: 46, borderRadius: 23, backgroundColor: colors.coral, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="send" size={19} color={colors.white} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}
