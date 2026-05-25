import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolWeight, SymbolViewProps } from "expo-symbols";
import { ComponentProps } from "react";
import { OpaqueColorValue, type StyleProp, type TextStyle } from "react-native";

type IconMapping = Record<string, ComponentProps<typeof MaterialIcons>["name"]>;
type IconSymbolName = keyof typeof MAPPING;

const MAPPING: IconMapping = {
  // Core navigation
  "house.fill": "home",
  "closet.fill": "checkroom",
  "shop.fill": "local-mall",
  "stylist.fill": "auto-awesome",
  // Generic
  "paperplane.fill": "send",
  "chevron.left.forwardslash.chevron.right": "code",
  "chevron.right": "chevron-right",
  "heart.fill": "favorite",
  "star.fill": "star",
  "person.fill": "person",
  "magnifyingglass": "search",
  "bell.fill": "notifications",
  "camera.fill": "camera-alt",
  "plus": "add",
  "xmark": "close",
  "checkmark": "check",
  "sparkles": "auto-awesome",
  "bag.fill": "shopping-bag",
  "tag.fill": "local-offer",
  "arrow.right": "arrow-forward",
};

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
  const mappedName = (MAPPING as Record<string, ComponentProps<typeof MaterialIcons>["name"]>)[name as string] ?? "help-outline";
  return <MaterialIcons color={color} size={size} name={mappedName} style={style} />;
}
