import React, { useState } from 'react';
import { Pressable, ScrollView, TextInput, View } from 'react-native';
import { colors, fonts } from '../../theme';
import { Avatar, BellButton, Btn, Card, Chip, Empty, Field, Icon, Notice, Panel, Screen, Tag, Text, styles, useToast } from '../../components/ui';
import { Post, useStore } from '../../store';
import { useApp } from '../../role';
import { useI18n } from '../../i18n';
import { fmtDate } from '../../lib';
import { ArtBand, CatChip, DateBadge, Hero, catOf, dailyQuote } from '../../components/Fun';

export const POST_CATEGORIES = ['Tips', 'Exercise', 'Recovery', 'Nutrition'];

export default function Community({ navigation }: any) {
  const { s } = useStore();
  const { role } = useApp();
  const { lang, tf } = useI18n();
  const [cat, setCat] = useState('All');
  const unread = s.notifs[role].filter((n) => n.unread).length;
  const feed = s.posts.filter((p) => (p.status === 'published' || (role === 'pro' && p.mine)) && (cat === 'All' || (cat === 'Events' ? p.event : p.category === cat)));
  const mine = s.posts.filter((p) => p.mine);

  const card = (p: Post) => {
    const th = catOf(p.category, p.event);
    return (
      <Pressable key={p.id} onPress={() => navigation.navigate('PostDetail', { id: p.id })}>
        <View style={{ borderRadius: 22, overflow: 'hidden', borderWidth: 1, borderColor: th.pale, backgroundColor: colors.white }}>
          <ArtBand theme={th} height={p.event ? 100 : 84}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14 }}>
              {p.event && p.date ? <DateBadge iso={p.date} lang={lang} /> : null}
              <View style={{ height: 26, paddingHorizontal: 12, borderRadius: 13, backgroundColor: th.solid, justifyContent: 'center' }}>
                <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: colors.white }}>{p.event ? 'Event' : p.category || 'Tips'}</Text>
              </View>
              {p.status === 'review' ? <Tag label="In review" tone="dark" /> : null}
            </View>
          </ArtBand>
          <View style={{ padding: 14, gap: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Avatar size={30} icon={p.official ? 'zap' : 'user'} bg={th.solid} />
              <Text style={{ flex: 1, fontFamily: fonts.medium, fontSize: 13, color: colors.ink }}>{p.mine ? 'You' : p.who}</Text>
            </View>
            <Text style={{ fontFamily: fonts.semibold, fontSize: 16, lineHeight: 23, color: colors.ink }}>{p.title}</Text>
            <Text style={styles.p} numberOfLines={3}>{p.body}</Text>
            {p.event ? (
              <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
                <Icon name="clock" size={14} color={th.dark} />
                <Text style={{ flex: 1, fontFamily: fonts.medium, fontSize: 12, color: th.dark }}>{(p.date ? fmtDate(p.date, lang) + ' · ' : '') + p.meta}</Text>
              </View>
            ) : null}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                <Icon name="heart" size={15} color={s.likes.includes(p.id) ? colors.coral : colors.gray} />
                <Text style={styles.cap}>{String((s.likes.includes(p.id) ? 1 : 0) + (p.official ? 12 : 3))}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                <Icon name="message-circle" size={15} color={colors.gray} />
                <Text style={styles.cap}>{String((s.comments[p.id] || []).length)}</Text>
              </View>
              <View style={{ flex: 1 }} />
              {s.going.includes(p.id) ? <Tag label="You are going" tone="outline" /> : null}
            </View>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <Screen title="Community" right={<BellButton count={unread} onPress={() => navigation.navigate('Notifications')} />}>
      <Hero kicker="Your daily boost" title={dailyQuote()} emoji="🌟" />
      {role === 'pro' ? <Btn label="Write a post" onPress={() => navigation.navigate('NewPost')} /> : null}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingVertical: 2 }}>
        {['All', 'Events', ...POST_CATEGORIES].map((c) => <CatChip key={c} label={c} on={cat === c} onPress={() => setCat(c)} />)}
      </ScrollView>
      {role === 'pro' && mine.length > 0 && cat === 'All' ? <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: colors.gray }}>{tf('You have {n} posts. Posts in review are only visible to you.', { n: mine.length })}</Text> : null}
      {feed.length === 0 ? <Empty icon="users" title="Nothing here yet" sub="Check back soon for new posts and events." /> : null}
      {feed.map(card)}
    </Screen>
  );
}

