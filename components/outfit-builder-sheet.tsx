/**
 * Threadly — Outfit Builder Sheet
 *
 * The core daily-use product experience.
 * Anchors around a selected wardrobe item and intelligently builds outfits
 * by pulling from the user's existing closet, suggesting missing pieces,
 * and showing style confidence scores.
 *
 * Phases:
 * 1. Building — animated AI thinking state with step-by-step reasoning
 * 2. Outfit — full outfit display with anchor + compatible pieces
 * 3. Occasion switching — Work / Date Night / Weekend / Vacation / Event
 * 4. Missing pieces — what to add to complete the look
 * 5. Save look — persists to saved-looks store
 */

import React, { useRef, useEffect, useCallback, useState, useMemo } from "react";
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
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThreadlyColors, ThreadlySpacing, ThreadlyRadius } from "@/constants/threadly";
import { hapticLight, hapticSuccess, hapticMedium } from "@/lib/animations";
import { saveLook } from "@/lib/saved-looks-store";
import type { WardrobeItem } from "@/components/item-intelligence-sheet";
import { trpc } from "@/lib/trpc";

const { height: SCREEN_H, width: SCREEN_W } = Dimensions.get("window");
const SHEET_HEIGHT = SCREEN_H * 0.92;

// ─── Types ────────────────────────────────────────────────────────────────────

const OCCASIONS = ["Casual", "Work", "Date Night", "Weekend", "Vacation", "Event"] as const;
type Occasion = typeof OCCASIONS[number];

interface OutfitBuilderSheetProps {
  anchor: WardrobeItem | null;
  visible: boolean;
  onClose: () => void;
  closetItems: WardrobeItem[];
  userVibe: string;
}

interface OutfitPiece {
  item: WardrobeItem;
  role: string; // "Anchor" | "Top" | "Bottom" | "Outerwear" | "Shoes" | "Bag" | "Accessory"
  compatScore: number;
  reason: string;
}

interface MissingPiece {
  category: string;
  suggestion: string;
  priceRange: string;
  why: string;
}

// ─── Outfit Generation Engine ─────────────────────────────────────────────────

