/**
 * Threadly — Shop Screen
 * AI shopping engine: deals found for you, price comparison, brand discovery.
 */

import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ScreenContainer } from "@/components/screen-container";
import { ThreadlyColors, ThreadlyRadius, ThreadlySpacing, ThreadlyShadow } from "@/constants/threadly";

const { width } = Dimensions.get("window");

const SHOP_TABS = ["Deals For You", "Trending", "Your Brands", "New Arrivals"];

const DEALS = [
  {
    id: "1",
    brand: "ZARA",
    item: "Oversized Blazer",
    desc: "Neutral Taupe — High Demand",
    original: 110,
    sale: 59,
    off: 46,
    color: "#C4A882",
    tag: "BEST DEAL",
  },
  {
    id: "2",
    brand: "MANGO",
    item: "Straight Leg Jeans",
    desc: "Mid-rise, Classic Wash",
    original: 89,
    sale: 49,
    off: 45,
    color: "#3A5A8A",
    tag: "TRENDING",
  },
  {
    id: "3",
    brand: "ALDO",
    item: "Heeled Sandal",
    desc: "Nude, Block Heel",
    original: 90,
    sale: 56,
    off: 38,
    color: "#C4A882",
    tag: null,
  },
  {
    id: "4",
    brand: "H&M",
    item: "Linen Blazer",
    desc: "Relaxed Fit, Cream",
    original: 70,
    sale: 35,
    off: 50,
    color: "#E8DDD0",
    tag: "50% OFF",
  },
  {
    id: "5",
    brand: "ASOS",
    item: "Wide Leg Trousers",
    desc: "High-waist, Black",
    original: 65,
    sale: 39,
    off: 40,
    color: "#1A1A1A",
    tag: null,
  },
];

const PRICE_COMPARISON = [
  { retailer: "ZARA", price: 59.90, off: 40, isBest: false },
  { retailer: "H&M", price: 59.99, off: 25, isBest: false },
  { retailer: "ASOS", price: 58.00, off: 30, isBest: true },
  { retailer: "MACY'S", price: 89.00, off: 20, isBest: false },
  { retailer: "NORDSTROM", price: 99.00, off: 0, isBest: false },
];

const BRANDS = ["ZARA", "ARITZIA", "H&M", "NIKE", "MANGO", "REVOLVE", "NORDSTROM", "AMAZON"];

