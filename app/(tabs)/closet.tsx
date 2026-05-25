/**
 * Threadly — Closet
 * Digital wardrobe with AI intelligence.
 * Phase 15: Search, Sort, Worn Tracking, Outfit Builder entry point.
 */

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { CLOSET_IMAGES } from "@/lib/images";
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
  TextInput,
} from "react-native";
import { useScalePress, hapticLight, hapticSuccess, hapticMedium } from "@/lib/animations";
import { LinearGradient } from "expo-linear-gradient";
import { ScreenContainer } from "@/components/screen-container";
import { ThreadlyColors, ThreadlySpacing, ThreadlyRadius } from "@/constants/threadly";
import { ClosetScanModal, ScannedItem } from "@/components/closet-scan-modal";
import { ItemIntelligenceSheet, WardrobeItem } from "@/components/item-intelligence-sheet";
import { OutfitBuilderSheet } from "@/components/outfit-builder-sheet";
import { getStyleProfile } from "@/lib/onboarding-store";
import { loadClosetHistory, addToClosetHistory, PersistedScanItem } from "@/lib/closet-history-store";
import { loadWornStore } from "@/lib/worn-tracking-store";

const { width } = Dimensions.get("window");
const GRID_GAP = 10;
const GRID_COLS = 3;
const ITEM_W = (width - ThreadlySpacing.screenPadding * 2 - GRID_GAP * (GRID_COLS - 1)) / GRID_COLS;

const CATEGORIES = ["All", "Tops", "Bottoms", "Dresses", "Outerwear", "Shoes", "Bags", "Accessories"];

const SORT_OPTIONS = [
  { key: "default", label: "Default" },
  { key: "mostWorn", label: "Most Worn" },
  { key: "recentlyAdded", label: "Recently Added" },
  { key: "favorites", label: "Favorites" },
  { key: "byColor", label: "By Color" },
  { key: "bestMatch", label: "Best Match" },
] as const;

type SortKey = typeof SORT_OPTIONS[number]["key"];

type ClosetItem = {
  id: string;
  name: string;
  cat: string;
  worn: number;
  image: string;
  isNew?: boolean;
  isFavorite?: boolean;
  addedAt?: number;
  colorHex?: string;
  matchPct?: number;
};

