/**
 * Threadly Onboarding — Step 3: Shopping Personality
 * 4 editorial archetype cards. Single select.
 */

import { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Dimensions, Image, Animated, ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { saveStyleProfile } from '@/lib/onboarding-store';
import { ThreadlyColors, ThreadlySpacing, ThreadlyRadius } from '@/constants/threadly';

const { width } = Dimensions.get('window');

const PERSONALITIES = [
  {
    id: 'budget-smart',
    title: 'Budget Smart',
    tagline: 'I want to look expensive without spending it.',
    traits: ['Deal hunter', 'Dupes queen', 'Smart swaps'],
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80',
    accent: '#5DBF8A',
  },
  {
    id: 'trend-first',
    title: 'Trend First',
    tagline: 'I want to wear what\'s happening right now.',
    traits: ['Early adopter', 'Seasonal refresh', 'Viral pieces'],
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    accent: '#C9956A',
  },
  {
    id: 'investment-buyer',
    title: 'Investment Buyer',
    tagline: 'I buy less, but I buy better.',
    traits: ['Quality over quantity', 'Timeless pieces', 'Cost-per-wear'],
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80',
    accent: '#C8B89A',
  },
  {
    id: 'closet-maximizer',
    title: 'Closet Maximizer',
    tagline: 'I want to get more out of what I already own.',
    traits: ['Outfit remixer', 'Capsule builder', 'Versatility seeker'],
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&q=80',
    accent: '#E8B89A',
  },
];

export default function Step3Screen() {
  const [selected, setSelected] = useState<string | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleNext = async () => {
    if (!selected) return;
    // Store as a style vibe extension
    router.push('/onboarding/step4');
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0A0A0A', '#111111']} style={StyleSheet.absoluteFill} />

      <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.progressRow}>
          {[1,2,3,4,5,6,7].map(i => (
            <View key={i} style={[styles.progressDot, i <= 3 && styles.progressDotActive]} />
          ))}
        </View>
        <Text style={styles.stepLabel}>STEP 3 OF 7</Text>
        <Text style={styles.headline}>How do you{'\n'}shop?</Text>
        <Text style={styles.subline}>Your shopping personality shapes every recommendation.</Text>
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.cardList}>
        {PERSONALITIES.map((p) => {
          const isSelected = selected === p.id;
          return (
            <TouchableOpacity
              key={p.id}
              style={[styles.card, isSelected && styles.cardSelected]}
              activeOpacity={0.88}
              onPress={() => setSelected(p.id)}
            >
              <Image source={{ uri: p.image }} style={styles.cardImage} resizeMode="cover" />
              <LinearGradient
                colors={['transparent', 'rgba(10,10,10,0.92)']}
                style={StyleSheet.absoluteFill}
              />
              {isSelected && (
                <View style={[styles.selectedOverlay, { borderColor: p.accent }]}>
                  <LinearGradient
                    colors={[`${p.accent}20`, 'transparent']}
                    style={StyleSheet.absoluteFill}
                  />
                </View>
              )}
              <View style={styles.cardContent}>
                <View style={styles.cardTop}>
                  <View>
                    <Text style={styles.cardTitle}>{p.title}</Text>
                    <Text style={styles.cardTagline}>{p.tagline}</Text>
                  </View>
                  {isSelected && (
                    <View style={[styles.checkBadge, { backgroundColor: p.accent }]}>
                      <Text style={styles.checkText}>✓</Text>
                    </View>
                  )}
                </View>
                <View style={styles.traitRow}>
                  {p.traits.map(t => (
                    <View key={t} style={[styles.traitPill, isSelected && { borderColor: `${p.accent}60` }]}>
                      <Text style={[styles.traitText, isSelected && { color: p.accent }]}>{t}</Text>
                    </View>
                  ))}
                </View>
              </View>
              {isSelected && <View style={[styles.topAccentBar, { backgroundColor: p.accent }]} />}
            </TouchableOpacity>
          );
        })}
        <View style={{ height: 120 }} />
      </ScrollView>

      <View style={styles.ctaWrap}>
        <LinearGradient colors={['transparent', 'rgba(10,10,10,0.98)']} style={StyleSheet.absoluteFill} />
        <TouchableOpacity
          style={[styles.ctaBtn, !selected && styles.ctaBtnDisabled]}
          activeOpacity={0.88}
          onPress={handleNext}
          disabled={!selected}
        >
          <LinearGradient
            colors={selected ? [ThreadlyColors.roseGold, ThreadlyColors.roseGoldLight] : [ThreadlyColors.charcoal, ThreadlyColors.charcoal]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
          <Text style={[styles.ctaBtnText, !selected && styles.ctaBtnTextDisabled]}>
            {selected ? 'Continue' : 'Choose your style'}
          </Text>
          {selected && <Text style={styles.ctaBtnArrow}>→</Text>}
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
  cardList: { paddingHorizontal: ThreadlySpacing.screenPadding, gap: 12 },
  card: {
    height: 160, borderRadius: ThreadlyRadius.xl,
    overflow: 'hidden', borderWidth: 1,
    borderColor: ThreadlyColors.charcoalLight, position: 'relative',
  },
  cardSelected: { borderColor: 'transparent' },
  cardImage: { ...StyleSheet.absoluteFillObject },
  selectedOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 2, borderRadius: ThreadlyRadius.xl, overflow: 'hidden',
  },
  cardContent: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: 16, gap: 10,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cardTitle: { fontSize: 20, fontFamily: 'Georgia', color: ThreadlyColors.warmWhite, marginBottom: 3 },
  cardTagline: { fontSize: 12, color: 'rgba(250,247,244,0.7)', fontStyle: 'italic', maxWidth: width * 0.65 },
  checkBadge: {
    width: 28, height: 28, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  checkText: { fontSize: 14, color: ThreadlyColors.black, fontWeight: '700' },
  traitRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  traitPill: {
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: ThreadlyRadius.pill,
    backgroundColor: 'rgba(10,10,10,0.6)',
    borderWidth: 1, borderColor: 'rgba(250,247,244,0.2)',
  },
  traitText: { fontSize: 10, color: ThreadlyColors.warmWhiteMuted, fontWeight: '600' },
  topAccentBar: { position: 'absolute', top: 0, left: 0, right: 0, height: 2 },
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
