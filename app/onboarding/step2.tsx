/**
 * Threadly Onboarding — Step 2: Favorite Brands
 * Visual brand grid. Selectable cards with brand logo/color.
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
const CARD_W = (width - ThreadlySpacing.screenPadding * 2 - 12) / 3;

const BRANDS = [
  { id: 'zara', name: 'ZARA', tier: 'High Street', color: '#1A1A1A', textColor: '#FAF7F4' },
  { id: 'hm', name: 'H&M', tier: 'High Street', color: '#E50010', textColor: '#FAF7F4' },
  { id: 'mango', name: 'MANGO', tier: 'High Street', color: '#2C2C2C', textColor: '#FAF7F4' },
  { id: 'aritzia', name: 'ARITZIA', tier: 'Premium', color: '#F5F0EB', textColor: '#1A1A1A' },
  { id: 'cos', name: 'COS', tier: 'Premium', color: '#E8E4E0', textColor: '#1A1A1A' },
  { id: 'arket', name: 'ARKET', tier: 'Premium', color: '#D4CFC8', textColor: '#1A1A1A' },
  { id: 'toteme', name: 'TOTEME', tier: 'Luxury', color: '#C8B89A', textColor: '#1A1A1A' },
  { id: 'sandro', name: 'SANDRO', tier: 'Luxury', color: '#2A2A3A', textColor: '#FAF7F4' },
  { id: 'maje', name: 'MAJE', tier: 'Luxury', color: '#3A2A2A', textColor: '#FAF7F4' },
  { id: 'reformation', name: 'REFORMATION', tier: 'Sustainable', color: '#E8D4C8', textColor: '#2A1A1A' },
  { id: 'everlane', name: 'EVERLANE', tier: 'Sustainable', color: '#F0EDE8', textColor: '#1A1A1A' },
  { id: 'amazon', name: 'AMAZON', tier: 'Value', color: '#FF9900', textColor: '#1A1A1A' },
  { id: 'target', name: 'TARGET', tier: 'Value', color: '#CC0000', textColor: '#FAF7F4' },
  { id: 'nordstrom', name: 'NORDSTROM', tier: 'Department', color: '#1A1A1A', textColor: '#FAF7F4' },
  { id: 'ssense', name: 'SSENSE', tier: 'Designer', color: '#0A0A0A', textColor: '#FAF7F4' },
];

export default function Step2Screen() {
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
    await saveStyleProfile({ favoriteBrands: selected });
    router.push('/onboarding/step3');
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0A0A0A', '#111111']} style={StyleSheet.absoluteFill} />

      <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.progressRow}>
          {[1,2,3,4,5,6,7].map(i => (
            <View key={i} style={[styles.progressDot, i <= 2 && styles.progressDotActive]} />
          ))}
        </View>
        <Text style={styles.stepLabel}>STEP 2 OF 7</Text>
        <Text style={styles.headline}>Your favorite{'\n'}brands?</Text>
        <Text style={styles.subline}>We'll track deals and new arrivals for you.</Text>
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.grid}>
        {BRANDS.map((brand) => {
          const isSelected = selected.includes(brand.id);
          return (
            <TouchableOpacity
              key={brand.id}
              style={[styles.card, { backgroundColor: brand.color }, isSelected && styles.cardSelected]}
              activeOpacity={0.85}
              onPress={() => toggle(brand.id)}
            >
              {isSelected && (
                <View style={styles.selectedGlow}>
                  <LinearGradient
                    colors={['rgba(201,149,106,0.3)', 'transparent']}
                    style={StyleSheet.absoluteFill}
                  />
                </View>
              )}
              <Text style={[styles.brandName, { color: brand.textColor }]}>{brand.name}</Text>
              <Text style={[styles.brandTier, { color: brand.textColor, opacity: 0.6 }]}>{brand.tier}</Text>
              {isSelected && (
                <View style={styles.checkBadge}>
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
        >
          <LinearGradient
            colors={selected.length > 0 ? [ThreadlyColors.roseGold, ThreadlyColors.roseGoldLight] : [ThreadlyColors.charcoal, ThreadlyColors.charcoal]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
          <Text style={[styles.ctaBtnText, selected.length === 0 && styles.ctaBtnTextDisabled]}>
            {selected.length > 0 ? `Continue with ${selected.length} brand${selected.length > 1 ? 's' : ''}` : 'Select at least one'}
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
  grid: {
    flexDirection: 'row', flexWrap: 'wrap',
    paddingHorizontal: ThreadlySpacing.screenPadding, gap: 10,
  },
  card: {
    width: CARD_W, height: CARD_W * 1.1,
    borderRadius: ThreadlyRadius.lg,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden', position: 'relative',
    padding: 8,
  },
  cardSelected: { borderColor: ThreadlyColors.roseGold, borderWidth: 2 },
  selectedGlow: { ...StyleSheet.absoluteFillObject, overflow: 'hidden' },
  brandName: { fontSize: 11, fontWeight: '700', letterSpacing: 1, textAlign: 'center' },
  brandTier: { fontSize: 8, letterSpacing: 0.5, marginTop: 3, textAlign: 'center' },
  checkBadge: {
    position: 'absolute', top: 6, right: 6,
    width: 18, height: 18, borderRadius: 9,
    backgroundColor: ThreadlyColors.roseGold,
    alignItems: 'center', justifyContent: 'center',
  },
  checkText: { fontSize: 10, color: ThreadlyColors.black, fontWeight: '700' },
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
