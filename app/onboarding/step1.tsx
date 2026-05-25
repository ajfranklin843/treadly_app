/**
 * Threadly Onboarding — Step 1: Style Vibe
 * User selects their aesthetic identity from visual cards.
 */

import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { saveStyleProfile } from '@/lib/onboarding-store';
import { ThreadlyColors, ThreadlyRadius, ThreadlySpacing } from '@/constants/threadly';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - ThreadlySpacing.screenPadding * 2 - 12) / 2;

const STYLE_VIBES = [
  { id: 'minimal', label: 'Minimal', subtitle: 'Clean. Effortless.', emoji: '◻', color: '#2A2A2A' },
  { id: 'classic', label: 'Classic', subtitle: 'Timeless. Polished.', emoji: '◆', color: '#1E1A16' },
  { id: 'feminine', label: 'Feminine', subtitle: 'Soft. Romantic.', emoji: '◇', color: '#2A1A1A' },
  { id: 'streetwear', label: 'Streetwear', subtitle: 'Bold. Current.', emoji: '◈', color: '#141414' },
  { id: 'boho', label: 'Boho', subtitle: 'Free. Layered.', emoji: '◉', color: '#1E1A10' },
  { id: 'business', label: 'Business', subtitle: 'Sharp. Confident.', emoji: '◧', color: '#141820' },
  { id: 'edgy', label: 'Edgy', subtitle: 'Dark. Unexpected.', emoji: '◪', color: '#1A1014' },
  { id: 'preppy', label: 'Preppy', subtitle: 'Put-together.', emoji: '◫', color: '#101A1A' },
];

export default function Step1StyleVibe() {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleNext = async () => {
    await saveStyleProfile({ styleVibes: selected });
    router.push('/onboarding/step2');
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0A0A0A', '#1A1A1A']} style={StyleSheet.absoluteFill} />

      {/* Header */}
      <View style={styles.header}>
        <OnboardingProgress step={1} total={6} />
        <Text style={styles.stepLabel}>STEP 1 OF 6</Text>
        <Text style={styles.title}>What's your style?</Text>
        <Text style={styles.subtitle}>Select all that feel like you. Your AI stylist will learn your aesthetic.</Text>
      </View>

      {/* Style Cards Grid */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      >
        {STYLE_VIBES.map(vibe => {
          const isSelected = selected.includes(vibe.id);
          return (
            <TouchableOpacity
              key={vibe.id}
              style={[
                styles.card,
                { backgroundColor: vibe.color, width: CARD_WIDTH },
                isSelected && styles.cardSelected,
              ]}
              activeOpacity={0.8}
              onPress={() => toggle(vibe.id)}
            >
              {isSelected && (
                <LinearGradient
                  colors={['rgba(201,149,106,0.25)', 'rgba(201,149,106,0.05)']}
                  style={StyleSheet.absoluteFill}
                />
              )}
              <Text style={styles.cardEmoji}>{vibe.emoji}</Text>
              <Text style={[styles.cardLabel, isSelected && styles.cardLabelSelected]}>
                {vibe.label}
              </Text>
              <Text style={styles.cardSubtitle}>{vibe.subtitle}</Text>
              {isSelected && (
                <View style={styles.checkmark}>
                  <Text style={styles.checkmarkText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* CTA */}
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
            <Text style={[styles.nextBtnText, selected.length === 0 && styles.nextBtnTextDisabled]}>
              {selected.length > 0 ? `Continue (${selected.length} selected)` : 'Select at least one'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function OnboardingProgress({ step, total }: { step: number; total: number }) {
  return (
    <View style={progressStyles.container}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[
            progressStyles.dot,
            i < step ? progressStyles.dotActive : progressStyles.dotInactive,
          ]}
        />
      ))}
    </View>
  );
}

const progressStyles = StyleSheet.create({
  container: { flexDirection: 'row', gap: 6, marginBottom: 16 },
  dot: { height: 3, borderRadius: 2 },
  dotActive: { width: 24, backgroundColor: ThreadlyColors.roseGold },
  dotInactive: { width: 12, backgroundColor: ThreadlyColors.charcoalLight },
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
  card: {
    borderRadius: ThreadlyRadius.xl,
    padding: 20,
    minHeight: 120,
    justifyContent: 'flex-end',
    borderWidth: 1,
    borderColor: ThreadlyColors.charcoalLight,
    overflow: 'hidden',
    position: 'relative',
  },
  cardSelected: {
    borderColor: ThreadlyColors.roseGold,
    borderWidth: 1.5,
  },
  cardEmoji: {
    fontSize: 20,
    color: ThreadlyColors.roseGoldDim,
    marginBottom: 8,
  },
  cardLabel: {
    fontSize: 16,
    fontFamily: 'Georgia',
    color: ThreadlyColors.warmWhite,
    fontWeight: '400',
    marginBottom: 2,
  },
  cardLabelSelected: {
    color: ThreadlyColors.roseGoldLight,
  },
  cardSubtitle: {
    fontSize: 11,
    color: ThreadlyColors.warmWhiteSubtle,
    letterSpacing: 0.3,
  },
  checkmark: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: ThreadlyColors.roseGold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: { fontSize: 11, color: ThreadlyColors.warmWhite, fontWeight: '700' },
  footer: {
    paddingHorizontal: ThreadlySpacing.screenPadding,
    paddingBottom: 40,
    paddingTop: 16,
  },
  nextBtn: { borderRadius: ThreadlyRadius.pill, overflow: 'hidden' },
  nextBtnDisabled: { opacity: 0.6 },
  nextBtnGradient: { paddingVertical: 18, alignItems: 'center' },
  nextBtnText: { fontSize: 16, fontWeight: '700', color: ThreadlyColors.warmWhite, letterSpacing: 0.3 },
  nextBtnTextDisabled: { color: ThreadlyColors.warmWhiteSubtle },
});