// Initial items — semantically correct category-specific images (24 items)
const INITIAL_ITEMS: ClosetItem[] = [
  { id: "1",  name: "Camel Blazer",        cat: "Outerwear",   worn: 12, image: CLOSET_IMAGES.outer1,  colorHex: "#C4A882", matchPct: 94, addedAt: Date.now() - 86400000 * 30 },
  { id: "2",  name: "Black Tee",           cat: "Tops",        worn: 28, image: CLOSET_IMAGES.top4,    colorHex: "#1A1A1A", matchPct: 91, addedAt: Date.now() - 86400000 * 28 },
  { id: "3",  name: "Wide-Leg Trousers",   cat: "Bottoms",     worn: 9,  image: CLOSET_IMAGES.bottom2, colorHex: "#2C2C2C", matchPct: 88, addedAt: Date.now() - 86400000 * 25 },
  { id: "4",  name: "White Linen Shirt",   cat: "Tops",        worn: 15, image: CLOSET_IMAGES.top3,    colorHex: "#FAF7F4", matchPct: 92, addedAt: Date.now() - 86400000 * 22 },
  { id: "5",  name: "Straight-Leg Jeans",  cat: "Bottoms",     worn: 22, image: CLOSET_IMAGES.bottom4, colorHex: "#3B4B6B", matchPct: 89, addedAt: Date.now() - 86400000 * 20 },
  { id: "6",  name: "Midi Slip Dress",     cat: "Dresses",     worn: 6,  image: CLOSET_IMAGES.dress2,  colorHex: "#C4A882", matchPct: 96, addedAt: Date.now() - 86400000 * 18, isFavorite: true },
  { id: "7",  name: "White Sneakers",      cat: "Shoes",       worn: 31, image: CLOSET_IMAGES.shoe3,   colorHex: "#FAF7F4", matchPct: 87, addedAt: Date.now() - 86400000 * 16 },
  { id: "8",  name: "Leather Tote",        cat: "Bags",        worn: 18, image: CLOSET_IMAGES.bag2,    colorHex: "#8B7355", matchPct: 93, addedAt: Date.now() - 86400000 * 14, isFavorite: true },
  { id: "9",  name: "Trench Coat",         cat: "Outerwear",   worn: 7,  image: CLOSET_IMAGES.outer2,  colorHex: "#C4A882", matchPct: 95, addedAt: Date.now() - 86400000 * 12 },
  { id: "10", name: "Silk Blouse",         cat: "Tops",        worn: 5,  image: CLOSET_IMAGES.top1,    colorHex: "#FAF7F4", matchPct: 90, addedAt: Date.now() - 86400000 * 10 },
  { id: "11", name: "Midi Skirt",          cat: "Bottoms",     worn: 4,  image: CLOSET_IMAGES.bottom3, colorHex: "#C4A882", matchPct: 86, addedAt: Date.now() - 86400000 * 9 },
  { id: "12", name: "Gold Hoops",          cat: "Accessories", worn: 42, image: CLOSET_IMAGES.acc1,    colorHex: "#C9956A", matchPct: 97, addedAt: Date.now() - 86400000 * 8, isFavorite: true },
  { id: "13", name: "Wrap Dress",          cat: "Dresses",     worn: 8,  image: CLOSET_IMAGES.dress3,  colorHex: "#8B7355", matchPct: 91, addedAt: Date.now() - 86400000 * 7 },
  { id: "14", name: "Leather Jacket",      cat: "Outerwear",   worn: 11, image: CLOSET_IMAGES.outer3,  colorHex: "#1A1A1A", matchPct: 88, addedAt: Date.now() - 86400000 * 6 },
  { id: "15", name: "Loafers",             cat: "Shoes",       worn: 19, image: CLOSET_IMAGES.shoe1,   colorHex: "#1A1A1A", matchPct: 92, addedAt: Date.now() - 86400000 * 5 },
  { id: "16", name: "Structured Bag",      cat: "Bags",        worn: 14, image: CLOSET_IMAGES.bag1,    colorHex: "#C4A882", matchPct: 90, addedAt: Date.now() - 86400000 * 4 },
  { id: "17", name: "Silk Scarf",          cat: "Accessories", worn: 23, image: CLOSET_IMAGES.acc2,    colorHex: "#C9956A", matchPct: 85, addedAt: Date.now() - 86400000 * 3 },
  { id: "18", name: "Tailored Trousers",   cat: "Bottoms",     worn: 16, image: CLOSET_IMAGES.bottom1, colorHex: "#2C2C2C", matchPct: 93, addedAt: Date.now() - 86400000 * 2 },
  { id: "19", name: "Striped Top",         cat: "Tops",        worn: 9,  image: CLOSET_IMAGES.top5,    colorHex: "#FAF7F4", matchPct: 87, addedAt: Date.now() - 86400000 * 1 },
  { id: "20", name: "Mini Dress",          cat: "Dresses",     worn: 3,  image: CLOSET_IMAGES.dress4,  colorHex: "#1A1A1A", matchPct: 89, addedAt: Date.now() - 86400000 * 0.5 },
  { id: "21", name: "Heeled Boots",        cat: "Shoes",       worn: 12, image: CLOSET_IMAGES.shoe4,   colorHex: "#1A1A1A", matchPct: 91, addedAt: Date.now() - 86400000 * 0.3 },
  { id: "22", name: "Crossbody Bag",       cat: "Bags",        worn: 21, image: CLOSET_IMAGES.bag3,    colorHex: "#8B7355", matchPct: 88, addedAt: Date.now() - 86400000 * 0.2 },
  { id: "23", name: "Sunglasses",          cat: "Accessories", worn: 38, image: CLOSET_IMAGES.acc3,    colorHex: "#1A1A1A", matchPct: 94, addedAt: Date.now() - 86400000 * 0.1 },
  { id: "24", name: "Cream Knit",          cat: "Tops",        worn: 17, image: CLOSET_IMAGES.top2,    colorHex: "#FAF7F4", matchPct: 90, addedAt: Date.now() },
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

// ─── Sort Logic ───────────────────────────────────────────────────────────────

function sortItems(items: ClosetItem[], sortKey: SortKey): ClosetItem[] {
  const arr = [...items];
  switch (sortKey) {
    case "mostWorn":
      return arr.sort((a, b) => b.worn - a.worn);
    case "recentlyAdded":
      return arr.sort((a, b) => (b.addedAt ?? 0) - (a.addedAt ?? 0));
    case "favorites":
      return arr.sort((a, b) => (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0));
    case "byColor":
      return arr.sort((a, b) => (a.colorHex ?? "").localeCompare(b.colorHex ?? ""));
    case "bestMatch":
      return arr.sort((a, b) => (b.matchPct ?? 0) - (a.matchPct ?? 0));
    default:
      return arr;
  }
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function ClosetScreen() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("default");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showScanModal, setShowScanModal] = useState(false);
  const [closetItems, setClosetItems] = useState<ClosetItem[]>(INITIAL_ITEMS);
  const [userVibe, setUserVibe] = useState("Minimal");
  const [selectedItem, setSelectedItem] = useState<WardrobeItem | null>(null);
  const [showIntelSheet, setShowIntelSheet] = useState(false);
  const [builderAnchor, setBuilderAnchor] = useState<WardrobeItem | null>(null);
  const [showBuilderSheet, setShowBuilderSheet] = useState(false);
  const [recentlyLearned, setRecentlyLearned] = useState<PersistedScanItem[]>([]);
  const sortMenuAnim = useRef(new Animated.Value(0)).current;

  // Load user vibe, scan history, and worn counts on mount
  useEffect(() => {
    getStyleProfile().then(profile => {
      if (profile?.styleVibes?.[0]) setUserVibe(profile.styleVibes[0]);
    }).catch(() => {});

    loadClosetHistory().then(history => {
      if (history.length > 0) {
        setRecentlyLearned(history);
        const restored: ClosetItem[] = history.map(h => ({
          id: h.id, name: h.name, cat: h.category,
          worn: h.worn, image: h.image, isNew: false,
          addedAt: h.scannedAt,
        }));
        setClosetItems(prev => {
          const existingIds = new Set(prev.map(i => i.id));
          return [...restored.filter(r => !existingIds.has(r.id)), ...prev];
        });
      }
    }).catch(() => {});

    // Sync worn counts from worn-tracking store
    loadWornStore().then(store => {
      setClosetItems(prev => prev.map(item => {
        const record = store[item.id];
        if (record) return { ...item, worn: record.wornCount, isFavorite: record.isFavorite };
        return item;
      }));
    }).catch(() => {});
  }, []);

  // Sort menu animation
  useEffect(() => {
    Animated.timing(sortMenuAnim, {
      toValue: showSortMenu ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [showSortMenu]);

  const handleItemAdded = useCallback((scanned: ScannedItem) => {
    const newItem: ClosetItem = {
      id: scanned.id, name: scanned.name, cat: scanned.category,
      worn: 0, image: scanned.image, isNew: true, addedAt: Date.now(),
    };
    setClosetItems(prev => [newItem, ...prev]);
    const persisted: PersistedScanItem = {
      id: scanned.id, name: scanned.name, brand: scanned.brand,
      category: scanned.category, color: scanned.color, colorHex: scanned.colorHex,
      styleTag: scanned.styleTag, image: scanned.image, outfitCount: scanned.outfitCount,
      matchScore: scanned.matchScore, closetIQ: scanned.closetIQ, pairsWith: scanned.pairsWith,
      trendingIn: scanned.trendingIn, occasions: scanned.occasions, worn: 0, scannedAt: Date.now(),
    };
    addToClosetHistory(persisted).then(updated => setRecentlyLearned(updated)).catch(() => {
      setRecentlyLearned(prev => [persisted, ...prev].slice(0, 20));
    });
    hapticSuccess();
  }, []);

  const handleItemTap = useCallback((item: ClosetItem) => {
    hapticLight();
    setSelectedItem({
      id: item.id, image: item.image, category: item.cat, label: item.name,
      matchPct: item.matchPct ?? 87, outfitCount: Math.max(4, item.worn),
      closetIqBoost: 3, wornCount: item.worn,
      colorHex: item.colorHex ?? "#C4A882",
      colorName: item.colorHex === "#1A1A1A" ? "Noir" : item.colorHex === "#FAF7F4" ? "Ivory" : "Warm Camel",
      pairsWell: ["Straight-Leg Jeans", "Silk Blouse", "Loafers", "Trench Coat"],
      occasions: ["Casual", "Work", "Date Night"],
      aestheticTags: ["Quiet Luxury", "Minimal", "Timeless"],
      trendingIn: userVibe,
    });
    setShowIntelSheet(true);
  }, [userVibe]);

  const handleScannedItemTap = useCallback((scanned: PersistedScanItem | ScannedItem) => {
    hapticLight();
    setSelectedItem({
      id: scanned.id, image: scanned.image, category: scanned.category, label: scanned.name,
      brand: scanned.brand, colorHex: scanned.colorHex, colorName: scanned.color,
      matchPct: scanned.matchScore, outfitCount: scanned.outfitCount, closetIqBoost: scanned.closetIQ,
      pairsWell: scanned.pairsWith, occasions: scanned.occasions,
      aestheticTags: [scanned.styleTag, userVibe, "Timeless"],
      trendingIn: scanned.trendingIn,
    });
    setShowIntelSheet(true);
  }, [userVibe]);

  const handleBuildOutfit = useCallback((item: WardrobeItem) => {
    setBuilderAnchor(item);
    setShowBuilderSheet(true);
  }, []);

  const handleToggleSort = useCallback(() => {
    hapticLight();
    setShowSortMenu(prev => !prev);
  }, []);

  const handleSelectSort = useCallback((key: SortKey) => {
    hapticLight();
    setSortKey(key);
    setShowSortMenu(false);
  }, []);

  // Filter + sort pipeline
  const filtered = useMemo(() => {
    let items = activeCategory === "All" ? closetItems : closetItems.filter(i => i.cat === activeCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(i => i.name.toLowerCase().includes(q) || i.cat.toLowerCase().includes(q));
    }
    return sortItems(items, sortKey);
  }, [activeCategory, closetItems, searchQuery, sortKey]);

  const sortMenuOpacity = sortMenuAnim;
  const sortMenuTranslateY = sortMenuAnim.interpolate({ inputRange: [0, 1], outputRange: [-8, 0] });

  return (
    <ScreenContainer containerClassName="bg-[#0A0A0A]" edges={["top", "left", "right"]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerLabel}>YOUR CLOSET</Text>
            <Text style={styles.headerTitle}>Wardrobe Intelligence</Text>
          </View>
          <View style={styles.headerStats}>
            <Text style={styles.headerStatNum}>{closetItems.length}</Text>
            <Text style={styles.headerStatLabel}>items</Text>
          </View>
        </View>

        {/* Search + Sort Row */}
        <View style={styles.searchRow}>
          <View style={styles.searchWrap}>
            <Text style={styles.searchIcon}>⌕</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search your wardrobe..."
              placeholderTextColor="rgba(255,255,255,0.25)"
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
              clearButtonMode="while-editing"
            />
          </View>
          <TouchableOpacity
            style={[styles.sortBtn, sortKey !== "default" && styles.sortBtnActive]}
            onPress={handleToggleSort}
            activeOpacity={0.8}
          >
            <Text style={[styles.sortBtnText, sortKey !== "default" && styles.sortBtnTextActive]}>
              {sortKey !== "default" ? SORT_OPTIONS.find(s => s.key === sortKey)?.label ?? "Sort" : "Sort"}
            </Text>
            <Text style={[styles.sortBtnChevron, showSortMenu && { transform: [{ rotate: "180deg" }] }]}>▾</Text>
          </TouchableOpacity>
        </View>

        {/* Sort Menu Dropdown */}
        {showSortMenu && (
          <Animated.View
            style={[
              styles.sortMenu,
              { opacity: sortMenuOpacity, transform: [{ translateY: sortMenuTranslateY }] },
            ]}
          >
            {SORT_OPTIONS.map(opt => (
              <TouchableOpacity
                key={opt.key}
                style={[styles.sortMenuItem, sortKey === opt.key && styles.sortMenuItemActive]}
                onPress={() => handleSelectSort(opt.key)}
                activeOpacity={0.7}
              >
                <Text style={[styles.sortMenuItemText, sortKey === opt.key && styles.sortMenuItemTextActive]}>
                  {opt.label}
                </Text>
                {sortKey === opt.key && <Text style={styles.sortMenuCheck}>✓</Text>}
              </TouchableOpacity>
            ))}
          </Animated.View>
        )}

        {/* Scan CTA */}
        <ScanCTA onPress={() => setShowScanModal(true)} />

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
            {[{ label: "Work", score: 98 }, { label: "Date Night", score: 92 }, { label: "Weekend", score: 87 }].map(m => (
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
                <View style={[styles.colorDnaDot, { backgroundColor: c.hex }, c.hex === "#FAF7F4" ? { borderWidth: 1, borderColor: ThreadlyColors.charcoalLight } : {}]} />
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
          horizontal showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
          style={styles.categoryScroll}
        >
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[styles.categoryChip, activeCategory === cat && styles.categoryChipActive]}
              onPress={() => { hapticLight(); setActiveCategory(cat); }}
              activeOpacity={0.7}
            >
              <Text style={[styles.categoryChipText, activeCategory === cat && styles.categoryChipTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Recently Learned Row */}
        {recentlyLearned.length > 0 && (
          <RecentlyLearnedRow items={recentlyLearned} onItemTap={handleScannedItemTap} />
        )}

        {/* Search result count */}
        {searchQuery.trim().length > 0 && (
          <View style={styles.searchResultRow}>
            <Text style={styles.searchResultText}>
              {filtered.length} {filtered.length === 1 ? "item" : "items"} found
            </Text>
          </View>
        )}

        {/* Items Grid */}
        <View style={styles.itemGrid}>
          {filtered.map((item, idx) => (
            <AnimatedItemCard
              key={item.id}
              item={item}
              width={ITEM_W}
              isNew={item.isNew}
              index={idx}
              onPress={() => handleItemTap(item)}
            >
              <View style={styles.itemImageWrap}>
                <Image source={{ uri: item.image }} style={styles.itemImage} resizeMode="cover" />
                {item.isNew && (
                  <View style={styles.newBadge}><Text style={styles.newBadgeText}>NEW</Text></View>
                )}
                {item.isFavorite && (
                  <View style={styles.favBadge}><Text style={styles.favBadgeText}>♥</Text></View>
                )}
                <View style={styles.itemWornBadge}>
                  <Text style={styles.itemWornText}>{item.worn === 0 ? "✦" : `${item.worn}x`}</Text>
                </View>
              </View>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.itemCat}>{item.cat}</Text>
              </View>
            </AnimatedItemCard>
          ))}
          {filtered.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No items found</Text>
              <Text style={styles.emptyStateSubtext}>Try a different search or category</Text>
            </View>
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Modals */}
      <ClosetScanModal
        visible={showScanModal}
        onClose={() => setShowScanModal(false)}
        onItemAdded={handleItemAdded}
        userVibe={userVibe}
      />

      <ItemIntelligenceSheet
        item={selectedItem}
        visible={showIntelSheet}
        onClose={() => setShowIntelSheet(false)}
        onBuildOutfit={handleBuildOutfit}
      />

      <OutfitBuilderSheet
        anchor={builderAnchor}
        visible={showBuilderSheet}
        onClose={() => setShowBuilderSheet(false)}
        closetItems={closetItems.map(i => ({
          id: i.id, image: i.image, category: i.cat, label: i.name,
          matchPct: i.matchPct, wornCount: i.worn, colorHex: i.colorHex,
        }))}
        userVibe={userVibe}
      />
    </ScreenContainer>
  );
}

// ─── Scan CTA ─────────────────────────────────────────────────────────────────

function ScanCTA({ onPress }: { onPress: () => void }) {
  const { scale, onPressIn, onPressOut } = useScalePress(0.97);
  const glowOpacity = useRef(new Animated.Value(0)).current;
  const ringScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(ringScale, { toValue: 1.08, duration: 1600, useNativeDriver: true }),
        Animated.timing(ringScale, { toValue: 1, duration: 1600, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  return (
    <Pressable
      onPressIn={() => { onPressIn(); Animated.timing(glowOpacity, { toValue: 1, duration: 80, useNativeDriver: true }).start(); }}
      onPressOut={() => { onPressOut(); Animated.timing(glowOpacity, { toValue: 0, duration: 220, useNativeDriver: true }).start(); }}
      onPress={onPress}
    >
      <Animated.View style={[styles.scanCard, { transform: [{ scale }] }]}>
        <LinearGradient colors={["#1A0E08", "#2A1A10"]} style={StyleSheet.absoluteFill} />
        <View style={styles.scanCardBorder} />
        <View style={styles.scanCardContent}>
          <View style={styles.scanIconWrap}>
            <Animated.View style={[styles.scanIconRing, { transform: [{ scale: ringScale }], opacity: 0.35 }]} />
            <View style={styles.scanIcon}>
              <Text style={styles.scanIconText}>+</Text>
            </View>
          </View>
          <View style={styles.scanCardText}>
            <Text style={styles.scanCardTitle}>Scan a New Item</Text>
            <Text style={styles.scanCardSub}>Threadly will learn your style</Text>
          </View>
          <Text style={styles.scanCardArrow}>→</Text>
        </View>
        <Animated.View
          pointerEvents="none"
          style={[StyleSheet.absoluteFill, { borderRadius: ThreadlyRadius.xl, borderWidth: 1, borderColor: ThreadlyColors.roseGold, opacity: glowOpacity }]}
        />
      </Animated.View>
    </Pressable>
  );
}

// ─── Animated Item Card ───────────────────────────────────────────────────────

function AnimatedItemCard({
  children, item, width: cardWidth, isNew = false, index, onPress,
}: {
  children: React.ReactNode;
  item: { id: string };
  width: number;
  isNew?: boolean;
  index: number;
  onPress?: () => void;
}) {
  const { scale, onPressIn, onPressOut } = useScalePress(0.96);
  const entranceOpacity = useRef(new Animated.Value(isNew ? 0 : 1)).current;
  const entranceScale = useRef(new Animated.Value(isNew ? 0.85 : 1)).current;

  useEffect(() => {
    if (isNew) {
      Animated.parallel([
        Animated.timing(entranceOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.spring(entranceScale, { toValue: 1, tension: 70, friction: 10, useNativeDriver: true }),
      ]).start();
    }
  }, [isNew]);

  return (
    <Pressable onPressIn={onPressIn} onPressOut={onPressOut} onPress={onPress ?? (() => hapticLight())}>
      <Animated.View
        style={[
          styles.itemCard,
          { width: cardWidth },
          { transform: [{ scale }, { scale: entranceScale }], opacity: entranceOpacity },
          isNew && styles.itemCardNew,
        ]}
      >
        {children}
      </Animated.View>
    </Pressable>
  );
}

// ─── Recently Learned Row ────────────────────────────────────────────────────

function RecentlyLearnedRow({
  items, onItemTap,
}: {
  items: (PersistedScanItem | ScannedItem)[];
  onItemTap: (item: PersistedScanItem | ScannedItem) => void;
}) {
  const entranceY = useRef(new Animated.Value(20)).current;
  const entranceOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(entranceY, { toValue: 0, duration: 400, useNativeDriver: true }),
      Animated.timing(entranceOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[styles.recentSection, { transform: [{ translateY: entranceY }], opacity: entranceOpacity }]}>
      <View style={styles.recentHeader}>
        <Text style={styles.recentLabel}>RECENTLY LEARNED</Text>
        <View style={styles.recentBadge}>
          <Text style={styles.recentBadgeText}>✦ THREADLY KNOWS</Text>
        </View>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.recentList}>
        {items.map((item, idx) => (
          <RecentItemCard key={item.id} item={item} index={idx} onPress={() => onItemTap(item)} />
        ))}
      </ScrollView>
    </Animated.View>
  );
}

function RecentItemCard({ item, index, onPress }: { item: PersistedScanItem | ScannedItem; index: number; onPress: () => void }) {
  const { scale, onPressIn, onPressOut } = useScalePress(0.95);
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const cardY = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(cardOpacity, { toValue: 1, duration: 350, useNativeDriver: true }),
        Animated.timing(cardY, { toValue: 0, duration: 350, useNativeDriver: true }),
      ]).start();
    }, index * 80);
  }, []);

  return (
    <Pressable onPressIn={onPressIn} onPressOut={onPressOut} onPress={onPress}>
      <Animated.View style={[styles.recentCard, { transform: [{ scale }, { translateY: cardY }], opacity: cardOpacity }]}>
        <Image source={{ uri: item.image }} style={styles.recentImage} resizeMode="cover" />
        <LinearGradient colors={["transparent", "rgba(10,10,10,0.85)"]} style={StyleSheet.absoluteFill} />
        <View style={styles.recentMatchBadge}>
          <Text style={styles.recentMatchText}>{item.matchScore}%</Text>
        </View>
        <View style={styles.recentNewBadge}>
          <Text style={styles.recentNewText}>NEW</Text>
        </View>
        <View style={styles.recentCardInfo}>
          <Text style={styles.recentCardName} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.recentCardBrand}>{item.brand}</Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: ThreadlyColors.black },
  scrollContent: { paddingBottom: 32 },
  header: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end",
    paddingHorizontal: ThreadlySpacing.screenPadding, paddingTop: 24, paddingBottom: 16,
  },
  headerLabel: { fontSize: 9, fontWeight: "700", color: ThreadlyColors.roseGold, letterSpacing: 2, marginBottom: 4 },
  headerTitle: { fontSize: 26, fontFamily: "Georgia", color: ThreadlyColors.warmWhite },
  headerStats: {
    alignItems: "center", backgroundColor: ThreadlyColors.charcoal, borderRadius: ThreadlyRadius.lg,
    paddingHorizontal: 16, paddingVertical: 10, borderWidth: 1, borderColor: "rgba(201,149,106,0.2)",
  },
  headerStatNum: { fontSize: 22, fontFamily: "Georgia", color: ThreadlyColors.roseGoldLight, lineHeight: 24 },
  headerStatLabel: { fontSize: 9, color: ThreadlyColors.warmWhiteSubtle, letterSpacing: 1 },

  // Search + Sort
  searchRow: {
    flexDirection: "row", alignItems: "center", gap: 10,
    paddingHorizontal: ThreadlySpacing.screenPadding, marginBottom: 12,
  },
  searchWrap: {
    flex: 1, flexDirection: "row", alignItems: "center", gap: 8,
    backgroundColor: "#1A1A1A", borderRadius: ThreadlyRadius.lg,
    paddingHorizontal: 14, paddingVertical: 10,
    borderWidth: 1, borderColor: "rgba(255,255,255,0.08)",
  },
  searchIcon: { fontSize: 16, color: "rgba(255,255,255,0.3)" },
  searchInput: { flex: 1, fontSize: 14, color: ThreadlyColors.warmWhite, padding: 0 },
  sortBtn: {
    flexDirection: "row", alignItems: "center", gap: 4,
    backgroundColor: "#1A1A1A", borderRadius: ThreadlyRadius.lg,
    paddingHorizontal: 14, paddingVertical: 10,
    borderWidth: 1, borderColor: "rgba(255,255,255,0.08)",
  },
  sortBtnActive: { borderColor: "rgba(201,149,106,0.4)", backgroundColor: "rgba(201,149,106,0.08)" },
  sortBtnText: { fontSize: 13, color: "rgba(255,255,255,0.5)", fontWeight: "600" },
  sortBtnTextActive: { color: ThreadlyColors.roseGold },
  sortBtnChevron: { fontSize: 10, color: "rgba(255,255,255,0.4)" },

  // Sort Menu
  sortMenu: {
    marginHorizontal: ThreadlySpacing.screenPadding, marginBottom: 12,
    backgroundColor: "#1E1E1E", borderRadius: ThreadlyRadius.lg, overflow: "hidden",
    borderWidth: 1, borderColor: "rgba(255,255,255,0.08)",
  },
  sortMenuItem: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.04)",
  },
  sortMenuItemActive: { backgroundColor: "rgba(201,149,106,0.08)" },
  sortMenuItemText: { fontSize: 14, color: "rgba(255,255,255,0.6)" },
  sortMenuItemTextActive: { color: ThreadlyColors.roseGold, fontWeight: "600" },
  sortMenuCheck: { fontSize: 12, color: ThreadlyColors.roseGold },

  // Search result count
  searchResultRow: { paddingHorizontal: ThreadlySpacing.screenPadding, marginBottom: 8 },
  searchResultText: { fontSize: 11, color: "rgba(255,255,255,0.3)", letterSpacing: 0.5 },

  // Scan CTA
  scanCard: {
    marginHorizontal: ThreadlySpacing.screenPadding, borderRadius: ThreadlyRadius.xl,
    overflow: "hidden", borderWidth: 1, borderColor: "rgba(201,149,106,0.25)", marginBottom: 20,
  },
  scanCardBorder: { position: "absolute", top: 0, left: 0, right: 0, height: 1, backgroundColor: ThreadlyColors.roseGold, opacity: 0.45 },
  scanCardContent: { flexDirection: "row", alignItems: "center", padding: 18, gap: 14 },
  scanIconWrap: { width: 44, height: 44, alignItems: "center", justifyContent: "center", position: "relative" },
  scanIconRing: { position: "absolute", width: 44, height: 44, borderRadius: 22, borderWidth: 1.5, borderColor: ThreadlyColors.roseGold },
  scanIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: "rgba(201,149,106,0.15)", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "rgba(201,149,106,0.3)" },
  scanIconText: { fontSize: 24, color: ThreadlyColors.roseGold, fontWeight: "300" },
  scanCardText: { flex: 1 },
  scanCardTitle: { fontSize: 15, fontFamily: "Georgia", color: ThreadlyColors.warmWhite, marginBottom: 3 },
  scanCardSub: { fontSize: 12, color: ThreadlyColors.warmWhiteSubtle },
  scanCardArrow: { fontSize: 18, color: ThreadlyColors.warmWhiteMuted },

  // Analysis card
  analysisCard: {
    marginHorizontal: ThreadlySpacing.screenPadding, borderRadius: ThreadlyRadius.xl,
    overflow: "hidden", borderWidth: 1, borderColor: "rgba(201,149,106,0.2)", padding: 20, marginBottom: 24,
  },
  analysisCardBorder: { position: "absolute", top: 0, left: 0, right: 0, height: 1, backgroundColor: ThreadlyColors.roseGold, opacity: 0.4 },
  analysisLabel: { fontSize: 9, fontWeight: "700", color: ThreadlyColors.roseGold, letterSpacing: 2, marginBottom: 6 },
  analysisTitle: { fontSize: 20, fontFamily: "Georgia", color: ThreadlyColors.warmWhite, marginBottom: 16 },
  styleProfileRow: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 16, flexWrap: "wrap" },
  styleProfileKey: { fontSize: 11, color: ThreadlyColors.warmWhiteSubtle, fontWeight: "600" },
  styleProfileTags: { flexDirection: "row", gap: 6, flexWrap: "wrap" },
  styleTag: { backgroundColor: "rgba(201,149,106,0.12)", borderWidth: 1, borderColor: "rgba(201,149,106,0.3)", paddingHorizontal: 10, paddingVertical: 4, borderRadius: ThreadlyRadius.pill },
  styleTagText: { fontSize: 11, color: ThreadlyColors.roseGoldLight, fontWeight: "600" },
  matchRow: { flexDirection: "row", gap: 8, marginBottom: 20 },
  matchCard: { flex: 1, backgroundColor: "rgba(255,255,255,0.04)", borderRadius: ThreadlyRadius.md, padding: 12, alignItems: "center", borderWidth: 1, borderColor: ThreadlyColors.charcoalLight },
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

  // Category filter
  categoryScroll: { marginBottom: 16 },
  categoryList: { paddingHorizontal: ThreadlySpacing.screenPadding, gap: 8 },
  categoryChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: ThreadlyRadius.pill, backgroundColor: ThreadlyColors.charcoal, borderWidth: 1, borderColor: ThreadlyColors.charcoalLight },
  categoryChipActive: { backgroundColor: "rgba(201,149,106,0.15)", borderColor: ThreadlyColors.roseGold },
  categoryChipText: { fontSize: 12, color: ThreadlyColors.warmWhiteSubtle, fontWeight: "600" },
  categoryChipTextActive: { color: ThreadlyColors.roseGoldLight },

  // Item grid
  itemGrid: { paddingHorizontal: ThreadlySpacing.screenPadding, flexDirection: "row", flexWrap: "wrap", gap: GRID_GAP },
  itemCard: { backgroundColor: ThreadlyColors.charcoal, borderRadius: ThreadlyRadius.lg, overflow: "hidden", borderWidth: 1, borderColor: ThreadlyColors.charcoalLight },
  itemCardNew: { borderColor: "rgba(201,149,106,0.5)" },
  itemImageWrap: { height: ITEM_W, position: "relative" },
  itemImage: { width: "100%", height: "100%" },
  newBadge: { position: "absolute", top: 6, left: 6, backgroundColor: ThreadlyColors.roseGold, paddingHorizontal: 5, paddingVertical: 2, borderRadius: 4 },
  newBadgeText: { fontSize: 7, fontWeight: "800", color: "#0A0A0A", letterSpacing: 0.5 },
  favBadge: { position: "absolute", top: 6, left: 6, backgroundColor: "rgba(201,149,106,0.85)", paddingHorizontal: 5, paddingVertical: 2, borderRadius: 4 },
  favBadgeText: { fontSize: 9, color: "#0A0A0A" },
  itemWornBadge: { position: "absolute", top: 6, right: 6, backgroundColor: "rgba(10,10,10,0.7)", paddingHorizontal: 6, paddingVertical: 2, borderRadius: ThreadlyRadius.pill },
  itemWornText: { fontSize: 9, fontWeight: "700", color: ThreadlyColors.warmWhiteSubtle },
  itemInfo: { padding: 8 },
  itemName: { fontSize: 11, color: ThreadlyColors.warmWhite, fontWeight: "600", marginBottom: 2 },
  itemCat: { fontSize: 9, color: ThreadlyColors.warmWhiteSubtle, letterSpacing: 0.5 },

  // Empty state
  emptyState: { flex: 1, alignItems: "center", paddingVertical: 40, width: "100%" },
  emptyStateText: { fontSize: 16, color: "rgba(255,255,255,0.4)", fontFamily: "Georgia", marginBottom: 6 },
  emptyStateSubtext: { fontSize: 12, color: "rgba(255,255,255,0.2)" },

  // Recently Learned
  recentSection: { marginBottom: 20 },
  recentHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: ThreadlySpacing.screenPadding, marginBottom: 12 },
  recentLabel: { fontSize: 10, fontWeight: "700", color: "rgba(255,255,255,0.35)", letterSpacing: 2 },
  recentBadge: { backgroundColor: "rgba(201,149,106,0.12)", borderWidth: 1, borderColor: "rgba(201,149,106,0.3)", borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 },
  recentBadgeText: { fontSize: 9, fontWeight: "700", color: ThreadlyColors.roseGold, letterSpacing: 1 },
  recentList: { paddingHorizontal: ThreadlySpacing.screenPadding, gap: 10 },
  recentCard: { width: 120, height: 160, borderRadius: ThreadlyRadius.lg, overflow: "hidden", borderWidth: 1, borderColor: "rgba(201,149,106,0.4)", position: "relative" },
  recentImage: { width: "100%", height: "100%" },
  recentMatchBadge: { position: "absolute", top: 8, right: 8, backgroundColor: "rgba(201,149,106,0.85)", borderRadius: 10, paddingHorizontal: 6, paddingVertical: 2 },
  recentMatchText: { fontSize: 10, fontWeight: "800", color: "#0A0A0A" },
  recentNewBadge: { position: "absolute", top: 8, left: 8, backgroundColor: ThreadlyColors.roseGold, borderRadius: 4, paddingHorizontal: 5, paddingVertical: 2 },
  recentNewText: { fontSize: 7, fontWeight: "800", color: "#0A0A0A", letterSpacing: 0.5 },
  recentCardInfo: { position: "absolute", bottom: 8, left: 8, right: 8 },
  recentCardName: { fontSize: 11, fontWeight: "700", color: ThreadlyColors.warmWhite, marginBottom: 1 },
  recentCardBrand: { fontSize: 9, color: "rgba(255,255,255,0.5)", letterSpacing: 0.5 },
});
