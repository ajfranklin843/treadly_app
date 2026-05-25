/**
 * Threadly Unit Tests
 * Tests for onboarding store logic and design token integrity.
 * Uses relative imports to avoid vitest path alias resolution issues.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// ─── Mock AsyncStorage ────────────────────────────────────────────────────────
const store: Record<string, string> = {};

vi.mock("@react-native-async-storage/async-storage", () => ({
  default: {
    getItem: vi.fn(async (key: string) => store[key] ?? null),
    setItem: vi.fn(async (key: string, value: string) => { store[key] = value; }),
    multiRemove: vi.fn(async (keys: string[]) => { keys.forEach(k => delete store[k]); }),
  },
}));

// ─── Onboarding Store Tests ───────────────────────────────────────────────────

describe("Onboarding Store", () => {
  beforeEach(() => {
    Object.keys(store).forEach(k => delete store[k]);
    vi.resetModules();
  });

  it("isOnboardingComplete returns false when not set", async () => {
    const { isOnboardingComplete } = await import("../lib/onboarding-store");
    const result = await isOnboardingComplete();
    expect(result).toBe(false);
  });

  it("markOnboardingComplete sets flag to true", async () => {
    const { markOnboardingComplete, isOnboardingComplete } = await import("../lib/onboarding-store");
    await markOnboardingComplete();
    const result = await isOnboardingComplete();
    expect(result).toBe(true);
  });

  it("completeOnboarding is an alias for markOnboardingComplete", async () => {
    const { completeOnboarding, isOnboardingComplete } = await import("../lib/onboarding-store");
    await completeOnboarding();
    const result = await isOnboardingComplete();
    expect(result).toBe(true);
  });

  it("saveStyleProfile merges with existing profile", async () => {
    const { saveStyleProfile, getStyleProfile } = await import("../lib/onboarding-store");
    await saveStyleProfile({ styleVibes: ["Minimal", "Classic"] });
    await saveStyleProfile({ occasions: ["Work", "Casual"] });
    const profile = await getStyleProfile();
    expect(profile.styleVibes).toEqual(["Minimal", "Classic"]);
    expect(profile.occasions).toEqual(["Work", "Casual"]);
  });

  it("getStyleProfile returns defaultProfile when nothing saved", async () => {
    const { getStyleProfile, defaultProfile } = await import("../lib/onboarding-store");
    const profile = await getStyleProfile();
    expect(profile.styleVibes).toEqual(defaultProfile.styleVibes);
    expect(profile.budgetMin).toBe(defaultProfile.budgetMin);
    expect(profile.budgetMax).toBe(defaultProfile.budgetMax);
  });

  it("StyleProfile includes closetSize field", async () => {
    const { saveStyleProfile, getStyleProfile } = await import("../lib/onboarding-store");
    await saveStyleProfile({ closetSize: "large" });
    const profile = await getStyleProfile();
    expect(profile.closetSize).toBe("large");
  });

  it("resetOnboarding clears all stored data", async () => {
    const { markOnboardingComplete, saveStyleProfile, resetOnboarding, isOnboardingComplete, getStyleProfile, defaultProfile } = await import("../lib/onboarding-store");
    await markOnboardingComplete();
    await saveStyleProfile({ styleVibes: ["Bold"] });
    await resetOnboarding();
    const complete = await isOnboardingComplete();
    const profile = await getStyleProfile();
    expect(complete).toBe(false);
    expect(profile.styleVibes).toEqual(defaultProfile.styleVibes);
  });
});

// ─── Design Token Tests ───────────────────────────────────────────────────────

describe("Threadly Design Tokens", () => {
  it("ThreadlyColors has required luxury palette keys", async () => {
    const { ThreadlyColors } = await import("../constants/threadly");
    expect(ThreadlyColors).toHaveProperty("roseGold");
    expect(ThreadlyColors).toHaveProperty("roseGoldLight");
    expect(ThreadlyColors).toHaveProperty("black");
    expect(ThreadlyColors).toHaveProperty("warmWhite");
    expect(ThreadlyColors).toHaveProperty("warmWhiteMuted");
    expect(ThreadlyColors).toHaveProperty("charcoal");
    expect(ThreadlyColors).toHaveProperty("charcoalLight");
  });

  it("ThreadlyColors roseGold is a valid hex color", async () => {
    const { ThreadlyColors } = await import("../constants/threadly");
    expect(ThreadlyColors.roseGold).toMatch(/^#[0-9A-Fa-f]{6}$/);
  });

  it("ThreadlySpacing has screenPadding defined", async () => {
    const { ThreadlySpacing } = await import("../constants/threadly");
    expect(ThreadlySpacing).toHaveProperty("screenPadding");
    expect(typeof ThreadlySpacing.screenPadding).toBe("number");
    expect(ThreadlySpacing.screenPadding).toBeGreaterThan(0);
  });

  it("ThreadlyRadius has standard radius values", async () => {
    const { ThreadlyRadius } = await import("../constants/threadly");
    expect(ThreadlyRadius).toHaveProperty("sm");
    expect(ThreadlyRadius).toHaveProperty("md");
    expect(ThreadlyRadius).toHaveProperty("lg");
    expect(ThreadlyRadius).toHaveProperty("xl");
    expect(ThreadlyRadius).toHaveProperty("pill");
  });

  it("defaultProfile has all required fields including closetSize", async () => {
    const { defaultProfile } = await import("../lib/onboarding-store");
    expect(defaultProfile).toHaveProperty("styleVibes");
    expect(defaultProfile).toHaveProperty("occasions");
    expect(defaultProfile).toHaveProperty("favoriteBrands");
    expect(defaultProfile).toHaveProperty("budgetMin");
    expect(defaultProfile).toHaveProperty("budgetMax");
    expect(defaultProfile).toHaveProperty("colorPreferences");
    expect(defaultProfile).toHaveProperty("topSize");
    expect(defaultProfile).toHaveProperty("bottomSize");
    expect(defaultProfile).toHaveProperty("shoeSize");
    expect(defaultProfile).toHaveProperty("closetSize");
  });
});
