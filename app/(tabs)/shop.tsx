/**
 * Threadly — Shop
 * AI deal engine, brand discovery, smart shopping.
 * Emotional outcome: "She found me the best deal. Again."
 */

import { useState, useMemo, useRef } from "react";
import { usePersonalization } from '@/lib/personalization';
import { VIBE_DEAL_POOL, pickVibeImage } from '@/lib/images';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
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

const BASE_FILTER_TABS = ["All", "Work", "Date Night", "Casual", "Vacation", "Events"];

// Static fallback deals — images are injected dynamically per vibe in the component
const DEALS_META = [
  {
    id: "1",
    brand: "ZARA",
    item: "Oversized Blazer",
    desc: "Camel, Size M — matches 4 looks",
    original: 110,
    sale: 59,
    off: 46,
    tag: "BEST MATCH",
    expiry: "2h left",
  },
  {
    id: "2",
    brand: "MANGO",
    item: "Straight-Leg Jeans",
    desc: "Ecru, Size 28 — trending now",
    original: 80,
    sale: 44,
    off: 45,
    tag: "TRENDING",
    expiry: "24h left",
  },
  {
    id: "3",
    brand: "ALDO",
    item: "Pointed Slingback Heels",
    desc: "Nude, Size 8 — completes 3 looks",
    original: 95,
    sale: 55,
    off: 42,
    tag: "HOT DEAL",
    expiry: "6h left",
  },
  {
    id: "4",
    brand: "AMAZON",
    item: "Gold Hoop Earrings",
    desc: "14k plated — your most-worn style",
    original: 22,
    sale: 14,
    off: 36,
    tag: "YOUR STYLE",
    expiry: "48h left",
  },
  {
    id: "5",
    brand: "H&M",
    item: "Linen Wide-Leg Trousers",
    desc: "Beige, Size S — quiet luxury pick",
    original: 45,
    sale: 25,
    off: 44,
    tag: "QUIET LUXURY",
    expiry: "12h left",
  },
  {
    id: "6",
    brand: "NORDSTROM",
    item: "Leather Crossbody Bag",
    desc: "Black, small — pairs with 6 looks",
    original: 148,
    sale: 89,
    off: 40,
    tag: "INVESTMENT",
    expiry: "3d left",
  },
];

const BRANDS = [
  { id: "1", name: "Zara", logo: "Z", deals: 12, color: "#1A1A1A" },
  { id: "2", name: "Mango", logo: "M", deals: 8, color: "#2A1A10" },
  { id: "3", name: "H&M", logo: "H", deals: 15, color: "#1A1A2A" },
  { id: "4", name: "Nordstrom", logo: "N", deals: 6, color: "#0A1A0A" },
  { id: "5", name: "ASOS", logo: "A", deals: 22, color: "#1A0A1A" },
  { id: "6", name: "Revolve", logo: "R", deals: 9, color: "#1A1510" },
];

