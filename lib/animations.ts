/**
 * Threadly — Animation Utilities
 * Shared micro-interaction primitives for Apple-level polish.
 * All durations and scales are calibrated for luxury feel: subtle, fast, precise.
 */

import { useRef, useEffect, useCallback } from 'react';
import { Animated, Platform } from 'react-native';

// ─── Timing Constants ─────────────────────────────────────────────────────────

export const ANIM = {
  /** Standard press feedback — fast, snappy */
  pressDuration: 80,
  /** Release duration — slightly slower for feel */
  releaseDuration: 150,
  /** Image fade-in */
  fadeInDuration: 350,
  /** Stagger delay between list items */
  staggerDelay: 60,
  /** Entrance animation duration */
  entranceDuration: 300,
  /** Pulse cycle duration */
  pulseDuration: 1800,
  /** Scale for primary card press */
  cardPressScale: 0.97,
  /** Scale for small element press */
  smallPressScale: 0.94,
  /** Scale for large hero press */
  heroPressScale: 0.985,
  /** Scale for icon/chip press */
  chipPressScale: 0.92,
} as const;

// ─── useScalePress ────────────────────────────────────────────────────────────

/**
 * Returns animated scale value + press handlers for a pressable element.
 * Usage: const { scale, onPressIn, onPressOut } = useScalePress();
 *        <Animated.View style={{ transform: [{ scale }] }} />
 */
export function useScalePress(toScale: number = ANIM.cardPressScale) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = useCallback(() => {
    Animated.timing(scale, {
      toValue: toScale,
      duration: ANIM.pressDuration,
      useNativeDriver: true,
    }).start();
  }, [scale, toScale]);

  const onPressOut = useCallback(() => {
    Animated.timing(scale, {
      toValue: 1,
      duration: ANIM.releaseDuration,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  return { scale, onPressIn, onPressOut };
}

// ─── useFadeIn ────────────────────────────────────────────────────────────────

/**
 * Fades element in on mount. Optionally delayed for stagger effects.
 * Usage: const opacity = useFadeIn(delay);
 *        <Animated.View style={{ opacity }} />
 */
export function useFadeIn(delay = 0, duration = ANIM.fadeInDuration) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 1,
        duration,
        useNativeDriver: true,
      }).start();
    }, delay);
    return () => clearTimeout(timer);
  }, []);

  return opacity;
}

// ─── useSlideUp ───────────────────────────────────────────────────────────────

/**
 * Slides element up from a small offset on mount. Good for card entrances.
 */
export function useSlideUp(delay = 0, fromY = 16) {
  const translateY = useRef(new Animated.Value(fromY)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: ANIM.entranceDuration,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: ANIM.entranceDuration,
          useNativeDriver: true,
        }),
      ]).start();
    }, delay);
    return () => clearTimeout(timer);
  }, []);

  return { translateY, opacity };
}

// ─── useImageFade ─────────────────────────────────────────────────────────────

/**
 * Returns opacity + onLoad handler for smooth image fade-in.
 * Usage: const { imageOpacity, onImageLoad } = useImageFade();
 *        <Animated.Image style={{ opacity: imageOpacity }} onLoad={onImageLoad} />
 */
export function useImageFade() {
  const imageOpacity = useRef(new Animated.Value(0)).current;

  const onImageLoad = useCallback(() => {
    Animated.timing(imageOpacity, {
      toValue: 1,
      duration: ANIM.fadeInDuration,
      useNativeDriver: true,
    }).start();
  }, [imageOpacity]);

  return { imageOpacity, onImageLoad };
}

// ─── useHeartAnimation ────────────────────────────────────────────────────────

/**
 * Heart save animation — scale burst on toggle.
 * Returns scale value + toggle function.
 */
export function useHeartAnimation() {
  const scale = useRef(new Animated.Value(1)).current;

  const burst = useCallback(() => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 1.4, duration: 120, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, bounciness: 8 }),
    ]).start();
  }, [scale]);

  return { heartScale: scale, burstHeart: burst };
}

// ─── useGlowPulse ─────────────────────────────────────────────────────────────

/**
 * Continuous subtle glow pulse for CTAs and FABs.
 * Returns opacity value that loops between 0.6 and 1.
 */
export function useGlowPulse() {
  const glow = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glow, { toValue: 1, duration: ANIM.pulseDuration / 2, useNativeDriver: true }),
        Animated.timing(glow, { toValue: 0.7, duration: ANIM.pulseDuration / 2, useNativeDriver: true }),
      ])
    ).start();
    return () => glow.stopAnimation();
  }, []);

  return glow;
}

// ─── useStaggerEntrance ───────────────────────────────────────────────────────

/**
 * Stagger entrance for a list of N items.
 * Returns array of { opacity, translateY } animated values.
 */
export function useStaggerEntrance(count: number, baseDelay = 100) {
  const anims = useRef(
    Array.from({ length: count }, () => ({
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(12),
    }))
  ).current;

  useEffect(() => {
    const animations = anims.map((anim, i) =>
      Animated.parallel([
        Animated.timing(anim.opacity, {
          toValue: 1,
          duration: ANIM.entranceDuration,
          delay: baseDelay + i * ANIM.staggerDelay,
          useNativeDriver: true,
        }),
        Animated.timing(anim.translateY, {
          toValue: 0,
          duration: ANIM.entranceDuration,
          delay: baseDelay + i * ANIM.staggerDelay,
          useNativeDriver: true,
        }),
      ])
    );
    Animated.parallel(animations).start();
  }, []);

  return anims;
}

// ─── useActiveTabScale ────────────────────────────────────────────────────────

/**
 * Tab icon scale bounce when a tab becomes active.
 */
export function useActiveTabScale(isActive: boolean) {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isActive) {
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.2, duration: 100, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1, useNativeDriver: true, bounciness: 6 }),
      ]).start();
    }
  }, [isActive]);

  return scale;
}

// ─── Haptics helper ───────────────────────────────────────────────────────────

/**
 * Safe haptic trigger — no-ops on web.
 */
export async function hapticLight() {
  if (Platform.OS === 'web') return;
  try {
    const Haptics = await import('expo-haptics');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  } catch {}
}

export async function hapticMedium() {
  if (Platform.OS === 'web') return;
  try {
    const Haptics = await import('expo-haptics');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  } catch {}
}

export async function hapticSuccess() {
  if (Platform.OS === 'web') return;
  try {
    const Haptics = await import('expo-haptics');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  } catch {}
}
