/**
 * Threadly — Splash / Entry Screen
 * Luxury animated intro with logo and tagline.
 * Checks onboarding state and routes accordingly.
 */

import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { isOnboardingComplete } from '@/lib/onboarding-store';
import { ThreadlyColors } from '@/constants/threadly';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.85)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const taglineY = useRef(new Animated.Value(12)).current;
  const sparkleOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate in sequence: logo → tagline → sparkle → navigate
    Animated.sequence([
      // Logo fades and scales in
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 60,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
      // Tagline slides up
      Animated.delay(200),
      Animated.parallel([
        Animated.timing(taglineOpacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(taglineY, {
          toValue: 0,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
      // Sparkle accent
      Animated.timing(sparkleOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      // Hold then navigate
      Animated.delay(1200),
    ]).start(async () => {
      const done = await isOnboardingComplete();
      if (done) {
        router.replace('/(tabs)');
      } else {
        router.replace('/onboarding/welcome');
      }
    });
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0A0A0A', '#1A1A1A', '#0A0A0A']}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* Subtle radial glow behind logo */}
      <View style={styles.glowContainer}>
        <LinearGradient
          colors={['rgba(201,149,106,0.18)', 'transparent']}
          style={styles.glow}
        />
      </View>

      {/* Logo + wordmark */}
      <Animated.View
        style={[
          styles.logoContainer,
          { opacity: logoOpacity, transform: [{ scale: logoScale }] },
        ]}
      >
        {/* Decorative T monogram */}
        <View style={styles.monogramContainer}>
          <Text style={styles.monogram}>T</Text>
          <View style={styles.monogramLine} />
        </View>

        {/* Wordmark */}
        <Text style={styles.wordmark}>THREADLY</Text>

        {/* Divider with sparkle */}
        <Animated.View style={[styles.dividerRow, { opacity: sparkleOpacity }]}>
          <View style={styles.dividerLine} />
          <Text style={styles.sparkle}>✦</Text>
          <View style={styles.dividerLine} />
        </Animated.View>
      </Animated.View>

      {/* Tagline */}
      <Animated.View
        style={[
          styles.taglineContainer,
          {
            opacity: taglineOpacity,
            transform: [{ translateY: taglineY }],
          },
        ]}
      >
        <Text style={styles.tagline}>The AI stylist that shops smarter.</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ThreadlyColors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowContainer: {
    position: 'absolute',
    top: height * 0.25,
    alignSelf: 'center',
    width: 300,
    height: 300,
  },
  glow: {
    width: 300,
    height: 300,
    borderRadius: 150,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  monogramContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  monogram: {
    fontSize: 72,
    fontFamily: 'Georgia',
    fontStyle: 'italic',
    color: ThreadlyColors.roseGold,
    lineHeight: 80,
    letterSpacing: -2,
  },
  monogramLine: {
    width: 2,
    height: 20,
    backgroundColor: ThreadlyColors.roseGoldDim,
    marginTop: -8,
  },
  wordmark: {
    fontSize: 36,
    fontFamily: 'Georgia',
    fontWeight: '400',
    color: ThreadlyColors.warmWhite,
    letterSpacing: 10,
    marginTop: 12,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    gap: 8,
  },
  dividerLine: {
    width: 60,
    height: 1,
    backgroundColor: ThreadlyColors.roseGoldDim,
    opacity: 0.5,
  },
  sparkle: {
    fontSize: 12,
    color: ThreadlyColors.roseGold,
  },
  taglineContainer: {
    position: 'absolute',
    bottom: height * 0.15,
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  tagline: {
    fontSize: 14,
    fontWeight: '400',
    color: ThreadlyColors.warmWhiteMuted,
    textAlign: 'center',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
});
