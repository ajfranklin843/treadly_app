/**
 * Threadly Onboarding — Step 2: Occasions
 * User selects which occasions they dress for.
 */

import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { saveStyleProfile } from '@/lib/onboarding-store';
import { ThreadlyColors, ThreadlyRadius, ThreadlySpacing } from '@/constants/threadly';

const OCCASIONS = [
  { id: 'work', label: 'Work', icon: '💼', desc: 'Office & meetings' },
  { id: 'casual', label: 'Casual', icon: '☕', desc: 'Everyday errands' },
  { id: 'date_night', label: 'Date Night', icon: '♡', desc: 'Evenings out' },
  { id: 'party', label: 'Party', icon: '✦', desc: 'Celebrations' },
  { id: 'vacation', label: 'Vacation', icon: '✈', desc: 'Travel & resort' },
  { id: 'school', label: 'School', icon: '◈', desc: 'Campus & classes' },
  { id: 'church', label: 'Church', icon: '◇', desc: 'Sunday best' },
  { id: 'gym', label: 'Active', icon: '◉', desc: 'Gym & outdoors' },
  { id: 'brunch', label: 'Brunch', icon: '◆', desc: 'Weekend social' },
  { id: 'formal', label: 'Formal', icon: '◧', desc: 'Galas & events' },
];

export default function Step2Occasions() {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleNext = async () => {
    await saveStyleProfile({ occasions: selected });
    router.push('/onboarding/step3');
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0A0A0A', '#1A1A1A']} style={StyleSheet.absoluteFill} />

      <View style={styles.header}>
        <ProgressBar step={2} total={6} />
        <Text style={styles.stepLabel}>STEP 2 OF 6</Text>
        <Text style={styles.title}>Where do you dress up?</Text>
        <Text style={styles.subtitle}>Your AI stylist will build looks for every moment in your life.</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      >
        {OCCASIONS.map(occ => {
          const isSelected = selected.includes(occ.id);
          return (
            <TouchableOpacity
              key={occ.id}
              style={[styles.chip, isSelected && styles.chipSelected]}
              activeOpacity={0.8}
              onPress={() => toggle(occ.id)}
            >
              {isSelected && (
                <LinearGradient
                  colors={['rgba(201,149,106,0.2)', 'rgba(201,149,106,0.05)']}
                  style={StyleSheet.absoluteFill}
                />
              )}
              <Text style={styles.chipIcon}>{occ.icon}</Text>
              <View style={styles.chipTextGroup}>
                <Text style={[styles.chipLabel, isSelected && styles.chipLabelSelected]}>
                  {occ.label}
                </Text>
                <Text style={styles.chipDesc}>{occ.desc}</Text>
              </View>
              {isSelected && <Text style={styles.chipCheck}>✓</Text>}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.nextBtn, selected.length === 0 && styles.nextBtnDisabled]}
          activeOpacity={0.85}
          onPress={handleNext}
          disabled={selected.length === 0}
        >
          <LinearGradient
            colors={selected.length > 0
              ? [ThreadlyColors.roseGold, ThreadlyColors.roseGoldLight]
              : ['#2A2A2A', '#2A2A2A']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.nextBtnGradient}
          >
            <Text style={styles.nextBtnText}>
              {selected.length > 0 ? 'Continue' : 'Select at least one'}
            </Text>
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
    paddingHorizontal: ThreadlySpacing.screenPadding,
    gap: 10,
    paddingBottom: 24,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ThreadlyColors.charcoal,
    borderRadius: ThreadlyRadius.lg,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: ThreadlyColors.charcoalLight,
    gap: 14,
    overflow: 'hidden',
    position: 'relative',
  },
  chipSelected: {
    borderColor: ThreadlyColors.roseGold,
    borderWidth: 1.5,
  },
  chipIcon: { fontSize: 18 },
  chipTextGroup: { flex: 1 },
  chipLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: ThreadlyColors.warmWhite,
    marginBottom: 2,
  },
  chipLabelSelected: { color: ThreadlyColors.roseGoldLight },
  chipDesc: {
    fontSize: 12,
    color: ThreadlyColors.warmWhiteSubtle,
  },
  chipCheck: {
    fontSize: 14,
    color: ThreadlyColors.roseGold,
    fontWeight: '700',
  },
  footer: {
    paddingHorizontal: ThreadlySpacing.screenPadding,
    paddingBottom: 40,
    paddingTop: 16,
    gap: 10,
  },
  nextBtn: { borderRadius: ThreadlyRadius.pill, overflow: 'hidden' },
  nextBtnDisabled: { opacity: 0.6 },
  nextBtnGradient: { paddingVertical: 18, alignItems: 'center' },
  nextBtnText: { fontSize: 16, fontWeight: '700', color: ThreadlyColors.warmWhite, letterSpacing: 0.3 },
  skipBtn: { alignItems: 'center', paddingVertical: 8 },
  skipText: { fontSize: 13, color: ThreadlyColors.warmWhiteSubtle },
});
