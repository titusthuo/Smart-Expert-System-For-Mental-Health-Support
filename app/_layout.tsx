import { Colors } from "@/constants/theme";
import { ThemePreferenceProvider, useAppColorScheme } from "@/hooks/use-theme-preference";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";
import { useEffect } from "react";
import { Platform, View } from "react-native";
import "react-native-reanimated";
import "../global.css";

export const unstable_settings = {
  anchor: "(auth)",
};

function RootLayoutContent() {
  const colorScheme = useAppColorScheme() ?? "light";
  const isDark = colorScheme === "dark";
  const theme = Colors[isDark ? "dark" : "light"];

  useEffect(() => {
    if (Platform.OS === "web") {
      const root = document.documentElement;
      if (isDark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
  }, [isDark]);

  useEffect(() => {
    if (Platform.OS !== "android") return;

    SystemUI.setBackgroundColorAsync(theme.background).catch(() => undefined);

    (async () => {
      try {
        // Optional dependency: if installed, we can theme the Android navigation bar.
        // Using require() avoids a hard TypeScript module dependency.
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const NavigationBar = require("expo-navigation-bar") as {
          setBackgroundColorAsync?: (color: string) => Promise<void>;
          setButtonStyleAsync?: (style: "light" | "dark") => Promise<void>;
        };

        await NavigationBar.setBackgroundColorAsync?.(theme.background);
        await NavigationBar.setButtonStyleAsync?.(isDark ? "light" : "dark");
      } catch {
        // ignore if expo-navigation-bar isn't installed/available
      }
    })();
  }, [isDark, theme.background]);

  return (
    <View className={isDark ? "dark" : ""} style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.card,
          },
          headerTintColor: theme.foreground,
          headerTitleStyle: {
            fontWeight: "bold",
          },
          contentStyle: {
            backgroundColor: theme.background,
          },
        }}
      >
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <StatusBar style={isDark ? "light" : "dark"} />
      </Stack>
    </View>
  );
}

export default function RootLayout() {
  return (
    <ThemePreferenceProvider>
      <RootLayoutContent />
    </ThemePreferenceProvider>
  );
}
