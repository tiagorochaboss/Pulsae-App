import React, { useState } from 'react';
import { View } from 'react-native';
import { colors, fonts } from '../../theme';
import { Avatar, BellButton, Btn, Card, Field, Icon, Notice, Panel, Screen, Tag, Text, styles } from '../../components/ui';
import { useStore } from '../../store';
import { useApp } from '../../role';
import { useI18n } from '../../i18n';
import { fmtDate } from '../../lib';

export default function Community({ navigation }: any) {
  const { s, api } = useStore();
  const { role } = useApp();
  const { lang } = useI18n();
  const [compose, setCompose] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const unread = s.notifs[role].filter((n) => n.unread).length;
  const feed = s.posts.filter((p) => p.status === 'published' || (role === 'pro' && p.mine));

  return (
    <Screen title="Community" right={<BellButton count={unread} onPress={() => navigation.navigate('Notifications')} />}>
      {role === 'pro' ? (
        compose ? (
          <Panel title="New post">
            <Field label="Headline" value={title} onChangeText={setTitle} />
            <Field label="Text" value={body} onChangeText={setBody} multiline style={{ height: 100, paddingTop: 12 }} />
            <Notice icon="shield" text="Every post is reviewed by Pulsae before it appears in Community." />
            <Btn label="Submit for review" disabled={!title.trim() || !body.trim()} onPress={() => { api.submitPost(title.trim(), body.trim()); setTitle(''); setBody(''); setCompose(false); }} />
            <Btn label="Cancel" kind="outline" onPress={() => setCompose(false)} />
          </Panel>
        ) : (
          <Btn label="Write a post" onPress={() => setCompose(true)} />
        )
      ) : null}

      {feed.map((p) => {
        const going = s.going.includes(p.id);
        return (
          <Card key={p.id} style={{ gap: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Avatar size={36} icon={p.official ? 'zap' : 'user'} />
              <Text style={{ flex: 1, fontFamily: fonts.medium, fontSize: 13, color: colors.ink }}>{p.mine ? 'You' : p.who}</Text>
              {p.status === 'review' ? <Tag label="In review" tone="dark" /> : null}
              {p.event ? <Tag label="Event" /> : null}
            </View>
            <Text style={{ fontFamily: fonts.semibold, fontSize: 16, color: colors.ink }}>{p.title}</Text>
            <Text style={styles.p}>{p.body}</Text>
            {p.event ? (
              <View style={{ gap: 4 }}>
                <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
                  <Icon name="calendar" size={14} color={colors.gray} />
                  <Text style={styles.cap}>{p.date ? fmtDate(p.date, lang) : ''}</Text>
                  <Text style={styles.cap}>{p.meta}</Text>
                </View>
              </View>
            ) : null}
            {p.event && role === 'customer' ? (
              going ? <Btn label="Cancel RSVP" kind="outline" onPress={() => api.toggleGoing(p.id)} /> : <Btn label="I am going" onPress={() => api.toggleGoing(p.id)} />
            ) : null}
            {p.status === 'review' ? <Btn label="Demo: simulate Pulsae approval" kind="small" onPress={() => api.approvePost(p.id)} /> : null}
          </Card>
        );
      })}
    </Screen>
  );
}
