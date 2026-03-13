import * as React from "react";
import { View, ViewStyle } from "react-native";

interface CardProps {
  children?: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  className?: string;
}

export function Card({ children, style, className }: CardProps) {
  return (
    <View
      className={[
        "rounded-2xl border border-border bg-card overflow-hidden",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={style}
    >
      {children}
    </View>
  );
}
