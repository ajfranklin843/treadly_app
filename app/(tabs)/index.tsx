/**
 * Threadly — Home Feed
 * The daily AI stylist experience: Today's Look, trend discovery, deals, and the Go New CTA.
 * Emotional outcome: "My stylist already knows what I need today."
 */

import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import {
  ThreadlyColors,
  ThreadlySpacing,
  ThreadlyRadius,
  ThreadlyShadow,
} from "@/constants/threadly";

const { width } = Dimensions.get("window");
const CARD_W = width * 0.62;

// ─── Mock Data ────────────────────────────────────────────────────────────────

const TODAY_LOOK = {
  occasion: "Work Meeting",
  matchScore: 92,
  ownedPercent: 78,
  palette: ["#2C2416", "#6B5B4E", "#C9956A", "#FAF7F4", "#8B7355"],
  items: ["Camel Blazer", "Black Tee", "Wide-Leg Trousers", "Heeled Mules", "Mini Bag"],
  missingCount: 1,
  missingFrom: "$14",
};

const OUTFIT_CARDS = [
  {
    id: "1",
    title: "Modern Minimal",
    occasion: "Work",
    matchScore: 95,
    ownedPct: 80,
    missingItems: 2,
    fromPrice: 54,
    palette: ["#1A1A1A", "#C9956A", "#FAF7F4"],
    tag: "TRENDING",
  },
  {
    id: "2",
    title: "Casual Chic",
    occasion: "Weekend",
    matchScore: 88,
    ownedPct: 100,
    missingItems: 0,
    fromPrice: 0,
    palette: ["#3A2520", "#E8B89A", "#F2D4C8"],
    tag: "YOU OWN IT",
  },
  {
    id: "3",
    title: "Date Night",
    occasion: "Evening",
    matchScore: 82,
    ownedPct: 60,
    missingItems: 3,
    fromPrice: 38,
    palette: ["#0A0A0A", "#C9956A", "#8B7355"],
    tag: "HOT NOW",
  },
  {
    id: "4",
    title: "Sunday Brunch",
    occasion: "Casual",
    matchScore: 91,
    ownedPct: 90,
    missingItems: 1,
    fromPrice: 22,
    palette: ["#F2D4C8", "#E8B89A", "#C9956A"],
    tag: "EASY WIN",
  },
];

const DEALS = [
  { id: "1", brand: "ZARA", item: "Oversized Blazer", original: 110, sale: 59, off: 46, color: "#C4A882" },
  { id: "2", brand: "MANGO", item: "Straight-Leg Jeans", original: 80, sale: 44, off: 45, color: "#4A4A5A" },
  { id: "3", brand: "AMAZON", item: "Gold Hoop Earrings", original: 22, sale: 14, off: 36, color: "#C9956A" },
  { id: "4", brand: "TARGET", item: "White Sneakers", original: 40, sale: 28, off: 30, color: "#F5F5F0" },
];

