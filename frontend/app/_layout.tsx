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
import React, { useEffect, useRef, useState } from "react";
import { AppState, Platform, View } from "react-native";
import "react-native-reanimated";
import "../src/styles/global.css";

// ── Error boundary to survive brief navigation-context loss on theme change ──
class NavigationErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidUpdate() {
    if (this.state.hasError) {
      // Recover on next tick — the navigation context is restored after
      // expo-router finishes remounting its internal NavigationContainer.
      setTimeout(() => this.setState({ hasError: false }), 0);
    }
  }

  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

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

// ── Module-level flag — survives component remounts caused by app resume ──
let _hasRedirected = false;

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
  // Mirror module-level flag into a ref so effect deps stay stable
  const hasRedirectedRef = useRef(_hasRedirected);

  useEffect(() => {
    setIsMounted(true);
    // Sync ref from module flag on mount (handles remount-after-resume)
    hasRedirectedRef.current = _hasRedirected;
  }, []);

  // Lock the guard whenever the app comes back to the foreground so a resume
  // from an external browser never triggers a spurious redirect.
  useEffect(() => {
    const sub = AppState.addEventListener("change", (state: string) => {
      if (state === "active" && _hasRedirected) {
        hasRedirectedRef.current = true;
      }
    });
    return () => sub.remove();
  }, []);

  // Reset the redirect guard when auth state genuinely changes (login/logout)
  // so that logout → sign-in redirect still fires.
  const prevAuthRef = useRef(isAuthenticated);
  useEffect(() => {
    if (prevAuthRef.current !== isAuthenticated) {
      _hasRedirected = false;
      hasRedirectedRef.current = false;
      prevAuthRef.current = isAuthenticated;
    }
  }, [isAuthenticated]);

  // Keep lastAuthedPath in sync while user navigates inside authed areas.
  useEffect(() => {
    if (!hasRedirectedRef.current) return;
    if (!isAuthenticated || !pathname || pathname === "/") return;
    if (pathname.startsWith("/(tabs)")) {
      setLastAuthedPath(pathname);
    }
  }, [pathname, isAuthenticated, setLastAuthedPath]);

  useEffect(() => {
    if (Platform.OS === "web") {
      const root = document.documentElement;
      isDark ? root.classList.add("dark") : root.classList.remove("dark");
    }
  }, [isDark]);

  useEffect(() => {
    if (Platform.OS !== "android") return;
    SystemUI.setBackgroundColorAsync(theme.background).catch(() => {});
  }, [theme.background]);

  useEffect(() => {
    if (!isMounted) return;
    if (!navigationState?.key) return;
    if (!isHydrated || loadingSession) return;

    // If the guard already fired (including across remounts), bail out.
    if (hasRedirectedRef.current) return;

    const inAuth = isInAuthGroup(segments);
    const inTabs = isInTabsGroup(segments);
    const inOnboarding = isInOnboardingRoute(segments);
    const inTherapistDetail = segments.length > 0 && segments[0] === "therapist-detail";
    const inArticleViewer = segments.length > 0 && segments[0] === "article-viewer";

    if (isAuthenticated) {
      if (inTherapistDetail || inArticleViewer) {
        _hasRedirected = true;
        hasRedirectedRef.current = true;
        return;
      }

      if (inTabs) {
        _hasRedirected = true;
        hasRedirectedRef.current = true;

        if (
          typeof lastAuthedPath === "string" &&
          lastAuthedPath.startsWith("/(tabs)") &&
          lastAuthedPath !== pathname
        ) {
          if (__DEV__) console.log("[AuthNavigator] → restoring last tab:", lastAuthedPath);
          router.replace(lastAuthedPath as Href);
        }
        return;
      }

      // Authenticated but not in a valid screen → redirect once
      _hasRedirected = true;
      hasRedirectedRef.current = true;

      let target: Href = "/(tabs)";
      if (
        typeof lastAuthedPath === "string" &&
        lastAuthedPath.trim() !== "" &&
        lastAuthedPath !== "/" &&
        !lastAuthedPath.startsWith("/(auth)") &&
        !lastAuthedPath.startsWith("/therapist-detail") &&
        !lastAuthedPath.startsWith("/article-viewer")
      ) {
        target = lastAuthedPath as Href;
      }

      if (__DEV__) console.log("[AuthNavigator] → redirecting authenticated user to:", target);
      router.replace(target);
    } else {
      if (!hasSeenOnboarding) {
        if (!inOnboarding) {
          _hasRedirected = true;
          hasRedirectedRef.current = true;
          if (__DEV__) console.log("[AuthNavigator] → redirecting to onboarding");
          router.replace("/onboarding");
        }
        return;
      }

      if (!inAuth) {
        _hasRedirected = true;
        hasRedirectedRef.current = true;
        if (__DEV__) console.log("[AuthNavigator] → redirecting unauthenticated to sign-in");
        router.replace("/(auth)/sign-in");
      }
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
          <Stack.Screen
            name="article-viewer"
            options={{
              headerShown: false,
              animation: "slide_from_right",
            }}
          />
          <Stack.Screen name="+not-found" options={{ headerShown: false }} />
        </Stack>

        {/* Renderless — must stay inside the NavigationContainer tree provided by Stack */}
        <NavigationErrorBoundary>
          <SafeAuthNavigator />
        </NavigationErrorBoundary>
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
        <NavigationErrorBoundary>
          <RootLayoutContent />
        </NavigationErrorBoundary>
      </ApolloProvider>
    </ThemePreferenceProvider>
  );
}
