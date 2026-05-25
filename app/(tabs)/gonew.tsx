/**
 * Threadly — Go New Screen
 * The signature AI feature: builds fresh looks from your closet, finds missing pieces for less.
 * Emotional outcome: "Your AI stylist builds fresh, on-trend looks from what you own first."
 */

import { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ScreenContainer } from "@/components/screen-container";
import { ThreadlyColors, ThreadlyRadius, ThreadlySpacing, ThreadlyShadow } from "@/constants/threadly";

const { width } = Dimensions.get("window");

type GoNewState = "idle" | "building" | "ready";

const BUILD_STEPS = [
  "Analyzing your closet",
  "Detecting current trends",
  "Creating outfit combinations",
  "Identifying missing items",
  "Searching your favorite brands",
  "Finding the best deals",
  "Staying within your budget",
];

const GENERATED_LOOK = {
  title: "Modern Minimal",
  ownedPercent: 80,
  items: [
    { name: "Camel Blazer", owned: true, brand: "Your Closet" },
    { name: "Black Crop Top", owned: true, brand: "Your Closet" },
    { name: "Wide-Leg Trousers", owned: true, brand: "Your Closet" },
    { name: "Gold Hoop Earrings", owned: true, brand: "Your Closet" },
    { name: "Black Sunglasses", owned: false, brand: "Amazon", price: 14, original: 22, off: 36 },
  ],
};

const MISSING_PIECES = [
  { id: "1", brand: "ZARA", item: "Oversized Blazer", original: 89, sale: 42, off: 53, color: "#C4A882" },
  { id: "2", brand: "TARGET", item: "White Sneakers", original: 40, sale: 28, off: 30, color: "#F5F5F0" },
  { id: "3", brand: "AMAZON", item: "Gold Hoop Earrings", original: 22, sale: 14, off: 36, color: "#C9956A" },
];

const TOTAL_ADDITIONS = 84;

