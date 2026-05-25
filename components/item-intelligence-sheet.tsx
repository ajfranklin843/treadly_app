/**
 * Threadly — Item Intelligence Sheet
 *
 * A premium bottom-sheet that opens when the user taps any wardrobe item.
 * Feels like opening a luxury AI fashion profile for a single piece.
 *
 * Sections:
 * - Large editorial item image with gradient overlay
 * - Worn count + last worn date + favorite toggle
 * - Style classification + color DNA swatch
 * - Style Match % + Closet IQ boost + Outfit Combos
 * - "Already works with X looks" intelligence line
 * - Pairs Well With chip row
 * - Occasions this item covers
 * - Aesthetic tags
 * - "Trending in your vibe" badge
 * - Mark as Worn Today CTA (with animated confirmation)
 * - Build Outfit + Go New using this item CTAs
 */

import React, { useRef, useEffect, useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  Pressable,
  Animated,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThreadlyColors, ThreadlySpacing, ThreadlyRadius } from "@/constants/threadly";
import { useImageFade, hapticLight, hapticSuccess, hapticMedium } from "@/lib/animations";
import { router } from "expo-router";
import {
  markAsWorn,
  toggleFavorite,
  loadWornStore,
  formatLastWorn,
  type WornRecord,
} from "@/lib/worn-tracking-store";

const { height: SCREEN_H } = Dimensions.get("window");
const SHEET_HEIGHT = SCREEN_H * 0.88;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface WardrobeItem {
  id: string;
  image: string;
  category: string;
  label: string;
  brand?: string;
  colorHex?: string;
  colorName?: string;
  matchPct?: number;
  outfitCount?: number;
  pairsWell?: string[];
  occasions?: string[];
  aestheticTags?: string[];
  trendingIn?: string;
  closetIqBoost?: number;
  wornCount?: number;
}

interface ItemIntelligenceSheetProps {
  item: WardrobeItem | null;
  visible: boolean;
  onClose: () => void;
  onBuildOutfit?: (item: WardrobeItem) => void;
}

// ─── Fade Image ───────────────────────────────────────────────────────────────

function FadeImage({ uri, style }: { uri: string; style: object }) {
  const { imageOpacity, onImageLoad } = useImageFade();
  return (
    <Animated.Image
      source={{ uri }}
      style={[style, { opacity: imageOpacity }]}
      resizeMode="cover"
      onLoad={onImageLoad}
    />
  );
}

// ─── Intelligence Row ─────────────────────────────────────────────────────────

function IntelRow({ icon, label, value, accent }: { icon: string; label: string; value: string; accent?: boolean }) {
  return (
    <View style={styles.intelRow}>
      <Text style={styles.intelIcon}>{icon}</Text>
      <Text style={styles.intelLabel}>{label}</Text>
      <Text style={[styles.intelValue, accent && styles.intelValueAccent]}>{value}</Text>
    </View>
  );
}

// ─── Chip ─────────────────────────────────────────────────────────────────────

function Chip({ label, accent }: { label: string; accent?: boolean }) {
  return (
    <View style={[styles.chip, accent && styles.chipAccent]}>
      <Text style={[styles.chipText, accent && styles.chipTextAccent]}>{label}</Text>
    </View>
  );
}

// ─── Mark as Worn Button ──────────────────────────────────────────────────────

