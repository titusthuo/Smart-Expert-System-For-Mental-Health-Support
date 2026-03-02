import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppText, Card } from "@/components/ui";
import { useAuthTheme } from "@/hooks/use-auth-theme";

export default function ProfileScreen() {
  const { bg, surface, border, text, subtle, brandSoft, brand } = useAuthTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bg }} edges={["top"]}>
      <View style={{ padding: 16, gap: 12 }}>
        <AppText variant="heading" color={text}>
          Profile
        </AppText>
        <AppText variant="body" color={subtle}>
          Manage your account, preferences, and wellbeing settings.
        </AppText>

        <Card style={{ backgroundColor: surface, borderColor: border }}>
          <View style={{ padding: 16, gap: 10 }}>
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: brandSoft,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AppText variant="label" color={brand} style={{ fontSize: 18 }}>
                JD
              </AppText>
            </View>
            <AppText variant="label" color={text}>
              Coming next
            </AppText>
            <AppText variant="body" color={subtle}>
              We’ll add profile details, settings, and sign-out here.
            </AppText>
          </View>
        </Card>
      </View>
    </SafeAreaView>
  );
}

