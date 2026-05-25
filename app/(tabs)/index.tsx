/**
 * Threadly — Home Screen
 * The AI Stylist hub: Today's Look, Personalized Recommendations, Deals Found For You.
 * Emotional outcome: "Like having a stylist who understands you."
 */

import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Dimensions, FlatList } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { ThreadlyColors, ThreadlyRadius, ThreadlySpacing, ThreadlyShadow } from "@/constants/threadly";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.72;

// ─── Mock Data ───────────────────────────────────────────────────────────────

const TODAYS_LOOK = {
  occasion: "Work Meeting",
  matchPercent: 92,
  ownedPercent: 78,
  items: ["Camel Blazer", "Black Tee", "Wide-Leg Trousers", "Heeled Mules", "Mini Bag"],
  colors: ["#C4A882", "#1A1A1A", "#2A2A2A", "#C4A882", "#1A1A1A"],
};

const RECOMMENDED_LOOKS = [
  { id: "1", title: "Modern Minimal", occasion: "Work", match: 95, addItems: 2, price: 54, color: "#1E1A16" },
  { id: "2", title: "Casual Chic", occasion: "Weekend", match: 88, addItems: 1, price: 42, color: "#1A1A1A" },
  { id: "3", title: "Date Night", occasion: "Evening", match: 90, addItems: 2, price: 61, color: "#1A1014" },
  { id: "4", title: "Effortless Neutrals", occasion: "Casual", match: 92, addItems: 1, price: 37, color: "#1E1A10" },
];

const DEALS = [
  { id: "1", brand: "ZARA", item: "Oversized Blazer", original: 110, sale: 59, off: 46, color: "#C4A882" },
  { id: "2", brand: "MANGO", item: "Straight Leg Jeans", original: 89, sale: 49, off: 45, color: "#2A3A5A" },
  { id: "3", brand: "ALDO", item: "Heeled Sandal", original: 90, sale: 56, off: 38, color: "#3A2A1A" },
];

const TREND_ITEMS = [
  { id: "1", trend: "Quiet Luxury", desc: "Understated elegance", tag: "TRENDING" },
  { id: "2", trend: "Coastal Grandmother", desc: "Linen & relaxed fits", tag: "RISING" },
  { id: "3", trend: "Office Siren", desc: "Power dressing returns", tag: "HOT" },
];

// ─── Main Component ───────────────────────────────────────────────────────────

