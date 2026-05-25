/**
 * Threadly — Go New
 * The signature AI feature. Builds fresh looks from your closet first,
 * then finds the missing pieces for less.
 * Emotional outcome: "My AI stylist built me a whole new look — and I already own most of it."
 */

import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
  FlatList,
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

type GoNewState = "idle" | "building" | "ready";

const BUILD_STEPS = [
  { label: "Scanning your closet", icon: "◈" },
  { label: "Detecting current trends", icon: "✦" },
  { label: "Creating outfit combinations", icon: "◆" },
  { label: "Identifying missing items", icon: "○" },
  { label: "Searching your favorite brands", icon: "♡" },
  { label: "Finding the best deals", icon: "◇" },
  { label: "Staying within your budget", icon: "✓" },
];

const GENERATED_LOOKS = [
  {
    id: "1",
    title: "Modern Minimal",
    vibe: "Work-ready, elevated basics",
    ownedPct: 80,
    items: [
      { name: "Camel Blazer", owned: true },
      { name: "Black Crop Top", owned: true },
      { name: "Wide-Leg Trousers", owned: true },
      { name: "Gold Hoop Earrings", owned: true },
      { name: "Black Sunglasses", owned: false, brand: "Amazon", price: 14, original: 22, off: 36 },
    ],
    palette: ["#C4A882", "#1A1A1A", "#FAF7F4", "#C9956A"],
  },
  {
    id: "2",
    title: "Coastal Chic",
    vibe: "Weekend effortless",
    ownedPct: 60,
    items: [
      { name: "White Linen Shirt", owned: true },
      { name: "Straight-Leg Jeans", owned: true },
      { name: "Woven Tote", owned: true },
      { name: "White Sneakers", owned: false, brand: "Target", price: 28, original: 40, off: 30 },
      { name: "Gold Pendant Necklace", owned: false, brand: "Zara", price: 18, original: 30, off: 40 },
    ],
    palette: ["#F5F5F0", "#4A4A5A", "#E8B89A", "#C9956A"],
  },
];

const MISSING_PIECES = [
  { id: "1", brand: "ZARA", item: "Oversized Blazer", original: 89, sale: 42, off: 53, color: "#C4A882", fit: "Matches your style" },
  { id: "2", brand: "TARGET", item: "White Sneakers", original: 40, sale: 28, off: 30, color: "#F5F5F0", fit: "Within your budget" },
  { id: "3", brand: "AMAZON", item: "Gold Hoop Earrings", original: 22, sale: 14, off: 36, color: "#C9956A", fit: "Your preferred brand" },
  { id: "4", brand: "H&M", item: "Linen Trousers", original: 45, sale: 25, off: 44, color: "#8B7355", fit: "Trending this week" },
];

const TOTAL_ADDITIONS = 109;
const TOTAL_SAVINGS = 62;

