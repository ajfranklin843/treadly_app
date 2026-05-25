/**
 * Threadly — Go New
 * The signature AI feature. Matches the deck exactly:
 * - Animated build sequence with progress ring
 * - AI-Generated Look with outfit flat lay image
 * - "80% You already own" badge
 * - Missing pieces with product images and deal prices
 */

import { useState, useRef, useEffect, useMemo } from "react";
import { usePersonalization } from '@/lib/personalization';
import { VIBE_OUTFIT_POOL, VIBE_DEAL_POOL, pickVibeImage } from '@/lib/images';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
  Image,
  Pressable,
} from "react-native";
import { useScalePress, useImageFade, useGlowPulse, useStaggerEntrance, hapticLight, hapticSuccess, ANIM } from '@/lib/animations';
import { HeartButton } from '@/components/ui/animated-pressable';
import { LinearGradient } from "expo-linear-gradient";
import { ScreenContainer } from "@/components/screen-container";
import {
  ThreadlyColors,
  ThreadlySpacing,
  ThreadlyRadius,
} from "@/constants/threadly";

const { width } = Dimensions.get("window");

type GoNewState = "idle" | "building" | "ready";

const BASE_BUILD_STEPS = [
  "Analyzing your closet",
  "Detecting current trends",
  "Creating outfit combinations",
  "Identifying missing items",
  "Searching your favorite brands",
  "Finding the best deals",
  "Staying within your budget",
];

// MISSING_PIECES and OUTFIT_IMAGE are now derived dynamically per vibe in the component

export default function GoNewScreen() {
  const p = usePersonalization();
  const [state, setState] = useState<GoNewState>("idle");
  const [selectedOccasion, setSelectedOccasion] = useState<string | null>(null);

  // Vibe-matched outfit image and missing pieces
  const primaryVibe = p.outfits[0]?.vibeTag ?? 'default';
  const outfitImage = pickVibeImage(VIBE_OUTFIT_POOL, primaryVibe, 0);
  const missingPieces = useMemo(() => [
    { id: '1', brand: 'ZARA',  item: 'Tailored Blazer',  original: 129, sale: 78, off: 40, image: pickVibeImage(VIBE_DEAL_POOL, primaryVibe, 0) },
    { id: '2', brand: 'COS',   item: 'Silk Midi Skirt',  original: 95,  sale: 57, off: 40, image: pickVibeImage(VIBE_DEAL_POOL, primaryVibe, 1) },
    { id: '3', brand: 'MANGO', item: 'Leather Loafers',  original: 89,  sale: 54, off: 39, image: pickVibeImage(VIBE_DEAL_POOL, primaryVibe, 2) },
  ], [primaryVibe]);

  const buildSteps = useMemo(() => {
    if (p.isLoading) return BASE_BUILD_STEPS;
    const occasion = selectedOccasion ?? (p.outfits[0]?.occasion ?? 'your next look');
    const brand = p.deals[0]?.brand ?? 'your brands';
    return [
      `Analyzing your closet for ${occasion}`,
      'Detecting trends in your aesthetic',
      'Creating combinations you already own',
      'Identifying missing pieces',
      `Searching ${brand} and more`,
      'Finding the best deals for your budget',
      'Finalizing your personalized look',
    ];
  }, [p.isLoading, selectedOccasion, p.outfits, p.deals]);
  const [completedSteps, setCompletedSteps] = useState(0);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (state === "building") {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.06, duration: 900, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [state]);

  const startGoNew = () => {
    setState("building");
    setCompletedSteps(0);
    progressAnim.setValue(0);
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 3800,
      useNativeDriver: false,
    }).start();
    buildSteps.forEach((_, i) => {
      setTimeout(() => setCompletedSteps(i + 1), (i + 1) * 540);
    });
    setTimeout(() => {
      Animated.timing(fadeAnim, { toValue: 0, duration: 350, useNativeDriver: true }).start(() => {
        setState("ready");
        Animated.timing(fadeAnim, { toValue: 1, duration: 450, useNativeDriver: true }).start();
      });
    }, 4200);
  };

  const reset = () => {
    setState("idle");
    setCompletedSteps(0);
    progressAnim.setValue(0);
    fadeAnim.setValue(1);
  };

  return (
    <ScreenContainer containerClassName="bg-[#0A0A0A]" edges={["top", "left", "right"]}>
      {state === "idle" && <IdleState onStart={startGoNew} goNewLabel={p.goNewLabel} accentColor={p.accentColor} />}
      {state === "building" && (
        <Animated.View style={[{ flex: 1 }, { opacity: fadeAnim }]}>
          <BuildingState
            completedSteps={completedSteps}
            pulseAnim={pulseAnim}
            buildSteps={buildSteps}
          />
        </Animated.View>
      )}
      {state === "ready" && (
        <Animated.View style={[{ flex: 1 }, { opacity: fadeAnim }]}>
          <ReadyState onReset={reset} outfitImage={outfitImage} missingPieces={missingPieces} />
        </Animated.View>
      )}
    </ScreenContainer>
  );
}

