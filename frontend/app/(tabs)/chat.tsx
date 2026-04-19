import * as Haptics from "expo-haptics";
import * as Location from "expo-location";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useRef, useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from "react-native";
import {
    SafeAreaView,
    useSafeAreaInsets,
} from "react-native-safe-area-context";

import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatInput } from "@/components/chat/ChatInput";
import { TypingRow } from "@/components/chat/TypingRow";
import { MessageBubble } from "@/components/ui";
import { useAuthTheme } from "@/hooks/use-auth-theme";
import { useAIAssistant } from "@/hooks/useAIAssistant";
import { Coords } from "@/lib/geo";

export default function ChatScreen() {
  const router = useRouter();
  const { isDark } = useAuthTheme();
  const insets = useSafeAreaInsets();

  const { mood } = useLocalSearchParams<{
    mood?: string;
  }>();

  // GPS Location state
  const [userCoords, setUserCoords] = useState<Coords | null>(null);
  const [locationPermissionGranted, setLocationPermissionGranted] =
    useState(false);

  // Initialize GPS location
  useEffect(() => {
    let isMounted = true;

    async function initLocation() {
      try {
        // Request location permissions
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          if (!isMounted) return;
          setUserCoords(null); // No location available
          setLocationPermissionGranted(false);
          return;
        }

        // Get current position
        const position = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        if (!isMounted) return;
        setUserCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocationPermissionGranted(true);
      } catch (error) {
        console.warn("Failed to get location:", error);
        if (!isMounted) return;
        setUserCoords(null); // No location available
        setLocationPermissionGranted(false);
      }
    }

    initLocation();
    return () => {
      isMounted = false;
    };
  }, []);

  // ── AI hook ──────────────────────────────────────────────────────────────
  const {
    messages,
    inputValue,
    setInputValue,
    isTyping,
    isEscalated,
    sendMessage,
    setIsEscalated,
  } = useAIAssistant(
    typeof mood === "string" ? mood : undefined,
    userCoords,
  );

  // ── Scroll helpers ────────────────────────────────────────────────────────
  const scrollViewRef = useRef<ScrollView>(null);

  const scrollToBottom = useCallback((animated = true) => {
    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated }), 120);
  }, []);

  const handleContentSizeChange = useCallback(
    () => scrollToBottom(),
    [scrollToBottom],
  );

  // Scroll to bottom whenever a new message arrives or typing indicator changes
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  // ── Mood change: reset escalation so the new session starts fresh ─────────
  useEffect(() => {
    if (mood) {
      setIsEscalated(false);
    }
  }, [mood, setIsEscalated]);

  // ── Send handler ──────────────────────────────────────────────────────────
  const handleSendMessage = useCallback(async () => {
    if (isEscalated || !inputValue.trim()) return;
    Haptics.selectionAsync().catch(() => undefined);
    await sendMessage(inputValue);
  }, [inputValue, isEscalated, sendMessage]);

  const canSend = !isEscalated && inputValue.trim().length > 0;

  // ── Stable bottom padding ─────────────────────────────────────────────
  const bottomPadding = Math.max(insets.bottom, 8);

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} />

      <SafeAreaView className="flex-1 bg-background" edges={["top", "left", "right"]}>
        <ChatHeader
          mood={typeof mood === "string" ? mood : undefined}
          onPressProfile={() => router.push("/(tabs)/profile")}
        />

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={Platform.OS === "ios" ? insets.top + 10 : 0}
        >
          <ScrollView
            ref={scrollViewRef}
            className="flex-1 bg-background"
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingTop: 24,
              paddingBottom: 16,
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            onContentSizeChange={handleContentSizeChange}
          >
            {messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                id={msg.id}
                text={msg.text}
                sender={msg.sender}
                timestamp={msg.timestamp}
                showTherapistRecommendation={msg.showTherapistRecommendation}
                recommendedTherapists={msg.recommendedTherapists}
                onPressTherapist={(therapistId: string) => {
                  // Handle navigation to specific therapist or all therapists
                  if (therapistId) {
                    // Navigate to specific therapist detail page
                    router.push({
                      pathname: "/therapist-detail",
                      params: {
                        id: therapistId,
                        reason: "crisis",
                      },
                    });
                  } else {
                    // Navigate to all therapists page with location
                    const params: any = { reason: "crisis" };

                    if (userCoords && locationPermissionGranted) {
                      params.lat = userCoords.lat.toString();
                      params.lng = userCoords.lng.toString();
                      params.useLocation = "true";
                    }

                    router.push({
                      pathname: "/(tabs)/therapists",
                      params,
                    });
                  }
                }}
              />
            ))}

            {isTyping && <TypingRow isDark={isDark} />}
          </ScrollView>

          <ChatInput
            value={inputValue}
            onChangeText={setInputValue}
            onSend={handleSendMessage}
            canSend={canSend}
            isEscalated={isEscalated}
            bottomPadding={bottomPadding}
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}
