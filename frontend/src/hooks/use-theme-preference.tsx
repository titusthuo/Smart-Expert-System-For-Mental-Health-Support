import { getStoredString, setStoredString } from "@/lib/storage";
import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { useColorScheme as useRNColorScheme } from "react-native";

export type ThemeMode = "light" | "dark" | "system";

type ThemePreferenceContextValue = {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  resolvedScheme: "light" | "dark";
  isDark: boolean;
  hasHydrated: boolean;
};

const ThemePreferenceContext =
  createContext<ThemePreferenceContextValue | null>(null);

const STORAGE_KEY = "themeMode";

export function ThemePreferenceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const systemScheme = useRNColorScheme() ?? "light";
  const [mode, setModeState] = useState<ThemeMode>("light");
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const stored = await getStoredString(STORAGE_KEY);
        if (!mounted) return;
        if (stored === "light" || stored === "dark" || stored === "system") {
          setModeState(stored);
        } else {
          // Default to light theme if no stored preference
          setModeState("light");
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
    setStoredString(STORAGE_KEY, next).catch(() => undefined);
  }, []);

  const value = useMemo<ThemePreferenceContextValue>(
    () => ({
      mode,
      setMode,
      resolvedScheme,
      isDark,
      hasHydrated,
    }),
    [hasHydrated, isDark, mode, resolvedScheme, setMode],
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
    throw new Error(
      "useThemePreference must be used within ThemePreferenceProvider",
    );
  }
  return ctx;
}

export function useAppColorScheme() {
  return useThemePreference().resolvedScheme;
}
