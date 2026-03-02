import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  StyleProp,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from "react-native";

type ButtonProps = TouchableOpacityProps & {
  text: string;
  loading?: boolean;
  brand: string;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  variant?: "solid" | "ghost";
  textColor?: string;
  style?: StyleProp<ViewStyle>;
};

export function Button({
  text,
  loading,
  brand,
  rightIcon,
  variant = "solid",
  textColor,
  disabled,
  style,
  ...rest
}: ButtonProps) {
  const isSolid = variant === "solid";
  const resolvedTextColor = textColor ?? (isSolid ? "#fff" : brand);
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      disabled={isDisabled}
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          height: 52,
          borderRadius: 13,
          backgroundColor: isSolid ? brand : "transparent",
          opacity: isDisabled ? 0.75 : 1,
          ...(isSolid ? {} : { borderWidth: 1.5, borderColor: brand }),
        },
        style,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={resolvedTextColor} />
      ) : (
        <>
          <Text
            style={{
              color: resolvedTextColor,
              fontSize: 16,
              fontWeight: "700",
              letterSpacing: 0.2,
            }}
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
