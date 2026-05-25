/**
 * Threadly — Closet Screen
 * Digital wardrobe: scan items, view closet analysis, AI insights.
 */

import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ScreenContainer } from "@/components/screen-container";
import { ThreadlyColors, ThreadlyRadius, ThreadlySpacing, ThreadlyShadow } from "@/constants/threadly";

const { width } = Dimensions.get("window");
const ITEM_SIZE = (width - ThreadlySpacing.screenPadding * 2 - 12) / 3;

const CATEGORIES = ["All", "Tops", "Bottoms", "Dresses", "Shoes", "Bags", "Accessories"];

const CLOSET_ITEMS = [
  { id: "1", name: "Camel Blazer", category: "Tops", color: "#C4A882", worn: true },
  { id: "2", name: "Black Tee", category: "Tops", color: "#1A1A1A", worn: true },
  { id: "3", name: "Wide-Leg Trousers", category: "Bottoms", color: "#2A2A2A", worn: true },
  { id: "4", name: "Straight Jeans", category: "Bottoms", color: "#3A5A8A", worn: false },
  { id: "5", name: "Linen Dress", category: "Dresses", color: "#E8DDD0", worn: false },
  { id: "6", name: "Black Midi Dress", category: "Dresses", color: "#0A0A0A", worn: true },
  { id: "7", name: "Heeled Mules", category: "Shoes", color: "#C4A882", worn: true },
  { id: "8", name: "White Sneakers", category: "Shoes", color: "#F5F5F0", worn: false },
  { id: "9", name: "Black Boots", category: "Shoes", color: "#1A1A1A", worn: true },
  { id: "10", name: "Mini Bag", category: "Bags", color: "#1A1A1A", worn: true },
  { id: "11", name: "Tote Bag", category: "Bags", color: "#C4A882", worn: false },
  { id: "12", name: "Gold Hoops", category: "Accessories", color: "#C9956A", worn: true },
];

const CLOSET_INSIGHTS = {
  totalItems: 436,
  itemsWorn: 87,
  duplicates: 12,
  rarelyWorn: 23,
  topColors: ["#C4A882", "#1A1A1A", "#E8DDD0", "#3A5A8A", "#2A2A2A"],
  styleProfile: ["Classic", "Minimal", "Feminine"],
  brands: ["ZARA", "H&M", "Nike", "Aritzia"],
};

