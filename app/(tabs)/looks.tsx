/**
 * Threadly — Looks Screen
 * AI-recommended outfits by occasion, built from your closet.
 */

import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ScreenContainer } from "@/components/screen-container";
import { ThreadlyColors, ThreadlyRadius, ThreadlySpacing, ThreadlyShadow } from "@/constants/threadly";

const { width } = Dimensions.get("window");
const LOOK_CARD_WIDTH = (width - ThreadlySpacing.screenPadding * 2 - 12) / 2;

const OCCASIONS = ["All", "Work", "Date Night", "Casual", "School", "Church", "Party", "Vacation", "Go New"];

const LOOKS = [
  {
    id: "1",
    title: "Modern Minimal",
    occasion: "Work",
    match: 95,
    ownedPercent: 80,
    addItems: 2,
    price: 54,
    bgColor: "#1E1A16",
    accentColor: "#C4A882",
    items: ["Camel Blazer", "Black Tee", "Wide-Leg Trousers", "Heeled Mules"],
  },
  {
    id: "2",
    title: "Casual Chic",
    occasion: "Casual",
    match: 88,
    ownedPercent: 90,
    addItems: 1,
    price: 42,
    bgColor: "#1A1A1A",
    accentColor: "#E8DDD0",
    items: ["White Tee", "Straight Jeans", "White Sneakers", "Tote Bag"],
  },
  {
    id: "3",
    title: "Date Night",
    occasion: "Date Night",
    match: 90,
    ownedPercent: 75,
    addItems: 2,
    price: 61,
    bgColor: "#1A1014",
    accentColor: "#C9956A",
    items: ["Black Midi Dress", "Heeled Sandals", "Mini Bag", "Gold Hoops"],
  },
  {
    id: "4",
    title: "Effortless Neutrals",
    occasion: "Casual",
    match: 92,
    ownedPercent: 85,
    addItems: 1,
    price: 37,
    bgColor: "#1E1A10",
    accentColor: "#C4A882",
    items: ["Linen Blazer", "Cream Trousers", "Loafers", "Structured Bag"],
  },
  {
    id: "5",
    title: "Weekend Cool",
    occasion: "Casual",
    match: 85,
    ownedPercent: 88,
    addItems: 2,
    price: 48,
    bgColor: "#101A1E",
    accentColor: "#6A9AC9",
    items: ["Denim Jacket", "White Tee", "Straight Jeans", "Sneakers"],
  },
  {
    id: "6",
    title: "Power Dressing",
    occasion: "Work",
    match: 93,
    ownedPercent: 70,
    addItems: 3,
    price: 89,
    bgColor: "#1A1A10",
    accentColor: "#C4A882",
    items: ["Tailored Blazer", "Silk Blouse", "Pencil Skirt", "Heels"],
  },
];

