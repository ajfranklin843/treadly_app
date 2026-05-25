/**
 * Threadly — Shop
 * The AI-powered deal engine. Finds the missing pieces from your looks,
 * tracks prices, surfaces alternatives, and makes every dollar go further.
 * Emotional outcome: "I never overpay for fashion again."
 */

import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
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
const DEAL_CARD_W = width * 0.58;

const SHOP_TABS = ["For You", "Trending", "Brands", "Saved"];

const FEATURED_DEALS = [
  {
    id: "1",
    brand: "ZARA",
    item: "Oversized Camel Blazer",
    original: 110,
    sale: 54,
    off: 51,
    color: "#C4A882",
    reason: "Completes 3 of your looks",
    tag: "BEST MATCH",
  },
  {
    id: "2",
    brand: "MANGO",
    item: "Straight-Leg Trousers",
    original: 80,
    sale: 38,
    off: 52,
    color: "#4A4A5A",
    reason: "Your most-worn style",
    tag: "TRENDING",
  },
  {
    id: "3",
    brand: "AMAZON",
    item: "Gold Hoop Earrings Set",
    original: 28,
    sale: 14,
    off: 50,
    color: "#C9956A",
    reason: "Matches your color DNA",
    tag: "FLASH DEAL",
  },
  {
    id: "4",
    brand: "H&M",
    item: "Linen Wide-Leg Pants",
    original: 50,
    sale: 25,
    off: 50,
    color: "#E8DDD0",
    reason: "Trending: Quiet Luxury",
    tag: "HOT NOW",
  },
];

const SMART_PICKS = [
  { id: "1", brand: "TARGET", item: "White Sneakers", original: 40, sale: 28, off: 30, color: "#F5F5F0" },
  { id: "2", brand: "ASOS", item: "Silk-Look Blouse", original: 55, sale: 29, off: 47, color: "#E8C4B4" },
  { id: "3", brand: "NORDSTROM", item: "Leather Belt", original: 45, sale: 22, off: 51, color: "#8B5E3C" },
  { id: "4", brand: "SHEIN", item: "Ribbed Midi Skirt", original: 24, sale: 12, off: 50, color: "#C9956A" },
  { id: "5", brand: "REVOLVE", item: "Wrap Mini Dress", original: 148, sale: 74, off: 50, color: "#2C2416" },
  { id: "6", brand: "EVERLANE", item: "Day Glove Flat", original: 145, sale: 87, off: 40, color: "#C4A882" },
];

const BRANDS = [
  { name: "Zara", saved: 142, deals: 8, color: "#1A1A1A" },
  { name: "Mango", saved: 87, deals: 5, color: "#8B7355" },
  { name: "H&M", saved: 63, deals: 12, color: "#E8383B" },
  { name: "Amazon", saved: 210, deals: 24, color: "#FF9900" },
  { name: "Target", saved: 95, deals: 9, color: "#CC0000" },
  { name: "Aritzia", saved: 178, deals: 4, color: "#2C2416" },
];

const PRICE_ALERTS = [
  { id: "1", item: "COS Linen Blazer", target: 80, current: 95, progress: 0.84 },
  { id: "2", item: "Toteme Scarf", target: 120, current: 180, progress: 0.67 },
  { id: "3", item: "Adidas Samba OG", target: 90, current: 100, progress: 0.90 },
];

