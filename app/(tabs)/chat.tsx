import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuthTheme } from "@/hooks/use-auth-theme";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
  showTherapistRecommendation?: boolean;
}

// ─── Default greeting (no mood selected) ─────────────────────────────────────
const DEFAULT_GREETING =
  "Hello! I'm here to support you. How are you feeling today?";

// ─── Mood-unaware AI response fallback ───────────────────────────────────────
const getAIResponse = (input: string): string => {
  const lower = input.toLowerCase();
  if (lower.includes("anxious") || lower.includes("anxiety")) {
    return "I understand that anxiety can feel overwhelming. Try this breathing exercise: Breathe in slowly for 4 counts, hold for 4, then exhale for 4. This can help calm your nervous system. Would you like to talk more about what's causing your anxiety?";
  }
  if (lower.includes("stress") || lower.includes("stressed")) {
    return "Stress is a common experience, and it's good that you're recognizing it. Some helpful techniques include taking short breaks, practicing mindfulness, or going for a walk. What specific situations are causing you stress?";
  }
  if (lower.includes("sleep") || lower.includes("insomnia")) {
    return "Sleep is crucial for mental health. Try establishing a consistent bedtime routine, avoiding screens an hour before bed, and creating a calm environment. How long have you been experiencing sleep difficulties?";
  }
  if (lower.includes("sad") || lower.includes("depressed")) {
    return "I'm sorry you're feeling this way. It's important to acknowledge these feelings. Activities like exercise, connecting with friends, or engaging in hobbies can help. How long have you been feeling like this?";
  }
  return "Thank you for sharing that with me. I'm here to listen and support you. Can you tell me more about what you're experiencing? Remember, you're not alone in this journey.";
};

