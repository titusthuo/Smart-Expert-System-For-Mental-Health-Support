import { Text, View } from "react-native";

type Props = {
  password: string;
};

function computeStrength(
  password: string,
): {
  level: number;
  label: string;
  tone: "error" | "warning" | "info" | "success";
} | null {
  if (!password) return null;
  const classes = [/[a-z]/, /[A-Z]/, /\d/, /[^a-zA-Z0-9]/].filter((r) =>
    r.test(password),
  ).length;
  if (password.length < 6)
    return { level: 1, label: "Too short", tone: "error" };
  if (classes <= 2) return { level: 2, label: "Weak", tone: "warning" };
  if (classes === 3) return { level: 3, label: "Good", tone: "info" };
  return { level: 4, label: "Strong", tone: "success" };
}

const TONE_TO_BAR: Record<
  NonNullable<ReturnType<typeof computeStrength>>["tone"],
  string
> = {
  error: "bg-error",
  warning: "bg-warning",
  info: "bg-info",
  success: "bg-success",
};

const TONE_TO_TEXT: Record<
  NonNullable<ReturnType<typeof computeStrength>>["tone"],
  string
> = {
  error: "text-error",
  warning: "text-warning",
  info: "text-info",
  success: "text-success",
};

export function PasswordStrength({ password }: Props) {
  const strength = computeStrength(password);
  if (!strength) return null;

  return (
    <View className="flex-row items-center mt-2">
      <View className="flex-1 flex-row">
        {[1, 2, 3, 4].map((i) => (
          <View
            key={i}
            className={[
              "flex-1 h-[3px] rounded-sm",
              i <= strength.level ? TONE_TO_BAR[strength.tone] : "bg-border",
              i !== 4 ? "mr-[3px]" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          />
        ))}
      </View>
      <Text
        className={[
          "text-[11px] font-bold min-w-[50px] text-right ml-2",
          TONE_TO_TEXT[strength.tone],
        ].join(" ")}
      >
        {strength.label}
      </Text>
    </View>
  );
}
