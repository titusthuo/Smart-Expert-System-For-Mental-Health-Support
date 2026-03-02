import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
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

export default function ChatScreen() {
  const router = useRouter();
  const {
    bg,
    surface,
    border,
    text,
    subtle,
    brand,
    brandSoft,
    warning,
    info,
    isDark,
  } = useAuthTheme();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm here to support you. How are you feeling today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const scrollViewRef = useRef<ScrollView>(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    setTimeout(() => {
      const lower = inputValue.toLowerCase();
      const isCritical =
        lower.includes("suicid") ||
        lower.includes("harm") ||
        lower.includes("very depressed") ||
        lower.includes("can't go on");

      const aiText = isCritical
        ? "I'm really concerned about what you're sharing. It sounds like you're going through a very difficult time. While I'm here to listen, I think it would be really helpful for you to speak with a professional therapist who can provide the support you need."
        : getAIResponse(inputValue);

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: aiText,
        sender: "ai",
        timestamp: new Date(),
        showTherapistRecommendation: isCritical,
      };

      setMessages((prev) => [...prev, aiResponse]);
      scrollToBottom();
    }, 1000);
  };

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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]} edges={["top"]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: brand }]}>
        <View style={styles.headerRow}>
          <View
            style={[
              styles.headerAvatar,
              { backgroundColor: brandSoft },
            ]}
          >
            <Text style={[styles.headerAvatarText, { color: brand }]}>AI</Text>
          </View>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Mental Health AI Assistant</Text>
            <Text style={[styles.headerSubtitle, { color: brandSoft }]}>
              Always here to listen
            </Text>
          </View>
        </View>
      </View>

      {/* Messages */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          style={[styles.scrollView, { backgroundColor: bg }]}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={scrollToBottom}
        >
          {messages.map((msg) => (
            <View key={msg.id} style={styles.messageWrapper}>
              <View
                style={[
                  styles.messageRow,
                  msg.sender === "user" ? styles.messageRowEnd : styles.messageRowStart,
                ]}
              >
                <View
                  style={[
                    styles.bubbleRow,
                    msg.sender === "user" ? styles.bubbleRowReverse : null,
                  ]}
                >
                  <View
                    style={[
                      styles.avatar,
                      {
                        backgroundColor:
                          msg.sender === "ai"
                            ? brandSoft
                            : isDark
                              ? "hsl(217, 50%, 28%)"
                              : "hsl(217, 90%, 92%)",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.avatarText,
                        { color: msg.sender === "ai" ? brand : info },
                      ]}
                    >
                      {msg.sender === "ai" ? "AI" : "You"}
                    </Text>
                  </View>
                  <View style={styles.bubbleContainer}>
                    <View
                      style={[
                        styles.bubble,
                        msg.sender === "user"
                          ? { backgroundColor: brand }
                          : {
                              backgroundColor: surface,
                              borderColor: border,
                              borderWidth: 1,
                            },
                      ]}
                    >
                      <Text
                        style={[
                          styles.bubbleText,
                          {
                            color: msg.sender === "user" ? "#FFFFFF" : text,
                          },
                        ]}
                      >
                        {msg.text}
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.timestamp,
                        { color: subtle },
                        msg.sender === "user" ? styles.timestampRight : styles.timestampLeft,
                      ]}
                    >
                      {msg.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Text>
                  </View>
                </View>
              </View>

              {msg.showTherapistRecommendation && (
                <View
                  style={[
                    styles.warningBanner,
                    { backgroundColor: brandSoft, borderColor: warning },
                  ]}
                >
                  <View style={styles.warningRow}>
                    <Ionicons
                      name="warning-outline"
                      size={20}
                      color={warning}
                      style={styles.warningIcon}
                    />
                    <View style={styles.warningContent}>
                      <Text style={[styles.warningTitle, { color: text }]}>
                        This seems serious — would you like professional support?
                      </Text>
                      <Text style={[styles.warningBody, { color: subtle }]}>
                        A licensed therapist can provide personalized care and support.
                      </Text>
                      <TouchableOpacity
                        onPress={() => router.replace("/(tabs)/therapists")}
                        style={[styles.therapistButton, { backgroundColor: warning }]}
                      >
                        <Text style={styles.therapistButtonText}>
                          Book Appointment with Therapist
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}
            </View>
          ))}
        </ScrollView>

        {/* Input area */}
        <View
          style={[
            styles.inputArea,
            { backgroundColor: surface, borderTopColor: border },
          ]}
        >
          <View style={styles.inputRow}>
            <TextInput
              value={inputValue}
              onChangeText={setInputValue}
              placeholder="Type your message..."
              placeholderTextColor={subtle}
              style={[
                styles.input,
                {
                  backgroundColor: bg,
                  borderColor: border,
                  color: text,
                },
              ]}
              multiline
              onSubmitEditing={handleSendMessage}
              blurOnSubmit={false}
            />
            <TouchableOpacity
              onPress={handleSendMessage}
              style={[styles.sendButton, { backgroundColor: brand }]}
              disabled={!inputValue.trim()}
            >
              <Ionicons name="send" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <Text style={[styles.disclaimer, { color: subtle }]}>
            This AI provides general wellness support. For urgent help, contact
            emergency services.
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  headerAvatarText: {
    fontWeight: "700",
    fontSize: 16,
  },
  headerText: {
    marginLeft: 12,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },
  headerSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 100,
  },
  messageWrapper: {
    marginBottom: 16,
  },
  messageRow: {
    flexDirection: "row",
  },
  messageRowStart: {
    justifyContent: "flex-start",
  },
  messageRowEnd: {
    justifyContent: "flex-end",
  },
  bubbleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    maxWidth: "80%",
  },
  bubbleRowReverse: {
    flexDirection: "row-reverse",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 11,
    fontWeight: "600",
  },
  bubbleContainer: {
    marginHorizontal: 8,
  },
  bubble: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  bubbleText: {
    fontSize: 14,
    lineHeight: 20,
  },
  timestamp: {
    fontSize: 11,
    marginTop: 4,
  },
  timestampLeft: {
    textAlign: "left",
  },
  timestampRight: {
    textAlign: "right",
  },
  warningBanner: {
    marginTop: 16,
    marginHorizontal: 8,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  warningRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  warningIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  warningContent: {
    flex: 1,
  },
  warningTitle: {
    fontWeight: "600",
    fontSize: 15,
    marginBottom: 4,
  },
  warningBody: {
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  therapistButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  therapistButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  inputArea: {
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 100,
    borderWidth: 1,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  disclaimer: {
    fontSize: 11,
    textAlign: "center",
    marginTop: 8,
  },
});