export default function ShopScreen() {
  const [activeTab, setActiveTab] = useState("For You");
  const [savedItems, setSavedItems] = useState<Set<string>>(new Set());

  const toggleSave = (id: string) => {
    setSavedItems(prev => {
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
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>AI DEAL ENGINE</Text>
            <Text style={styles.headline}>Shop Smart</Text>
          </View>
          <View style={styles.savingsBadge}>
            <Text style={styles.savingsBadgeLabel}>You've saved</Text>
            <Text style={styles.savingsBadgeValue}>$342</Text>
          </View>
        </View>

        {/* Tab Bar */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabStrip}
        >
          {SHOP_TABS.map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tabChip, activeTab === tab && styles.tabChipActive]}
              onPress={() => setActiveTab(tab)}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabChipText, activeTab === tab && styles.tabChipTextActive]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Featured Deals */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Deals Found For You</Text>
            <Text style={styles.sectionSub}>Based on your closet + looks</Text>
          </View>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.seeAll}>See all →</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={FEATURED_DEALS}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.featuredList}
          renderItem={({ item }) => (
            <FeaturedDealCard
              item={item}
              saved={savedItems.has(item.id)}
              onSave={() => toggleSave(item.id)}
            />
          )}
        />

        {/* Price Alerts */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Price Alerts</Text>
            <Text style={styles.sectionSub}>Tracking items you want</Text>
          </View>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.seeAll}>+ Add →</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.alertsList}>
          {PRICE_ALERTS.map(alert => (
            <PriceAlertRow key={alert.id} alert={alert} />
          ))}
        </View>

        {/* Smart Picks */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Smart Picks</Text>
            <Text style={styles.sectionSub}>AI-matched to your style</Text>
          </View>
        </View>

        <View style={styles.smartGrid}>
          {SMART_PICKS.map(item => (
            <SmartPickCard
              key={item.id}
              item={item}
              saved={savedItems.has("sp-" + item.id)}
              onSave={() => toggleSave("sp-" + item.id)}
            />
          ))}
        </View>

        {/* Your Brands */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Your Brands</Text>
            <Text style={styles.sectionSub}>Deals from brands you love</Text>
          </View>
        </View>

        <View style={styles.brandsList}>
          {BRANDS.map(brand => (
            <BrandRow key={brand.name} brand={brand} />
          ))}
        </View>

        {/* Intelligence Banner */}
        <TouchableOpacity style={styles.intelligenceBanner} activeOpacity={0.88}>
          <LinearGradient colors={["#1A0E08", "#2A1A10"]} style={StyleSheet.absoluteFill} />
          <View style={styles.intelligenceBannerBorder} />
          <Text style={styles.intelligenceLabel}>✦ SHOPPING INTELLIGENCE</Text>
          <Text style={styles.intelligenceTitle}>
            "Find me the cheapest{"\n"}alternative to this Toteme blazer."
          </Text>
          <Text style={styles.intelligenceCta}>Ask your AI stylist →</Text>
        </TouchableOpacity>

        <View style={{ height: 32 }} />
      </ScrollView>
    </ScreenContainer>
  );
}

// ─── Featured Deal Card ───────────────────────────────────────────────────────

