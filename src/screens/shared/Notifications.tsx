import React from 'react';
import { Pressable, View } from 'react-native';
import { colors, fonts } from '../../theme';
import { Card, Empty, Icon, Screen, Text, styles } from '../../components/ui';
import { useStore } from '../../store';
import { useApp } from '../../role';
import { useI18n } from '../../i18n';

export default function Notifications({ navigation }: any) {
  const { s, api } = useStore();
  const { role } = useApp();
  const { t, tf } = useI18n();
  const list = s.notifs[role];
  return (
    <Screen
      title="Notifications"
      onBack={() => navigation.goBack()}
      right={list.some((n) => n.unread) ? <Pressable onPress={() => api.markAllRead(role)}><Text style={{ fontFamily: fonts.medium, fontSize: 13, color: colors.coralDark }}>Mark all read</Text></Pressable> : undefined}
    >
      {list.length === 0 ? <Empty icon="bell" title="You are all caught up" /> : null}
      {list.map((n) => (
        <Card key={n.id} style={{ flexDirection: 'row', gap: 12, alignItems: 'center', backgroundColor: n.unread ? colors.pale : colors.white, borderColor: n.unread ? colors.pale : colors.line }}>
          <View style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name={n.icon} size={18} color={colors.coralDark} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: fonts.medium, fontSize: 14, color: colors.ink }}>{n.title}</Text>
            <Text style={styles.cap}>{tf(n.sub, n.vars || {})}</Text>
          </View>
          <Text style={styles.cap}>{t(n.when)}</Text>
        </Card>
      ))}
    </Screen>
  );
}
