/**
 * Threadly — Welcome Screen
 * Brand intro with emotional hook and CTA to begin onboarding.
 */

import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Animated } from 'react-native';
import { useEffect, useRef } from 'react';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ThreadlyColors, ThreadlySpacing, ThreadlyRadius } from '@/constants/threadly';

const { height } = Dimensions.get('window');

const FEATURES = [
  { icon: '✦', text: 'Build looks from what you own' },
  { icon: '✦', text: 'Find trends that fit your style' },
  { icon: '✦', text: 'Get the best deals automatically' },
  { icon: '✦', text: 'Shop smarter. Save more.' },
];

export default function WelcomeScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0A0A0A', '#1A1A1A']}
        style={StyleSheet.absoluteFill}
      />

      {/* Top decorative gradient */}
      <LinearGradient
        colors={['rgba(201,149,106,0.12)', 'transparent']}
        style={styles.topGlow}
      />

      <Animated.View
        style={[
          styles.content,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        {/* Logo */}
        <View style={styles.logoRow}>
          <Text style={styles.monogram}>T</Text>
          <Text style={styles.wordmark}>THREADLY</Text>
        </View>

        {/* Hero copy */}
        <View style={styles.heroSection}>
          <Text style={styles.heroHeadline}>The AI stylist</Text>
          <Text style={styles.heroHeadlineAccent}>built around you.</Text>
          <Text style={styles.heroBody}>
            An AI-powered personal style system that builds outfits from your real closet, learns your favorite brands, and finds deals automatically.
          </Text>
        </View>

        {/* Feature list */}
        <View style={styles.featureList}>
          {FEATURES.map((f, i) => (
            <View key={i} style={styles.featureRow}>
              <Text style={styles.featureIcon}>{f.icon}</Text>
              <Text style={styles.featureText}>{f.text}</Text>
            </View>
          ))}
        </View>

        {/* CTA */}
        <View style={styles.ctaSection}>
          <TouchableOpacity
            style={styles.primaryBtn}
            activeOpacity={0.85}
            onPress={() => router.push('/onboarding/step1')}
          >
            <LinearGradient
              colors={[ThreadlyColors.roseGold, ThreadlyColors.roseGoldLight]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.primaryBtnGradient}
            >
              <Text style={styles.primaryBtnText}>Get Started</Text>
            </LinearGradient>
          </TouchableOpacity>

          <Text style={styles.disclaimer}>
            Personalized for you in under 2 minutes.
          </Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ThreadlyColors.black,
  },
  topGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.35,
  },
  content: {
    flex: 1,
    paddingHorizontal: ThreadlySpacing.screenPadding,
    paddingTop: 60,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  monogram: {
    fontSize: 32,
    fontFamily: 'Georgia',
    fontStyle: 'italic',
    color: ThreadlyColors.roseGold,
  },
  wordmark: {
    fontSize: 18,
    fontFamily: 'Georgia',
    color: ThreadlyColors.warmWhite,
    letterSpacing: 5,
  },
  heroSection: {
    marginTop: 48,
  },
  heroHeadline: {
    fontSize: 44,
    fontFamily: 'Georgia',
    fontWeight: '400',
    color: ThreadlyColors.warmWhite,
    lineHeight: 52,
  },
  heroHeadlineAccent: {
    fontSize: 44,
    fontFamily: 'Georgia',
    fontStyle: 'italic',
    color: ThreadlyColors.roseGold,
    lineHeight: 52,
    marginBottom: 20,
  },
  heroBody: {
    fontSize: 15,
    color: ThreadlyColors.warmWhiteMuted,
    lineHeight: 24,
    fontWeight: '400',
  },
  featureList: {
    gap: 14,
    marginTop: 8,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureIcon: {
    fontSize: 10,
    color: ThreadlyColors.roseGold,
  },
  featureText: {
    fontSize: 14,
    color: ThreadlyColors.warmWhiteMuted,
    fontWeight: '400',
  },
  ctaSection: {
    gap: 14,
    marginTop: 16,
  },
  primaryBtn: {
    borderRadius: ThreadlyRadius.pill,
    overflow: 'hidden',
  },
  primaryBtnGradient: {
    paddingVertical: 18,
    alignItems: 'center',
    borderRadius: ThreadlyRadius.pill,
  },
  primaryBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: ThreadlyColors.warmWhite,
    letterSpacing: 0.5,
  },
  disclaimer: {
    fontSize: 12,
    color: ThreadlyColors.warmWhiteSubtle,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
});
