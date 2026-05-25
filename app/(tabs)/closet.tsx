/**
 * Threadly — Closet
 * Digital wardrobe with AI intelligence. Not just an organizer —
 * a living style data layer that powers every recommendation.
 * Emotional outcome: "My closet finally makes sense."
 */

import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ScreenContainer } from "@/components/screen-container";
import {
  ThreadlyColors,
  ThreadlySpacing,
  ThreadlyRadius,
  ThreadlyShadow,
} from "@/constants/threadly";

const { width } = Dimensions.get("window");
const ITEM_W = (width - ThreadlySpacing.screenPadding * 2 - 12) / 3;

const CATEGORIES = ["All", "Tops", "Bottoms", "Dresses", "Shoes", "Bags", "Accessories"];

const WARDROBE_ITEMS = [
  { id: "1", name: "Camel Blazer", category: "Tops", color: "#C4A882", brand: "Zara", worn: 12, cost: 89 },
  { id: "2", name: "Black Tee", category: "Tops", color: "#1A1A1A", brand: "Everlane", worn: 28, cost: 35 },
  { id: "3", name: "White Shirt", category: "Tops", color: "#FAF7F4", brand: "Uniqlo", worn: 18, cost: 30 },
  { id: "4", name: "Silk Blouse", category: "Tops", color: "#E8C4B4", brand: "Mango", worn: 3, cost: 65 },
  { id: "5", name: "Wide-Leg Trousers", category: "Bottoms", color: "#2C2416", brand: "Arket", worn: 15, cost: 95 },
  { id: "6", name: "Straight Jeans", category: "Bottoms", color: "#4A4A5A", brand: "Levi's", worn: 22, cost: 80 },
  { id: "7", name: "Mini Skirt", category: "Bottoms", color: "#C9956A", brand: "Zara", worn: 2, cost: 45 },
  { id: "8", name: "Midi Dress", category: "Dresses", color: "#8B7355", brand: "& Other Stories", worn: 8, cost: 120 },
  { id: "9", name: "Black Dress", category: "Dresses", color: "#0A0A0A", brand: "COS", worn: 14, cost: 110 },
  { id: "10", name: "Heeled Mules", category: "Shoes", color: "#C4A882", brand: "Steve Madden", worn: 10, cost: 75 },
  { id: "11", name: "White Sneakers", category: "Shoes", color: "#F5F5F0", brand: "Adidas", worn: 30, cost: 90 },
  { id: "12", name: "Mini Bag", category: "Bags", color: "#C9956A", brand: "Coach", worn: 20, cost: 180 },
  { id: "13", name: "Tote Bag", category: "Bags", color: "#8B7355", brand: "Cuyana", worn: 25, cost: 150 },
  { id: "14", name: "Gold Hoops", category: "Accessories", color: "#C9956A", brand: "Mejuri", worn: 35, cost: 55 },
  { id: "15", name: "Silk Scarf", category: "Accessories", color: "#E8B89A", brand: "Zara", worn: 2, cost: 25 },
];

const ANALYSIS = {
  totalItems: 47,
  totalValue: 3240,
  costPerWear: 8.2,
  topColors: [
    { name: "Neutral", hex: "#C4A882", pct: 38 },
    { name: "Black", hex: "#1A1A1A", pct: 28 },
    { name: "White", hex: "#FAF7F4", pct: 18 },
    { name: "Blush", hex: "#E8C4B4", pct: 10 },
    { name: "Denim", hex: "#4A4A5A", pct: 6 },
  ],
  styleProfile: ["Minimal", "Classic", "Elevated Casual"],
  topBrands: ["Zara", "Everlane", "Uniqlo", "Mango", "Levi's"],
  underused: 12,
};