function generateOutfit(
  anchor: WardrobeItem,
  closetItems: WardrobeItem[],
  occasion: Occasion,
  userVibe: string
): { pieces: OutfitPiece[]; missing: MissingPiece[]; confidenceScore: number; styleNote: string } {
  const others = closetItems.filter(i => i.id !== anchor.id);

  // Category priority for each occasion
  const occasionPriority: Record<Occasion, string[]> = {
    "Casual":     ["Tops", "Bottoms", "Shoes", "Bags", "Accessories"],
    "Work":       ["Tops", "Bottoms", "Outerwear", "Shoes", "Bags"],
    "Date Night": ["Dresses", "Tops", "Shoes", "Bags", "Accessories"],
    "Weekend":    ["Tops", "Bottoms", "Shoes", "Accessories"],
    "Vacation":   ["Dresses", "Tops", "Bottoms", "Shoes", "Bags"],
    "Event":      ["Dresses", "Outerwear", "Shoes", "Bags", "Accessories"],
  };

  const priority = occasionPriority[occasion];
  const anchorCat = anchor.category;

  // Find compatible pieces from closet (up to 3 complementary items)
  const pieces: OutfitPiece[] = [
    {
      item: anchor,
      role: "Anchor",
      compatScore: 100,
      reason: "Your selected piece — the foundation of this look.",
    },
  ];

  const usedCategories = new Set([anchorCat]);
  const roleMap: Record<string, string> = {
    "Tops": "Top", "Bottoms": "Bottom", "Dresses": "Dress",
    "Outerwear": "Layer", "Shoes": "Shoes", "Bags": "Bag", "Accessories": "Detail",
  };

  for (const cat of priority) {
    if (usedCategories.has(cat)) continue;
    if (pieces.length >= 4) break;

    const candidates = others.filter(i => i.category === cat);
    if (candidates.length === 0) continue;

    // Score by match % and worn count (most worn = most trusted)
    const scored = candidates.map(c => ({
      item: c,
      score: (c.matchPct ?? 80) * 0.7 + Math.min((c.wornCount ?? 0) * 2, 30),
    })).sort((a, b) => b.score - a.score);

    const best = scored[0];
    const compatScore = Math.min(97, Math.round(best.score));

    const reasons: Record<string, string[]> = {
      "Tops": ["Complements your anchor piece perfectly.", "The color palette aligns with your DNA.", "Elevates the silhouette."],
      "Bottoms": ["Creates a balanced proportion.", "The neutral tone grounds the look.", "Works across multiple occasions."],
      "Outerwear": ["Adds the finishing layer.", "Quiet luxury compatible.", "Elevates the entire outfit."],
      "Shoes": ["Grounds the look with intention.", "The heel height suits this occasion.", "Completes the silhouette."],
      "Bags": ["The structure matches the occasion.", "Carries the color story forward.", "Functional and editorial."],
      "Accessories": ["The detail that makes it personal.", "Adds warmth to the palette.", "Subtle but intentional."],
      "Dresses": ["A single-piece solution.", "Effortless and occasion-appropriate.", "Minimal effort, maximum impact."],
    };

    const reasonList = reasons[cat] ?? ["A strong addition to this look."];
    const reason = reasonList[Math.floor(Math.random() * reasonList.length)];

    pieces.push({ item: best.item, role: roleMap[cat] ?? cat, compatScore, reason });
    usedCategories.add(cat);
  }

  // Identify missing pieces
  const missing: MissingPiece[] = [];
  const missingCats = priority.filter(cat => !usedCategories.has(cat)).slice(0, 2);

  const missingMap: Record<string, { suggestion: string; priceRange: string; why: string }> = {
    "Shoes":      { suggestion: "Pointed-toe loafers in black or tan", priceRange: "$80–$180", why: "Complete the silhouette with intention." },
    "Bags":       { suggestion: "Structured mini bag in camel or black", priceRange: "$60–$150", why: "Carries the color story forward." },
    "Outerwear":  { suggestion: "Tailored blazer in neutral tones", priceRange: "$90–$220", why: "The finishing layer that elevates everything." },
    "Accessories":{ suggestion: "Gold hoop earrings or silk scarf", priceRange: "$20–$80", why: "The detail that makes it personal." },
    "Tops":       { suggestion: "Fitted silk blouse in ivory or cream", priceRange: "$50–$120", why: "A versatile anchor for multiple looks." },
    "Bottoms":    { suggestion: "Straight-leg trousers in black or camel", priceRange: "$60–$140", why: "The foundation of a capsule wardrobe." },
    "Dresses":    { suggestion: "Midi slip dress in neutral tones", priceRange: "$80–$200", why: "A single-piece solution for any occasion." },
  };

  for (const cat of missingCats) {
    const info = missingMap[cat];
    if (info) missing.push({ category: cat, ...info });
  }

  // Confidence score based on how many closet pieces matched
  const ownedPct = Math.round((pieces.length / Math.max(priority.length, 1)) * 100);
  const confidenceScore = Math.min(96, Math.max(72, ownedPct + 20));

  // Style note
  const styleNotes: Record<string, string> = {
    "Old Money": `This look channels quiet luxury — understated, intentional, and effortlessly elevated.`,
    "Minimal":   `Clean lines, neutral palette, zero noise. This is your aesthetic at its best.`,
    "Clean Girl": `Soft, polished, and effortless. The kind of outfit that looks like you tried just enough.`,
    "Streetwear": `Relaxed but intentional. The silhouette does the talking.`,
    "Chic":      `Sharp, confident, and Parisian. This outfit means business.`,
    "Casual Luxe": `Premium basics, elevated. Comfortable without compromising on style.`,
    "Vacation":  `Resort-ready and relaxed. The kind of outfit that photographs beautifully.`,
  };
  const styleNote = styleNotes[userVibe] ?? `A cohesive look that works with your wardrobe DNA.`;

  return { pieces, missing, confidenceScore, styleNote };
}

// ─── Building State ───────────────────────────────────────────────────────────

