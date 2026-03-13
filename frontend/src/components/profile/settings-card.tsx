import { AppText, Switch } from "@/components/ui";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Bell, ChevronRight, HelpCircle, Shield } from "lucide-react-native";

function RowDivider() {
  return <View className="h-px bg-border" />;
}

export function SettingsCard({
  notificationsEnabled,
  onChangeNotifications,
  onPressPrivacy,
  onPressHelp,
}: {
  notificationsEnabled: boolean;
  onChangeNotifications: (value: boolean) => void;
  onPressPrivacy: () => void;
  onPressHelp: () => void;
}) {
  return (
    <View className="bg-card rounded-2xl p-6 mb-6 shadow-sm border border-border">
      <AppText unstyled className="font-semibold text-foreground text-lg mb-4">
        Settings
      </AppText>

      <View className="space-y-5">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <Bell size={20} color="#4b5563" />
            <View className="ml-3">
              <AppText unstyled className="font-medium text-foreground">
                Notifications
              </AppText>
              <AppText unstyled className="text-sm text-muted-foreground">
                Receive updates and reminders
              </AppText>
            </View>
          </View>
          <Switch value={notificationsEnabled} onValueChange={onChangeNotifications} />
        </View>

        <RowDivider />

        <TouchableOpacity
          className="flex-row items-center justify-between py-3 px-2 active:opacity-90 rounded-lg"
          onPress={onPressPrivacy}
          accessibilityRole="button"
          accessibilityLabel="Privacy and security"
        >
          <View className="flex-row items-center flex-1">
            <Shield size={20} color="#4b5563" />
            <View className="ml-3">
              <AppText unstyled className="font-medium text-foreground">
                Privacy & Security
              </AppText>
              <AppText unstyled className="text-sm text-muted-foreground">
                Manage your data and security
              </AppText>
            </View>
          </View>
          <ChevronRight size={20} color="#9ca3af" />
        </TouchableOpacity>

        <RowDivider />

        <TouchableOpacity
          className="flex-row items-center justify-between py-3 px-2 active:opacity-90 rounded-lg"
          onPress={onPressHelp}
          accessibilityRole="button"
          accessibilityLabel="Help and support"
        >
          <View className="flex-row items-center flex-1">
            <HelpCircle size={20} color="#4b5563" />
            <View className="ml-3">
              <AppText unstyled className="font-medium text-foreground">
                Help & Support
              </AppText>
              <AppText unstyled className="text-sm text-muted-foreground">
                Get assistance and FAQs
              </AppText>
            </View>
          </View>
          <ChevronRight size={20} color="#9ca3af" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
