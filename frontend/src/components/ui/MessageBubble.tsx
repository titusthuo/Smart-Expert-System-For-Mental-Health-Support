import { Ionicons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { Platform, View } from "react-native";

import { AppText, Button } from "@/components/ui";
import { useAuthTheme } from "@/hooks/use-auth-theme";

export type MessageBubbleProps = {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
  showTherapistRecommendation?: boolean;
  onPressTherapist?: () => void;
};

export function MessageBubble({
  text,
  sender,
  timestamp,
  showTherapistRecommendation,
  onPressTherapist,
}: MessageBubbleProps) {
  const { isDark, brand, border, surface, text: textColor } = useAuthTheme();

  const warningColor = "#EAB308";

  const isUser = sender === "user";

  const bubbleShadow = useMemo(() => {
    if (Platform.OS === "android") {
      return { elevation: isUser ? 0 : 2 };
    }

    return {
      shadowColor: "#000",
      shadowOpacity: isDark ? 0.22 : 0.08,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
    };
  }, [isDark, isUser]);

  return (
    <View className="mb-5">
      <View
        className={
          isUser
            ? "flex-row items-end justify-end"
            : "flex-row items-end justify-start"
        }
      >
        {!isUser && (
          <View
            className="w-8 h-8 rounded-full items-center justify-center mr-2 mb-1 shrink-0"
            style={{ backgroundColor: brand }}
            accessibilityLabel="Assistant"
          >
            <AppText unstyled className="text-white font-bold text-[10px]">
              AI
            </AppText>
          </View>
        )}

        <View className="max-w-[78%]">
          <View
            className={
              isUser
                ? "rounded-3xl rounded-br-sm px-4 py-3"
                : "rounded-3xl rounded-bl-sm px-4 py-3 border"
            }
            style={
              isUser
                ? [{ backgroundColor: brand }, bubbleShadow]
                : [
                    { backgroundColor: surface, borderColor: border },
                    bubbleShadow,
                  ]
            }
            accessibilityRole="text"
          >
            <AppText
              unstyled
              className="text-[15px] leading-6"
              style={{ color: isUser ? "#FFFFFF" : textColor }}
            >
              {text}
            </AppText>
          </View>

          <AppText
            unstyled
            className={
              isUser
                ? "text-xs text-muted-foreground mt-1.5 px-1 text-right"
                : "text-xs text-muted-foreground mt-1.5 px-1 text-left"
            }
          >
            {timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </AppText>
        </View>

        {isUser && (
          <View
            className="w-8 h-8 rounded-full items-center justify-center ml-2 mb-1 shrink-0"
            style={{
              backgroundColor: isDark
                ? "rgba(168,85,247,0.35)"
                : "rgba(124,58,237,0.35)",
            }}
            accessibilityLabel="You"
          >
            <AppText unstyled className="text-white font-bold text-[10px]">
              You
            </AppText>
          </View>
        )}
      </View>

      {showTherapistRecommendation && (
        <View
          className="mt-4 mx-1 p-4 rounded-2xl border"
          style={{
            borderColor: isDark
              ? "rgba(234,179,8,0.35)"
              : "rgba(234,179,8,0.45)",
            backgroundColor: isDark
              ? "rgba(234,179,8,0.10)"
              : "rgba(234,179,8,0.08)",
          }}
        >
          <View className="flex-row items-start gap-3">
            <Ionicons name="alert-circle" size={22} color={warningColor} />
            <View className="flex-1">
              <AppText
                unstyled
                className="text-foreground font-bold text-[15px] mb-1.5"
              >
                This sounds serious
              </AppText>
              <AppText
                unstyled
                className="text-muted-foreground text-sm leading-5 mb-4"
              >
                I’m concerned about your safety. Please connect with a mental
                health professional as soon as possible. If you are in immediate
                danger, call 1190 (Kenya Red Cross Mental Health Hotline) or 999
                right now.
              </AppText>

              <Button
                text="Find a Therapist Now"
                onPress={onPressTherapist}
                className="h-12"
                accessibilityLabel="Find a therapist"
                accessibilityHint="Opens the therapist directory"
              />
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
