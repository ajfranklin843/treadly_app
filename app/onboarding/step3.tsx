/**
 * Threadly Onboarding — Step 3: Favorite Brands
 * User selects brands they love — used for deal tracking and style matching.
 */

import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { saveStyleProfile } from '@/lib/onboarding-store';
import { ThreadlyColors, ThreadlyRadius, ThreadlySpacing } from '@/constants/threadly';

const { width } = Dimensions.get('window');
const CARD_W = (width - ThreadlySpacing.screenPadding * 2 - 10 * 2) / 3;

const BRANDS = [
  { id: 'zara', name: 'ZARA', tier: 'Fast Fashion' },
  { id: 'hm', name: 'H&M', tier: 'Fast Fashion' },
  { id: 'aritzia', name: 'ARITZIA', tier: 'Contemporary' },
  { id: 'revolve', name: 'REVOLVE', tier: 'Contemporary' },
  { id: 'nordstrom', name: 'NORDSTROM', tier: 'Department' },
  { id: 'amazon', name: 'AMAZON', tier: 'Marketplace' },
  { id: 'target', name: 'TARGET', tier: 'Value' },
  { id: 'nike', name: 'NIKE', tier: 'Athletic' },
  { id: 'mango', name: 'MANGO', tier: 'Contemporary' },
  { id: 'aldo', name: 'ALDO', tier: 'Shoes' },
  { id: 'sephora', name: 'SEPHORA', tier: 'Beauty' },
  { id: 'free_people', name: 'FREE PEOPLE', tier: 'Boho' },
  { id: 'anthropologie', name: 'ANTHRO', tier: 'Lifestyle' },
  { id: 'lululemon', name: 'LULULEMON', tier: 'Athletic' },
  { id: 'cos', name: 'COS', tier: 'Minimal' },
  { id: 'madewell', name: 'MADEWELL', tier: 'Casual' },
  { id: 'abercrombie', name: 'ABERCROMBIE', tier: 'Casual' },
  { id: 'other', name: '+ OTHER', tier: 'Add yours' },
];

export default function Step3Brands() {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleNext = async () => {
    await saveStyleProfile({ favoriteBrands: selected });
    router.push('/onboarding/step4');
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0A0A0A', '#1A1A1A']} style={StyleSheet.absoluteFill} />

      <View style={styles.header}>
        <ProgressBar step={3} total={6} />
        <Text style={styles.stepLabel}>STEP 3 OF 6</Text>
        <Text style={styles.title}>Brands you love?</Text>
        <Text style={styles.subtitle}>Threadly will track deals and find pieces from your favorites first.</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      >
        {BRANDS.map(brand => {
          const isSelected = selected.includes(brand.id);
          return (
            <TouchableOpacity
              key={brand.id}
              style={[styles.brandCard, { width: CARD_W }, isSelected && styles.brandCardSelected]}
              activeOpacity={0.8}
              onPress={() => toggle(brand.id)}
            >
              {isSelected && (
                <LinearGradient
                  colors={['rgba(201,149,106,0.2)', 'rgba(201,149,106,0.05)']}
                  style={StyleSheet.absoluteFill}
                />
              )}
              <Text style={[styles.brandName, isSelected && styles.brandNameSelected]}>
                {brand.name}
              </Text>
              <Text style={styles.brandTier}>{brand.tier}</Text>
              {isSelected && (
                <View style={styles.checkDot}>
                  <Text style={styles.checkText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.selectedCount}>
          {selected.length > 0 ? `${selected.length} brand${selected.length > 1 ? 's' : ''} selected` : 'Select your favorites'}
        </Text>
        <TouchableOpacity
          style={styles.nextBtn}
          activeOpacity={0.85}
          onPress={handleNext}
        >
          <LinearGradient
            colors={[ThreadlyColors.roseGold, ThreadlyColors.roseGoldLight]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.nextBtnGradient}
          >
            <Text style={styles.nextBtnText}>Continue</Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNext} style={styles.skipBtn}>
          <Text style={styles.skipText}>Skip — I'll add later</Text>
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
    paddingBottom: 20,
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
  scroll: { flex: 1 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: ThreadlySpacing.screenPadding,
    gap: 10,
    paddingBottom: 24,
  },
  brandCard: {
    backgroundColor: ThreadlyColors.charcoal,
    borderRadius: ThreadlyRadius.lg,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: ThreadlyColors.charcoalLight,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 72,
    overflow: 'hidden',
    position: 'relative',
  },
  brandCardSelected: {
    borderColor: ThreadlyColors.roseGold,
    borderWidth: 1.5,
  },
  brandName: {
    fontSize: 11,
    fontWeight: '700',
    color: ThreadlyColors.warmWhiteMuted,
    letterSpacing: 0.8,
    textAlign: 'center',
    marginBottom: 4,
  },
  brandNameSelected: {
    color: ThreadlyColors.roseGoldLight,
  },
  brandTier: {
    fontSize: 9,
    color: ThreadlyColors.warmWhiteSubtle,
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  checkDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: ThreadlyColors.roseGold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkText: { fontSize: 9, color: ThreadlyColors.warmWhite, fontWeight: '700' },
  footer: {
    paddingHorizontal: ThreadlySpacing.screenPadding,
    paddingBottom: 40,
    paddingTop: 12,
    gap: 10,
  },
  selectedCount: {
    fontSize: 12,
    color: ThreadlyColors.roseGold,
    textAlign: 'center',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  nextBtn: { borderRadius: ThreadlyRadius.pill, overflow: 'hidden' },
  nextBtnGradient: { paddingVertical: 18, alignItems: 'center' },
  nextBtnText: { fontSize: 16, fontWeight: '700', color: ThreadlyColors.warmWhite, letterSpacing: 0.3 },
  skipBtn: { alignItems: 'center', paddingVertical: 8 },
  skipText: { fontSize: 13, color: ThreadlyColors.warmWhiteSubtle },
});
