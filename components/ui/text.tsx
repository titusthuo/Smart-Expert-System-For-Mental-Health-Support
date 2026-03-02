import React from "react";
import { Text, TextProps } from "react-native";

type Variant =
  | "heading"
  | "subheading"
  | "label"
  | "hint"
  | "body"
  | "link"
  | "brandName"
  | "brandSub"
  | "sectionLabel"
  | "tabActive"
  | "tabInactive"
  | "stepNum"
  | "stepText";

type AppTextProps = TextProps & {
  variant?: Variant;
  color?: string;
  children: React.ReactNode;
};

const variantStyles: Record<Variant, object> = {
  heading: {
    fontSize: 30,
    fontWeight: "800",
    letterSpacing: -0.8,
    lineHeight: 36,
  },
  subheading: { fontSize: 14, fontWeight: "400", lineHeight: 20, marginTop: 6 },
  label: { fontSize: 13, fontWeight: "600", letterSpacing: 0.1 },
  hint: { fontSize: 11, fontWeight: "400", lineHeight: 15 },
  body: { fontSize: 14, fontWeight: "400", lineHeight: 22 },
  link: { fontSize: 13, fontWeight: "700" },
  brandName: { fontSize: 18, fontWeight: "700", letterSpacing: -0.3 },
  brandSub: {
    fontSize: 11,
    fontWeight: "400",
    marginTop: 1,
    letterSpacing: 0.2,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  tabActive: { fontSize: 14, fontWeight: "700" },
  tabInactive: { fontSize: 14, fontWeight: "500" },
  stepNum: { fontSize: 13, fontWeight: "800" },
  stepText: { fontSize: 14, fontWeight: "400", lineHeight: 20 },
};

export function AppText({
  variant = "body",
  color,
  style,
  children,
  ...rest
}: AppTextProps) {
  return (
    <Text
      style={[variantStyles[variant], color ? { color } : {}, style]}
      {...rest}
    >
      {children}
    </Text>
  );
}
