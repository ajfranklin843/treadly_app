/**
 * Threadly — Saved Looks
 *
 * A dedicated screen for saved outfit collections.
 * Feels like a luxury fashion editorial — Pinterest meets personal stylist.
 *
 * Features:
 * - Collection cards with 2x2 image preview grid
 * - Occasion filters (All, Work, Date Night, Weekend, Vacation, Event)
 * - Confidence score badges
 * - Delete swipe actions
 * - Empty state with CTA to build first look
 */

import React, { useState, useEffect, useCallback, useRef } from "react";
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
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ScreenContainer } from "@/components/screen-container";
import { ThreadlyColors, ThreadlySpacing, ThreadlyRadius } from "@/constants/threadly";
import { hapticLight, hapticMedium, useScalePress } from "@/lib/animations";
import { loadSavedLooks, deleteLook, formatSavedDate, type SavedLook } from "@/lib/saved-looks-store";
import { router } from "expo-router";

const { width } = Dimensions.get("window");
const CARD_W = width - ThreadlySpacing.screenPadding * 2;
const PREVIEW_SIZE = (CARD_W - 40 - 4) / 2; // 2-col grid inside card

const OCCASION_FILTERS = ["All", "Casual", "Work", "Date Night", "Weekend", "Vacation", "Event"];

// ─── Demo seed looks (shown when no looks are saved yet) ─────────────────────

const DEMO_LOOKS: SavedLook[] = [
  {
    id: "demo_1",
    name: "Quiet Luxury Monday",
    occasion: "Work",
    anchorItemId: "1",
    anchorItemImage: "https://images.unsplash.com/photo-1594938298603-a3554753b9c1?w=400&q=80",
    anchorItemLabel: "Camel Blazer",
    pieceIds: ["1", "2", "15", "8"],
    pieceImages: [
      "https://images.unsplash.com/photo-1594938298603-a3554753b9c1?w=300&q=80",
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&q=80",
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=300&q=80",
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=300&q=80",
    ],
    confidenceScore: 94,
    savedAt: Date.now() - 86400000 * 2,
  },
  {
    id: "demo_2",
    name: "Date Night Minimal",
    occasion: "Date Night",
    anchorItemId: "6",
    anchorItemImage: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80",
    anchorItemLabel: "Midi Slip Dress",
    pieceIds: ["6", "21", "16", "12"],
    pieceImages: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&q=80",
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=300&q=80",
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=300&q=80",
      "https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=300&q=80",
    ],
    confidenceScore: 97,
    savedAt: Date.now() - 86400000 * 5,
  },
  {
    id: "demo_3",
    name: "Weekend Effortless",
    occasion: "Weekend",
    anchorItemId: "5",
    anchorItemImage: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&q=80",
    anchorItemLabel: "Straight-Leg Jeans",
    pieceIds: ["5", "4", "7", "17"],
    pieceImages: [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=300&q=80",
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=300&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&q=80",
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300&q=80",
    ],
    confidenceScore: 89,
    savedAt: Date.now() - 86400000 * 8,
  },
];

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function LooksScreen() {
  const [looks, setLooks] = useState<SavedLook[]>([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSavedLooks().then(saved => {
      // Show demo looks if no real looks saved yet
      setLooks(saved.length > 0 ? saved : DEMO_LOOKS);
      setLoading(false);
    }).catch(() => {
      setLooks(DEMO_LOOKS);
      setLoading(false);
    });
  }, []);

  const handleDelete = useCallback((id: string) => {
    hapticMedium();
    Alert.alert(
      "Delete Look",
      "Remove this saved look from your collection?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const updated = await deleteLook(id);
            setLooks(updated.length > 0 ? updated : DEMO_LOOKS);
          },
        },
      ]
    );
  }, []);

  const filtered = activeFilter === "All"
    ? looks
    : looks.filter(l => l.occasion === activeFilter);

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
            <Text style={styles.headerLabel}>SAVED LOOKS</Text>
            <Text style={styles.headerTitle}>Your Collections</Text>
          </View>
          <View style={styles.headerStats}>
            <Text style={styles.headerStatNum}>{looks.length}</Text>
            <Text style={styles.headerStatLabel}>looks</Text>
          </View>
        </View>

        {/* Intelligence Banner */}
        <View style={styles.intelligenceBanner}>
          <LinearGradient colors={["#1A1410", "#1A1A1A"]} style={StyleSheet.absoluteFill} />
          <View style={styles.intelligenceBannerBorder} />
          <Text style={styles.intelligenceText}>
            ✦ Threadly has built {looks.length} curated looks from your wardrobe
          </Text>
        </View>

        {/* Occasion Filters */}
        <ScrollView
          horizontal showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterList}
          style={styles.filterScroll}
        >
          {OCCASION_FILTERS.map(f => (
            <TouchableOpacity
              key={f}
              style={[styles.filterChip, activeFilter === f && styles.filterChipActive]}
              onPress={() => { hapticLight(); setActiveFilter(f); }}
              activeOpacity={0.7}
            >
              <Text style={[styles.filterChipText, activeFilter === f && styles.filterChipTextActive]}>
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Looks Grid */}
        {filtered.length === 0 ? (
          <EmptyState />
        ) : (
          <View style={styles.looksList}>
            {filtered.map((look, idx) => (
              <LookCard key={look.id} look={look} index={idx} onDelete={() => handleDelete(look.id)} />
            ))}
          </View>
        )}

        {/* Build new look CTA */}
        <TouchableOpacity
          style={styles.buildCta}
          onPress={() => { hapticLight(); router.push("/(tabs)/closet"); }}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={["rgba(201,149,106,0.15)", "rgba(201,149,106,0.05)"]}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.buildCtaBorder} />
          <Text style={styles.buildCtaText}>+ Build a New Look</Text>
          <Text style={styles.buildCtaSub}>Tap any wardrobe item → "Build Outfit with This"</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </ScreenContainer>
  );
}

