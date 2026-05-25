/**
 * Threadly Onboarding — Step 4: Occasions
 * Chip grid with icons. Multi-select.
 */

import { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Dimensions, Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { saveStyleProfile } from '@/lib/onboarding-store';
import { ThreadlyColors, ThreadlySpacing, ThreadlyRadius } from '@/constants/threadly';

const { width } = Dimensions.get('window');

const OCCASIONS = [
  { id: 'work', label: 'Work', icon: '💼', sub: 'Office & meetings' },
  { id: 'date-night', label: 'Date Night', icon: '✨', sub: 'Romantic & elevated' },
  { id: 'casual', label: 'Casual', icon: '☀️', sub: 'Everyday comfort' },
  { id: 'vacation', label: 'Vacation', icon: '🌊', sub: 'Travel & resort' },
  { id: 'events', label: 'Events', icon: '🥂', sub: 'Parties & galas' },
  { id: 'church', label: 'Church', icon: '🌿', sub: 'Modest & polished' },
  { id: 'gym', label: 'Gym', icon: '🏃‍♀️', sub: 'Activewear' },
  { id: 'brunch', label: 'Brunch', icon: '🌸', sub: 'Weekend social' },
  { id: 'travel', label: 'Travel', icon: '✈️', sub: 'Airport & transit' },
  { id: 'wedding', label: 'Wedding Guest', icon: '💐', sub: 'Formal occasions' },
  { id: 'creative', label: 'Creative Work', icon: '🎨', sub: 'Studio & freelance' },
  { id: 'nightout', label: 'Night Out', icon: '🌙', sub: 'Clubs & bars' },
];

export default function Step4Screen() {
  const [selected, setSelected] = useState<string[]>([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  const toggle = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const handleNext = async () => {
    await saveStyleProfile({ occasions: selected });
    router.push('/onboarding/step5');
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0A0A0A', '#111111']} style={StyleSheet.absoluteFill} />

      <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.progressRow}>
          {[1,2,3,4,5,6,7].map(i => (
            <View key={i} style={[styles.progressDot, i <= 4 && styles.progressDotActive]} />
          ))}
        </View>
        <Text style={styles.stepLabel}>STEP 4 OF 7</Text>
        <Text style={styles.headline}>Where are you{'\n'}getting dressed?</Text>
        <Text style={styles.subline}>We'll build looks for the moments that matter most.</Text>
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.grid}>
        {OCCASIONS.map((occ) => {
          const isSelected = selected.includes(occ.id);
          return (
            <TouchableOpacity
              key={occ.id}
              style={[styles.card, isSelected && styles.cardSelected]}
              activeOpacity={0.85}
              onPress={() => toggle(occ.id)}
            >
              {isSelected && (
                <LinearGradient
                  colors={['rgba(201,149,106,0.18)', 'rgba(201,149,106,0.06)']}
                  style={StyleSheet.absoluteFill}
                />
              )}
              <Text style={styles.cardIcon}>{occ.icon}</Text>
              <Text style={[styles.cardLabel, isSelected && styles.cardLabelSelected]}>{occ.label}</Text>
              <Text style={styles.cardSub}>{occ.sub}</Text>
              {isSelected && (
                <View style={styles.checkDot}>
                  <Text style={styles.checkText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
        <View style={{ height: 120, width: '100%' }} />
      </ScrollView>

      <View style={styles.ctaWrap}>
        <LinearGradient colors={['transparent', 'rgba(10,10,10,0.98)']} style={StyleSheet.absoluteFill} />
        <TouchableOpacity
          style={[styles.ctaBtn, selected.length === 0 && styles.ctaBtnDisabled]}
          activeOpacity={0.88}
          onPress={handleNext}
          disabled={selected.length === 0}
        >
          <LinearGradient
            colors={selected.length > 0 ? [ThreadlyColors.roseGold, ThreadlyColors.roseGoldLight] : [ThreadlyColors.charcoal, ThreadlyColors.charcoal]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
          <Text style={[styles.ctaBtnText, selected.length === 0 && styles.ctaBtnTextDisabled]}>
            {selected.length > 0 ? `Continue — ${selected.length} occasion${selected.length > 1 ? 's' : ''}` : 'Select at least one'}
          </Text>
          {selected.length > 0 && <Text style={styles.ctaBtnArrow}>→</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const CARD_W = (width - ThreadlySpacing.screenPadding * 2 - 10 * 2) / 3;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: ThreadlyColors.black },
  header: { paddingHorizontal: ThreadlySpacing.screenPadding, paddingTop: 60, paddingBottom: 20 },
  progressRow: { flexDirection: 'row', gap: 5, marginBottom: 16 },
  progressDot: { flex: 1, height: 2, borderRadius: 1, backgroundColor: ThreadlyColors.charcoalLight },
  progressDotActive: { backgroundColor: ThreadlyColors.roseGold },
  stepLabel: { fontSize: 10, fontWeight: '700', color: ThreadlyColors.roseGold, letterSpacing: 2, marginBottom: 10 },
  headline: { fontSize: 36, fontFamily: 'Georgia', color: ThreadlyColors.warmWhite, lineHeight: 44, marginBottom: 8 },
  subline: { fontSize: 14, color: ThreadlyColors.warmWhiteMuted, fontStyle: 'italic' },
  grid: {
    flexDirection: 'row', flexWrap: 'wrap',
    paddingHorizontal: ThreadlySpacing.screenPadding, gap: 10,
  },
  card: {
    width: CARD_W, paddingVertical: 16, paddingHorizontal: 8,
    borderRadius: ThreadlyRadius.xl,
    backgroundColor: ThreadlyColors.charcoal,
    borderWidth: 1, borderColor: ThreadlyColors.charcoalLight,
    alignItems: 'center', gap: 6, position: 'relative', overflow: 'hidden',
  },
  cardSelected: { borderColor: ThreadlyColors.roseGold },
  cardIcon: { fontSize: 24 },
  cardLabel: { fontSize: 12, fontWeight: '700', color: ThreadlyColors.warmWhite, textAlign: 'center' },
  cardLabelSelected: { color: ThreadlyColors.roseGoldLight },
  cardSub: { fontSize: 9, color: ThreadlyColors.warmWhiteSubtle, textAlign: 'center' },
  checkDot: {
    position: 'absolute', top: 6, right: 6,
    width: 16, height: 16, borderRadius: 8,
    backgroundColor: ThreadlyColors.roseGold,
    alignItems: 'center', justifyContent: 'center',
  },
  checkText: { fontSize: 9, color: ThreadlyColors.black, fontWeight: '700' },
  ctaWrap: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingHorizontal: ThreadlySpacing.screenPadding,
    paddingBottom: 44, paddingTop: 40, overflow: 'hidden',
  },
  ctaBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 18, borderRadius: ThreadlyRadius.xl, overflow: 'hidden', gap: 10,
  },
  ctaBtnDisabled: { opacity: 0.6 },
  ctaBtnText: { fontSize: 16, fontWeight: '700', color: ThreadlyColors.black },
  ctaBtnTextDisabled: { color: ThreadlyColors.warmWhiteSubtle },
  ctaBtnArrow: { fontSize: 18, color: ThreadlyColors.black, fontWeight: '700' },
});
