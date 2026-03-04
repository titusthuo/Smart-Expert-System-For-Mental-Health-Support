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
  color?: string; // legacy (prefer className)
  className?: string;
  children: React.ReactNode;
};

const variantClasses: Record<Variant, string> = {
  heading: "text-[30px] font-extrabold tracking-[-0.8px] leading-[36px] text-foreground",
  subheading: "text-[14px] font-normal leading-[20px] mt-1.5 text-muted-foreground",
  label: "text-[13px] font-semibold tracking-[0.1px] text-foreground",
  hint: "text-[11px] font-normal leading-[15px] text-muted-foreground",
  body: "text-[14px] font-normal leading-[22px] text-foreground",
  link: "text-[13px] font-bold text-brand",
  brandName: "text-[18px] font-bold tracking-[-0.3px] text-foreground",
  brandSub: "text-[11px] font-normal mt-0.5 tracking-[0.2px] text-muted-foreground",
  sectionLabel:
    "text-[11px] font-bold tracking-[0.8px] uppercase text-muted-foreground",
  tabActive: "text-[14px] font-bold text-brand",
  tabInactive: "text-[14px] font-medium text-muted-foreground",
  stepNum: "text-[13px] font-extrabold text-brand",
  stepText: "text-[14px] font-normal leading-[20px] text-foreground",
};

export function AppText({
  variant = "body",
  color,
  className,
  style,
  children,
  ...rest
}: AppTextProps) {
  return (
    <Text
      className={[variantClasses[variant], className].filter(Boolean).join(" ")}
      style={[color ? { color } : {}, style]}
      {...rest}
    >
      {children}
    </Text>
  );
}