export default function LooksScreen() {
  const [activeOccasion, setActiveOccasion] = useState("All");

  const filtered = activeOccasion === "All"
    ? LOOKS
    : LOOKS.filter(l => l.occasion === activeOccasion);

  return (
    <ScreenContainer containerClassName="bg-[#0A0A0A]" edges={["top", "left", "right"]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>AI Recommended For You</Text>
          <Text style={styles.headerSub}>Looks built from your closet and style profile.</Text>
        </View>

        {/* Occasion Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.occasionList}
          style={styles.occasionScroll}
        >
          {OCCASIONS.map(occ => (
            <TouchableOpacity
              key={occ}
              style={[styles.occasionPill, activeOccasion === occ && styles.occasionPillActive]}
              activeOpacity={0.7}
              onPress={() => setActiveOccasion(occ)}
            >
              <Text style={[styles.occasionText, activeOccasion === occ && styles.occasionTextActive]}>
                {occ}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Looks Grid */}
        <View style={styles.grid}>
          {filtered.map(look => (
            <LookCard key={look.id} look={look} />
          ))}
        </View>

        {/* See More */}
        <TouchableOpacity style={styles.seeMoreBtn} activeOpacity={0.7}>
          <Text style={styles.seeMoreText}>SEE MORE LOOKS</Text>
        </TouchableOpacity>

        <View style={{ height: 32 }} />
      </ScrollView>
    </ScreenContainer>
  );
}

function LookCard({ look }: { look: typeof LOOKS[0] }) {
  return (
    <TouchableOpacity
      style={[styles.lookCard, { width: LOOK_CARD_WIDTH, backgroundColor: look.bgColor }]}
      activeOpacity={0.88}
    >
      {/* Background gradient */}
      <LinearGradient
        colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.75)"]}
        style={StyleSheet.absoluteFill}
      />

      {/* Accent border */}
      <View style={[styles.lookCardBorder, { borderColor: `${look.accentColor}40` }]} />

      {/* Top: Match badge */}
      <View style={styles.lookCardTop}>
        <View style={[styles.matchBadge, { backgroundColor: `${look.accentColor}CC` }]}>
          <Text style={styles.matchText}>{look.match}%</Text>
        </View>
      </View>

      {/* Color swatches representing outfit */}
      <View style={styles.swatchRow}>
        {look.items.slice(0, 4).map((_, i) => (
          <View
            key={i}
            style={[styles.miniSwatch, { backgroundColor: look.accentColor, opacity: 0.4 + i * 0.15 }]}
          />
        ))}
      </View>

      {/* Bottom info */}
      <View style={styles.lookCardBottom}>
        <Text style={styles.lookOccasion}>{look.occasion}</Text>
        <Text style={styles.lookTitle}>{look.title}</Text>
        <View style={styles.lookMeta}>
          <Text style={styles.lookOwned}>{look.ownedPercent}% from closet</Text>
        </View>
        <View style={styles.lookFooter}>
          <Text style={styles.lookAdd}>+ {look.addItems} item{look.addItems > 1 ? "s" : ""}</Text>
          <Text style={styles.lookPrice}>from ${look.price}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: ThreadlyColors.black },
  scrollContent: { paddingBottom: 24 },

  header: {
    paddingHorizontal: ThreadlySpacing.screenPadding,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: "Georgia",
    color: ThreadlyColors.warmWhite,
    marginBottom: 4,
  },
  headerSub: { fontSize: 13, color: ThreadlyColors.warmWhiteSubtle },

  occasionScroll: { marginBottom: 16 },
  occasionList: { paddingHorizontal: ThreadlySpacing.screenPadding, gap: 8 },
  occasionPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: ThreadlyRadius.pill,
    backgroundColor: ThreadlyColors.charcoal,
    borderWidth: 1,
    borderColor: ThreadlyColors.charcoalLight,
  },
  occasionPillActive: {
    backgroundColor: ThreadlyColors.roseGold,
    borderColor: ThreadlyColors.roseGold,
  },
  occasionText: { fontSize: 13, color: ThreadlyColors.warmWhiteSubtle, fontWeight: "600" },
  occasionTextActive: { color: ThreadlyColors.warmWhite },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: ThreadlySpacing.screenPadding,
    gap: 12,
    marginBottom: 20,
  },
  lookCard: {
    height: 260,
    borderRadius: ThreadlyRadius.xl,
    overflow: "hidden",
    position: "relative",
    justifyContent: "space-between",
    padding: 12,
  },
  lookCardBorder: {
    position: "absolute",
    inset: 0,
    borderRadius: ThreadlyRadius.xl,
    borderWidth: 1,
  },
  lookCardTop: { alignItems: "flex-end" },
  matchBadge: {
    borderRadius: ThreadlyRadius.pill,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  matchText: { fontSize: 11, fontWeight: "700", color: ThreadlyColors.warmWhite },

  swatchRow: {
    flexDirection: "row",
    gap: 4,
    justifyContent: "center",
    flex: 1,
    alignItems: "center",
  },
  miniSwatch: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },

  lookCardBottom: {},
  lookOccasion: {
    fontSize: 9,
    fontWeight: "700",
    color: ThreadlyColors.warmWhiteSubtle,
    letterSpacing: 1.5,
    marginBottom: 3,
  },
  lookTitle: {
    fontSize: 15,
    fontFamily: "Georgia",
    color: ThreadlyColors.warmWhite,
    marginBottom: 4,
    lineHeight: 19,
  },
  lookMeta: { marginBottom: 6 },
  lookOwned: { fontSize: 10, color: ThreadlyColors.roseGoldLight },
  lookFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  lookAdd: { fontSize: 10, color: ThreadlyColors.warmWhiteSubtle },
  lookPrice: { fontSize: 12, fontWeight: "700", color: ThreadlyColors.warmWhite },

  seeMoreBtn: {
    marginHorizontal: ThreadlySpacing.screenPadding,
    paddingVertical: 16,
    borderRadius: ThreadlyRadius.pill,
    borderWidth: 1,
    borderColor: ThreadlyColors.charcoalLight,
    alignItems: "center",
  },
  seeMoreText: {
    fontSize: 12,
    fontWeight: "700",
    color: ThreadlyColors.warmWhiteMuted,
    letterSpacing: 1.5,
  },
});