export default function GoNewScreen() {
  const [state, setState] = useState<GoNewState>("idle");
  const [completedSteps, setCompletedSteps] = useState(0);
  const [activeLook, setActiveLook] = useState(0);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (state === "building") {
      // Pulse animation for the orb
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.08, duration: 800, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
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

    BUILD_STEPS.forEach((_, i) => {
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
    setActiveLook(0);
  };

  return (
    <ScreenContainer containerClassName="bg-[#0A0A0A]" edges={["top", "left", "right"]}>
      {state === "idle" && <IdleState onStart={startGoNew} />}
      {state === "building" && (
        <Animated.View style={[{ flex: 1 }, { opacity: fadeAnim }]}>
          <BuildingState
            completedSteps={completedSteps}
            progressAnim={progressAnim}
            pulseAnim={pulseAnim}
          />
        </Animated.View>
      )}
      {state === "ready" && (
        <Animated.View style={[{ flex: 1 }, { opacity: fadeAnim }]}>
          <ReadyState
            activeLook={activeLook}
            setActiveLook={setActiveLook}
            onReset={reset}
          />
        </Animated.View>
      )}
    </ScreenContainer>
  );
}

// ─── Idle State ───────────────────────────────────────────────────────────────

function IdleState({ onStart }: { onStart: () => void }) {
  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero */}
      <LinearGradient
        colors={["#1A0A06", "#0A0A0A"]}
        style={styles.idleHero}
      >
        <Text style={styles.idleEyebrow}>✦ THE MAGIC FEATURE</Text>
        <Text style={styles.idleTitle}>Go New.</Text>
        <Text style={styles.idleSubtitle}>
          Your AI stylist builds fresh, on-trend looks{"\n"}
          <Text style={styles.idleHighlight}>from what you own first</Text>
          {" — then finds the missing pieces "}
          <Text style={styles.idleHighlight}>for less.</Text>
        </Text>
      </LinearGradient>

      {/* What users say */}
      <View style={styles.quotesSection}>
        {[
          { quote: "Build me a look from what I own first.", icon: "◈" },
          { quote: "Only show things from brands I like.", icon: "♡" },
          { quote: "Find the cheapest missing pieces.", icon: "◆" },
          { quote: "Make me look trendy without wasting money.", icon: "✦" },
        ].map((q, i) => (
          <View key={i} style={styles.quoteCard}>
            <Text style={styles.quoteIcon}>{q.icon}</Text>
            <Text style={styles.quoteText}>"{q.quote}"</Text>
          </View>
        ))}
      </View>

      {/* AI Process */}
      <View style={styles.processCard}>
        <LinearGradient colors={["#1A1410", "#1A1A1A"]} style={StyleSheet.absoluteFill} />
        <View style={styles.processCardBorder} />
        <Text style={styles.processTitle}>What your AI does in seconds:</Text>
        <View style={styles.processList}>
          {BUILD_STEPS.map((step, i) => (
            <View key={i} style={styles.processStep}>
              <Text style={styles.processStepIcon}>{step.icon}</Text>
              <Text style={styles.processStepText}>{step.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        {[
          { value: "80%", label: "avg. owned" },
          { value: "$47", label: "avg. additions" },
          { value: "3 min", label: "avg. time" },
        ].map((stat, i) => (
          <View key={i} style={styles.statCard}>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* CTA */}
      <TouchableOpacity style={styles.ctaBtn} activeOpacity={0.85} onPress={onStart}>
        <LinearGradient
          colors={[ThreadlyColors.roseGold, ThreadlyColors.roseGoldLight]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.ctaBtnGradient}
        >
          <Text style={styles.ctaBtnText}>Go New ✦</Text>
          <Text style={styles.ctaBtnSub}>Build my look now</Text>
        </LinearGradient>
      </TouchableOpacity>

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

// ─── Building State ───────────────────────────────────────────────────────────

function BuildingState({
  completedSteps,
  progressAnim,
  pulseAnim,
}: {
  completedSteps: number;
  progressAnim: Animated.Value;
  pulseAnim: Animated.Value;
}) {
  const pct = Math.round((completedSteps / BUILD_STEPS.length) * 100);

  return (
    <View style={styles.buildingContainer}>
      {/* Orb */}
      <Animated.View style={[styles.buildingOrb, { transform: [{ scale: pulseAnim }] }]}>
        <LinearGradient
          colors={[ThreadlyColors.roseGold, ThreadlyColors.roseGoldLight]}
          style={styles.buildingOrbInner}
        >
          <Text style={styles.buildingOrbPct}>{pct}%</Text>
          <Text style={styles.buildingOrbLabel}>building</Text>
        </LinearGradient>
      </Animated.View>

      <Text style={styles.buildingTitle}>GO NEW ✦</Text>
      <Text style={styles.buildingSubtitle}>AI is crafting your look...</Text>

      {/* Steps */}
      <View style={styles.buildingSteps}>
        {BUILD_STEPS.map((step, i) => {
          const done = i < completedSteps;
          const active = i === completedSteps;
          return (
            <View key={i} style={styles.buildingStep}>
              <Text style={[
                styles.buildingStepCheck,
                done && styles.buildingStepDone,
                active && styles.buildingStepActive,
              ]}>
                {done ? "✓" : step.icon}
              </Text>
              <Text style={[
                styles.buildingStepText,
                done && styles.buildingStepTextDone,
                active && styles.buildingStepTextActive,
              ]}>
                {step.label}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

// ─── Ready State ─────────────────────────────────────────────────────────────

function ReadyState({
  activeLook,
  setActiveLook,
  onReset,
}: {
  activeLook: number;
  setActiveLook: (i: number) => void;
  onReset: () => void;
}) {
  const look = GENERATED_LOOKS[activeLook];

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Ready Banner */}
      <LinearGradient colors={["#2A1408", "#0A0A0A"]} style={styles.readyBanner}>
        <Text style={styles.readyEyebrow}>YOUR NEW LOOK IS READY ✦</Text>
        <Text style={styles.readyTitle}>We built {GENERATED_LOOKS.length} looks{"\n"}from your closet.</Text>
      </LinearGradient>

      {/* Look Selector */}
      <View style={styles.lookSelector}>
        {GENERATED_LOOKS.map((l, i) => (
          <TouchableOpacity
            key={l.id}
            style={[styles.lookTab, activeLook === i && styles.lookTabActive]}
            onPress={() => setActiveLook(i)}
            activeOpacity={0.7}
          >
            <Text style={[styles.lookTabText, activeLook === i && styles.lookTabTextActive]}>
              {l.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Generated Look Card */}
      <View style={styles.lookCard}>
        <LinearGradient colors={["#1E1A14", "#252018"]} style={StyleSheet.absoluteFill} />
        <View style={styles.lookCardBorder} />

        {/* Header */}
        <View style={styles.lookCardHeader}>
          <View>
            <Text style={styles.lookCardEyebrow}>AI-GENERATED LOOK</Text>
            <Text style={styles.lookCardTitle}>{look.title}</Text>
            <Text style={styles.lookCardVibe}>{look.vibe}</Text>
          </View>
          <View style={styles.ownedCircle}>
            <Text style={styles.ownedCirclePct}>{look.ownedPct}%</Text>
            <Text style={styles.ownedCircleLabel}>you{"\n"}own</Text>
          </View>
        </View>

        {/* Color Palette */}
        <View style={styles.lookPalette}>
          {look.palette.map((c, i) => (
            <View key={i} style={[styles.lookPaletteDot, { backgroundColor: c }]} />
          ))}
        </View>

        {/* Items */}
        <View style={styles.lookItems}>
          {look.items.map((item, i) => (
            <View key={i} style={styles.lookItem}>
              <View style={[
                styles.lookItemDot,
                { backgroundColor: item.owned ? ThreadlyColors.roseGold : ThreadlyColors.charcoalLight },
              ]} />
              <Text style={styles.lookItemName}>{item.name}</Text>
              <Text style={[
                styles.lookItemStatus,
                { color: item.owned ? ThreadlyColors.warmWhiteSubtle : ThreadlyColors.roseGoldLight },
              ]}>
                {item.owned ? "✓ Owned" : `${(item as any).brand} $${(item as any).price}`}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.lookCardFooter}>
          <Text style={styles.lookCardFooterText}>◈ Built from your closet first.</Text>
        </View>
      </View>

      {/* Missing Pieces */}
      <View style={styles.missingSectionHeader}>
        <Text style={styles.missingSectionTitle}>MISSING PIECES. FOUND FOR LESS.</Text>
        <View style={styles.savingsBadge}>
          <Text style={styles.savingsBadgeText}>Save ${TOTAL_SAVINGS}</Text>
        </View>
      </View>

      <View style={styles.missingList}>
        {MISSING_PIECES.map(piece => (
          <TouchableOpacity key={piece.id} style={styles.missingCard} activeOpacity={0.85}>
            <View style={[styles.missingColorBar, { backgroundColor: piece.color }]} />
            <View style={styles.missingInfo}>
              <Text style={styles.missingBrand}>{piece.brand}</Text>
              <Text style={styles.missingItem}>{piece.item}</Text>
              <Text style={styles.missingFit}>{piece.fit}</Text>
              <View style={styles.missingPricing}>
                <Text style={styles.missingOriginal}>${piece.original}</Text>
                <Text style={styles.missingSale}>${piece.sale}</Text>
              </View>
            </View>
            <View style={styles.missingOff}>
              <Text style={styles.missingOffText}>-{piece.off}%</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Total Row */}
      <View style={styles.totalRow}>
        <View>
          <Text style={styles.totalLabel}>TOTAL ADDITIONS</Text>
          <Text style={styles.totalSavings}>You save ${TOTAL_SAVINGS} vs retail</Text>
        </View>
        <Text style={styles.totalAmount}>${TOTAL_ADDITIONS}</Text>
      </View>

      {/* Actions */}
      <View style={styles.readyActions}>
        <TouchableOpacity style={styles.shopBtn} activeOpacity={0.85}>
          <LinearGradient
            colors={[ThreadlyColors.roseGold, ThreadlyColors.roseGoldLight]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.shopBtnGradient}
          >
            <Text style={styles.shopBtnText}>Shop the Look</Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveBtn} activeOpacity={0.7}>
          <Text style={styles.saveBtnText}>♡  Save Look</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tryAgainBtn} activeOpacity={0.6} onPress={onReset}>
          <Text style={styles.tryAgainText}>Try a different look</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 24 },

  // Idle
  idleHero: {
    paddingHorizontal: ThreadlySpacing.screenPadding,
    paddingTop: 28,
    paddingBottom: 32,
  },
  idleEyebrow: {
    fontSize: 10,
    fontWeight: "700",
    color: ThreadlyColors.roseGold,
    letterSpacing: 2.5,
    marginBottom: 10,
  },
  idleTitle: {
    fontSize: 56,
    fontFamily: "Georgia",
    color: ThreadlyColors.warmWhite,
    lineHeight: 60,
    marginBottom: 16,
  },
  idleSubtitle: {
    fontSize: 16,
    color: ThreadlyColors.warmWhiteMuted,
    lineHeight: 26,
  },
  idleHighlight: {
    color: ThreadlyColors.roseGoldLight,
    fontStyle: "italic",
  },

  quotesSection: {
    paddingHorizontal: ThreadlySpacing.screenPadding,
    gap: 8,
    marginBottom: 24,
  },
  quoteCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: ThreadlyColors.charcoal,
    borderRadius: ThreadlyRadius.lg,
    padding: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: ThreadlyColors.charcoalLight,
  },
  quoteIcon: { fontSize: 14, color: ThreadlyColors.roseGoldDim, width: 18 },
  quoteText: {
    fontSize: 13,
    color: ThreadlyColors.warmWhiteMuted,
    fontStyle: "italic",
    flex: 1,
    lineHeight: 19,
  },

  processCard: {
    marginHorizontal: ThreadlySpacing.screenPadding,
    borderRadius: ThreadlyRadius.xl,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(201,149,106,0.15)",
    overflow: "hidden",
    marginBottom: 20,
  },
  processCardBorder: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: ThreadlyColors.roseGold,
    opacity: 0.3,
  },
  processTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: ThreadlyColors.warmWhite,
    marginBottom: 14,
    letterSpacing: 0.3,
  },
  processList: { gap: 10 },
  processStep: { flexDirection: "row", alignItems: "center", gap: 12 },
  processStepIcon: { fontSize: 12, color: ThreadlyColors.roseGoldDim, width: 16 },
  processStepText: { fontSize: 13, color: ThreadlyColors.warmWhiteMuted },

  statsRow: {
    flexDirection: "row",
    paddingHorizontal: ThreadlySpacing.screenPadding,
    gap: 10,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: ThreadlyColors.charcoal,
    borderRadius: ThreadlyRadius.lg,
    padding: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: ThreadlyColors.charcoalLight,
  },
  statValue: {
    fontSize: 22,
    fontFamily: "Georgia",
    color: ThreadlyColors.roseGoldLight,
    marginBottom: 3,
  },
  statLabel: {
    fontSize: 10,
    color: ThreadlyColors.warmWhiteSubtle,
    letterSpacing: 0.5,
    textAlign: "center",
  },

  ctaBtn: {
    marginHorizontal: ThreadlySpacing.screenPadding,
    borderRadius: ThreadlyRadius.xl,
    overflow: "hidden",
    ...ThreadlyShadow.roseGlow,
  },
  ctaBtnGradient: {
    paddingVertical: 20,
    alignItems: "center",
  },
  ctaBtnText: {
    fontSize: 22,
    fontFamily: "Georgia",
    color: ThreadlyColors.black,
    marginBottom: 4,
  },
  ctaBtnSub: {
    fontSize: 12,
    color: "rgba(10,10,10,0.6)",
    letterSpacing: 0.5,
  },

  // Building
  buildingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: ThreadlySpacing.screenPadding,
    gap: 8,
  },
  buildingOrb: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 24,
    ...ThreadlyShadow.roseGlow,
  },
  buildingOrbInner: {
    flex: 1,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  buildingOrbPct: {
    fontSize: 28,
    fontFamily: "Georgia",
    color: ThreadlyColors.black,
    lineHeight: 30,
  },
  buildingOrbLabel: {
    fontSize: 10,
    color: "rgba(10,10,10,0.65)",
    letterSpacing: 1,
  },
  buildingTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: ThreadlyColors.roseGold,
    letterSpacing: 3,
    marginBottom: 4,
  },
  buildingSubtitle: {
    fontSize: 15,
    color: ThreadlyColors.warmWhiteMuted,
    marginBottom: 28,
  },
  buildingSteps: { width: "100%", gap: 10 },
  buildingStep: { flexDirection: "row", alignItems: "center", gap: 12 },
  buildingStepCheck: {
    fontSize: 13,
    color: ThreadlyColors.warmWhiteSubtle,
    width: 20,
    textAlign: "center",
  },
  buildingStepDone: { color: ThreadlyColors.success },
  buildingStepActive: { color: ThreadlyColors.roseGold },
  buildingStepText: { fontSize: 13, color: ThreadlyColors.warmWhiteSubtle },
  buildingStepTextDone: { color: ThreadlyColors.warmWhiteMuted },
  buildingStepTextActive: { color: ThreadlyColors.warmWhite, fontWeight: "600" },

  // Ready
  readyBanner: {
    paddingHorizontal: ThreadlySpacing.screenPadding,
    paddingTop: 28,
    paddingBottom: 24,
  },
  readyEyebrow: {
    fontSize: 10,
    fontWeight: "700",
    color: ThreadlyColors.roseGold,
    letterSpacing: 2.5,
    marginBottom: 10,
  },
  readyTitle: {
    fontSize: 26,
    fontFamily: "Georgia",
    color: ThreadlyColors.warmWhite,
    lineHeight: 34,
  },

  lookSelector: {
    flexDirection: "row",
    paddingHorizontal: ThreadlySpacing.screenPadding,
    gap: 10,
    marginBottom: 16,
  },
  lookTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: ThreadlyRadius.pill,
    backgroundColor: ThreadlyColors.charcoal,
    borderWidth: 1,
    borderColor: ThreadlyColors.charcoalLight,
  },
  lookTabActive: {
    backgroundColor: "rgba(201,149,106,0.15)",
    borderColor: ThreadlyColors.roseGold,
  },
  lookTabText: { fontSize: 13, color: ThreadlyColors.warmWhiteSubtle, fontWeight: "600" },
  lookTabTextActive: { color: ThreadlyColors.roseGoldLight },

  lookCard: {
    marginHorizontal: ThreadlySpacing.screenPadding,
    borderRadius: ThreadlyRadius.xl,
    overflow: "hidden",
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(201,149,106,0.2)",
    marginBottom: 24,
  },
  lookCardBorder: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: ThreadlyColors.roseGold,
    opacity: 0.5,
  },
  lookCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  lookCardEyebrow: {
    fontSize: 9,
    fontWeight: "700",
    color: ThreadlyColors.roseGold,
    letterSpacing: 2,
    marginBottom: 5,
  },
  lookCardTitle: {
    fontSize: 22,
    fontFamily: "Georgia",
    color: ThreadlyColors.warmWhite,
    marginBottom: 3,
  },
  lookCardVibe: { fontSize: 12, color: ThreadlyColors.warmWhiteSubtle, fontStyle: "italic" },
  ownedCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(201,149,106,0.12)",
    borderWidth: 2,
    borderColor: ThreadlyColors.roseGold,
    alignItems: "center",
    justifyContent: "center",
  },
  ownedCirclePct: {
    fontSize: 18,
    fontFamily: "Georgia",
    color: ThreadlyColors.roseGoldLight,
    lineHeight: 20,
  },
  ownedCircleLabel: {
    fontSize: 9,
    color: ThreadlyColors.warmWhiteSubtle,
    textAlign: "center",
    lineHeight: 12,
  },

  lookPalette: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 16,
  },
  lookPaletteDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.1)",
  },

  lookItems: { gap: 8, marginBottom: 16 },
  lookItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  lookItemDot: { width: 6, height: 6, borderRadius: 3 },
  lookItemName: { flex: 1, fontSize: 14, color: ThreadlyColors.warmWhiteMuted },
  lookItemStatus: { fontSize: 12, fontWeight: "600" },

  lookCardFooter: {
    borderTopWidth: 1,
    borderTopColor: ThreadlyColors.charcoalLight,
    paddingTop: 12,
  },
  lookCardFooterText: {
    fontSize: 12,
    color: ThreadlyColors.roseGoldDim,
    fontStyle: "italic",
  },

  // Missing pieces
  missingSectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: ThreadlySpacing.screenPadding,
    marginBottom: 14,
  },
  missingSectionTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: ThreadlyColors.warmWhiteSubtle,
    letterSpacing: 1.5,
  },
  savingsBadge: {
    backgroundColor: "rgba(74,155,111,0.15)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: ThreadlyRadius.pill,
    borderWidth: 1,
    borderColor: "rgba(74,155,111,0.3)",
  },
  savingsBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: ThreadlyColors.success,
  },

  missingList: {
    paddingHorizontal: ThreadlySpacing.screenPadding,
    gap: 10,
    marginBottom: 20,
  },
  missingCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: ThreadlyColors.charcoal,
    borderRadius: ThreadlyRadius.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: ThreadlyColors.charcoalLight,
  },
  missingColorBar: { width: 5, alignSelf: "stretch" },
  missingInfo: { flex: 1, padding: 14 },
  missingBrand: {
    fontSize: 9,
    fontWeight: "700",
    color: ThreadlyColors.warmWhiteSubtle,
    letterSpacing: 1.5,
    marginBottom: 3,
  },
  missingItem: {
    fontSize: 14,
    color: ThreadlyColors.warmWhite,
    fontWeight: "600",
    marginBottom: 3,
  },
  missingFit: {
    fontSize: 11,
    color: ThreadlyColors.roseGoldDim,
    fontStyle: "italic",
    marginBottom: 6,
  },
  missingPricing: { flexDirection: "row", alignItems: "center", gap: 8 },
  missingOriginal: {
    fontSize: 12,
    color: ThreadlyColors.warmWhiteSubtle,
    textDecorationLine: "line-through",
  },
  missingSale: { fontSize: 16, fontWeight: "700", color: ThreadlyColors.success },
  missingOff: {
    marginRight: 14,
    backgroundColor: "rgba(74,155,111,0.12)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: ThreadlyRadius.md,
    borderWidth: 1,
    borderColor: "rgba(74,155,111,0.25)",
  },
  missingOffText: { fontSize: 13, fontWeight: "700", color: ThreadlyColors.success },

  // Total
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: ThreadlySpacing.screenPadding,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: ThreadlyColors.charcoalLight,
    marginBottom: 24,
  },
  totalLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: ThreadlyColors.warmWhiteSubtle,
    letterSpacing: 1.5,
    marginBottom: 3,
  },
  totalSavings: { fontSize: 11, color: ThreadlyColors.success },
  totalAmount: {
    fontSize: 32,
    fontFamily: "Georgia",
    color: ThreadlyColors.warmWhite,
  },

  // Actions
  readyActions: {
    paddingHorizontal: ThreadlySpacing.screenPadding,
    gap: 10,
  },
  shopBtn: {
    borderRadius: ThreadlyRadius.xl,
    overflow: "hidden",
    ...ThreadlyShadow.roseGlow,
  },
  shopBtnGradient: {
    paddingVertical: 18,
    alignItems: "center",
  },
  shopBtnText: {
    fontSize: 17,
    fontFamily: "Georgia",
    color: ThreadlyColors.black,
  },
  saveBtn: {
    paddingVertical: 16,
    alignItems: "center",
    backgroundColor: ThreadlyColors.charcoal,
    borderRadius: ThreadlyRadius.xl,
    borderWidth: 1,
    borderColor: "rgba(201,149,106,0.3)",
  },
  saveBtnText: {
    fontSize: 15,
    color: ThreadlyColors.roseGoldLight,
    fontWeight: "600",
  },
  tryAgainBtn: {
    paddingVertical: 14,
    alignItems: "center",
  },
  tryAgainText: {
    fontSize: 13,
    color: ThreadlyColors.warmWhiteSubtle,
  },
});
