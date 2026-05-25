/**
 * Threadly — Onboarding Welcome
 * Cinematic brand intro. Full-bleed editorial imagery, serif wordmark, minimal text.
 * Emotional hook: "entering a luxury fashion ecosystem."
 */

import { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Animated, Dimensions, Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ThreadlyColors, ThreadlySpacing, ThreadlyRadius } from '@/constants/threadly';
import { VIBE_HERO_MAP, pickFromPool } from '@/lib/images';

const { height } = Dimensions.get('window');
const HERO_IMAGE = pickFromPool(Object.values(VIBE_HERO_MAP), 0);

export default function WelcomeScreen() {
  const imageOpacity = useRef(new Animated.Value(0)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const wordmarkOpacity = useRef(new Animated.Value(0)).current;
  const wordmarkY = useRef(new Animated.Value(24)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const taglineY = useRef(new Animated.Value(16)).current;
  const ctaOpacity = useRef(new Animated.Value(0)).current;
  const ctaY = useRef(new Animated.Value(20)).current;
  const pillsOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(imageOpacity, { toValue: 1, duration: 1000, useNativeDriver: true }),
      Animated.timing(overlayOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.delay(100),
      Animated.parallel([
        Animated.timing(wordmarkOpacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(wordmarkY, { toValue: 0, duration: 700, useNativeDriver: true }),
      ]),
      Animated.delay(200),
      Animated.parallel([
        Animated.timing(taglineOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(taglineY, { toValue: 0, duration: 600, useNativeDriver: true }),
      ]),
      Animated.delay(200),
      Animated.parallel([
        Animated.timing(pillsOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(ctaOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(ctaY, { toValue: 0, duration: 500, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* Full-bleed hero */}
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: imageOpacity }]}>
        <Image source={{ uri: HERO_IMAGE }} style={StyleSheet.absoluteFill} resizeMode="cover" />
      </Animated.View>

      {/* Cinematic gradient overlay */}
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: overlayOpacity }]}>
        <LinearGradient
          colors={['rgba(10,10,10,0.1)', 'rgba(10,10,10,0.35)', 'rgba(10,10,10,0.95)']}
          locations={[0, 0.45, 1]}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      {/* Top badge */}
      <Animated.View style={[styles.topBadge, { opacity: pillsOpacity }]}>
        <View style={styles.topBadgeInner}>
          <Text style={styles.topBadgeText}>✦  AI-POWERED STYLING</Text>
        </View>
      </Animated.View>

      {/* Bottom content */}
      <View style={styles.bottomContent}>
        {/* Feature pills */}
        <Animated.View style={[styles.pillRow, { opacity: pillsOpacity }]}>
          {['AI Stylist', 'Deal Engine', 'Trend Discovery'].map((pill) => (
            <View key={pill} style={styles.pill}>
              <Text style={styles.pillText}>{pill}</Text>
            </View>
          ))}
        </Animated.View>

        {/* Wordmark */}
        <Animated.View style={{ opacity: wordmarkOpacity, transform: [{ translateY: wordmarkY }] }}>
          <Text style={styles.wordmark}>THREADLY</Text>
        </Animated.View>

        {/* Tagline */}
        <Animated.View style={{ opacity: taglineOpacity, transform: [{ translateY: taglineY }] }}>
          <Text style={styles.tagline}>Your AI stylist{'\n'}that shops smarter.</Text>
          <Text style={styles.subTagline}>
            Personalized looks from your closet.{'\n'}Missing pieces found at the best price.
          </Text>
        </Animated.View>

        {/* CTA */}
        <Animated.View style={[styles.ctaWrap, { opacity: ctaOpacity, transform: [{ translateY: ctaY }] }]}>
          <TouchableOpacity
            style={styles.ctaBtn}
            activeOpacity={0.88}
            onPress={() => router.push('/onboarding/step1')}
          >
            <LinearGradient
              colors={[ThreadlyColors.roseGold, ThreadlyColors.roseGoldLight]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
            <Text style={styles.ctaBtnText}>Begin Your Style Profile</Text>
            <Text style={styles.ctaBtnArrow}>→</Text>
          </TouchableOpacity>
          <Text style={styles.ctaNote}>Takes 60 seconds · No account needed</Text>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: ThreadlyColors.black },
  topBadge: { position: 'absolute', top: 60, alignSelf: 'center', zIndex: 10 },
  topBadgeInner: {
    paddingHorizontal: 16, paddingVertical: 7,
    borderRadius: ThreadlyRadius.pill,
    backgroundColor: 'rgba(10,10,10,0.6)',
    borderWidth: 1, borderColor: 'rgba(201,149,106,0.4)',
  },
  topBadgeText: { fontSize: 10, fontWeight: '700', color: ThreadlyColors.roseGoldLight, letterSpacing: 2 },
  bottomContent: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingHorizontal: ThreadlySpacing.screenPadding,
    paddingBottom: 52, gap: 18,
  },
  pillRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  pill: {
    paddingHorizontal: 12, paddingVertical: 5,
    borderRadius: ThreadlyRadius.pill,
    backgroundColor: 'rgba(201,149,106,0.15)',
    borderWidth: 1, borderColor: 'rgba(201,149,106,0.3)',
  },
  pillText: { fontSize: 11, color: ThreadlyColors.roseGoldLight, fontWeight: '600', letterSpacing: 0.3 },
  wordmark: {
    fontSize: 44, fontFamily: 'Georgia',
    color: ThreadlyColors.warmWhite, letterSpacing: 8, lineHeight: 52,
  },
  tagline: {
    fontSize: 26, fontFamily: 'Georgia',
    color: ThreadlyColors.warmWhite, lineHeight: 34, marginBottom: 10,
  },
  subTagline: {
    fontSize: 14, color: ThreadlyColors.warmWhiteMuted,
    lineHeight: 22, fontStyle: 'italic',
  },
  ctaWrap: { gap: 12, marginTop: 4 },
  ctaBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 18, borderRadius: ThreadlyRadius.xl,
    overflow: 'hidden', gap: 10,
  },
  ctaBtnText: { fontSize: 16, fontWeight: '700', color: ThreadlyColors.black, letterSpacing: 0.3 },
  ctaBtnArrow: { fontSize: 18, color: ThreadlyColors.black, fontWeight: '700' },
  ctaNote: { textAlign: 'center', fontSize: 12, color: ThreadlyColors.warmWhiteSubtle, fontStyle: 'italic' },
});