// ─── Animated Prompt Chip ──────────────────────────────────────────────────────────

function AnimatedPromptChip({ icon, text, onPress }: { icon: string; text: string; onPress: () => void }) {
  const { scale, onPressIn, onPressOut } = useScalePress(ANIM.chipPressScale);
  return (
    <Pressable onPressIn={onPressIn} onPressOut={onPressOut} onPress={onPress} style={styles.promptCard}>
      <Animated.View style={[{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }, { transform: [{ scale }] }]}>
        <Text style={styles.promptIcon}>{icon}</Text>
        <Text style={styles.promptText}>"{text}"</Text>
      </Animated.View>
    </Pressable>
  );
}

// ─── Go New Start Button ──────────────────────────────────────────────────────────

function GoNewStartButton({ onPress }: { onPress: () => void }) {
  const { scale, onPressIn, onPressOut } = useScalePress(0.97);
  const glowOpacity = useGlowPulse();
  return (
    <Pressable onPressIn={onPressIn} onPressOut={onPressOut} onPress={onPress} style={styles.ctaBtn}>
      <Animated.View style={[{ borderRadius: ThreadlyRadius.xl, overflow: 'hidden' }, { transform: [{ scale }] }]}>
        <LinearGradient
          colors={[ThreadlyColors.roseGold, ThreadlyColors.roseGoldLight]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.ctaBtnGradient}
        >
          <Text style={styles.ctaBtnText}>Go New ✦</Text>
          <Text style={styles.ctaBtnSub}>Build my look now</Text>
        </LinearGradient>
        {/* Pulse glow ring */}
        <Animated.View
          pointerEvents="none"
          style={[StyleSheet.absoluteFill, { borderRadius: ThreadlyRadius.xl, borderWidth: 1.5, borderColor: ThreadlyColors.roseGoldLight, opacity: glowOpacity }]}
        />
      </Animated.View>
    </Pressable>
  );
}

// ─── Idle State ───────────────────────────────────────────────────────────────

