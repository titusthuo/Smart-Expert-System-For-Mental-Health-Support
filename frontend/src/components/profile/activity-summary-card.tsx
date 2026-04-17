import { AppText } from "@/components/ui";
import { useAuthTheme } from "@/hooks/use-auth-theme";
import { useChatSessions } from "@/hooks/useChatSessions";
import { MessageCircle } from "lucide-react-native";
import React from "react";
import { View } from "react-native";

export function ActivitySummaryCard() {
  const { brand } = useAuthTheme();
  const { userMessageCount, loading, error } = useChatSessions();

  if (loading) {
    return (
      <View className="bg-card rounded-2xl p-6 mb-6 shadow-sm border border-border">
        <AppText
          unstyled
          className="font-semibold text-foreground text-lg mb-4"
        >
          Your Activity
        </AppText>
        <View className="flex-row justify-center">
          <View className="bg-brandSoft flex-1 p-4 rounded-xl items-center">
            <View className="flex-row items-center mb-2">
              <MessageCircle size={20} color={brand} />
              <AppText unstyled className="text-sm text-muted-foreground ml-2">
                Chat Sessions
              </AppText>
            </View>
            <AppText unstyled className="text-2xl font-bold text-foreground">
              Loading...
            </AppText>
          </View>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View className="bg-card rounded-2xl p-6 mb-6 shadow-sm border border-border">
        <AppText
          unstyled
          className="font-semibold text-foreground text-lg mb-4"
        >
          Your Activity
        </AppText>
        <View className="flex-row justify-center">
          <View className="bg-brandSoft flex-1 p-4 rounded-xl items-center">
            <View className="flex-row items-center mb-2">
              <MessageCircle size={20} color={brand} />
              <AppText unstyled className="text-sm text-muted-foreground ml-2">
                Chat Sessions
              </AppText>
            </View>
            <AppText unstyled className="text-2xl font-bold text-foreground">
              --
            </AppText>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View className="bg-card rounded-2xl p-6 mb-6 shadow-sm border border-border">
      <AppText unstyled className="font-semibold text-foreground text-lg mb-4">
        Your Activity
      </AppText>
      <View className="flex-row justify-center">
        <View className="bg-brandSoft flex-1 p-4 rounded-xl items-center">
          <View className="flex-row items-center mb-2">
            <MessageCircle size={20} color={brand} />
            <AppText unstyled className="text-sm text-muted-foreground ml-2">
              Chat Sessions
            </AppText>
          </View>
          <AppText unstyled className="text-2xl font-bold text-foreground">
            {userMessageCount}
          </AppText>
        </View>
      </View>
    </View>
  );
}
