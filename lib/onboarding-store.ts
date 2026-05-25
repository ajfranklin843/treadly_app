/**
 * Threadly Onboarding State Store
 * Persists user style preferences collected during onboarding.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_KEY = '@threadly_onboarding_complete';
const PROFILE_KEY = '@threadly_style_profile';

export interface StyleProfile {
  styleVibes: string[];       // e.g. ['Minimal', 'Classic', 'Feminine']
  occasions: string[];        // e.g. ['Work', 'Date Night', 'Casual']
  favoriteBrands: string[];   // e.g. ['Zara', 'H&M', 'Aritzia']
  budgetMin: number;          // e.g. 50
  budgetMax: number;          // e.g. 300
  colorPreferences: string[]; // e.g. ['Neutral', 'Black', 'Blush']
  topSize: string;            // e.g. 'S'
  bottomSize: string;         // e.g. '27'
  shoeSize: string;           // e.g. '8'
  closetSize: string;         // e.g. 'medium', 'large'
}

export const defaultProfile: StyleProfile = {
  styleVibes: [],
  occasions: [],
  favoriteBrands: [],
  budgetMin: 50,
  budgetMax: 200,
  colorPreferences: [],
  topSize: '',
  bottomSize: '',
  shoeSize: '',
  closetSize: '',
};

export async function isOnboardingComplete(): Promise<boolean> {
  try {
    const value = await AsyncStorage.getItem(ONBOARDING_KEY);
    return value === 'true';
  } catch {
    return false;
  }
}

/** Mark onboarding as complete. Alias: completeOnboarding. */
export async function markOnboardingComplete(): Promise<void> {
  await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
}

/** Alias for markOnboardingComplete — used in step6. */
export const completeOnboarding = markOnboardingComplete;

export async function saveStyleProfile(profile: Partial<StyleProfile>): Promise<void> {
  const existing = await getStyleProfile();
  const merged = { ...existing, ...profile };
  await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(merged));
}

export async function getStyleProfile(): Promise<StyleProfile> {
  try {
    const raw = await AsyncStorage.getItem(PROFILE_KEY);
    if (!raw) return { ...defaultProfile };
    return { ...defaultProfile, ...JSON.parse(raw) };
  } catch {
    return { ...defaultProfile };
  }
}

export async function resetOnboarding(): Promise<void> {
  await AsyncStorage.multiRemove([ONBOARDING_KEY, PROFILE_KEY]);
}
