import React, { useState } from 'react';
import { View } from 'react-native';
import { colors, fonts } from '../../theme';
import { Btn, Notice, Screen, Text, styles } from '../../components/ui';
import { MediaTile, MediaViewer } from '../../components/Gallery';
import { Media, useStore } from '../../store';
import { useI18n } from '../../i18n';
import { photoPickerAvailable, pickMedia } from '../../auth/device';

const MAX = 12;

// A professional chooses photos and videos for their public profile. All of it is optional.
export default function MyMedia({ navigation }: any) {
  const { s, api } = useStore();
  const { tf } = useI18n();
  const [msg, setMsg] = useState('');
  const [open, setOpen] = useState<Media | null>(null);
  const full = s.media.length >= MAX;

  const add = async (kind: 'photo' | 'video', source: 'library' | 'camera') => {
    const uri = await pickMedia(kind, source);
    if (uri === null) {
      setMsg(photoPickerAvailable() ? 'We could not open it. Please allow access to your ' + (source === 'camera' ? 'camera' : 'photos') + ' in the iPhone settings.' : 'Uploading needs the expo-image-picker package.');
    } else if (uri) {
      api.addMedia({ kind, uri, caption: '' });
      setMsg('');
    }
  };

  return (
    <Screen title="Photos and videos" onBack={() => navigation.goBack()}>
      <Text style={styles.p}>Show customers who you are. Photos and videos appear at the top of your profile in Discover. Adding them is your choice.</Text>
      <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: colors.coralDark }}>{tf('{n} of {m} added', { n: s.media.length, m: MAX })}</Text>
      <View style={{ gap: 10 }}>
        <Btn label="Add a photo" disabled={full} onPress={() => add('photo', 'library')} />
        <Btn label="Add a video" kind="outline" disabled={full} onPress={() => add('video', 'library')} />
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Btn label="Take a photo" kind="small" disabled={full} onPress={() => add('photo', 'camera')} style={{ flex: 1 }} />
          <Btn label="Record a video" kind="small" disabled={full} onPress={() => add('video', 'camera')} style={{ flex: 1 }} />
        </View>
      </View>
      {msg ? <Notice icon="alert-circle" text={msg} /> : null}
      {s.media.length === 0 ? <Notice icon="image" text="Nothing added yet. Customers see only your name, introduction and reviews." /> : null}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
        {s.media.map((m) => (
          <MediaTile key={m.id} m={m} w={150} h={150} onPress={() => setOpen(m)} onRemove={() => api.removeMedia(m.id)} />
        ))}
      </View>
      <Notice icon="shield" text="Only share content you own, and only show people who agreed to appear. Videos can be up to 60 seconds. Pulsae may remove content that breaks the community guidelines." />
      <MediaViewer item={open} onClose={() => setOpen(null)} />
    </Screen>
  );
}
