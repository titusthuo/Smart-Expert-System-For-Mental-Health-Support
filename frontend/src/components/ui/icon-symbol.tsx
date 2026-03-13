// Fallback for using MaterialIcons on Android and web.
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolView, SymbolWeight } from "expo-symbols";
import { ComponentProps } from "react";
import { ColorValue, Platform, StyleProp, TextStyle } from "react-native";

type IconMapping = Record<string, ComponentProps<typeof MaterialIcons>["name"]>;
type IconSymbolName = keyof typeof MAPPING;

const MAPPING: IconMapping = {
  "house.fill": "home",
  "paperplane.fill": "send",
  "chevron.left.forwardslash.chevron.right": "code",
  "chevron.right": "chevron-right",
  "chatbubble.fill": "chat",
  "people.fill": "group",
  "book.fill": "book",
  "person.fill": "person",
};

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
  weight = "regular",
}: {
  name: IconSymbolName | string;
  size?: number;
  color: ColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  if (Platform.OS === "ios") {
    return (
      <SymbolView
        name={name as any}
        size={size}
        tintColor={color}
        weight={weight}
      />
    );
  }

  const mappedName = MAPPING[name as IconSymbolName] || name;

  return (
    <MaterialIcons name={mappedName} size={size} color={color} style={style} />
  );
}