export default function ChatScreen() {
  const router = useRouter();
  const { isDark } = useAuthTheme();

  // ── Read mood params passed from the home screen ─────────────────────────
  // `mood`       → e.g. "Anxious"
  // `aiGreeting` → the tailored opening message for that mood
  const { mood, aiGreeting } = useLocalSearchParams<{
    mood?: string;
    aiGreeting?: string;
  }>();

  const openingMessage = aiGreeting ?? DEFAULT_GREETING;

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: openingMessage,
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 120);
  };

  // If the user arrived via a mood pill, show the "AI is typing" indicator
  // briefly before the greeting appears — makes it feel more alive.
  useEffect(() => {
    if (mood) {
      // Reset to empty first, show typing, then show the greeting
      setMessages([]);
      setIsTyping(true);
      const timer = setTimeout(() => {
        setIsTyping(false);
        setMessages([
          {
            id: "1",
            text: openingMessage,
            sender: "ai",
            timestamp: new Date(),
          },
        ]);
        scrollToBottom();
      }, 1200); // 1.2 s typing indicator
      return () => clearTimeout(timer);
    }
  }, []); // run once on mount

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);
    scrollToBottom();

    setTimeout(() => {
      const lower = inputValue.toLowerCase();
      const isCritical =
        lower.includes("suicid") ||
        lower.includes("harm") ||
        lower.includes("very depressed") ||
        lower.includes("can't go on") ||
        lower.includes("kill myself");

      const aiText = isCritical
        ? "I'm really concerned about what you're sharing. It sounds like you're in a lot of pain right now. While I'm here to listen, I strongly recommend speaking with a trained professional who can support you right away."
        : getAIResponse(inputValue);

      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: aiText,
          sender: "ai",
          timestamp: new Date(),
          showTherapistRecommendation: isCritical,
        },
      ]);
      scrollToBottom();
    }, 1000);
  };

  const iconColor = isDark ? "#A78BFA" : "#7C3AED";

  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} />

      <SafeAreaView className="flex-1 bg-background">
        {/* ── Header ── */}
        <View className="flex-row items-center justify-between px-5 py-3 bg-card border-b border-border">
          <View className="flex-row items-center">
            {/* AI Avatar with online dot */}
            <View className="relative">
              <View className="w-11 h-11 rounded-full bg-brand items-center justify-center">
                <Text className="text-white font-bold text-sm">AI</Text>
              </View>
              <View className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-card" />
            </View>

            <View className="ml-3">
              <Text className="text-foreground font-bold text-base tracking-tight">
                Mental Health Assistant
              </Text>
              {/* If the user arrived with a mood, show it in the subtitle */}
              {mood ? (
                <Text className="text-brand text-xs font-semibold mt-0.5">
                  Chatting about feeling {mood.toLowerCase()}
                </Text>
              ) : (
                <Text className="text-green-500 text-xs font-medium mt-0.5">
                  Online • Confidential
                </Text>
              )}
            </View>
          </View>

          <TouchableOpacity className="w-9 h-9 rounded-full bg-muted items-center justify-center">
            <Ionicons
              name="information-circle-outline"
              size={20}
              color={isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.45)"}
            />
          </TouchableOpacity>
        </View>

        {/* ── Mood context banner (shown when arriving from a mood pill) ── */}
        {mood && (
          <View className="mx-4 mt-3 px-4 py-2.5 rounded-xl bg-brand/10 border border-brand/20 flex-row items-center gap-2">
            <Ionicons name="happy-outline" size={16} color={iconColor} />
            <Text className="text-brand text-xs font-semibold flex-1">
              You selected "{mood}" — our AI will support you through this
            </Text>
            {/* Let the user dismiss the banner */}
            <TouchableOpacity
              onPress={() => router.setParams({ mood: undefined })}
            >
              <Ionicons
                name="close-circle"
                size={16}
                color={
                  isDark ? "rgba(167,139,250,0.6)" : "rgba(124,58,237,0.5)"
                }
              />
            </TouchableOpacity>
          </View>
        )}

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
          keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
        >
          {/* ── Messages list ── */}
          <ScrollView
            ref={scrollViewRef}
            className="flex-1 bg-background"
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingTop: 24,
              paddingBottom: 140,
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            onContentSizeChange={scrollToBottom}
          >
            {messages.map((msg) => (
              <View key={msg.id} className="mb-5">
                <View
                  className={`flex-row items-end ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {/* AI avatar */}
                  {msg.sender === "ai" && (
                    <View className="w-8 h-8 rounded-full bg-brand items-center justify-center mr-2 mb-1 shrink-0">
                      <Text className="text-white font-bold text-[10px]">
                        AI
                      </Text>
                    </View>
                  )}

                  <View className="max-w-[76%]">
                    <View
                      className={
                        msg.sender === "user"
                          ? "bg-brand rounded-3xl rounded-br-sm px-4 py-3"
                          : "bg-card border border-border rounded-3xl rounded-bl-sm px-4 py-3"
                      }
                    >
                      <Text
                        className={
                          msg.sender === "user"
                            ? "text-white text-[15px] leading-6"
                            : "text-foreground text-[15px] leading-6"
                        }
                      >
                        {msg.text}
                      </Text>
                    </View>

                    <Text
                      className={`text-xs text-muted-foreground mt-1.5 px-1 ${
                        msg.sender === "user" ? "text-right" : "text-left"
                      }`}
                    >
                      {msg.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Text>
                  </View>

                  {/* User avatar */}
                  {msg.sender === "user" && (
                    <View className="w-8 h-8 rounded-full bg-brand/60 items-center justify-center ml-2 mb-1 shrink-0">
                      <Text className="text-white font-bold text-[10px]">
                        You
                      </Text>
                    </View>
                  )}
                </View>

                {/* Critical warning banner */}
                {msg.showTherapistRecommendation && (
                  <View className="mt-4 mx-1 p-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/30">
                    <View className="flex-row items-start gap-3">
                      <Ionicons name="alert-circle" size={24} color="#EAB308" />
                      <View className="flex-1">
                        <Text className="text-foreground font-bold text-[15px] mb-1.5">
                          This sounds serious
                        </Text>
                        <Text className="text-muted-foreground text-sm leading-5 mb-4">
                          I'm worried about what you're going through. While I'm
                          here to listen, I strongly recommend connecting with a
                          professional who can offer immediate support.
                        </Text>
                        <TouchableOpacity
                          onPress={() => router.replace("/(tabs)/therapists")}
                          className="bg-yellow-500 py-3 px-5 rounded-xl items-center"
                          activeOpacity={0.8}
                        >
                          <Text className="text-black font-bold text-sm">
                            Find a Therapist Now
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                )}
              </View>
            ))}

            {/* ── Typing indicator ── */}
            {isTyping && (
              <View className="flex-row items-end mb-5">
                <View className="w-8 h-8 rounded-full bg-brand items-center justify-center mr-2 mb-1 shrink-0">
                  <Text className="text-white font-bold text-[10px]">AI</Text>
                </View>
                <View className="bg-card border border-border rounded-3xl rounded-bl-sm px-4 py-3.5">
                  <View className="flex-row items-center gap-1.5">
                    {/* Three animated dots — pure layout trick using opacity classes */}
                    <View className="w-2 h-2 rounded-full bg-muted-foreground opacity-40" />
                    <View className="w-2 h-2 rounded-full bg-muted-foreground opacity-70" />
                    <View className="w-2 h-2 rounded-full bg-muted-foreground opacity-100" />
                  </View>
                </View>
              </View>
            )}
          </ScrollView>

          {/* ── Input area ── */}
          <View className="border-t border-border bg-card px-4 pt-3 pb-6">
            <View className="flex-row items-end">
              <TextInput
                value={inputValue}
                onChangeText={setInputValue}
                placeholder="Type your message..."
                placeholderTextColor={
                  isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)"
                }
                className="flex-1 bg-muted border border-border rounded-3xl px-5 py-3 text-[15px] text-foreground max-h-36"
                multiline
                textAlignVertical="top"
                onSubmitEditing={handleSendMessage}
                blurOnSubmit={false}
              />

              <TouchableOpacity
                onPress={handleSendMessage}
                disabled={!inputValue.trim()}
                className={`ml-3 mb-1 w-12 h-12 rounded-full bg-brand items-center justify-center ${
                  !inputValue.trim() ? "opacity-40" : "active:opacity-80"
                }`}
                activeOpacity={0.8}
              >
                <Ionicons name="send" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <Text className="text-center text-xs text-muted-foreground mt-3 opacity-70">
              This AI provides general wellness support. For urgent help,
              contact emergency services.
            </Text>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}