function FeaturedDealCard({
  item,
  saved,
  onSave,
}: {
  item: typeof FEATURED_DEALS[0];
  saved: boolean;
  onSave: () => void;
}) {
  return (
    <TouchableOpacity style={styles.featuredCard} activeOpacity={0.88}>
      <View style={[styles.featuredCardVisual, { backgroundColor: item.color }]}>
        <LinearGradient
          colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.5)"]}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.featuredTag}>
          <Text style={styles.featuredTagText}>{item.tag}</Text>
        </View>
        <TouchableOpacity style={styles.featuredSaveBtn} onPress={onSave} activeOpacity={0.7}>
          <Text style={[styles.featuredSaveIcon, saved && { color: ThreadlyColors.roseGold }]}>
            {saved ? "♥" : "♡"}
          </Text>
        </TouchableOpacity>
        <View style={styles.featuredOffBadge}>
          <Text style={styles.featuredOffText}>-{item.off}%</Text>
        </View>
      </View>
      <View style={styles.featuredCardInfo}>
        <Text style={styles.featuredBrand}>{item.brand}</Text>
        <Text style={styles.featuredItem} numberOfLines={2}>{item.item}</Text>
        <Text style={styles.featuredReason}>{item.reason}</Text>
        <View style={styles.featuredPricing}>
          <Text style={styles.featuredOriginal}>${item.original}</Text>
          <Text style={styles.featuredSale}>${item.sale}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ─── Price Alert Row ──────────────────────────────────────────────────────────

function PriceAlertRow({ alert }: { alert: typeof PRICE_ALERTS[0] }) {
  const pct = Math.round(alert.progress * 100);
  const nearTarget = alert.progress >= 0.88;
  return (
    <View style={styles.alertRow}>
      <View style={styles.alertInfo}>
        <Text style={styles.alertItem}>{alert.item}</Text>
        <View style={styles.alertPricing}>
          <Text style={styles.alertCurrent}>${alert.current}</Text>
          <Text style={styles.alertArrow}>→</Text>
          <Text style={styles.alertTarget}>target ${alert.target}</Text>
        </View>
        <View style={styles.alertBarBg}>
          <View style={[
            styles.alertBarFill,
            {
              width: `${pct}%` as any,
              backgroundColor: nearTarget ? ThreadlyColors.success : ThreadlyColors.roseGold,
            },
          ]} />
        </View>
      </View>
      <View style={[styles.alertStatusBadge, nearTarget && styles.alertStatusBadgeNear]}>
        <Text style={[styles.alertStatusText, nearTarget && styles.alertStatusTextNear]}>
          {nearTarget ? "Almost!" : `${pct}%`}
        </Text>
      </View>
    </View>
  );
}

// ─── Smart Pick Card ──────────────────────────────────────────────────────────

function SmartPickCard({
  item,
  saved,
  onSave,
}: {
  item: typeof SMART_PICKS[0];
  saved: boolean;
  onSave: () => void;
}) {
  const cardW = (width - ThreadlySpacing.screenPadding * 2 - 12) / 2;
  return (
    <TouchableOpacity style={[styles.smartCard, { width: cardW }]} activeOpacity={0.85}>
      <View style={[styles.smartCardVisual, { backgroundColor: item.color }]}>
        <LinearGradient
          colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.4)"]}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.smartOffBadge}>
          <Text style={styles.smartOffText}>-{item.off}%</Text>
        </View>
        <TouchableOpacity style={styles.smartSaveBtn} onPress={onSave} activeOpacity={0.7}>
          <Text style={[styles.smartSaveIcon, saved && { color: ThreadlyColors.roseGold }]}>
            {saved ? "♥" : "♡"}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.smartCardInfo}>
        <Text style={styles.smartBrand}>{item.brand}</Text>
        <Text style={styles.smartItem} numberOfLines={2}>{item.item}</Text>
        <View style={styles.smartPricing}>
          <Text style={styles.smartOriginal}>${item.original}</Text>
          <Text style={styles.smartSale}>${item.sale}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ─── Brand Row ────────────────────────────────────────────────────────────────

function BrandRow({ brand }: { brand: typeof BRANDS[0] }) {
  return (
    <TouchableOpacity style={styles.brandRow} activeOpacity={0.85}>
      <View style={[styles.brandColorDot, { backgroundColor: brand.color }]} />
      <View style={styles.brandInfo}>
        <Text style={styles.brandName}>{brand.name}</Text>
        <Text style={styles.brandDeals}>{brand.deals} deals active</Text>
      </View>
      <View style={styles.brandSavedBadge}>
        <Text style={styles.brandSavedText}>Saved ${brand.saved}</Text>
      </View>
      <Text style={styles.brandArrow}>›</Text>
    </TouchableOpacity>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

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
  savingsBadge: {
    backgroundColor: "rgba(74,155,111,0.12)",
    borderRadius: ThreadlyRadius.lg,
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(74,155,111,0.25)",
  },
  savingsBadgeLabel: {
    fontSize: 9,
    color: ThreadlyColors.success,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  savingsBadgeValue: {
    fontSize: 20,
    fontFamily: "Georgia",
    color: ThreadlyColors.success,
  },

  tabStrip: {
    paddingHorizontal: ThreadlySpacing.screenPadding,
    gap: 8,
    marginBottom: 24,
  },
  tabChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: ThreadlyRadius.pill,
    backgroundColor: ThreadlyColors.charcoal,
    borderWidth: 1,
    borderColor: ThreadlyColors.charcoalLight,
  },
  tabChipActive: {
    backgroundColor: "rgba(201,149,106,0.15)",
    borderColor: ThreadlyColors.roseGold,
  },
  tabChipText: { fontSize: 13, color: ThreadlyColors.warmWhiteSubtle, fontWeight: "600" },
  tabChipTextActive: { color: ThreadlyColors.roseGoldLight },

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
  sectionSub: { fontSize: 11, color: ThreadlyColors.warmWhiteSubtle },
  seeAll: { fontSize: 12, color: ThreadlyColors.roseGold, fontWeight: "600" },

  featuredList: {
    paddingLeft: ThreadlySpacing.screenPadding,
    paddingRight: 8,
    gap: 12,
    marginBottom: 28,
  },
  featuredCard: {
    width: DEAL_CARD_W,
    backgroundColor: ThreadlyColors.charcoal,
    borderRadius: ThreadlyRadius.xl,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: ThreadlyColors.charcoalLight,
  },
  featuredCardVisual: { height: 150, position: "relative" },
  featuredTag: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "rgba(201,149,106,0.2)",
    borderWidth: 1,
    borderColor: "rgba(201,149,106,0.4)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: ThreadlyRadius.pill,
  },
  featuredTagText: {
    fontSize: 9,
    fontWeight: "700",
    color: ThreadlyColors.roseGoldLight,
    letterSpacing: 1,
  },
  featuredSaveBtn: {
    position: "absolute",
    top: 8,
    right: 10,
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  featuredSaveIcon: { fontSize: 20, color: ThreadlyColors.warmWhiteSubtle },
  featuredOffBadge: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "rgba(74,155,111,0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: ThreadlyRadius.md,
    borderWidth: 1,
    borderColor: "rgba(74,155,111,0.35)",
  },
  featuredOffText: { fontSize: 12, fontWeight: "700", color: ThreadlyColors.success },
  featuredCardInfo: { padding: 14 },
  featuredBrand: {
    fontSize: 9,
    fontWeight: "700",
    color: ThreadlyColors.warmWhiteSubtle,
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  featuredItem: {
    fontSize: 14,
    color: ThreadlyColors.warmWhite,
    fontWeight: "600",
    marginBottom: 4,
    lineHeight: 19,
  },
  featuredReason: {
    fontSize: 11,
    color: ThreadlyColors.roseGoldDim,
    fontStyle: "italic",
    marginBottom: 8,
  },
  featuredPricing: { flexDirection: "row", alignItems: "center", gap: 8 },
  featuredOriginal: {
    fontSize: 12,
    color: ThreadlyColors.warmWhiteSubtle,
    textDecorationLine: "line-through",
  },
  featuredSale: { fontSize: 18, fontWeight: "700", color: ThreadlyColors.success },

  alertsList: {
    paddingHorizontal: ThreadlySpacing.screenPadding,
    gap: 10,
    marginBottom: 28,
  },
  alertRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: ThreadlyColors.charcoal,
    borderRadius: ThreadlyRadius.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: ThreadlyColors.charcoalLight,
    gap: 12,
  },
  alertInfo: { flex: 1 },
  alertItem: {
    fontSize: 14,
    color: ThreadlyColors.warmWhite,
    fontWeight: "600",
    marginBottom: 5,
  },
  alertPricing: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 8 },
  alertCurrent: { fontSize: 13, color: ThreadlyColors.warmWhiteMuted },
  alertArrow: { fontSize: 11, color: ThreadlyColors.warmWhiteSubtle },
  alertTarget: { fontSize: 12, color: ThreadlyColors.roseGoldLight, fontWeight: "600" },
  alertBarBg: {
    height: 3,
    backgroundColor: ThreadlyColors.charcoalLight,
    borderRadius: 2,
    overflow: "hidden",
  },
  alertBarFill: { height: 3, borderRadius: 2 },
  alertStatusBadge: {
    backgroundColor: ThreadlyColors.charcoalMid,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: ThreadlyRadius.md,
    borderWidth: 1,
    borderColor: ThreadlyColors.charcoalLight,
  },
  alertStatusBadgeNear: {
    backgroundColor: "rgba(74,155,111,0.12)",
    borderColor: "rgba(74,155,111,0.3)",
  },
  alertStatusText: { fontSize: 12, fontWeight: "700", color: ThreadlyColors.warmWhiteSubtle },
  alertStatusTextNear: { color: ThreadlyColors.success },

  smartGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: ThreadlySpacing.screenPadding,
    gap: 12,
    marginBottom: 28,
  },
  smartCard: {
    backgroundColor: ThreadlyColors.charcoal,
    borderRadius: ThreadlyRadius.xl,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: ThreadlyColors.charcoalLight,
  },
  smartCardVisual: { height: 130, position: "relative" },
  smartOffBadge: {
    position: "absolute",
    bottom: 8,
    left: 8,
    backgroundColor: "rgba(74,155,111,0.2)",
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: ThreadlyRadius.sm,
    borderWidth: 1,
    borderColor: "rgba(74,155,111,0.35)",
  },
  smartOffText: { fontSize: 11, fontWeight: "700", color: ThreadlyColors.success },
  smartSaveBtn: {
    position: "absolute",
    top: 6,
    right: 8,
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  smartSaveIcon: { fontSize: 18, color: ThreadlyColors.warmWhiteSubtle },
  smartCardInfo: { padding: 12 },
  smartBrand: {
    fontSize: 9,
    fontWeight: "700",
    color: ThreadlyColors.warmWhiteSubtle,
    letterSpacing: 1.5,
    marginBottom: 3,
  },
  smartItem: {
    fontSize: 13,
    color: ThreadlyColors.warmWhite,
    fontWeight: "600",
    marginBottom: 6,
    lineHeight: 17,
  },
  smartPricing: { flexDirection: "row", alignItems: "center", gap: 6 },
  smartOriginal: {
    fontSize: 11,
    color: ThreadlyColors.warmWhiteSubtle,
    textDecorationLine: "line-through",
  },
  smartSale: { fontSize: 15, fontWeight: "700", color: ThreadlyColors.success },

  brandsList: {
    paddingHorizontal: ThreadlySpacing.screenPadding,
    gap: 8,
    marginBottom: 28,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: ThreadlyColors.charcoal,
    borderRadius: ThreadlyRadius.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: ThreadlyColors.charcoalLight,
    gap: 12,
  },
  brandColorDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.08)",
  },
  brandInfo: { flex: 1 },
  brandName: { fontSize: 15, color: ThreadlyColors.warmWhite, fontWeight: "700", marginBottom: 2 },
  brandDeals: { fontSize: 11, color: ThreadlyColors.warmWhiteSubtle },
  brandSavedBadge: {
    backgroundColor: "rgba(74,155,111,0.1)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: ThreadlyRadius.pill,
    borderWidth: 1,
    borderColor: "rgba(74,155,111,0.2)",
  },
  brandSavedText: { fontSize: 11, color: ThreadlyColors.success, fontWeight: "600" },
  brandArrow: { fontSize: 20, color: ThreadlyColors.warmWhiteSubtle },

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