export function PostDetail({ navigation, route }: any) {
  const { s, api } = useStore();
  const { role } = useApp();
  const { lang, tf } = useI18n();
  const toast = useToast();
  const [text, setText] = useState('');
  const [confirmDel, setConfirmDel] = useState(false);
  const p = s.posts.find((x) => x.id === route.params.id);
  if (!p) {
    return (
      <Screen title="Post" onBack={() => navigation.goBack()}>
        <Notice icon="info" text="This post is no longer available." />
      </Screen>
    );
  }
  const liked = s.likes.includes(p.id);
  const going = s.going.includes(p.id);
  const comments = s.comments[p.id] || [];
  const canInteract = p.status === 'published';
  const send = () => {
    if (!text.trim()) return;
    api.addComment(p.id, role, text.trim());
    setText('');
  };
  return (
    <View style={{ flex: 1 }}>
      <Screen title={p.event ? 'Event' : 'Post'} onBack={() => navigation.goBack()}>
        <View style={{ borderRadius: 22, overflow: 'hidden' }}>
          <ArtBand theme={catOf(p.category, p.event)} height={130}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16 }}>
              {p.event && p.date ? <DateBadge iso={p.date} lang={lang} /> : null}
              <View style={{ height: 28, paddingHorizontal: 14, borderRadius: 14, backgroundColor: catOf(p.category, p.event).solid, justifyContent: 'center' }}>
                <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: colors.white }}>{p.event ? 'Event' : p.category || 'Tips'}</Text>
              </View>
            </View>
          </ArtBand>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Avatar size={44} icon={p.official ? 'zap' : 'user'} bg={catOf(p.category, p.event).solid} />
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: fonts.medium, fontSize: 14, color: colors.ink }}>{p.mine ? 'You' : p.who}</Text>
          </View>
          {p.status === 'review' ? <Tag label="In review" tone="dark" /> : null}
        </View>
        <Text style={{ fontFamily: fonts.semibold, fontSize: 20, color: colors.ink }}>{p.title}</Text>
        <Text style={[styles.p, { color: colors.ink }]}>{p.body}</Text>

        {p.event ? (
          <Card style={{ gap: 8 }}>
            <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
              <Icon name="calendar" size={16} color={colors.coralDark} />
              <Text style={{ fontFamily: fonts.medium, fontSize: 14, color: colors.ink }}>{p.date ? fmtDate(p.date, lang) : ''}</Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
              <Icon name="map-pin" size={16} color={colors.coralDark} />
              <Text style={{ flex: 1, fontFamily: fonts.regular, fontSize: 13, color: colors.gray }}>{p.meta}</Text>
            </View>
            {role === 'customer' ? (going ? <Btn label="Cancel RSVP" kind="outline" onPress={() => api.toggleGoing(p.id)} /> : <Btn label="I am going" onPress={() => { api.toggleGoing(p.id); toast.show('You are going. It is in your Bookings.'); }} />) : null}
          </Card>
        ) : null}

        {canInteract ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
            <Pressable onPress={() => api.toggleLike(p.id)} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Icon name="heart" size={20} color={liked ? colors.coral : colors.gray} />
              <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: liked ? colors.coralDark : colors.gray }}>{liked ? 'Liked' : 'Like'}</Text>
            </Pressable>
          </View>
        ) : null}

        {p.status === 'review' ? (
          <Panel title="Waiting for Pulsae to review">
            <Text style={styles.p}>Every post is checked by Pulsae before it appears in Community. You will be notified when it is approved.</Text>
            <Btn label="Demo: simulate Pulsae approval" kind="small" onPress={() => api.approvePost(p.id)} />
          </Panel>
        ) : null}

        {canInteract ? (
          <View style={{ gap: 10 }}>
            <Text style={styles.h2}>{tf('Comments ({n})', { n: comments.length })}</Text>
            {comments.length === 0 ? <Text style={styles.cap}>No comments yet. Be the first.</Text> : null}
            {comments.map((c) => (
              <View key={c.id} style={{ backgroundColor: colors.soft, borderRadius: 14, padding: 12, gap: 2 }}>
                <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: colors.ink }}>{c.mine ? 'You' : c.who}</Text>
                <Text style={{ fontFamily: fonts.regular, fontSize: 13, color: colors.gray }}>{c.text}</Text>
              </View>
            ))}
            <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
              <TextInput value={text} onChangeText={(v) => setText(v.slice(0, 300))} placeholder="Write a comment" placeholderTextColor="#9A908B" style={{ flex: 1, height: 46, borderRadius: 23, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 16, fontFamily: fonts.regular, fontSize: 14, color: colors.ink }} onSubmitEditing={send} returnKeyType="send" />
              <Pressable accessibilityLabel="Send" onPress={send} style={{ width: 46, height: 46, borderRadius: 23, backgroundColor: colors.coral, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="send" size={19} color={colors.white} />
              </Pressable>
            </View>
          </View>
        ) : null}

        {p.mine ? (
          confirmDel ? (
            <Panel title="Delete this post?">
              <Text style={styles.p}>It will be removed from Community for everyone.</Text>
              <Btn label="Delete post" kind="danger" onPress={() => { api.deletePost(p.id); navigation.goBack(); }} />
              <Btn label="Keep post" kind="outline" onPress={() => setConfirmDel(false)} />
            </Panel>
          ) : (
            <Pressable onPress={() => setConfirmDel(true)}>
              <Text style={{ textAlign: 'center', fontFamily: fonts.medium, fontSize: 13, color: colors.coralDark }}>Delete my post</Text>
            </Pressable>
          )
        ) : null}
      </Screen>
      {toast.node}
    </View>
  );
}

