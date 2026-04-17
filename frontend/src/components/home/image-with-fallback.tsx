import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    Image,
    ImageSourcePropType,
    ImageStyle,
    StyleProp,
    View,
} from "react-native";

import { AppText } from "@/components/ui";
import { useAuthTheme } from "@/hooks/use-auth-theme";

type ImageWithFallbackProps = {
  source: ImageSourcePropType;
  alt: string;
  style?: StyleProp<ImageStyle>;
};

export function ImageWithFallback({ source, alt, style }: ImageWithFallbackProps) {
  const [error, setError] = useState(false);
  const { subtle } = useAuthTheme();

  if (error) {
    return (
      <View className="items-center justify-center bg-muted" style={style as any}>
        <Ionicons name="image-outline" size={28} color={subtle} />
        <AppText
          unstyled
          className="text-xs text-muted-foreground text-center mt-1 px-2"
        >
          {alt}
        </AppText>
      </View>
    );
  }

  return (
    <Image
      source={source}
      style={style}
      onError={() => setError(true)}
      accessibilityLabel={alt}
      resizeMode="cover"
    />
  );
}