export default function ClosetScreen() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = activeCategory === "All"
    ? WARDROBE_ITEMS
    : WARDROBE_ITEMS.filter(i => i.category === activeCategory);

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
            <Text style={styles.eyebrow}>YOUR WARDROBE</Text>
            <Text style={styles.headline}>My Closet</Text>
          </View>
          <TouchableOpacity style={styles.scanBtn} activeOpacity={0.85}>
            <LinearGradient
              colors={[ThreadlyColors.roseGold, ThreadlyColors.roseGoldLight]}
              style={styles.scanBtnGradient}
            >
              <Text style={styles.scanBtnText}>⊕  Scan Item</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Stats Strip */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.statsStrip}
        >
          {[
            { value: ANALYSIS.totalItems.toString(), label: "Items" },
            { value: `$${ANALYSIS.totalValue.toLocaleString()}`, label: "Total Value" },
            { value: `$${ANALYSIS.costPerWear}`, label: "Cost/Wear" },
            { value: ANALYSIS.underused.toString(), label: "Underused" },
          ].map((stat, i) => (
            <View key={i} style={styles.statChip}>
              <Text style={styles.statChipValue}>{stat.value}</Text>
              <Text style={styles.statChipLabel}>{stat.label}</Text>
            </View>
          ))}
        </ScrollView>

        {/* AI Intelligence Card */}
        <View style={styles.intelligenceCard}>
          <LinearGradient colors={["#1A1410", "#1A1A1A"]} style={StyleSheet.absoluteFill} />
          <View style={styles.intelligenceCardBorder} />

          <Text style={styles.intelligenceEyebrow}>✦ CLOSET INTELLIGENCE</Text>

          {/* Color DNA */}
          <Text style={styles.intelligenceLabel}>Your Color DNA</Text>
          <View style={styles.colorBars}>
            {ANALYSIS.topColors.map((c, i) => (
              <View key={i} style={styles.colorBarItem}>
                <View style={[styles.colorBarFill, {
                  backgroundColor: c.hex,
                  height: 36 + c.pct * 0.7,
                }]} />
                <Text style={styles.colorBarPct}>{c.pct}%</Text>
                <Text style={styles.colorBarName}>{c.name}</Text>
              </View>
            ))}
          </View>

          {/* Style Profile */}
          <Text style={[styles.intelligenceLabel, { marginTop: 18 }]}>Style Profile</Text>
          <View style={styles.tagRow}>
            {ANALYSIS.styleProfile.map((tag, i) => (
              <View key={i} style={styles.roseTag}>
                <Text style={styles.roseTagText}>{tag}</Text>
              </View>
            ))}
          </View>

          {/* Top Brands */}
          <Text style={[styles.intelligenceLabel, { marginTop: 14 }]}>Your Brands</Text>
          <View style={styles.tagRow}>
            {ANALYSIS.topBrands.map((brand, i) => (
              <View key={i} style={styles.grayTag}>
                <Text style={styles.grayTagText}>{brand}</Text>
              </View>
            ))}
          </View>

          {/* Insight */}
          <View style={styles.insightRow}>
            <Text style={styles.insightIcon}>✦</Text>
            <Text style={styles.insightText}>
              {ANALYSIS.underused} items worn less than 3 times.{" "}
              <Text style={styles.insightHighlight}>
                Your AI can build new looks from them today.
              </Text>
            </Text>
          </View>
        </View>

        {/* Category Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryStrip}
        >
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[styles.categoryChip, activeCategory === cat && styles.categoryChipActive]}
              onPress={() => setActiveCategory(cat)}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.categoryChipText,
                activeCategory === cat && styles.categoryChipTextActive,
              ]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Grid Header */}
        <View style={styles.gridHeader}>
          <Text style={styles.gridCount}>{filtered.length} items</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.sortBtn}>Sort ↕</Text>
          </TouchableOpacity>
        </View>

        {/* Wardrobe Grid */}
        <View style={styles.grid}>
          {filtered.map(item => {
            const cpw = (item.cost / Math.max(item.worn, 1)).toFixed(1);
            const isUnderused = item.worn < 4;
            return (
              <TouchableOpacity key={item.id} style={styles.wardrobeItem} activeOpacity={0.85}>
                <View style={[styles.wardrobeItemSwatch, { backgroundColor: item.color }]}>
                  {isUnderused && <View style={styles.underusedDot} />}
                </View>
                <View style={styles.wardrobeItemInfo}>
                  <Text style={styles.wardrobeItemName} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.wardrobeItemBrand} numberOfLines={1}>{item.brand}</Text>
                  <Text style={styles.wardrobeItemCpw}>${cpw}/wear</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Scan CTA */}
        <TouchableOpacity style={styles.bigScanCta} activeOpacity={0.85}>
          <LinearGradient colors={["#1A1A1A", "#252525"]} style={StyleSheet.absoluteFill} />
          <View style={styles.bigScanCtaBorder} />
          <Text style={styles.bigScanIcon}>◈</Text>
          <Text style={styles.bigScanTitle}>Scan your closet</Text>
          <Text style={styles.bigScanSub}>
            Point your camera at any item.{"\n"}AI identifies brand, category & color instantly.
          </Text>
          <View style={styles.bigScanBadge}>
            <Text style={styles.bigScanBadgeText}>Tap to start</Text>
          </View>
        </TouchableOpacity>

        <View style={{ height: 32 }} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 24 },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: ThreadlySpacing.screenPadding,
    paddingTop: 20,
    paddingBottom: 16,
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: "700",
    color: ThreadlyColors.roseGold,
    letterSpacing: 2,
    marginBottom: 4,
  },
  headline: {
    fontSize: 28,
    fontFamily: "Georgia",
    color: ThreadlyColors.warmWhite,
  },
  scanBtn: { borderRadius: ThreadlyRadius.pill, overflow: "hidden", ...ThreadlyShadow.roseGlow },
  scanBtnGradient: { paddingHorizontal: 16, paddingVertical: 10 },
  scanBtnText: { fontSize: 13, fontWeight: "700", color: ThreadlyColors.black },

  statsStrip: {
    paddingHorizontal: ThreadlySpacing.screenPadding,
    gap: 10,
    marginBottom: 20,
  },
  statChip: {
    backgroundColor: ThreadlyColors.charcoal,
    borderRadius: ThreadlyRadius.lg,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: ThreadlyColors.charcoalLight,
    minWidth: 80,
  },
  statChipValue: {
    fontSize: 18,
    fontFamily: "Georgia",
    color: ThreadlyColors.roseGoldLight,
    marginBottom: 2,
  },
  statChipLabel: {
    fontSize: 10,
    color: ThreadlyColors.warmWhiteSubtle,
    letterSpacing: 0.5,
  },

  intelligenceCard: {
    marginHorizontal: ThreadlySpacing.screenPadding,
    borderRadius: ThreadlyRadius.xl,
    overflow: "hidden",
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(201,149,106,0.2)",
    marginBottom: 20,
  },
  intelligenceCardBorder: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: ThreadlyColors.roseGold,
    opacity: 0.4,
  },
  intelligenceEyebrow: {
    fontSize: 10,
    fontWeight: "700",
    color: ThreadlyColors.roseGold,
    letterSpacing: 2,
    marginBottom: 16,
  },
  intelligenceLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: ThreadlyColors.warmWhiteSubtle,
    letterSpacing: 1,
    marginBottom: 10,
  },

  colorBars: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    height: 76,
  },
  colorBarItem: { alignItems: "center", gap: 4, flex: 1 },
  colorBarFill: {
    width: "100%",
    borderRadius: ThreadlyRadius.sm,
    minHeight: 8,
  },
  colorBarPct: { fontSize: 10, color: ThreadlyColors.warmWhiteSubtle },
  colorBarName: { fontSize: 8, color: ThreadlyColors.warmWhiteSubtle2, textAlign: "center" },

  tagRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  roseTag: {
    backgroundColor: "rgba(201,149,106,0.12)",
    borderRadius: ThreadlyRadius.pill,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "rgba(201,149,106,0.25)",
  },
  roseTagText: { fontSize: 12, color: ThreadlyColors.roseGoldLight, fontWeight: "600" },
  grayTag: {
    backgroundColor: ThreadlyColors.charcoalMid,
    borderRadius: ThreadlyRadius.pill,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: ThreadlyColors.charcoalLight,
  },
  grayTagText: { fontSize: 12, color: ThreadlyColors.warmWhiteMuted },

  insightRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    backgroundColor: "rgba(201,149,106,0.06)",
    borderRadius: ThreadlyRadius.lg,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(201,149,106,0.15)",
    marginTop: 16,
  },
  insightIcon: { fontSize: 12, color: ThreadlyColors.roseGold, marginTop: 2 },
  insightText: { flex: 1, fontSize: 13, color: ThreadlyColors.warmWhiteMuted, lineHeight: 19 },
  insightHighlight: { color: ThreadlyColors.roseGoldLight, fontWeight: "600" },

  categoryStrip: {
    paddingHorizontal: ThreadlySpacing.screenPadding,
    gap: 8,
    marginBottom: 16,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: ThreadlyRadius.pill,
    backgroundColor: ThreadlyColors.charcoal,
    borderWidth: 1,
    borderColor: ThreadlyColors.charcoalLight,
  },
  categoryChipActive: {
    backgroundColor: "rgba(201,149,106,0.15)",
    borderColor: ThreadlyColors.roseGold,
  },
  categoryChipText: { fontSize: 13, color: ThreadlyColors.warmWhiteSubtle, fontWeight: "600" },
  categoryChipTextActive: { color: ThreadlyColors.roseGoldLight },

  gridHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: ThreadlySpacing.screenPadding,
    marginBottom: 12,
  },
  gridCount: { fontSize: 12, color: ThreadlyColors.warmWhiteSubtle },
  sortBtn: { fontSize: 12, color: ThreadlyColors.roseGold, fontWeight: "600" },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: ThreadlySpacing.screenPadding,
    gap: 12,
    marginBottom: 24,
  },
  wardrobeItem: {
    width: ITEM_W,
    backgroundColor: ThreadlyColors.charcoal,
    borderRadius: ThreadlyRadius.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: ThreadlyColors.charcoalLight,
  },
  wardrobeItemSwatch: {
    height: ITEM_W,
    position: "relative",
  },
  underusedDot: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: ThreadlyColors.roseGold,
    borderWidth: 1.5,
    borderColor: ThreadlyColors.charcoal,
  },
  wardrobeItemInfo: { padding: 10 },
  wardrobeItemName: {
    fontSize: 12,
    color: ThreadlyColors.warmWhite,
    fontWeight: "600",
    marginBottom: 2,
  },
  wardrobeItemBrand: {
    fontSize: 10,
    color: ThreadlyColors.warmWhiteSubtle,
    marginBottom: 4,
  },
  wardrobeItemCpw: {
    fontSize: 10,
    color: ThreadlyColors.roseGoldDim,
    fontWeight: "600",
  },

  bigScanCta: {
    marginHorizontal: ThreadlySpacing.screenPadding,
    borderRadius: ThreadlyRadius.xl,
    overflow: "hidden",
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(201,149,106,0.2)",
  },
  bigScanCtaBorder: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: ThreadlyColors.roseGold,
    opacity: 0.3,
  },
  bigScanIcon: { fontSize: 32, color: ThreadlyColors.roseGold, marginBottom: 12 },
  bigScanTitle: {
    fontSize: 18,
    fontFamily: "Georgia",
    color: ThreadlyColors.warmWhite,
    marginBottom: 8,
  },
  bigScanSub: {
    fontSize: 13,
    color: ThreadlyColors.warmWhiteSubtle,
    textAlign: "center",
    lineHeight: 19,
    marginBottom: 16,
  },
  bigScanBadge: {
    backgroundColor: "rgba(201,149,106,0.15)",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: ThreadlyRadius.pill,
    borderWidth: 1,
    borderColor: "rgba(201,149,106,0.3)",
  },
  bigScanBadgeText: {
    fontSize: 13,
    color: ThreadlyColors.roseGoldLight,
    fontWeight: "600",
  },
});
