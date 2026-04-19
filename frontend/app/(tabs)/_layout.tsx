import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui";
import { AuthPalette, Colors } from "@/constants/theme";
import { useAppColorScheme } from "@/hooks/use-theme-preference";
import { Tabs } from "expo-router";

export default function TabLayout() {
  const colorScheme = useAppColorScheme() ?? "light";
  const isDark = colorScheme === "dark";
  const theme = Colors[isDark ? "dark" : "light"];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: isDark ? AuthPalette.brandDark : AuthPalette.brand,
        tabBarInactiveTintColor: theme.mutedForeground,
        tabBarStyle: {
          backgroundColor: theme.card,
          borderTopColor: theme.border,
          borderTopWidth: 1,
          elevation: 0,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
          marginBottom: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />

      {/* Chat */}
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="chatbubble.fill" color={color} />
          ),
        }}
      />

      {/* Therapists */}
      <Tabs.Screen
        name="therapists"
        options={{
          title: "Therapists",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="people.fill" color={color} />
          ),
        }}
      />

      {/* Education */}
      <Tabs.Screen
        name="education"
        options={{
          title: "Education",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="book.fill" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="person.fill" color={color} />
          ),
        }}
      />

    </Tabs>
  );
}