const TRENDS = [
  { id: "1", label: "Quiet Luxury", heat: 98, desc: "Understated, elevated basics" },
  { id: "2", label: "Coastal Grandmother", heat: 87, desc: "Linen, neutrals, effortless" },
  { id: "3", label: "Office Siren", heat: 94, desc: "Power dressing, reimagined" },
  { id: "4", label: "Mob Wife Aesthetic", heat: 91, desc: "Maximalist, fur, drama" },
];

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const [savedLooks, setSavedLooks] = useState<Set<string>>(new Set());

  const toggleSave = (id: string) => {
    setSavedLooks(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <ScreenContainer containerClassName="bg-[#0A0A0A]" edges={["top", "left", "right"]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning ✦</Text>
            <Text style={styles.headline}>Your AI Stylist{"\n"}is ready.</Text>
          </View>
          <TouchableOpacity style={styles.notifBtn} activeOpacity={0.7}>
            <Text style={styles.notifIcon}>🔔</Text>
            <View style={styles.notifDot} />
          </TouchableOpacity>
        </View>

        {/* ── Today's Look Card ── */}
        <TouchableOpacity activeOpacity={0.92} style={styles.todayCard}>
          <LinearGradient
            colors={["#1E1A16", "#2A2218"]}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.todayBorderAccent} />

          <View style={styles.todayTop}>
            <View>
              <Text style={styles.todayLabel}>TODAY'S LOOK</Text>
              <Text style={styles.todaySubLabel}>Curated for you</Text>
            </View>
            <View style={styles.matchBadge}>
              <Text style={styles.matchScore}>{TODAY_LOOK.matchScore}%</Text>
              <Text style={styles.matchLabel}>match</Text>
            </View>
          </View>

          {/* Color Palette */}
          <View style={styles.paletteRow}>
            {TODAY_LOOK.palette.map((c, i) => (
              <View key={i} style={[styles.paletteDot, { backgroundColor: c }]} />
            ))}
          </View>

          {/* Items */}
          <View style={styles.todayItems}>
            {TODAY_LOOK.items.map((item, i) => (
              <View key={i} style={styles.todayItemRow}>
                <View style={styles.todayItemDot} />
                <Text style={styles.todayItemText}>{item}</Text>
              </View>
            ))}
          </View>

          <View style={styles.todayFooter}>
            <View style={styles.ownedTag}>
              <Text style={styles.ownedTagText}>You own {TODAY_LOOK.ownedPercent}% of this look</Text>
            </View>
            <Text style={styles.occasionTag}>{TODAY_LOOK.occasion}</Text>
          </View>
        </TouchableOpacity>

        {/* ── Go New CTA ── */}
        <TouchableOpacity
          style={styles.goNewCta}
          activeOpacity={0.88}
          onPress={() => router.push("/(tabs)/gonew")}
        >
          <LinearGradient
            colors={[ThreadlyColors.roseGold, ThreadlyColors.roseGoldLight]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.goNewCtaGradient}
          >
            <View style={styles.goNewCtaContent}>
              <View>
                <Text style={styles.goNewCtaTitle}>Go New ✦</Text>
                <Text style={styles.goNewCtaSub}>Build a fresh look from your closet</Text>
              </View>
              <Text style={styles.goNewCtaArrow}>→</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* ── AI Recommended Outfits ── */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>AI Recommended For You</Text>
            <Text style={styles.sectionSub}>Built from your closet</Text>
          </View>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.seeAll}>See all →</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={OUTFIT_CARDS}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.outfitList}
          renderItem={({ item }) => (
            <OutfitCard
              item={item}
              saved={savedLooks.has(item.id)}
              onSave={() => toggleSave(item.id)}
            />
          )}
        />

        {/* ── Deals Found For You ── */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Deals Found For You</Text>
            <Text style={styles.sectionSub}>On pieces that complete your looks</Text>
          </View>
          <TouchableOpacity activeOpacity={0.7} onPress={() => router.push("/(tabs)/shop")}>
            <Text style={styles.seeAll}>See all →</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.dealsList}>
          {DEALS.map(deal => (
            <DealRow key={deal.id} deal={deal} />
          ))}
        </View>

        {/* ── Trending Now ── */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Trending Now</Text>
            <Text style={styles.sectionSub}>What's hot this week</Text>
          </View>
        </View>

        <View style={styles.trendGrid}>
          {TRENDS.map(trend => (
            <TrendCard key={trend.id} trend={trend} />
          ))}
        </View>

        {/* ── Style Intelligence Banner ── */}
        <TouchableOpacity
          style={styles.intelligenceBanner}
          activeOpacity={0.88}
          onPress={() => router.push("/(tabs)/stylist")}
        >
          <LinearGradient
            colors={["#1A0E08", "#2A1A10"]}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.intelligenceBannerBorder} />
          <Text style={styles.intelligenceLabel}>✦ YOUR AI STYLIST</Text>
          <Text style={styles.intelligenceTitle}>
            "Build me a look for a{"\n"}rooftop dinner under $80."
          </Text>
          <Text style={styles.intelligenceCta}>Start a conversation →</Text>
        </TouchableOpacity>

        <View style={{ height: 32 }} />
      </ScrollView>
    </ScreenContainer>
  );
}

// ─── Outfit Card ──────────────────────────────────────────────────────────────

