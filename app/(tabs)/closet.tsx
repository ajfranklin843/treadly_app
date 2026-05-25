/**
 * Threadly — Closet
 * Digital wardrobe with AI intelligence.
 * Wired to ClosetScanModal — the "holy shit" product moment.
 */

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { VIBE_DEAL_POOL, pickVibeImage } from "@/lib/images";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Image,
  Animated,
  Pressable,
} from "react-native";
import { useScalePress, hapticLight, hapticSuccess } from "@/lib/animations";
import { LinearGradient } from "expo-linear-gradient";
import { ScreenContainer } from "@/components/screen-container";
import { ThreadlyColors, ThreadlySpacing, ThreadlyRadius } from "@/constants/threadly";
import { ClosetScanModal, ScannedItem } from "@/components/closet-scan-modal";
import { ItemIntelligenceSheet, WardrobeItem } from "@/components/item-intelligence-sheet";
import { getStyleProfile } from "@/lib/onboarding-store";

const { width } = Dimensions.get("window");
const GRID_GAP = 10;
const GRID_COLS = 3;
const ITEM_W = (width - ThreadlySpacing.screenPadding * 2 - GRID_GAP * (GRID_COLS - 1)) / GRID_COLS;

const CATEGORIES = ["All", "Tops", "Bottoms", "Dresses", "Outerwear", "Shoes", "Bags", "Accessories"];

type ClosetItem = {
  id: string;
  name: string;
  cat: string;
  worn: number;
  image: string;
  isNew?: boolean;
};

// Initial items use vibe-matched images from VIBE_DEAL_POOL (default vibe; overridden once profile loads)
const INITIAL_ITEMS: ClosetItem[] = [
  { id: "1",  name: "Camel Blazer",        cat: "Outerwear",   worn: 12, image: pickVibeImage(VIBE_DEAL_POOL, "Quiet Luxury", 0) },
  { id: "2",  name: "Black Tee",           cat: "Tops",        worn: 28, image: pickVibeImage(VIBE_DEAL_POOL, "Minimal", 1) },
  { id: "3",  name: "Wide-Leg Trousers",   cat: "Bottoms",     worn: 9,  image: pickVibeImage(VIBE_DEAL_POOL, "Old Money", 2) },
  { id: "4",  name: "White Linen Shirt",   cat: "Tops",        worn: 15, image: pickVibeImage(VIBE_DEAL_POOL, "Clean Girl", 0) },
  { id: "5",  name: "Straight-Leg Jeans",  cat: "Bottoms",     worn: 22, image: pickVibeImage(VIBE_DEAL_POOL, "Casual Luxe", 1) },
  { id: "6",  name: "Midi Slip Dress",     cat: "Dresses",     worn: 6,  image: pickVibeImage(VIBE_DEAL_POOL, "Chic", 2) },
  { id: "7",  name: "White Sneakers",      cat: "Shoes",       worn: 31, image: pickVibeImage(VIBE_DEAL_POOL, "Streetwear", 0) },
  { id: "8",  name: "Leather Tote",        cat: "Bags",        worn: 18, image: pickVibeImage(VIBE_DEAL_POOL, "Old Money", 3) },
  { id: "9",  name: "Trench Coat",         cat: "Outerwear",   worn: 7,  image: pickVibeImage(VIBE_DEAL_POOL, "Quiet Luxury", 1) },
  { id: "10", name: "Silk Blouse",         cat: "Tops",        worn: 5,  image: pickVibeImage(VIBE_DEAL_POOL, "Chic", 0) },
  { id: "11", name: "Mini Skirt",          cat: "Bottoms",     worn: 4,  image: pickVibeImage(VIBE_DEAL_POOL, "Minimal", 3) },
  { id: "12", name: "Gold Hoops",          cat: "Accessories", worn: 42, image: pickVibeImage(VIBE_DEAL_POOL, "Clean Girl", 2) },
];