// ─── Look Card ────────────────────────────────────────────────────────────────

function LookCard({ look, index, onDelete }: { look: SavedLook; index: number; onDelete: () => void }) {
  const { scale, onPressIn, onPressOut } = useScalePress(0.98);
  const cardAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setTimeout(() => {
      Animated.spring(cardAnim, { toValue: 1, damping: 18, stiffness: 160, useNativeDriver: true }).start();
    }, index * 80);
  }, []);

  const translateY = cardAnim.interpolate({ inputRange: [0, 1], outputRange: [24, 0] });
  const previewImages = look.pieceImages.slice(0, 4);

  return (
    <Pressable onPressIn={onPressIn} onPressOut={onPressOut}>
      <Animated.View style={[styles.lookCard, { opacity: cardAnim, transform: [{ scale }, { translateY }] }]}>
        <LinearGradient colors={["#1A1A1A", "#141414"]} style={StyleSheet.absoluteFill} />
        <View style={styles.lookCardBorder} />

        {/* Header row */}
        <View style={styles.lookCardHeader}>
          <View style={styles.lookCardHeaderLeft}>
            <Text style={styles.lookOccasionBadge}>{look.occasion.toUpperCase()}</Text>
            <Text style={styles.lookName}>{look.name}</Text>
            <Text style={styles.lookDate}>{formatSavedDate(look.savedAt)}</Text>
          </View>
          <View style={styles.lookCardHeaderRight}>
            <View style={styles.confidenceBadge}>
              <Text style={styles.confidenceBadgeText}>{look.confidenceScore}%</Text>
              <Text style={styles.confidenceBadgeLabel}>match</Text>
            </View>
          </View>
        </View>

        {/* 2x2 Image Preview Grid */}
        <View style={styles.previewGrid}>
          {[0, 1, 2, 3].map(i => (
            <View key={i} style={styles.previewCell}>
              {previewImages[i] ? (
                <Image source={{ uri: previewImages[i] }} style={styles.previewImage} resizeMode="cover" />
              ) : (
                <View style={styles.previewEmpty}>
                  <Text style={styles.previewEmptyText}>+</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Anchor item tag */}
        <View style={styles.anchorRow}>
          <Text style={styles.anchorLabel}>Built around</Text>
          <Text style={styles.anchorName}>{look.anchorItemLabel}</Text>
        </View>

        {/* Actions */}
        <View style={styles.lookActions}>
          <TouchableOpacity
            style={styles.lookActionBtnPrimary}
            onPress={() => {
              hapticLight();
              router.push({
                pathname: "/(tabs)/gonew",
                params: {
                  anchorItemId: look.anchorItemId,
                  anchorItemLabel: look.anchorItemLabel,
                  anchorItemImage: look.anchorItemImage,
                  occasion: look.occasion,
                  fromLook: look.id,
                },
              });
            }}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={[ThreadlyColors.roseGold, ThreadlyColors.roseGoldLight]}
              style={StyleSheet.absoluteFill}
            />
            <Text style={styles.lookActionTextPrimary}>✦ Recreate This Look</Text>
          </TouchableOpacity>
          <View style={styles.lookActionsSecondary}>
            <TouchableOpacity style={styles.lookActionBtn} onPress={() => { hapticLight(); router.push("/(tabs)/closet"); }} activeOpacity={0.7}>
              <Text style={styles.lookActionText}>Wear This</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.lookActionBtnDanger} onPress={onDelete} activeOpacity={0.7}>
              <Text style={styles.lookActionTextDanger}>Remove</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyOrb}>✦</Text>
      <Text style={styles.emptyTitle}>No looks saved yet</Text>
      <Text style={styles.emptySubtitle}>
        Open any wardrobe item and tap{"\n"}"Build Outfit with This" to create your first look.
      </Text>
    </View>
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

  intelligenceBanner: {
    marginHorizontal: ThreadlySpacing.screenPadding, borderRadius: ThreadlyRadius.lg,
    overflow: "hidden", borderWidth: 1, borderColor: "rgba(201,149,106,0.2)",
    paddingHorizontal: 16, paddingVertical: 12, marginBottom: 16,
  },
  intelligenceBannerBorder: { position: "absolute", top: 0, left: 0, right: 0, height: 1, backgroundColor: ThreadlyColors.roseGold, opacity: 0.35 },
  intelligenceText: { fontSize: 12, color: "rgba(255,255,255,0.55)", fontStyle: "italic" },

  filterScroll: { marginBottom: 20 },
  filterList: { paddingHorizontal: ThreadlySpacing.screenPadding, gap: 8 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: ThreadlyRadius.pill, backgroundColor: ThreadlyColors.charcoal, borderWidth: 1, borderColor: ThreadlyColors.charcoalLight },
  filterChipActive: { backgroundColor: "rgba(201,149,106,0.15)", borderColor: ThreadlyColors.roseGold },
  filterChipText: { fontSize: 12, color: ThreadlyColors.warmWhiteSubtle, fontWeight: "600" },
  filterChipTextActive: { color: ThreadlyColors.roseGoldLight },

  looksList: { paddingHorizontal: ThreadlySpacing.screenPadding, gap: 16 },

  // Look Card
  lookCard: {
    borderRadius: ThreadlyRadius.xl, overflow: "hidden",
    borderWidth: 1, borderColor: "rgba(255,255,255,0.06)", padding: 16,
  },
  lookCardBorder: { position: "absolute", top: 0, left: 0, right: 0, height: 1, backgroundColor: ThreadlyColors.roseGold, opacity: 0.2 },
  lookCardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 },
  lookCardHeaderLeft: { flex: 1 },
  lookCardHeaderRight: {},
  lookOccasionBadge: { fontSize: 8, fontWeight: "700", color: ThreadlyColors.roseGold, letterSpacing: 1.5, marginBottom: 4 },
  lookName: { fontSize: 17, fontFamily: "Georgia", color: ThreadlyColors.warmWhite, marginBottom: 3 },
  lookDate: { fontSize: 11, color: "rgba(255,255,255,0.3)" },
  confidenceBadge: { alignItems: "center", backgroundColor: "rgba(201,149,106,0.12)", borderWidth: 1, borderColor: "rgba(201,149,106,0.3)", borderRadius: ThreadlyRadius.md, paddingHorizontal: 12, paddingVertical: 8 },
  confidenceBadgeText: { fontSize: 18, fontFamily: "Georgia", color: ThreadlyColors.roseGold, lineHeight: 20 },
  confidenceBadgeLabel: { fontSize: 8, color: "rgba(255,255,255,0.4)", letterSpacing: 0.5 },

  // Preview Grid
  previewGrid: { flexDirection: "row", flexWrap: "wrap", gap: 4, marginBottom: 12 },
  previewCell: { width: PREVIEW_SIZE, height: PREVIEW_SIZE, borderRadius: ThreadlyRadius.md, overflow: "hidden" },
  previewImage: { width: "100%", height: "100%" },
  previewEmpty: { width: "100%", height: "100%", backgroundColor: "#1E1E1E", alignItems: "center", justifyContent: "center" },
  previewEmptyText: { fontSize: 20, color: "rgba(255,255,255,0.15)" },

  // Anchor row
  anchorRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 14 },
  anchorLabel: { fontSize: 11, color: "rgba(255,255,255,0.3)" },
  anchorName: { fontSize: 11, color: ThreadlyColors.roseGold, fontWeight: "600" },

  // Actions
  lookActions: { gap: 10 },
  lookActionsSecondary: { flexDirection: "row", gap: 10 },
  lookActionBtnPrimary: { height: 44, alignItems: "center", justifyContent: "center", borderRadius: ThreadlyRadius.lg, overflow: "hidden" },
  lookActionTextPrimary: { fontSize: 13, color: ThreadlyColors.black, fontWeight: "700", letterSpacing: 0.3 },
  lookActionBtn: { flex: 1, paddingVertical: 10, alignItems: "center", backgroundColor: "rgba(201,149,106,0.12)", borderRadius: ThreadlyRadius.lg, borderWidth: 1, borderColor: "rgba(201,149,106,0.3)" },
  lookActionText: { fontSize: 13, color: ThreadlyColors.roseGold, fontWeight: "600" },
  lookActionBtnDanger: { paddingHorizontal: 16, paddingVertical: 10, alignItems: "center", borderRadius: ThreadlyRadius.lg, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" },
  lookActionTextDanger: { fontSize: 13, color: "rgba(255,255,255,0.3)" },

  // Empty state
  emptyState: { alignItems: "center", paddingVertical: 60, paddingHorizontal: 40 },
  emptyOrb: { fontSize: 40, color: ThreadlyColors.roseGold, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontFamily: "Georgia", color: ThreadlyColors.warmWhite, marginBottom: 10 },
  emptySubtitle: { fontSize: 14, color: "rgba(255,255,255,0.4)", textAlign: "center", lineHeight: 20 },

  // Build CTA
  buildCta: {
    marginHorizontal: ThreadlySpacing.screenPadding, marginTop: 24,
    borderRadius: ThreadlyRadius.xl, overflow: "hidden",
    borderWidth: 1, borderColor: "rgba(201,149,106,0.25)", padding: 20, alignItems: "center",
  },
  buildCtaBorder: { position: "absolute", top: 0, left: 0, right: 0, height: 1, backgroundColor: ThreadlyColors.roseGold, opacity: 0.3 },
  buildCtaText: { fontSize: 16, fontFamily: "Georgia", color: ThreadlyColors.roseGoldLight, marginBottom: 4 },
  buildCtaSub: { fontSize: 11, color: "rgba(255,255,255,0.35)", textAlign: "center" },
});