const BUILD_STEPS = [
  "Analyzing anchor piece...",
  "Scanning your wardrobe...",
  "Matching color palette...",
  "Checking occasion fit...",
  "Calculating style confidence...",
  "Building your look...",
];

function BuildingState({ onComplete }: { onComplete: () => void }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [done, setDone] = useState(false);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const orbPulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Orb pulse
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(orbPulse, { toValue: 1.12, duration: 800, useNativeDriver: true }),
        Animated.timing(orbPulse, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    );
    pulse.start();

    // Step through build steps
    let i = 0;
    const interval = setInterval(() => {
      i++;
      if (i < BUILD_STEPS.length) {
        setStepIndex(i);
        Animated.timing(progressAnim, {
          toValue: (i + 1) / BUILD_STEPS.length,
          duration: 350,
          useNativeDriver: false,
        }).start();
      } else {
        clearInterval(interval);
        pulse.stop();
        setDone(true);
        setTimeout(onComplete, 500);
      }
    }, 420);

    return () => { clearInterval(interval); pulse.stop(); };
  }, []);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={buildStyles.container}>
      {/* Orb */}
      <View style={buildStyles.orbWrap}>
        <Animated.View style={[buildStyles.orbRing, { transform: [{ scale: orbPulse }] }]} />
        <LinearGradient
          colors={[ThreadlyColors.roseGold, ThreadlyColors.roseGoldLight, "#E8C9A0"]}
          style={buildStyles.orb}
        >
          <Text style={buildStyles.orbIcon}>✦</Text>
        </LinearGradient>
      </View>

      <Text style={buildStyles.title}>Building Your Look</Text>
      <Text style={buildStyles.subtitle}>Threadly is thinking through your wardrobe</Text>

      {/* Progress bar */}
      <View style={buildStyles.progressBar}>
        <Animated.View style={[buildStyles.progressFill, { width: progressWidth }]} />
      </View>

      {/* Steps */}
      <View style={buildStyles.steps}>
        {BUILD_STEPS.map((step, idx) => (
          <View key={idx} style={buildStyles.stepRow}>
            <Text style={[buildStyles.stepDot, idx <= stepIndex && buildStyles.stepDotActive]}>
              {idx < stepIndex ? "✓" : idx === stepIndex ? "◈" : "○"}
            </Text>
            <Text style={[buildStyles.stepText, idx <= stepIndex && buildStyles.stepTextActive]}>
              {step}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const buildStyles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 32 },
  orbWrap: { width: 100, height: 100, alignItems: "center", justifyContent: "center", marginBottom: 28 },
  orbRing: { position: "absolute", width: 100, height: 100, borderRadius: 50, borderWidth: 1, borderColor: "rgba(201,149,106,0.35)" },
  orb: { width: 72, height: 72, borderRadius: 36, alignItems: "center", justifyContent: "center" },
  orbIcon: { fontSize: 28, color: "#0A0A0A" },
  title: { fontSize: 22, fontFamily: "Georgia", color: ThreadlyColors.warmWhite, marginBottom: 8, textAlign: "center" },
  subtitle: { fontSize: 13, color: "rgba(255,255,255,0.45)", textAlign: "center", marginBottom: 28 },
  progressBar: { width: "100%", height: 3, backgroundColor: "rgba(255,255,255,0.08)", borderRadius: 2, overflow: "hidden", marginBottom: 28 },
  progressFill: { height: "100%", backgroundColor: ThreadlyColors.roseGold, borderRadius: 2 },
  steps: { width: "100%", gap: 10 },
  stepRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  stepDot: { fontSize: 12, color: "rgba(255,255,255,0.2)", width: 16 },
  stepDotActive: { color: ThreadlyColors.roseGold },
  stepText: { fontSize: 13, color: "rgba(255,255,255,0.3)" },
  stepTextActive: { color: "rgba(255,255,255,0.75)" },
});

// ─── Outfit State ─────────────────────────────────────────────────────────────

