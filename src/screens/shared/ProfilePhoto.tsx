import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import { colors, fonts } from '../../theme';
import { Btn, Icon, Notice, Screen, Text, styles, Avatar } from '../../components/ui';
import { MyAvatar } from '../../components/MyAvatar';
import { useStore } from '../../store';
import { useApp } from '../../role';
import { photoPickerAvailable, pickPhoto } from '../../auth/device';

const PRESETS = [
  { icon: 'user', bg: '#D85A30' },
  { icon: 'heart', bg: '#C2415C' },
  { icon: 'zap', bg: '#E08A1E' },
  { icon: 'smile', bg: '#2F8F83' },
  { icon: 'sun', bg: '#6B6BD1' },
  { icon: 'activity', bg: '#3C7A3C' },
];

export default function ProfilePhoto({ navigation }: any) {
  const { s, api } = useStore();
  const { role } = useApp();
  const [msg, setMsg] = useState('');
  const has = !!s.photos[role];
  const pick = async (src: 'library' | 'camera') => {
    const uri = await pickPhoto(src);
    if (uri === null) setMsg(photoPickerAvailable() ? 'We could not open it. Please allow access to your ' + (src === 'camera' ? 'camera' : 'photos') + ' in the iPhone settings.' : 'Photo upload needs the expo-image-picker package. Choose an avatar below for now.');
    else if (uri) {
      api.setPhoto(role, { kind: 'uri', uri });
      setMsg('');
    }
  };
  return (
    <Screen title="Profile photo" onBack={() => navigation.goBack()}>
      <View style={{ alignItems: 'center', paddingVertical: 8 }}>
        <MyAvatar role={role} size={120} />
      </View>
      <View style={{ gap: 10 }}>
        <Btn label="Choose from library" onPress={() => pick('library')} />
        <Btn label="Take a photo" kind="outline" onPress={() => pick('camera')} />
        {has ? <Btn label="Remove photo" kind="danger" onPress={() => api.setPhoto(role, null)} /> : null}
      </View>
      {msg ? <Notice icon="alert-circle" text={msg} /> : null}
      <Text style={styles.h2}>Or pick an avatar</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 14 }}>
        {PRESETS.map((p) => (
          <Pressable key={p.icon} accessibilityLabel={p.icon} onPress={() => api.setPhoto(role, { kind: 'preset', icon: p.icon, bg: p.bg })}>
            <Avatar size={64} icon={p.icon} bg={p.bg} />
          </Pressable>
        ))}
      </View>
      <Notice icon="info" text={role === 'pro' ? 'Customers see your photo on your profile. Use a clear, friendly photo of your face.' : 'Your professional sees your photo on your booking.'} />
    </Screen>
  );
}
