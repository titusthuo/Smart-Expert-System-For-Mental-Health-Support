import * as React from "react";
import { Text, TextStyle, View, ViewStyle } from "react-native";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CardProps {
  children?: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  className?: string;
}

interface CardTextProps {
  children?: React.ReactNode;
  style?: TextStyle | TextStyle[];
}

// ─── Card ─────────────────────────────────────────────────────────────────────

function Card({ children, style, className }: CardProps) {
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

// ─── CardHeader ───────────────────────────────────────────────────────────────

function CardHeader({ children, style, className }: CardProps) {
  return (
    <View
      className={["px-5 pt-5", className].filter(Boolean).join(" ")}
      style={style}
    >
      {children}
    </View>
  );
}

// ─── CardTitle ────────────────────────────────────────────────────────────────

function CardTitle({ children, style }: CardTextProps) {
  return (
    <Text
      className="text-foreground text-[16px] font-bold leading-[22px]"
      style={style}
    >
      {children}
    </Text>
  );
}

// ─── CardDescription ─────────────────────────────────────────────────────────

function CardDescription({ children, style }: CardTextProps) {
  return (
    <Text
      className="text-muted-foreground text-[13px] leading-[18px]"
      style={style}
    >
      {children}
    </Text>
  );
}

// ─── CardAction ───────────────────────────────────────────────────────────────

function CardAction({ children, style, className }: CardProps) {
  return (
    <View
      className={["self-start items-end", className].filter(Boolean).join(" ")}
      style={style}
    >
      {children}
    </View>
  );
}

// ─── CardContent ─────────────────────────────────────────────────────────────

function CardContent({ children, style, className }: CardProps) {
  return (
    <View
      className={["px-5 pb-5", className].filter(Boolean).join(" ")}
      style={style}
    >
      {children}
    </View>
  );
}

// ─── CardFooter ───────────────────────────────────────────────────────────────

function CardFooter({ children, style, className }: CardProps) {
  return (
    <View
      className={[
        "flex-row items-center px-5 pb-5 border-t border-border",
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

// ─── Exports ──────────────────────────────────────────────────────────────────

export {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
};

