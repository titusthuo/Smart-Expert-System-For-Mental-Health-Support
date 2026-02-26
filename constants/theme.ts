export type AppColorScheme = "light" | "dark";

type ThemeColors = {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  border: string;
  primary: string;
  primaryForeground: string;
  muted: string;
  mutedForeground: string;
};

export const Colors: Record<AppColorScheme, ThemeColors> = {
  light: {
    background: "hsl(0, 0%, 100%)",
    foreground: "hsl(0, 0%, 9%)",
    card: "hsl(0, 0%, 100%)",
    cardForeground: "hsl(0, 0%, 9%)",
    border: "hsl(0, 0%, 90%)",
    primary: "hsl(240, 100%, 1%)",
    primaryForeground: "hsl(0, 0%, 100%)",
    muted: "hsl(240, 10%, 93%)",
    mutedForeground: "hsl(240, 5%, 45%)",
  },
  dark: {
    background: "hsl(0, 0%, 9%)",
    foreground: "hsl(0, 0%, 98%)",
    card: "hsl(0, 0%, 9%)",
    cardForeground: "hsl(0, 0%, 98%)",
    border: "hsl(0, 0%, 17%)",
    primary: "hsl(0, 0%, 98%)",
    primaryForeground: "hsl(0, 0%, 13%)",
    muted: "hsl(0, 0%, 17%)",
    mutedForeground: "hsl(0, 0%, 44%)",
  },
};
