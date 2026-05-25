/**
 * Threadly Onboarding — Step 1: Style Vibes
 * Large visual cards with fashion imagery. Multi-select.
 * "Choose the aesthetics that feel like you."
 */

import { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Dimensions, Image, Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { saveStyleProfile } from '@/lib/onboarding-store';
import { ThreadlyColors, ThreadlySpacing, ThreadlyRadius } from '@/constants/threadly';

const { width } = Dimensions.get('window');
const CARD_W = (width - ThreadlySpacing.screenPadding * 2 - 12) / 2;

const STYLE_VIBES = [
  { id: 'minimal', label: 'Minimal', sub: 'Clean, quiet, intentional', image: 'https://images.unsplash.com/photo-1594938298603-c8148c4b4357?w=400&q=80', color: '#E8E4E0' },
  { id: 'clean-girl', label: 'Clean Girl', sub: 'Effortless, dewy, polished', image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&q=80', color: '#F2D4C8' },
  { id: 'old-money', label: 'Old Money', sub: 'Timeless, tailored, quiet luxury', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&q=80', color: '#C8B89A' },
  { id: 'streetwear', label: 'Streetwear', sub: 'Bold, urban, statement', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&q=80', color: '#2A2A2A' },
  { id: 'chic', label: 'Parisian Chic', sub: 'Effortless French elegance', image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=400&q=80', color: '#D4A090' },
  { id: 'casual-luxury', label: 'Casual Luxury', sub: 'Elevated basics, premium feel', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80', color: '#B8A898' },
  { id: 'romantic', label: 'Romantic', sub: 'Soft, feminine, dreamy', image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&q=80', color: '#E8C8C0' },
  { id: 'power', label: 'Power Dressing', sub: 'Structured, confident, bold', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=80', color: '#1A1A2E' },
];

export default function Step1Screen() {
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
    setSelected(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleNext = async () => {
    await saveStyleProfile({ styleVibes: selected });
    router.push('/onboarding/step2');
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0A0A0A', '#111111']} style={StyleSheet.absoluteFill} />

      {/* Header */}
      <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        {/* Progress */}
        <View style={styles.progressRow}>
          {[1,2,3,4,5,6,7].map(i => (
            <View key={i} style={[styles.progressDot, i === 1 && styles.progressDotActive]} />
          ))}
        </View>
        <Text style={styles.stepLabel}>STEP 1 OF 7</Text>
        <Text style={styles.headline}>What's your{'\n'}style vibe?</Text>
        <Text style={styles.subline}>Choose all that feel like you. We'll blend them.</Text>
      </Animated.View>

      {/* Grid */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.grid}
      >
        {STYLE_VIBES.map((vibe, idx) => {
          const isSelected = selected.includes(vibe.id);
          return (
            <TouchableOpacity
              key={vibe.id}
              style={[styles.card, isSelected && styles.cardSelected]}
              activeOpacity={0.85}
              onPress={() => toggle(vibe.id)}
            >
              <Image source={{ uri: vibe.image }} style={styles.cardImage} resizeMode="cover" />
              <LinearGradient
                colors={['transparent', 'rgba(10,10,10,0.88)']}
                style={StyleSheet.absoluteFill}
              />
              {isSelected && (
                <View style={styles.selectedOverlay}>
                  <LinearGradient
                    colors={['rgba(201,149,106,0.25)', 'rgba(201,149,106,0.1)']}
                    style={StyleSheet.absoluteFill}
                  />
                  <View style={styles.checkBadge}>
                    <Text style={styles.checkText}>✓</Text>
                  </View>
                </View>
              )}
              <View style={styles.cardContent}>
                <Text style={styles.cardLabel}>{vibe.label}</Text>
                <Text style={styles.cardSub}>{vibe.sub}</Text>
              </View>
              {isSelected && <View style={styles.cardBorder} />}
            </TouchableOpacity>
          );
        })}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* CTA */}
      <View style={styles.ctaWrap}>
        <LinearGradient
          colors={['transparent', 'rgba(10,10,10,0.98)']}
          style={StyleSheet.absoluteFill}
        />
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
            {selected.length > 0 ? `Continue with ${selected.length} vibe${selected.length > 1 ? 's' : ''}` : 'Select at least one'}
          </Text>
          {selected.length > 0 && <Text style={styles.ctaBtnArrow}>→</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: ThreadlyColors.black },
  header: {
    paddingHorizontal: ThreadlySpacing.screenPadding,
    paddingTop: 60,
    paddingBottom: 20,
  },
  progressRow: { flexDirection: 'row', gap: 5, marginBottom: 16 },
  progressDot: {
    flex: 1, height: 2, borderRadius: 1,
    backgroundColor: ThreadlyColors.charcoalLight,
  },
  progressDotActive: { backgroundColor: ThreadlyColors.roseGold },
  stepLabel: { fontSize: 10, fontWeight: '700', color: ThreadlyColors.roseGold, letterSpacing: 2, marginBottom: 10 },
  headline: {
    fontSize: 36, fontFamily: 'Georgia',
    color: ThreadlyColors.warmWhite, lineHeight: 44, marginBottom: 8,
  },
  subline: { fontSize: 14, color: ThreadlyColors.warmWhiteMuted, fontStyle: 'italic' },
  grid: {
    flexDirection: 'row', flexWrap: 'wrap',
    paddingHorizontal: ThreadlySpacing.screenPadding,
    gap: 12,
  },
  card: {
    width: CARD_W, height: CARD_W * 1.3,
    borderRadius: ThreadlyRadius.xl,
    overflow: 'hidden',
    borderWidth: 1, borderColor: ThreadlyColors.charcoalLight,
    position: 'relative',
  },
  cardSelected: { borderColor: ThreadlyColors.roseGold },
  cardImage: { width: '100%', height: '100%', position: 'absolute' },
  selectedOverlay: { ...StyleSheet.absoluteFillObject, overflow: 'hidden' },
  checkBadge: {
    position: 'absolute', top: 10, right: 10,
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: ThreadlyColors.roseGold,
    alignItems: 'center', justifyContent: 'center',
  },
  checkText: { fontSize: 13, color: ThreadlyColors.black, fontWeight: '700' },
  cardContent: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: 12,
  },
  cardLabel: { fontSize: 15, fontFamily: 'Georgia', color: ThreadlyColors.warmWhite, marginBottom: 2 },
  cardSub: { fontSize: 10, color: 'rgba(250,247,244,0.65)', fontStyle: 'italic' },
  cardBorder: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 2,
    backgroundColor: ThreadlyColors.roseGold,
  },
  ctaWrap: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingHorizontal: ThreadlySpacing.screenPadding,
    paddingBottom: 44, paddingTop: 40,
    overflow: 'hidden',
  },
  ctaBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 18, borderRadius: ThreadlyRadius.xl,
    overflow: 'hidden', gap: 10,
  },
  ctaBtnDisabled: { opacity: 0.6 },
  ctaBtnText: { fontSize: 16, fontWeight: '700', color: ThreadlyColors.black },
  ctaBtnTextDisabled: { color: ThreadlyColors.warmWhiteSubtle },
  ctaBtnArrow: { fontSize: 18, color: ThreadlyColors.black, fontWeight: '700' },
});
