import { AppText } from "@/components/ui";
import { BookOpen } from "lucide-react-native";
import React from "react";
import { View } from "react-native";

export function EducationFooterBanner({ brandAccent }: { brandAccent: string }) {
  return (
    <View className="mx-5 mt-6 mb-12 p-6 bg-brandSoft border border-border rounded-xl">
      <View className="flex-row items-start gap-3">
        <BookOpen size={24} color={brandAccent} />
        <View>
          <AppText unstyled className="font-semibold text-foreground mb-2 text-base">
            Evidence-Based Resources
          </AppText>
          <AppText unstyled className="text-sm text-muted-foreground leading-5">
            Content from MyHealthfinder (U.S. Office of Disease Prevention and Health Promotion) — Mental Health & Relationships section. For educational support only. Not a substitute for professional advice.
          </AppText>
        </View>
      </View>
    </View>
  );
}
