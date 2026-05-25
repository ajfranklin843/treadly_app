/**
 * Threadly — Closet
 * Digital wardrobe with AI intelligence.
 */

import React from "react";
import { useState, useRef } from "react";
import { ALL_PRODUCT_IMAGES, pickImage } from '@/lib/images';
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
import { useScalePress, useImageFade, hapticLight, hapticSuccess } from '@/lib/animations';
import { LinearGradient } from "expo-linear-gradient";
import { ScreenContainer } from "@/components/screen-container";
import {
  ThreadlyColors,
  ThreadlySpacing,
  ThreadlyRadius,
} from "@/constants/threadly";

const { width } = Dimensions.get("window");
const GRID_GAP = 10;
const GRID_COLS = 3;
const ITEM_W = (width - ThreadlySpacing.screenPadding * 2 - GRID_GAP * (GRID_COLS - 1)) / GRID_COLS;

const CATEGORIES = ["All", "Tops", "Bottoms", "Dresses", "Outerwear", "Shoes", "Bags", "Accessories"];

const CLOSET_ITEMS = [
  { id: "1", name: "Camel Blazer", cat: "Outerwear", worn: 12, image: pickImage(ALL_PRODUCT_IMAGES, 0) },
  { id: "2", name: "Black Tee", cat: "Tops", worn: 28, image: pickImage(ALL_PRODUCT_IMAGES, 1) },
  { id: "3", name: "Wide-Leg Trousers", cat: "Bottoms", worn: 9, image: pickImage(ALL_PRODUCT_IMAGES, 2) },
  { id: "4", name: "White Linen Shirt", cat: "Tops", worn: 15, image: pickImage(ALL_PRODUCT_IMAGES, 3) },
  { id: "5", name: "Straight-Leg Jeans", cat: "Bottoms", worn: 22, image: pickImage(ALL_PRODUCT_IMAGES, 4) },
  { id: "6", name: "Midi Slip Dress", cat: "Dresses", worn: 6, image: pickImage(ALL_PRODUCT_IMAGES, 5) },
  { id: "7", name: "White Sneakers", cat: "Shoes", worn: 31, image: pickImage(ALL_PRODUCT_IMAGES, 6) },
  { id: "8", name: "Leather Tote", cat: "Bags", worn: 18, image: pickImage(ALL_PRODUCT_IMAGES, 7) },
  { id: "9", name: "Trench Coat", cat: "Outerwear", worn: 7, image: pickImage(ALL_PRODUCT_IMAGES, 8) },
  { id: "10", name: "Silk Blouse", cat: "Tops", worn: 5, image: pickImage(ALL_PRODUCT_IMAGES, 9) },
  { id: "11", name: "Mini Skirt", cat: "Bottoms", worn: 4, image: pickImage(ALL_PRODUCT_IMAGES, 10) },
  { id: "12", name: "Gold Hoops", cat: "Accessories", worn: 42, image: pickImage(ALL_PRODUCT_IMAGES, 11) },
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

  const filtered = activeCategory === "All"
    ? CLOSET_ITEMS
    : CLOSET_ITEMS.filter(i => i.cat === activeCategory);

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
            <Text style={styles.headerStatNum}>{CLOSET_ITEMS.length}</Text>
            <Text style={styles.headerStatLabel}>items</Text>
          </View>
        </View>

        {/* Scan CTA */}
        <AnimatedScanCard>
          <LinearGradient colors={["#1A0E08", "#2A1A10"]} style={StyleSheet.absoluteFill} />
          <View style={styles.scanCardBorder} />
          <View style={styles.scanCardContent}>
            <View style={styles.scanIcon}>
              <Text style={styles.scanIconText}>+</Text>
            </View>
            <View style={styles.scanCardText}>
              <Text style={styles.scanCardTitle}>Scan a New Item</Text>
              <Text style={styles.scanCardSub}>Point your camera at any garment</Text>
            </View>
            <Text style={styles.scanCardArrow}>→</Text>
          </View>
        </AnimatedScanCard>

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

        {/* Items Grid */}
        <View style={styles.itemGrid}>
          {filtered.map(item => (
            <AnimatedItemCard key={item.id} item={item} width={ITEM_W}>
              <View style={styles.itemImageWrap}>
                <Image source={{ uri: item.image }} style={styles.itemImage} resizeMode="cover" />
                <View style={styles.itemWornBadge}>
                  <Text style={styles.itemWornText}>{item.worn}x</Text>
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
    </ScreenContainer>
  );
}

// ─── Animated Scan Card ───────────────────────────────────────────────────────────

function AnimatedScanCard({ children }: { children: React.ReactNode }) {
  const { scale, onPressIn, onPressOut } = useScalePress(0.97);
  const glowOpacity = useRef(new Animated.Value(0)).current;
  const handlePressIn = () => {
    onPressIn();
    Animated.timing(glowOpacity, { toValue: 1, duration: 80, useNativeDriver: true }).start();
  };
  const handlePressOut = () => {
    onPressOut();
    Animated.timing(glowOpacity, { toValue: 0, duration: 200, useNativeDriver: true }).start();
  };
  return (
    <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut} onPress={() => hapticSuccess()}>
      <Animated.View style={[styles.scanCard, { transform: [{ scale }] }]}>
        {children}
        <Animated.View
          pointerEvents="none"
          style={[StyleSheet.absoluteFill, { borderRadius: ThreadlyRadius.xl, borderWidth: 1, borderColor: ThreadlyColors.roseGold, opacity: glowOpacity }]}
        />
      </Animated.View>
    </Pressable>
  );
}

// ─── Animated Item Card ───────────────────────────────────────────────────────────

function AnimatedItemCard({ children, item, width }: { children: React.ReactNode; item: { id: string }; width: number }) {
  const { scale, onPressIn, onPressOut } = useScalePress(0.96);
  return (
    <Pressable onPressIn={onPressIn} onPressOut={onPressOut} onPress={() => hapticLight()}>
      <Animated.View style={[styles.itemCard, { width }, { transform: [{ scale }] }]}>
        {children}
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
  scanCard: {
    marginHorizontal: ThreadlySpacing.screenPadding,
    borderRadius: ThreadlyRadius.xl,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(201,149,106,0.2)",
    marginBottom: 20,
  },
  scanCardBorder: {
    position: "absolute", top: 0, left: 0, right: 0, height: 1,
    backgroundColor: ThreadlyColors.roseGold, opacity: 0.4,
  },
  scanCardContent: { flexDirection: "row", alignItems: "center", padding: 18, gap: 14 },
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
  itemImageWrap: { height: ITEM_W, position: "relative" },
  itemImage: { width: "100%", height: "100%" },
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
});
