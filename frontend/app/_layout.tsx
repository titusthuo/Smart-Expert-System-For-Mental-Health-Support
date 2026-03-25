import { SessionInitializer } from "@/components/core/session-initializer";
import { Colors } from "@/constants/theme";
import { apolloClient } from "@/graphql/client";
import {
    ThemePreferenceProvider,
    useAppColorScheme,
} from "@/hooks/use-theme-preference";
import { useAuthSession } from "@/stores/useAuthSession";
import { ApolloProvider } from "@apollo/client";
import { Href, Stack, usePathname, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";
import { useEffect, useRef } from "react";
import { Platform, View } from "react-native";
import "react-native-reanimated";
import "../src/styles/global.css";

// Helpers to detect current navigation group
function isInAuthGroup(segments: string[]): boolean {
  return segments.length > 0 && segments[0] === "(auth)";
}

function isInTabsGroup(segments: string[]): boolean {
  return segments.length > 0 && segments[0] === "(tabs)";
}

const AuthNavigator = () => {
  const router = useRouter();
  const segments = useSegments();
  const pathname = usePathname();

  const colorScheme = useAppColorScheme() ?? "light";
  const isDark = colorScheme === "dark";
  const theme = Colors[isDark ? "dark" : "light"];

  const isAuthenticated = useAuthSession((s) => s.isAuthenticated);
  const isHydrated = useAuthSession((s) => s.isHydrated);
  const loadingSession = useAuthSession((s) => s.loadingSession);
  const lastAuthedPath = useAuthSession((s) => s.lastAuthedPath);

  const hasRedirectedRef = useRef(false);

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

    SystemUI.setBackgroundColorAsync(theme.background).catch(() => {
      // ignored
    });
  }, [theme.background]);

  useEffect(() => {
    if (!isHydrated || loadingSession) {
      if (__DEV__) {
        console.log("[AuthNavigator] still loading → waiting", {
          isHydrated,
          loadingSession,
          pathname,
          segments,
        });
      }
      return;
    }

    const inAuth = isInAuthGroup(segments);
    const inTabs = isInTabsGroup(segments);

    if (__DEV__) {
      console.log("[AuthNavigator] checking", {
        pathname,
        segments,
        isAuthenticated,
        inAuth,
        inTabs,
      });
    }

    // Reset redirect guard on each major change
    hasRedirectedRef.current = false;

    if (isAuthenticated) {
      // Authenticated → ensure we're in tabs group
      if (!inTabs) {
        hasRedirectedRef.current = true;

        let target: Href = "/(tabs)";

        if (
          typeof lastAuthedPath === "string" &&
          lastAuthedPath.trim() !== "" &&
          lastAuthedPath !== "/" &&
          !lastAuthedPath.startsWith("/(auth)")
        ) {
          target = lastAuthedPath as Href;
        }

        if (__DEV__) {
          console.log(
            "[AuthNavigator] → redirecting authenticated user to:",
            target,
          );
        }

        router.replace(target);
      }
    } else {
      // NOT authenticated → must be in auth group (or root/empty → redirect)
      if (!inAuth) {
        hasRedirectedRef.current = true;

        if (__DEV__) {
          console.log(
            "[AuthNavigator] → redirecting unauthenticated to sign-in (caught root/empty/unknown path)",
          );
        }

        router.replace("/(auth)/sign-in");
      }
      // If already in (auth) group → do nothing (correct state)
    }
  }, [
    isHydrated,
    loadingSession,
    isAuthenticated,
    segments,
    lastAuthedPath,
    router,
    pathname,
  ]);

  return null;
};

function SafeAuthNavigator() {
  const router = useRouter();
  const segments = useSegments();

  // Only render AuthNavigator if navigation context is available
  if (!router || !segments) {
    return null;
  }

  return <AuthNavigator />;
}

function RootLayoutContent() {
  const colorScheme = useAppColorScheme() ?? "light";
  const isDark = colorScheme === "dark";
  const theme = Colors[isDark ? "dark" : "light"];

  return (
    <View className={isDark ? "dark" : ""} style={{ flex: 1 }}>
      <StatusBar style={isDark ? "light" : "dark"} />
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
      </Stack>

      <SafeAuthNavigator />
    </View>
  );
}

export default function RootLayout() {
  return (
    <ThemePreferenceProvider>
      <SessionInitializer />
      <ApolloProvider client={apolloClient}>
        <RootLayoutContent />
      </ApolloProvider>
    </ThemePreferenceProvider>
  );
}
