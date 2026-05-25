/**
 * Threadly — Home
 * Fully personalized AI stylist feed.
 * Every section adapts to the user's saved StyleProfile.
 * Emotional outcome: "She already knows my taste."
 */

import { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Dimensions,
  Image,
  Animated,
  Pressable,
} from 'react-native';
import { useImageFade, useGlowPulse, useScalePress, hapticLight, hapticSuccess, ANIM } from '@/lib/animations';
import { AnimatedCard, HeartButton } from '@/components/ui/animated-pressable';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenContainer } from '@/components/screen-container';
import { ThreadlyColors, ThreadlySpacing, ThreadlyRadius } from '@/constants/threadly';
import { useRouter } from 'expo-router';
import { usePersonalization, OutfitCard, TrendCard, DealCard } from '@/lib/personalization';

const { width } = Dimensions.get('window');

// ─── Shimmer Component ────────────────────────────────────────────────────────

function Shimmer({ width: w, height: shimH, borderRadius = 12, style }: { width: number | string; height: number; borderRadius?: number; style?: object }) {
  const shimmer = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(shimmer, { toValue: 0, duration: 900, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  const opacity = shimmer.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.7] });
  return (
    <Animated.View style={[{ width: w as number, height: shimH, borderRadius, backgroundColor: ThreadlyColors.charcoalLight, opacity }, style]} />
  );
}

function ShimmerCard() {
  return (
    <View style={shimmerStyles.card}>
      <Shimmer width="100%" height={320} borderRadius={ThreadlyRadius.xl} />
      <View style={{ marginTop: 12, gap: 8, paddingHorizontal: 4 }}>
        <Shimmer width={180} height={16} borderRadius={8} />
        <Shimmer width={120} height={12} borderRadius={6} />
      </View>
    </View>
  );
}

const shimmerStyles = StyleSheet.create({
  card: { width: width - ThreadlySpacing.screenPadding * 2, marginHorizontal: ThreadlySpacing.screenPadding },
});

// ─── Outfit Hero Card ─────────────────────────────────────────────────────────

