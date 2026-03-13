import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity, View } from "react-native";

import { AppText } from "@/components/ui";

type MoodBannerProps = {
  mood: string;
  iconColor: string;
  isDark: boolean;
  onDismiss: () => void;
};

export function MoodBanner({ mood, iconColor, isDark, onDismiss }: MoodBannerProps) {
  return (
    <View className="mx-4 mt-3 px-4 py-2.5 rounded-xl bg-brand/10 border border-brand/20 flex-row items-center gap-2">
      <Ionicons name="happy-outline" size={16} color={iconColor} />
      <AppText unstyled className="text-brand text-xs font-semibold flex-1">
        You selected &quot;{mood}&quot; — our AI will support you through this
      </AppText>
      <TouchableOpacity
        onPress={onDismiss}
        accessibilityRole="button"
        accessibilityLabel="Dismiss mood context"
        accessibilityHint="Removes the mood banner"
        hitSlop={10}
      >
        <Ionicons
          name="close-circle"
          size={16}
          color={isDark ? "rgba(167,139,250,0.6)" : "rgba(124,58,237,0.5)"}
        />
      </TouchableOpacity>
    </View>
  );
}
