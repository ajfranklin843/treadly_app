import { Tabs } from "expo-router";
import { Platform, View, Text, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { ThreadlyColors, ThreadlyRadius } from "@/constants/threadly";
import { useColors } from "@/hooks/use-colors";

export default function TabLayout() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const bottomPadding = Platform.OS === "web" ? 12 : Math.max(insets.bottom, 8);
  const tabBarHeight = 60 + bottomPadding;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: ThreadlyColors.roseGold,
        tabBarInactiveTintColor: "rgba(250,247,244,0.35)",
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          paddingTop: 8,
          paddingBottom: bottomPadding,
          height: tabBarHeight,
          backgroundColor: "#0F0F0F",
          borderTopColor: "rgba(201,149,106,0.12)",
          borderTopWidth: 0.5,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "600",
          letterSpacing: 0.5,
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <IconSymbol size={22} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="closet"
        options={{
          title: "Closet",
          tabBarIcon: ({ color }) => <IconSymbol size={22} name="closet.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="looks"
        options={{
          title: "Looks",
          tabBarIcon: ({ color }) => <IconSymbol size={22} name="looks.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="gonew"
        options={{
          title: "",
          tabBarIcon: ({ focused }) => (
            <View style={[styles.goNewTab, focused && styles.goNewTabFocused]}>
              <Text style={styles.goNewTabText}>✦</Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="shop"
        options={{
          title: "Shop",
          tabBarIcon: ({ color }) => <IconSymbol size={22} name="shop.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="stylist"
        options={{
          title: "Stylist",
          tabBarIcon: ({ color }) => <IconSymbol size={22} name="stylist.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  goNewTab: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: ThreadlyColors.roseGold,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
    shadowColor: ThreadlyColors.roseGold,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.55,
    shadowRadius: 10,
    elevation: 8,
  },
  goNewTabFocused: {
    backgroundColor: ThreadlyColors.roseGoldLight,
    shadowOpacity: 0.75,
  },
  goNewTabText: {
    fontSize: 20,
    color: "#0A0A0A",
  },
});