export default function ShopScreen() {
  const [activeTab, setActiveTab] = useState("Deals For You");
  const [savedDeals, setSavedDeals] = useState<string[]>([]);

  const toggleSave = (id: string) => {
    setSavedDeals(prev =>
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    );
  };

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
            <Text style={styles.headerTitle}>AI Shopping Engine</Text>
            <Text style={styles.headerSub}>Finding the best pieces for your look...</Text>
          </View>
          <View style={styles.aiIndicator}>
            <LinearGradient
              colors={[ThreadlyColors.roseGold, ThreadlyColors.roseGoldLight]}
              style={styles.aiIndicatorGradient}
            >
              <Text style={styles.aiIndicatorText}>AI</Text>
            </LinearGradient>
          </View>
        </View>

        {/* Budget & Brands Setup Card */}
        <View style={styles.setupCard}>
          <LinearGradient colors={["#1E1A16", "#2A2218"]} style={StyleSheet.absoluteFill} />
          <View style={styles.setupBorder} />

          <View style={styles.setupRow}>
            <Text style={styles.setupLabel}>Budget</Text>
            <Text style={styles.setupValue}>$150</Text>
          </View>

          <View style={styles.budgetBar}>
            <LinearGradient
              colors={[ThreadlyColors.roseGold, ThreadlyColors.roseGoldLight]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.budgetFill, { width: "50%" }]}
            />
          </View>
          <View style={styles.budgetLabels}>
            <Text style={styles.budgetMin}>$50</Text>
            <Text style={styles.budgetMax}>$300+</Text>
          </View>

          <Text style={styles.setupLabel}>Preferred Brands</Text>
          <View style={styles.brandPills}>
            {BRANDS.slice(0, 4).map((b, i) => (
              <View key={i} style={styles.brandPill}>
                <Text style={styles.brandPillText}>{b}</Text>
              </View>
            ))}
            <TouchableOpacity style={styles.addBrandBtn} activeOpacity={0.7}>
              <Text style={styles.addBrandText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabList}
          style={styles.tabScroll}
        >
          {SHOP_TABS.map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tabPill, activeTab === tab && styles.tabPillActive]}
              activeOpacity={0.7}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Deals List */}
        <View style={styles.dealsList}>
          {DEALS.map(deal => (
            <TouchableOpacity key={deal.id} style={styles.dealCard} activeOpacity={0.88}>
              <View style={[styles.dealColorBlock, { backgroundColor: deal.color }]} />
              <View style={styles.dealInfo}>
                <View style={styles.dealTopRow}>
                  <Text style={styles.dealBrand}>{deal.brand}</Text>
                  {deal.tag && (
                    <View style={styles.dealTagBadge}>
                      <Text style={styles.dealTagText}>{deal.tag}</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.dealItem}>{deal.item}</Text>
                <Text style={styles.dealDesc}>{deal.desc}</Text>
                <View style={styles.dealPricing}>
                  <Text style={styles.dealOriginal}>${deal.original}</Text>
                  <Text style={styles.dealSale}>${deal.sale}</Text>
                  <View style={styles.dealOffBadge}>
                    <Text style={styles.dealOffText}>-{deal.off}%</Text>
                  </View>
                </View>
              </View>
              <View style={styles.dealActions}>
                <TouchableOpacity
                  style={styles.heartBtn}
                  activeOpacity={0.7}
                  onPress={() => toggleSave(deal.id)}
                >
                  <Text style={[styles.heartIcon, savedDeals.includes(deal.id) && styles.heartIconSaved]}>
                    {savedDeals.includes(deal.id) ? "♥" : "♡"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.viewDealBtn} activeOpacity={0.85}>
                  <Text style={styles.viewDealText}>VIEW</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Price Comparison Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>AI Price Comparison</Text>
          <Text style={styles.sectionSub}>Oversized Blazer — Neutral Taupe</Text>
        </View>

        <View style={styles.priceCompCard}>
          <LinearGradient colors={["#1E1A16", "#2A2218"]} style={StyleSheet.absoluteFill} />
          <View style={styles.priceCompBorder} />
          {PRICE_COMPARISON.map((item, i) => (
            <View key={i} style={[styles.priceRow, item.isBest && styles.priceRowBest]}>
              {item.isBest && (
                <View style={styles.bestPriceBadge}>
                  <Text style={styles.bestPriceText}>BEST PRICE</Text>
                </View>
              )}
              <Text style={[styles.priceRetailer, item.isBest && styles.priceRetailerBest]}>
                {item.retailer}
              </Text>
              <View style={styles.priceMeta}>
                <Text style={[styles.priceValue, item.isBest && styles.priceValueBest]}>
                  ${item.price.toFixed(2)}
                </Text>
                {item.off > 0 && (
                  <View style={styles.priceOffBadge}>
                    <Text style={styles.priceOffText}>-{item.off}%</Text>
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* AI Signature Behaviors */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Signature AI Behaviors</Text>
        </View>

        <View style={styles.aiBehaviors}>
          {[
            { quote: "Build me a new outfit using my closet first.", icon: "◈" },
            { quote: "Only show me brands I actually wear.", icon: "♡" },
            { quote: "Find the cheapest way to complete the look.", icon: "◆" },
            { quote: "Make me look current without overspending.", icon: "✦" },
          ].map((b, i) => (
            <View key={i} style={styles.aiBehaviorCard}>
              <Text style={styles.aiBehaviorIcon}>{b.icon}</Text>
              <Text style={styles.aiBehaviorText}>"{b.quote}"</Text>
            </View>
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
    fontSize: 22,
    fontFamily: "Georgia",
    color: ThreadlyColors.warmWhite,
    marginBottom: 4,
  },
  headerSub: { fontSize: 13, color: ThreadlyColors.warmWhiteSubtle },
  aiIndicator: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: "hidden",
    ...ThreadlyShadow.roseGlow,
  },
  aiIndicatorGradient: { flex: 1, alignItems: "center", justifyContent: "center" },
  aiIndicatorText: { fontSize: 14, fontWeight: "700", color: ThreadlyColors.warmWhite },

  setupCard: {
    marginHorizontal: ThreadlySpacing.screenPadding,
    borderRadius: ThreadlyRadius["2xl"],
    padding: 18,
    overflow: "hidden",
    position: "relative",
    marginBottom: 20,
    ...ThreadlyShadow.roseGlow,
  },
  setupBorder: {
    position: "absolute",
    inset: 0,
    borderRadius: ThreadlyRadius["2xl"],
    borderWidth: 1,
    borderColor: "rgba(201,149,106,0.3)",
  },
  setupRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  setupLabel: { fontSize: 12, color: ThreadlyColors.warmWhiteSubtle, marginBottom: 8 },
  setupValue: { fontSize: 16, fontWeight: "700", color: ThreadlyColors.warmWhite },
  budgetBar: {
    height: 4,
    backgroundColor: ThreadlyColors.charcoalLight,
    borderRadius: 2,
    overflow: "hidden",
    marginBottom: 4,
  },
  budgetFill: { height: "100%", borderRadius: 2 },
  budgetLabels: { flexDirection: "row", justifyContent: "space-between", marginBottom: 14 },
  budgetMin: { fontSize: 10, color: ThreadlyColors.warmWhiteSubtle },
  budgetMax: { fontSize: 10, color: ThreadlyColors.warmWhiteSubtle },
  brandPills: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  brandPill: {
    backgroundColor: ThreadlyColors.charcoalMid,
    borderRadius: ThreadlyRadius.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: ThreadlyColors.charcoalLight,
  },
  brandPillText: { fontSize: 11, fontWeight: "700", color: ThreadlyColors.warmWhiteMuted },
  addBrandBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: ThreadlyColors.charcoalMid,
    borderWidth: 1,
    borderColor: ThreadlyColors.roseGoldDim,
    alignItems: "center",
    justifyContent: "center",
  },
  addBrandText: { fontSize: 18, color: ThreadlyColors.roseGold, lineHeight: 22 },

  tabScroll: { marginBottom: 16 },
  tabList: { paddingHorizontal: ThreadlySpacing.screenPadding, gap: 8 },
  tabPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: ThreadlyRadius.pill,
    backgroundColor: ThreadlyColors.charcoal,
    borderWidth: 1,
    borderColor: ThreadlyColors.charcoalLight,
  },
  tabPillActive: {
    backgroundColor: ThreadlyColors.roseGold,
    borderColor: ThreadlyColors.roseGold,
  },
  tabText: { fontSize: 13, color: ThreadlyColors.warmWhiteSubtle, fontWeight: "600" },
  tabTextActive: { color: ThreadlyColors.warmWhite },

  dealsList: {
    paddingHorizontal: ThreadlySpacing.screenPadding,
    gap: 10,
    marginBottom: 28,
  },
  dealCard: {
    flexDirection: "row",
    backgroundColor: ThreadlyColors.charcoal,
    borderRadius: ThreadlyRadius.xl,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: ThreadlyColors.charcoalLight,
  },
  dealColorBlock: { width: 5 },
  dealInfo: { flex: 1, padding: 14 },
  dealTopRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 },
  dealBrand: {
    fontSize: 9,
    fontWeight: "700",
    color: ThreadlyColors.warmWhiteSubtle,
    letterSpacing: 1.5,
  },
  dealTagBadge: {
    backgroundColor: ThreadlyColors.roseGoldDim,
    borderRadius: ThreadlyRadius.pill,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  dealTagText: { fontSize: 8, fontWeight: "700", color: ThreadlyColors.roseGoldLight, letterSpacing: 0.5 },
  dealItem: { fontSize: 15, color: ThreadlyColors.warmWhite, marginBottom: 2 },
  dealDesc: { fontSize: 11, color: ThreadlyColors.warmWhiteSubtle, marginBottom: 8 },
  dealPricing: { flexDirection: "row", alignItems: "center", gap: 8 },
  dealOriginal: {
    fontSize: 12,
    color: ThreadlyColors.warmWhiteSubtle,
    textDecorationLine: "line-through",
  },
  dealSale: { fontSize: 16, fontWeight: "700", color: ThreadlyColors.warmWhite },
  dealOffBadge: {
    backgroundColor: ThreadlyColors.dealBg,
    borderRadius: ThreadlyRadius.pill,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: "rgba(74,155,111,0.3)",
  },
  dealOffText: { fontSize: 11, fontWeight: "700", color: ThreadlyColors.deal },
  dealActions: {
    padding: 12,
    alignItems: "center",
    justifyContent: "space-between",
  },
  heartBtn: { padding: 4 },
  heartIcon: { fontSize: 20, color: ThreadlyColors.warmWhiteSubtle },
  heartIconSaved: { color: ThreadlyColors.roseGold },
  viewDealBtn: {
    backgroundColor: ThreadlyColors.charcoalMid,
    borderRadius: ThreadlyRadius.md,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: ThreadlyColors.roseGoldDim,
  },
  viewDealText: { fontSize: 10, fontWeight: "700", color: ThreadlyColors.roseGoldLight, letterSpacing: 0.5 },

  sectionHeader: {
    paddingHorizontal: ThreadlySpacing.screenPadding,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontFamily: "Georgia",
    color: ThreadlyColors.warmWhite,
    marginBottom: 2,
  },
  sectionSub: { fontSize: 12, color: ThreadlyColors.warmWhiteSubtle },

  priceCompCard: {
    marginHorizontal: ThreadlySpacing.screenPadding,
    borderRadius: ThreadlyRadius.xl,
    overflow: "hidden",
    position: "relative",
    marginBottom: 28,
    ...ThreadlyShadow.roseGlow,
  },
  priceCompBorder: {
    position: "absolute",
    inset: 0,
    borderRadius: ThreadlyRadius.xl,
    borderWidth: 1,
    borderColor: "rgba(201,149,106,0.25)",
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: ThreadlyColors.charcoalLight,
    position: "relative",
  },
  priceRowBest: {
    backgroundColor: "rgba(201,149,106,0.1)",
  },
  bestPriceBadge: {
    position: "absolute",
    left: 16,
    top: -8,
    backgroundColor: ThreadlyColors.roseGold,
    borderRadius: ThreadlyRadius.pill,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  bestPriceText: { fontSize: 8, fontWeight: "700", color: ThreadlyColors.warmWhite, letterSpacing: 0.5 },
  priceRetailer: { fontSize: 13, color: ThreadlyColors.warmWhiteMuted, fontWeight: "600" },
  priceRetailerBest: { color: ThreadlyColors.roseGoldLight },
  priceMeta: { flexDirection: "row", alignItems: "center", gap: 8 },
  priceValue: { fontSize: 15, fontWeight: "700", color: ThreadlyColors.warmWhite },
  priceValueBest: { color: ThreadlyColors.roseGoldLight },
  priceOffBadge: {
    backgroundColor: ThreadlyColors.dealBg,
    borderRadius: ThreadlyRadius.pill,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  priceOffText: { fontSize: 10, fontWeight: "700", color: ThreadlyColors.deal },

  aiBehaviors: {
    paddingHorizontal: ThreadlySpacing.screenPadding,
    gap: 8,
  },
  aiBehaviorCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: ThreadlyColors.charcoal,
    borderRadius: ThreadlyRadius.lg,
    padding: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: ThreadlyColors.charcoalLight,
  },
  aiBehaviorIcon: { fontSize: 14, color: ThreadlyColors.roseGoldDim },
  aiBehaviorText: { fontSize: 13, color: ThreadlyColors.warmWhiteMuted, fontStyle: "italic", flex: 1 },
});