export function NewPost({ navigation }: any) {
  const { api } = useStore();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [cat, setCat] = useState('Tips');
  const [done, setDone] = useState(false);
  if (done) {
    return (
      <Screen title="Post sent" footer={<Btn label="Back to Community" onPress={() => navigation.goBack()} />}>
        <Notice icon="check-circle" text="Thank you. Your post is in review. Pulsae checks every post before it appears, and we will notify you when it is live." />
      </Screen>
    );
  }
  return (
    <Screen title="Write a post" onBack={() => navigation.goBack()} footer={<Btn label="Submit for review" disabled={title.trim().length < 5 || body.trim().length < 20} onPress={() => { api.submitPost(title.trim(), body.trim(), cat); setDone(true); }} />}>
      <View style={{ gap: 8 }}>
        <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: colors.gray }}>Topic</Text>
        <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
          {POST_CATEGORIES.map((c) => <CatChip key={c} label={c} on={cat === c} onPress={() => setCat(c)} />)}
        </View>
      </View>
      <Field label="Headline" value={title} onChangeText={(v) => setTitle(v.slice(0, 80))} placeholder="A short, clear headline" />
      <Field label="Text" value={body} onChangeText={(v) => setBody(v.slice(0, 1200))} multiline style={{ height: 160, paddingTop: 12 }} placeholder="Share a tip, an exercise or advice (at least 20 characters)" />
      <Text style={styles.cap}>{body.length + ' / 1200'}</Text>
      <Notice icon="shield" text="Share general wellbeing advice only. Please do not give personal medical advice or promote other services. Every post is reviewed by Pulsae before it appears." />
    </Screen>
  );
}
