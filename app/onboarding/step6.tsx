/**
 * Threadly Onboarding — Step 6: Closet Size + Final Setup
 * User indicates closet size and triggers the AI profile build.
 */

import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { saveStyleProfile, completeOnboarding } from '@/lib/onboarding-store';
import { ThreadlyColors, ThreadlyRadius, ThreadlySpacing } from '@/constants/threadly';

const CLOSET_SIZES = [
  { id: 'small', label: 'Minimal', items: '< 30 items', icon: '◻' },
  { id: 'medium', label: 'Average', items: '30 – 80 items', icon: '◈' },
  { id: 'large', label: 'Full Closet', items: '80 – 150 items', icon: '◆' },
  { id: 'xl', label: 'Wardrobe Queen', items: '150+ items', icon: '◉' },
];

export default function Step6Closet() {
  const [selected, setSelected] = useState<string>('medium');
  const [isBuilding, setIsBuilding] = useState(false);

  const handleFinish = async () => {
    setIsBuilding(true);
    const opt = CLOSET_SIZES.find(o => o.id === selected)!;
    await saveStyleProfile({ closetSize: opt.id });

    // Simulate AI profile building
    await new Promise(resolve => setTimeout(resolve, 2200));
    await completeOnboarding();
    router.replace('/(tabs)');
  };

  if (isBuilding) {
    return <BuildingScreen />;
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0A0A0A', '#1A1A1A']} style={StyleSheet.absoluteFill} />

      <View style={styles.header}>
        <ProgressBar step={6} total={6} />
        <Text style={styles.stepLabel}>STEP 6 OF 6</Text>
        <Text style={styles.title}>How big is your closet?</Text>
        <Text style={styles.subtitle}>This helps your AI stylist understand how many looks it can build for you.</Text>
      </View>

      <View style={styles.optionsContainer}>
        {CLOSET_SIZES.map(opt => {
          const isSelected = selected === opt.id;
          return (
            <TouchableOpacity
              key={opt.id}
              style={[styles.optionCard, isSelected && styles.optionCardSelected]}
              activeOpacity={0.8}
              onPress={() => setSelected(opt.id)}
            >
              {isSelected && (
                <LinearGradient
                  colors={['rgba(201,149,106,0.15)', 'rgba(201,149,106,0.03)']}
                  style={StyleSheet.absoluteFill}
                />
              )}
              <Text style={styles.optionIcon}>{opt.icon}</Text>
              <View style={styles.optionText}>
                <Text style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>
                  {opt.label}
                </Text>
                <Text style={styles.optionItems}>{opt.items}</Text>
              </View>
              <View style={isSelected ? styles.radioSelected : styles.radioEmpty}>
                {isSelected && <View style={styles.radioDot} />}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Summary card */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Your AI stylist is almost ready</Text>
        <Text style={styles.summaryText}>
          Tap below to build your personalized style profile. It takes just a moment.
        </Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.finishBtn} activeOpacity={0.85} onPress={handleFinish}>
          <LinearGradient
            colors={[ThreadlyColors.roseGold, ThreadlyColors.roseGoldLight]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.finishBtnGradient}
          >
            <Text style={styles.finishBtnText}>Build My Style Profile ✦</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function BuildingScreen() {
  return (
    <View style={buildStyles.container}>
      <LinearGradient colors={['#0A0A0A', '#1A1A1A']} style={StyleSheet.absoluteFill} />
      <View style={buildStyles.content}>
        <Text style={buildStyles.logo}>T</Text>
        <Text style={buildStyles.title}>Building your style profile...</Text>
        <Text style={buildStyles.subtitle}>Your AI stylist is learning your aesthetic.</Text>
        <View style={buildStyles.steps}>
          {[
            'Analyzing your style vibes',
            'Mapping your occasions',
            'Calibrating brand preferences',
            'Setting your budget intelligence',
            'Activating your AI stylist',
          ].map((step, i) => (
            <View key={i} style={buildStyles.stepRow}>
              <Text style={buildStyles.stepCheck}>✓</Text>
              <Text style={buildStyles.stepText}>{step}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

function ProgressBar({ step, total }: { step: number; total: number }) {
  return (
    <View style={pb.container}>
      {Array.from({ length: total }).map((_, i) => (
        <View key={i} style={[pb.dot, i < step ? pb.active : pb.inactive]} />
      ))}
    </View>
  );
}

const pb = StyleSheet.create({
  container: { flexDirection: 'row', gap: 6, marginBottom: 16 },
  dot: { height: 3, borderRadius: 2 },
  active: { width: 24, backgroundColor: ThreadlyColors.roseGold },
  inactive: { width: 12, backgroundColor: ThreadlyColors.charcoalLight },
});

const buildStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: ThreadlyColors.black },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  logo: {
    fontSize: 72,
    fontFamily: 'Georgia',
    color: ThreadlyColors.roseGold,
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Georgia',
    color: ThreadlyColors.warmWhite,
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 30,
  },
  subtitle: {
    fontSize: 14,
    color: ThreadlyColors.warmWhiteMuted,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 20,
  },
  steps: { gap: 12, width: '100%' },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  stepCheck: { fontSize: 12, color: ThreadlyColors.roseGold, width: 16 },
  stepText: { fontSize: 14, color: ThreadlyColors.warmWhiteMuted },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: ThreadlyColors.black },
  header: {
    paddingHorizontal: ThreadlySpacing.screenPadding,
    paddingTop: 60,
    paddingBottom: 24,
  },
  stepLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: ThreadlyColors.roseGold,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Georgia',
    color: ThreadlyColors.warmWhite,
    marginBottom: 8,
    lineHeight: 38,
  },
  subtitle: {
    fontSize: 14,
    color: ThreadlyColors.warmWhiteMuted,
    lineHeight: 20,
  },
  optionsContainer: {
    paddingHorizontal: ThreadlySpacing.screenPadding,
    gap: 10,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ThreadlyColors.charcoal,
    borderRadius: ThreadlyRadius.xl,
    padding: 18,
    borderWidth: 1,
    borderColor: ThreadlyColors.charcoalLight,
    overflow: 'hidden',
    position: 'relative',
    gap: 14,
  },
  optionCardSelected: {
    borderColor: ThreadlyColors.roseGold,
    borderWidth: 1.5,
  },
  optionIcon: { fontSize: 18, color: ThreadlyColors.roseGoldDim },
  optionText: { flex: 1 },
  optionLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: ThreadlyColors.warmWhite,
    marginBottom: 2,
  },
  optionLabelSelected: { color: ThreadlyColors.roseGoldLight },
  optionItems: { fontSize: 12, color: ThreadlyColors.warmWhiteSubtle },
  radioEmpty: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: ThreadlyColors.charcoalLight,
  },
  radioSelected: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: ThreadlyColors.roseGold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: ThreadlyColors.roseGold,
  },
  summaryCard: {
    marginHorizontal: ThreadlySpacing.screenPadding,
    marginTop: 20,
    backgroundColor: ThreadlyColors.blushDark,
    borderRadius: ThreadlyRadius.lg,
    padding: 18,
    borderWidth: 1,
    borderColor: ThreadlyColors.roseGoldDim,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: ThreadlyColors.roseGoldLight,
    marginBottom: 6,
  },
  summaryText: {
    fontSize: 13,
    color: ThreadlyColors.warmWhiteMuted,
    lineHeight: 19,
  },
  footer: {
    paddingHorizontal: ThreadlySpacing.screenPadding,
    paddingBottom: 40,
    paddingTop: 20,
  },
  finishBtn: { borderRadius: ThreadlyRadius.pill, overflow: 'hidden' },
  finishBtnGradient: { paddingVertical: 18, alignItems: 'center' },
  finishBtnText: { fontSize: 16, fontWeight: '700', color: ThreadlyColors.warmWhite, letterSpacing: 0.3 },
});
