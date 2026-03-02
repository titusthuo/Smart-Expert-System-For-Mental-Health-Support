import * as React from "react";
import { StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CardProps {
  children?: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
}

interface CardTextProps {
  children?: React.ReactNode;
  style?: TextStyle | TextStyle[];
}

// ─── Card ─────────────────────────────────────────────────────────────────────

function Card({ children, style }: CardProps) {
  const scheme = useColorScheme() ?? "light";
  const theme = Colors[scheme];

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

// ─── CardHeader ───────────────────────────────────────────────────────────────

function CardHeader({ children, style }: CardProps) {
  const scheme = useColorScheme() ?? "light";
  const theme = Colors[scheme];

  return (
    <View
      style={[
        styles.cardHeader,
        {
          borderBottomColor: theme.border,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

// ─── CardTitle ────────────────────────────────────────────────────────────────

function CardTitle({ children, style }: CardTextProps) {
  const scheme = useColorScheme() ?? "light";
  const theme = Colors[scheme];

  return (
    <Text
      style={[
        styles.cardTitle,
        {
          color: theme.foreground,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

// ─── CardDescription ─────────────────────────────────────────────────────────

function CardDescription({ children, style }: CardTextProps) {
  const scheme = useColorScheme() ?? "light";
  const theme = Colors[scheme];

  return (
    <Text
      style={[
        styles.cardDescription,
        {
          color: theme.mutedForeground,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

// ─── CardAction ───────────────────────────────────────────────────────────────

function CardAction({ children, style }: CardProps) {
  return <View style={[styles.cardAction, style]}>{children}</View>;
}

// ─── CardContent ─────────────────────────────────────────────────────────────

function CardContent({ children, style }: CardProps) {
  return <View style={[styles.cardContent, style]}>{children}</View>;
}

// ─── CardFooter ───────────────────────────────────────────────────────────────

function CardFooter({ children, style }: CardProps) {
  const scheme = useColorScheme() ?? "light";
  const theme = Colors[scheme];

  return (
    <View
      style={[
        styles.cardFooter,
        {
          borderTopColor: theme.border,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 6,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    lineHeight: 22,
  },
  cardDescription: {
    fontSize: 13,
    color: "#6b7280",
    lineHeight: 18,
  },
  cardAction: {
    alignSelf: "flex-start",
    alignItems: "flex-end",
  },
  cardContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderTopWidth: 1,
  },
});

// ─── Exports ──────────────────────────────────────────────────────────────────

export {
    Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
};

