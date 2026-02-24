import { Text, type TextProps } from "react-native";

export type ThemedTextProps = TextProps & {
  type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link";
  className?: string;
};

export function ThemedText({
  style,
  type = "default",
  className = "",
  ...rest
}: ThemedTextProps) {
  let classes = "text-foreground";

  if (type === "title")
    classes += " text-4xl md:text-5xl font-bold leading-tight";
  if (type === "subtitle") classes += " text-2xl font-semibold";
  if (type === "defaultSemiBold") classes += " font-semibold";
  if (type === "link") classes += " text-primary underline";

  return <Text className={`${classes} ${className}`} style={style} {...rest} />;
}
