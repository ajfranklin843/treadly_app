// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolWeight, SymbolViewProps } from "expo-symbols";
import { ComponentProps } from "react";
import { OpaqueColorValue, type StyleProp, type TextStyle } from "react-native";

type IconMapping = Record<SymbolViewProps["name"], ComponentProps<typeof MaterialIcons>["name"]>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * SF Symbols → Material Icons mappings for Threadly tab bar.
 */
const MAPPING = {
  // Core navigation
  "house.fill": "home",
  "house": "home",
  "sparkles": "auto-awesome",
  "sparkles.fill": "auto-awesome",
  "hanger": "checkroom",
  "bag.fill": "shopping-bag",
  "bag": "shopping-bag",
  "message.fill": "chat",
  "message": "chat",
  // Utility
  "paperplane.fill": "send",
  "chevron.left.forwardslash.chevron.right": "code",
  "chevron.right": "chevron-right",
  "chevron.left": "chevron-left",
  "xmark": "close",
  "plus": "add",
  "heart.fill": "favorite",
  "heart": "favorite-border",
  "camera.fill": "camera-alt",
  "camera": "camera-alt",
  "magnifyingglass": "search",
  "person.fill": "person",
  "person": "person",
  "gearshape.fill": "settings",
  "arrow.right": "arrow-forward",
  "arrow.left": "arrow-back",
  "star.fill": "star",
  "star": "star-border",
  "tag.fill": "local-offer",
  "tag": "local-offer",
  "bolt.fill": "bolt",
  "bolt": "bolt",
} as unknown as IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
