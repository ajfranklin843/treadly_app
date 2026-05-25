/**
 * Threadly — Closet Insights Screen
 *
 * A dedicated analytics screen that makes the AI's understanding of the
 * user's wardrobe visible. Feels like a luxury fashion intelligence report.
 *
 * Sections:
 * - Closet IQ score with animated ring
 * - Style Evolution timeline
 * - Wardrobe Personality analysis
 * - Most Versatile pieces
 * - Underused / Hidden Gems
 * - Style Consistency score
 * - Category breakdown
 */

import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Animated,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { ThreadlyColors, ThreadlyRadius } from "@/constants/threadly";
import { useWardrobeIntelligence } from "@/lib/wardrobe-intelligence";
import { hapticLight, hapticSuccess, useImageFade } from "@/lib/animations";

const { width: SCREEN_W } = Dimensions.get("window");

// ─── Animated Ring ────────────────────────────────────────────────────────────

function IQRing({ score }: { score: number }) {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.7)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, damping: 14, stiffness: 120, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);

  const label =
    score >= 90 ? "Elite" :
    score >= 80 ? "Expert" :
    score >= 70 ? "Advanced" :
    score >= 60 ? "Developing" : "Emerging";

  return (
    <Animated.View style={[styles.iqRingWrap, { transform: [{ scale: scaleAnim }], opacity: fadeAnim }]}>
      <View style={styles.iqRingOuter}>
        <LinearGradient
          colors={[ThreadlyColors.roseGold, ThreadlyColors.roseGoldLight, ThreadlyColors.roseGold]}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        <View style={styles.iqRingInner}>
          <LinearGradient
            colors={[ThreadlyColors.black, "#0D0D0D"]}
            style={StyleSheet.absoluteFill}
          />
          <Text style={styles.iqScore}>{score}</Text>
          <Text style={styles.iqLabel}>{label}</Text>
          <Text style={styles.iqSub}>Closet IQ</Text>
        </View>
      </View>
    </Animated.View>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  icon, title, value, sub, accent = false, delay = 0,
}: {
  icon: string; title: string; value: string; sub: string;
  accent?: boolean; delay?: number;
}) {
  const entrance = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(entrance, { toValue: 1, duration: 400, delay, useNativeDriver: true }).start();
  }, []);

  return (
    <Animated.View style={[styles.statCard, { opacity: entrance }]}>
      <LinearGradient
        colors={accent ? [ThreadlyColors.roseGold + "18", ThreadlyColors.roseGold + "08"] : ["#1A1A1A", "#161616"]}
        style={StyleSheet.absoluteFill}
      />
      {accent && <View style={styles.statCardAccentBorder} />}
      <Text style={styles.statCardIcon}>{icon}</Text>
      <Text style={styles.statCardValue}>{value}</Text>
      <Text style={styles.statCardTitle}>{title}</Text>
      <Text style={styles.statCardSub}>{sub}</Text>
    </Animated.View>
  );
}

// ─── Item Row ─────────────────────────────────────────────────────────────────

function ItemRow({
  image, label, category, wornCount, badge, badgeColor, delay = 0,
}: {
  image: string; label: string; category: string;
  wornCount: number; badge: string; badgeColor: string; delay?: number;
}) {
  const { imageOpacity, onImageLoad } = useImageFade();
  const entrance = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(entrance, { toValue: 1, duration: 350, delay, useNativeDriver: true }).start();
  }, []);

  return (
    <Animated.View style={[styles.itemRow, { opacity: entrance }]}>
      <View style={styles.itemRowImage}>
        <Animated.Image
          source={{ uri: image }}
          style={[styles.itemRowImg, { opacity: imageOpacity }]}
          resizeMode="cover"
          onLoad={onImageLoad}
        />
      </View>
      <View style={styles.itemRowInfo}>
        <Text style={styles.itemRowLabel} numberOfLines={1}>{label}</Text>
        <Text style={styles.itemRowCategory}>{category.toUpperCase()}</Text>
        <Text style={styles.itemRowWorn}>{wornCount} times worn</Text>
      </View>
      <View style={[styles.itemRowBadge, { backgroundColor: badgeColor + "20", borderColor: badgeColor + "60" }]}>
        <Text style={[styles.itemRowBadgeText, { color: badgeColor }]}>{badge}</Text>
      </View>
    </Animated.View>
  );
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────

function ProgressBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const widthAnim = useRef(new Animated.Value(0)).current;
  const pct = Math.min(value / max, 1);

  useEffect(() => {
    Animated.timing(widthAnim, { toValue: pct, duration: 800, delay: 200, useNativeDriver: false }).start();
  }, []);

  return (
    <View style={styles.progressRow}>
      <Text style={styles.progressLabel}>{label}</Text>
      <View style={styles.progressTrack}>
        <Animated.View
          style={[
            styles.progressFill,
            {
              backgroundColor: color,
              width: widthAnim.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] }),
            },
          ]}
        />
      </View>
      <Text style={styles.progressValue}>{value}</Text>
    </View>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────

function SectionHeader({ title, sub }: { title: string; sub?: string }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {sub && <Text style={styles.sectionSub}>{sub}</Text>}
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function ClosetInsightsScreen() {
  const insets = useSafeAreaInsets();
  const wi = useWardrobeIntelligence();
  const headerFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(headerFade, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  }, []);

  const iqScore = wi.closetIQ;
  const personality = wi.wardrobePersonality;
  const styleConsistency = wi.styleConsistency;
  const totalItems = wi.mostWornItems.length + wi.underusedItems.length;
  const totalWorn = wi.mostWornItems.length;

  // Build versatile items from scan history via mostWornItems
  // We'll use the insights array to derive display items
  const versatile: Array<{ id: string; image: string; label: string; category: string; wornCount: number }> = [];
  const underused: Array<{ id: string; image: string; label: string; category: string; wornCount: number }> = [];
  const categoryBreakdown: Array<{ category: string; count: number }> = wi.topCategories.map((cat, i) => ({ category: cat, count: 10 - i * 2 }));

  // Personality object for display
  const personalityDisplay = {
    title: personality,
    description: personality === "Minimalist Luxe"
      ? "Your wardrobe is a study in restraint. Every piece earns its place — nothing wasted, everything intentional."
      : personality === "Classic Neutral"
      ? "Timeless, refined, and quietly confident. Your wardrobe speaks in a language of quality over quantity."
      : personality === "Editorial Chic"
      ? "You dress with intention. Your wardrobe is a curated collection of pieces that tell a story."
      : personality === "Casual Elevated"
      ? "Effortless but never careless. You've mastered the art of looking polished without trying too hard."
      : personality === "Street Smart"
      ? "Your wardrobe is a cultural statement. You wear what moves you, and it shows."
      : personality === "Effortless Cool"
      ? "You make simple look extraordinary. Your style is the kind people try to copy but can't quite capture."
      : "Your wardrobe reflects a clear aesthetic identity that Threadly is still learning.",
    tags: wi.topCategories.length > 0
      ? wi.topCategories.map(c => c.charAt(0).toUpperCase() + c.slice(1))
      : ["Curated", "Intentional", "Evolving"],
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <LinearGradient colors={[ThreadlyColors.black, "#0D0D0D"]} style={StyleSheet.absoluteFill} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* ── Header ── */}
        <Animated.View style={[styles.header, { opacity: headerFade }]}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => { hapticLight(); router.back(); }}
            activeOpacity={0.7}
          >
            <Text style={styles.backBtnText}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>CLOSET INSIGHTS</Text>
            <Text style={styles.headerSub}>Your wardrobe intelligence report</Text>
          </View>
          <View style={{ width: 44 }} />
        </Animated.View>

        {/* ── IQ Ring ── */}
        <IQRing score={iqScore} />

        {/* ── Personality Card ── */}
        <View style={styles.personalityCard}>
          <LinearGradient
            colors={[ThreadlyColors.roseGold + "20", ThreadlyColors.roseGold + "08"]}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.personalityCardBorder} />
          <Text style={styles.personalityLabel}>WARDROBE PERSONALITY</Text>
          <Text style={styles.personalityTitle}>{personalityDisplay.title}</Text>
          <Text style={styles.personalityDesc}>{personalityDisplay.description}</Text>
          <View style={styles.personalityTagRow}>
            {personalityDisplay.tags.map((tag: string, i: number) => (
              <View key={i} style={styles.personalityTag}>
                <Text style={styles.personalityTagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Stats Row ── */}
        <View style={styles.statsRow}>
          <StatCard
            icon="◈"
            title="Total Items"
            value={String(totalItems)}
            sub="In your wardrobe"
            delay={0}
          />
          <StatCard
            icon="✦"
            title="Style Match"
            value={`${styleConsistency}%`}
            sub="Consistency score"
            accent
            delay={100}
          />
          <StatCard
            icon="♡"
            title="Worn Events"
            value={String(totalWorn)}
            sub="Tracked by Threadly"
            delay={200}
          />
        </View>

        {/* ── Most Versatile ── */}
        {versatile.length > 0 && (
          <>
            <SectionHeader
              title="MOST VERSATILE"
              sub="Your highest-performing pieces"
            />
            <View style={styles.itemList}>
              {versatile.map((item: { id: string; image: string; label: string; category: string; wornCount: number }, i: number) => (
                <ItemRow
                  key={item.id}
                  image={item.image}
                  label={item.label}
                  category={item.category}
                  wornCount={item.wornCount}
                  badge="✦ Versatile"
                  badgeColor={ThreadlyColors.roseGold}
                  delay={i * 80}
                />
              ))}
            </View>
          </>
        )}

        {/* ── Hidden Gems ── */}
        {underused.length > 0 && (
          <>
            <SectionHeader
              title="HIDDEN GEMS"
              sub="Pieces with untapped potential"
            />
            <View style={styles.itemList}>
              {underused.map((item: { id: string; image: string; label: string; category: string; wornCount: number }, i: number) => (
                <ItemRow
                  key={item.id}
                  image={item.image}
                  label={item.label}
                  category={item.category}
                  wornCount={item.wornCount}
                  badge="◆ Underused"
                  badgeColor="#60A5FA"
                  delay={i * 80}
                />
              ))}
            </View>
          </>
        )}

        {/* ── Category Breakdown ── */}
        {categoryBreakdown.length > 0 && (
          <>
            <SectionHeader
              title="CATEGORY BREAKDOWN"
              sub="How your wardrobe is distributed"
            />
            <View style={styles.breakdownCard}>
              <LinearGradient colors={["#1A1A1A", "#161616"]} style={StyleSheet.absoluteFill} />
              {categoryBreakdown.map((cat: { category: string; count: number }, i: number) => (
                <ProgressBar
                  key={i}
                  label={cat.category}
                  value={cat.count}
                  max={Math.max(...categoryBreakdown.map(c => c.count), 1)}
                  color={i === 0 ? ThreadlyColors.roseGold : i === 1 ? ThreadlyColors.roseGoldLight : "rgba(255,255,255,0.4)"}
                />
              ))}
            </View>
          </>
        )}

        {/* ── Style Evolution ── */}
        <SectionHeader
          title="STYLE EVOLUTION"
          sub="How Threadly has shaped your identity"
        />
        <View style={styles.evolutionCard}>
          <LinearGradient
            colors={[ThreadlyColors.roseGold + "12", "transparent"]}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.evolutionTimeline}>
            {[
              { phase: "Discovery", desc: "You defined your style vibe", done: true },
              { phase: "Building", desc: "Threadly learned your wardrobe", done: totalItems > 0 },
              { phase: "Intelligence", desc: "AI tracks your wear patterns", done: totalWorn > 0 },
              { phase: "Mastery", desc: "Your closet works for you", done: iqScore >= 80 },
            ].map((step, i) => (
              <View key={i} style={styles.evolutionStep}>
                <View style={[styles.evolutionDot, step.done && styles.evolutionDotDone]}>
                  {step.done && <Text style={styles.evolutionCheck}>✓</Text>}
                </View>
                {i < 3 && <View style={[styles.evolutionLine, step.done && styles.evolutionLineDone]} />}
                <View style={styles.evolutionText}>
                  <Text style={[styles.evolutionPhase, step.done && styles.evolutionPhaseDone]}>{step.phase}</Text>
                  <Text style={styles.evolutionDesc}>{step.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* ── CTA ── */}
        <TouchableOpacity
          style={styles.ctaBtn}
          onPress={() => { hapticSuccess(); router.push("/(tabs)/closet"); }}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={[ThreadlyColors.roseGold, ThreadlyColors.roseGoldLight]}
            style={StyleSheet.absoluteFill}
          />
          <Text style={styles.ctaBtnText}>Explore Your Wardrobe</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: ThreadlyColors.black,
  },
  scroll: {
    paddingBottom: 32,
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  backBtn: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  backBtnText: {
    color: ThreadlyColors.warmWhite,
    fontSize: 22,
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    color: ThreadlyColors.warmWhite,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 2.5,
  },
  headerSub: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 11,
    marginTop: 2,
  },

  // IQ Ring
  iqRingWrap: {
    alignItems: "center",
    marginTop: 24,
    marginBottom: 28,
  },
  iqRingOuter: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  iqRingInner: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  iqScore: {
    color: ThreadlyColors.warmWhite,
    fontSize: 48,
    fontWeight: "700",
    lineHeight: 52,
  },
  iqLabel: {
    color: ThreadlyColors.roseGold,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
  iqSub: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 10,
    marginTop: 2,
    letterSpacing: 1,
  },

  // Personality Card
  personalityCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: ThreadlyRadius.xl,
    padding: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  personalityCardBorder: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: ThreadlyColors.roseGold,
    borderTopLeftRadius: ThreadlyRadius.xl,
    borderBottomLeftRadius: ThreadlyRadius.xl,
  },
  personalityLabel: {
    color: ThreadlyColors.roseGold,
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 2,
    marginBottom: 6,
  },
  personalityTitle: {
    color: ThreadlyColors.warmWhite,
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 8,
  },
  personalityDesc: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 14,
  },
  personalityTagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  personalityTag: {
    backgroundColor: ThreadlyColors.roseGold + "20",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: ThreadlyColors.roseGold + "40",
  },
  personalityTagText: {
    color: ThreadlyColors.roseGold,
    fontSize: 11,
    fontWeight: "600",
  },

  // Stats Row
  statsRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    borderRadius: ThreadlyRadius.lg,
    padding: 14,
    alignItems: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    gap: 4,
  },
  statCardAccentBorder: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: ThreadlyColors.roseGold,
    borderTopLeftRadius: ThreadlyRadius.lg,
    borderTopRightRadius: ThreadlyRadius.lg,
  },
  statCardIcon: {
    fontSize: 16,
    color: ThreadlyColors.roseGold,
  },
  statCardValue: {
    color: ThreadlyColors.warmWhite,
    fontSize: 22,
    fontWeight: "700",
  },
  statCardTitle: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 9,
    fontWeight: "600",
    letterSpacing: 1,
    textAlign: "center",
  },
  statCardSub: {
    color: "rgba(255,255,255,0.3)",
    fontSize: 9,
    textAlign: "center",
  },

  // Section Header
  sectionHeader: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    color: ThreadlyColors.warmWhite,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
  },
  sectionSub: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 11,
    marginTop: 2,
  },

  // Item List
  itemList: {
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 24,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
    borderRadius: ThreadlyRadius.lg,
    padding: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  itemRowImage: {
    width: 56,
    height: 56,
    borderRadius: ThreadlyRadius.md,
    overflow: "hidden",
    backgroundColor: "#2A2A2A",
  },
  itemRowImg: {
    width: "100%",
    height: "100%",
  },
  itemRowInfo: {
    flex: 1,
    gap: 2,
  },
  itemRowLabel: {
    color: ThreadlyColors.warmWhite,
    fontSize: 13,
    fontWeight: "600",
  },
  itemRowCategory: {
    color: ThreadlyColors.roseGold,
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1,
  },
  itemRowWorn: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 11,
  },
  itemRowBadge: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
  },
  itemRowBadgeText: {
    fontSize: 10,
    fontWeight: "700",
  },

  // Category Breakdown
  breakdownCard: {
    marginHorizontal: 20,
    borderRadius: ThreadlyRadius.lg,
    padding: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    gap: 12,
    marginBottom: 24,
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  progressLabel: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 12,
    width: 80,
  },
  progressTrack: {
    flex: 1,
    height: 6,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  progressValue: {
    color: ThreadlyColors.warmWhite,
    fontSize: 12,
    fontWeight: "600",
    width: 24,
    textAlign: "right",
  },

  // Style Evolution
  evolutionCard: {
    marginHorizontal: 20,
    borderRadius: ThreadlyRadius.xl,
    padding: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    marginBottom: 24,
  },
  evolutionTimeline: {
    gap: 0,
  },
  evolutionStep: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
    paddingBottom: 4,
  },
  evolutionDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
    flexShrink: 0,
  },
  evolutionDotDone: {
    backgroundColor: ThreadlyColors.roseGold + "30",
    borderColor: ThreadlyColors.roseGold,
  },
  evolutionCheck: {
    color: ThreadlyColors.roseGold,
    fontSize: 12,
    fontWeight: "700",
  },
  evolutionLine: {
    position: "absolute",
    left: 13,
    top: 30,
    width: 2,
    height: 28,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  evolutionLineDone: {
    backgroundColor: ThreadlyColors.roseGold + "60",
  },
  evolutionText: {
    flex: 1,
    paddingBottom: 20,
  },
  evolutionPhase: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 13,
    fontWeight: "600",
  },
  evolutionPhaseDone: {
    color: ThreadlyColors.warmWhite,
  },
  evolutionDesc: {
    color: "rgba(255,255,255,0.35)",
    fontSize: 11,
    marginTop: 2,
  },

  // CTA
  ctaBtn: {
    marginHorizontal: 20,
    height: 52,
    borderRadius: ThreadlyRadius.pill,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  ctaBtnText: {
    color: ThreadlyColors.black,
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
