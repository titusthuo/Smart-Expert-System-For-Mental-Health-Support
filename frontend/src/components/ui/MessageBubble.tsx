import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useMemo } from "react";
import { Image, Linking, Platform, TouchableOpacity, View } from "react-native";

import { AppText, Button } from "@/components/ui";
import { useAuthTheme } from "@/hooks/use-auth-theme";
import type { Therapist } from "@/lib/therapists/types";
import { useAuthSession } from "@/stores/useAuthSession";

const mentallyLogo = require("../../../assets/logos/brain.jpg");

export type MessageBubbleProps = {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
  showTherapistRecommendation?: boolean;
  recommendedTherapists?: Therapist[];
  onPressTherapist?: (therapistId: string) => void;
};

export function MessageBubble({
  text,
  sender,
  timestamp,
  showTherapistRecommendation,
  recommendedTherapists,
  onPressTherapist,
}: MessageBubbleProps) {
  const { isDark, brand, border, surface, text: textColor } = useAuthTheme();
  const session = useAuthSession((s) => s.session);
  const profilePhotoUri = session?.profile?.photoUri ?? null;

  const initials = useMemo(() => {
    const name =
      session?.profile?.name ||
      session?.user?.name ||
      session?.user?.username ||
      "U";
    const parts = name.trim().split(/\s+/).filter(Boolean);
    const first = parts[0]?.[0] ?? "";
    const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
    return (first + last).toUpperCase() || "U";
  }, [session]);

  const warningColor = "#EAB308";
  const dangerColor = "#EF4444";

  const isUser = sender === "user";

  const placeEmergencyCall = useCallback((number: string) => {
    const url = Platform.OS === "ios" ? `telprompt:${number}` : `tel:${number}`;
    Linking.openURL(url).catch(() => undefined);
  }, []);

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
            className="w-8 h-8 rounded-full items-center justify-center mr-2 mb-1 shrink-0 overflow-hidden border border-border"
            accessibilityLabel="Assistant"
          >
            <Image
              source={mentallyLogo}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />
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
            className="w-8 h-8 rounded-full items-center justify-center ml-2 mb-1 shrink-0 overflow-hidden"
            style={{ backgroundColor: brand }}
            accessibilityLabel="You"
          >
            {profilePhotoUri ? (
              <Image
                source={{ uri: profilePhotoUri }}
                style={{ width: "100%", height: "100%" }}
                resizeMode="cover"
              />
            ) : (
              <AppText unstyled className="text-white font-bold text-[10px]">
                {initials}
              </AppText>
            )}
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
                className="text-muted-foreground text-sm leading-5 mb-3"
              >
                I am concerned about your safety. If you are in immediate
                danger, please call for emergency help right away.
              </AppText>

              <View className="flex-row gap-2 mb-4">
                <TouchableOpacity
                  onPress={() => placeEmergencyCall("1199")}
                  className="flex-1 flex-row items-center justify-center py-2.5 rounded-xl"
                  style={{ backgroundColor: dangerColor }}
                  activeOpacity={0.8}
                  accessibilityRole="button"
                  accessibilityLabel="Call Kenya Red Cross"
                >
                  <Ionicons name="call" size={16} color="#FFFFFF" />
                  <AppText unstyled className="text-white font-semibold text-xs ml-1.5">
                    1199 Red Cross
                  </AppText>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => placeEmergencyCall("999")}
                  className="flex-1 flex-row items-center justify-center py-2.5 rounded-xl"
                  style={{ backgroundColor: dangerColor }}
                  activeOpacity={0.8}
                  accessibilityRole="button"
                  accessibilityLabel="Call 999 Emergency"
                >
                  <Ionicons name="call" size={16} color="#FFFFFF" />
                  <AppText unstyled className="text-white font-semibold text-xs ml-1.5">
                    999 Emergency
                  </AppText>
                </TouchableOpacity>
              </View>

              <AppText
                unstyled
                className="text-muted-foreground text-sm leading-5 mb-4"
              >
                Scroll below to find a therapist near you for further
                assistance.
              </AppText>

              {/* Individual Therapist Recommendations */}
              {recommendedTherapists && recommendedTherapists.length > 0 && (
                <View className="mb-4">
                  <AppText
                    unstyled
                    className="text-foreground font-semibold text-sm mb-3"
                  >
                    Therapists near you:
                  </AppText>
                  {recommendedTherapists.map((therapist) => (
                    <TouchableOpacity
                      key={therapist.id}
                      onPress={() => onPressTherapist?.(therapist.id)}
                      className="mb-3 p-3 rounded-xl border"
                      style={{
                        borderColor: isDark
                          ? "rgba(255,255,255,0.1)"
                          : "rgba(0,0,0,0.1)",
                        backgroundColor: isDark
                          ? "rgba(255,255,255,0.05)"
                          : "rgba(0,0,0,0.02)",
                      }}
                    >
                      <View className="flex-row items-start justify-between">
                        <View className="flex-1">
                          <AppText
                            unstyled
                            className="text-foreground font-semibold text-sm"
                          >
                            {therapist.name}
                          </AppText>
                          <AppText
                            unstyled
                            className="text-muted-foreground text-xs mt-1"
                          >
                            {therapist.specialization.slice(0, 2).join(", ")}
                          </AppText>
                          <AppText
                            unstyled
                            className="text-muted-foreground text-xs mt-1"
                          >
                            {therapist.location}
                          </AppText>
                        </View>
                        <Ionicons
                          name="chevron-forward"
                          size={16}
                          color={textColor}
                        />
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              <Button
                text="View All Therapists"
                onPress={() => onPressTherapist?.("")}
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
