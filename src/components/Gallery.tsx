import React, { useState } from 'react';
import { Image, Modal, Pressable, ScrollView, Text as RNText, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { colors, fonts } from '../theme';
import { Icon, Text } from './ui';
import { VideoPlayer } from './VideoPlayer';

// A photo or video a professional shows on their public profile.
// A real file has a uri. Sample items use colour and an emoji instead, so the demo needs no files.
export type MediaItem = { id: string; kind: 'photo' | 'video'; uri?: string; art?: { emoji: string; bg: string }; caption?: string };

export function MediaTile({ m, w, h, onPress, onRemove }: { m: MediaItem; w: number; h: number; onPress?: () => void; onRemove?: () => void }) {
  const art = m.art || { emoji: m.kind === 'video' ? '🎬' : '📷', bg: colors.pale };
  return (
    <Pressable onPress={onPress} style={{ width: w, height: h, borderRadius: 16, overflow: 'hidden', backgroundColor: art.bg }}>
      {m.uri && m.kind === 'photo' ? (
        <Image source={{ uri: m.uri }} style={{ width: w, height: h }} resizeMode="cover" />
      ) : (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ position: 'absolute', end: -20, top: -24, width: h * 0.7, height: h * 0.7, borderRadius: h * 0.35, backgroundColor: colors.white, opacity: 0.25 }} />
          <RNText style={{ fontSize: Math.round(h * 0.4) }}>{art.emoji}</RNText>
        </View>
      )}
      {m.kind === 'video' ? (
        <View style={{ ...absoluteFill, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: 'rgba(35,24,21,0.62)', alignItems: 'center', justifyContent: 'center' }}>
            <Feather name="play" size={18} color={colors.white} />
          </View>
        </View>
      ) : null}
      {onRemove ? (
        <Pressable accessibilityLabel="Remove" onPress={onRemove} hitSlop={6} style={{ position: 'absolute', top: 6, end: 6, width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(35,24,21,0.7)', alignItems: 'center', justifyContent: 'center' }}>
          <Feather name="x" size={15} color={colors.white} />
        </Pressable>
      ) : null}
    </Pressable>
  );
}

const absoluteFill = { position: 'absolute' as const, top: 0, bottom: 0, start: 0, end: 0 };

// Full screen viewer for one item.
export function MediaViewer({ item, onClose }: { item: MediaItem | null; onClose: () => void }) {
  return (
    <Modal visible={!!item} animationType="fade" transparent onRequestClose={onClose}>
      <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(20,12,9,0.96)' }}>
        <View style={{ alignItems: 'flex-end', padding: 14 }}>
          <Pressable accessibilityLabel="Close" onPress={onClose} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.16)', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="x" size={20} color={colors.white} />
          </Pressable>
        </View>
        {item ? (
          <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 18, gap: 14 }}>
            {item.kind === 'video' && item.uri ? (
              <VideoPlayer uri={item.uri} />
            ) : item.uri ? (
              <Image source={{ uri: item.uri }} style={{ width: '100%', height: 420 }} resizeMode="contain" />
            ) : (
              <View style={{ alignItems: 'center', gap: 14 }}>
                <MediaTile m={item} w={300} h={300} />
                {item.kind === 'video' ? <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: colors.white, opacity: 0.8 }}>Sample video for the demo</Text> : null}
              </View>
            )}
            {item.caption ? <Text style={{ fontFamily: fonts.medium, fontSize: 15, textAlign: 'center', color: colors.white }}>{item.caption}</Text> : null}
          </View>
        ) : null}
      </SafeAreaView>
    </Modal>
  );
}

// Sideways strip of tiles. Tap one to open it.
export function MediaStrip({ items }: { items: MediaItem[] }) {
  const [open, setOpen] = useState<MediaItem | null>(null);
  return (
    <>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingVertical: 2 }}>
        {items.map((m) => (
          <MediaTile key={m.id} m={m} w={150} h={150} onPress={() => setOpen(m)} />
        ))}
      </ScrollView>
      <MediaViewer item={open} onClose={() => setOpen(null)} />
    </>
  );
}
