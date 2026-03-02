import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppText, Button, Card } from "@/components/ui";
import { useAuthTheme } from "@/hooks/use-auth-theme";

export default function ChatScreen() {
  const { bg, surface, border, text, subtle, brand } = useAuthTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bg }} edges={["top"]}>
      <View style={{ padding: 16, gap: 12 }}>
        <AppText variant="heading" color={text}>
          Chat
        </AppText>
        <AppText variant="body" color={subtle}>
          This is where the AI chat experience will live.
        </AppText>

        <Card style={{ backgroundColor: surface, borderColor: border }}>
          <View style={{ padding: 16, gap: 10 }}>
            <AppText variant="label" color={text}>
              Coming next
            </AppText>
            <AppText variant="body" color={subtle}>
              Start a conversation, view history, and save helpful insights.
            </AppText>
            <Button text="Start Chat" brand={brand} onPress={() => {}} />
          </View>
        </Card>
      </View>
    </SafeAreaView>
  );
}