export default function GoNewScreen() {
  const [state, setState] = useState<GoNewState>("idle");
  const [completedSteps, setCompletedSteps] = useState<number>(0);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const startGoNew = () => {
    setState("building");
    setCompletedSteps(0);

    // Animate progress ring
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 3500,
      useNativeDriver: false,
    }).start();

    // Reveal steps one by one
    BUILD_STEPS.forEach((_, i) => {
      setTimeout(() => {
        setCompletedSteps(i + 1);
      }, (i + 1) * 500);
    });

    // Transition to ready state
    setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => {
        setState("ready");
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      });
    }, 4000);
  };

  const reset = () => {
    setState("idle");
    setCompletedSteps(0);
    progressAnim.setValue(0);
    fadeAnim.setValue(1);
  };

  return (
    <ScreenContainer containerClassName="bg-[#0A0A0A]" edges={["top", "left", "right"]}>
      <LinearGradient colors={["#0A0A0A", "#1A0A0A"]} style={StyleSheet.absoluteFill} />

      {state === "idle" && <IdleState onStart={startGoNew} />}
      {state === "building" && (
        <Animated.View style={[{ flex: 1 }, { opacity: fadeAnim }]}>
          <BuildingState
            completedSteps={completedSteps}
            progressAnim={progressAnim}
          />
        </Animated.View>
      )}
      {state === "ready" && (
        <Animated.View style={[{ flex: 1 }, { opacity: fadeAnim }]}>
          <ReadyState onReset={reset} />
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
      {/* Header */}
      <View style={styles.idleHeader}>
        <Text style={styles.magicLabel}>✦ THE MAGIC FEATURE</Text>
        <Text style={styles.idleTitle}>Go New.</Text>
        <Text style={styles.idleSubtitle}>
          Your AI stylist builds fresh, on-trend looks{"\n"}
          <Text style={styles.idleHighlight}>from what you own first</Text>
          {" — then finds the missing pieces "}
          <Text style={styles.idleHighlight}>(for less).</Text>
        </Text>
      </View>

      {/* Core Experience Cards */}
      <View style={styles.coreCards}>
        {[
          { quote: "Build me a look from what I own first.", icon: "◈" },
          { quote: "Only show things from brands I like.", icon: "♡" },
          { quote: "Find the cheapest missing pieces.", icon: "◆" },
          { quote: "Make me look trendy without wasting money.", icon: "✦" },
        ].map((card, i) => (
          <View key={i} style={styles.coreCard}>
            <Text style={styles.coreCardIcon}>{card.icon}</Text>
            <Text style={styles.coreCardQuote}>"{card.quote}"</Text>
          </View>
        ))}
      </View>

      {/* What AI Does */}
      <View style={styles.aiStepsCard}>
        <Text style={styles.aiStepsTitle}>What your AI does:</Text>
        <View style={styles.aiStepsList}>
          {[
            "Analyzes your current closet",
            "Detects current trends",
            "Creates fresh outfit combinations",
            "Identifies missing items",
            "Searches your preferred brands",
            "Finds best deals online",
            "Stays within your budget",
          ].map((step, i) => (
            <View key={i} style={styles.aiStep}>
              <Text style={styles.aiStepDot}>◆</Text>
              <Text style={styles.aiStepText}>{step}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* CTA */}
      <TouchableOpacity style={styles.goNewBtn} activeOpacity={0.85} onPress={onStart}>
        <LinearGradient
          colors={[ThreadlyColors.roseGold, ThreadlyColors.roseGoldLight]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.goNewBtnGradient}
        >
          <Text style={styles.goNewBtnText}>Go New ✦</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Key Insight */}
      <View style={styles.insightCard}>
        <Text style={styles.insightText}>
          The app does not just organize clothes.{"\n"}
          <Text style={styles.insightHighlight}>It helps you reinvent your style affordably.</Text>
        </Text>
      </View>

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

// ─── Building State ───────────────────────────────────────────────────────────

function BuildingState({
  completedSteps,
  progressAnim,
}: {
  completedSteps: number;
  progressAnim: Animated.Value;
}) {
  const progressPercent = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.buildingContainer}>
      <Text style={styles.buildingTitle}>GO NEW ✦</Text>
      <Text style={styles.buildingSubtitle}>AI is building your look...</Text>

      {/* Progress Ring (simplified as a progress bar) */}
      <View style={styles.progressRing}>
        <LinearGradient
          colors={[ThreadlyColors.roseGold, ThreadlyColors.roseGoldLight]}
          style={styles.progressRingInner}
        >
          <Text style={styles.progressPercent}>
            {Math.round(completedSteps / BUILD_STEPS.length * 100)}%
          </Text>
        </LinearGradient>
      </View>

      {/* Steps */}
      <View style={styles.buildSteps}>
        {BUILD_STEPS.map((step, i) => (
          <View key={i} style={styles.buildStep}>
            <Text style={[
              styles.buildStepCheck,
              i < completedSteps ? styles.buildStepCheckDone : styles.buildStepCheckPending,
            ]}>
              {i < completedSteps ? "✓" : "○"}
            </Text>
            <Text style={[
              styles.buildStepText,
              i < completedSteps ? styles.buildStepTextDone : styles.buildStepTextPending,
            ]}>
              {step}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// ─── Ready State ─────────────────────────────────────────────────────────────

function ReadyState({ onReset }: { onReset: () => void }) {
  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Ready Banner */}
      <View style={styles.readyBanner}>
        <LinearGradient
          colors={["#2A1A0A", "#1A0A0A"]}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.readyBannerBorder} />
        <Text style={styles.readyLabel}>YOUR NEW LOOK IS READY ✦</Text>
      </View>

      {/* AI Generated Look */}
      <View style={styles.generatedLookCard}>
        <LinearGradient
          colors={["#1E1A16", "#2A2218"]}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.generatedLookBorder} />

        <View style={styles.generatedLookHeader}>
          <View>
            <Text style={styles.aiGeneratedLabel}>AI-GENERATED LOOK</Text>
            <Text style={styles.generatedLookTitle}>{GENERATED_LOOK.title}</Text>
          </View>
          <View style={styles.ownedCircle}>
            <Text style={styles.ownedCirclePercent}>{GENERATED_LOOK.ownedPercent}%</Text>
            <Text style={styles.ownedCircleLabel}>you own</Text>
          </View>
        </View>

        {/* Items */}
        <View style={styles.generatedItems}>
          {GENERATED_LOOK.items.map((item, i) => (
            <View key={i} style={styles.generatedItem}>
              <View style={[styles.generatedItemDot, { backgroundColor: item.owned ? ThreadlyColors.roseGold : ThreadlyColors.charcoalLight }]} />
              <Text style={styles.generatedItemName}>{item.name}</Text>
              <Text style={[styles.generatedItemBrand, { color: item.owned ? ThreadlyColors.warmWhiteSubtle : ThreadlyColors.roseGold }]}>
                {item.owned ? "✓ Owned" : item.brand}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.builtFromCloset}>
          <Text style={styles.builtFromClosetText}>◈ Built from your closet first.</Text>
        </View>
      </View>

      {/* Missing Pieces */}
      <View style={styles.missingHeader}>
        <Text style={styles.missingSectionTitle}>MISSING PIECES. FOUND FOR LESS.</Text>
      </View>

      <View style={styles.missingList}>
        {MISSING_PIECES.map(piece => (
          <TouchableOpacity key={piece.id} style={styles.missingCard} activeOpacity={0.85}>
            <View style={[styles.missingColorBar, { backgroundColor: piece.color }]} />
            <View style={styles.missingInfo}>
              <Text style={styles.missingBrand}>{piece.brand}</Text>
              <Text style={styles.missingItem}>{piece.item}</Text>
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

      {/* Total */}
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>TOTAL ADDITIONS</Text>
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
        <TouchableOpacity style={styles.tryAgainBtn} activeOpacity={0.7} onPress={onReset}>
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
  idleHeader: {
    paddingHorizontal: ThreadlySpacing.screenPadding,
    paddingTop: 24,
    paddingBottom: 28,
  },
  magicLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: ThreadlyColors.roseGold,
    letterSpacing: 2,
    marginBottom: 8,
  },
  idleTitle: {
    fontSize: 52,
    fontFamily: "Georgia",
    color: ThreadlyColors.warmWhite,
    lineHeight: 56,
    marginBottom: 14,
  },
  idleSubtitle: {
    fontSize: 16,
    color: ThreadlyColors.warmWhiteMuted,
    lineHeight: 24,
  },
  idleHighlight: {
    color: ThreadlyColors.roseGoldLight,
    fontStyle: "italic",
  },

  coreCards: {
    paddingHorizontal: ThreadlySpacing.screenPadding,
    gap: 8,
    marginBottom: 24,
  },
  coreCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: ThreadlyColors.charcoal,
    borderRadius: ThreadlyRadius.lg,
    padding: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: ThreadlyColors.charcoalLight,
  },
  coreCardIcon: { fontSize: 14, color: ThreadlyColors.roseGoldDim },
  coreCardQuote: { fontSize: 13, color: ThreadlyColors.warmWhiteMuted, fontStyle: "italic", flex: 1 },

  aiStepsCard: {
    marginHorizontal: ThreadlySpacing.screenPadding,
    backgroundColor: ThreadlyColors.charcoal,
    borderRadius: ThreadlyRadius.xl,
    padding: 18,
    borderWidth: 1,
    borderColor: ThreadlyColors.charcoalLight,
    marginBottom: 24,
  },
  aiStepsTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: ThreadlyColors.warmWhiteMuted,
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  aiStepsList: { gap: 8 },
  aiStep: { flexDirection: "row", alignItems: "center", gap: 10 },
  aiStepDot: { fontSize: 8, color: ThreadlyColors.roseGoldDim },
  aiStepText: { fontSize: 13, color: ThreadlyColors.warmWhiteMuted },

  goNewBtn: {
    marginHorizontal: ThreadlySpacing.screenPadding,
    borderRadius: ThreadlyRadius.pill,
    overflow: "hidden",
    marginBottom: 20,
    ...ThreadlyShadow.roseGlow,
  },
  goNewBtnGradient: { paddingVertical: 20, alignItems: "center" },
  goNewBtnText: { fontSize: 18, fontWeight: "700", color: ThreadlyColors.warmWhite, letterSpacing: 0.5 },

  insightCard: {
    marginHorizontal: ThreadlySpacing.screenPadding,
    backgroundColor: ThreadlyColors.blushDark,
    borderRadius: ThreadlyRadius.lg,
    padding: 18,
    borderWidth: 1,
    borderColor: ThreadlyColors.roseGoldDim,
  },
  insightText: {
    fontSize: 14,
    color: ThreadlyColors.warmWhiteMuted,
    lineHeight: 21,
    textAlign: "center",
  },
  insightHighlight: { color: ThreadlyColors.roseGoldLight, fontStyle: "italic" },

  // Building
  buildingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  buildingTitle: {
    fontSize: 28,
    fontFamily: "Georgia",
    color: ThreadlyColors.warmWhite,
    marginBottom: 6,
    textAlign: "center",
  },
  buildingSubtitle: {
    fontSize: 14,
    color: ThreadlyColors.warmWhiteMuted,
    marginBottom: 36,
    textAlign: "center",
  },
  progressRing: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: ThreadlyColors.roseGoldDim,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 36,
    overflow: "hidden",
  },
  progressRingInner: {
    width: 108,
    height: 108,
    borderRadius: 54,
    alignItems: "center",
    justifyContent: "center",
  },
  progressPercent: {
    fontSize: 28,
    fontWeight: "700",
    color: ThreadlyColors.warmWhite,
  },
  buildSteps: { gap: 10, width: "100%" },
  buildStep: { flexDirection: "row", alignItems: "center", gap: 12 },
  buildStepCheck: { fontSize: 13, width: 18 },
  buildStepCheckDone: { color: ThreadlyColors.roseGold },
  buildStepCheckPending: { color: ThreadlyColors.charcoalLight },
  buildStepText: { fontSize: 14 },
  buildStepTextDone: { color: ThreadlyColors.warmWhiteMuted },
  buildStepTextPending: { color: ThreadlyColors.charcoalLight },

  // Ready
  readyBanner: {
    marginHorizontal: ThreadlySpacing.screenPadding,
    marginTop: 20,
    borderRadius: ThreadlyRadius.lg,
    overflow: "hidden",
    position: "relative",
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 20,
  },
  readyBannerBorder: {
    position: "absolute",
    inset: 0,
    borderRadius: ThreadlyRadius.lg,
    borderWidth: 1,
    borderColor: "rgba(201,149,106,0.4)",
  },
  readyLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: ThreadlyColors.roseGoldLight,
    letterSpacing: 2,
  },

  generatedLookCard: {
    marginHorizontal: ThreadlySpacing.screenPadding,
    borderRadius: ThreadlyRadius["2xl"],
    padding: 20,
    overflow: "hidden",
    position: "relative",
    marginBottom: 24,
    ...ThreadlyShadow.roseGlow,
  },
  generatedLookBorder: {
    position: "absolute",
    inset: 0,
    borderRadius: ThreadlyRadius["2xl"],
    borderWidth: 1,
    borderColor: "rgba(201,149,106,0.3)",
  },
  generatedLookHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  aiGeneratedLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: ThreadlyColors.roseGold,
    letterSpacing: 2,
    marginBottom: 4,
  },
  generatedLookTitle: {
    fontSize: 22,
    fontFamily: "Georgia",
    color: ThreadlyColors.warmWhite,
  },
  ownedCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: ThreadlyColors.roseGold,
    alignItems: "center",
    justifyContent: "center",
  },
  ownedCirclePercent: {
    fontSize: 18,
    fontWeight: "700",
    color: ThreadlyColors.roseGoldLight,
    lineHeight: 22,
  },
  ownedCircleLabel: { fontSize: 9, color: ThreadlyColors.warmWhiteSubtle },

  generatedItems: { gap: 8, marginBottom: 16 },
  generatedItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  generatedItemDot: { width: 6, height: 6, borderRadius: 3 },
  generatedItemName: { flex: 1, fontSize: 13, color: ThreadlyColors.warmWhite },
  generatedItemBrand: { fontSize: 11, fontWeight: "600" },

  builtFromCloset: {
    backgroundColor: "rgba(201,149,106,0.1)",
    borderRadius: ThreadlyRadius.md,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "rgba(201,149,106,0.2)",
  },
  builtFromClosetText: { fontSize: 12, color: ThreadlyColors.roseGoldLight, textAlign: "center" },

  missingHeader: {
    paddingHorizontal: ThreadlySpacing.screenPadding,
    marginBottom: 12,
  },
  missingSectionTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: ThreadlyColors.roseGold,
    letterSpacing: 1.5,
  },

  missingList: {
    paddingHorizontal: ThreadlySpacing.screenPadding,
    gap: 8,
    marginBottom: 16,
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
  missingColorBar: { width: 4, height: "100%", minHeight: 64 },
  missingInfo: { flex: 1, padding: 14 },
  missingBrand: {
    fontSize: 9,
    fontWeight: "700",
    color: ThreadlyColors.warmWhiteSubtle,
    letterSpacing: 1.5,
    marginBottom: 2,
  },
  missingItem: { fontSize: 14, color: ThreadlyColors.warmWhite, marginBottom: 6 },
  missingPricing: { flexDirection: "row", alignItems: "center", gap: 8 },
  missingOriginal: {
    fontSize: 12,
    color: ThreadlyColors.warmWhiteSubtle,
    textDecorationLine: "line-through",
  },
  missingSale: { fontSize: 15, fontWeight: "700", color: ThreadlyColors.warmWhite },
  missingOff: {
    backgroundColor: ThreadlyColors.dealBg,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: ThreadlyRadius.md,
    borderWidth: 1,
    borderColor: "rgba(74,155,111,0.3)",
  },
  missingOffText: { fontSize: 13, fontWeight: "700", color: ThreadlyColors.deal },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: ThreadlySpacing.screenPadding,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: ThreadlyColors.charcoalLight,
    marginHorizontal: ThreadlySpacing.screenPadding,
    marginBottom: 24,
  },
  totalLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: ThreadlyColors.warmWhiteSubtle,
    letterSpacing: 1,
  },
  totalAmount: {
    fontSize: 22,
    fontWeight: "700",
    color: ThreadlyColors.warmWhite,
    fontFamily: "Georgia",
  },

  readyActions: {
    paddingHorizontal: ThreadlySpacing.screenPadding,
    gap: 12,
  },
  shopBtn: {
    borderRadius: ThreadlyRadius.pill,
    overflow: "hidden",
    ...ThreadlyShadow.roseGlow,
  },
  shopBtnGradient: { paddingVertical: 18, alignItems: "center" },
  shopBtnText: { fontSize: 16, fontWeight: "700", color: ThreadlyColors.warmWhite, letterSpacing: 0.3 },
  tryAgainBtn: { alignItems: "center", paddingVertical: 10 },
  tryAgainText: { fontSize: 14, color: ThreadlyColors.warmWhiteSubtle },
});
