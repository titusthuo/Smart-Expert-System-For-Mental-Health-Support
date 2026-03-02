import { Ionicons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { Text, View } from "react-native";

export type Requirement = {
  label: string;
  test: (pwd: string) => boolean;
};

export type PasswordRequirementsColors = {
  border: string;
  surface: string;
  subtle: string;
  success: string;
};

const DEFAULT_REQUIREMENTS: Requirement[] = [
  { label: "At least 8 characters", test: (p) => p.length >= 8 },
  { label: "Uppercase letter (A–Z)", test: (p) => /[A-Z]/.test(p) },
  { label: "Lowercase letter (a–z)", test: (p) => /[a-z]/.test(p) },
  { label: "Number (0–9)", test: (p) => /\d/.test(p) },
];

type Props = {
  password: string;
  colors: PasswordRequirementsColors;
  requirements?: Requirement[];
  title?: string;
  onAllMet?: (allMet: boolean) => void;
};

export function PasswordRequirements({
  password,
  colors,
  requirements = DEFAULT_REQUIREMENTS,
  title = "PASSWORD REQUIREMENTS",
  onAllMet,
}: Props) {
  const evaluated = requirements.map((r) => ({ ...r, met: r.test(password) }));
  const allMet = evaluated.every((r) => r.met);

  useEffect(() => {
    onAllMet?.(allMet);
  }, [allMet]);

  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 12,
        padding: 14,
        gap: 8,
        backgroundColor: colors.surface,
      }}
    >
      {title && (
        <Text
          style={{
            fontSize: 10,
            fontWeight: "800",
            letterSpacing: 0.8,
            textTransform: "uppercase",
            color: colors.subtle,
            marginBottom: 2,
          }}
        >
          {title}
        </Text>
      )}
      {evaluated.map((r, i) => (
        <View
          key={i}
          style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
        >
          <Ionicons
            name={r.met ? "checkmark-circle" : "ellipse-outline"}
            size={14}
            color={r.met ? colors.success : colors.subtle}
          />
          <Text
            style={{
              fontSize: 12,
              color: r.met ? colors.success : colors.subtle,
              fontWeight: r.met ? "600" : "400",
            }}
          >
            {r.label}
          </Text>
        </View>
      ))}
    </View>
  );
}