function OutfitState({
  anchor,
  pieces,
  missing,
  confidenceScore,
  styleNote,
  occasion,
  onOccasionChange,
  onSave,
  saved,
  aiOutfitInsight,
}: {
  anchor: WardrobeItem;
  pieces: OutfitPiece[];
  missing: MissingPiece[];
  confidenceScore: number;
  styleNote: string;
  occasion: Occasion;
  onOccasionChange: (o: Occasion) => void;
  onSave: () => void;
  saved: boolean;
  aiOutfitInsight: { whyItWorks: string | null; confidenceNote: string | null; elevationTip: string | null } | null;
}) {
  const entranceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(entranceAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  }, [occasion]);

  const ownedCount = pieces.length;
  const totalNeeded = ownedCount + missing.length;

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={outfitStyles.scrollContent}>
      {/* Confidence Banner */}
      <Animated.View style={[outfitStyles.confidenceBanner, { opacity: entranceAnim }]}>
        <LinearGradient colors={["#1A1410", "#1A1A1A"]} style={StyleSheet.absoluteFill} />
        <View style={outfitStyles.confidenceBannerBorder} />
        <View style={outfitStyles.confidenceRow}>
          <View>
            <Text style={outfitStyles.confidenceLabel}>STYLE CONFIDENCE</Text>
            <Text style={outfitStyles.confidenceScore}>{confidenceScore}%</Text>
          </View>
          <View style={outfitStyles.ownedPill}>
            <Text style={outfitStyles.ownedPillText}>You own {ownedCount}/{totalNeeded} pieces</Text>
          </View>
        </View>
        <Text style={outfitStyles.styleNote}>{styleNote}</Text>
      </Animated.View>

      {/* Occasion Switcher */}
      <View style={outfitStyles.section}>
        <Text style={outfitStyles.sectionLabel}>OCCASION</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={outfitStyles.occasionList}>
          {OCCASIONS.map(occ => (
            <TouchableOpacity
              key={occ}
              style={[outfitStyles.occasionChip, occasion === occ && outfitStyles.occasionChipActive]}
              onPress={() => { hapticLight(); onOccasionChange(occ); }}
              activeOpacity={0.7}
            >
              <Text style={[outfitStyles.occasionChipText, occasion === occ && outfitStyles.occasionChipTextActive]}>
                {occ}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Outfit Pieces */}
      <View style={outfitStyles.section}>
        <Text style={outfitStyles.sectionLabel}>YOUR LOOK</Text>
        <View style={outfitStyles.piecesGrid}>
          {pieces.map((piece, idx) => (
            <OutfitPieceCard key={piece.item.id} piece={piece} index={idx} />
          ))}
        </View>
      </View>

      {/* Missing Pieces */}
      {missing.length > 0 && (
        <View style={outfitStyles.section}>
          <Text style={outfitStyles.sectionLabel}>COMPLETE THE LOOK</Text>
          <View style={outfitStyles.missingList}>
            {missing.map((m, idx) => (
              <View key={idx} style={outfitStyles.missingCard}>
                <View style={outfitStyles.missingCardLeft}>
                  <Text style={outfitStyles.missingCategory}>{m.category}</Text>
                  <Text style={outfitStyles.missingSuggestion}>{m.suggestion}</Text>
                  <Text style={outfitStyles.missingWhy}>{m.why}</Text>
                </View>
                <View style={outfitStyles.missingPrice}>
                  <Text style={outfitStyles.missingPriceText}>{m.priceRange}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* AI Why This Works Card */}
      {aiOutfitInsight?.whyItWorks && (
        <View style={outfitStyles.section}>
          <Text style={outfitStyles.sectionLabel}>WHY THIS WORKS</Text>
          <View style={outfitStyles.aiOutfitCard}>
            <Text style={outfitStyles.aiOutfitWhy}>{aiOutfitInsight.whyItWorks}</Text>
            {aiOutfitInsight.confidenceNote && (
              <Text style={outfitStyles.aiOutfitConfidence}>{aiOutfitInsight.confidenceNote}</Text>
            )}
            {aiOutfitInsight.elevationTip && (
              <View style={outfitStyles.aiOutfitTipRow}>
                <Text style={outfitStyles.aiOutfitTipLabel}>✦ ELEVATE</Text>
                <Text style={outfitStyles.aiOutfitTip}>{aiOutfitInsight.elevationTip}</Text>
              </View>
            )}
          </View>
        </View>
      )}

      {/* Intelligence Lines */}
      <View style={outfitStyles.section}>
        <Text style={outfitStyles.sectionLabel}>OUTFIT INTELLIGENCE</Text>
        <View style={outfitStyles.intelLines}>
          <IntelLine icon="◈" label="Wardrobe compatibility" value={`${confidenceScore}%`} accent />
          <IntelLine icon="✦" label="Pieces you already own" value={`${ownedCount} of ${totalNeeded}`} />
          <IntelLine icon="◆" label="Occasion fit" value={occasion} />
          <IntelLine icon="♡" label="Trending in" value="your aesthetic" />
        </View>
      </View>

      {/* Save Look CTA */}
      <View style={outfitStyles.ctaSection}>
        <TouchableOpacity
          style={[outfitStyles.saveCta, saved && outfitStyles.saveCtaSaved]}
          onPress={onSave}
          activeOpacity={0.85}
          disabled={saved}
        >
          {saved ? (
            <Text style={outfitStyles.saveCtaTextSaved}>✓ Look Saved</Text>
          ) : (
            <LinearGradient
              colors={[ThreadlyColors.roseGold, ThreadlyColors.roseGoldLight]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={outfitStyles.saveCtaGradient}
            >
              <Text style={outfitStyles.saveCtaText}>Save This Look</Text>
            </LinearGradient>
          )}
        </TouchableOpacity>
      </View>

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

function OutfitPieceCard({ piece, index }: { piece: OutfitPiece; index: number }) {
  const cardAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setTimeout(() => {
      Animated.spring(cardAnim, { toValue: 1, damping: 18, stiffness: 180, useNativeDriver: true }).start();
    }, index * 80);
  }, []);

  const translateY = cardAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] });

  return (
    <Animated.View style={[outfitStyles.pieceCard, { opacity: cardAnim, transform: [{ translateY }] }]}>
      <Image source={{ uri: piece.item.image }} style={outfitStyles.pieceImage} resizeMode="cover" />
      <LinearGradient colors={["transparent", "rgba(10,10,10,0.9)"]} style={StyleSheet.absoluteFill} />
      {/* Role badge */}
      <View style={[outfitStyles.roleBadge, piece.role === "Anchor" && outfitStyles.roleBadgeAnchor]}>
        <Text style={[outfitStyles.roleBadgeText, piece.role === "Anchor" && outfitStyles.roleBadgeTextAnchor]}>
          {piece.role}
        </Text>
      </View>
      {/* Compat score */}
      {piece.role !== "Anchor" && (
        <View style={outfitStyles.compatBadge}>
          <Text style={outfitStyles.compatBadgeText}>{piece.compatScore}%</Text>
        </View>
      )}
      <View style={outfitStyles.pieceInfo}>
        <Text style={outfitStyles.pieceName} numberOfLines={1}>{piece.item.label}</Text>
        <Text style={outfitStyles.pieceReason} numberOfLines={2}>{piece.reason}</Text>
      </View>
    </Animated.View>
  );
}

function IntelLine({ icon, label, value, accent }: { icon: string; label: string; value: string; accent?: boolean }) {
  return (
    <View style={outfitStyles.intelRow}>
      <Text style={outfitStyles.intelIcon}>{icon}</Text>
      <Text style={outfitStyles.intelLabel}>{label}</Text>
      <Text style={[outfitStyles.intelValue, accent && outfitStyles.intelValueAccent]}>{value}</Text>
    </View>
  );
}

const PIECE_W = (SCREEN_W - ThreadlySpacing.screenPadding * 2 - 10) / 2;

const outfitStyles = StyleSheet.create({
  scrollContent: { paddingBottom: 32 },

  // Confidence banner
  confidenceBanner: {
    marginHorizontal: ThreadlySpacing.screenPadding, marginTop: 16,
    borderRadius: ThreadlyRadius.xl, overflow: "hidden",
    borderWidth: 1, borderColor: "rgba(201,149,106,0.25)", padding: 18, marginBottom: 4,
  },
  confidenceBannerBorder: { position: "absolute", top: 0, left: 0, right: 0, height: 1, backgroundColor: ThreadlyColors.roseGold, opacity: 0.4 },
  confidenceRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 },
  confidenceLabel: { fontSize: 9, fontWeight: "700", color: ThreadlyColors.roseGold, letterSpacing: 2, marginBottom: 4 },
  confidenceScore: { fontSize: 36, fontFamily: "Georgia", color: ThreadlyColors.roseGold, lineHeight: 40 },
  ownedPill: { backgroundColor: "rgba(74,222,128,0.12)", borderWidth: 1, borderColor: "rgba(74,222,128,0.3)", borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
  ownedPillText: { fontSize: 11, color: "#4ADE80", fontWeight: "600" },
  styleNote: { fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 19, fontStyle: "italic" },

  // Section
  section: { marginHorizontal: ThreadlySpacing.screenPadding, marginTop: 20 },
  sectionLabel: { fontSize: 10, fontWeight: "700", color: "rgba(255,255,255,0.3)", letterSpacing: 2, marginBottom: 12 },

  // Occasion switcher
  occasionList: { gap: 8 },
  occasionChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: ThreadlyRadius.pill, backgroundColor: "#1A1A1A", borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" },
  occasionChipActive: { backgroundColor: "rgba(201,149,106,0.15)", borderColor: ThreadlyColors.roseGold },
  occasionChipText: { fontSize: 12, color: "rgba(255,255,255,0.5)", fontWeight: "600" },
  occasionChipTextActive: { color: ThreadlyColors.roseGoldLight },

  // Pieces grid
  piecesGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  pieceCard: { width: PIECE_W, height: PIECE_W * 1.3, borderRadius: ThreadlyRadius.lg, overflow: "hidden", borderWidth: 1, borderColor: "rgba(255,255,255,0.08)", position: "relative" },
  pieceImage: { width: "100%", height: "100%" },
  roleBadge: { position: "absolute", top: 8, left: 8, backgroundColor: "rgba(0,0,0,0.6)", borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 },
  roleBadgeAnchor: { backgroundColor: "rgba(201,149,106,0.85)" },
  roleBadgeText: { fontSize: 9, fontWeight: "700", color: "rgba(255,255,255,0.8)", letterSpacing: 0.5 },
  roleBadgeTextAnchor: { color: "#0A0A0A" },
  compatBadge: { position: "absolute", top: 8, right: 8, backgroundColor: "rgba(201,149,106,0.85)", borderRadius: 10, paddingHorizontal: 6, paddingVertical: 2 },
  compatBadgeText: { fontSize: 9, fontWeight: "800", color: "#0A0A0A" },
  pieceInfo: { position: "absolute", bottom: 8, left: 8, right: 8 },
  pieceName: { fontSize: 12, fontWeight: "700", color: ThreadlyColors.warmWhite, marginBottom: 3 },
  pieceReason: { fontSize: 10, color: "rgba(255,255,255,0.5)", lineHeight: 14 },

  // Missing pieces
  missingList: { gap: 10 },
  missingCard: { flexDirection: "row", alignItems: "center", backgroundColor: "#1A1A1A", borderRadius: ThreadlyRadius.md, padding: 14, borderWidth: 1, borderColor: "rgba(255,255,255,0.06)", gap: 12 },
  missingCardLeft: { flex: 1 },
  missingCategory: { fontSize: 9, fontWeight: "700", color: ThreadlyColors.roseGold, letterSpacing: 1.5, marginBottom: 3 },
  missingSuggestion: { fontSize: 13, color: ThreadlyColors.warmWhite, fontWeight: "600", marginBottom: 3 },
  missingWhy: { fontSize: 11, color: "rgba(255,255,255,0.4)", lineHeight: 15 },
  missingPrice: { backgroundColor: "rgba(201,149,106,0.12)", borderRadius: ThreadlyRadius.md, paddingHorizontal: 10, paddingVertical: 6 },
  missingPriceText: { fontSize: 11, color: ThreadlyColors.roseGold, fontWeight: "700" },

  // Intelligence lines
  intelLines: { backgroundColor: "#1A1A1A", borderRadius: ThreadlyRadius.md, overflow: "hidden", borderWidth: 1, borderColor: "rgba(255,255,255,0.06)" },
  intelRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 14, paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.04)", gap: 10 },
  intelIcon: { fontSize: 12, color: ThreadlyColors.roseGold, width: 16 },
  intelLabel: { flex: 1, fontSize: 13, color: "rgba(255,255,255,0.55)" },
  intelValue: { fontSize: 13, color: ThreadlyColors.warmWhite, fontWeight: "600" },
  intelValueAccent: { color: ThreadlyColors.roseGold },

  // AI Outfit Card
  aiOutfitCard: {
    backgroundColor: "rgba(201,149,106,0.08)",
    borderRadius: ThreadlyRadius.md,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(201,149,106,0.25)",
    gap: 8,
  },
  aiOutfitWhy: {
    fontSize: 13,
    color: ThreadlyColors.warmWhite,
    lineHeight: 19,
    fontFamily: "Georgia",
  },
  aiOutfitConfidence: {
    fontSize: 11,
    color: "rgba(255,255,255,0.45)",
    lineHeight: 16,
    fontStyle: "italic",
  },
  aiOutfitTipRow: {
    marginTop: 4,
    gap: 4,
  },
  aiOutfitTipLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: ThreadlyColors.roseGold,
    letterSpacing: 2,
  },
  aiOutfitTip: {
    fontSize: 12,
    color: ThreadlyColors.roseGoldLight,
    lineHeight: 17,
  },

  // CTAs
  ctaSection: { marginHorizontal: ThreadlySpacing.screenPadding, marginTop: 24 },
  saveCta: { borderRadius: ThreadlyRadius.xl, overflow: "hidden" },
  saveCtaSaved: { backgroundColor: "rgba(74,222,128,0.12)", borderWidth: 1, borderColor: "rgba(74,222,128,0.3)", paddingVertical: 16, alignItems: "center" },
  saveCtaGradient: { paddingVertical: 16, alignItems: "center" },
  saveCtaText: { fontSize: 15, fontWeight: "700", color: ThreadlyColors.black, letterSpacing: 0.5 },
  saveCtaTextSaved: { fontSize: 15, fontWeight: "700", color: "#4ADE80", letterSpacing: 0.5 },
});

