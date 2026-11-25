import React from 'react';
import { View } from 'react-native';
import { colors, fonts } from '../theme';
import { Text } from './ui';

// Video playback. expo-video is loaded only if installed, so the app still runs without it:
//   npx expo install expo-video
let V: any = null;
try {
  V = require('expo-video');
} catch (e) {
  V = null;
}
export const videoAvailable = () => !!V;

function Real({ uri }: { uri: string }) {
  const player = V.useVideoPlayer(uri, (p: any) => {
    p.loop = false;
  });
  return <V.VideoView player={player} style={{ width: '100%', height: 320, borderRadius: 16, backgroundColor: '#000' }} nativeControls allowsFullscreen contentFit="contain" />;
}

export function VideoPlayer({ uri }: { uri: string }) {
  if (!V) {
    return (
      <View style={{ width: '100%', height: 200, borderRadius: 16, backgroundColor: '#1d1512', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <Text style={{ fontFamily: fonts.regular, fontSize: 13, textAlign: 'center', color: colors.white }}>Video playback needs the expo-video package.</Text>
      </View>
    );
  }
  return <Real uri={uri} />;
}