function MarkAsWornButton({
  onPress,
  confirmed,
  loading,
}: {
  onPress: () => void;
  confirmed: boolean;
  loading: boolean;
}) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const checkOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (confirmed) {
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 0.94, duration: 80, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, damping: 12, stiffness: 200, useNativeDriver: true }),
      ]).start();
      Animated.timing(checkOpacity, { toValue: 1, duration: 300, useNativeDriver: true }).start();
    }
  }, [confirmed]);

  return (
    <TouchableOpacity
      style={[styles.wornBtn, confirmed && styles.wornBtnConfirmed]}
      onPress={onPress}
      activeOpacity={0.85}
      disabled={loading}
    >
      <Animated.View style={[styles.wornBtnInner, { transform: [{ scale: scaleAnim }] }]}>
        {confirmed ? (
          <Animated.Text style={[styles.wornBtnText, styles.wornBtnTextConfirmed, { opacity: checkOpacity }]}>
            ✓ Worn Today — Closet IQ Updated
          </Animated.Text>
        ) : (
          <Text style={styles.wornBtnText}>
            {loading ? "Updating..." : "Mark as Worn Today"}
          </Text>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
}

// ─── Main Sheet ───────────────────────────────────────────────────────────────

export function ItemIntelligenceSheet({ item, visible, onClose, onBuildOutfit }: ItemIntelligenceSheetProps) {
  const insets = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(SHEET_HEIGHT)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  const [wornRecord, setWornRecord] = useState<WornRecord | null>(null);
  const [wornConfirmed, setWornConfirmed] = useState(false);
  const [wornLoading, setWornLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // Load worn record when sheet opens
  useEffect(() => {
    if (visible && item) {
      setWornConfirmed(false);
      loadWornStore().then((store) => {
        const record = store[item.id] ?? null;
        setWornRecord(record);
        setIsFavorite(record?.isFavorite ?? false);
      });
    }
  }, [visible, item?.id]);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          damping: 22,
          stiffness: 200,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: SHEET_HEIGHT,
          duration: 280,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleClose = useCallback(() => {
    hapticLight();
    onClose();
  }, [onClose]);

  const handleBuildOutfit = useCallback(() => {
    hapticSuccess();
    if (item && onBuildOutfit) {
      onClose();
      setTimeout(() => onBuildOutfit(item), 300);
    } else {
      onClose();
      setTimeout(() => router.push("/(tabs)/gonew"), 300);
    }
  }, [onClose, item, onBuildOutfit]);

  const handleMarkAsWorn = useCallback(async () => {
    if (!item || wornConfirmed) return;
    setWornLoading(true);
    hapticMedium();
    const updated = await markAsWorn(item.id, wornRecord?.wornCount ?? item.wornCount ?? 0);
    setWornRecord(updated);
    setWornLoading(false);
    setWornConfirmed(true);
    hapticSuccess();
  }, [item, wornRecord, wornConfirmed]);

  const handleToggleFavorite = useCallback(async () => {
    if (!item) return;
    hapticLight();
    const updated = await toggleFavorite(item.id, wornRecord?.wornCount ?? item.wornCount ?? 0);
    setWornRecord(updated);
    setIsFavorite(updated.isFavorite);
  }, [item, wornRecord]);

  if (!item) return null;

  // Derive intelligence data from item (with smart defaults)
  const matchPct = wornRecord?.styleMatchScore ?? item.matchPct ?? 87;
  const outfitCount = item.outfitCount ?? 12;
  const closetIqBoost = item.closetIqBoost ?? 3;
  const colorHex = item.colorHex ?? "#C4A882";
  const colorName = item.colorName ?? "Warm Neutral";
  const pairsWell = item.pairsWell ?? ["Straight-Leg Jeans", "Silk Blouse", "Loafers", "Trench Coat"];
  const occasions = item.occasions ?? ["Casual", "Work", "Date Night"];
  const aestheticTags = item.aestheticTags ?? ["Quiet Luxury", "Minimal", "Timeless"];
  const trendingIn = item.trendingIn ?? "your aesthetic";
  const wornCount = wornRecord?.wornCount ?? item.wornCount ?? 0;
  const lastWornStr = formatLastWorn(wornRecord?.lastWornDate ?? null);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      {/* Backdrop */}
      <Animated.View
        style={[StyleSheet.absoluteFill, { backgroundColor: "rgba(0,0,0,0.75)", opacity: backdropOpacity }]}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />
      </Animated.View>

      {/* Sheet */}
      <Animated.View
        style={[
          styles.sheet,
          { transform: [{ translateY: slideAnim }], paddingBottom: insets.bottom + 16 },
        ]}
      >
        {/* Drag Handle */}
        <View style={styles.dragHandle} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          bounces={false}
        >
          {/* Hero Image */}
          <View style={styles.heroWrap}>
            <FadeImage uri={item.image} style={styles.heroImage} />
            <LinearGradient
              colors={["transparent", "rgba(10,10,10,0.85)"]}
              style={StyleSheet.absoluteFill}
            />

            {/* Close button */}
            <Pressable
              style={({ pressed }) => [styles.closeBtn, pressed && { opacity: 0.6 }]}
              onPress={handleClose}
            >
              <Text style={styles.closeBtnText}>✕</Text>
            </Pressable>

            {/* Favorite button */}
            <Pressable
              style={({ pressed }) => [styles.favoriteBtn, pressed && { opacity: 0.6 }]}
              onPress={handleToggleFavorite}
            >
              <Text style={[styles.favoriteBtnText, isFavorite && styles.favoriteBtnActive]}>
                {isFavorite ? "♥" : "♡"}
              </Text>
            </Pressable>

            {/* Trending badge */}
            {trendingIn && (
              <View style={styles.trendingBadge}>
                <Text style={styles.trendingBadgeText}>✦ TRENDING IN {trendingIn.toUpperCase()}</Text>
              </View>
            )}

            {/* Item title overlay */}
            <View style={styles.heroOverlay}>
              <Text style={styles.heroCategory}>{item.category.toUpperCase()}</Text>
              <Text style={styles.heroLabel}>{item.label}</Text>
              {item.brand && <Text style={styles.heroBrand}>{item.brand}</Text>}
            </View>
          </View>

          {/* Worn Memory Row */}
          <View style={styles.wornMemoryRow}>
            <View style={styles.wornMemoryStat}>
              <Text style={styles.wornMemoryValue}>{wornCount}</Text>
              <Text style={styles.wornMemoryLabel}>Times Worn</Text>
            </View>
            <View style={styles.wornMemoryDivider} />
            <View style={styles.wornMemoryStat}>
              <Text style={styles.wornMemoryValue}>{matchPct}%</Text>
              <Text style={styles.wornMemoryLabel}>Style Match</Text>
            </View>
            <View style={styles.wornMemoryDivider} />
            <View style={[styles.wornMemoryStat, { flex: 2 }]}>
              <Text style={styles.wornMemoryValue} numberOfLines={1}>{lastWornStr}</Text>
              <Text style={styles.wornMemoryLabel}>Last Worn</Text>
            </View>
          </View>

          {/* Intelligence Cards Row */}
          <View style={styles.intelCardsRow}>
            {/* Works With */}
            <View style={[styles.intelCard, styles.intelCardMid]}>
              <Text style={styles.intelCardValue}>{outfitCount}</Text>
              <Text style={styles.intelCardLabel}>Outfit Combos</Text>
            </View>
            {/* IQ Boost */}
            <View style={styles.intelCard}>
              <Text style={styles.intelCardValue}>+{closetIqBoost}</Text>
              <Text style={styles.intelCardLabel}>Closet IQ</Text>
            </View>
          </View>

          {/* Color DNA */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>COLOR DNA</Text>
            <View style={styles.colorDnaRow}>
              <View style={[styles.colorSwatch, { backgroundColor: colorHex }]} />
              <View style={styles.colorDnaText}>
                <Text style={styles.colorDnaName}>{colorName}</Text>
                <Text style={styles.colorDnaHex}>{colorHex.toUpperCase()}</Text>
              </View>
              <View style={styles.colorDnaFit}>
                <Text style={styles.colorDnaFitText}>✓ Fits your palette</Text>
              </View>
            </View>
          </View>

          {/* Intelligence Lines */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>WARDROBE INTELLIGENCE</Text>
            <View style={styles.intelLines}>
              <IntelRow icon="◈" label="Already works with" value={`${outfitCount} looks`} accent />
              <IntelRow icon="✦" label="Style match score" value={`${matchPct}%`} accent />
              <IntelRow icon="◆" label="Closet IQ boost" value={`+${closetIqBoost} points`} />
              <IntelRow icon="♡" label="Trending in" value={trendingIn} />
            </View>
          </View>

          {/* Pairs Well With */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>PAIRS WELL WITH</Text>
            <View style={styles.chipRow}>
              {pairsWell.map((p, i) => (
                <Chip key={i} label={p} accent={i === 0} />
              ))}
            </View>
          </View>

          {/* Occasions */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>OCCASIONS</Text>
            <View style={styles.chipRow}>
              {occasions.map((o, i) => (
                <Chip key={i} label={o} />
              ))}
            </View>
          </View>

          {/* Aesthetic Tags */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>AESTHETIC TAGS</Text>
            <View style={styles.chipRow}>
              {aestheticTags.map((t, i) => (
                <Chip key={i} label={t} />
              ))}
            </View>
          </View>

          {/* Mark as Worn */}
          <View style={[styles.section, { marginTop: 24 }]}>
            <MarkAsWornButton
              onPress={handleMarkAsWorn}
              confirmed={wornConfirmed}
              loading={wornLoading}
            />
          </View>

          {/* CTAs */}
          <View style={styles.ctaSection}>
            <TouchableOpacity
              style={styles.primaryCta}
              onPress={handleBuildOutfit}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={[ThreadlyColors.roseGold, ThreadlyColors.roseGoldLight]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.primaryCtaGradient}
              >
                <Text style={styles.primaryCtaText}>Build Outfit with This</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryCta}
              onPress={() => { hapticLight(); onClose(); setTimeout(() => router.push("/(tabs)/gonew"), 300); }}
              activeOpacity={0.7}
            >
              <Text style={styles.secondaryCtaText}>Go New using this item →</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Animated.View>
    </Modal>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: SHEET_HEIGHT,
    backgroundColor: "#111111",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
  },
  dragHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 4,
  },
  scrollContent: {
    paddingBottom: 32,
  },

  // ── Hero ──
  heroWrap: {
    height: 300,
    position: "relative",
    overflow: "hidden",
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  closeBtn: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  closeBtnText: {
    color: ThreadlyColors.warmWhite,
    fontSize: 14,
    fontWeight: "600",
  },
  favoriteBtn: {
    position: "absolute",
    top: 16,
    right: 56,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  favoriteBtnText: {
    fontSize: 16,
    color: "rgba(255,255,255,0.6)",
  },
  favoriteBtnActive: {
    color: ThreadlyColors.roseGold,
  },
  trendingBadge: {
    position: "absolute",
    top: 16,
    left: 16,
    backgroundColor: "rgba(201,149,106,0.2)",
    borderWidth: 1,
    borderColor: ThreadlyColors.roseGold,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  trendingBadgeText: {
    color: ThreadlyColors.roseGold,
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1.2,
  },
  heroOverlay: {
    position: "absolute",
    bottom: 16,
    left: 20,
    right: 20,
  },
  heroCategory: {
    fontSize: 10,
    fontWeight: "700",
    color: ThreadlyColors.roseGold,
    letterSpacing: 2,
    marginBottom: 4,
  },
  heroLabel: {
    fontSize: 22,
    fontFamily: "Georgia",
    color: ThreadlyColors.warmWhite,
    lineHeight: 28,
  },
  heroBrand: {
    fontSize: 12,
    color: "rgba(255,255,255,0.5)",
    marginTop: 2,
    letterSpacing: 1,
  },

  // ── Worn Memory Row ──
  wornMemoryRow: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 16,
    backgroundColor: "#1A1A1A",
    borderRadius: ThreadlyRadius.md,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  wornMemoryStat: {
    flex: 1,
    alignItems: "center",
  },
  wornMemoryValue: {
    fontSize: 16,
    fontFamily: "Georgia",
    color: ThreadlyColors.roseGold,
    fontWeight: "600",
  },
  wornMemoryLabel: {
    fontSize: 9,
    color: "rgba(255,255,255,0.35)",
    letterSpacing: 1,
    marginTop: 3,
    textTransform: "uppercase",
  },
  wornMemoryDivider: {
    width: 1,
    height: 28,
    backgroundColor: "rgba(255,255,255,0.08)",
  },

  // ── Intelligence Cards ──
  intelCardsRow: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginTop: 10,
    gap: 8,
  },
  intelCard: {
    flex: 1,
    backgroundColor: "#1A1A1A",
    borderRadius: ThreadlyRadius.md,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  intelCardMid: {
    borderColor: "rgba(201,149,106,0.3)",
    backgroundColor: "rgba(201,149,106,0.08)",
  },
  intelCardValue: {
    fontSize: 22,
    fontFamily: "Georgia",
    color: ThreadlyColors.roseGold,
    fontWeight: "600",
  },
  intelCardLabel: {
    fontSize: 10,
    color: "rgba(255,255,255,0.4)",
    letterSpacing: 0.8,
    marginTop: 2,
    textAlign: "center",
  },

  // ── Sections ──
  section: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "rgba(255,255,255,0.3)",
    letterSpacing: 2,
    marginBottom: 10,
  },

  // ── Color DNA ──
  colorDnaRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
    borderRadius: ThreadlyRadius.md,
    padding: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  colorSwatch: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  colorDnaText: {
    flex: 1,
  },
  colorDnaName: {
    fontSize: 14,
    color: ThreadlyColors.warmWhite,
    fontWeight: "600",
  },
  colorDnaHex: {
    fontSize: 11,
    color: "rgba(255,255,255,0.4)",
    marginTop: 2,
    letterSpacing: 1,
  },
  colorDnaFit: {
    backgroundColor: "rgba(34,197,94,0.12)",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  colorDnaFitText: {
    fontSize: 11,
    color: "#4ADE80",
    fontWeight: "600",
  },

  // ── Intelligence Lines ──
  intelLines: {
    backgroundColor: "#1A1A1A",
    borderRadius: ThreadlyRadius.md,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  intelRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.04)",
    gap: 10,
  },
  intelIcon: {
    fontSize: 12,
    color: ThreadlyColors.roseGold,
    width: 16,
  },
  intelLabel: {
    flex: 1,
    fontSize: 13,
    color: "rgba(255,255,255,0.55)",
  },
  intelValue: {
    fontSize: 13,
    color: ThreadlyColors.warmWhite,
    fontWeight: "600",
  },
  intelValueAccent: {
    color: ThreadlyColors.roseGold,
  },

  // ── Chips ──
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    backgroundColor: "#1E1E1E",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  chipAccent: {
    backgroundColor: "rgba(201,149,106,0.12)",
    borderColor: "rgba(201,149,106,0.3)",
  },
  chipText: {
    fontSize: 12,
    color: "rgba(255,255,255,0.6)",
  },
  chipTextAccent: {
    color: ThreadlyColors.roseGold,
    fontWeight: "600",
  },

  // ── Mark as Worn Button ──
  wornBtn: {
    borderRadius: ThreadlyRadius.xl,
    borderWidth: 1,
    borderColor: "rgba(201,149,106,0.4)",
    backgroundColor: "rgba(201,149,106,0.08)",
    overflow: "hidden",
  },
  wornBtnConfirmed: {
    borderColor: "rgba(74,222,128,0.4)",
    backgroundColor: "rgba(74,222,128,0.08)",
  },
  wornBtnInner: {
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  wornBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: ThreadlyColors.roseGold,
    letterSpacing: 0.3,
  },
  wornBtnTextConfirmed: {
    color: "#4ADE80",
  },

  // ── CTAs ──
  ctaSection: {
    marginHorizontal: 20,
    marginTop: 16,
    gap: 12,
  },
  primaryCta: {
    borderRadius: ThreadlyRadius.xl,
    overflow: "hidden",
  },
  primaryCtaGradient: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryCtaText: {
    fontSize: 15,
    fontWeight: "700",
    color: ThreadlyColors.black,
    letterSpacing: 0.5,
  },
  secondaryCta: {
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    borderRadius: ThreadlyRadius.xl,
  },
  secondaryCtaText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.6)",
    fontWeight: "500",
  },
});
