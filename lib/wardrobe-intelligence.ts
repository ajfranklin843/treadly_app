/**
 * Threadly — Wardrobe Intelligence Engine
 *
 * Derives contextual labels, closet insights, and personalized intelligence
 * from worn tracking data, scan history, and style profile.
 *
 * The intelligence should feel invisible, editorial, and emotionally warm —
 * like a stylist who has been paying attention.
 */

import { useEffect, useState, useCallback } from "react";
import { loadWornStore, WornRecord } from "./worn-tracking-store";
import { loadClosetHistory, PersistedScanItem } from "./closet-history-store";
import { getStyleProfile, StyleProfile } from "./onboarding-store";

// ─── Types ────────────────────────────────────────────────────────────────────

export type WornLabel =
  | "You wear this often."
  | "One of your favorite staples."
  | "This piece defines your aesthetic."
  | "You haven't worn this in a while."
  | "Newly added to your wardrobe."
  | "A quiet classic in your rotation."
  | null;

export type ClosetInsight = {
  id: string;
  headline: string;
  sub: string;
  type: "iq" | "evolution" | "personality" | "versatile" | "underused" | "consistency";
  value?: number; // 0–100 score
  trend?: "up" | "down" | "stable";
};

export type WardrobePersonality =
  | "Minimalist Luxe"
  | "Classic Neutral"
  | "Editorial Chic"
  | "Casual Elevated"
  | "Bold Statement"
  | "Romantic Feminine"
  | "Street Smart"
  | "Effortless Cool";

export type WardrobeIntelligence = {
  // Per-item labels
  getWornLabel: (itemId: string) => WornLabel;
  getVersatilityInsight: (itemId: string) => string | null;
  isUnderused: (itemId: string) => boolean;
  isFavorite: (itemId: string) => boolean;
  getWornCount: (itemId: string) => number;

  // Closet-level insights
  closetIQ: number;
  styleConsistency: number;
  wardrobePersonality: WardrobePersonality;
  insights: ClosetInsight[];
  mostWornItems: string[]; // item IDs sorted by worn count
  underusedItems: string[]; // item IDs not worn in 14+ days
  topCategories: string[]; // most-worn categories

  // Live stats for Daily Engagement cards
  totalScanned: number;
  totalWornEvents: number;
  savedLooksCount: number; // placeholder — updated externally
  outfitPotential: number; // derived from scanned count
  hasData: boolean; // true if user has scanned at least one item

  // Attribution labels for recommendations
  getRecommendationAttribution: (itemId: string) => string | null;

  isLoading: boolean;
};

// ─── Constants ──────────────────────────────────────────────────────────────

