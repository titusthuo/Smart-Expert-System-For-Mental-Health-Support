import { Colors, AuthPalette } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export function useAuthTheme() {
  const scheme = useColorScheme() ?? "light";
  const theme = Colors[scheme];
  const isDark = scheme === "dark";

  const bg = theme.background;
  const surface = theme.card;
  const border = theme.border;
  const text = theme.foreground;
  const subtle = theme.mutedForeground;

  return {
    scheme,
    isDark,
    bg,
    surface,
    border,
    text,
    subtle,
    brand: AuthPalette.brand,
    // Softer brand/background tints – darker in dark mode so inputs stay dark.
    brandSoft: isDark ? "hsl(262, 40%, 26%)" : AuthPalette.brandSoft,
    error: AuthPalette.error,
    errorSoft: isDark ? "hsl(0, 40%, 25%)" : AuthPalette.errorSoft,
    success: AuthPalette.success,
    successSoft: isDark ? "hsl(152, 40%, 20%)" : AuthPalette.successSoft,
    successNoteBg: isDark ? "hsl(152, 35%, 18%)" : AuthPalette.successNoteBg,
    successNoteBorder: isDark ? "hsl(152, 40%, 30%)" : AuthPalette.successNoteBorder,
    warning: AuthPalette.warning,
    info: AuthPalette.info,
    socialGoogle: AuthPalette.socialGoogle,
    socialFacebook: AuthPalette.socialFacebook,
  };
}

