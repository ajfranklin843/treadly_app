// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolWeight, SymbolViewProps } from "expo-symbols";
import { ComponentProps } from "react";
import { OpaqueColorValue, type StyleProp, type TextStyle } from "react-native";

type IconMapping = Record<SymbolViewProps["name"], ComponentProps<typeof MaterialIcons>["name"]>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * SF Symbols to Material Icons mappings for Threadly.
 */
const MAPPING = {
  // Navigation
  "house.fill": "home",
  "house": "home",
  "paperplane.fill": "send",
  "chevron.left.forwardslash.chevron.right": "code",
  "chevron.right": "chevron-right",
  "chevron.left": "chevron-left",
  "chevron.down": "keyboard-arrow-down",
  "chevron.up": "keyboard-arrow-up",
  // Threadly tabs
  "hanger": "checkroom",
  "sparkles": "auto-awesome",
  "bag.fill": "shopping-bag",
  "bag": "shopping-bag",
  "person.fill": "person",
  "person": "person",
  "magnifyingglass": "search",
  "bell.fill": "notifications",
  "bell": "notifications-none",
  // Closet / wardrobe
  "tshirt.fill": "checkroom",
  "tshirt": "checkroom",
  "camera.fill": "camera-alt",
  "camera": "camera-alt",
  "photo.fill": "photo",
  "photo": "photo",
  "plus": "add",
  "plus.circle.fill": "add-circle",
  "minus.circle.fill": "remove-circle",
  // Shopping / deals
  "tag.fill": "local-offer",
  "tag": "local-offer",
  "percent": "percent",
  "cart.fill": "shopping-cart",
  "cart": "shopping-cart",
  "heart.fill": "favorite",
  "heart": "favorite-border",
  "star.fill": "star",
  "star": "star-border",
  // AI / style
  "wand.and.stars": "auto-fix-high",
  "wand.and.stars.inverse": "auto-fix-high",
  "brain": "psychology",
  "lightbulb.fill": "lightbulb",
  "lightbulb": "lightbulb-outline",
  // Misc
  "xmark": "close",
  "xmark.circle.fill": "cancel",
  "checkmark": "check",
  "checkmark.circle.fill": "check-circle",
  "arrow.right": "arrow-forward",
  "arrow.left": "arrow-back",
  "arrow.up": "arrow-upward",
  "arrow.down": "arrow-downward",
  "ellipsis": "more-horiz",
  "ellipsis.circle": "more-horiz",
  "square.and.arrow.up": "ios-share",
  "trash.fill": "delete",
  "pencil": "edit",
  "gear": "settings",
  "info.circle": "info",
  "questionmark.circle": "help-outline",
} as IconMapping;

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
