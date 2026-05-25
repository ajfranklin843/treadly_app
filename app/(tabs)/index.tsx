/**
 * Threadly — Home Screen
 * The AI stylist's daily briefing. Emotionally curated, visually immersive.
 * Every section is personalized to the user's StyleProfile.
 */

import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Animated,
  Dimensions,
  FlatList,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { ThreadlyColors, ThreadlySpacing, ThreadlyRadius } from "@/constants/threadly";
import { usePersonalization } from "@/lib/personalization";
import { useScalePress, useImageFade, hapticLight, hapticSuccess } from "@/lib/animations";
import {
  HERO_IMAGES,
  OUTFIT_IMAGES,
  TREND_IMAGES,
  DEAL_IMAGES,
  ALL_OUTFIT_IMAGES,
  ALL_TREND_IMAGES,
  pickImage,
} from "@/lib/images";

const { width: SCREEN_W } = Dimensions.get("window");
const CARD_W = SCREEN_W - 48;
const PICK_W = 180;
const TREND_W = 220;
const DEAL_W = 200;

// ─── Shimmer ──────────────────────────────────────────────────────────────────

function Shimmer({ width, height, radius = 12 }: { width: number | string; height: number; radius?: number }) {
  const shimmer = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(shimmer, { toValue: 0, duration: 900, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  const opacity = shimmer.interpolate({ inputRange: [0, 1], outputRange: [0.08, 0.18] });
  return (
    <Animated.View
      style={{
        width: width as number,
        height,
        borderRadius: radius,
        backgroundColor: ThreadlyColors.warmWhite,
        opacity,
      }}
    />
  );
}

// ─── Fade Image ───────────────────────────────────────────────────────────────

function FadeImage({
  uri,
  style,
  resizeMode = "cover",
}: {
  uri: string;
  style: object;
  resizeMode?: "cover" | "contain" | "stretch";
}) {
  const { imageOpacity: opacity, onImageLoad: onLoad } = useImageFade();
  return (
    <Animated.Image
      source={{ uri }}
      style={[style, { opacity }]}
      resizeMode={resizeMode}
      onLoad={onLoad}
    />
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const p = usePersonalization();
  const [savedLooks, setSavedLooks] = useState<Set<string>>(new Set());
  const headerFade = useRef(new Animated.Value(0)).current;
  const heroSlide = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerFade, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(heroSlide, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  const toggleSave = useCallback((id: string) => {
    hapticSuccess();
    setSavedLooks(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  // Derive hero image from vibe using sectionTitle as proxy
  const heroImage = (() => {
    const t = p.sectionTitle.toLowerCase();
    if (t.includes("old money")) return HERO_IMAGES.oldMoney;
    if (t.includes("clean")) return HERO_IMAGES.cleanGirl;
    if (t.includes("minimal")) return HERO_IMAGES.minimal;
    if (t.includes("chic") || t.includes("parisian")) return HERO_IMAGES.chic;
    if (t.includes("street")) return HERO_IMAGES.streetwear;
    if (t.includes("casual")) return HERO_IMAGES.casualLuxury;
    return HERO_IMAGES.quietLuxury;
  })();

  const picks = p.outfits.slice(0, 5).map((r, i) => ({
    id: r.id,
    label: r.title,
    brand: r.vibeTag,
    match: r.matchPct,
    image: pickImage(ALL_OUTFIT_IMAGES, i + 7),
    attribution: r.attribution,
  }));

  const trends = p.trends.slice(0, 6).map((t, i) => ({
    id: t.id,
    title: t.title,
    subtitle: t.sub,
    image: pickImage(ALL_TREND_IMAGES, i),
  }));

  const deals = p.deals.slice(0, 5).map((d, i) => ({
    id: d.id,
    brand: d.brand,
    item: d.item,
    original: `$${d.original}`,
    sale: `$${d.sale}`,
    savings: `${d.off}% off`,
    image: pickImage(Object.values(DEAL_IMAGES), i + 2),
  }));

  if (p.isLoading) {
    return (
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <LinearGradient colors={[ThreadlyColors.black, "#0D0D0D"]} style={StyleSheet.absoluteFill} />
        <View style={styles.loadingContainer}>
          <Shimmer width={120} height={18} radius={4} />
          <View style={{ height: 12 }} />
          <Shimmer width={CARD_W} height={380} radius={20} />
          <View style={{ height: 16 }} />
          <Shimmer width={200} height={14} radius={4} />
          <View style={{ height: 12 }} />
          <View style={{ flexDirection: "row", gap: 12 }}>
            <Shimmer width={PICK_W} height={260} radius={16} />
            <Shimmer width={PICK_W} height={260} radius={16} />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <LinearGradient colors={[ThreadlyColors.black, "#0D0D0D"]} style={StyleSheet.absoluteFill} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* ── Header ── */}
        <Animated.View style={[styles.header, { opacity: headerFade }]}>
          <View>
            <Text style={styles.greeting}>{p.greeting}</Text>
            <Text style={styles.headerSub}>{p.heroTagline}</Text>
          </View>
          <Pressable
            style={({ pressed }) => [styles.notifBtn, pressed && { opacity: 0.6 }]}
            onPress={() => hapticLight()}
          >
            <View style={styles.notifDot} />
            <Text style={styles.notifIcon}>🔔</Text>
          </Pressable>
        </Animated.View>

        {/* ── Today's Look Hero ── */}
        <Animated.View style={[styles.heroWrap, { transform: [{ translateY: heroSlide }] }]}>
          <HeroCard
            image={heroImage}
            match={82}
            tagline={p.heroTagline}
            subline={p.heroSubline}
            saved={savedLooks.has("hero")}
            onSave={() => toggleSave("hero")}
            onGoNew={() => { hapticLight(); router.push("/(tabs)/gonew"); }}
          />
        </Animated.View>

        {/* ── AI Insight ── */}
        <InsightBanner text={p.insightText} />

        {/* ── Curated Picks ── */}
        <SectionHeader title={p.sectionTitle} sub={p.sectionLabel} />
        <FlatList
          data={picks}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.hList}
          renderItem={({ item, index }) => (
            <PickCard
              key={item.id}
              image={item.image}
              label={item.label}
              brand={item.brand}
              match={item.match}
              saved={savedLooks.has(item.id)}
              onSave={() => toggleSave(item.id)}
              delay={index * 80}
            />
          )}
        />

        {/* ── Trending Now ── */}
        <SectionHeader title={p.trendSectionLabel} sub="Trending in your aesthetic" />
        <FlatList
          data={trends}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.hList}
          renderItem={({ item, index }) => (
            <TrendCard
              key={item.id}
              image={item.image}
              title={item.title}
              subtitle={item.subtitle}
              delay={index * 60}
            />
          )}
        />

        {/* ── Deal Alerts ── */}
        <SectionHeader title={p.dealSectionLabel} sub="Curated for your brands" />
        <FlatList
          data={deals}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.hList}
          renderItem={({ item, index }) => (
            <DealCard
              key={item.id}
              image={item.image}
              brand={item.brand}
              item={item.item}
              original={item.original}
              sale={item.sale}
              savings={item.savings}
              delay={index * 70}
            />
          )}
        />

        {/* ── Go New CTA ── */}
        <GoNewCTA onPress={() => { hapticLight(); router.push("/(tabs)/gonew"); }} />

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

// ─── Hero Card ────────────────────────────────────────────────────────────────

function HeroCard({
  image, match, tagline, subline, saved, onSave, onGoNew,
}: {
  image: string; match: number; tagline: string; subline: string;
  saved: boolean; onSave: () => void; onGoNew: () => void;
}) {
  const { scale, onPressIn, onPressOut } = useScalePress(0.985);
  const heartScale = useRef(new Animated.Value(1)).current;
  const { imageOpacity: imgOpacity, onImageLoad: onLoad } = useImageFade();

  const handleSave = useCallback(() => {
    onSave();
    Animated.sequence([
      Animated.timing(heartScale, { toValue: 1.4, duration: 120, useNativeDriver: true }),
      Animated.spring(heartScale, { toValue: 1, tension: 200, friction: 8, useNativeDriver: true }),
    ]).start();
  }, [onSave]);

  return (
    <Pressable onPressIn={onPressIn} onPressOut={onPressOut} onPress={onGoNew}>
      <Animated.View style={[styles.heroCard, { transform: [{ scale }] }]}>
        {/* Image */}
        <Animated.Image
          source={{ uri: image }}
          style={[styles.heroImage, { opacity: imgOpacity }]}
          resizeMode="cover"
          onLoad={onLoad}
        />
        {/* Gradient overlay */}
        <LinearGradient
          colors={["transparent", "transparent", ThreadlyColors.black + "CC", ThreadlyColors.black]}
          locations={[0, 0.35, 0.7, 1]}
          style={StyleSheet.absoluteFill}
        />
        {/* Top badges */}
        <View style={styles.heroBadgeRow}>
          <View style={styles.matchBadge}>
            <LinearGradient
              colors={[ThreadlyColors.roseGold, ThreadlyColors.roseGoldLight]}
              style={StyleSheet.absoluteFill}
            />
            <Text style={styles.matchBadgeText}>{match}%</Text>
            <Text style={styles.matchBadgeSub}>match</Text>
          </View>
          <View style={styles.ownBadge}>
            <Text style={styles.ownBadgeText}>You own 80%</Text>
          </View>
        </View>
        {/* Bottom content */}
        <View style={styles.heroBottom}>
          <View style={styles.heroTextWrap}>
            <Text style={styles.heroLabel}>TODAY'S LOOK</Text>
            <Text style={styles.heroTagline} numberOfLines={2}>{tagline}</Text>
            <Text style={styles.heroSub} numberOfLines={1}>{subline}</Text>
          </View>
          <Pressable onPress={handleSave} style={styles.heartBtn}>
            <Animated.Text style={[styles.heartIcon, { transform: [{ scale: heartScale }] }]}>
              {saved ? "♥" : "♡"}
            </Animated.Text>
          </Pressable>
        </View>
      </Animated.View>
    </Pressable>
  );
}

// ─── Insight Banner ───────────────────────────────────────────────────────────

function InsightBanner({ text }: { text: string }) {
  const fade = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 600, delay: 300, useNativeDriver: true }).start();
  }, []);
  return (
    <Animated.View style={[styles.insightBanner, { opacity: fade }]}>
      <LinearGradient
        colors={[ThreadlyColors.roseGold + "18", ThreadlyColors.roseGold + "08"]}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.insightBannerBorder} />
      <Text style={styles.insightIcon}>✦</Text>
      <Text style={styles.insightText}>{text}</Text>
    </Animated.View>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────

function SectionHeader({ title, sub }: { title: string; sub: string }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionSub}>{sub}</Text>
    </View>
  );
}

// ─── Pick Card ────────────────────────────────────────────────────────────────

function PickCard({
  image, label, brand, match, saved, onSave, delay = 0,
}: {
  image: string; label: string; brand: string; match: number;
  saved: boolean; onSave: () => void; delay?: number;
}) {
  const { scale, onPressIn, onPressOut } = useScalePress(0.96);
  const { imageOpacity: imgOpacity, onImageLoad: onLoad } = useImageFade();
  const heartScale = useRef(new Animated.Value(1)).current;
  const entrance = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(entrance, { toValue: 1, duration: 400, delay, useNativeDriver: true }).start();
  }, []);

  const handleSave = useCallback(() => {
    onSave();
    Animated.sequence([
      Animated.timing(heartScale, { toValue: 1.5, duration: 100, useNativeDriver: true }),
      Animated.spring(heartScale, { toValue: 1, tension: 200, friction: 7, useNativeDriver: true }),
    ]).start();
  }, [onSave]);

  return (
    <Pressable onPressIn={onPressIn} onPressOut={onPressOut} onPress={() => hapticLight()}>
      <Animated.View style={[styles.pickCard, { transform: [{ scale }], opacity: entrance }]}>
        {/* Image */}
        <View style={styles.pickImageWrap}>
          <Animated.Image
            source={{ uri: image }}
            style={[styles.pickImage, { opacity: imgOpacity }]}
            resizeMode="cover"
            onLoad={onLoad}
          />
          <LinearGradient
            colors={["transparent", ThreadlyColors.black + "AA"]}
            style={[StyleSheet.absoluteFill, { borderRadius: ThreadlyRadius.lg }]}
          />
          {/* Match badge */}
          <View style={styles.pickMatchBadge}>
            <Text style={styles.pickMatchText}>{match}%</Text>
          </View>
          {/* Heart */}
          <Pressable onPress={handleSave} style={styles.pickHeart}>
            <Animated.Text style={[styles.pickHeartIcon, saved && styles.pickHeartSaved, { transform: [{ scale: heartScale }] }]}>
              {saved ? "♥" : "♡"}
            </Animated.Text>
          </Pressable>
        </View>
        {/* Info */}
        <View style={styles.pickInfo}>
          <Text style={styles.pickBrand}>{brand.toUpperCase()}</Text>
          <Text style={styles.pickLabel} numberOfLines={2}>{label}</Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

// ─── Trend Card ───────────────────────────────────────────────────────────────

function TrendCard({
  image, title, subtitle, delay = 0,
}: {
  image: string; title: string; subtitle: string; delay?: number;
}) {
  const { scale, onPressIn, onPressOut } = useScalePress(0.96);
  const { imageOpacity: imgOpacity, onImageLoad: onLoad } = useImageFade();
  const entrance = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(entrance, { toValue: 1, duration: 400, delay, useNativeDriver: true }).start();
  }, []);

  return (
    <Pressable onPressIn={onPressIn} onPressOut={onPressOut} onPress={() => hapticLight()}>
      <Animated.View style={[styles.trendCard, { transform: [{ scale }], opacity: entrance }]}>
        <Animated.Image
          source={{ uri: image }}
          style={[styles.trendImage, { opacity: imgOpacity }]}
          resizeMode="cover"
          onLoad={onLoad}
        />
        <LinearGradient
          colors={["transparent", ThreadlyColors.black + "DD"]}
          style={[StyleSheet.absoluteFill, { borderRadius: ThreadlyRadius.lg }]}
        />
        <View style={styles.trendInfo}>
          <Text style={styles.trendTitle} numberOfLines={1}>{title}</Text>
          <Text style={styles.trendSub} numberOfLines={1}>{subtitle}</Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

// ─── Deal Card ────────────────────────────────────────────────────────────────

function DealCard({
  image, brand, item, original, sale, savings, delay = 0,
}: {
  image: string; brand: string; item: string; original: string;
  sale: string; savings: string; delay?: number;
}) {
  const { scale, onPressIn, onPressOut } = useScalePress(0.96);
  const { imageOpacity: imgOpacity, onImageLoad: onLoad } = useImageFade();
  const glowOpacity = useRef(new Animated.Value(0.3)).current;
  const entrance = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(entrance, { toValue: 1, duration: 400, delay, useNativeDriver: true }).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowOpacity, { toValue: 0.7, duration: 1200, useNativeDriver: true }),
        Animated.timing(glowOpacity, { toValue: 0.3, duration: 1200, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <Pressable onPressIn={onPressIn} onPressOut={onPressOut} onPress={() => hapticLight()}>
      <Animated.View style={[styles.dealCard, { transform: [{ scale }], opacity: entrance }]}>
        <LinearGradient colors={["#1A1410", "#161616"]} style={StyleSheet.absoluteFill} />
        <Animated.View style={[styles.dealGlowBorder, { opacity: glowOpacity }]} />
        {/* Image */}
        <View style={styles.dealImageWrap}>
          <Animated.Image
            source={{ uri: image }}
            style={[styles.dealImage, { opacity: imgOpacity }]}
            resizeMode="cover"
            onLoad={onLoad}
          />
          <LinearGradient
            colors={["transparent", "#1A1410"]}
            style={[StyleSheet.absoluteFill, { borderTopLeftRadius: ThreadlyRadius.lg, borderTopRightRadius: ThreadlyRadius.lg }]}
          />
          {/* Savings badge */}
          <View style={styles.savingsBadge}>
            <LinearGradient
              colors={[ThreadlyColors.roseGold, ThreadlyColors.roseGoldLight]}
              style={StyleSheet.absoluteFill}
            />
            <Text style={styles.savingsBadgeText}>{savings}</Text>
          </View>
        </View>
        {/* Info */}
        <View style={styles.dealInfo}>
          <Text style={styles.dealBrand}>{brand.toUpperCase()}</Text>
          <Text style={styles.dealItem} numberOfLines={2}>{item}</Text>
          <View style={styles.dealPriceRow}>
            <Text style={styles.dealSalePrice}>{sale}</Text>
            <Text style={styles.dealOriginalPrice}>{original}</Text>
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
}

// ─── Go New CTA ───────────────────────────────────────────────────────────────

function GoNewCTA({ onPress }: { onPress: () => void }) {
  const { scale, onPressIn, onPressOut } = useScalePress(0.97);
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.04, duration: 1400, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 1400, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.goNewWrap}>
      <Pressable onPressIn={onPressIn} onPressOut={onPressOut} onPress={onPress}>
        <Animated.View style={[styles.goNewBtn, { transform: [{ scale: Animated.multiply(scale, pulse) }] }]}>
          <LinearGradient
            colors={[ThreadlyColors.roseGold, ThreadlyColors.roseGoldLight, ThreadlyColors.roseGold]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
          <Text style={styles.goNewIcon}>✦</Text>
          <Text style={styles.goNewText}>Go New</Text>
          <Text style={styles.goNewSub}>Build a complete look with AI</Text>
        </Animated.View>
      </Pressable>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: ThreadlyColors.black },
  scroll: { paddingBottom: 20 },
  loadingContainer: { padding: 24, gap: 0 },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 20,
  },
  greeting: {
    fontFamily: "Georgia",
    fontSize: 22,
    color: ThreadlyColors.warmWhite,
    lineHeight: 28,
  },
  headerSub: {
    color: ThreadlyColors.warmWhiteMuted,
    fontSize: 13,
    marginTop: 3,
    letterSpacing: 0.3,
  },
  notifBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  notifDot: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: ThreadlyColors.roseGold,
    zIndex: 1,
  },
  notifIcon: { fontSize: 22 },

  // Hero
  heroWrap: { paddingHorizontal: 24, marginBottom: 16 },
  heroCard: {
    width: CARD_W,
    height: 420,
    borderRadius: ThreadlyRadius.xl,
    overflow: "hidden",
    position: "relative",
  },
  heroImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  heroBadgeRow: {
    position: "absolute",
    top: 16,
    left: 16,
    right: 16,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  matchBadge: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  matchBadgeText: {
    color: ThreadlyColors.black,
    fontSize: 14,
    fontWeight: "800",
    lineHeight: 17,
  },
  matchBadgeSub: {
    color: ThreadlyColors.black,
    fontSize: 8,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  ownBadge: {
    backgroundColor: ThreadlyColors.black + "BB",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 0.5,
    borderColor: ThreadlyColors.roseGold + "66",
  },
  ownBadgeText: {
    color: ThreadlyColors.roseGoldLight,
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  heroBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  heroTextWrap: { flex: 1, marginRight: 12 },
  heroLabel: {
    color: ThreadlyColors.roseGold,
    fontSize: 9,
    letterSpacing: 3,
    fontWeight: "600",
    marginBottom: 4,
  },
  heroTagline: {
    fontFamily: "Georgia",
    fontSize: 20,
    color: ThreadlyColors.warmWhite,
    lineHeight: 26,
    marginBottom: 4,
  },
  heroSub: {
    color: ThreadlyColors.warmWhiteMuted,
    fontSize: 12,
    letterSpacing: 0.3,
  },
  heartBtn: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  heartIcon: {
    fontSize: 26,
    color: ThreadlyColors.warmWhite,
  },

  // Insight
  insightBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: ThreadlyRadius.md,
    padding: 14,
    overflow: "hidden",
    position: "relative",
  },
  insightBannerBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: ThreadlyRadius.md,
    borderWidth: 0.5,
    borderColor: ThreadlyColors.roseGold,
    opacity: 0.3,
  },
  insightIcon: { color: ThreadlyColors.roseGold, fontSize: 14 },
  insightText: {
    flex: 1,
    color: ThreadlyColors.warmWhiteMuted,
    fontSize: 12,
    lineHeight: 18,
  },

  // Section header
  sectionHeader: {
    paddingHorizontal: 24,
    marginBottom: 14,
  },
  sectionTitle: {
    fontFamily: "Georgia",
    fontSize: 18,
    color: ThreadlyColors.warmWhite,
    marginBottom: 3,
  },
  sectionSub: {
    color: ThreadlyColors.warmWhiteMuted,
    fontSize: 12,
    letterSpacing: 0.3,
  },

  // Horizontal list
  hList: {
    paddingLeft: 24,
    paddingRight: 12,
    paddingBottom: 24,
    gap: 12,
  },

  // Pick card
  pickCard: {
    width: PICK_W,
    backgroundColor: ThreadlyColors.charcoal,
    borderRadius: ThreadlyRadius.xl,
    overflow: "hidden",
    borderWidth: 0.5,
    borderColor: ThreadlyColors.charcoalLight,
  },
  pickImageWrap: {
    width: PICK_W,
    height: 230,
    position: "relative",
  },
  pickImage: {
    width: "100%",
    height: "100%",
  },
  pickMatchBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: ThreadlyColors.black + "CC",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 0.5,
    borderColor: ThreadlyColors.roseGold + "66",
  },
  pickMatchText: {
    color: ThreadlyColors.roseGoldLight,
    fontSize: 11,
    fontWeight: "700",
  },
  pickHeart: {
    position: "absolute",
    bottom: 10,
    right: 10,
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  pickHeartIcon: {
    fontSize: 20,
    color: ThreadlyColors.warmWhite,
    opacity: 0.8,
  },
  pickHeartSaved: {
    color: ThreadlyColors.roseGold,
    opacity: 1,
  },
  pickInfo: {
    padding: 12,
    gap: 3,
  },
  pickBrand: {
    color: ThreadlyColors.roseGold,
    fontSize: 9,
    letterSpacing: 2,
    fontWeight: "600",
  },
  pickLabel: {
    color: ThreadlyColors.warmWhite,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "500",
  },

  // Trend card
  trendCard: {
    width: TREND_W,
    height: 160,
    borderRadius: ThreadlyRadius.lg,
    overflow: "hidden",
    position: "relative",
  },
  trendImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  trendInfo: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 14,
  },
  trendTitle: {
    color: ThreadlyColors.warmWhite,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 2,
  },
  trendSub: {
    color: ThreadlyColors.warmWhiteMuted,
    fontSize: 11,
  },

  // Deal card
  dealCard: {
    width: DEAL_W,
    borderRadius: ThreadlyRadius.xl,
    overflow: "hidden",
    position: "relative",
    borderWidth: 0.5,
    borderColor: ThreadlyColors.roseGold + "33",
  },
  dealGlowBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: ThreadlyRadius.xl,
    borderWidth: 1,
    borderColor: ThreadlyColors.roseGold,
  },
  dealImageWrap: {
    height: 160,
    position: "relative",
  },
  dealImage: {
    width: "100%",
    height: "100%",
  },
  savingsBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    overflow: "hidden",
  },
  savingsBadgeText: {
    color: ThreadlyColors.black,
    fontSize: 11,
    fontWeight: "800",
  },
  dealInfo: {
    padding: 14,
    gap: 4,
  },
  dealBrand: {
    color: ThreadlyColors.roseGold,
    fontSize: 9,
    letterSpacing: 2,
    fontWeight: "600",
  },
  dealItem: {
    color: ThreadlyColors.warmWhite,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "500",
  },
  dealPriceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  dealSalePrice: {
    color: ThreadlyColors.roseGoldLight,
    fontSize: 15,
    fontWeight: "700",
  },
  dealOriginalPrice: {
    color: ThreadlyColors.warmWhiteMuted,
    fontSize: 12,
    textDecorationLine: "line-through",
    opacity: 0.6,
  },

  // Go New CTA
  goNewWrap: {
    paddingHorizontal: 24,
    marginTop: 8,
  },
  goNewBtn: {
    height: 72,
    borderRadius: ThreadlyRadius.pill,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    flexDirection: "row",
    gap: 10,
  },
  goNewIcon: { fontSize: 18, color: ThreadlyColors.black },
  goNewText: {
    color: ThreadlyColors.black,
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  goNewSub: {
    color: ThreadlyColors.black + "AA",
    fontSize: 12,
    fontWeight: "500",
  },
});
