import { AppText } from "@/components/ui";
import { LogOut } from "lucide-react-native";
import React from "react";
import { TouchableOpacity } from "react-native";

export function LogoutButton({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center justify-center border border-red-200 bg-card py-4 rounded-lg active:opacity-90 mb-2"
      accessibilityRole="button"
      accessibilityLabel="Log out"
    >
      <LogOut size={20} color="#dc2626" />
      <AppText unstyled className="text-red-600 font-medium ml-2 text-base">
        Log Out
      </AppText>
    </TouchableOpacity>
  );
}