function OutfitCard({
  item,
  saved,
  onSave,
}: {
  item: typeof OUTFIT_CARDS[0];
  saved: boolean;
  onSave: () => void;
}) {
  return (
    <TouchableOpacity style={styles.outfitCard} activeOpacity={0.88}>
      {/* Color swatch background */}
      <View style={styles.outfitCardVisual}>
        <LinearGradient
          colors={["#1A1A1A", "#252525"]}
          style={StyleSheet.absoluteFill}
        />
        {/* Palette swatches */}
        <View style={styles.outfitSwatches}>
          {item.palette.map((c, i) => (
            <View
              key={i}
              style={[
                styles.outfitSwatch,
                { backgroundColor: c, width: 28 + i * 4, height: 28 + i * 4 },
              ]}
            />
          ))}
        </View>
        {/* Tag */}
        <View style={styles.outfitTag}>
          <Text style={styles.outfitTagText}>{item.tag}</Text>
        </View>
        {/* Match */}
        <View style={styles.outfitMatch}>
          <Text style={styles.outfitMatchText}>{item.matchScore}%</Text>
        </View>
        {/* Save */}
        <TouchableOpacity
          style={styles.outfitSaveBtn}
          onPress={onSave}
          activeOpacity={0.7}
        >
          <Text style={[styles.outfitSaveIcon, saved && { color: ThreadlyColors.roseGold }]}>
            {saved ? "♥" : "♡"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.outfitCardInfo}>
        <Text style={styles.outfitTitle}>{item.title}</Text>
        <Text style={styles.outfitOccasion}>{item.occasion}</Text>
        <View style={styles.outfitCardFooter}>
          {item.missingItems === 0 ? (
            <Text style={styles.outfitOwned}>✓ You own it</Text>
          ) : (
            <Text style={styles.outfitMissing}>+ {item.missingItems} items from ${item.fromPrice}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ─── Deal Row ─────────────────────────────────────────────────────────────────

function DealRow({ deal }: { deal: typeof DEALS[0] }) {
  return (
    <TouchableOpacity style={styles.dealRow} activeOpacity={0.85}>
      <View style={[styles.dealColorBar, { backgroundColor: deal.color }]} />
      <View style={styles.dealInfo}>
        <Text style={styles.dealBrand}>{deal.brand}</Text>
        <Text style={styles.dealItem}>{deal.item}</Text>
        <View style={styles.dealPricing}>
          <Text style={styles.dealOriginal}>${deal.original}</Text>
          <Text style={styles.dealSale}>${deal.sale}</Text>
        </View>
      </View>
      <View style={styles.dealOffBadge}>
        <Text style={styles.dealOffText}>-{deal.off}%</Text>
      </View>
    </TouchableOpacity>
  );
}

// ─── Trend Card ───────────────────────────────────────────────────────────────

function TrendCard({ trend }: { trend: typeof TRENDS[0] }) {
  const heatColor = trend.heat >= 95 ? ThreadlyColors.roseGold : trend.heat >= 90 ? ThreadlyColors.roseGoldLight : ThreadlyColors.warmWhiteMuted;
  return (
    <TouchableOpacity style={styles.trendCard} activeOpacity={0.85}>
      <View style={styles.trendCardInner}>
        <View style={styles.trendHeatRow}>
          <View style={[styles.trendHeatDot, { backgroundColor: heatColor }]} />
          <Text style={[styles.trendHeat, { color: heatColor }]}>{trend.heat}</Text>
        </View>
        <Text style={styles.trendLabel}>{trend.label}</Text>
        <Text style={styles.trendDesc}>{trend.desc}</Text>
      </View>
    </TouchableOpacity>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 24 },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: ThreadlySpacing.screenPadding,
    paddingTop: 20,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 11,
    fontWeight: "700",
    color: ThreadlyColors.roseGold,
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  headline: {
    fontSize: 28,
    fontFamily: "Georgia",
    color: ThreadlyColors.warmWhite,
    lineHeight: 34,
  },
  notifBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: ThreadlyColors.charcoal,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: ThreadlyColors.charcoalLight,
  },
  notifIcon: { fontSize: 16 },
  notifDot: {
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

  // Today's Look Card
  todayCard: {
    marginHorizontal: ThreadlySpacing.screenPadding,
    borderRadius: ThreadlyRadius.xl,
    overflow: "hidden",
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(201,149,106,0.2)",
    ...ThreadlyShadow.card,
  },
  todayBorderAccent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: ThreadlyColors.roseGold,
    opacity: 0.6,
  },
  todayTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  todayLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: ThreadlyColors.roseGold,
    letterSpacing: 2,
    marginBottom: 2,
  },
  todaySubLabel: {
    fontSize: 12,
    color: ThreadlyColors.warmWhiteSubtle,
  },
  matchBadge: { alignItems: "flex-end" },
  matchScore: {
    fontSize: 28,
    fontFamily: "Georgia",
    color: ThreadlyColors.roseGoldLight,
    lineHeight: 30,
  },
  matchLabel: {
    fontSize: 10,
    color: ThreadlyColors.warmWhiteSubtle,
    letterSpacing: 1,
  },
  paletteRow: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 14,
  },
  paletteDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.1)",
  },
  todayItems: { gap: 6, marginBottom: 16 },
  todayItemRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  todayItemDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: ThreadlyColors.roseGoldDim,
  },
  todayItemText: {
    fontSize: 14,
    color: ThreadlyColors.warmWhiteMuted,
  },
  todayFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ownedTag: {
    backgroundColor: "rgba(201,149,106,0.12)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: ThreadlyRadius.pill,
    borderWidth: 1,
    borderColor: "rgba(201,149,106,0.25)",
  },
  ownedTagText: {
    fontSize: 11,
    color: ThreadlyColors.roseGoldLight,
    fontWeight: "600",
  },
  occasionTag: {
    fontSize: 11,
    color: ThreadlyColors.warmWhiteSubtle,
    fontStyle: "italic",
  },

  // Go New CTA
  goNewCta: {
    marginHorizontal: ThreadlySpacing.screenPadding,
    borderRadius: ThreadlyRadius.lg,
    overflow: "hidden",
    marginBottom: 28,
    ...ThreadlyShadow.roseGlow,
  },
  goNewCtaGradient: { padding: 18 },
  goNewCtaContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  goNewCtaTitle: {
    fontSize: 18,
    fontFamily: "Georgia",
    color: ThreadlyColors.black,
    marginBottom: 3,
  },
  goNewCtaSub: {
    fontSize: 12,
    color: "rgba(10,10,10,0.65)",
  },
  goNewCtaArrow: {
    fontSize: 22,
    color: ThreadlyColors.black,
    fontWeight: "300",
  },

  // Section headers
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: ThreadlySpacing.screenPadding,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: ThreadlyColors.warmWhite,
    marginBottom: 2,
  },
  sectionSub: {
    fontSize: 11,
    color: ThreadlyColors.warmWhiteSubtle,
  },
  seeAll: {
    fontSize: 12,
    color: ThreadlyColors.roseGold,
    fontWeight: "600",
  },

  // Outfit cards (horizontal)
  outfitList: {
    paddingLeft: ThreadlySpacing.screenPadding,
    paddingRight: 8,
    gap: 12,
    marginBottom: 28,
  },
  outfitCard: {
    width: CARD_W,
    backgroundColor: ThreadlyColors.charcoal,
    borderRadius: ThreadlyRadius.xl,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: ThreadlyColors.charcoalLight,
  },
  outfitCardVisual: {
    height: 160,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  outfitSwatches: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  outfitSwatch: {
    borderRadius: 100,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.08)",
  },
  outfitTag: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "rgba(201,149,106,0.15)",
    borderWidth: 1,
    borderColor: "rgba(201,149,106,0.3)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: ThreadlyRadius.pill,
  },
  outfitTagText: {
    fontSize: 9,
    fontWeight: "700",
    color: ThreadlyColors.roseGoldLight,
    letterSpacing: 1,
  },
  outfitMatch: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "rgba(10,10,10,0.6)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: ThreadlyRadius.pill,
  },
  outfitMatchText: {
    fontSize: 11,
    fontWeight: "700",
    color: ThreadlyColors.roseGoldLight,
  },
  outfitSaveBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  outfitSaveIcon: {
    fontSize: 20,
    color: ThreadlyColors.warmWhiteSubtle,
  },
  outfitCardInfo: {
    padding: 14,
  },
  outfitTitle: {
    fontSize: 15,
    fontFamily: "Georgia",
    color: ThreadlyColors.warmWhite,
    marginBottom: 3,
  },
  outfitOccasion: {
    fontSize: 11,
    color: ThreadlyColors.warmWhiteSubtle,
    marginBottom: 10,
  },
  outfitCardFooter: {},
  outfitOwned: {
    fontSize: 11,
    color: ThreadlyColors.success,
    fontWeight: "600",
  },
  outfitMissing: {
    fontSize: 11,
    color: ThreadlyColors.roseGoldLight,
    fontWeight: "600",
  },

  // Deals
  dealsList: {
    paddingHorizontal: ThreadlySpacing.screenPadding,
    gap: 10,
    marginBottom: 28,
  },
  dealRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: ThreadlyColors.charcoal,
    borderRadius: ThreadlyRadius.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: ThreadlyColors.charcoalLight,
  },
  dealColorBar: {
    width: 5,
    alignSelf: "stretch",
  },
  dealInfo: {
    flex: 1,
    padding: 14,
  },
  dealBrand: {
    fontSize: 9,
    fontWeight: "700",
    color: ThreadlyColors.warmWhiteSubtle,
    letterSpacing: 1.5,
    marginBottom: 3,
  },
  dealItem: {
    fontSize: 14,
    color: ThreadlyColors.warmWhite,
    fontWeight: "600",
    marginBottom: 5,
  },
  dealPricing: { flexDirection: "row", alignItems: "center", gap: 8 },
  dealOriginal: {
    fontSize: 12,
    color: ThreadlyColors.warmWhiteSubtle,
    textDecorationLine: "line-through",
  },
  dealSale: {
    fontSize: 16,
    fontWeight: "700",
    color: ThreadlyColors.success,
  },
  dealOffBadge: {
    marginRight: 14,
    backgroundColor: "rgba(74,155,111,0.15)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: ThreadlyRadius.md,
    borderWidth: 1,
    borderColor: "rgba(74,155,111,0.25)",
  },
  dealOffText: {
    fontSize: 13,
    fontWeight: "700",
    color: ThreadlyColors.success,
  },

  // Trends
  trendGrid: {
    paddingHorizontal: ThreadlySpacing.screenPadding,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 28,
  },
  trendCard: {
    width: (width - ThreadlySpacing.screenPadding * 2 - 10) / 2,
    backgroundColor: ThreadlyColors.charcoal,
    borderRadius: ThreadlyRadius.lg,
    borderWidth: 1,
    borderColor: ThreadlyColors.charcoalLight,
    overflow: "hidden",
  },
  trendCardInner: { padding: 14 },
  trendHeatRow: { flexDirection: "row", alignItems: "center", gap: 5, marginBottom: 6 },
  trendHeatDot: { width: 6, height: 6, borderRadius: 3 },
  trendHeat: { fontSize: 11, fontWeight: "700", letterSpacing: 0.5 },
  trendLabel: {
    fontSize: 14,
    fontFamily: "Georgia",
    color: ThreadlyColors.warmWhite,
    marginBottom: 4,
  },
  trendDesc: {
    fontSize: 11,
    color: ThreadlyColors.warmWhiteSubtle,
    lineHeight: 15,
  },

  // Intelligence Banner
  intelligenceBanner: {
    marginHorizontal: ThreadlySpacing.screenPadding,
    borderRadius: ThreadlyRadius.xl,
    overflow: "hidden",
    padding: 22,
    borderWidth: 1,
    borderColor: "rgba(201,149,106,0.2)",
  },
  intelligenceBannerBorder: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: ThreadlyColors.roseGold,
    opacity: 0.4,
  },
  intelligenceLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: ThreadlyColors.roseGold,
    letterSpacing: 2,
    marginBottom: 10,
  },
  intelligenceTitle: {
    fontSize: 18,
    fontFamily: "Georgia",
    color: ThreadlyColors.warmWhite,
    lineHeight: 26,
    marginBottom: 14,
    fontStyle: "italic",
  },
  intelligenceCta: {
    fontSize: 13,
    color: ThreadlyColors.roseGoldLight,
    fontWeight: "600",
  },
});
