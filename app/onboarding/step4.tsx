/**
 * Threadly Onboarding — Step 4: Budget Range
 * User sets their typical shopping budget per outfit/item.
 */

import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { saveStyleProfile } from '@/lib/onboarding-store';
import { ThreadlyColors, ThreadlyRadius, ThreadlySpacing } from '@/constants/threadly';

const BUDGET_OPTIONS = [
  { id: 'budget', label: 'Budget Savvy', range: '$25 – $75', min: 25, max: 75, desc: 'Great finds, smart prices' },
  { id: 'mid', label: 'Mid-Range', range: '$75 – $150', min: 75, max: 150, desc: 'Quality pieces, good value' },
  { id: 'premium', label: 'Premium', range: '$150 – $300', min: 150, max: 300, desc: 'Investment pieces' },
  { id: 'luxury', label: 'Luxury', range: '$300+', min: 300, max: 1000, desc: 'No limits on quality' },
];

export default function Step4Budget() {
  const [selected, setSelected] = useState<string>('mid');

  const handleNext = async () => {
    const opt = BUDGET_OPTIONS.find(o => o.id === selected)!;
    await saveStyleProfile({ budgetMin: opt.min, budgetMax: opt.max });
    router.push('/onboarding/step5');
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0A0A0A', '#1A1A1A']} style={StyleSheet.absoluteFill} />

      <View style={styles.header}>
        <ProgressBar step={4} total={6} />
        <Text style={styles.stepLabel}>STEP 4 OF 6</Text>
        <Text style={styles.title}>What's your budget?</Text>
        <Text style={styles.subtitle}>Your AI stylist will always find the best deals within your range.</Text>
      </View>

      <View style={styles.optionsContainer}>
        {BUDGET_OPTIONS.map(opt => {
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
              <View style={styles.optionLeft}>
                <Text style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>
                  {opt.label}
                </Text>
                <Text style={styles.optionDesc}>{opt.desc}</Text>
              </View>
              <View style={styles.optionRight}>
                <Text style={[styles.optionRange, isSelected && styles.optionRangeSelected]}>
                  {opt.range}
                </Text>
                {isSelected && (
                  <View style={styles.radioSelected}>
                    <View style={styles.radioDot} />
                  </View>
                )}
                {!isSelected && <View style={styles.radioEmpty} />}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.insightCard}>
        <Text style={styles.insightIcon}>✦</Text>
        <Text style={styles.insightText}>
          Threadly finds deals up to 60% off your favorite brands — so your budget goes further.
        </Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.nextBtn} activeOpacity={0.85} onPress={handleNext}>
          <LinearGradient
            colors={[ThreadlyColors.roseGold, ThreadlyColors.roseGoldLight]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.nextBtnGradient}
          >
            <Text style={styles.nextBtnText}>Continue</Text>
          </LinearGradient>
        </TouchableOpacity>
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
    flex: 1,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ThreadlyColors.charcoal,
    borderRadius: ThreadlyRadius.xl,
    padding: 20,
    borderWidth: 1,
    borderColor: ThreadlyColors.charcoalLight,
    overflow: 'hidden',
    position: 'relative',
  },
  optionCardSelected: {
    borderColor: ThreadlyColors.roseGold,
    borderWidth: 1.5,
  },
  optionLeft: { flex: 1 },
  optionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: ThreadlyColors.warmWhite,
    marginBottom: 4,
  },
  optionLabelSelected: { color: ThreadlyColors.roseGoldLight },
  optionDesc: {
    fontSize: 12,
    color: ThreadlyColors.warmWhiteSubtle,
  },
  optionRight: {
    alignItems: 'flex-end',
    gap: 8,
  },
  optionRange: {
    fontSize: 14,
    fontWeight: '700',
    color: ThreadlyColors.warmWhiteMuted,
  },
  optionRangeSelected: { color: ThreadlyColors.roseGold },
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
  insightCard: {
    marginHorizontal: ThreadlySpacing.screenPadding,
    marginTop: 16,
    backgroundColor: ThreadlyColors.blushDark,
    borderRadius: ThreadlyRadius.lg,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    borderWidth: 1,
    borderColor: ThreadlyColors.roseGoldDim,
  },
  insightIcon: { fontSize: 12, color: ThreadlyColors.roseGold, marginTop: 2 },
  insightText: {
    flex: 1,
    fontSize: 13,
    color: ThreadlyColors.roseGoldLight,
    lineHeight: 19,
  },
  footer: {
    paddingHorizontal: ThreadlySpacing.screenPadding,
    paddingBottom: 40,
    paddingTop: 20,
  },
  nextBtn: { borderRadius: ThreadlyRadius.pill, overflow: 'hidden' },
  nextBtnGradient: { paddingVertical: 18, alignItems: 'center' },
  nextBtnText: { fontSize: 16, fontWeight: '700', color: ThreadlyColors.warmWhite, letterSpacing: 0.3 },
});
