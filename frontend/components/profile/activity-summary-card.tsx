import { AppText } from "@/components/ui";
import React from "react";
import { View } from "react-native";
import { Calendar, MessageCircle } from "lucide-react-native";

export function ActivitySummaryCard({
  chatSessions = 12,
  appointments = 3,
}: {
  chatSessions?: number;
  appointments?: number;
}) {
  return (
    <View className="bg-card rounded-2xl p-6 mb-6 shadow-sm border border-border">
      <AppText unstyled className="font-semibold text-foreground text-lg mb-4">
        Your Activity
      </AppText>
      <View className="flex-row justify-between">
        <View className="bg-brandSoft flex-1 p-4 rounded-xl mr-3 items-center">
          <View className="flex-row items-center mb-2">
            <MessageCircle size={20} color="#9333ea" />
            <AppText unstyled className="text-sm text-muted-foreground ml-2">
              Chat Sessions
            </AppText>
          </View>
          <AppText unstyled className="text-2xl font-bold text-foreground">
            {chatSessions}
          </AppText>
        </View>

        <View className="bg-muted flex-1 p-4 rounded-xl items-center">
          <View className="flex-row items-center mb-2">
            <Calendar size={20} color="#2563eb" />
            <AppText unstyled className="text-sm text-muted-foreground ml-2">
              Appointments
            </AppText>
          </View>
          <AppText unstyled className="text-2xl font-bold text-foreground">
            {appointments}
          </AppText>
        </View>
      </View>
    </View>
  );
}
