import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Platform, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { ThreadlyColors } from "@/constants/threadly";

function GoNewTabButton({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity
      style={goNewStyles.container}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <LinearGradient
        colors={[ThreadlyColors.roseGold, ThreadlyColors.roseGoldLight]}
        style={goNewStyles.circle}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={goNewStyles.icon}>✦</Text>
      </LinearGradient>
      <Text style={goNewStyles.label}>Go New</Text>
    </TouchableOpacity>
  );
}

const goNewStyles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: -16,
    gap: 3,
  },
  circle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: ThreadlyColors.roseGold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 10,
  },
  icon: {
    fontSize: 20,
    color: ThreadlyColors.warmWhite,
    fontWeight: "700",
  },
  label: {
    fontSize: 10,
    color: ThreadlyColors.roseGold,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
});

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const bottomPadding = Platform.OS === "web" ? 12 : Math.max(insets.bottom, 8);
  const tabBarHeight = 64 + bottomPadding;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: ThreadlyColors.roseGold,
        tabBarInactiveTintColor: ThreadlyColors.warmWhiteSubtle,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          paddingTop: 8,
          paddingBottom: bottomPadding,
          height: tabBarHeight,
          backgroundColor: ThreadlyColors.charcoal,
          borderTopColor: "rgba(201,149,106,0.15)",
          borderTopWidth: 1,
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
          tabBarIcon: ({ color, size }) => (
            <IconSymbol size={size} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="closet"
        options={{
          title: "Closet",
          tabBarIcon: ({ color, size }) => (
            <IconSymbol size={size} name="hanger" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="gonew"
        options={{
          title: "",
          tabBarButton: (props) => (
            <GoNewTabButton onPress={() => router.push("/(tabs)/gonew")} />
          ),
        }}
      />
      <Tabs.Screen
        name="looks"
        options={{
          title: "Looks",
          tabBarIcon: ({ color, size }) => (
            <IconSymbol size={size} name="sparkles" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="shop"
        options={{
          title: "Shop",
          tabBarIcon: ({ color, size }) => (
            <IconSymbol size={size} name="bag.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