const COLOR_DNA = [
  { hex: "#1A1A1A", label: "Black", pct: 38 },
  { hex: "#C4A882", label: "Camel", pct: 22 },
  { hex: "#FAF7F4", label: "White", pct: 18 },
  { hex: "#8B7355", label: "Tan", pct: 12 },
  { hex: "#C9956A", label: "Rose", pct: 10 },
];

const BRAND_BREAKDOWN = [
  { brand: "Zara", count: 14, pct: 35 },
  { brand: "Mango", count: 8, pct: 20 },
  { brand: "H&M", count: 6, pct: 15 },
  { brand: "Uniqlo", count: 5, pct: 12 },
  { brand: "Other", count: 7, pct: 18 },
];

export default function ClosetScreen() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [showScanModal, setShowScanModal] = useState(false);
  const [closetItems, setClosetItems] = useState<ClosetItem[]>(INITIAL_ITEMS);
  const [userVibe, setUserVibe] = useState("Minimal");
  const [selectedItem, setSelectedItem] = useState<WardrobeItem | null>(null);
  const [showIntelSheet, setShowIntelSheet] = useState(false);
  // Recently learned: scanned items stored in order, most recent first
  const [recentlyLearned, setRecentlyLearned] = useState<ScannedItem[]>([]);

  // Load user vibe from profile
  useEffect(() => {
    getStyleProfile().then(profile => {
      if (profile?.styleVibes?.[0]) {
        setUserVibe(profile.styleVibes[0]);
      }
    }).catch(() => {});
  }, []);

  const handleItemAdded = useCallback((scanned: ScannedItem) => {
    const newItem: ClosetItem = {
      id: scanned.id,
      name: scanned.name,
      cat: scanned.category,
      worn: 0,
      image: scanned.image,
      isNew: true,
    };
    // Prepend the new item so it appears first in the grid
    setClosetItems(prev => [newItem, ...prev]);
    // Add to recently learned (keep last 10)
    setRecentlyLearned(prev => [scanned, ...prev].slice(0, 10));
    hapticSuccess();
  }, []);

  const handleItemTap = useCallback((item: ClosetItem) => {
    hapticLight();
    setSelectedItem({
      id: item.id,
      image: item.image,
      category: item.cat,
      label: item.name,
      matchPct: 87,
      outfitCount: Math.max(4, item.worn),
      closetIqBoost: 3,
      pairsWell: ["Straight-Leg Jeans", "Silk Blouse", "Loafers", "Trench Coat"],
      occasions: ["Casual", "Work", "Date Night"],
      aestheticTags: ["Quiet Luxury", "Minimal", "Timeless"],
      trendingIn: userVibe,
    });
    setShowIntelSheet(true);
  }, [userVibe]);

  const handleScannedItemTap = useCallback((scanned: ScannedItem) => {
    hapticLight();
    setSelectedItem({
      id: scanned.id,
      image: scanned.image,
      category: scanned.category,
      label: scanned.name,
      brand: scanned.brand,
      colorHex: scanned.colorHex,
      colorName: scanned.color,
      matchPct: scanned.matchScore,
      outfitCount: scanned.outfitCount,
      closetIqBoost: scanned.closetIQ,
      pairsWell: scanned.pairsWith,
      occasions: scanned.occasions,
      aestheticTags: [scanned.styleTag, userVibe, "Timeless"],
      trendingIn: scanned.trendingIn,
    });
    setShowIntelSheet(true);
  }, [userVibe]);

  const filtered = useMemo(() =>
    activeCategory === "All" ? closetItems : closetItems.filter(i => i.cat === activeCategory),
    [activeCategory, closetItems]
  );

  return (
    <ScreenContainer containerClassName="bg-[#0A0A0A]" edges={["top", "left", "right"]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerLabel}>YOUR CLOSET</Text>
            <Text style={styles.headerTitle}>Wardrobe Intelligence</Text>
          </View>
          <View style={styles.headerStats}>
            <Text style={styles.headerStatNum}>{closetItems.length}</Text>
            <Text style={styles.headerStatLabel}>items</Text>
          </View>
        </View>

        {/* Scan CTA — the entry point to the "holy shit" moment */}
        <ScanCTA onPress={() => setShowScanModal(true)} />

        {/* AI Analysis */}
        <View style={styles.analysisCard}>
          <LinearGradient colors={["#1A1410", "#1A1A1A"]} style={StyleSheet.absoluteFill} />
          <View style={styles.analysisCardBorder} />
          <Text style={styles.analysisLabel}>CLOSET ANALYSIS</Text>
          <Text style={styles.analysisTitle}>Your Wardrobe DNA</Text>

          <View style={styles.styleProfileRow}>
            <Text style={styles.styleProfileKey}>Style Profile</Text>
            <View style={styles.styleProfileTags}>
              {["Classic", "Minimal", "Feminine"].map(tag => (
                <View key={tag} style={styles.styleTag}>
                  <Text style={styles.styleTagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.matchRow}>
            {[
              { label: "Work", score: 98 },
              { label: "Date Night", score: 92 },
              { label: "Weekend", score: 87 },
            ].map(m => (
              <View key={m.label} style={styles.matchCard}>
                <Text style={styles.matchScore}>{m.score}%</Text>
                <Text style={styles.matchLabel}>{m.label}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.colorDnaLabel}>Color DNA</Text>
          <View style={styles.colorDnaRow}>
            {COLOR_DNA.map(c => (
              <View key={c.hex} style={styles.colorDnaItem}>
                <View style={[
                  styles.colorDnaDot,
                  { backgroundColor: c.hex },
                  c.hex === "#FAF7F4" ? { borderWidth: 1, borderColor: ThreadlyColors.charcoalLight } : {},
                ]} />
                <Text style={styles.colorDnaName}>{c.label}</Text>
                <Text style={styles.colorDnaPct}>{c.pct}%</Text>
              </View>
            ))}
          </View>

          <Text style={styles.brandLabel}>Top Brands</Text>
          <View style={styles.brandList}>
            {BRAND_BREAKDOWN.map(b => (
              <View key={b.brand} style={styles.brandRow}>
                <Text style={styles.brandName}>{b.brand}</Text>
                <View style={styles.brandBarWrap}>
                  <View style={[styles.brandBar, { width: `${b.pct}%` }]} />
                </View>
                <Text style={styles.brandCount}>{b.count}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Category Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
          style={styles.categoryScroll}
        >
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[styles.categoryChip, activeCategory === cat && styles.categoryChipActive]}
              onPress={() => setActiveCategory(cat)}
              activeOpacity={0.7}
            >
              <Text style={[styles.categoryChipText, activeCategory === cat && styles.categoryChipTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Recently Learned Row */}
        {recentlyLearned.length > 0 && (
          <RecentlyLearnedRow items={recentlyLearned} onItemTap={handleScannedItemTap} />
        )}

        {/* Items Grid */}
        <View style={styles.itemGrid}>
          {filtered.map((item, idx) => (
            <AnimatedItemCard key={item.id} item={item} width={ITEM_W} isNew={item.isNew} index={idx} onPress={() => handleItemTap(item)}>
              <View style={styles.itemImageWrap}>
                <Image source={{ uri: item.image }} style={styles.itemImage} resizeMode="cover" />
                {item.isNew && (
                  <View style={styles.newBadge}>
                    <Text style={styles.newBadgeText}>NEW</Text>
                  </View>
                )}
                <View style={styles.itemWornBadge}>
                  <Text style={styles.itemWornText}>{item.worn === 0 ? "✦" : `${item.worn}x`}</Text>
                </View>
              </View>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.itemCat}>{item.cat}</Text>
              </View>
            </AnimatedItemCard>
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* The "holy shit" scan modal */}
      <ClosetScanModal
        visible={showScanModal}
        onClose={() => setShowScanModal(false)}
        onItemAdded={handleItemAdded}
        userVibe={userVibe}
      />

      {/* Item Intelligence Sheet */}
      <ItemIntelligenceSheet
        item={selectedItem}
        visible={showIntelSheet}
        onClose={() => setShowIntelSheet(false)}
      />
    </ScreenContainer>
  );
}

// ─── Scan CTA ─────────────────────────────────────────────────────────────────

function ScanCTA({ onPress }: { onPress: () => void }) {
  const { scale, onPressIn, onPressOut } = useScalePress(0.97);
  const glowOpacity = useRef(new Animated.Value(0)).current;
  const ringScale = useRef(new Animated.Value(1)).current;

  // Pulsing ring animation
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(ringScale, { toValue: 1.08, duration: 1600, useNativeDriver: true }),
        Animated.timing(ringScale, { toValue: 1, duration: 1600, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  function handlePressIn() {
    onPressIn();
    Animated.timing(glowOpacity, { toValue: 1, duration: 80, useNativeDriver: true }).start();
  }
  function handlePressOut() {
    onPressOut();
    Animated.timing(glowOpacity, { toValue: 0, duration: 220, useNativeDriver: true }).start();
  }

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
    >
      <Animated.View style={[styles.scanCard, { transform: [{ scale }] }]}>
        <LinearGradient colors={["#1A0E08", "#2A1A10"]} style={StyleSheet.absoluteFill} />
        <View style={styles.scanCardBorder} />
        <View style={styles.scanCardContent}>
          {/* Pulsing icon */}
          <View style={styles.scanIconWrap}>
            <Animated.View
              style={[
                styles.scanIconRing,
                { transform: [{ scale: ringScale }], opacity: 0.35 },
              ]}
            />
            <View style={styles.scanIcon}>
              <Text style={styles.scanIconText}>+</Text>
            </View>
          </View>
          <View style={styles.scanCardText}>
            <Text style={styles.scanCardTitle}>Scan a New Item</Text>
            <Text style={styles.scanCardSub}>Threadly will learn your style</Text>
          </View>
          <Text style={styles.scanCardArrow}>→</Text>
        </View>
        {/* Glow border on press */}
        <Animated.View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            {
              borderRadius: ThreadlyRadius.xl,
              borderWidth: 1,
              borderColor: ThreadlyColors.roseGold,
              opacity: glowOpacity,
            },
          ]}
        />
      </Animated.View>
    </Pressable>
  );
}

// ─── Animated Item Card ───────────────────────────────────────────────────────

function AnimatedItemCard({
  children,
  item,
  width: cardWidth,
  isNew = false,
  index,
  onPress,
}: {
  children: React.ReactNode;
  item: { id: string };
  width: number;
  isNew?: boolean;
  index: number;
  onPress?: () => void;
}) {
  const { scale, onPressIn, onPressOut } = useScalePress(0.96);
  const entranceOpacity = useRef(new Animated.Value(isNew ? 0 : 1)).current;
  const entranceScale = useRef(new Animated.Value(isNew ? 0.85 : 1)).current;

  useEffect(() => {
    if (isNew) {
      Animated.parallel([
        Animated.timing(entranceOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.spring(entranceScale, { toValue: 1, tension: 70, friction: 10, useNativeDriver: true }),
      ]).start();
    }
  }, [isNew]);

  return (
    <Pressable onPressIn={onPressIn} onPressOut={onPressOut} onPress={onPress ?? (() => hapticLight())}>
      <Animated.View
        style={[
          styles.itemCard,
          { width: cardWidth },
          {
            transform: [{ scale }, { scale: entranceScale }],
            opacity: entranceOpacity,
          },
          isNew && styles.itemCardNew,
        ]}
      >
        {children}
      </Animated.View>
    </Pressable>
  );
}

// ─── Recently Learned Row ────────────────────────────────────────────────────

function RecentlyLearnedRow({
  items,
  onItemTap,
}: {
  items: ScannedItem[];
  onItemTap: (item: ScannedItem) => void;
}) {
  const entranceY = useRef(new Animated.Value(20)).current;
  const entranceOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(entranceY, { toValue: 0, duration: 400, useNativeDriver: true }),
      Animated.timing(entranceOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.recentSection,
        { transform: [{ translateY: entranceY }], opacity: entranceOpacity },
      ]}
    >
      <View style={styles.recentHeader}>
        <Text style={styles.recentLabel}>RECENTLY LEARNED</Text>
        <View style={styles.recentBadge}>
          <Text style={styles.recentBadgeText}>✦ THREADLY KNOWS</Text>
        </View>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.recentList}
      >
        {items.map((item, idx) => (
          <RecentItemCard key={item.id} item={item} index={idx} onPress={() => onItemTap(item)} />
        ))}
      </ScrollView>
    </Animated.View>
  );
}

function RecentItemCard({
  item,
  index,
  onPress,
}: {
  item: ScannedItem;
  index: number;
  onPress: () => void;
}) {
  const { scale, onPressIn, onPressOut } = useScalePress(0.95);
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const cardY = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(cardOpacity, { toValue: 1, duration: 350, useNativeDriver: true }),
        Animated.timing(cardY, { toValue: 0, duration: 350, useNativeDriver: true }),
      ]).start();
    }, index * 80);
  }, []);

  return (
    <Pressable onPressIn={onPressIn} onPressOut={onPressOut} onPress={onPress}>
      <Animated.View
        style={[
          styles.recentCard,
          { transform: [{ scale }, { translateY: cardY }], opacity: cardOpacity },
        ]}
      >
        <Image source={{ uri: item.image }} style={styles.recentImage} resizeMode="cover" />
        <LinearGradient
          colors={["transparent", "rgba(10,10,10,0.85)"]}
          style={StyleSheet.absoluteFill}
        />
        {/* Match score badge */}
        <View style={styles.recentMatchBadge}>
          <Text style={styles.recentMatchText}>{item.matchScore}%</Text>
        </View>
        {/* NEW badge */}
        <View style={styles.recentNewBadge}>
          <Text style={styles.recentNewText}>NEW</Text>
        </View>
        <View style={styles.recentCardInfo}>
          <Text style={styles.recentCardName} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.recentCardBrand}>{item.brand}</Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: ThreadlyColors.black },
  scrollContent: { paddingBottom: 32 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: ThreadlySpacing.screenPadding,
    paddingTop: 24,
    paddingBottom: 20,
  },
  headerLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: ThreadlyColors.roseGold,
    letterSpacing: 2,
    marginBottom: 4,
  },
  headerTitle: { fontSize: 26, fontFamily: "Georgia", color: ThreadlyColors.warmWhite },
  headerStats: {
    alignItems: "center",
    backgroundColor: ThreadlyColors.charcoal,
    borderRadius: ThreadlyRadius.lg,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "rgba(201,149,106,0.2)",
  },
  headerStatNum: { fontSize: 22, fontFamily: "Georgia", color: ThreadlyColors.roseGoldLight, lineHeight: 24 },
  headerStatLabel: { fontSize: 9, color: ThreadlyColors.warmWhiteSubtle, letterSpacing: 1 },

  // Scan CTA
  scanCard: {
    marginHorizontal: ThreadlySpacing.screenPadding,
    borderRadius: ThreadlyRadius.xl,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(201,149,106,0.25)",
    marginBottom: 20,
  },
  scanCardBorder: {
    position: "absolute", top: 0, left: 0, right: 0, height: 1,
    backgroundColor: ThreadlyColors.roseGold, opacity: 0.45,
  },
  scanCardContent: { flexDirection: "row", alignItems: "center", padding: 18, gap: 14 },
  scanIconWrap: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  scanIconRing: {
    position: "absolute",
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: ThreadlyColors.roseGold,
  },
  scanIcon: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: "rgba(201,149,106,0.15)",
    alignItems: "center", justifyContent: "center",
    borderWidth: 1, borderColor: "rgba(201,149,106,0.3)",
  },
  scanIconText: { fontSize: 24, color: ThreadlyColors.roseGold, fontWeight: "300" },
  scanCardText: { flex: 1 },
  scanCardTitle: { fontSize: 15, fontFamily: "Georgia", color: ThreadlyColors.warmWhite, marginBottom: 3 },
  scanCardSub: { fontSize: 12, color: ThreadlyColors.warmWhiteSubtle },
  scanCardArrow: { fontSize: 18, color: ThreadlyColors.warmWhiteMuted },

  // Analysis card
  analysisCard: {
    marginHorizontal: ThreadlySpacing.screenPadding,
    borderRadius: ThreadlyRadius.xl,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(201,149,106,0.2)",
    padding: 20,
    marginBottom: 24,
  },
  analysisCardBorder: {
    position: "absolute", top: 0, left: 0, right: 0, height: 1,
    backgroundColor: ThreadlyColors.roseGold, opacity: 0.4,
  },
  analysisLabel: { fontSize: 9, fontWeight: "700", color: ThreadlyColors.roseGold, letterSpacing: 2, marginBottom: 6 },
  analysisTitle: { fontSize: 20, fontFamily: "Georgia", color: ThreadlyColors.warmWhite, marginBottom: 16 },
  styleProfileRow: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 16, flexWrap: "wrap" },
  styleProfileKey: { fontSize: 11, color: ThreadlyColors.warmWhiteSubtle, fontWeight: "600" },
  styleProfileTags: { flexDirection: "row", gap: 6, flexWrap: "wrap" },
  styleTag: {
    backgroundColor: "rgba(201,149,106,0.12)",
    borderWidth: 1, borderColor: "rgba(201,149,106,0.3)",
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: ThreadlyRadius.pill,
  },
  styleTagText: { fontSize: 11, color: ThreadlyColors.roseGoldLight, fontWeight: "600" },
  matchRow: { flexDirection: "row", gap: 8, marginBottom: 20 },
  matchCard: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: ThreadlyRadius.md,
    padding: 12, alignItems: "center",
    borderWidth: 1, borderColor: ThreadlyColors.charcoalLight,
  },
  matchScore: { fontSize: 18, fontFamily: "Georgia", color: ThreadlyColors.roseGoldLight, marginBottom: 3 },
  matchLabel: { fontSize: 9, color: ThreadlyColors.warmWhiteSubtle, letterSpacing: 0.5, textAlign: "center" },
  colorDnaLabel: { fontSize: 10, fontWeight: "700", color: ThreadlyColors.warmWhiteSubtle, letterSpacing: 1.5, marginBottom: 10 },
  colorDnaRow: { flexDirection: "row", gap: 8, marginBottom: 20 },
  colorDnaItem: { alignItems: "center", gap: 4 },
  colorDnaDot: { width: 32, height: 32, borderRadius: 16 },
  colorDnaName: { fontSize: 9, color: ThreadlyColors.warmWhiteSubtle },
  colorDnaPct: { fontSize: 10, fontWeight: "700", color: ThreadlyColors.warmWhiteMuted },
  brandLabel: { fontSize: 10, fontWeight: "700", color: ThreadlyColors.warmWhiteSubtle, letterSpacing: 1.5, marginBottom: 10 },
  brandList: { gap: 8 },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  brandName: { fontSize: 12, color: ThreadlyColors.warmWhiteMuted, width: 52 },
  brandBarWrap: { flex: 1, height: 4, backgroundColor: ThreadlyColors.charcoalLight, borderRadius: 2, overflow: "hidden" },
  brandBar: { height: "100%", backgroundColor: ThreadlyColors.roseGold, borderRadius: 2 },
  brandCount: { fontSize: 11, color: ThreadlyColors.warmWhiteSubtle, width: 20, textAlign: "right" },

  // Category filter
  categoryScroll: { marginBottom: 16 },
  categoryList: { paddingHorizontal: ThreadlySpacing.screenPadding, gap: 8 },
  categoryChip: {
    paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: ThreadlyRadius.pill,
    backgroundColor: ThreadlyColors.charcoal,
    borderWidth: 1, borderColor: ThreadlyColors.charcoalLight,
  },
  categoryChipActive: { backgroundColor: "rgba(201,149,106,0.15)", borderColor: ThreadlyColors.roseGold },
  categoryChipText: { fontSize: 12, color: ThreadlyColors.warmWhiteSubtle, fontWeight: "600" },
  categoryChipTextActive: { color: ThreadlyColors.roseGoldLight },

  // Item grid
  itemGrid: {
    paddingHorizontal: ThreadlySpacing.screenPadding,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: GRID_GAP,
  },
  itemCard: {
    backgroundColor: ThreadlyColors.charcoal,
    borderRadius: ThreadlyRadius.lg,
    overflow: "hidden",
    borderWidth: 1, borderColor: ThreadlyColors.charcoalLight,
  },
  itemCardNew: {
    borderColor: "rgba(201,149,106,0.5)",
  },
  itemImageWrap: { height: ITEM_W, position: "relative" },
  itemImage: { width: "100%", height: "100%" },
  newBadge: {
    position: "absolute", top: 6, left: 6,
    backgroundColor: ThreadlyColors.roseGold,
    paddingHorizontal: 5, paddingVertical: 2,
    borderRadius: 4,
  },
  newBadgeText: { fontSize: 7, fontWeight: "800", color: "#0A0A0A", letterSpacing: 0.5 },
  itemWornBadge: {
    position: "absolute", top: 6, right: 6,
    backgroundColor: "rgba(10,10,10,0.7)",
    paddingHorizontal: 6, paddingVertical: 2,
    borderRadius: ThreadlyRadius.pill,
  },
  itemWornText: { fontSize: 9, fontWeight: "700", color: ThreadlyColors.warmWhiteSubtle },
  itemInfo: { padding: 8 },
  itemName: { fontSize: 11, color: ThreadlyColors.warmWhite, fontWeight: "600", marginBottom: 2 },
  itemCat: { fontSize: 9, color: ThreadlyColors.warmWhiteSubtle, letterSpacing: 0.5 },

  // Recently Learned
  recentSection: {
    marginBottom: 20,
  },
  recentHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: ThreadlySpacing.screenPadding,
    marginBottom: 12,
  },
  recentLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "rgba(255,255,255,0.35)",
    letterSpacing: 2,
  },
  recentBadge: {
    backgroundColor: "rgba(201,149,106,0.12)",
    borderWidth: 1,
    borderColor: "rgba(201,149,106,0.3)",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  recentBadgeText: {
    fontSize: 9,
    fontWeight: "700",
    color: ThreadlyColors.roseGold,
    letterSpacing: 1,
  },
  recentList: {
    paddingHorizontal: ThreadlySpacing.screenPadding,
    gap: 10,
  },
  recentCard: {
    width: 120,
    height: 160,
    borderRadius: ThreadlyRadius.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(201,149,106,0.4)",
    position: "relative",
  },
  recentImage: {
    width: "100%",
    height: "100%",
  },
  recentMatchBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(201,149,106,0.85)",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  recentMatchText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#0A0A0A",
  },
  recentNewBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: ThreadlyColors.roseGold,
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  recentNewText: {
    fontSize: 7,
    fontWeight: "800",
    color: "#0A0A0A",
    letterSpacing: 0.5,
  },
  recentCardInfo: {
    position: "absolute",
    bottom: 8,
    left: 8,
    right: 8,
  },
  recentCardName: {
    fontSize: 11,
    fontWeight: "700",
    color: ThreadlyColors.warmWhite,
    marginBottom: 1,
  },
  recentCardBrand: {
    fontSize: 9,
    color: "rgba(255,255,255,0.5)",
    letterSpacing: 0.5,
  },
});
