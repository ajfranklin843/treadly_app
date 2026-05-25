/**
 * Threadly Onboarding — Step 6: AI Profile Build
 * Animated "building your style profile" moment.
 * Emotionally satisfying — the AI is working for you.
 * After animation completes, routes to the First Look Reveal.
 */

import { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, Animated, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { completeOnboarding } from '@/lib/onboarding-store';
import { ThreadlyColors, ThreadlySpacing, ThreadlyRadius } from '@/constants/threadly';

const { width, height } = Dimensions.get('window');

const BUILD_STEPS = [
  { label: 'Analyzing your style vibes…', icon: '✦', delay: 0 },
  { label: 'Mapping your brand universe…', icon: '◈', delay: 900 },
  { label: 'Learning your occasions…', icon: '◎', delay: 1700 },
  { label: 'Calibrating your color palette…', icon: '◉', delay: 2500 },
  { label: 'Building your closet intelligence…', icon: '⬡', delay: 3200 },
  { label: 'Activating your deal engine…', icon: '◆', delay: 3900 },
  { label: 'Your style profile is ready.', icon: '✓', delay: 4600 },
];

export default function Step6Screen() {
  const [activeStep, setActiveStep] = useState(-1);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const wordmarkOpacity = useRef(new Animated.Value(0)).current;
  const wordmarkScale = useRef(new Animated.Value(0.85)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const revealOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Wordmark entrance
    Animated.parallel([
      Animated.timing(wordmarkOpacity, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.spring(wordmarkScale, { toValue: 1, friction: 6, useNativeDriver: true }),
    ]).start();

    // Glow pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 0.3, duration: 1500, useNativeDriver: true }),
      ])
    ).start();

    // Progress bar
    Animated.timing(progressAnim, { toValue: 1, duration: 5200, useNativeDriver: false }).start();

    // Step reveals
    BUILD_STEPS.forEach((step, i) => {
      setTimeout(() => setActiveStep(i), step.delay + 300);
    });

    // Navigate to look reveal after build
    setTimeout(async () => {
      await completeOnboarding();
      Animated.timing(revealOpacity, { toValue: 1, duration: 400, useNativeDriver: true }).start(() => {
        router.replace('/(tabs)');
      });
    }, 5800);
  }, []);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const glowOpacity = glowAnim.interpolate({ inputRange: [0, 1], outputRange: [0.2, 0.6] });

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0A0A0A', '#0D0A08', '#0A0A0A']} style={StyleSheet.absoluteFill} />

      {/* Ambient rose gold glow */}
      <Animated.View style={[styles.ambientGlow, { opacity: glowOpacity }]}>
        <LinearGradient
          colors={['rgba(201,149,106,0.4)', 'transparent']}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      {/* White flash on complete */}
      <Animated.View style={[StyleSheet.absoluteFill, styles.revealFlash, { opacity: revealOpacity }]} />

      <View style={styles.content}>
        {/* Wordmark */}
        <Animated.View style={[styles.wordmarkWrap, { opacity: wordmarkOpacity, transform: [{ scale: wordmarkScale }] }]}>
          <Text style={styles.monogram}>T</Text>
          <Text style={styles.wordmark}>HREADLY</Text>
        </Animated.View>

        {/* Central orb */}
        <Animated.View style={[styles.orbWrap, { opacity: wordmarkOpacity }]}>
          <View style={styles.orbOuter}>
            <LinearGradient
              colors={['rgba(201,149,106,0.15)', 'rgba(201,149,106,0.05)']}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.orbMid}>
              <LinearGradient
                colors={['rgba(201,149,106,0.25)', 'rgba(201,149,106,0.1)']}
                style={StyleSheet.absoluteFill}
              />
              <View style={styles.orbInner}>
                <LinearGradient
                  colors={[ThreadlyColors.roseGold, ThreadlyColors.roseGoldDim]}
                  style={StyleSheet.absoluteFill}
                />
                <Text style={styles.orbIcon}>✦</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Build steps */}
        <View style={styles.stepsWrap}>
          {BUILD_STEPS.map((step, i) => (
            <Animated.View
              key={i}
              style={[
                styles.stepRow,
                {
                  opacity: activeStep >= i ? 1 : 0,
                  transform: [{ translateY: activeStep >= i ? 0 : 8 }],
                },
              ]}
            >
              <Text style={[
                styles.stepIcon,
                i === BUILD_STEPS.length - 1 && styles.stepIconFinal,
              ]}>
                {step.icon}
              </Text>
              <Text style={[
                styles.stepLabel,
                i === BUILD_STEPS.length - 1 && styles.stepLabelFinal,
              ]}>
                {step.label}
              </Text>
            </Animated.View>
          ))}
        </View>

        {/* Progress bar */}
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, { width: progressWidth }]}>
            <LinearGradient
              colors={[ThreadlyColors.roseGoldDim, ThreadlyColors.roseGold, ThreadlyColors.roseGoldLight]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>
        </View>

        <Text style={styles.bottomNote}>Personalized just for you.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: ThreadlyColors.black },
  ambientGlow: {
    position: 'absolute', top: -height * 0.2, left: -width * 0.3,
    width: width * 1.6, height: height * 0.7, borderRadius: width,
  },
  revealFlash: { backgroundColor: ThreadlyColors.warmWhite, zIndex: 100 },
  content: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: ThreadlySpacing.screenPadding, gap: 32,
  },
  wordmarkWrap: { flexDirection: 'row', alignItems: 'baseline', gap: 2 },
  monogram: { fontSize: 36, fontFamily: 'Georgia', fontStyle: 'italic', color: ThreadlyColors.roseGold },
  wordmark: { fontSize: 20, fontFamily: 'Georgia', color: ThreadlyColors.warmWhite, letterSpacing: 4 },
  orbWrap: { alignItems: 'center', justifyContent: 'center' },
  orbOuter: {
    width: 140, height: 140, borderRadius: 70,
    alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1, borderColor: 'rgba(201,149,106,0.2)',
  },
  orbMid: {
    width: 100, height: 100, borderRadius: 50,
    alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1, borderColor: 'rgba(201,149,106,0.35)',
  },
  orbInner: {
    width: 64, height: 64, borderRadius: 32,
    alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden',
  },
  orbIcon: { fontSize: 24, color: ThreadlyColors.black },
  stepsWrap: { width: '100%', gap: 10 },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  stepIcon: { fontSize: 12, color: ThreadlyColors.roseGold, width: 18, textAlign: 'center' },
  stepIconFinal: { color: ThreadlyColors.roseGoldLight, fontSize: 14 },
  stepLabel: { fontSize: 13, color: ThreadlyColors.warmWhiteMuted, fontStyle: 'italic' },
  stepLabelFinal: { color: ThreadlyColors.warmWhite, fontStyle: 'normal', fontWeight: '600', fontSize: 15 },
  progressTrack: {
    width: '100%', height: 2, borderRadius: 1,
    backgroundColor: ThreadlyColors.charcoalLight, overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: 1, overflow: 'hidden' },
  bottomNote: {
    fontSize: 12, color: ThreadlyColors.warmWhiteSubtle,
    fontStyle: 'italic', letterSpacing: 0.5,
  },
});
