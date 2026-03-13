import React, { ReactNode, useRef } from "react";
import {
  Animated,
  StyleProp,
  TouchableOpacity,
  ViewStyle,
} from "react-native";

type PressableCardProps = {
  onPress?: () => void;
  children: ReactNode;
  className?: string;
  style?: StyleProp<ViewStyle>;
};

export function PressableCard({
  onPress,
  children,
  className = "",
  style,
}: PressableCardProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const press = () => {
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 0.97,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start();

    onPress?.();
  };

  return (
    <TouchableOpacity activeOpacity={1} onPress={press} disabled={!onPress}>
      <Animated.View style={[{ transform: [{ scale }] }, style]} className={className}>
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
}
