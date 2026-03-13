import React, { useEffect, useMemo, useRef } from "react";
import { Animated, Easing, View } from "react-native";

type TypingIndicatorProps = {
  dotColor?: string;
};

export function TypingIndicator({ dotColor = "rgba(107,114,128,0.9)" }: TypingIndicatorProps) {
  const t = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.timing(t, {
        toValue: 1,
        duration: 900,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      })
    );

    anim.start();
    return () => anim.stop();
  }, [t]);

  const dots = useMemo(() => [0, 1, 2], []);

  return (
    <View className="flex-row items-center gap-1.5">
      {dots.map((i) => {
        const delay = i * 0.12;
        const inputRange = [0 + delay, 0.5 + delay, 1 + delay];
        const outputRange = [0, -4, 0];

        const translateY = t.interpolate({
          inputRange,
          outputRange,
          extrapolate: "clamp",
        });

        const opacity = t.interpolate({
          inputRange,
          outputRange: [0.35, 0.95, 0.35],
          extrapolate: "clamp",
        });

        return (
          <Animated.View
            key={i}
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: dotColor, opacity, transform: [{ translateY }] }}
          />
        );
      })}
    </View>
  );
}