function IdleState({ onStart, goNewLabel, accentColor }: { onStart: () => void; goNewLabel: string; accentColor: string }) {
  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.idleHero}>
        <LinearGradient
          colors={["#1A0A06", "#0A0A0A"]}
          style={StyleSheet.absoluteFill}
        />
        <Text style={styles.idleEyebrow}>✦ THE MAGIC FEATURE</Text>
        <Text style={styles.idleTitle}>
          Go <Text style={styles.idleTitleAccent}>New.</Text>
        </Text>
        <Text style={styles.idleSub}>
          Your AI stylist builds fresh, on-trend looks{" "}
          <Text style={[styles.idleSubAccent, { color: accentColor }]}>from what you own first</Text>
          {" — then finds the missing pieces "}
          <Text style={[styles.idleSubAccent, { color: accentColor }]}>for less.</Text>
        </Text>
        <Text style={[styles.idlePersonalized, { color: accentColor }]}>{goNewLabel}</Text>
      </View>

      {/* Prompt chips */}
      <View style={styles.promptGrid}>
        {[
          { text: "Build me a look from what I own first.", icon: "◈" },
          { text: "Only show things from brands I like.", icon: "♡" },
          { text: "Find the cheapest missing pieces.", icon: "◆" },
          { text: "Make me look trendy without wasting money.", icon: "✦" },
        ].map((p, i) => (
          <AnimatedPromptChip key={i} icon={p.icon} text={p.text} onPress={() => hapticLight()} />
        ))}
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        {[
          { value: "80%", label: "avg. owned" },
          { value: "$47", label: "avg. additions" },
          { value: "3 min", label: "avg. time" },
        ].map((s, i) => (
          <View key={i} style={styles.statCard}>
            <Text style={styles.statValue}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* CTA */}
      <GoNewStartButton onPress={() => { hapticSuccess(); onStart(); }} />

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

// ─── Building State ───────────────────────────────────────────────────────────

function BuildingState({
  completedSteps,
  pulseAnim,
  buildSteps,
}: {
  completedSteps: number;
  pulseAnim: Animated.Value;
  buildSteps: string[];
}) {
  const pct = Math.round((completedSteps / buildSteps.length) * 100);

  return (
    <View style={styles.buildingContainer}>
      {/* Progress Orb */}
      <Animated.View style={[styles.orbWrap, { transform: [{ scale: pulseAnim }] }]}>
        <View style={styles.orbOuter}>
          <LinearGradient
            colors={[ThreadlyColors.roseGold, ThreadlyColors.roseGoldLight]}
            style={styles.orbGradient}
          />
          <View style={styles.orbInner}>
            <Text style={styles.orbIcon}>✦</Text>
            <Text style={styles.orbPct}>{pct}%</Text>
          </View>
        </View>
      </Animated.View>

      <Text style={styles.buildingTitle}>GO NEW ✦</Text>
      <Text style={styles.buildingSubtitle}>AI is building your look...</Text>

      {/* Checklist */}
      <View style={styles.stepsList}>
        {buildSteps.map((step, i) => {
          const done = i < completedSteps;
          const active = i === completedSteps;
          return (
            <View key={i} style={[styles.stepRow, active && styles.stepRowActive]}>
              <View style={[styles.stepCheck, done && styles.stepCheckDone]}>
                {done && <Text style={styles.stepCheckIcon}>✓</Text>}
              </View>
              <Text style={[
                styles.stepText,
                done && styles.stepTextDone,
                active && styles.stepTextActive,
              ]}>
                {step}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

// ─── Missing Piece Card (animated) ─────────────────────────────────────────────

type MissingPiece = { id: string; brand: string; item: string; original: number; sale: number; off: number; image: string };

function MissingPieceCard({ piece }: { piece: MissingPiece }) {
  const { scale, onPressIn, onPressOut } = useScalePress(0.97);
  const { imageOpacity, onImageLoad } = useImageFade();
  const glowOpacity = useRef(new Animated.Value(0)).current;
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
      <Animated.View style={[styles.missingCard, { transform: [{ scale }] }]}>
        <Animated.Image source={{ uri: piece.image }} style={[styles.missingImage, { opacity: imageOpacity }]} resizeMode="cover" onLoad={onImageLoad} />
        <View style={styles.missingInfo}>
          <Text style={styles.missingBrand}>{piece.brand}</Text>
          <Text style={styles.missingItem}>{piece.item}</Text>
          <View style={styles.missingPricing}>
            <Text style={styles.missingOriginal}>${piece.original}</Text>
            <Text style={styles.missingSale}>${piece.sale}</Text>
          </View>
        </View>
        <View style={styles.missingOffBadge}>
          <Text style={styles.missingOffText}>-{piece.off}%</Text>
        </View>
        <Animated.View
          pointerEvents="none"
          style={[StyleSheet.absoluteFill, { borderRadius: ThreadlyRadius.lg, borderWidth: 1, borderColor: ThreadlyColors.roseGold, opacity: glowOpacity }]}
        />
      </Animated.View>
    </Pressable>
  );
}

function ReadyActionButton({ label, onPress }: { label: string; onPress: () => void }) {
  const { scale, onPressIn, onPressOut } = useScalePress(0.97);
  return (
    <Pressable onPressIn={onPressIn} onPressOut={onPressOut} onPress={onPress} style={styles.primaryBtn}>
      <Animated.View style={[{ borderRadius: ThreadlyRadius.xl, overflow: 'hidden' }, { transform: [{ scale }] }]}>
        <LinearGradient
          colors={[ThreadlyColors.roseGold, ThreadlyColors.roseGoldLight]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.primaryBtnGradient}
        >
          <Text style={styles.primaryBtnText}>{label}</Text>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

// ─── Ready State ─────────────────────────────────────────────────────────────

function ReadyState({ onReset, outfitImage, missingPieces }: { onReset: () => void; outfitImage: string; missingPieces: Array<{ id: string; brand: string; item: string; original: number; sale: number; off: number; image: string }> }) {
  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.readyHeader}>
        <Text style={styles.readyEyebrow}>YOUR NEW LOOK IS READY ✦</Text>
        <Text style={styles.readyTitle}>GO NEW</Text>
      </View>

      {/* Outfit Card */}
      <View style={styles.outfitCard}>
        <View style={styles.outfitCardTop}>
          <Text style={styles.outfitCardLabel}>AI-GENERATED LOOK</Text>
        </View>

        <View style={styles.outfitImageWrap}>
          <Image
            source={{ uri: outfitImage }}
            style={styles.outfitImage}
            resizeMode="cover"
          />
          <LinearGradient
            colors={["transparent", "rgba(10,10,10,0.5)"]}
            style={StyleSheet.absoluteFill}
          />
          {/* 80% badge */}
          <View style={styles.ownedBadge}>
            <Text style={styles.ownedBadgePct}>80%</Text>
            <Text style={styles.ownedBadgeText}>You already{"\n"}own 80% of{"\n"}this look.</Text>
          </View>
        </View>

        <View style={styles.outfitCardFooter}>
          <Text style={styles.outfitCardFooterIcon}>◈</Text>
          <Text style={styles.outfitCardFooterText}>Built from your closet first.</Text>
        </View>
      </View>

      {/* Missing Pieces */}
      <View style={styles.missingHeader}>
        <Text style={styles.missingHeaderLabel}>MISSING PIECES. FOUND FOR LESS.</Text>
      </View>

      {missingPieces.map(piece => (
        <MissingPieceCard key={piece.id} piece={piece} />
      ))}

      {/* Total */}
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>TOTAL ADDITIONS</Text>
        <Text style={styles.totalAmount}>$84</Text>
      </View>

      {/* Actions */}
      <View style={styles.readyActions}>
        <ReadyActionButton label="Shop Missing Pieces" onPress={() => hapticSuccess()} />
        <Pressable
          style={({ pressed }) => [styles.secondaryBtn, pressed && { opacity: 0.6 }]}
          onPress={() => { hapticLight(); onReset(); }}
        >
          <Text style={styles.secondaryBtnText}>Try Another Look</Text>
        </Pressable>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: ThreadlyColors.black },
  scrollContent: { paddingBottom: 32 },

  // ── Idle ──
  idleHero: {
    paddingHorizontal: ThreadlySpacing.screenPadding,
    paddingTop: 28,
    paddingBottom: 32,
    overflow: "hidden",
  },
  idleEyebrow: {
    fontSize: 10,
    fontWeight: "700",
    color: ThreadlyColors.roseGold,
    letterSpacing: 2,
    marginBottom: 12,
  },
  idleTitle: {
    fontSize: 52,
    fontFamily: "Georgia",
    color: ThreadlyColors.warmWhite,
    lineHeight: 58,
    marginBottom: 16,
  },
  idleTitleAccent: {
    color: ThreadlyColors.roseGoldLight,
    fontStyle: "italic",
  },
  idleSub: {
    fontSize: 15,
    color: ThreadlyColors.warmWhiteMuted,
    lineHeight: 24,
  },
  idleSubAccent: {
    color: ThreadlyColors.roseGoldLight,
    fontStyle: "italic",
  },
  idlePersonalized: {
    fontSize: 13,
    fontStyle: "italic",
    marginTop: 12,
    opacity: 0.8,
  },
  promptGrid: {
    paddingHorizontal: ThreadlySpacing.screenPadding,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 28,
  },
  promptCard: {
    width: (width - ThreadlySpacing.screenPadding * 2 - 10) / 2,
    backgroundColor: ThreadlyColors.charcoal,
    borderRadius: ThreadlyRadius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: ThreadlyColors.charcoalLight,
    gap: 8,
  },
  promptIcon: {
    fontSize: 20,
    color: ThreadlyColors.roseGold,
  },
  promptText: {
    fontSize: 12,
    color: ThreadlyColors.warmWhiteMuted,
    lineHeight: 17,
    fontStyle: "italic",
  },
  statsRow: {
    paddingHorizontal: ThreadlySpacing.screenPadding,
    flexDirection: "row",
    gap: 10,
    marginBottom: 28,
  },
  statCard: {
    flex: 1,
    backgroundColor: ThreadlyColors.charcoal,
    borderRadius: ThreadlyRadius.lg,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: ThreadlyColors.charcoalLight,
  },
  statValue: {
    fontSize: 22,
    fontFamily: "Georgia",
    color: ThreadlyColors.roseGoldLight,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10,
    color: ThreadlyColors.warmWhiteSubtle,
    letterSpacing: 0.5,
  },
  ctaBtn: {
    marginHorizontal: ThreadlySpacing.screenPadding,
    borderRadius: ThreadlyRadius.xl,
    overflow: "hidden",
    shadowColor: ThreadlyColors.roseGold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 8,
  },
  ctaBtnGradient: {
    paddingVertical: 22,
    alignItems: "center",
  },
  ctaBtnText: {
    fontSize: 20,
    fontFamily: "Georgia",
    color: ThreadlyColors.black,
    letterSpacing: 1,
    marginBottom: 2,
  },
  ctaBtnSub: {
    fontSize: 12,
    color: "rgba(10,10,10,0.6)",
    fontWeight: "500",
  },

  // ── Building ──
  buildingContainer: {
    flex: 1,
    backgroundColor: ThreadlyColors.black,
    alignItems: "center",
    paddingTop: 48,
    paddingHorizontal: ThreadlySpacing.screenPadding,
  },
  orbWrap: { marginBottom: 28 },
  orbOuter: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 3,
    borderColor: ThreadlyColors.roseGold,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    shadowColor: ThreadlyColors.roseGold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 24,
    elevation: 12,
  },
  orbGradient: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.12,
  },
  orbInner: { alignItems: "center" },
  orbIcon: {
    fontSize: 16,
    color: ThreadlyColors.roseGold,
    marginBottom: 4,
  },
  orbPct: {
    fontSize: 38,
    fontFamily: "Georgia",
    color: ThreadlyColors.roseGoldLight,
    lineHeight: 42,
  },
  buildingTitle: {
    fontSize: 20,
    fontFamily: "Georgia",
    color: ThreadlyColors.warmWhite,
    letterSpacing: 3,
    marginBottom: 6,
  },
  buildingSubtitle: {
    fontSize: 14,
    color: ThreadlyColors.warmWhiteSubtle,
    fontStyle: "italic",
    marginBottom: 32,
  },
  stepsList: { width: "100%", gap: 8 },
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 11,
    paddingHorizontal: 16,
    backgroundColor: ThreadlyColors.charcoal,
    borderRadius: ThreadlyRadius.md,
    borderWidth: 1,
    borderColor: ThreadlyColors.charcoalLight,
  },
  stepRowActive: {
    borderColor: "rgba(201,149,106,0.45)",
    backgroundColor: "rgba(201,149,106,0.07)",
  },
  stepCheck: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: ThreadlyColors.charcoalLight,
    alignItems: "center",
    justifyContent: "center",
  },
  stepCheckDone: {
    backgroundColor: ThreadlyColors.roseGold,
    borderColor: ThreadlyColors.roseGold,
  },
  stepCheckIcon: { fontSize: 11, color: ThreadlyColors.black, fontWeight: "700" },
  stepText: { fontSize: 13, color: ThreadlyColors.warmWhiteSubtle, flex: 1 },
  stepTextDone: { color: ThreadlyColors.warmWhiteMuted },
  stepTextActive: { color: ThreadlyColors.warmWhite, fontWeight: "600" },

  // ── Ready ──
  readyHeader: {
    paddingHorizontal: ThreadlySpacing.screenPadding,
    paddingTop: 24,
    paddingBottom: 20,
    alignItems: "center",
  },
  readyEyebrow: {
    fontSize: 10,
    fontWeight: "700",
    color: ThreadlyColors.roseGold,
    letterSpacing: 2,
    marginBottom: 8,
  },
  readyTitle: {
    fontSize: 28,
    fontFamily: "Georgia",
    color: ThreadlyColors.warmWhite,
    letterSpacing: 4,
  },
  outfitCard: {
    marginHorizontal: ThreadlySpacing.screenPadding,
    backgroundColor: ThreadlyColors.charcoal,
    borderRadius: ThreadlyRadius.xl,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(201,149,106,0.25)",
    marginBottom: 24,
  },
  outfitCardTop: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: ThreadlyColors.charcoalLight,
  },
  outfitCardLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: ThreadlyColors.roseGold,
    letterSpacing: 2,
  },
  outfitImageWrap: {
    height: 300,
    position: "relative",
  },
  outfitImage: { width: "100%", height: "100%" },
  ownedBadge: {
    position: "absolute",
    right: 14,
    bottom: 14,
    backgroundColor: "rgba(10,10,10,0.88)",
    borderRadius: ThreadlyRadius.lg,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(201,149,106,0.4)",
    minWidth: 80,
  },
  ownedBadgePct: {
    fontSize: 28,
    fontFamily: "Georgia",
    color: ThreadlyColors.roseGoldLight,
    lineHeight: 30,
    marginBottom: 4,
  },
  ownedBadgeText: {
    fontSize: 10,
    color: ThreadlyColors.warmWhiteSubtle,
    textAlign: "center",
    lineHeight: 14,
  },
  outfitCardFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 14,
    borderTopWidth: 1,
    borderTopColor: ThreadlyColors.charcoalLight,
  },
  outfitCardFooterIcon: { fontSize: 16, color: ThreadlyColors.roseGold },
  outfitCardFooterText: {
    fontSize: 12,
    color: ThreadlyColors.warmWhiteSubtle,
    fontStyle: "italic",
  },

  // ── Missing Pieces ──
  missingHeader: {
    paddingHorizontal: ThreadlySpacing.screenPadding,
    marginBottom: 14,
  },
  missingHeaderLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: ThreadlyColors.roseGold,
    letterSpacing: 2,
  },
  missingCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: ThreadlyColors.charcoal,
    borderRadius: ThreadlyRadius.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: ThreadlyColors.charcoalLight,
    marginHorizontal: ThreadlySpacing.screenPadding,
    marginBottom: 10,
  },
  missingImage: { width: 76, height: 76 },
  missingInfo: { flex: 1, padding: 12 },
  missingBrand: {
    fontSize: 8,
    fontWeight: "700",
    color: ThreadlyColors.warmWhiteSubtle,
    letterSpacing: 1.5,
    marginBottom: 3,
  },
  missingItem: {
    fontSize: 14,
    color: ThreadlyColors.warmWhite,
    fontWeight: "600",
    marginBottom: 5,
  },
  missingPricing: { flexDirection: "row", alignItems: "center", gap: 8 },
  missingOriginal: {
    fontSize: 12,
    color: ThreadlyColors.warmWhiteSubtle,
    textDecorationLine: "line-through",
  },
  missingSale: {
    fontSize: 16,
    fontWeight: "700",
    color: ThreadlyColors.success,
  },
  missingOffBadge: {
    marginRight: 14,
    backgroundColor: "rgba(93,191,138,0.15)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: ThreadlyRadius.md,
    borderWidth: 1,
    borderColor: "rgba(93,191,138,0.3)",
  },
  missingOffText: {
    fontSize: 12,
    fontWeight: "700",
    color: ThreadlyColors.success,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: ThreadlySpacing.screenPadding,
    paddingTop: 14,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: ThreadlyColors.charcoalLight,
    marginTop: 4,
    marginHorizontal: ThreadlySpacing.screenPadding,
  },
  totalLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: ThreadlyColors.warmWhiteSubtle,
    letterSpacing: 1.5,
  },
  totalAmount: {
    fontSize: 24,
    fontFamily: "Georgia",
    color: ThreadlyColors.warmWhite,
  },

  // ── Actions ──
  readyActions: {
    paddingHorizontal: ThreadlySpacing.screenPadding,
    gap: 12,
  },
  primaryBtn: {
    borderRadius: ThreadlyRadius.xl,
    overflow: "hidden",
    shadowColor: ThreadlyColors.roseGold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  primaryBtnGradient: {
    paddingVertical: 18,
    alignItems: "center",
  },
  primaryBtnText: {
    fontSize: 16,
    fontFamily: "Georgia",
    color: ThreadlyColors.black,
    letterSpacing: 0.5,
  },
  secondaryBtn: {
    paddingVertical: 16,
    alignItems: "center",
    borderRadius: ThreadlyRadius.xl,
    borderWidth: 1,
    borderColor: "rgba(201,149,106,0.3)",
  },
  secondaryBtnText: {
    fontSize: 14,
    color: ThreadlyColors.roseGoldLight,
    fontWeight: "600",
  },
});
