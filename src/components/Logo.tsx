import React from 'react';
import { Text, View } from 'react-native';
import { colors, fonts } from '../theme';

// Static Pulsae logo: wordmark with dots that grow and shrink (rhythm through scale).
export function Logo({ size = 28, color = colors.coral, center = false }: { size?: number; color?: string; center?: boolean }) {
  const k = size / 28;
  const dot = (d: number, o: number, c: string, key: number) => (
    <View key={key} style={{ width: d * k, height: d * k, borderRadius: (d * k) / 2, backgroundColor: c, opacity: o }} />
  );
  return (
    <View style={{ alignItems: center ? 'center' : 'flex-start' }}>
      <Text style={{ fontFamily: fonts.brand, fontSize: size, lineHeight: size * 1.15, color }}>Pulsae</Text>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 3 * k, marginTop: 2 * k }}>
        {dot(5, 0.45, color, 0)}
        {dot(8, 0.7, color, 1)}
        {dot(11, 1, color, 2)}
        {dot(8, 1, colors.coralDark, 3)}
        {dot(5, 0.45, color, 4)}
      </View>
    </View>
  );
}