export default function HomeScreen() {
  return (
    <ScreenContainer containerClassName="bg-[#0A0A0A]" edges={["top", "left", "right"]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <HomeHeader />

        {/* Today's Look Card */}
        <TodaysLookCard />

        {/* Section: AI Recommended Looks */}
        <SectionHeader title="AI Recommended For You" subtitle="Built from your closet" onSeeAll={() => router.push("/(tabs)/looks")} />
        <RecommendedLooks />

        {/* Section: Deals Found For You */}
        <SectionHeader title="Deals Found For You" subtitle="On pieces that complete your looks" onSeeAll={() => router.push("/(tabs)/shop")} />
        <DealsRow />

        {/* Section: Trending Now */}
        <SectionHeader title="Trending Now" subtitle="Styles you'll love" />
        <TrendRow />

        {/* Go New CTA Banner */}
        <GoNewBanner />

        <View style={{ height: 32 }} />
      </ScrollView>
    </ScreenContainer>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function HomeHeader() {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.greeting}>Good morning ✦</Text>
        <Text style={styles.headerTitle}>Your AI Stylist is ready</Text>
      </View>
      <TouchableOpacity style={styles.notifBtn} activeOpacity={0.7}>
        <Text style={styles.notifIcon}>🔔</Text>
      </TouchableOpacity>
    </View>
  );
}

function TodaysLookCard() {
  return (
    <TouchableOpacity
      style={styles.todayCard}
      activeOpacity={0.92}
      onPress={() => router.push("/(tabs)/looks")}
    >
      <LinearGradient
        colors={["#1E1A16", "#2A2218"]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      {/* Rose gold border glow */}
      <View style={styles.todayCardBorder} />

      <View style={styles.todayCardTop}>
        <View>
          <Text style={styles.todayLabel}>TODAY'S LOOK</Text>
          <Text style={styles.todaySubLabel}>Curated for you</Text>
        </View>
        <View style={styles.matchBadge}>
          <Text style={styles.matchPercent}>{TODAYS_LOOK.matchPercent}%</Text>
          <Text style={styles.matchLabel}>match</Text>
        </View>
      </View>

      {/* Color swatches representing the look */}
      <View style={styles.colorSwatches}>
        {TODAYS_LOOK.colors.map((c, i) => (
          <View key={i} style={[styles.swatch, { backgroundColor: c }]} />
        ))}
      </View>

      {/* Items list */}
      <View style={styles.itemsList}>
        {TODAYS_LOOK.items.map((item, i) => (
          <View key={i} style={styles.itemRow}>
            <View style={styles.itemDot} />
            <Text style={styles.itemText}>{item}</Text>
          </View>
        ))}
      </View>

      <View style={styles.todayCardBottom}>
        <View style={styles.ownedBadge}>
          <Text style={styles.ownedText}>You own {TODAYS_LOOK.ownedPercent}% of this look</Text>
        </View>
        <View style={styles.occasionBadge}>
          <Text style={styles.occasionText}>{TODAYS_LOOK.occasion}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function SectionHeader({ title, subtitle, onSeeAll }: { title: string; subtitle?: string; onSeeAll?: () => void }) {
  return (
    <View style={styles.sectionHeader}>
      <View>
        <Text style={styles.sectionTitle}>{title}</Text>
        {subtitle && <Text style={styles.sectionSubtitle}>{subtitle}</Text>}
      </View>
      {onSeeAll && (
        <TouchableOpacity onPress={onSeeAll} activeOpacity={0.7}>
          <Text style={styles.seeAll}>See all →</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

function RecommendedLooks() {
  return (
    <FlatList
      data={RECOMMENDED_LOOKS}
      keyExtractor={item => item.id}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.horizontalList}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={[styles.lookCard, { width: CARD_WIDTH, backgroundColor: item.color }]}
          activeOpacity={0.88}
          onPress={() => router.push("/(tabs)/looks")}
        >
          <LinearGradient
            colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.7)"]}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.lookCardTop}>
            <View style={styles.lookMatchBadge}>
              <Text style={styles.lookMatchText}>{item.match}%</Text>
            </View>
          </View>
          <View style={styles.lookCardBottom}>
            <Text style={styles.lookTitle}>{item.title}</Text>
            <Text style={styles.lookOccasion}>{item.occasion}</Text>
            <View style={styles.lookMeta}>
              <Text style={styles.lookAdd}>+ {item.addItems} item{item.addItems > 1 ? "s" : ""}</Text>
              <Text style={styles.lookPrice}>from ${item.price}</Text>
            </View>
          </View>
        </TouchableOpacity>
      )}
    />
  );
}

function DealsRow() {
  return (
    <View style={styles.dealsContainer}>
      {DEALS.map(deal => (
        <TouchableOpacity
          key={deal.id}
          style={styles.dealCard}
          activeOpacity={0.88}
          onPress={() => router.push("/(tabs)/shop")}
        >
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
      ))}
    </View>
  );
}

function TrendRow() {
  return (
    <FlatList
      data={TREND_ITEMS}
      keyExtractor={item => item.id}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.horizontalList}
      renderItem={({ item }) => (
        <View style={styles.trendCard}>
          <View style={styles.trendTagRow}>
            <Text style={styles.trendTag}>{item.tag}</Text>
          </View>
          <Text style={styles.trendTitle}>{item.trend}</Text>
          <Text style={styles.trendDesc}>{item.desc}</Text>
        </View>
      )}
    />
  );
}

function GoNewBanner() {
  return (
    <TouchableOpacity
      style={styles.goNewBanner}
      activeOpacity={0.88}
      onPress={() => router.push("/(tabs)/gonew")}
    >
      <LinearGradient
        colors={["#2A1A0A", "#1A0A0A"]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <View style={styles.goNewBannerBorder} />
      <View style={styles.goNewContent}>
        <View>
          <Text style={styles.goNewLabel}>✦ THE MAGIC FEATURE</Text>
          <Text style={styles.goNewTitle}>Go New.</Text>
          <Text style={styles.goNewDesc}>
            Build fresh looks from what you own — then find the missing pieces for less.
          </Text>
        </View>
        <View style={styles.goNewArrow}>
          <Text style={styles.goNewArrowText}>→</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: ThreadlyColors.black },
  scrollContent: { paddingBottom: 24 },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: ThreadlySpacing.screenPadding,
    paddingTop: 16,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 12,
    color: ThreadlyColors.roseGold,
    letterSpacing: 1,
    fontWeight: "600",
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: "Georgia",
    color: ThreadlyColors.warmWhite,
    lineHeight: 28,
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

  // Today's Look Card
  todayCard: {
    marginHorizontal: ThreadlySpacing.screenPadding,
    borderRadius: ThreadlyRadius["2xl"],
    padding: 20,
    marginBottom: 28,
    overflow: "hidden",
    position: "relative",
    ...ThreadlyShadow.roseGlow,
  },
  todayCardBorder: {
    position: "absolute",
    inset: 0,
    borderRadius: ThreadlyRadius["2xl"],
    borderWidth: 1,
    borderColor: "rgba(201,149,106,0.3)",
  },
  todayCardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  todayLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: ThreadlyColors.roseGold,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  todaySubLabel: { fontSize: 12, color: ThreadlyColors.warmWhiteSubtle },
  matchBadge: { alignItems: "center" },
  matchPercent: {
    fontSize: 28,
    fontFamily: "Georgia",
    color: ThreadlyColors.roseGoldLight,
    lineHeight: 32,
  },
  matchLabel: { fontSize: 10, color: ThreadlyColors.warmWhiteSubtle, letterSpacing: 0.5 },

  // Color swatches
  colorSwatches: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 14,
  },
  swatch: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },

  // Items list
  itemsList: { gap: 6, marginBottom: 16 },
  itemRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  itemDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: ThreadlyColors.roseGoldDim,
  },
  itemText: { fontSize: 13, color: ThreadlyColors.warmWhiteMuted },

  todayCardBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ownedBadge: {
    backgroundColor: "rgba(201,149,106,0.15)",
    borderRadius: ThreadlyRadius.pill,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "rgba(201,149,106,0.3)",
  },
  ownedText: { fontSize: 11, color: ThreadlyColors.roseGoldLight },
  occasionBadge: {
    backgroundColor: ThreadlyColors.charcoalMid,
    borderRadius: ThreadlyRadius.pill,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  occasionText: { fontSize: 11, color: ThreadlyColors.warmWhiteMuted },

  // Section headers
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: ThreadlySpacing.screenPadding,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontFamily: "Georgia",
    color: ThreadlyColors.warmWhite,
    marginBottom: 2,
  },
  sectionSubtitle: { fontSize: 12, color: ThreadlyColors.warmWhiteSubtle },
  seeAll: { fontSize: 12, color: ThreadlyColors.roseGold, fontWeight: "600" },

  // Recommended Looks
  horizontalList: { paddingHorizontal: ThreadlySpacing.screenPadding, gap: 12, paddingBottom: 4 },
  lookCard: {
    height: 220,
    borderRadius: ThreadlyRadius.xl,
    overflow: "hidden",
    position: "relative",
    marginBottom: 20,
  },
  lookCardTop: { padding: 12, alignItems: "flex-end" },
  lookMatchBadge: {
    backgroundColor: "rgba(201,149,106,0.9)",
    borderRadius: ThreadlyRadius.pill,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  lookMatchText: { fontSize: 11, fontWeight: "700", color: ThreadlyColors.warmWhite },
  lookCardBottom: { position: "absolute", bottom: 0, left: 0, right: 0, padding: 14 },
  lookTitle: {
    fontSize: 16,
    fontFamily: "Georgia",
    color: ThreadlyColors.warmWhite,
    marginBottom: 2,
  },
  lookOccasion: { fontSize: 11, color: ThreadlyColors.warmWhiteMuted, marginBottom: 8 },
  lookMeta: { flexDirection: "row", justifyContent: "space-between" },
  lookAdd: { fontSize: 11, color: ThreadlyColors.roseGoldLight },
  lookPrice: { fontSize: 12, fontWeight: "700", color: ThreadlyColors.warmWhite },

  // Deals
  dealsContainer: {
    paddingHorizontal: ThreadlySpacing.screenPadding,
    gap: 8,
    marginBottom: 28,
  },
  dealCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: ThreadlyColors.charcoal,
    borderRadius: ThreadlyRadius.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: ThreadlyColors.charcoalLight,
  },
  dealColorBar: { width: 4, height: "100%", minHeight: 64 },
  dealInfo: { flex: 1, padding: 14 },
  dealBrand: {
    fontSize: 10,
    fontWeight: "700",
    color: ThreadlyColors.warmWhiteSubtle,
    letterSpacing: 1.5,
    marginBottom: 2,
  },
  dealItem: { fontSize: 14, color: ThreadlyColors.warmWhite, marginBottom: 6 },
  dealPricing: { flexDirection: "row", alignItems: "center", gap: 8 },
  dealOriginal: {
    fontSize: 12,
    color: ThreadlyColors.warmWhiteSubtle,
    textDecorationLine: "line-through",
  },
  dealSale: { fontSize: 15, fontWeight: "700", color: ThreadlyColors.warmWhite },
  dealOffBadge: {
    backgroundColor: ThreadlyColors.dealBg,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: ThreadlyRadius.md,
    borderWidth: 1,
    borderColor: "rgba(74,155,111,0.3)",
  },
  dealOffText: { fontSize: 13, fontWeight: "700", color: ThreadlyColors.deal },

  // Trends
  trendCard: {
    width: 160,
    backgroundColor: ThreadlyColors.charcoal,
    borderRadius: ThreadlyRadius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: ThreadlyColors.charcoalLight,
    marginBottom: 20,
  },
  trendTagRow: { marginBottom: 8 },
  trendTag: {
    fontSize: 9,
    fontWeight: "700",
    color: ThreadlyColors.roseGold,
    letterSpacing: 1.5,
  },
  trendTitle: {
    fontSize: 14,
    fontFamily: "Georgia",
    color: ThreadlyColors.warmWhite,
    marginBottom: 4,
    lineHeight: 18,
  },
  trendDesc: { fontSize: 11, color: ThreadlyColors.warmWhiteSubtle, lineHeight: 15 },

  // Go New Banner
  goNewBanner: {
    marginHorizontal: ThreadlySpacing.screenPadding,
    borderRadius: ThreadlyRadius["2xl"],
    overflow: "hidden",
    position: "relative",
    ...ThreadlyShadow.roseGlow,
  },
  goNewBannerBorder: {
    position: "absolute",
    inset: 0,
    borderRadius: ThreadlyRadius["2xl"],
    borderWidth: 1,
    borderColor: "rgba(201,149,106,0.4)",
  },
  goNewContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 22,
  },
  goNewLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: ThreadlyColors.roseGold,
    letterSpacing: 2,
    marginBottom: 6,
  },
  goNewTitle: {
    fontSize: 28,
    fontFamily: "Georgia",
    color: ThreadlyColors.warmWhite,
    marginBottom: 6,
    lineHeight: 32,
  },
  goNewDesc: {
    fontSize: 13,
    color: ThreadlyColors.warmWhiteMuted,
    lineHeight: 18,
    maxWidth: 220,
  },
  goNewArrow: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(201,149,106,0.2)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(201,149,106,0.4)",
  },
  goNewArrowText: { fontSize: 18, color: ThreadlyColors.roseGoldLight },
});
