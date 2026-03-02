import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppText, Card } from "@/components/ui";
import { useAuthTheme } from "@/hooks/use-auth-theme";

export default function EducationScreen() {
  const { bg, surface, border, text, subtle } = useAuthTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bg }} edges={["top"]}>
      <View style={{ padding: 16, gap: 12 }}>
        <AppText variant="heading" color={text}>
          Education
        </AppText>
        <AppText variant="body" color={subtle}>
          Evidence-based articles and learning resources.
        </AppText>

        <Card style={{ backgroundColor: surface, borderColor: border }}>
          <View style={{ padding: 16, gap: 8 }}>
            <AppText variant="label" color={text}>
              Placeholder
            </AppText>
            <AppText variant="body" color={subtle}>
              We’ll add topics, reading lists, and recommended content here.
            </AppText>
          </View>
        </Card>
      </View>
    </SafeAreaView>
  );
}

