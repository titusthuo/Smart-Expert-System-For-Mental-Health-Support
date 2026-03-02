import React from "react";
import { Text, View } from "react-native";

export type PasswordStrengthColors = {
  border: string;
  error: string;
  success: string;
  warning?: string;
  info?: string;
};

type Props = {
  password: string;
  colors: PasswordStrengthColors;
};

function computeStrength(
  password: string,
  colors: PasswordStrengthColors,
): { level: number; label: string; color: string } | null {
  if (!password) return null;
  const classes = [/[a-z]/, /[A-Z]/, /\d/, /[^a-zA-Z0-9]/].filter((r) =>
    r.test(password),
  ).length;
  if (password.length < 6)
    return { level: 1, label: "Too short", color: colors.error };
  if (classes <= 2)
    return { level: 2, label: "Weak", color: colors.warning ?? colors.error };
  if (classes === 3)
    return { level: 3, label: "Good", color: colors.info ?? colors.success };
  return { level: 4, label: "Strong", color: colors.success };
}

export function PasswordStrength({ password, colors }: Props) {
  const strength = computeStrength(password, colors);
  if (!strength) return null;

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginTop: 7,
      }}
    >
      <View style={{ flex: 1, flexDirection: "row", gap: 3 }}>
        {[1, 2, 3, 4].map((i) => (
          <View
            key={i}
            style={{
              flex: 1,
              height: 3,
              borderRadius: 2,
              backgroundColor:
                i <= strength.level ? strength.color : colors.border,
            }}
          />
        ))}
      </View>
      <Text
        style={{
          fontSize: 11,
          fontWeight: "700",
          minWidth: 50,
          textAlign: "right",
          color: strength.color,
        }}
      >
        {strength.label}
      </Text>
    </View>
  );
}
