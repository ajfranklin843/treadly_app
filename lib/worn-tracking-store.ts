/**
 * Threadly — Worn Tracking Store
 *
 * Persists worn counts, last-worn dates, and favorites to AsyncStorage.
 * This is the memory layer that makes Threadly feel alive.
 *
 * Key: @threadly/worn_tracking
 * Shape: Record<itemId, WornRecord>
 */

import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@threadly/worn_tracking";

export interface WornRecord {
  itemId: string;
  wornCount: number;
  lastWornDate: string | null; // ISO date string
  isFavorite: boolean;
  styleMatchScore: number; // 0-100, increases with wear
}

type WornStore = Record<string, WornRecord>;

// ─── Load ─────────────────────────────────────────────────────────────────────

export async function loadWornStore(): Promise<WornStore> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as WornStore;
  } catch {
    return {};
  }
}

// ─── Save ─────────────────────────────────────────────────────────────────────

async function saveWornStore(store: WornStore): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // fail silently
  }
}

// ─── Mark as Worn ─────────────────────────────────────────────────────────────

export async function markAsWorn(
  itemId: string,
  currentWornCount: number
): Promise<WornRecord> {
  const store = await loadWornStore();
  const existing = store[itemId];
  const newCount = (existing?.wornCount ?? currentWornCount) + 1;
  // Style match score increases logarithmically with wear (max 99)
  const baseScore = existing?.styleMatchScore ?? 72;
  const newScore = Math.min(99, Math.round(baseScore + (100 - baseScore) * 0.08));

  const updated: WornRecord = {
    itemId,
    wornCount: newCount,
    lastWornDate: new Date().toISOString(),
    isFavorite: existing?.isFavorite ?? false,
    styleMatchScore: newScore,
  };

  store[itemId] = updated;
  await saveWornStore(store);
  return updated;
}

// ─── Toggle Favorite ──────────────────────────────────────────────────────────

export async function toggleFavorite(
  itemId: string,
  currentWornCount: number
): Promise<WornRecord> {
  const store = await loadWornStore();
  const existing = store[itemId];
  const updated: WornRecord = {
    itemId,
    wornCount: existing?.wornCount ?? currentWornCount,
    lastWornDate: existing?.lastWornDate ?? null,
    isFavorite: !(existing?.isFavorite ?? false),
    styleMatchScore: existing?.styleMatchScore ?? 72,
  };
  store[itemId] = updated;
  await saveWornStore(store);
  return updated;
}

// ─── Get single record ────────────────────────────────────────────────────────

export async function getWornRecord(itemId: string): Promise<WornRecord | null> {
  const store = await loadWornStore();
  return store[itemId] ?? null;
}

// ─── Clear all (for reset onboarding) ────────────────────────────────────────

export async function clearWornStore(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch {
    // fail silently
  }
}

// ─── Format last worn date for display ───────────────────────────────────────

export function formatLastWorn(isoDate: string | null): string {
  if (!isoDate) return "Never worn";
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Worn today";
  if (diffDays === 1) return "Worn yesterday";
  if (diffDays < 7) return `Worn ${diffDays} days ago`;
  if (diffDays < 30) return `Worn ${Math.floor(diffDays / 7)} weeks ago`;
  return `Worn ${Math.floor(diffDays / 30)} months ago`;
}
