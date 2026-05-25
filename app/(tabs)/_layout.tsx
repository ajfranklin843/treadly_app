/**
 * Threadly — Tab Navigation
 * Premium dark tab bar with rose gold accents.
 * Center "Go New" button is the signature action.
 */

import { Tabs } from "expo-router";
import { View, Text, StyleSheet, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { ThreadlyColors } from "@/constants/threadly";

const TAB_BG = "#0E0E0E";
const TAB_BORDER = "rgba(255,255,255,0.06)";

function GoNewTabIcon({ focused }: { focused: boolean }) {
  return (
    <View style={[styles.goNewBtn, focused && styles.goNewBtnActive]}>
      <Text style={styles.goNewIcon}>✦</Text>
    </View>
  );
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const bottomPadding = Platform.OS === "web" ? 12 : Math.max(insets.bottom, 8);
  const tabBarHeight = 60 + bottomPadding;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: ThreadlyColors.roseGoldLight,
        tabBarInactiveTintColor: "rgba(255,255,255,0.35)",
        tabBarStyle: {
          backgroundColor: TAB_BG,
          borderTopColor: TAB_BORDER,
          borderTopWidth: 1,
          height: tabBarHeight,
          paddingTop: 8,
          paddingBottom: bottomPadding,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "600",
          letterSpacing: 0.3,
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol size={22} name="house.fill" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="closet"
        options={{
          title: "Closet",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={22} name="hanger" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="gonew"
        options={{
          title: "",
          tabBarIcon: ({ focused }) => <GoNewTabIcon focused={focused} />,
          tabBarLabel: () => null,
        }}
      />

      <Tabs.Screen
        name="shop"
        options={{
          title: "Shop",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={22} name="bag.fill" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="stylist"
        options={{
          title: "Stylist",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={22} name="message.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  goNewBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: ThreadlyColors.charcoal,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
    borderWidth: 1.5,
    borderColor: "rgba(201,149,106,0.4)",
    shadowColor: ThreadlyColors.roseGold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  goNewBtnActive: {
    backgroundColor: "#1A1208",
    borderColor: ThreadlyColors.roseGold,
    shadowOpacity: 0.6,
    shadowRadius: 12,
  },
  goNewIcon: {
    fontSize: 20,
    color: ThreadlyColors.roseGold,
  },
});
