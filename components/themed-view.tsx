import { View, type ViewProps } from "react-native";

export type ThemedViewProps = ViewProps & {
  variant?: "default" | "card" | "surface";
  className?: string;
};

export function ThemedView({
  style,
  variant = "default",
  className = "",
  ...rest
}: ThemedViewProps) {
  let variantClass = "bg-background";

  if (variant === "card") {
    variantClass = "bg-card border border-border rounded-xl shadow-sm";
  }
  if (variant === "surface") {
    variantClass = "bg-card";
  }

  return (
    <View className={`${variantClass} ${className}`} style={style} {...rest} />
  );
}
