import { SecurityQuestionProvider } from "@/components/auth/security-question-provider";
import { SessionInitializer } from "@/components/core/session-initializer";
import { ThemedAlertProvider } from "@/components/ui";
import { Colors } from "@/constants/theme";
import { apolloClient } from "@/graphql/client";
import {
    ThemePreferenceProvider,
    useAppColorScheme,
} from "@/hooks/use-theme-preference";
import { useAuthSession } from "@/stores/useAuthSession";
import { ApolloProvider } from "@apollo/client";
import {
    Href,
    Stack,
    usePathname,
    useRootNavigationState,
    useRouter,
    useSegments,
} from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";
import { useEffect, useRef, useState } from "react";
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

function isInOnboardingRoute(segments: string[]): boolean {
  return segments.length > 0 && segments[0] === "onboarding";
}

const AuthNavigator = () => {
  const router = useRouter();
  const segments = useSegments();
  const pathname = usePathname();
  const navigationState = useRootNavigationState();
  const [isMounted, setIsMounted] = useState(false);

  const colorScheme = useAppColorScheme() ?? "light";
  const isDark = colorScheme === "dark";
  const theme = Colors[isDark ? "dark" : "light"];

  const isAuthenticated = useAuthSession((s) => s.isAuthenticated);
  const isHydrated = useAuthSession((s) => s.isHydrated);
  const loadingSession = useAuthSession((s) => s.loadingSession);
  const lastAuthedPath = useAuthSession((s) => s.lastAuthedPath);
  const hasSeenOnboarding = useAuthSession((s) => s.hasSeenOnboarding);

  const setLastAuthedPath = useAuthSession((s) => s.setLastAuthedPath);
  const hasRedirectedRef = useRef(false);

  // Mark component as mounted after first render
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Keep lastAuthedPath in sync while user navigates inside authed areas
  useEffect(() => {
    if (!isAuthenticated || !pathname || pathname === "/") return;

    if (
      pathname.startsWith("/(tabs)") ||
      pathname.startsWith("/therapist-detail")
    ) {
      setLastAuthedPath(pathname);
    }
  }, [pathname, isAuthenticated, setLastAuthedPath]);

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
    // Guard: component not mounted yet
    if (!isMounted) return;

    // Guard: navigation tree not ready yet
    if (!navigationState?.key) return;

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
    const inOnboarding = isInOnboardingRoute(segments);

    if (__DEV__) {
      console.log("[AuthNavigator] checking", {
        pathname,
        segments,
        isAuthenticated,
        inAuth,
        inTabs,
      });
    }

    // therapist-detail is a top-level route accessed from tabs; don't redirect away
    const inTherapistDetail = segments.length > 0 && segments[0] === "therapist-detail";

    if (isAuthenticated) {
      // Already in a valid authed area → lock the redirect guard so transient
      // segment changes during app resume never trigger a stale redirect.
      if (inTabs || inTherapistDetail) {
        hasRedirectedRef.current = true;
        return;
      }

      // Authenticated but not in tabs/detail → redirect
      if (!hasRedirectedRef.current) {
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
      // NOT authenticated → show onboarding first, then auth group
      if (!hasSeenOnboarding) {
        if (!inOnboarding) {
          hasRedirectedRef.current = true;

          if (__DEV__) {
            console.log(
              "[AuthNavigator] → redirecting unauthenticated to onboarding",
            );
          }

          router.replace("/onboarding");
        }
        return;
      }

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
    isMounted,
    navigationState?.key,
    isHydrated,
    loadingSession,
    isAuthenticated,
    hasSeenOnboarding,
    segments,
    lastAuthedPath,
    router,
    pathname,
  ]);

  return null;
};

const SafeAuthNavigator = () => {
  // Don't render AuthNavigator until the navigation tree is fully ready.
  // This prevents "Couldn't find a navigation context" crashes when the
  // system theme changes and triggers a full re-render cycle.
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const navigationState = useRootNavigationState();
    if (!navigationState?.key) return null;
    return <AuthNavigator />;
  } catch {
    return null;
  }
};

function RootLayoutContent() {
  const colorScheme = useAppColorScheme() ?? "light";
  const isDark = colorScheme === "dark";
  const theme = Colors[isDark ? "dark" : "light"];

  return (
    <ThemedAlertProvider>
    <SecurityQuestionProvider>
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
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="therapist-detail"
            options={{
              headerShown: false,
              presentation: "transparentModal",
              animation: "slide_from_bottom",
              gestureEnabled: true,
              gestureDirection: "vertical",
            }}
          />
          <Stack.Screen name="+not-found" options={{ headerShown: false }} />
        </Stack>

        <SafeAuthNavigator />
      </View>
    </SecurityQuestionProvider>
    </ThemedAlertProvider>
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
