import { AuthPalette } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import {
    ActivityIndicator,
    Text,
    TouchableOpacity,
    TouchableOpacityProps,
} from "react-native";

type ButtonProps = TouchableOpacityProps & {
  text: string;
  loading?: boolean;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  variant?: "solid" | "ghost";
  textColor?: string;
  className?: string;
  brand?: string;
};

export function Button({
  text,
  loading,
  rightIcon,
  variant = "solid",
  textColor,
  disabled,
  className,
  brand,
  ...rest
}: ButtonProps) {
  const isSolid = variant === "solid";
  const resolvedTextColor = textColor ?? (isSolid ? "#fff" : AuthPalette.brand);
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      disabled={isDisabled}
      className={[
        "flex-row  items-center justify-center rounded-xl h-10 px-4",
        isSolid ? "bg-brand border-0" : "bg-transparent border-2 border-brand",
        isDisabled ? "opacity-75" : "opacity-100",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={resolvedTextColor} />
      ) : (
        <>
          <Text
            className="text-base font-bold tracking-[0.2px]"
            style={{ color: resolvedTextColor }}
          >
            {text}
          </Text>
          {rightIcon && (
            <Ionicons name={rightIcon} size={18} color={resolvedTextColor} />
          )}
        </>
      )}
    </TouchableOpacity>
  );
}
