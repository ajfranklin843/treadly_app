/**
 * Threadly — Home
 * The AI stylist daily feed. Deck-faithful visual benchmark.
 * Emotional outcome: "She knows exactly what I need today."
 */

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Dimensions,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ScreenContainer } from "@/components/screen-container";
import {
  ThreadlyColors,
  ThreadlySpacing,
  ThreadlyRadius,
} from "@/constants/threadly";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

const TREND_CARDS = [
  {
    id: "1",
    label: "TRENDING NOW",
    title: "Quiet Luxury",
    sub: "Understated elegance is everywhere",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
  },
  {
    id: "2",
    label: "THIS WEEK",
    title: "Coastal Chic",
    sub: "Breezy, effortless, editorial",
    image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&q=80",
  },
  {
    id: "3",
    label: "RISING",
    title: "Power Dressing",
    sub: "Structured silhouettes return",
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80",
  },
];

const DEAL_ALERTS = [
  {
    id: "1",
    brand: "ZARA",
    item: "Oversized Blazer",
    original: 110,
    sale: 59,
    off: 46,
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=300&q=80",
    expiry: "2h left",
  },
  {
    id: "2",
    brand: "MANGO",
    item: "Straight-Leg Jeans",
    original: 80,
    sale: 44,
    off: 45,
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&q=80",
    expiry: "24h left",
  },
  {
    id: "3",
    brand: "ALDO",
    item: "Slingback Heels",
    original: 95,
    sale: 55,
    off: 42,
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=300&q=80",
    expiry: "6h left",
  },
];

