import { AppText } from "@/components/ui";
import React from "react";
import { View } from "react-native";

export function EmergencyResourcesCard() {
  return (
    <View className="bg-errorSoft border border-error/30 rounded-2xl p-6 mb-6">
      <AppText unstyled className="font-semibold text-foreground text-lg mb-3">
        Emergency Resources
      </AppText>
      <AppText unstyled className="text-sm text-muted-foreground mb-3">
        If you are in crisis or need immediate help, please contact:
      </AppText>
      <View className="space-y-2">
        <AppText unstyled className="text-foreground text-sm">
          <AppText unstyled className="font-bold">Kenya Mental Health Helpline:</AppText> 0800 720 000
        </AppText>
        <AppText unstyled className="text-foreground text-sm">
          <AppText unstyled className="font-bold">Emergency Services:</AppText> 999 or 112
        </AppText>
      </View>
    </View>
  );
}