// ─── Main Sheet ───────────────────────────────────────────────────────────────

export function OutfitBuilderSheet({ anchor, visible, onClose, closetItems, userVibe }: OutfitBuilderSheetProps) {
  const insets = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(SHEET_HEIGHT)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  const [phase, setPhase] = useState<"building" | "outfit">("building");
  const [occasion, setOccasion] = useState<Occasion>("Casual");
  const [saved, setSaved] = useState(false);
  const [aiOutfitInsight, setAiOutfitInsight] = useState<{
    whyItWorks: string | null;
    confidenceNote: string | null;
    elevationTip: string | null;
  } | null>(null);

  const outfitInsightMutation = trpc.intelligence.outfitInsight.useMutation();

  const outfit = useMemo(() => {
    if (!anchor) return null;
    return generateOutfit(anchor, closetItems, occasion, userVibe);
  }, [anchor, occasion, userVibe, closetItems]);

  // Reset state when sheet opens
  useEffect(() => {
    if (visible) {
      setPhase("building");
      setOccasion("Casual");
      setSaved(false);
      setAiOutfitInsight(null);
    }
  }, [visible]);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, { toValue: 0, damping: 22, stiffness: 200, useNativeDriver: true }),
        Animated.timing(backdropOpacity, { toValue: 1, duration: 250, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: SHEET_HEIGHT, duration: 280, useNativeDriver: true }),
        Animated.timing(backdropOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  const handleClose = useCallback(() => { hapticLight(); onClose(); }, [onClose]);

  const handleOccasionChange = useCallback((occ: Occasion) => {
    hapticMedium();
    setOccasion(occ);
    setPhase("building");
    setAiOutfitInsight(null);
    setTimeout(() => setPhase("outfit"), 2200);
  }, []);

  // Fire AI outfit insight when outfit is ready
  useEffect(() => {
    if (phase === "outfit" && anchor && outfit && outfit.pieces.length >= 2) {
      outfitInsightMutation.mutate({
        anchorItem: anchor.label,
        selectedPieces: outfit.pieces.filter(p => p.role !== "Anchor").map(p => p.item.label),
        occasion,
        vibe: userVibe,
      }, {
        onSuccess: (data) => setAiOutfitInsight(data),
      });
    }
  }, [phase, anchor?.id, occasion]);

  const handleSave = useCallback(async () => {
    if (!anchor || !outfit || saved) return;
    hapticSuccess();
    await saveLook({
      id: `look_${Date.now()}`,
      name: `${occasion} Look`,
      occasion,
      anchorItemId: anchor.id,
      anchorItemImage: anchor.image,
      anchorItemLabel: anchor.label,
      pieceIds: outfit.pieces.map(p => p.item.id),
      pieceImages: outfit.pieces.map(p => p.item.image),
      confidenceScore: outfit.confidenceScore,
      savedAt: Date.now(),
    });
    setSaved(true);
  }, [anchor, outfit, occasion, saved]);

  if (!anchor) return null;

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={handleClose} statusBarTranslucent>
      {/* Backdrop */}
      <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: "rgba(0,0,0,0.8)", opacity: backdropOpacity }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />
      </Animated.View>

      {/* Sheet */}
      <Animated.View style={[styles.sheet, { transform: [{ translateY: slideAnim }], paddingBottom: insets.bottom + 16 }]}>
        {/* Header */}
        <View style={styles.sheetHeader}>
          <View style={styles.dragHandle} />
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.headerLabel}>OUTFIT BUILDER</Text>
              <Text style={styles.headerTitle} numberOfLines={1}>Built around {anchor.label}</Text>
            </View>
            <Pressable style={({ pressed }) => [styles.closeBtn, pressed && { opacity: 0.6 }]} onPress={handleClose}>
              <Text style={styles.closeBtnText}>✕</Text>
            </Pressable>
          </View>
        </View>

        {/* Content */}
        {phase === "building" ? (
          <BuildingState onComplete={() => setPhase("outfit")} />
        ) : outfit ? (
          <OutfitState
            anchor={anchor}
            pieces={outfit.pieces}
            missing={outfit.missing}
            confidenceScore={outfit.confidenceScore}
            styleNote={outfit.styleNote}
            occasion={occasion}
            onOccasionChange={handleOccasionChange}
            onSave={handleSave}
            saved={saved}
            aiOutfitInsight={aiOutfitInsight}
          />
        ) : null}
      </Animated.View>
    </Modal>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  sheet: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    height: SHEET_HEIGHT, backgroundColor: "#111111",
    borderTopLeftRadius: 24, borderTopRightRadius: 24, overflow: "hidden",
  },
  sheetHeader: { paddingHorizontal: ThreadlySpacing.screenPadding, paddingBottom: 16 },
  dragHandle: { width: 36, height: 4, borderRadius: 2, backgroundColor: "rgba(255,255,255,0.15)", alignSelf: "center", marginTop: 10, marginBottom: 12 },
  headerRow: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" },
  headerLabel: { fontSize: 9, fontWeight: "700", color: ThreadlyColors.roseGold, letterSpacing: 2, marginBottom: 4 },
  headerTitle: { fontSize: 18, fontFamily: "Georgia", color: ThreadlyColors.warmWhite, maxWidth: SCREEN_W - 100 },
  closeBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: "rgba(255,255,255,0.08)", alignItems: "center", justifyContent: "center" },
  closeBtnText: { color: ThreadlyColors.warmWhite, fontSize: 14, fontWeight: "600" },
});
