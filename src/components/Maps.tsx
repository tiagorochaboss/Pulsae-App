import React from 'react';
import { Linking, Pressable, View } from 'react-native';
import { colors, fonts } from '../theme';
import { Icon, Text, styles } from './ui';

// Google Maps search link for an address. Opens the Google Maps app if installed, otherwise the browser.
export const mapsUrl = (address: string) => {
  const a = /riyadh|الرياض/i.test(address) ? address : address + ', Riyadh, Saudi Arabia';
  return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(a);
};
export const openMaps = (address: string) => {
  Linking.openURL(mapsUrl(address)).catch(() => {});
};

// Exact session address with a tappable Google Maps link.
export function AddressCard({ title = 'Session address', address, notes, hint }: { title?: string; address: string; notes?: string; hint?: string }) {
  return (
    <View style={[styles.card, { gap: 10 }]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Icon name="map-pin" size={18} color={colors.coralDark} />
        <Text style={{ fontFamily: fonts.medium, fontSize: 14, color: colors.ink }}>{title}</Text>
      </View>
      <Text style={{ fontFamily: fonts.semibold, fontSize: 15, lineHeight: 22, color: colors.ink }}>{address}</Text>
      {notes ? <Text style={styles.cap}>{notes}</Text> : null}
      {hint ? <Text style={styles.cap}>{hint}</Text> : null}
      <Pressable accessibilityRole="link" onPress={() => openMaps(address)} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 46, borderRadius: 23, backgroundColor: colors.pale }}>
        <Icon name="navigation" size={16} color={colors.coralDark} />
        <Text style={{ fontFamily: fonts.semibold, fontSize: 14, color: colors.coralDark }}>Open in Google Maps</Text>
      </Pressable>
    </View>
  );
}