export default function ClosetScreen() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = activeCategory === "All"
    ? CLOSET_ITEMS
    : CLOSET_ITEMS.filter(i => i.category === activeCategory);

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
            <Text style={styles.headerTitle}>My Closet</Text>
            <Text style={styles.headerSub}>{CLOSET_INSIGHTS.totalItems} items</Text>
          </View>
          <TouchableOpacity style={styles.scanBtn} activeOpacity={0.85}>
            <LinearGradient
              colors={[ThreadlyColors.roseGold, ThreadlyColors.roseGoldLight]}
              style={styles.scanBtnGradient}
            >
              <Text style={styles.scanBtnText}>+ Scan Item</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Closet Analysis Card */}
        <View style={styles.analysisCard}>
          <LinearGradient
            colors={["#1E1A16", "#2A2218"]}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.analysisBorder} />

          <Text style={styles.analysisTitle}>CLOSET ANALYSIS</Text>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{CLOSET_INSIGHTS.itemsWorn}%</Text>
              <Text style={styles.statLabel}>Items Worn</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{CLOSET_INSIGHTS.duplicates}</Text>
              <Text style={styles.statLabel}>Duplicates</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{CLOSET_INSIGHTS.rarelyWorn}</Text>
              <Text style={styles.statLabel}>Rarely Worn</Text>
            </View>
          </View>

          {/* Top Colors */}
          <View style={styles.colorsRow}>
            <Text style={styles.colorsLabel}>Your top colors</Text>
            <View style={styles.colorSwatches}>
              {CLOSET_INSIGHTS.topColors.map((c, i) => (
                <View key={i} style={[styles.colorSwatch, { backgroundColor: c }]} />
              ))}
            </View>
          </View>

          {/* Style Profile */}
          <View style={styles.styleRow}>
            <Text style={styles.styleLabel}>Your style profile</Text>
            <View style={styles.styleTags}>
              {CLOSET_INSIGHTS.styleProfile.map((s, i) => (
                <View key={i} style={styles.styleTag}>
                  <Text style={styles.styleTagText}>{s}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Brands */}
          <View style={styles.brandsRow}>
            <Text style={styles.brandsLabel}>Detected brands</Text>
            <View style={styles.brandTags}>
              {CLOSET_INSIGHTS.brands.map((b, i) => (
                <View key={i} style={styles.brandTag}>
                  <Text style={styles.brandTagText}>{b}</Text>
                </View>
              ))}
              <View style={styles.brandTag}>
                <Text style={styles.brandTagText}>+12</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.viewReportBtn} activeOpacity={0.7}>
            <Text style={styles.viewReportText}>View full report →</Text>
          </TouchableOpacity>
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
              style={[styles.categoryPill, activeCategory === cat && styles.categoryPillActive]}
              activeOpacity={0.7}
              onPress={() => setActiveCategory(cat)}
            >
              <Text style={[styles.categoryText, activeCategory === cat && styles.categoryTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Grid */}
        <View style={styles.grid}>
          {filtered.map(item => (
            <TouchableOpacity
              key={item.id}
              style={[styles.gridItem, { width: ITEM_SIZE, height: ITEM_SIZE * 1.2 }]}
              activeOpacity={0.85}
            >
              <View style={[styles.gridItemColor, { backgroundColor: item.color }]} />
              <LinearGradient
                colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.6)"]}
                style={StyleSheet.absoluteFill}
              />
              {!item.worn && (
                <View style={styles.rarelyWornBadge}>
                  <Text style={styles.rarelyWornText}>Rarely worn</Text>
                </View>
              )}
              <Text style={styles.gridItemName} numberOfLines={2}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: ThreadlyColors.black },
  scrollContent: { paddingBottom: 24 },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: ThreadlySpacing.screenPadding,
    paddingTop: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: "Georgia",
    color: ThreadlyColors.warmWhite,
    marginBottom: 2,
  },
  headerSub: { fontSize: 13, color: ThreadlyColors.warmWhiteSubtle },
  scanBtn: { borderRadius: ThreadlyRadius.pill, overflow: "hidden", ...ThreadlyShadow.roseGlow },
  scanBtnGradient: { paddingHorizontal: 16, paddingVertical: 10 },
  scanBtnText: { fontSize: 13, fontWeight: "700", color: ThreadlyColors.warmWhite },

  analysisCard: {
    marginHorizontal: ThreadlySpacing.screenPadding,
    borderRadius: ThreadlyRadius["2xl"],
    padding: 20,
    overflow: "hidden",
    position: "relative",
    marginBottom: 24,
    ...ThreadlyShadow.roseGlow,
  },
  analysisBorder: {
    position: "absolute",
    inset: 0,
    borderRadius: ThreadlyRadius["2xl"],
    borderWidth: 1,
    borderColor: "rgba(201,149,106,0.3)",
  },
  analysisTitle: {
    fontSize: 10,
    fontWeight: "700",
    color: ThreadlyColors.roseGold,
    letterSpacing: 2,
    marginBottom: 16,
  },

  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: ThreadlyColors.charcoalMid,
    borderRadius: ThreadlyRadius.lg,
    padding: 14,
  },
  statItem: { flex: 1, alignItems: "center" },
  statValue: {
    fontSize: 22,
    fontFamily: "Georgia",
    color: ThreadlyColors.warmWhite,
    marginBottom: 2,
  },
  statLabel: { fontSize: 10, color: ThreadlyColors.warmWhiteSubtle, textAlign: "center" },
  statDivider: { width: 1, height: 32, backgroundColor: ThreadlyColors.charcoalLight },

  colorsRow: { marginBottom: 12 },
  colorsLabel: { fontSize: 11, color: ThreadlyColors.warmWhiteSubtle, marginBottom: 8 },
  colorSwatches: { flexDirection: "row", gap: 8 },
  colorSwatch: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },

  styleRow: { marginBottom: 12 },
  styleLabel: { fontSize: 11, color: ThreadlyColors.warmWhiteSubtle, marginBottom: 8 },
  styleTags: { flexDirection: "row", gap: 6 },
  styleTag: {
    backgroundColor: ThreadlyColors.charcoalMid,
    borderRadius: ThreadlyRadius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: ThreadlyColors.charcoalLight,
  },
  styleTagText: { fontSize: 11, color: ThreadlyColors.warmWhiteMuted },

  brandsRow: { marginBottom: 14 },
  brandsLabel: { fontSize: 11, color: ThreadlyColors.warmWhiteSubtle, marginBottom: 8 },
  brandTags: { flexDirection: "row", gap: 6, flexWrap: "wrap" },
  brandTag: {
    backgroundColor: ThreadlyColors.charcoalMid,
    borderRadius: ThreadlyRadius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: ThreadlyColors.charcoalLight,
  },
  brandTagText: { fontSize: 11, color: ThreadlyColors.warmWhiteMuted, fontWeight: "600" },

  viewReportBtn: { alignSelf: "flex-start" },
  viewReportText: { fontSize: 12, color: ThreadlyColors.roseGold, fontWeight: "600" },

  categoryScroll: { marginBottom: 16 },
  categoryList: { paddingHorizontal: ThreadlySpacing.screenPadding, gap: 8 },
  categoryPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: ThreadlyRadius.pill,
    backgroundColor: ThreadlyColors.charcoal,
    borderWidth: 1,
    borderColor: ThreadlyColors.charcoalLight,
  },
  categoryPillActive: {
    backgroundColor: ThreadlyColors.roseGold,
    borderColor: ThreadlyColors.roseGold,
  },
  categoryText: { fontSize: 13, color: ThreadlyColors.warmWhiteSubtle, fontWeight: "600" },
  categoryTextActive: { color: ThreadlyColors.warmWhite },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: ThreadlySpacing.screenPadding,
    gap: 6,
  },
  gridItem: {
    borderRadius: ThreadlyRadius.lg,
    overflow: "hidden",
    position: "relative",
    justifyContent: "flex-end",
    padding: 8,
  },
  gridItemColor: { ...StyleSheet.absoluteFillObject },
  rarelyWornBadge: {
    position: "absolute",
    top: 6,
    left: 6,
    backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: ThreadlyRadius.pill,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: ThreadlyColors.charcoalLight,
  },
  rarelyWornText: { fontSize: 8, color: ThreadlyColors.warmWhiteSubtle },
  gridItemName: {
    fontSize: 10,
    color: ThreadlyColors.warmWhite,
    fontWeight: "600",
    lineHeight: 13,
  },
});
