import { AuthPalette, Colors } from "@/constants/theme";
import { useAppColorScheme } from "@/hooks/use-theme-preference";

export function useAuthTheme() {
  const scheme = useAppColorScheme() ?? "light";
  const theme = Colors[scheme];
  const isDark = scheme === "dark";

  const bg = theme.background;
  const surface = theme.card;
  const border = theme.border;
  const text = theme.foreground;
  const subtle = theme.mutedForeground;

  return {
    isDark,
    bg,
    surface,
    border,
    text,
    subtle,
    brand: isDark ? AuthPalette.brandDark : AuthPalette.brand,
    brandAccent: isDark
      ? AuthPalette.brandAccentDark
      : AuthPalette.brandAccentLight,
    brandSoft: isDark ? "hsl(220, 35%, 25%)" : AuthPalette.brandSoft,
    error: AuthPalette.error,
    errorSoft: isDark ? "hsl(0, 40%, 20%)" : AuthPalette.errorSoft,
    success: AuthPalette.success,
    successSoft: isDark ? "hsl(152, 40%, 20%)" : AuthPalette.successSoft,
    successNoteBg: isDark ? "hsl(152, 35%, 18%)" : AuthPalette.successNoteBg,
    successNoteBorder: isDark
      ? "hsl(152, 40%, 30%)"
      : AuthPalette.successNoteBorder,
  };
}
