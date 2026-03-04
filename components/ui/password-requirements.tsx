import { Ionicons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { Text, View } from "react-native";
import { useAuthTheme } from "@/hooks/use-auth-theme";

export type Requirement = {
  label: string;
  test: (pwd: string) => boolean;
};

const DEFAULT_REQUIREMENTS: Requirement[] = [
  { label: "At least 8 characters", test: (p) => p.length >= 8 },
  { label: "Uppercase letter (A–Z)", test: (p) => /[A-Z]/.test(p) },
  { label: "Lowercase letter (a–z)", test: (p) => /[a-z]/.test(p) },
  { label: "Number (0–9)", test: (p) => /\d/.test(p) },
];

type Props = {
  password: string;
  requirements?: Requirement[];
  title?: string;
  onAllMet?: (allMet: boolean) => void;
};

export function PasswordRequirements({
  password,
  requirements = DEFAULT_REQUIREMENTS,
  title = "PASSWORD REQUIREMENTS",
  onAllMet,
}: Props) {
  const { success, subtle } = useAuthTheme();
  const evaluated = requirements.map((r) => ({ ...r, met: r.test(password) }));
  const allMet = evaluated.every((r) => r.met);

  useEffect(() => {
    onAllMet?.(allMet);
  }, [allMet, onAllMet]);

  return (
    <View className="border border-border rounded-xl p-3.5 bg-card">
      {title && (
        <Text
          className="text-[10px] font-extrabold tracking-[0.8px] uppercase text-muted-foreground mb-1"
        >
          {title}
        </Text>
      )}
      {evaluated.map((r, i) => (
        <View key={i} className="flex-row items-center mt-2">
          <Ionicons
            name={r.met ? "checkmark-circle" : "ellipse-outline"}
            size={14}
            color={r.met ? success : subtle}
          />
          <Text
            className={[
              "text-[12px] ml-2",
              r.met ? "text-success font-semibold" : "text-muted-foreground",
            ].join(" ")}
          >
            {r.label}
          </Text>
        </View>
      ))}
    </View>
  );
}
