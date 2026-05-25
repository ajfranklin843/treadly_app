/**
 * Threadly Onboarding — Step 5: Color + Aesthetic Preferences
 * Visual swatch grid with color palettes. Multi-select.
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

const COLOR_PALETTES = [
  { id: 'neutrals', label: 'Neutrals', sub: 'Beige, cream, sand, taupe', colors: ['#F5F0E8', '#E8DDD0', '#C8B89A', '#A89070'] },
  { id: 'monochrome', label: 'Monochrome', sub: 'Black, white, grey', colors: ['#0A0A0A', '#3A3A3A', '#888888', '#F5F5F5'] },
  { id: 'earth', label: 'Earth Tones', sub: 'Terracotta, rust, olive', colors: ['#C0614A', '#8B6914', '#5C6B2E', '#A0522D'] },
  { id: 'blush', label: 'Blush & Rose', sub: 'Pink, mauve, dusty rose', colors: ['#F2D4C8', '#E8A898', '#C87878', '#D4A0B0'] },
  { id: 'navy', label: 'Navy & Blue', sub: 'Classic, crisp, coastal', colors: ['#1A2A4A', '#2A4A8A', '#4A7AB8', '#8AB0D8'] },
  { id: 'jewel', label: 'Jewel Tones', sub: 'Emerald, sapphire, ruby', colors: ['#1A6A3A', '#1A3A8A', '#8A1A2A', '#6A1A8A'] },
  { id: 'pastels', label: 'Pastels', sub: 'Soft, dreamy, feminine', colors: ['#D8EAF0', '#F0D8E8', '#E8F0D8', '#F0EAD8'] },
  { id: 'bold', label: 'Bold & Bright', sub: 'Statement colors, vivid', colors: ['#FF4444', '#FF8800', '#FFCC00', '#00AA44'] },
];

export default function Step5Screen() {
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
    await saveStyleProfile({ colorPreferences: selected });
    router.push('/onboarding/step6');
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0A0A0A', '#111111']} style={StyleSheet.absoluteFill} />

      <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.progressRow}>
          {[1,2,3,4,5,6,7].map(i => (
            <View key={i} style={[styles.progressDot, i <= 5 && styles.progressDotActive]} />
          ))}
        </View>
        <Text style={styles.stepLabel}>STEP 5 OF 7</Text>
        <Text style={styles.headline}>Your color{'\n'}universe.</Text>
        <Text style={styles.subline}>We'll filter recommendations to your palette.</Text>
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
        {COLOR_PALETTES.map((palette) => {
          const isSelected = selected.includes(palette.id);
          return (
            <TouchableOpacity
              key={palette.id}
              style={[styles.card, isSelected && styles.cardSelected]}
              activeOpacity={0.85}
              onPress={() => toggle(palette.id)}
            >
              {isSelected && (
                <LinearGradient
                  colors={['rgba(201,149,106,0.12)', 'transparent']}
                  style={StyleSheet.absoluteFill}
                />
              )}
              {/* Swatch row */}
              <View style={styles.swatchRow}>
                {palette.colors.map((color, i) => (
                  <View key={i} style={[styles.swatch, { backgroundColor: color }]} />
                ))}
              </View>
              {/* Label */}
              <View style={styles.cardText}>
                <Text style={[styles.cardLabel, isSelected && styles.cardLabelSelected]}>{palette.label}</Text>
                <Text style={styles.cardSub}>{palette.sub}</Text>
              </View>
              {isSelected && (
                <View style={styles.checkBadge}>
                  <Text style={styles.checkText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
        <View style={{ height: 120 }} />
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
            {selected.length > 0 ? `Continue with ${selected.length} palette${selected.length > 1 ? 's' : ''}` : 'Select at least one'}
          </Text>
          {selected.length > 0 && <Text style={styles.ctaBtnArrow}>→</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: ThreadlyColors.black },
  header: { paddingHorizontal: ThreadlySpacing.screenPadding, paddingTop: 60, paddingBottom: 20 },
  progressRow: { flexDirection: 'row', gap: 5, marginBottom: 16 },
  progressDot: { flex: 1, height: 2, borderRadius: 1, backgroundColor: ThreadlyColors.charcoalLight },
  progressDotActive: { backgroundColor: ThreadlyColors.roseGold },
  stepLabel: { fontSize: 10, fontWeight: '700', color: ThreadlyColors.roseGold, letterSpacing: 2, marginBottom: 10 },
  headline: { fontSize: 36, fontFamily: 'Georgia', color: ThreadlyColors.warmWhite, lineHeight: 44, marginBottom: 8 },
  subline: { fontSize: 14, color: ThreadlyColors.warmWhiteMuted, fontStyle: 'italic' },
  list: { paddingHorizontal: ThreadlySpacing.screenPadding, gap: 10 },
  card: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    paddingVertical: 14, paddingHorizontal: 16,
    borderRadius: ThreadlyRadius.xl,
    backgroundColor: ThreadlyColors.charcoal,
    borderWidth: 1, borderColor: ThreadlyColors.charcoalLight,
    overflow: 'hidden', position: 'relative',
  },
  cardSelected: { borderColor: ThreadlyColors.roseGold },
  swatchRow: { flexDirection: 'row', gap: 3 },
  swatch: { width: 22, height: 44, borderRadius: 6 },
  cardText: { flex: 1 },
  cardLabel: { fontSize: 15, fontWeight: '700', color: ThreadlyColors.warmWhite, marginBottom: 2 },
  cardLabelSelected: { color: ThreadlyColors.roseGoldLight },
  cardSub: { fontSize: 11, color: ThreadlyColors.warmWhiteSubtle, fontStyle: 'italic' },
  checkBadge: {
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: ThreadlyColors.roseGold,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  checkText: { fontSize: 12, color: ThreadlyColors.black, fontWeight: '700' },
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
