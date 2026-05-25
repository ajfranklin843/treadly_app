/**
 * Threadly — Closet History Store
 *
 * Persists the "Recently Learned" scan history to AsyncStorage.
 * This reinforces the emotional product story: "Threadly remembers my wardrobe."
 *
 * Stores up to MAX_HISTORY scanned items, most recent first.
 * Cleared when the user resets onboarding (for demo purposes).
 */

import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "threadly_closet_history_v1";
const MAX_HISTORY = 20;

/** Mirrors the ScannedItem shape from closet-scan-modal.tsx */
export type PersistedScanItem = {
  id: string;
  name: string;
  brand: string;
  category: string;
  color: string;
  colorHex: string;
  styleTag: string;
  image: string;
  outfitCount: number;
  matchScore: number;
  closetIQ: number;
  pairsWith: string[];
  trendingIn: string;
  occasions: string[];
  worn: number;
  scannedAt: number; // Unix timestamp ms
};

/** Load the full scan history from AsyncStorage */
export async function loadClosetHistory(): Promise<PersistedScanItem[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as PersistedScanItem[];
  } catch {
    return [];
  }
}

/** Prepend a new scanned item to history and persist */
export async function addToClosetHistory(item: PersistedScanItem): Promise<PersistedScanItem[]> {
  try {
    const existing = await loadClosetHistory();
    // Remove any duplicate with same id (re-scan case)
    const deduped = existing.filter(i => i.id !== item.id);
    const updated = [item, ...deduped].slice(0, MAX_HISTORY);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [item];
  }
}

/** Clear all scan history (called on reset onboarding) */
export async function clearClosetHistory(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch {
    // Silently fail — not critical
  }
}

/** Get the count of scanned items */
export async function getClosetHistoryCount(): Promise<number> {
  const history = await loadClosetHistory();
  return history.length;
}
