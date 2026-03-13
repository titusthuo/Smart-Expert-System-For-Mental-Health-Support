import { AuthPalette, Colors } from "@/constants/theme";
import { useAppColorScheme } from "@/hooks/use-theme-preference";
import { cn } from "@/lib/utils"; // ← your cn utility (class-variance-authority or similar)
import React from "react";
import { Switch as RNSwitch, SwitchProps as RNSwitchProps } from "react-native";

interface SwitchProps extends Omit<RNSwitchProps, "trackColor" | "thumbColor"> {
  className?: string;
}

/**
 * Styled Switch component trying to match common shadcn/ui look:
 * - small rounded pill
 * - purple-ish primary when checked
 * - gray when unchecked
 * - white/purple thumb movement
 */
export function Switch({
  className,
  ...props
}: SwitchProps) {
  const scheme = useAppColorScheme() ?? "light";
  const theme = Colors[scheme];

  return (
    <RNSwitch
      className={cn(
        // container styles (though most are applied via trackColor)
        "shrink-0", // prevent unwanted shrinking
        className
      )}
      trackColor={{
        false: theme.border,
        true: AuthPalette.brand,
      }}
      thumbColor={props.value ? "#ffffff" : "#ffffff"}
      ios_backgroundColor={theme.border}
      {...props}
      // Optional: override size to match web version (~1.15rem height = ~20px)
      style={[
        {
          transform: [{ scale: 0.95 }], // slight size tweak — feel free to remove
        },
        props.style,
      ]}
    />
  );
}