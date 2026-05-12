export type AppColorScheme = "light" | "dark";

type ThemeColors = {
  background: string;
  foreground: string;
  card: string;
  border: string;
  mutedForeground: string;
};

export const Colors: Record<AppColorScheme, ThemeColors> = {
  light: {
    background: "hsl(0, 0%, 100%)",
    foreground: "hsl(0, 0%, 9%)",
    card: "hsl(0, 0%, 100%)",
    border: "hsl(0, 0%, 90%)",
    mutedForeground: "hsl(240, 5%, 45%)",
  },
  dark: {
    background: "hsl(0, 0%, 9%)",
    foreground: "hsl(0, 0%, 98%)",
    card: "hsl(0, 0%, 9%)",
    border: "hsl(0, 0%, 17%)",
    mutedForeground: "hsl(0, 0%, 44%)",
  },
};

// Design tokens specific to auth flows and status chips.
// Keeping them here (instead of scattered hex codes) makes it easy
// to tweak the visual identity in one place.
export const AuthPalette = {
  // Brand
  brand: "#1B2A4A",
  brandDark: "#A3C4E8",
  brandSoft: "#E2E8F0",
  brandAccentLight: "#2A4060",
  brandAccentDark: "#B8D4EF",

  // Status / feedback
  error: "#EF4444",
  errorSoft: "#FEE2E2",
  success: "#10B981",
  successSoft: "#D1FAE5",
  successNoteBg: "#F0FDF4",
  successNoteBorder: "#BBF7D0",
};
