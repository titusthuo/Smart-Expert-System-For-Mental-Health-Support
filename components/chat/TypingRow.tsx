import React from "react";
import { View } from "react-native";

import { AppText, TypingIndicator } from "@/components/ui";

type TypingRowProps = {
  isDark: boolean;
};

export function TypingRow({ isDark }: TypingRowProps) {
  return (
    <View className="flex-row items-end mb-5">
      <View className="w-8 h-8 rounded-full bg-brand items-center justify-center mr-2 mb-1 shrink-0">
        <AppText unstyled className="text-white font-bold text-[10px]">
          AI
        </AppText>
      </View>
      <View className="bg-card border border-border rounded-3xl rounded-bl-sm px-4 py-3.5">
        <TypingIndicator
          dotColor={isDark ? "rgba(229,231,235,0.75)" : "rgba(107,114,128,0.9)"}
        />
      </View>
    </View>
  );
}