export default function ShopScreen() {
  const p = usePersonalization();
  const [activeFilter, setActiveFilter] = useState("All");

  // Build filter tabs from user's occasions + defaults
  const filterTabs = useMemo(() => {
    if (p.isLoading) return BASE_FILTER_TABS;
    const profileOccasions = p.outfits.map(o => o.occasion).filter(Boolean);
    const merged = ['All', ...new Set([...profileOccasions, 'Work', 'Date Night', 'Casual'])];
    return merged.slice(0, 6);
  }, [p.isLoading, p.outfits]);

  // Derive primary vibe for image matching
  const primaryVibe = p.outfits[0]?.vibeTag ?? 'default';

  // Use personalized deals when available, fall back to static DEALS_META with vibe-matched images
  const displayDeals = useMemo(() => {
    if (p.isLoading || p.deals.length < 2) {
      return DEALS_META.map((d, i) => ({
        ...d,
        image: pickVibeImage(VIBE_DEAL_POOL, primaryVibe, i),
      }));
    }
    return p.deals.map((d, i) => ({
      id: d.id,
      brand: d.brand,
      item: d.item,
      desc: `${d.matchReason} — ${d.expiry}`,
      original: d.original,
      sale: d.sale,
      off: d.off,
      image: d.image,
      tag: i === 0 ? 'BEST MATCH' : i === 1 ? 'YOUR BRANDS' : 'DEAL ALERT',
      expiry: d.expiry,
    }));
  }, [p.isLoading, p.deals, primaryVibe]);

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
            <Text style={styles.headerLabel}>{p.isLoading ? 'DEALS FOR YOU' : p.dealSectionLabel}</Text>
            <Text style={styles.headerTitle}>Smart Shopping</Text>
          </View>
          <View style={styles.savingsBadge}>
            <Text style={styles.savingsBadgeLabel}>SAVED</Text>
            <Text style={styles.savingsBadgeAmount}>$247</Text>
            <Text style={styles.savingsBadgeSub}>this month</Text>
          </View>
        </View>

        {/* AI Intelligence Banner */}
        <View style={styles.aiBanner}>
          <LinearGradient colors={["#1A0E08", "#2A1A10"]} style={StyleSheet.absoluteFill} />
          <View style={styles.aiBannerBorder} />
          <View style={styles.aiBannerContent}>
            <Text style={styles.aiBannerIcon}>✦</Text>
            <View style={styles.aiBannerText}>
              <Text style={styles.aiBannerTitle}>AI found {p.isLoading ? 6 : displayDeals.length} new deals</Text>
              <Text style={styles.aiBannerSub}>{p.isLoading ? 'Pieces that complete your looks' : p.insightText}</Text>
            </View>
          </View>
        </View>

        {/* Filter Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterList}
          style={styles.filterScroll}
        >
          {filterTabs.map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.filterChip, activeFilter === tab && styles.filterChipActive]}
              onPress={() => setActiveFilter(tab)}
              activeOpacity={0.7}
            >
              <Text style={[styles.filterChipText, activeFilter === tab && styles.filterChipTextActive]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Deal Cards */}
        <View style={styles.dealsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>{p.isLoading ? 'AI RECOMMENDED FOR YOU' : p.sectionLabel}</Text>
            <Text style={styles.sectionTitle}>{p.isLoading ? 'Looks built for your style' : p.sectionTitle}</Text>
          </View>

          {displayDeals.map(deal => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </View>

        {/* Favorite Brands */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>YOUR BRANDS</Text>
          <Text style={styles.sectionTitle}>Active deals from brands you love</Text>
        </View>

        <FlatList
          data={BRANDS}
          keyExtractor={b => b.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.brandList}
          renderItem={({ item: b }) => (
            <TouchableOpacity style={styles.brandCard} activeOpacity={0.85}>
              <LinearGradient colors={[b.color, "#1A1A1A"]} style={StyleSheet.absoluteFill} />
              <View style={styles.brandCardBorder} />
              <Text style={styles.brandCardLogo}>{b.logo}</Text>
              <Text style={styles.brandCardName}>{b.name}</Text>
              <View style={styles.brandCardDealBadge}>
                <Text style={styles.brandCardDealText}>{b.deals} deals</Text>
              </View>
            </TouchableOpacity>
          )}
        />

        {/* Price Comparison */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>PRICE COMPARISON</Text>
          <Text style={styles.sectionTitle}>We checked every store</Text>
        </View>

        <View style={styles.priceCompCard}>
          <LinearGradient colors={["#1A1410", "#1A1A1A"]} style={StyleSheet.absoluteFill} />
          <View style={styles.priceCompBorder} />
          <View style={styles.priceCompHeader}>
            <Image
              source={{ uri: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=200&q=80" }}
              style={styles.priceCompImage}
              resizeMode="cover"
            />
            <View style={styles.priceCompInfo}>
              <Text style={styles.priceCompBrand}>ZARA</Text>
              <Text style={styles.priceCompItem}>Oversized Blazer</Text>
              <Text style={styles.priceCompDesc}>Camel · Size M</Text>
            </View>
          </View>
          <View style={styles.priceCompRows}>
            {[
              { store: "Zara.com", price: 59, best: true },
              { store: "ASOS", price: 72, best: false },
              { store: "Revolve", price: 78, best: false },
              { store: "Nordstrom", price: 89, best: false },
            ].map((row, i) => (
              <View key={i} style={[styles.priceCompRow, row.best && styles.priceCompRowBest]}>
                <Text style={[styles.priceCompStore, row.best && styles.priceCompStoreBest]}>{row.store}</Text>
                <View style={styles.priceCompRight}>
                  {row.best && (
                    <View style={styles.priceCompBestBadge}>
                      <Text style={styles.priceCompBestText}>BEST</Text>
                    </View>
                  )}
                  <Text style={[styles.priceCompPrice, row.best && styles.priceCompPriceBest]}>${row.price}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </ScreenContainer>
  );
}

function DealCard({ deal }: { deal: typeof DEALS_META[0] & { image: string } }) {
  const { scale, onPressIn, onPressOut } = useScalePress(0.97);
  const { imageOpacity, onImageLoad } = useImageFade();
  const glowOpacity = useRef(new Animated.Value(0)).current;
  const { scale: btnScale, onPressIn: btnIn, onPressOut: btnOut } = useScalePress(0.95);

  const handlePressIn = () => {
    onPressIn();
    Animated.timing(glowOpacity, { toValue: 1, duration: 80, useNativeDriver: true }).start();
  };
  const handlePressOut = () => {
    onPressOut();
    Animated.timing(glowOpacity, { toValue: 0, duration: 200, useNativeDriver: true }).start();
  };

  return (
    <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut} onPress={() => hapticLight()}>
      <Animated.View style={[styles.dealCard, { transform: [{ scale }] }]}>
        <View style={styles.dealImageWrap}>
          <Animated.Image source={{ uri: deal.image }} style={[styles.dealImage, { opacity: imageOpacity }]} resizeMode="cover" onLoad={onImageLoad} />
          <LinearGradient
            colors={["transparent", "rgba(10,10,10,0.6)"]}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.dealTag}>
            <Text style={styles.dealTagText}>{deal.tag}</Text>
          </View>
          <View style={styles.dealOffBadge}>
            <Text style={styles.dealOffText}>-{deal.off}%</Text>
          </View>
          <View style={styles.dealExpiry}>
            <Text style={styles.dealExpiryText}>{deal.expiry}</Text>
          </View>
        </View>
        <View style={styles.dealCardInfo}>
          <View style={styles.dealCardTop}>
            <View style={styles.dealCardLeft}>
              <Text style={styles.dealBrand}>{deal.brand}</Text>
              <Text style={styles.dealItem}>{deal.item}</Text>
              <Text style={styles.dealDesc}>{deal.desc}</Text>
            </View>
            <View style={styles.dealPricingBlock}>
              <Text style={styles.dealOriginal}>${deal.original}</Text>
              <Text style={styles.dealSale}>${deal.sale}</Text>
            </View>
          </View>
          <Pressable onPressIn={btnIn} onPressOut={btnOut} onPress={() => hapticSuccess()} style={styles.viewDealBtn}>
            <Animated.View style={[{ borderRadius: ThreadlyRadius.xl, overflow: 'hidden' }, { transform: [{ scale: btnScale }] }]}>
              <LinearGradient
                colors={[ThreadlyColors.roseGold, ThreadlyColors.roseGoldLight]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.viewDealBtnGradient}
              >
                <Text style={styles.viewDealBtnText}>View Deal</Text>
              </LinearGradient>
            </Animated.View>
          </Pressable>
        </View>
        {/* Rose-gold glow border on press */}
        <Animated.View
          pointerEvents="none"
          style={[StyleSheet.absoluteFill, { borderRadius: ThreadlyRadius.xl, borderWidth: 1, borderColor: ThreadlyColors.roseGold, opacity: glowOpacity }]}
        />
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
  headerLabel: { fontSize: 9, fontWeight: "700", color: ThreadlyColors.roseGold, letterSpacing: 2, marginBottom: 4 },
  headerTitle: { fontSize: 26, fontFamily: "Georgia", color: ThreadlyColors.warmWhite },
  savingsBadge: {
    alignItems: "center",
    backgroundColor: "rgba(93,191,138,0.1)",
    borderRadius: ThreadlyRadius.lg,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "rgba(93,191,138,0.25)",
  },
  savingsBadgeLabel: { fontSize: 7, fontWeight: "700", color: ThreadlyColors.success, letterSpacing: 1.5 },
  savingsBadgeAmount: { fontSize: 20, fontFamily: "Georgia", color: ThreadlyColors.success, lineHeight: 22 },
  savingsBadgeSub: { fontSize: 9, color: ThreadlyColors.warmWhiteSubtle },
  aiBanner: {
    marginHorizontal: ThreadlySpacing.screenPadding,
    borderRadius: ThreadlyRadius.xl,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(201,149,106,0.2)",
    marginBottom: 20,
  },
  aiBannerBorder: { position: "absolute", top: 0, left: 0, right: 0, height: 1, backgroundColor: ThreadlyColors.roseGold, opacity: 0.4 },
  aiBannerContent: { flexDirection: "row", alignItems: "center", padding: 16, gap: 12 },
  aiBannerIcon: { fontSize: 22, color: ThreadlyColors.roseGold },
  aiBannerText: { flex: 1 },
  aiBannerTitle: { fontSize: 15, fontFamily: "Georgia", color: ThreadlyColors.warmWhite, marginBottom: 2 },
  aiBannerSub: { fontSize: 12, color: ThreadlyColors.warmWhiteSubtle },
  filterScroll: { marginBottom: 20 },
  filterList: { paddingHorizontal: ThreadlySpacing.screenPadding, gap: 8 },
  filterChip: {
    paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: ThreadlyRadius.pill,
    backgroundColor: ThreadlyColors.charcoal,
    borderWidth: 1, borderColor: ThreadlyColors.charcoalLight,
  },
  filterChipActive: { backgroundColor: "rgba(201,149,106,0.15)", borderColor: ThreadlyColors.roseGold },
  filterChipText: { fontSize: 12, color: ThreadlyColors.warmWhiteSubtle, fontWeight: "600" },
  filterChipTextActive: { color: ThreadlyColors.roseGoldLight },
  dealsSection: { marginBottom: 8 },
  sectionHeader: {
    paddingHorizontal: ThreadlySpacing.screenPadding,
    marginBottom: 16,
  },
  sectionLabel: { fontSize: 9, fontWeight: "700", color: ThreadlyColors.roseGold, letterSpacing: 2, marginBottom: 4 },
  sectionTitle: { fontSize: 18, fontFamily: "Georgia", color: ThreadlyColors.warmWhite },
  dealCard: {
    marginHorizontal: ThreadlySpacing.screenPadding,
    backgroundColor: ThreadlyColors.charcoal,
    borderRadius: ThreadlyRadius.xl,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: ThreadlyColors.charcoalLight,
    marginBottom: 16,
  },
  dealImageWrap: { height: 200, position: "relative" },
  dealImage: { width: "100%", height: "100%" },
  dealTag: {
    position: "absolute", top: 12, left: 12,
    backgroundColor: "rgba(201,149,106,0.18)",
    borderWidth: 1, borderColor: "rgba(201,149,106,0.4)",
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: ThreadlyRadius.pill,
  },
  dealTagText: { fontSize: 8, fontWeight: "700", color: ThreadlyColors.roseGoldLight, letterSpacing: 1 },
  dealOffBadge: {
    position: "absolute", top: 12, right: 12,
    backgroundColor: ThreadlyColors.success,
    paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: ThreadlyRadius.pill,
  },
  dealOffText: { fontSize: 11, fontWeight: "700", color: "#fff" },
  dealExpiry: {
    position: "absolute", bottom: 12, right: 12,
    backgroundColor: "rgba(10,10,10,0.7)",
    paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: ThreadlyRadius.pill,
  },
  dealExpiryText: { fontSize: 9, color: ThreadlyColors.warmWhiteSubtle },
  dealCardInfo: { padding: 16 },
  dealCardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 },
  dealCardLeft: { flex: 1, marginRight: 12 },
  dealBrand: { fontSize: 8, fontWeight: "700", color: ThreadlyColors.warmWhiteSubtle, letterSpacing: 1.5, marginBottom: 3 },
  dealItem: { fontSize: 16, fontFamily: "Georgia", color: ThreadlyColors.warmWhite, marginBottom: 4 },
  dealDesc: { fontSize: 11, color: ThreadlyColors.warmWhiteSubtle },
  dealPricingBlock: { alignItems: "flex-end" },
  dealOriginal: { fontSize: 12, color: ThreadlyColors.warmWhiteSubtle, textDecorationLine: "line-through", marginBottom: 2 },
  dealSale: { fontSize: 22, fontFamily: "Georgia", color: ThreadlyColors.success },
  viewDealBtn: { borderRadius: ThreadlyRadius.lg, overflow: "hidden" },
  viewDealBtnGradient: { paddingVertical: 13, alignItems: "center" },
  viewDealBtnText: { fontSize: 13, fontFamily: "Georgia", color: ThreadlyColors.black, letterSpacing: 0.5 },
  brandList: { paddingLeft: ThreadlySpacing.screenPadding, paddingRight: 8, gap: 10, marginBottom: 32 },
  brandCard: {
    width: 100, height: 110,
    borderRadius: ThreadlyRadius.xl,
    overflow: "hidden",
    borderWidth: 1, borderColor: ThreadlyColors.charcoalLight,
    alignItems: "center", justifyContent: "center",
    gap: 4,
  },
  brandCardBorder: { position: "absolute", top: 0, left: 0, right: 0, height: 1, backgroundColor: ThreadlyColors.roseGold, opacity: 0.2 },
  brandCardLogo: { fontSize: 28, fontFamily: "Georgia", color: ThreadlyColors.roseGoldLight },
  brandCardName: { fontSize: 11, color: ThreadlyColors.warmWhiteMuted, fontWeight: "600" },
  brandCardDealBadge: {
    backgroundColor: "rgba(201,149,106,0.15)",
    paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: ThreadlyRadius.pill,
    borderWidth: 1, borderColor: "rgba(201,149,106,0.25)",
  },
  brandCardDealText: { fontSize: 9, color: ThreadlyColors.roseGoldLight, fontWeight: "600" },
  priceCompCard: {
    marginHorizontal: ThreadlySpacing.screenPadding,
    borderRadius: ThreadlyRadius.xl,
    overflow: "hidden",
    borderWidth: 1, borderColor: "rgba(201,149,106,0.2)",
    padding: 16,
    marginBottom: 8,
  },
  priceCompBorder: { position: "absolute", top: 0, left: 0, right: 0, height: 1, backgroundColor: ThreadlyColors.roseGold, opacity: 0.4 },
  priceCompHeader: { flexDirection: "row", gap: 12, marginBottom: 16, alignItems: "center" },
  priceCompImage: { width: 60, height: 60, borderRadius: ThreadlyRadius.md },
  priceCompInfo: { flex: 1 },
  priceCompBrand: { fontSize: 8, fontWeight: "700", color: ThreadlyColors.warmWhiteSubtle, letterSpacing: 1.5, marginBottom: 2 },
  priceCompItem: { fontSize: 15, fontFamily: "Georgia", color: ThreadlyColors.warmWhite, marginBottom: 2 },
  priceCompDesc: { fontSize: 11, color: ThreadlyColors.warmWhiteSubtle },
  priceCompRows: { gap: 8 },
  priceCompRow: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingVertical: 10, paddingHorizontal: 12,
    backgroundColor: "rgba(255,255,255,0.03)",
    borderRadius: ThreadlyRadius.md,
    borderWidth: 1, borderColor: ThreadlyColors.charcoalLight,
  },
  priceCompRowBest: {
    backgroundColor: "rgba(201,149,106,0.08)",
    borderColor: "rgba(201,149,106,0.35)",
  },
  priceCompStore: { fontSize: 13, color: ThreadlyColors.warmWhiteMuted },
  priceCompStoreBest: { color: ThreadlyColors.warmWhite, fontWeight: "600" },
  priceCompRight: { flexDirection: "row", alignItems: "center", gap: 8 },
  priceCompBestBadge: {
    backgroundColor: ThreadlyColors.roseGold,
    paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: ThreadlyRadius.pill,
  },
  priceCompBestText: { fontSize: 8, fontWeight: "700", color: ThreadlyColors.black, letterSpacing: 1 },
  priceCompPrice: { fontSize: 15, color: ThreadlyColors.warmWhiteMuted, fontWeight: "600" },
  priceCompPriceBest: { color: ThreadlyColors.success, fontSize: 17 },
});