const PICKS_BASE = 24;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function daysSince(dateStr: string | undefined): number {
  if (!dateStr) return 999;
  const diff = Date.now() - new Date(dateStr).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function deriveWornLabel(wornCount: number, lastWornDate: string | null | undefined, addedDaysAgo: number): WornLabel {
  if (addedDaysAgo < 3) return "Newly added to your wardrobe.";
  if (wornCount === 0 && addedDaysAgo > 7) return "You haven't worn this in a while.";
  if (wornCount >= 8) return "This piece defines your aesthetic.";
  if (wornCount >= 5) return "One of your favorite staples.";
  if (wornCount >= 3) return "You wear this often.";
  const days = daysSince(lastWornDate ?? undefined);
  if (days > 14 && wornCount > 0) return "You haven't worn this in a while.";
  if (wornCount >= 1) return "A quiet classic in your rotation.";
  return null;
}

function deriveVersatilityInsight(itemId: string, wornCount: number, profile: StyleProfile | null): string | null {
  if (wornCount === 0) return null;
  // Derive outfit count estimate from worn count + vibe
  const baseOutfits = Math.max(3, wornCount * 2 + 4);
  const vibe = profile?.styleVibes?.[0] ?? "Minimal";
  if (wornCount >= 5) return `Unlocks ~${baseOutfits} outfit combinations in your ${vibe} aesthetic.`;
  if (wornCount >= 3) return `Pairs with ${baseOutfits - 2} pieces already in your wardrobe.`;
  return null;
}

function deriveWardrobePersonality(profile: StyleProfile | null, wornData: Record<string, WornRecord>): WardrobePersonality {
  const vibe = profile?.styleVibes?.[0] ?? "";
  const map: Record<string, WardrobePersonality> = {
    "Minimal": "Minimalist Luxe",
    "Old Money": "Classic Neutral",
    "Chic": "Editorial Chic",
    "Casual Luxe": "Casual Elevated",
    "Streetwear": "Street Smart",
    "Clean Girl": "Effortless Cool",
    "Soft Glam": "Romantic Feminine",
    "Editorial": "Editorial Chic",
    "Vacation": "Effortless Cool",
  };
  return map[vibe] ?? "Classic Neutral";
}

function deriveClosetIQ(
  wornData: Record<string, WornRecord>,
  scanHistory: PersistedScanItem[],
  profile: StyleProfile | null
): number {
  // IQ grows with: number of scanned items, worn events, profile completeness
  const scannedScore = Math.min(40, scanHistory.length * 5);
  const wornEntries = Object.values(wornData);
  const wornScore = Math.min(30, wornEntries.reduce((acc, w) => acc + w.wornCount, 0) * 3);
  const profileScore = profile ? 30 : 0;
  return Math.min(99, 42 + scannedScore + wornScore + profileScore);
}

function deriveStyleConsistency(wornData: Record<string, WornRecord>, profile: StyleProfile | null): number {
  // Consistency = how often worn items align with stated vibe
  const entries = Object.values(wornData);
  if (entries.length === 0) return 72;
  const totalWorn = entries.reduce((acc, w) => acc + w.wornCount, 0);
  if (totalWorn === 0) return 72;
  // Simulate consistency score based on data richness
  return Math.min(97, 68 + Math.floor(totalWorn * 1.5));
}

function deriveInsights(
  wornData: Record<string, WornRecord>,
  scanHistory: PersistedScanItem[],
  profile: StyleProfile | null,
  personality: WardrobePersonality,
  iq: number,
  consistency: number
): ClosetInsight[] {
  const insights: ClosetInsight[] = [];
  const vibe = profile?.styleVibes?.[0] ?? "Minimal";
  const occasions = profile?.occasions ?? [];

  // Closet IQ
  insights.push({
    id: "iq",
    type: "iq",
    headline: `Closet IQ: ${iq}`,
    sub: iq >= 80
      ? "Your wardrobe is highly intelligent. Threadly knows your style deeply."
      : iq >= 60
      ? "Your wardrobe is building intelligence. Keep scanning and wearing."
      : "Scan more items to unlock deeper style insights.",
    value: iq,
    trend: iq >= 70 ? "up" : "stable",
  });

  // Wardrobe personality
  insights.push({
    id: "personality",
    type: "personality",
    headline: `Your Wardrobe Personality: ${personality}`,
    sub: `Your closet leans ${vibe.toLowerCase()} — curated, intentional, and distinctly yours.`,
    trend: "stable",
  });

  // Style evolution
  const wornEntries = Object.values(wornData);
  const totalWorn = wornEntries.reduce((acc, w) => acc + w.wornCount, 0);
  insights.push({
    id: "evolution",
    type: "evolution",
    headline: totalWorn > 10
      ? "Your wardrobe is evolving toward elevated basics."
      : "Your style identity is taking shape.",
    sub: totalWorn > 10
      ? "You gravitate toward clean silhouettes and neutral palettes."
      : "Wear more items to reveal your style patterns.",
    trend: totalWorn > 5 ? "up" : "stable",
  });

  // Versatility
  const mostWorn = wornEntries.sort((a, b) => b.wornCount - a.wornCount).slice(0, 3);
  if (mostWorn.length > 0 && mostWorn[0].wornCount > 0) {
    insights.push({
      id: "versatile",
      type: "versatile",
      headline: "Your most versatile pieces are working hard.",
      sub: `Your top items unlock an estimated ${Math.max(8, mostWorn[0].wornCount * 3)} outfit combinations.`,
      trend: "up",
    });
  }

  // Underused
  const underused = wornEntries.filter(w => w.wornCount === 0 || daysSince(w.lastWornDate ?? undefined) > 14);
  if (underused.length > 2) {
    insights.push({
      id: "underused",
      type: "underused",
      headline: `${underused.length} pieces haven't been worn recently.`,
      sub: "Threadly can suggest new ways to style them.",
      trend: "down",
    });
  }

  // Style consistency
  insights.push({
    id: "consistency",
    type: "consistency",
    headline: `Style Consistency: ${consistency}%`,
    sub: consistency >= 85
      ? "Your wardrobe is cohesive and intentional — every piece fits your aesthetic."
      : "Your wardrobe has a clear identity with room to refine.",
    value: consistency,
    trend: consistency >= 80 ? "up" : "stable",
  });

  return insights;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useWardrobeIntelligence(): WardrobeIntelligence {
  const [wornData, setWornData] = useState<Record<string, WornRecord>>({});
  const [scanHistory, setScanHistory] = useState<PersistedScanItem[]>([]);
  const [profile, setProfile] = useState<StyleProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const [worn, history, prof] = await Promise.all([
        loadWornStore(),
        loadClosetHistory(),
        getStyleProfile(),
      ]);
      setWornData(worn);
      setScanHistory(history);
      setProfile(prof);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // ── Per-item functions ──────────────────────────────────────────────────────

  const getWornCount = useCallback((itemId: string): number => {
    return wornData[itemId]?.wornCount ?? 0;
  }, [wornData]);

  const isFavorite = useCallback((itemId: string): boolean => {
    return wornData[itemId]?.isFavorite ?? false;
  }, [wornData]);

  const isUnderused = useCallback((itemId: string): boolean => {
    const data = wornData[itemId];
    if (!data) return false;
    return data.wornCount === 0 || daysSince(data.lastWornDate ?? undefined) > 14;
  }, [wornData]);

  const getWornLabel = useCallback((itemId: string): WornLabel => {
    const data = wornData[itemId];
    const scanItem = scanHistory.find(s => s.id === itemId);
    const addedDaysAgo = scanItem ? daysSince(new Date(scanItem.scannedAt).toISOString()) : 30;
    return deriveWornLabel(
      data?.wornCount ?? 0,
      data?.lastWornDate,
      addedDaysAgo
    );
  }, [wornData, scanHistory]);

  const getVersatilityInsight = useCallback((itemId: string): string | null => {
    const count = wornData[itemId]?.wornCount ?? 0;
    return deriveVersatilityInsight(itemId, count, profile);
  }, [wornData, profile]);

  const getRecommendationAttribution = useCallback((itemId: string): string | null => {
    const data = wornData[itemId];
    if (!data) return null;
    if (data.isFavorite) return "One of your favorites";
    if (data.wornCount >= 5) return "You wear this often";
    if (data.wornCount >= 3) return "A staple in your rotation";
    if (daysSince(data.lastWornDate ?? undefined) > 14 && data.wornCount > 0) return "You haven't worn this recently";
    return null;
  }, [wornData]);

  // ── Closet-level derived values ─────────────────────────────────────────────

  const personality = deriveWardrobePersonality(profile, wornData);
  const iq = deriveClosetIQ(wornData, scanHistory, profile);
  const consistency = deriveStyleConsistency(wornData, profile);
  const insights = deriveInsights(wornData, scanHistory, profile, personality, iq, consistency);

  const mostWornItems = Object.entries(wornData)
    .sort(([, a], [, b]) => b.wornCount - a.wornCount)
    .map(([id]) => id);

  const underusedItems = Object.entries(wornData)
    .filter(([, w]) => w.wornCount === 0 || daysSince(w.lastWornDate ?? undefined) > 14)
    .map(([id]) => id);

  const topCategories = (() => {
    const cats: Record<string, number> = {};
    scanHistory.forEach(item => {
      const cat = item.category ?? "Other";
      cats[cat] = (cats[cat] ?? 0) + (wornData[item.id]?.wornCount ?? 0);
    });
    return Object.entries(cats)
      .sort(([, a], [, b]) => b - a)
      .map(([cat]) => cat)
      .slice(0, 3);
  })();

  // Live stats
  const totalScanned = scanHistory.length;
  const totalWornEvents = Object.values(wornData).reduce((acc, w) => acc + w.wornCount, 0);
  const outfitPotential = Math.max(PICKS_BASE, totalScanned * 6 + totalWornEvents * 2);
  const hasData = totalScanned > 0 || Object.keys(wornData).length > 0;

  return {
    getWornLabel,
    getVersatilityInsight,
    isUnderused,
    isFavorite,
    getWornCount,
    closetIQ: iq,
    styleConsistency: consistency,
    wardrobePersonality: personality,
    insights,
    mostWornItems,
    underusedItems,
    topCategories,
    getRecommendationAttribution,
    totalScanned,
    totalWornEvents,
    savedLooksCount: 0, // updated by screens that load saved-looks-store
    outfitPotential,
    hasData,
    isLoading,
  };
}

