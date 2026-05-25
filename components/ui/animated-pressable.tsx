/**
 * Threadly — AnimatedPressable & AnimatedCard
 * Reusable premium press-state components with scale + haptic feedback.
 */

import React, { useRef, useCallback, ReactNode } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  ViewStyle,
  StyleProp,
  Platform,
} from 'react-native';
import { ANIM, hapticLight } from '@/lib/animations';
import { ThreadlyColors } from '@/constants/threadly';

// ─── AnimatedPressable ────────────────────────────────────────────────────────

interface AnimatedPressableProps {
  children: ReactNode;
  onPress?: () => void;
  onLongPress?: () => void;
  style?: StyleProp<ViewStyle>;
  pressScale?: number;
  haptic?: boolean;
  disabled?: boolean;
  activeOpacity?: number;
}

export function AnimatedPressable({
  children,
  onPress,
  onLongPress,
  style,
  pressScale = ANIM.cardPressScale,
  haptic = true,
  disabled = false,
  activeOpacity = 1,
}: AnimatedPressableProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const handlePressIn = useCallback(() => {
    Animated.parallel([
      Animated.timing(scale, {
        toValue: pressScale,
        duration: ANIM.pressDuration,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: activeOpacity < 1 ? activeOpacity : 1,
        duration: ANIM.pressDuration,
        useNativeDriver: true,
      }),
    ]).start();
  }, [scale, opacity, pressScale, activeOpacity]);

  const handlePressOut = useCallback(() => {
    Animated.parallel([
      Animated.timing(scale, {
        toValue: 1,
        duration: ANIM.releaseDuration,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: ANIM.releaseDuration,
        useNativeDriver: true,
      }),
    ]).start();
  }, [scale, opacity]);

  const handlePress = useCallback(() => {
    if (haptic) hapticLight();
    onPress?.();
  }, [haptic, onPress]);

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      onLongPress={onLongPress}
      disabled={disabled}
      style={{ opacity: disabled ? 0.5 : 1 }}
    >
      <Animated.View style={[{ transform: [{ scale }], opacity }, style]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}

// ─── AnimatedCard ─────────────────────────────────────────────────────────────

interface AnimatedCardProps {
  children: ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  glowColor?: string;
  pressScale?: number;
  haptic?: boolean;
  noGlow?: boolean;
}

/**
 * Premium card with press scale + optional rose-gold glow border on press.
 */
export function AnimatedCard({
  children,
  onPress,
  style,
  glowColor = ThreadlyColors.roseGold,
  pressScale = ANIM.cardPressScale,
  haptic = true,
  noGlow = false,
}: AnimatedCardProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const glowOpacity = useRef(new Animated.Value(0)).current;
  const borderWidth = useRef(new Animated.Value(0)).current;

  const handlePressIn = useCallback(() => {
    if (haptic) hapticLight();
    Animated.parallel([
      Animated.timing(scale, {
        toValue: pressScale,
        duration: ANIM.pressDuration,
        useNativeDriver: true,
      }),
      ...(noGlow ? [] : [
        Animated.timing(glowOpacity, {
          toValue: 1,
          duration: ANIM.pressDuration,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [scale, glowOpacity, pressScale, haptic, noGlow]);

  const handlePressOut = useCallback(() => {
    Animated.parallel([
      Animated.timing(scale, {
        toValue: 1,
        duration: ANIM.releaseDuration,
        useNativeDriver: true,
      }),
      ...(noGlow ? [] : [
        Animated.timing(glowOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [scale, glowOpacity, noGlow]);

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      style={{ position: 'relative' }}
    >
      <Animated.View style={[{ transform: [{ scale }] }, style]}>
        {children}
        {/* Rose-gold glow border overlay */}
        {!noGlow && (
          <Animated.View
            pointerEvents="none"
            style={[
              StyleSheet.absoluteFill,
              {
                borderRadius: (style as ViewStyle)?.borderRadius ?? 16,
                borderWidth: 1,
                borderColor: glowColor,
                opacity: glowOpacity,
              },
            ]}
          />
        )}
      </Animated.View>
    </Pressable>
  );
}

// ─── HeartButton ──────────────────────────────────────────────────────────────

interface HeartButtonProps {
  saved: boolean;
  onToggle: () => void;
  size?: number;
}

export function HeartButton({ saved, onToggle, size = 22 }: HeartButtonProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const fillOpacity = useRef(new Animated.Value(saved ? 1 : 0)).current;

  const handlePress = useCallback(() => {
    const newSaved = !saved;
    if (newSaved) {
      // Burst animation
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.45, duration: 110, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1, useNativeDriver: true, bounciness: 10 }),
      ]).start();
      Animated.timing(fillOpacity, { toValue: 1, duration: 150, useNativeDriver: true }).start();
    } else {
      Animated.timing(scale, { toValue: 0.85, duration: 100, useNativeDriver: true }).start(() => {
        Animated.timing(scale, { toValue: 1, duration: 100, useNativeDriver: true }).start();
      });
      Animated.timing(fillOpacity, { toValue: 0, duration: 150, useNativeDriver: true }).start();
    }
    hapticLight();
    onToggle();
  }, [saved, scale, fillOpacity, onToggle]);

  return (
    <Pressable onPress={handlePress} style={{ padding: 6 }}>
      <Animated.View style={{ transform: [{ scale }] }}>
        {/* Outline heart */}
        <Animated.Text style={{ fontSize: size, opacity: fillOpacity.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }) }}>
          🤍
        </Animated.Text>
        {/* Filled heart — overlaid */}
        <Animated.Text
          style={{
            fontSize: size,
            position: 'absolute',
            top: 0,
            left: 0,
            opacity: fillOpacity,
          }}
        >
          🩷
        </Animated.Text>
      </Animated.View>
    </Pressable>
  );
}
