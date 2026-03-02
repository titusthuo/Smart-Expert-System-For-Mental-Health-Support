import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";

export type InputColors = {
  border: string;
  surface: string;
  text: string;
  subtle: string;
  error: string;
  errorSoft: string;
};

type InputProps = TextInputProps & {
  label?: string;
  hint?: string;
  error?: string;
  iconName?: keyof typeof Ionicons.glyphMap;
  brand: string;
  colors: InputColors;
};

export function Input({
  label,
  hint,
  error: errorMsg,
  iconName,
  secureTextEntry,
  brand,
  colors,
  ...rest
}: InputProps) {
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);

  const isPassword = !!secureTextEntry;
  const hasError = !!errorMsg;

  const borderColor = hasError ? colors.error : focused ? brand : colors.border;
  const bg = hasError ? colors.errorSoft : colors.surface;
  const iconColor = hasError ? colors.error : focused ? brand : colors.subtle;

  return (
    <View style={{ gap: 6 }}>
      {label && (
        <Text
          style={{
            color: colors.text,
            fontSize: 13,
            fontWeight: "600",
            letterSpacing: 0.1,
          }}
        >
          {label}
        </Text>
      )}

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          borderWidth: 1.5,
          borderRadius: 12,
          paddingHorizontal: 13,
          height: 50,
          borderColor,
          backgroundColor: bg,
        }}
      >
        {iconName && (
          <Ionicons
            name={iconName}
            size={17}
            color={iconColor}
            style={{ marginRight: 9 }}
          />
        )}

        <TextInput
          style={{ flex: 1, fontSize: 15, color: colors.text }}
          placeholderTextColor={colors.subtle}
          secureTextEntry={isPassword && !visible}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...rest}
        />

        {isPassword && (
          <TouchableOpacity
            onPress={() => setVisible((v) => !v)}
            style={{ padding: 4 }}
          >
            <Ionicons
              name={visible ? "eye-outline" : "eye-off-outline"}
              size={17}
              color={colors.subtle}
            />
          </TouchableOpacity>
        )}
      </View>

      {hasError && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
            marginTop: 2,
          }}
        >
          <Ionicons name="close-circle" size={13} color={colors.error} />
          <Text
            style={{ color: colors.error, fontSize: 12, fontWeight: "500" }}
          >
            {errorMsg}
          </Text>
        </View>
      )}

      {hint && !hasError && (
        <Text style={{ color: colors.subtle, fontSize: 11, lineHeight: 15 }}>
          {hint}
        </Text>
      )}
    </View>
  );
}
