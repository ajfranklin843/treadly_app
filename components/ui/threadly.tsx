/**
 * THREADLY Core UI Components
 * Premium design system components for the Threadly fashion app.
 */

import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  type TextProps,
  type ViewProps,
  type TouchableOpacityProps,
} from 'react-native';
import { ThreadlyColors, ThreadlyRadius, ThreadlySpacing, ThreadlyShadow } from '@/constants/threadly';

// ─── Typography ──────────────────────────────────────────────────────────────

type TTextVariant =
  | 'hero'        // Large serif display — 36–48px
  | 'display'     // Section headers — 28–32px serif
  | 'headline'    // Card headlines — 20–24px serif
  | 'title'       // Screen titles — 18–20px sans medium
  | 'body'        // Body copy — 15–16px sans regular
  | 'caption'     // Labels, captions — 12–13px sans
  | 'overline'    // Small caps labels — 11px sans uppercase
  | 'price'       // Price display — 18px sans bold
  | 'priceOld'    // Strikethrough price — 14px muted
  | 'deal';       // Deal percentage — 13px success

interface TTextProps extends TextProps {
  variant?: TTextVariant;
  color?: string;
  center?: boolean;
  italic?: boolean;
}

export function TText({
  variant = 'body',
  color,
  center,
  italic,
  style,
  children,
  ...props
}: TTextProps) {
  const variantStyle = textVariants[variant];
  return (
    <Text
      style={[
        variantStyle,
        color ? { color } : undefined,
        center ? { textAlign: 'center' } : undefined,
        italic ? { fontStyle: 'italic' } : undefined,
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
}

const textVariants = StyleSheet.create({
  hero: {
    fontSize: 40,
    fontFamily: 'Georgia',
    fontWeight: '400',
    color: ThreadlyColors.warmWhite,
    lineHeight: 48,
    letterSpacing: -0.5,
  },
  display: {
    fontSize: 28,
    fontFamily: 'Georgia',
    fontWeight: '400',
    color: ThreadlyColors.warmWhite,
    lineHeight: 34,
    letterSpacing: -0.3,
  },
  headline: {
    fontSize: 20,
    fontFamily: 'Georgia',
    fontWeight: '400',
    color: ThreadlyColors.warmWhite,
    lineHeight: 26,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: ThreadlyColors.warmWhite,
    lineHeight: 22,
    letterSpacing: 0.1,
  },
  body: {
    fontSize: 15,
    fontWeight: '400',
    color: ThreadlyColors.warmWhiteMuted,
    lineHeight: 22,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400',
    color: ThreadlyColors.warmWhiteSubtle,
    lineHeight: 16,
  },
  overline: {
    fontSize: 10,
    fontWeight: '600',
    color: ThreadlyColors.roseGold,
    lineHeight: 14,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: ThreadlyColors.warmWhite,
    lineHeight: 22,
  },
  priceOld: {
    fontSize: 13,
    fontWeight: '400',
    color: ThreadlyColors.warmWhiteSubtle,
    lineHeight: 18,
    textDecorationLine: 'line-through',
  },
  deal: {
    fontSize: 12,
    fontWeight: '700',
    color: ThreadlyColors.success,
    lineHeight: 16,
  },
});

// ─── Card ─────────────────────────────────────────────────────────────────────

interface TCardProps extends ViewProps {
  variant?: 'default' | 'elevated' | 'outlined' | 'blush';
  padding?: number;
}

export function TCard({ variant = 'default', padding, style, children, ...props }: TCardProps) {
  const variantStyle = cardVariants[variant];
  return (
    <View
      style={[
        styles.cardBase,
        variantStyle,
        padding !== undefined ? { padding } : undefined,
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

const cardVariants = StyleSheet.create({
  default: {
    backgroundColor: ThreadlyColors.charcoal,
  },
  elevated: {
    backgroundColor: ThreadlyColors.charcoal,
    ...ThreadlyShadow.card,
  },
  outlined: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: ThreadlyColors.charcoalLight,
  },
  blush: {
    backgroundColor: ThreadlyColors.blushDark,
    borderWidth: 1,
    borderColor: ThreadlyColors.roseGoldDim,
  },
});

const styles = StyleSheet.create({
  cardBase: {
    borderRadius: ThreadlyRadius.xl,
    padding: ThreadlySpacing.base,
    overflow: 'hidden',
  },
});

// ─── Button ───────────────────────────────────────────────────────────────────

type TButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'deal';

interface TButtonProps extends TouchableOpacityProps {
  variant?: TButtonVariant;
  label: string;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

export function TButton({
  variant = 'primary',
  label,
  size = 'md',
  fullWidth,
  icon,
  style,
  ...props
}: TButtonProps) {
  const btnStyle = buttonVariants[variant];
  const sizeStyle = buttonSizes[size];
  const labelStyle = buttonLabelVariants[variant];
  const labelSizeStyle = buttonLabelSizes[size];

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        btnStyles.base,
        btnStyle,
        sizeStyle,
        fullWidth ? { width: '100%' } : undefined,
        style,
      ]}
      {...props}
    >
      {icon && <View style={{ marginRight: 6 }}>{icon}</View>}
      <Text style={[btnStyles.label, labelStyle, labelSizeStyle]}>{label}</Text>
    </TouchableOpacity>
  );
}

const buttonVariants = StyleSheet.create({
  primary: {
    backgroundColor: ThreadlyColors.roseGold,
    ...ThreadlyShadow.roseGlow,
  },
  secondary: {
    backgroundColor: ThreadlyColors.charcoalMid,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: ThreadlyColors.roseGold,
  },
  deal: {
    backgroundColor: ThreadlyColors.dealBg,
    borderWidth: 1,
    borderColor: ThreadlyColors.deal,
  },
});

const buttonSizes = StyleSheet.create({
  sm: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: ThreadlyRadius.pill },
  md: { paddingHorizontal: 24, paddingVertical: 14, borderRadius: ThreadlyRadius.pill },
  lg: { paddingHorizontal: 32, paddingVertical: 18, borderRadius: ThreadlyRadius.pill },
});

const buttonLabelVariants = StyleSheet.create({
  primary: { color: ThreadlyColors.warmWhite },
  secondary: { color: ThreadlyColors.warmWhite },
  ghost: { color: ThreadlyColors.roseGold },
  outline: { color: ThreadlyColors.roseGold },
  deal: { color: ThreadlyColors.deal },
});

const buttonLabelSizes = StyleSheet.create({
  sm: { fontSize: 13, fontWeight: '600', letterSpacing: 0.3 },
  md: { fontSize: 15, fontWeight: '600', letterSpacing: 0.3 },
  lg: { fontSize: 16, fontWeight: '700', letterSpacing: 0.5 },
});

const btnStyles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {},
});

// ─── Badge / Pill ─────────────────────────────────────────────────────────────

interface TPillProps extends ViewProps {
  label: string;
  variant?: 'rose' | 'blush' | 'dark' | 'success' | 'outline';
  size?: 'sm' | 'md';
  selected?: boolean;
}

export function TPill({ label, variant = 'dark', size = 'md', selected, style, ...props }: TPillProps) {
  const pillStyle = pillVariants[selected ? 'rose' : variant];
  const pillSize = pillSizes[size];
  const labelColor = pillLabelColors[selected ? 'rose' : variant];

  return (
    <View style={[pillBase.container, pillStyle, pillSize, style]} {...props}>
      <Text style={[pillBase.label, { color: labelColor }, size === 'sm' ? { fontSize: 11 } : {}]}>
        {label}
      </Text>
    </View>
  );
}

const pillVariants = StyleSheet.create({
  rose: { backgroundColor: ThreadlyColors.roseGold },
  blush: { backgroundColor: ThreadlyColors.blushDark, borderWidth: 1, borderColor: ThreadlyColors.roseGoldDim },
  dark: { backgroundColor: ThreadlyColors.charcoalMid },
  success: { backgroundColor: ThreadlyColors.dealBg, borderWidth: 1, borderColor: ThreadlyColors.deal },
  outline: { backgroundColor: 'transparent', borderWidth: 1, borderColor: ThreadlyColors.charcoalLight },
});

const pillSizes = StyleSheet.create({
  sm: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: ThreadlyRadius.pill },
  md: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: ThreadlyRadius.pill },
});

const pillLabelColors: Record<string, string> = {
  rose: ThreadlyColors.warmWhite,
  blush: ThreadlyColors.roseGoldLight,
  dark: ThreadlyColors.warmWhiteMuted,
  success: ThreadlyColors.success,
  outline: ThreadlyColors.warmWhiteMuted,
};

const pillBase = StyleSheet.create({
  container: { alignSelf: 'flex-start' },
  label: { fontSize: 12, fontWeight: '600', letterSpacing: 0.2 },
});

// ─── Divider ──────────────────────────────────────────────────────────────────

export function TDivider({ style }: ViewProps) {
  return (
    <View
      style={[
        { height: 1, backgroundColor: ThreadlyColors.charcoalLight, marginVertical: ThreadlySpacing.base },
        style,
      ]}
    />
  );
}

// ─── Rose Gold Sparkle Icon ───────────────────────────────────────────────────

export function TSparkle({ size = 16, color = ThreadlyColors.roseGold }: { size?: number; color?: string }) {
  return (
    <Text style={{ fontSize: size, color }}>✦</Text>
  );
}
