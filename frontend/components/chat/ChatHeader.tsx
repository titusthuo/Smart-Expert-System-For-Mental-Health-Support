import React, { useEffect, useMemo, useState } from "react";
import { TouchableOpacity, View } from "react-native";

import { AppText } from "@/components/ui";
import { useAuthTheme } from "@/hooks/use-auth-theme";
import { getStoredJson } from "@/lib/storage";

type ChatHeaderProps = {
  mood?: string;
  onPressProfile?: () => void;
};

export function ChatHeader({ mood, onPressProfile }: ChatHeaderProps) {
  const { brand, border } = useAuthTheme();

  const [profileName, setProfileName] = useState<string>("John Doe");

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const parsed = await getStoredJson<{ name?: unknown }>("profileData");
        if (!mounted || !parsed) return;
        if (typeof parsed?.name === "string" && parsed.name.trim()) {
          setProfileName(parsed.name.trim());
        }
      } catch {
        // ignore
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const initials = useMemo(() => {
    const parts = profileName.trim().split(/\s+/).filter(Boolean);
    const first = parts[0]?.[0] ?? "";
    const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : "";
    return (first + last).toUpperCase() || "U";
  }, [profileName]);

  return (
    <View className="flex-row items-center justify-between px-5 py-3 bg-card border-b border-border">
      <View className="flex-row items-center">
        <View className="relative">
          <View
            className="w-11 h-11 rounded-full items-center justify-center"
            style={{ backgroundColor: brand }}
            accessibilityLabel="AI assistant avatar"
          >
            <AppText unstyled className="text-white font-bold text-sm">
              AI
            </AppText>
          </View>
          <View className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-card" />
        </View>

        <View className="ml-3">
          <AppText unstyled className="text-foreground font-bold text-base tracking-tight">
            Mental Health Assistant
          </AppText>
          {mood ? (
            <AppText unstyled className="text-brand text-xs font-semibold mt-0.5">
              Chatting about feeling {mood.toLowerCase()}
            </AppText>
          ) : (
            <AppText unstyled className="text-green-500 text-xs font-medium mt-0.5">
              Online • Confidential
            </AppText>
          )}
        </View>
      </View>

      <TouchableOpacity
        className="w-9 h-9 rounded-full items-center justify-center border"
        onPress={onPressProfile}
        accessibilityRole="button"
        accessibilityLabel="Profile"
        accessibilityHint="Opens your profile"
        activeOpacity={0.8}
        style={{ backgroundColor: brand, borderColor: border }}
      >
        <AppText unstyled className="text-white font-bold text-[12px]">
          {initials}
        </AppText>
      </TouchableOpacity>
    </View>
  );
}
