import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Platform, useColorScheme as useRNColorScheme } from "react-native";

export type ThemeMode = "light" | "dark" | "system";

type ThemePreferenceContextValue = {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  resolvedScheme: "light" | "dark";
  isDark: boolean;
  hasHydrated: boolean;
};

const ThemePreferenceContext = createContext<ThemePreferenceContextValue | null>(null);

const STORAGE_KEY = "themeMode";

async function safeGetItem(key: string): Promise<string | null> {
  if (Platform.OS === "web") {
    try {
      return typeof window !== "undefined" ? window.localStorage.getItem(key) : null;
    } catch {
      return null;
    }
  }

  try {
    return await AsyncStorage.getItem(key);
  } catch {
    return null;
  }
}

async function safeSetItem(key: string, value: string): Promise<void> {
  if (Platform.OS === "web") {
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, value);
      }
    } catch {
      // ignore
    }
    return;
  }

  try {
    await AsyncStorage.setItem(key, value);
  } catch {
    // ignore
  }
}

export function ThemePreferenceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const systemScheme = useRNColorScheme() ?? "light";
  const [mode, setModeState] = useState<ThemeMode>("system");
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const stored = await safeGetItem(STORAGE_KEY);
        if (!mounted) return;
        if (stored === "light" || stored === "dark" || stored === "system") {
          setModeState(stored);
        }
      } finally {
        if (mounted) setHasHydrated(true);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const resolvedScheme = mode === "system" ? systemScheme : mode;
  const isDark = resolvedScheme === "dark";

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next);
    safeSetItem(STORAGE_KEY, next).catch(() => undefined);
  }, []);

  const value = useMemo<ThemePreferenceContextValue>(
    () => ({
      mode,
      setMode,
      resolvedScheme,
      isDark,
      hasHydrated,
    }),
    [hasHydrated, isDark, mode, resolvedScheme, setMode]
  );

  return (
    <ThemePreferenceContext.Provider value={value}>
      {children}
    </ThemePreferenceContext.Provider>
  );
}

export function useThemePreference() {
  const ctx = useContext(ThemePreferenceContext);
  if (!ctx) {
    throw new Error("useThemePreference must be used within ThemePreferenceProvider");
  }
  return ctx;
}

export function useAppColorScheme() {
  return useThemePreference().resolvedScheme;
}