const OUTFIT_IMAGE = "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=700&q=80";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScreenContainer containerClassName="bg-[#0A0A0A]" edges={["top", "left", "right"]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Branded Header ── */}
        <View style={styles.brandHeader}>
          <View>
            <Text style={styles.wordmark}>THREADLY</Text>
            <Text style={styles.tagline}>The AI stylist that shops smarter.</Text>
          </View>
          <TouchableOpacity style={styles.notifBtn} activeOpacity={0.7}>
            <Text style={styles.notifIcon}>♡</Text>
            <View style={styles.notifDot} />
          </TouchableOpacity>
        </View>

        {/* ── Today's Look Hero ── */}
        <View style={styles.heroCard}>
          <View style={styles.heroImageWrap}>
            <Image source={{ uri: OUTFIT_IMAGE }} style={styles.heroImage} resizeMode="cover" />
            <LinearGradient
              colors={["transparent", "rgba(10,10,10,0.85)"]}
              style={StyleSheet.absoluteFill}
            />
            {/* Top badge */}
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>✦ TODAY'S LOOK</Text>
            </View>
            {/* Bottom overlay */}
            <View style={styles.heroOverlay}>
              <View style={styles.heroOverlayLeft}>
                <Text style={styles.heroLookName}>The Boardroom Edit</Text>
                <Text style={styles.heroLookSub}>Curated for your 9am meeting</Text>
              </View>
              <View style={styles.heroMatchBadge}>
                <Text style={styles.heroMatchPct}>94%</Text>
                <Text style={styles.heroMatchLabel}>match</Text>
              </View>
            </View>
          </View>

          {/* Owned indicator */}
          <View style={styles.heroFooter}>
            <LinearGradient colors={["#1A1410", "#1A1A1A"]} style={StyleSheet.absoluteFill} />
            <View style={styles.heroFooterContent}>
              <View style={styles.ownedRow}>
                <View style={styles.ownedBar}>
                  <View style={[styles.ownedFill, { width: "80%" }]} />
                </View>
                <Text style={styles.ownedText}>You own 80% of this look</Text>
              </View>
              <TouchableOpacity style={styles.heroViewBtn} activeOpacity={0.85}>
                <Text style={styles.heroViewBtnText}>View Look →</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

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
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.goNewCtaContent}>
            <View>
              <Text style={styles.goNewCtaTitle}>Go New ✦</Text>
              <Text style={styles.goNewCtaSub}>Build a fresh look from your closet</Text>
            </View>
            <View style={styles.goNewCtaArrow}>
              <Text style={styles.goNewCtaArrowText}>→</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* ── Trend Cards ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>TRENDING NOW</Text>
          <Text style={styles.sectionTitle}>What's moving in fashion</Text>
        </View>

        <FlatList
          data={TREND_CARDS}
          keyExtractor={t => t.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.trendList}
          renderItem={({ item: trend }) => (
            <TouchableOpacity style={styles.trendCard} activeOpacity={0.88}>
              <Image source={{ uri: trend.image }} style={styles.trendImage} resizeMode="cover" />
              <LinearGradient
                colors={["transparent", "rgba(10,10,10,0.9)"]}
                style={StyleSheet.absoluteFill}
              />
              <View style={styles.trendOverlay}>
                <Text style={styles.trendLabel}>{trend.label}</Text>
                <Text style={styles.trendTitle}>{trend.title}</Text>
                <Text style={styles.trendSub}>{trend.sub}</Text>
              </View>
            </TouchableOpacity>
          )}
        />

        {/* ── Deal Alerts ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>DEAL ALERTS</Text>
          <Text style={styles.sectionTitle}>Pieces for your looks, on sale now</Text>
        </View>

        <FlatList
          data={DEAL_ALERTS}
          keyExtractor={d => d.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.dealList}
          renderItem={({ item: deal }) => (
            <TouchableOpacity style={styles.dealCard} activeOpacity={0.88}>
              <View style={styles.dealImageWrap}>
                <Image source={{ uri: deal.image }} style={styles.dealImage} resizeMode="cover" />
                <View style={styles.dealOffBadge}>
                  <Text style={styles.dealOffText}>-{deal.off}%</Text>
                </View>
              </View>
              <View style={styles.dealInfo}>
                <Text style={styles.dealBrand}>{deal.brand}</Text>
                <Text style={styles.dealItem} numberOfLines={1}>{deal.item}</Text>
                <View style={styles.dealPricing}>
                  <Text style={styles.dealOriginal}>${deal.original}</Text>
                  <Text style={styles.dealSale}>${deal.sale}</Text>
                </View>
                <Text style={styles.dealExpiry}>{deal.expiry}</Text>
              </View>
            </TouchableOpacity>
          )}
        />

        {/* ── AI Insight ── */}
        <View style={styles.insightCard}>
          <LinearGradient colors={["#1A1410", "#1A1A1A"]} style={StyleSheet.absoluteFill} />
          <View style={styles.insightBorder} />
          <Text style={styles.insightIcon}>✦</Text>
          <Text style={styles.insightTitle}>Stylist Insight</Text>
          <Text style={styles.insightText}>
            "Your most-worn color is black (38%), but you're missing a strong neutral blazer. Adding one would unlock 12 new outfit combinations from what you already own."
          </Text>
          <TouchableOpacity style={styles.insightBtn} activeOpacity={0.8}>
            <Text style={styles.insightBtnText}>Ask your stylist →</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: ThreadlyColors.black },
  scrollContent: { paddingBottom: 32 },

  // ── Branded Header ──
  brandHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: ThreadlySpacing.screenPadding,
    paddingTop: 20,
    paddingBottom: 20,
  },
  wordmark: {
    fontSize: 28,
    fontFamily: "Georgia",
    color: ThreadlyColors.warmWhite,
    letterSpacing: 6,
    marginBottom: 3,
  },
  tagline: {
    fontSize: 12,
    color: ThreadlyColors.warmWhiteSubtle,
    fontStyle: "italic",
    letterSpacing: 0.3,
  },
  notifBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: ThreadlyColors.charcoal,
    alignItems: "center", justifyContent: "center",
    borderWidth: 1, borderColor: "rgba(201,149,106,0.2)",
    position: "relative",
  },
  notifIcon: { fontSize: 18, color: ThreadlyColors.roseGold },
  notifDot: {
    position: "absolute", top: 8, right: 8,
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: ThreadlyColors.roseGold,
    borderWidth: 1.5, borderColor: ThreadlyColors.charcoal,
  },

  // ── Hero Card ──
  heroCard: {
    marginHorizontal: ThreadlySpacing.screenPadding,
    borderRadius: ThreadlyRadius.xl,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(201,149,106,0.2)",
    marginBottom: 20,
    shadowColor: ThreadlyColors.roseGold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
  },
  heroImageWrap: { height: 340, position: "relative" },
  heroImage: { width: "100%", height: "100%" },
  heroBadge: {
    position: "absolute", top: 14, left: 14,
    backgroundColor: "rgba(10,10,10,0.75)",
    paddingHorizontal: 12, paddingVertical: 5,
    borderRadius: ThreadlyRadius.pill,
    borderWidth: 1, borderColor: "rgba(201,149,106,0.35)",
  },
  heroBadgeText: { fontSize: 9, fontWeight: "700", color: ThreadlyColors.roseGoldLight, letterSpacing: 1.5 },
  heroOverlay: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    padding: 16,
  },
  heroOverlayLeft: { flex: 1, marginRight: 12 },
  heroLookName: { fontSize: 22, fontFamily: "Georgia", color: ThreadlyColors.warmWhite, marginBottom: 4 },
  heroLookSub: { fontSize: 12, color: "rgba(250,247,244,0.7)", fontStyle: "italic" },
  heroMatchBadge: {
    backgroundColor: "rgba(10,10,10,0.8)",
    borderRadius: ThreadlyRadius.lg,
    padding: 10, alignItems: "center",
    borderWidth: 1, borderColor: "rgba(201,149,106,0.35)",
    minWidth: 56,
  },
  heroMatchPct: { fontSize: 20, fontFamily: "Georgia", color: ThreadlyColors.roseGoldLight, lineHeight: 22 },
  heroMatchLabel: { fontSize: 9, color: ThreadlyColors.warmWhiteSubtle, letterSpacing: 0.5 },
  heroFooter: {
    overflow: "hidden",
    borderTopWidth: 1,
    borderTopColor: ThreadlyColors.charcoalLight,
  },
  heroFooterContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
    gap: 12,
  },
  ownedRow: { flex: 1, gap: 6 },
  ownedBar: {
    height: 3,
    backgroundColor: ThreadlyColors.charcoalLight,
    borderRadius: 2,
    overflow: "hidden",
  },
  ownedFill: { height: "100%", backgroundColor: ThreadlyColors.roseGold, borderRadius: 2 },
  ownedText: { fontSize: 11, color: ThreadlyColors.warmWhiteSubtle, fontStyle: "italic" },
  heroViewBtn: {
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: ThreadlyRadius.pill,
    borderWidth: 1, borderColor: "rgba(201,149,106,0.35)",
  },
  heroViewBtnText: { fontSize: 12, color: ThreadlyColors.roseGoldLight, fontWeight: "600" },

  // ── Go New CTA ──
  goNewCta: {
    marginHorizontal: ThreadlySpacing.screenPadding,
    borderRadius: ThreadlyRadius.xl,
    overflow: "hidden",
    marginBottom: 28,
    shadowColor: ThreadlyColors.roseGold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 8,
  },
  goNewCtaContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  goNewCtaTitle: { fontSize: 22, fontFamily: "Georgia", color: ThreadlyColors.black, marginBottom: 3 },
  goNewCtaSub: { fontSize: 12, color: "rgba(10,10,10,0.65)" },
  goNewCtaArrow: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: "rgba(10,10,10,0.15)",
    alignItems: "center", justifyContent: "center",
  },
  goNewCtaArrowText: { fontSize: 20, color: ThreadlyColors.black, fontWeight: "700" },

  // ── Section Header ──
  sectionHeader: {
    paddingHorizontal: ThreadlySpacing.screenPadding,
    marginBottom: 14,
  },
  sectionLabel: { fontSize: 9, fontWeight: "700", color: ThreadlyColors.roseGold, letterSpacing: 2, marginBottom: 4 },
  sectionTitle: { fontSize: 18, fontFamily: "Georgia", color: ThreadlyColors.warmWhite },

  // ── Trend Cards ──
  trendList: { paddingLeft: ThreadlySpacing.screenPadding, paddingRight: 8, gap: 12, marginBottom: 28 },
  trendCard: {
    width: width * 0.62,
    height: 200,
    borderRadius: ThreadlyRadius.xl,
    overflow: "hidden",
    borderWidth: 1, borderColor: ThreadlyColors.charcoalLight,
    position: "relative",
  },
  trendImage: { width: "100%", height: "100%" },
  trendOverlay: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    padding: 14,
  },
  trendLabel: { fontSize: 8, fontWeight: "700", color: ThreadlyColors.roseGoldLight, letterSpacing: 1.5, marginBottom: 4 },
  trendTitle: { fontSize: 18, fontFamily: "Georgia", color: ThreadlyColors.warmWhite, marginBottom: 3 },
  trendSub: { fontSize: 11, color: "rgba(250,247,244,0.65)", fontStyle: "italic" },

  // ── Deal Alerts ──
  dealList: { paddingLeft: ThreadlySpacing.screenPadding, paddingRight: 8, gap: 12, marginBottom: 28 },
  dealCard: {
    width: 140,
    backgroundColor: ThreadlyColors.charcoal,
    borderRadius: ThreadlyRadius.xl,
    overflow: "hidden",
    borderWidth: 1, borderColor: ThreadlyColors.charcoalLight,
  },
  dealImageWrap: { height: 140, position: "relative" },
  dealImage: { width: "100%", height: "100%" },
  dealOffBadge: {
    position: "absolute", top: 8, right: 8,
    backgroundColor: ThreadlyColors.success,
    paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: ThreadlyRadius.pill,
  },
  dealOffText: { fontSize: 10, fontWeight: "700", color: "#fff" },
  dealInfo: { padding: 10 },
  dealBrand: { fontSize: 7, fontWeight: "700", color: ThreadlyColors.warmWhiteSubtle, letterSpacing: 1.5, marginBottom: 3 },
  dealItem: { fontSize: 12, color: ThreadlyColors.warmWhite, fontWeight: "600", marginBottom: 5 },
  dealPricing: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 4 },
  dealOriginal: { fontSize: 10, color: ThreadlyColors.warmWhiteSubtle, textDecorationLine: "line-through" },
  dealSale: { fontSize: 14, fontFamily: "Georgia", color: ThreadlyColors.success },
  dealExpiry: { fontSize: 9, color: ThreadlyColors.warmWhiteSubtle },

  // ── AI Insight ──
  insightCard: {
    marginHorizontal: ThreadlySpacing.screenPadding,
    borderRadius: ThreadlyRadius.xl,
    overflow: "hidden",
    borderWidth: 1, borderColor: "rgba(201,149,106,0.2)",
    padding: 20,
  },
  insightBorder: { position: "absolute", top: 0, left: 0, right: 0, height: 1, backgroundColor: ThreadlyColors.roseGold, opacity: 0.4 },
  insightIcon: { fontSize: 18, color: ThreadlyColors.roseGold, marginBottom: 8 },
  insightTitle: { fontSize: 14, fontFamily: "Georgia", color: ThreadlyColors.warmWhite, marginBottom: 10 },
  insightText: {
    fontSize: 13, color: ThreadlyColors.warmWhiteSubtle,
    lineHeight: 20, fontStyle: "italic", marginBottom: 14,
  },
  insightBtn: {
    alignSelf: "flex-start",
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: ThreadlyRadius.pill,
    borderWidth: 1, borderColor: "rgba(201,149,106,0.3)",
  },
  insightBtnText: { fontSize: 12, color: ThreadlyColors.roseGoldLight, fontWeight: "600" },
});
