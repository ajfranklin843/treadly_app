/**
 * Threadly — Saved Looks Store
 *
 * AsyncStorage persistence for saved outfit looks.
 * Looks are saved from the Outfit Builder and displayed in the Closet "Looks" tab.
 */

import AsyncStorage from "@react-native-async-storage/async-storage";

const LOOKS_KEY = "@threadly_saved_looks";
const MAX_LOOKS = 50;

export interface SavedLook {
  id: string;
  name: string;
  occasion: string;
  anchorItemId: string;
  anchorItemImage: string;
  anchorItemLabel: string;
  pieceIds: string[];
  pieceImages: string[]; // first 4 shown in preview grid
  confidenceScore: number;
  savedAt: number;
  notes?: string;
}

export async function loadSavedLooks(): Promise<SavedLook[]> {
  try {
    const raw = await AsyncStorage.getItem(LOOKS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SavedLook[];
  } catch {
    return [];
  }
}

export async function saveLook(look: SavedLook): Promise<SavedLook[]> {
  try {
    const existing = await loadSavedLooks();
    // Deduplicate by id
    const filtered = existing.filter(l => l.id !== look.id);
    const updated = [look, ...filtered].slice(0, MAX_LOOKS);
    await AsyncStorage.setItem(LOOKS_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

export async function deleteLook(id: string): Promise<SavedLook[]> {
  try {
    const existing = await loadSavedLooks();
    const updated = existing.filter(l => l.id !== id);
    await AsyncStorage.setItem(LOOKS_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

export async function clearSavedLooks(): Promise<void> {
  try {
    await AsyncStorage.removeItem(LOOKS_KEY);
  } catch {}
}

export function formatSavedDate(ts: number): string {
  const d = new Date(ts);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
