import { AppText } from "@/components/ui";
import React from "react";
import { View } from "react-native";

export function ProfileHeader() {
  return (
    <View className="bg-card border-b border-border pb-2 pt-4">
      <AppText unstyled className="text-2xl font-bold text-foreground text-center">
        Profile
      </AppText>
    </View>
  );
}
