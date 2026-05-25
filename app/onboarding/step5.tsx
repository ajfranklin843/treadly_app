/**
 * Threadly Onboarding — Step 5: Color Preferences
 * User selects their go-to color palette.
 */

import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { saveStyleProfile } from '@/lib/onboarding-store';
import { ThreadlyColors, ThreadlyRadius, ThreadlySpacing } from '@/constants/threadly';

const { width } = Dimensions.get('window');
const SWATCH_SIZE = (width - ThreadlySpacing.screenPadding * 2 - 12 * 3) / 4;

const COLORS = [
  { id: 'black', label: 'Black', hex: '#0A0A0A', border: '#333' },
  { id: 'white', label: 'White', hex: '#F5F5F0', border: '#555' },
  { id: 'neutral', label: 'Neutral', hex: '#C4A882', border: '#B09060' },
  { id: 'blush', label: 'Blush', hex: '#F2C4B0', border: '#D4A090' },
  { id: 'camel', label: 'Camel', hex: '#C19A6B', border: '#A07845' },
  { id: 'navy', label: 'Navy', hex: '#1A2A4A', border: '#2A3A5A' },
  { id: 'burgundy', label: 'Burgundy', hex: '#6B1A2A', border: '#8B2A3A' },
  { id: 'green', label: 'Olive', hex: '#4A5A2A', border: '#5A6A3A' },
  { id: 'brown', label: 'Brown', hex: '#5A3A1A', border: '#6A4A2A' },
  { id: 'grey', label: 'Grey', hex: '#6A6A6A', border: '#7A7A7A' },
  { id: 'cobalt', label: 'Cobalt', hex: '#1A3A8A', border: '#2A4A9A' },
  { id: 'rust', label: 'Rust', hex: '#B04A1A', border: '#C05A2A' },
];

export default function Step5Colors() {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleNext = async () => {
    await saveStyleProfile({ colorPreferences: selected });
    router.push('/onboarding/step6');
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0A0A0A', '#1A1A1A']} style={StyleSheet.absoluteFill} />

      <View style={styles.header}>
        <ProgressBar step={5} total={6} />
        <Text style={styles.stepLabel}>STEP 5 OF 6</Text>
        <Text style={styles.title}>Your color palette?</Text>
        <Text style={styles.subtitle}>Your AI stylist will build looks around colors you actually wear.</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      >
        {COLORS.map(color => {
          const isSelected = selected.includes(color.id);
          return (
            <TouchableOpacity
              key={color.id}
              style={[styles.swatchContainer, { width: SWATCH_SIZE }]}
              activeOpacity={0.8}
              onPress={() => toggle(color.id)}
            >
              <View
                style={[
                  styles.swatch,
                  { backgroundColor: color.hex, borderColor: color.border },
                  isSelected && styles.swatchSelected,
                ]}
              >
                {isSelected && (
                  <View style={styles.swatchCheck}>
                    <Text style={styles.swatchCheckText}>✓</Text>
                  </View>
                )}
              </View>
              <Text style={[styles.swatchLabel, isSelected && styles.swatchLabelSelected]}>
                {color.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

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
        <TouchableOpacity onPress={handleNext} style={styles.skipBtn}>
          <Text style={styles.skipText}>Skip for now</Text>
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
  scroll: { flex: 1 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: ThreadlySpacing.screenPadding,
    gap: 12,
    paddingBottom: 24,
  },
  swatchContainer: {
    alignItems: 'center',
    gap: 6,
  },
  swatch: {
    width: SWATCH_SIZE,
    height: SWATCH_SIZE,
    borderRadius: ThreadlyRadius.lg,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  swatchSelected: {
    borderColor: ThreadlyColors.roseGold,
    borderWidth: 2.5,
  },
  swatchCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  swatchCheckText: { fontSize: 12, color: ThreadlyColors.warmWhite, fontWeight: '700' },
  swatchLabel: {
    fontSize: 11,
    color: ThreadlyColors.warmWhiteSubtle,
    textAlign: 'center',
  },
  swatchLabelSelected: { color: ThreadlyColors.roseGoldLight },
  footer: {
    paddingHorizontal: ThreadlySpacing.screenPadding,
    paddingBottom: 40,
    paddingTop: 16,
    gap: 10,
  },
  nextBtn: { borderRadius: ThreadlyRadius.pill, overflow: 'hidden' },
  nextBtnGradient: { paddingVertical: 18, alignItems: 'center' },
  nextBtnText: { fontSize: 16, fontWeight: '700', color: ThreadlyColors.warmWhite, letterSpacing: 0.3 },
  skipBtn: { alignItems: 'center', paddingVertical: 8 },
  skipText: { fontSize: 13, color: ThreadlyColors.warmWhiteSubtle },
});
