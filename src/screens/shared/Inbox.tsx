import React from 'react';
import { Pressable, View } from 'react-native';
import { colors, fonts } from '../../theme';
import { Avatar, Card, Empty, Screen, Text, styles } from '../../components/ui';
import { PROS } from '../../data';
import { unreadChat, useStore } from '../../store';
import { useApp } from '../../role';
import { useI18n } from '../../i18n';
import { fmtShort, fmtTime, startOf } from '../../lib';

export default function Inbox({ navigation }: any) {
  const { s } = useStore();
  const { role } = useApp();
  const { lang, tf } = useI18n();
  const threads = Object.keys(s.chats)
    .map((id) => {
      const b = s.bookings.find((x) => x.id === id);
      if (!b || (s.chats[id] || []).length === 0) return null;
      const msgs = s.chats[id];
      const pro = PROS.find((p) => p.id === b.proId);
      return { id, b, last: msgs[msgs.length - 1], name: role === 'customer' ? (pro ? pro.name : 'Professional') : b.customer, unread: unreadChat(s, role, id), when: startOf(b.date, b.time).getTime() };
    })
    .filter(Boolean) as any[];
  threads.sort((a, b) => (b.unread > 0 ? 1 : 0) - (a.unread > 0 ? 1 : 0) || b.when - a.when);
  return (
    <Screen title="Messages" onBack={() => navigation.goBack()}>
      {threads.length === 0 ? <Empty icon="message-circle" title="No messages yet" sub={role === 'customer' ? 'After you book a session you can message your professional here.' : 'Messages from your customers appear here.'} /> : null}
      {threads.map((t) => (
        <Pressable key={t.id} onPress={() => navigation.navigate('Chat', { bookingId: t.id })}>
          <Card style={{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: t.unread ? colors.pale : colors.white, borderColor: t.unread ? colors.pale : colors.line }}>
            <Avatar size={46} />
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={{ fontFamily: t.unread ? fonts.semibold : fonts.medium, fontSize: 14, color: colors.ink }}>{t.name}</Text>
              <Text numberOfLines={1} style={{ fontFamily: t.unread ? fonts.medium : fonts.regular, fontSize: 13, color: t.unread ? colors.ink : colors.gray }}>{(t.last.from === role ? 'You: ' : '') + t.last.text}</Text>
              <Text style={styles.cap}>{tf('Session {d}, {t}', { d: fmtShort(t.b.date, lang), t: fmtTime(t.b.time, lang) })}</Text>
            </View>
            {t.unread ? (
              <View style={{ minWidth: 22, height: 22, borderRadius: 11, backgroundColor: colors.coral, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 5 }}>
                <Text style={{ color: colors.white, fontSize: 11, fontFamily: fonts.semibold }}>{String(t.unread)}</Text>
              </View>
            ) : null}
          </Card>
        </Pressable>
      ))}
      <Text style={[styles.cap, { textAlign: 'center' }]}>Each conversation belongs to a booking. Open a booking to message from there too.</Text>
    </Screen>
  );
}
