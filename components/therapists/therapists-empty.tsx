import React from "react";
import { View } from "react-native";

import { AppText } from "@/components/ui";

type TherapistsEmptyProps = {
  title?: string;
  message?: string;
};

export function TherapistsEmpty({
  title = "No therapists found nearby.",
  message = "Try broadening your search criteria.",
}: TherapistsEmptyProps) {
  return (
    <View className="bg-card rounded-xl p-8 items-center mt-10 mx-4 border border-border">
      <AppText unstyled className="text-muted-foreground text-center mb-2 text-base">
        {title}
      </AppText>
      <AppText unstyled className="text-sm text-muted-foreground text-center">
        {message}
      </AppText>
    </View>
  );
}