function OutfitHeroCard({ outfit, accentColor, onPress }: { outfit: OutfitCard; accentColor: string; onPress: () => void }) {
  const fadeIn = useRef(new Animated.Value(0)).current;
  const { imageOpacity, onImageLoad } = useImageFade();
  const { scale, onPressIn, onPressOut } = useScalePress(ANIM.heroPressScale);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    Animated.timing(fadeIn, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, [outfit.id]);

  return (
    <Animated.View style={[styles.heroCard, { opacity: fadeIn }]}>
      <Pressable
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={() => { hapticLight(); onPress(); }}
        style={{ flex: 1 }}
      >
        <Animated.View style={{ flex: 1, transform: [{ scale }] }}>
        <Animated.Image source={{ uri: outfit.image }} style={[styles.heroImage, { opacity: imageOpacity }]} resizeMode="cover" onLoad={onImageLoad} />
        <LinearGradient
          colors={['transparent', 'rgba(10,10,10,0.92)']}
          style={styles.heroGradient}
        />
        {/* Heart save button */}
        <View style={styles.heroHeartBtn}>
          <HeartButton saved={saved} onToggle={() => { setSaved(s => !s); if (!saved) hapticSuccess(); }} size={20} />
        </View>
        {/* Match badge */}
        <View style={styles.matchBadge}>
          <Text style={styles.matchPct}>{outfit.matchPct}%</Text>
          <Text style={styles.matchLabel}>match</Text>
        </View>
        {/* Vibe tag */}
        <View style={styles.vibePill}>
          <Text style={styles.vibeText}>✦ {outfit.vibeTag}</Text>
        </View>
        {/* Bottom info */}
        <View style={styles.heroBottom}>
          <View style={{ flex: 1 }}>
            <Text style={styles.heroTitle}>{outfit.title}</Text>
            <Text style={styles.heroSub}>{outfit.subtitle}</Text>
          </View>
        </View>
        {/* Owned bar */}
        <View style={styles.ownedRow}>
          <View style={styles.ownedBarTrack}>
            <View style={[styles.ownedBarFill, { width: `${outfit.ownedPct}%` as any, backgroundColor: accentColor }]} />
          </View>
          <Text style={styles.ownedText}>You own {outfit.ownedPct}% of this look</Text>
          <TouchableOpacity style={[styles.viewBtn, { borderColor: `${accentColor}60` }]} onPress={onPress}>
            <Text style={[styles.viewBtnText, { color: accentColor }]}>View Look →</Text>
          </TouchableOpacity>
        </View>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

// ─── Trend Card ───────────────────────────────────────────────────────────────

function TrendItem({ item }: { item: TrendCard }) {
  const { scale, onPressIn, onPressOut } = useScalePress(0.96);
  const { imageOpacity, onImageLoad } = useImageFade();
  return (
    <Pressable
      style={styles.trendCard}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={() => hapticLight()}
    >
      <Animated.View style={{ flex: 1, transform: [{ scale }] }}>
      <Animated.Image source={{ uri: item.image }} style={[styles.trendImage, { opacity: imageOpacity }]} resizeMode="cover" onLoad={onImageLoad} />
      <LinearGradient colors={['transparent', 'rgba(10,10,10,0.88)']} style={styles.trendOverlay}>
        <Text style={styles.trendLabel}>{item.label}</Text>
        <Text style={styles.trendTitle}>{item.title}</Text>
        <Text style={styles.trendSub}>{item.sub}</Text>
      </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

// ─── Deal Card ────────────────────────────────────────────────────────────────

function DealItem({ item, accentColor }: { item: DealCard; accentColor: string }) {
  const { scale, onPressIn, onPressOut } = useScalePress(0.95);
  const { imageOpacity, onImageLoad } = useImageFade();
  const [saved, setSaved] = useState(false);
  return (
    <Pressable
      style={styles.dealCard}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={() => hapticLight()}
    >
      <Animated.View style={{ transform: [{ scale }] }}>
      <View style={styles.dealImageWrap}>
        <Animated.Image source={{ uri: item.image }} style={[styles.dealImage, { opacity: imageOpacity }]} resizeMode="cover" onLoad={onImageLoad} />
        <View style={styles.dealOffBadge}>
          <Text style={styles.dealOffText}>-{item.off}%</Text>
        </View>
      </View>
      <View style={styles.dealInfo}>
        <Text style={styles.dealBrand}>{item.brand}</Text>
        <Text style={styles.dealItem} numberOfLines={2}>{item.item}</Text>
        <View style={styles.dealPricing}>
          <Text style={styles.dealOriginal}>${item.original}</Text>
          <Text style={[styles.dealSale, { color: ThreadlyColors.success }]}>${item.sale}</Text>
        </View>
        <Text style={[styles.dealMatchReason, { color: accentColor }]}>✦ {item.matchReason}</Text>
        <Text style={styles.dealExpiry}>{item.expiry}</Text>
      </View>
      </Animated.View>
    </Pressable>
  );
}

// ─── Go New CTA (animated pulse) ────────────────────────────────────────────

function GoNewCTA({ onPress, label }: { onPress: () => void; label: string }) {
  const { scale, onPressIn, onPressOut } = useScalePress(0.97);
  const glowOpacity = useGlowPulse();
  return (
    <Pressable
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={onPress}
      style={{ marginHorizontal: ThreadlySpacing.screenPadding, marginBottom: 8 }}
    >
      <Animated.View style={[styles.goNewCta, { transform: [{ scale }] }]}>
        <LinearGradient
          colors={[ThreadlyColors.roseGold, ThreadlyColors.roseGoldLight]}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
        {/* Animated glow ring */}
        <Animated.View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            {
              borderRadius: ThreadlyRadius.xl,
              borderWidth: 1.5,
              borderColor: ThreadlyColors.roseGoldLight,
              opacity: glowOpacity,
            },
          ]}
        />
        <View style={styles.goNewContent}>
          <View>
            <Text style={styles.goNewTitle}>Go New ✦</Text>
            <Text style={styles.goNewSub}>{label}</Text>
          </View>
          <View style={styles.goNewArrow}>
            <Text style={styles.goNewArrowText}>→</Text>
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const router = useRouter();
  const p = usePersonalization();
  const headerFade = useRef(new Animated.Value(0)).current;
  const headerSlide = useRef(new Animated.Value(-8)).current;

  useEffect(() => {
    if (!p.isLoading) {
      Animated.parallel([
        Animated.timing(headerFade, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(headerSlide, { toValue: 0, duration: 500, useNativeDriver: true }),
      ]).start();
    }
  }, [p.isLoading]);

  return (
    <ScreenContainer containerClassName="bg-black" edges={['top', 'left', 'right']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* ── Header ── */}
        <Animated.View style={[styles.header, { opacity: headerFade, transform: [{ translateY: headerSlide }] }]}>
          <View>
            <Text style={styles.wordmark}>THREADLY</Text>
            <Text style={styles.tagline}>The AI stylist that shops smarter.</Text>
          </View>
          <TouchableOpacity style={styles.notifBtn}>
            <Text style={styles.notifIcon}>♡</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* ── Personalized Greeting ── */}
        {!p.isLoading && (
          <Animated.View style={[styles.greetingWrap, { opacity: headerFade }]}>
            <Text style={styles.greeting}>{p.greeting}</Text>
            <Text style={styles.heroTagline}>{p.heroTagline}</Text>
            <Text style={styles.heroSubline}>{p.heroSubline}</Text>
          </Animated.View>
        )}

        {/* ── Today's Look ── */}
        <View style={styles.sectionGap}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionLabel, { color: p.accentColor }]}>✦ TODAY'S LOOK</Text>
          </View>
          {p.isLoading ? (
            <ShimmerCard />
          ) : (
            <OutfitHeroCard
              outfit={p.outfits[0]}
              accentColor={p.accentColor}
              onPress={() => router.push('/(tabs)/gonew')}
            />
          )}
        </View>

        {/* ── Go New CTA ── */}
        {!p.isLoading && (
          <GoNewCTA onPress={() => { hapticLight(); router.push('/(tabs)/gonew'); }} label={p.goNewLabel} />
        )}
        {false && (
          <TouchableOpacity
            style={styles.goNewCta}
            activeOpacity={0.88}
            onPress={() => router.push('/(tabs)/gonew')}
          >
            <LinearGradient
              colors={[ThreadlyColors.roseGold, ThreadlyColors.roseGoldLight]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.goNewContent}>
              <View>
                <Text style={styles.goNewTitle}>Go New ✦</Text>
                <Text style={styles.goNewSub}>{p.goNewLabel}</Text>
              </View>
              <View style={styles.goNewArrow}>
                <Text style={styles.goNewArrowText}>→</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}

        {/* ── Curated Picks ── */}
        {!p.isLoading && p.outfits.length > 1 && (
          <View style={styles.sectionGap}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionLabel, { color: p.accentColor }]}>{p.sectionLabel}</Text>
              <Text style={styles.sectionTitle}>{p.sectionTitle}</Text>
            </View>
            <FlatList
              data={p.outfits.slice(1)}
              keyExtractor={item => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.curatedList}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.curatedCard} activeOpacity={0.88} onPress={() => router.push('/(tabs)/gonew')}>
                  <Image source={{ uri: item.image }} style={styles.curatedImage} resizeMode="cover" />
                  <LinearGradient colors={['transparent', 'rgba(10,10,10,0.9)']} style={styles.curatedOverlay}>
                    <Text style={[styles.curatedAttrib, { color: p.accentColor }]}>✦ {item.attribution}</Text>
                    <Text style={styles.curatedTitle}>{item.title}</Text>
                    <Text style={styles.curatedSub}>{item.subtitle}</Text>
                    <View style={styles.curatedMeta}>
                      <Text style={styles.curatedMatch}>{item.matchPct}% match</Text>
                      <Text style={styles.curatedOwned}>{item.ownedPct}% owned</Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              )}
            />
          </View>
        )}

        {/* ── Trending in Your Aesthetic ── */}
        <View style={styles.sectionGap}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionLabel, { color: p.accentColor }]}>{p.isLoading ? 'TRENDING NOW' : p.trendSectionLabel}</Text>
            <Text style={styles.sectionTitle}>What's moving in fashion</Text>
          </View>
          {p.isLoading ? (
            <View style={{ flexDirection: 'row', gap: 12, paddingLeft: ThreadlySpacing.screenPadding }}>
              <Shimmer width={width * 0.62} height={200} borderRadius={ThreadlyRadius.xl} />
              <Shimmer width={width * 0.62} height={200} borderRadius={ThreadlyRadius.xl} />
            </View>
          ) : (
            <FlatList
              data={p.trends}
              keyExtractor={item => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.trendList}
              renderItem={({ item }) => <TrendItem item={item} />}
            />
          )}
        </View>

        {/* ── Deal Alerts ── */}
        <View style={styles.sectionGap}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionLabel, { color: p.accentColor }]}>{p.isLoading ? 'DEAL ALERTS' : p.dealSectionLabel}</Text>
            <Text style={styles.sectionTitle}>Prices just dropped</Text>
          </View>
          {p.isLoading ? (
            <View style={{ flexDirection: 'row', gap: 12, paddingLeft: ThreadlySpacing.screenPadding }}>
              <Shimmer width={140} height={220} borderRadius={ThreadlyRadius.xl} />
              <Shimmer width={140} height={220} borderRadius={ThreadlyRadius.xl} />
              <Shimmer width={140} height={220} borderRadius={ThreadlyRadius.xl} />
            </View>
          ) : (
            <FlatList
              data={p.deals}
              keyExtractor={item => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.dealList}
              renderItem={({ item }) => <DealItem item={item} accentColor={p.accentColor} />}
            />
          )}
        </View>

        {/* ── AI Insight Card ── */}
        {!p.isLoading && (
          <View style={[styles.sectionGap, { paddingHorizontal: ThreadlySpacing.screenPadding }]}>
            <TouchableOpacity style={styles.insightCard} activeOpacity={0.88} onPress={() => router.push('/(tabs)/stylist')}>
              <LinearGradient
                colors={['rgba(201,149,106,0.08)', 'transparent']}
                style={StyleSheet.absoluteFill}
              />
              <View style={styles.insightTopBorder} />
              <Text style={[styles.insightIcon, { color: p.accentColor }]}>✦</Text>
              <Text style={styles.insightTitle}>Your Stylist Insight</Text>
              <Text style={styles.insightText}>{p.insightText}</Text>
              <View style={[styles.insightBtn, { borderColor: `${p.accentColor}50` }]}>
                <Text style={[styles.insightBtnText, { color: p.accentColor }]}>Ask your stylist →</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: ThreadlySpacing.screenPadding,
    paddingTop: 16,
    paddingBottom: 12,
  },
  wordmark: {
    fontSize: 22,
    fontFamily: 'Georgia',
    color: ThreadlyColors.warmWhite,
    letterSpacing: 5,
    marginBottom: 2,
  },
  tagline: {
    fontSize: 11,
    color: ThreadlyColors.warmWhiteSubtle,
    fontStyle: 'italic',
    letterSpacing: 0.3,
  },
  notifBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: ThreadlyColors.charcoal,
    borderWidth: 1, borderColor: ThreadlyColors.charcoalLight,
    alignItems: 'center', justifyContent: 'center',
  },
  notifIcon: { fontSize: 16, color: ThreadlyColors.roseGold },
  heroHeartBtn: {
    position: 'absolute',
    top: 14,
    right: 14,
    zIndex: 10,
    backgroundColor: 'rgba(10,10,10,0.55)',
    borderRadius: 20,
    padding: 2,
  },

  // Greeting
  greetingWrap: {
    paddingHorizontal: ThreadlySpacing.screenPadding,
    paddingBottom: 20,
    paddingTop: 4,
  },
  greeting: {
    fontSize: 13,
    color: ThreadlyColors.warmWhiteSubtle,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  heroTagline: {
    fontSize: 26,
    fontFamily: 'Georgia',
    color: ThreadlyColors.warmWhite,
    lineHeight: 34,
    marginBottom: 4,
  },
  heroSubline: {
    fontSize: 13,
    color: ThreadlyColors.warmWhiteMuted,
    fontStyle: 'italic',
  },

  // Section
  sectionGap: { marginBottom: 28 },
  sectionHeader: {
    paddingHorizontal: ThreadlySpacing.screenPadding,
    marginBottom: 14,
  },
  sectionLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Georgia',
    color: ThreadlyColors.warmWhite,
  },

  // Hero Card
  heroCard: {
    marginHorizontal: ThreadlySpacing.screenPadding,
    borderRadius: ThreadlyRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: ThreadlyColors.charcoalLight,
  },
  heroImage: { width: '100%', height: 340 },
  heroGradient: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: 200,
  },
  matchBadge: {
    position: 'absolute', top: 14, right: 14,
    backgroundColor: 'rgba(10,10,10,0.75)',
    borderRadius: ThreadlyRadius.md,
    paddingHorizontal: 10, paddingVertical: 6,
    alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(201,149,106,0.3)',
  },
  matchPct: { fontSize: 18, fontFamily: 'Georgia', color: ThreadlyColors.warmWhite, lineHeight: 22 },
  matchLabel: { fontSize: 8, color: ThreadlyColors.warmWhiteSubtle, letterSpacing: 1 },
  vibePill: {
    position: 'absolute', top: 14, left: 14,
    backgroundColor: 'rgba(10,10,10,0.7)',
    borderRadius: ThreadlyRadius.pill,
    paddingHorizontal: 10, paddingVertical: 5,
    borderWidth: 1, borderColor: 'rgba(201,149,106,0.25)',
  },
  vibeText: { fontSize: 9, color: ThreadlyColors.roseGoldLight, fontWeight: '700', letterSpacing: 1 },
  heroBottom: {
    position: 'absolute', bottom: 52, left: 16, right: 16,
    flexDirection: 'row', alignItems: 'flex-end',
  },
  heroTitle: { fontSize: 22, fontFamily: 'Georgia', color: ThreadlyColors.warmWhite, marginBottom: 3 },
  heroSub: { fontSize: 12, color: 'rgba(250,247,244,0.65)', fontStyle: 'italic' },
  ownedRow: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 14, paddingVertical: 10,
    gap: 8, backgroundColor: 'rgba(10,10,10,0.85)',
  },
  ownedBarTrack: {
    flex: 1, height: 3, borderRadius: 2,
    backgroundColor: ThreadlyColors.charcoalLight, overflow: 'hidden',
  },
  ownedBarFill: { height: '100%', borderRadius: 2 },
  ownedText: { fontSize: 10, color: ThreadlyColors.warmWhiteSubtle, fontStyle: 'italic' },
  viewBtn: {
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: ThreadlyRadius.pill, borderWidth: 1,
  },
  viewBtnText: { fontSize: 11, fontWeight: '600' },

  // Go New CTA
  goNewCta: {
    marginHorizontal: ThreadlySpacing.screenPadding,
    borderRadius: ThreadlyRadius.xl,
    overflow: 'hidden',
    marginBottom: 28,
    shadowColor: ThreadlyColors.roseGold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 8,
  },
  goNewContent: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 18,
  },
  goNewTitle: { fontSize: 22, fontFamily: 'Georgia', color: ThreadlyColors.black, marginBottom: 3 },
  goNewSub: { fontSize: 12, color: 'rgba(10,10,10,0.65)' },
  goNewArrow: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(10,10,10,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  goNewArrowText: { fontSize: 20, color: ThreadlyColors.black, fontWeight: '700' },

  // Curated picks
  curatedList: { paddingLeft: ThreadlySpacing.screenPadding, paddingRight: 8, gap: 12 },
  curatedCard: {
    width: width * 0.68, height: 240,
    borderRadius: ThreadlyRadius.xl, overflow: 'hidden',
    borderWidth: 1, borderColor: ThreadlyColors.charcoalLight,
  },
  curatedImage: { width: '100%', height: '100%' },
  curatedOverlay: {
    position: 'absolute', bottom: 0, left: 0, right: 0, padding: 14,
  },
  curatedAttrib: { fontSize: 8, fontWeight: '700', letterSpacing: 1.5, marginBottom: 3 },
  curatedTitle: { fontSize: 17, fontFamily: 'Georgia', color: ThreadlyColors.warmWhite, marginBottom: 2 },
  curatedSub: { fontSize: 11, color: 'rgba(250,247,244,0.65)', fontStyle: 'italic', marginBottom: 6 },
  curatedMeta: { flexDirection: 'row', gap: 10 },
  curatedMatch: { fontSize: 10, color: ThreadlyColors.warmWhite, fontWeight: '600' },
  curatedOwned: { fontSize: 10, color: ThreadlyColors.warmWhiteSubtle },

  // Trends
  trendList: { paddingLeft: ThreadlySpacing.screenPadding, paddingRight: 8, gap: 12 },
  trendCard: {
    width: width * 0.62, height: 200,
    borderRadius: ThreadlyRadius.xl, overflow: 'hidden',
    borderWidth: 1, borderColor: ThreadlyColors.charcoalLight,
  },
  trendImage: { width: '100%', height: '100%' },
  trendOverlay: {
    position: 'absolute', bottom: 0, left: 0, right: 0, padding: 14,
  },
  trendLabel: { fontSize: 8, fontWeight: '700', color: ThreadlyColors.roseGoldLight, letterSpacing: 1.5, marginBottom: 4 },
  trendTitle: { fontSize: 18, fontFamily: 'Georgia', color: ThreadlyColors.warmWhite, marginBottom: 3 },
  trendSub: { fontSize: 11, color: 'rgba(250,247,244,0.65)', fontStyle: 'italic' },

  // Deals
  dealList: { paddingLeft: ThreadlySpacing.screenPadding, paddingRight: 8, gap: 12 },
  dealCard: {
    width: 148,
    backgroundColor: ThreadlyColors.charcoal,
    borderRadius: ThreadlyRadius.xl, overflow: 'hidden',
    borderWidth: 1, borderColor: ThreadlyColors.charcoalLight,
  },
  dealImageWrap: { height: 148, position: 'relative' },
  dealImage: { width: '100%', height: '100%' },
  dealOffBadge: {
    position: 'absolute', top: 8, right: 8,
    backgroundColor: ThreadlyColors.success,
    paddingHorizontal: 7, paddingVertical: 3,
    borderRadius: ThreadlyRadius.pill,
  },
  dealOffText: { fontSize: 10, fontWeight: '700', color: '#fff' },
  dealInfo: { padding: 10, gap: 3 },
  dealBrand: { fontSize: 7, fontWeight: '700', color: ThreadlyColors.warmWhiteSubtle, letterSpacing: 1.5 },
  dealItem: { fontSize: 12, color: ThreadlyColors.warmWhite, fontWeight: '600', lineHeight: 16 },
  dealPricing: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dealOriginal: { fontSize: 10, color: ThreadlyColors.warmWhiteSubtle, textDecorationLine: 'line-through' },
  dealSale: { fontSize: 14, fontFamily: 'Georgia' },
  dealMatchReason: { fontSize: 9, fontWeight: '600', letterSpacing: 0.3 },
  dealExpiry: { fontSize: 9, color: ThreadlyColors.warmWhiteSubtle },

  // AI Insight
  insightCard: {
    borderRadius: ThreadlyRadius.xl, overflow: 'hidden',
    borderWidth: 1, borderColor: 'rgba(201,149,106,0.2)',
    padding: 20, position: 'relative',
  },
  insightTopBorder: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 1,
    backgroundColor: ThreadlyColors.roseGold, opacity: 0.4,
  },
  insightIcon: { fontSize: 18, marginBottom: 8 },
  insightTitle: {
    fontSize: 14, fontFamily: 'Georgia',
    color: ThreadlyColors.warmWhite, marginBottom: 10,
  },
  insightText: {
    fontSize: 13, color: ThreadlyColors.warmWhiteSubtle,
    lineHeight: 20, fontStyle: 'italic', marginBottom: 14,
  },
  insightBtn: {
    alignSelf: 'flex-start',
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: ThreadlyRadius.pill, borderWidth: 1,
  },
  insightBtnText: { fontSize: 12, fontWeight: '600' },
});
