import React, { useEffect, useRef } from 'react';
import { AccessibilityInfo, Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../theme';

const SIZES = [12, 18, 26, 18, 12];

// Opening animation: wordmark rises in, the five dots pulse in a wave, tagline fades in.
export default function Splash({ onDone }: { onDone: () => void }) {
  const rise = useRef(new Animated.Value(0)).current;
  const tag = useRef(new Animated.Value(0)).current;
  const dots = useRef(SIZES.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    let cancelled = false;
    let loops: Animated.CompositeAnimation[] = [];
    AccessibilityInfo.isReduceMotionEnabled().then((reduce) => {
      if (cancelled) return;
      if (reduce) {
        rise.setValue(1);
        tag.setValue(1);
        dots.forEach((d) => d.setValue(0.5));
        return;
      }
      Animated.timing(rise, { toValue: 1, duration: 900, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
      Animated.timing(tag, { toValue: 1, duration: 900, delay: 1000, useNativeDriver: true }).start();
      loops = dots.map((d, i) =>
        Animated.loop(
          Animated.sequence([
            Animated.delay(i * 160),
            Animated.timing(d, { toValue: 1, duration: 800, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
            Animated.timing(d, { toValue: 0, duration: 800, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
          ])
        )
      );
      loops.forEach((l) => l.start());
    });
    const t = setTimeout(onDone, 2800);
    return () => {
      cancelled = true;
      clearTimeout(t);
      loops.forEach((l) => l.stop());
    };
  }, []);

  return (
    <View style={s.wrap}>
      <Animated.Text
        style={[
          s.word,
          { opacity: rise, transform: [{ translateY: rise.interpolate({ inputRange: [0, 1], outputRange: [14, 0] }) }] },
        ]}
      >
        Pulsae
      </Animated.Text>
      <View style={s.dots}>
        {SIZES.map((d, i) => (
          <Animated.View
            key={i}
            style={{
              width: d,
              height: d,
              borderRadius: d / 2,
              backgroundColor: colors.white,
              opacity: dots[i].interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] }),
              transform: [{ scale: dots[i].interpolate({ inputRange: [0, 1], outputRange: [0.55, 1.35] }) }],
            }}
          />
        ))}
      </View>
      <Animated.Text style={[s.tag, { opacity: tag }]}>Move free. Move found. Move Pulsae.</Animated.Text>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.coral, alignItems: 'center', justifyContent: 'center' },
  word: { fontFamily: fonts.brand, fontSize: 64, lineHeight: 74, color: colors.white },
  dots: { flexDirection: 'row', alignItems: 'flex-end', gap: 6, height: 44, marginTop: 14 },
  tag: { position: 'absolute', bottom: 80, fontFamily: fonts.medium, fontSize: 15, color: colors.white },
});
