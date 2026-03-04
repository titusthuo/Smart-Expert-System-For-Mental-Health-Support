import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuthTheme } from "@/hooks/use-auth-theme";

type InputProps = TextInputProps & {
  label?: string;
  hint?: string;
  error?: string;
  iconName?: keyof typeof Ionicons.glyphMap;
  className?: string;
};

export function Input({
  label,
  hint,
  error: errorMsg,
  iconName,
  secureTextEntry,
  className,
  ...rest
}: InputProps) {
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);

  const isPassword = !!secureTextEntry;
  const hasError = !!errorMsg;

  const { brand, subtle, error } = useAuthTheme();
  const iconColor = hasError ? error : focused ? brand : subtle;
  const placeholderColor = subtle;

  return (
    <View className={["w-full", className].filter(Boolean).join(" ")}>
      {label && (
        <Text className="text-foreground text-[13px] font-semibold tracking-[0.1px] mb-1">
          {label}
        </Text>
      )}

      <View
        className={[
          "flex-row items-center rounded-xl px-3 h-12 border-2",
          hasError
            ? "border-error bg-errorSoft"
            : focused
              ? "border-brand bg-card"
              : "border-border bg-card",
        ].join(" ")}
      >
        {iconName && (
          <View className="mr-2">
            <Ionicons name={iconName} size={17} color={iconColor} />
          </View>
        )}

        <TextInput
          className="flex-1 text-[15px] text-foreground"
          placeholderTextColor={placeholderColor}
          secureTextEntry={isPassword && !visible}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...rest}
        />

        {isPassword && (
          <TouchableOpacity
            onPress={() => setVisible((v) => !v)}
            className="p-1"
          >
            <Ionicons
              name={visible ? "eye-outline" : "eye-off-outline"}
              size={17}
              color={subtle}
            />
          </TouchableOpacity>
        )}
      </View>

      {hasError && (
        <View className="flex-row items-center mt-2">
          <Ionicons name="close-circle" size={13} color={error} />
          <Text className="text-error text-[12px] font-medium ml-1.5">
            {errorMsg}
          </Text>
        </View>
      )}

      {hint && !hasError && (
        <Text className="text-muted-foreground text-[11px] leading-[15px] mt-1">
          {hint}
        </Text>
      )}
    </View>
  );
}
