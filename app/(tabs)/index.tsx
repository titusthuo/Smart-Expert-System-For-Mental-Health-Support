import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  ImageSourcePropType,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuthTheme } from "@/hooks/use-auth-theme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// ─── Mood definitions ─────────────────────────────────────────────────────────
// Each mood carries the opening message the AI will use in the chat screen.
export const MOODS = [
  {
    emoji: "😊",
    label: "Great",
    aiGreeting:
      "That's wonderful to hear! 😊 I'm really glad you're feeling great today. What's been making your day so positive? I'd love to hear about it, and we can also explore ways to keep that energy going!",
  },
  {
    emoji: "😐",
    label: "Okay",
    aiGreeting:
      "Thanks for checking in. Feeling 'okay' is perfectly valid — sometimes days are just neutral, and that's alright. Is there anything on your mind you'd like to talk through, or anything that could make today feel a little better?",
  },
  {
    emoji: "😔",
    label: "Low",
    aiGreeting:
      "I'm sorry you're feeling low right now. 💙 It takes courage to acknowledge that, and I'm here with you. Would you like to share what's been weighing on you? Sometimes just talking about it can help lighten the load.",
  },
  {
    emoji: "😟",
    label: "Anxious",
    aiGreeting:
      "I hear you — anxiety can feel really overwhelming. 🤍 Let's take a breath together first. Try inhaling slowly for 4 counts, holding for 4, then exhaling for 4. Whenever you're ready, tell me what's been causing you to feel anxious.",
  },
  {
    emoji: "😤",
    label: "Stressed",
    aiGreeting:
      "I can understand how draining stress feels. You've done the right thing by reaching out. 💪 Let's work through this together — what's the biggest source of stress for you right now? We can break it down step by step.",
  },
] as const;

export type MoodLabel = (typeof MOODS)[number]["label"];

// ─── Image with graceful fallback ────────────────────────────────────────────
interface ImageWithFallbackProps {
  source: ImageSourcePropType;
  alt: string;
  className?: string;
  style?: any;
}

const ImageWithFallback = ({
  source,
  alt,
  className,
  style,
}: ImageWithFallbackProps) => {
  const [error, setError] = React.useState(false);
  return error ? (
    <View
      className={`items-center justify-center bg-muted ${className}`}
      style={style}
    >
      <Ionicons name="image-outline" size={28} color="#9CA3AF" />
      <Text className="text-xs text-muted-foreground text-center mt-1 px-2">
        {alt}
      </Text>
    </View>
  ) : (
    <Image
      source={source}
      className={className}
      style={style}
      onError={() => setError(true)}
      accessibilityLabel={alt}
      resizeMode="cover"
    />
  );
};

// ─── Pressable card with subtle scale feedback ────────────────────────────────
const PressableCard = ({
  onPress,
  children,
  className = "",
}: {
  onPress?: () => void;
  children: React.ReactNode;
  className?: string;
}) => {
  const scale = useRef(new Animated.Value(1)).current;
  const press = () => {
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 0.97,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start();
    onPress?.();
  };
  return (
    <TouchableOpacity activeOpacity={1} onPress={press} disabled={!onPress}>
      <Animated.View style={{ transform: [{ scale }] }} className={className}>
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
};

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const router = useRouter();
  const { isDark } = useAuthTheme();

  // Tracks which mood pill is highlighted (null = none selected yet)
  const [selectedMood, setSelectedMood] = useState<MoodLabel | null>(null);

  const logoImage = require("../../assets/logos/brain.jpg");
  const heroImage = require("../../assets/images/image-1.jpg");
  const gridImage1 = require("../../assets/images/image-2.png");
  const gridImage2 = require("../../assets/images/image-3.jpg");

  const HERO_HEIGHT = SCREEN_WIDTH < 400 ? 190 : 230;
  const GRID_IMG_HEIGHT = SCREEN_WIDTH < 400 ? 120 : 148;
  const iconColor = isDark ? "#A78BFA" : "#7C3AED";

  // ── Mood pill tap handler ────────────────────────────────────────────────
  const handleMoodSelect = (mood: (typeof MOODS)[number]) => {
    setSelectedMood(mood.label);

    // Small delay so the user sees the pill highlight before navigation
    setTimeout(() => {
      router.push({
        pathname: "/(tabs)/chat",
        params: {
          mood: mood.label,
          // Pass the AI greeting as a param so the chat screen can use it
          // as the very first AI message instead of the generic one.
          aiGreeting: mood.aiGreeting,
        },
      });
    }, 300);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent
      />

      {/* ══════════════════════════════════════════
          HEADER
      ══════════════════════════════════════════ */}
      <View className="flex-row items-center justify-between px-5 py-3.5 bg-card border-b border-border">
        <View className="flex-row items-center gap-2.5">
          <View className="w-10 h-10 rounded-full overflow-hidden border-2 border-brand/30">
            <Image
              source={logoImage}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>
          <View>
            <Text className="text-foreground font-bold text-[18px] tracking-tight leading-tight">
              Mentally
            </Text>
            <Text className="text-muted-foreground text-[11px] font-medium">
              Your wellness companion
            </Text>
          </View>
        </View>

        <View className="flex-row items-center gap-3">
          <TouchableOpacity className="w-9 h-9 rounded-full bg-muted items-center justify-center">
            <Ionicons
              name="notifications-outline"
              size={20}
              color={isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.5)"}
            />
          </TouchableOpacity>
          <View className="w-10 h-10 rounded-full bg-brand items-center justify-center">
            <Text className="text-white font-bold text-sm">JD</Text>
          </View>
        </View>
      </View>

      {/* ══════════════════════════════════════════
          SCROLLABLE BODY
      ══════════════════════════════════════════ */}
      <ScrollView
        className="flex-1 bg-background"
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 24,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Greeting ─────────────────────────────── */}
        <View className="mb-5">
          <Text className="text-foreground text-2xl font-bold tracking-tight mb-1">
            Good morning, John 👋
          </Text>
          <Text className="text-muted-foreground text-sm leading-5">
            How are you feeling today? We're here to help.
          </Text>
        </View>

        {/* ── Mood check-in section ─────────────────── */}
        <View className="mb-6">
          {/* Section label */}
          <View className="flex-row items-center gap-2 mb-3">
            <Ionicons name="happy-outline" size={16} color={iconColor} />
            <Text className="text-foreground font-bold text-sm tracking-tight">
              How are you feeling right now?
            </Text>
          </View>

          {/* Hint text — tells the user what tapping a pill does */}
          <Text className="text-muted-foreground text-xs mb-3 leading-4">
            Tap a mood and our AI will start a conversation tailored just for
            you.
          </Text>

          {/* Pill row */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="-mx-4"
            contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}
          >
            {MOODS.map((mood) => {
              const isSelected = selectedMood === mood.label;
              return (
                <TouchableOpacity
                  key={mood.label}
                  activeOpacity={0.75}
                  onPress={() => handleMoodSelect(mood)}
                  className={`flex-row items-center gap-1.5 px-4 py-2.5 rounded-full border ${
                    isSelected
                      ? "bg-brand border-brand"
                      : "bg-card border-border"
                  }`}
                >
                  <Text className="text-base">{mood.emoji}</Text>
                  <Text
                    className={`text-sm font-semibold ${
                      isSelected ? "text-white" : "text-foreground"
                    }`}
                  >
                    {mood.label}
                  </Text>
                  {/* Show a small arrow on selected to hint "navigating" */}
                  {isSelected && (
                    <Ionicons name="arrow-forward" size={13} color="#FFFFFF" />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* ── Hero image card ───────────────────────── */}
        <View className="mb-5 rounded-2xl overflow-hidden border border-border bg-card">
          <ImageWithFallback
            source={heroImage}
            alt="People meditating in a peaceful setting"
            className="w-full"
            style={{ height: HERO_HEIGHT }}
          />
          <View className="absolute bottom-0 left-0 right-0 px-4 py-3 bg-black/40">
            <Text className="text-white font-bold text-base">
              Your journey to better mental health
            </Text>
            <Text className="text-white/75 text-xs mt-0.5">
              Backed by evidence-based research
            </Text>
          </View>
        </View>

        {/* ── Main message card ─────────────────────── */}
        <View className="mb-5 rounded-2xl bg-card border border-border p-4">
          <View className="flex-row items-center gap-2 mb-3">
            <View className="w-9 h-9 rounded-full bg-brand/15 items-center justify-center">
              <Ionicons name="heart" size={18} color={iconColor} />
            </View>
            <Text className="text-foreground font-bold text-[15px] flex-1 leading-tight">
              Mental health is at the core of your well-being
            </Text>
          </View>

          <Text className="text-muted-foreground text-[13px] leading-5 mb-3">
            Take your mental health seriously. Chat with our AI for
            personalized, research-backed mental health assistance — anytime you
            need it.
          </Text>

          <View className="rounded-xl bg-brand/10 border border-brand/25 px-4 py-3">
            <View className="flex-row items-start gap-2">
              <Ionicons
                name="chatbubble-ellipses"
                size={14}
                color={iconColor}
                style={{ marginTop: 2 }}
              />
              <Text className="text-brand text-xs italic leading-5 flex-1">
                "Taking care of your mental health is not a luxury — it is a
                necessity for living a fulfilling life."
              </Text>
            </View>
          </View>
        </View>

        {/* ── Primary CTA ───────────────────────────── */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.push("/(tabs)/chat")}
          className="mb-5 rounded-2xl bg-brand flex-row items-center justify-center py-4 gap-2.5"
        >
          <Ionicons name="chatbubble-ellipses" size={20} color="#FFFFFF" />
          <Text className="text-white font-bold text-base tracking-tight">
            Chat with Mentally
          </Text>
        </TouchableOpacity>

        {/* ── Feature cards ─────────────────────────── */}
        <Text className="text-foreground font-bold text-base mb-3 tracking-tight">
          Explore Features
        </Text>

        <View className="flex-row gap-3 mb-5">
          <PressableCard
            className="flex-1 bg-card border border-border rounded-2xl p-4"
            onPress={() => router.push("/therapists")}
          >
            <View className="w-11 h-11 rounded-xl bg-blue-500/15 items-center justify-center mb-3">
              <Ionicons
                name="people"
                size={22}
                color={isDark ? "#60A5FA" : "#2563EB"}
              />
            </View>
            <Text className="text-foreground font-bold text-[13px] leading-5 mb-1">
              Find a Therapist
            </Text>
            <Text className="text-muted-foreground text-[11px] leading-4">
              Connect with qualified mental health professionals near you
            </Text>
            <View className="flex-row items-center mt-3 gap-1">
              <Text className="text-brand text-[11px] font-bold">Explore</Text>
              <Ionicons name="arrow-forward" size={11} color={iconColor} />
            </View>
          </PressableCard>

          <PressableCard
            className="flex-1 bg-card border border-border rounded-2xl p-4"
            onPress={() => router.push("/education")}
          >
            <View className="w-11 h-11 rounded-xl bg-green-500/15 items-center justify-center mb-3">
              <Ionicons
                name="book-outline"
                size={22}
                color={isDark ? "#4ADE80" : "#16A34A"}
              />
            </View>
            <Text className="text-foreground font-bold text-[13px] leading-5 mb-1">
              Learn &amp; Grow
            </Text>
            <Text className="text-muted-foreground text-[11px] leading-4">
              Evidence-based mental health education and resources
            </Text>
            <View className="flex-row items-center mt-3 gap-1">
              <Text className="text-brand text-[11px] font-bold">Explore</Text>
              <Ionicons name="arrow-forward" size={11} color={iconColor} />
            </View>
          </PressableCard>
        </View>

        {/* ── Daily tip card ────────────────────────── */}
        <View className="mb-5 rounded-2xl bg-green-500/10 border border-green-500/25 p-4">
          <View className="flex-row items-center gap-2 mb-2">
            <Ionicons
              name="bulb-outline"
              size={18}
              color={isDark ? "#4ADE80" : "#16A34A"}
            />
            <Text className="text-green-600 font-bold text-sm">
              Daily Wellness Tip
            </Text>
          </View>
          <Text className="text-foreground text-[13px] leading-5">
            Practice the{" "}
            <Text className="font-bold">4-7-8 breathing technique</Text>: inhale
            for 4 seconds, hold for 7, exhale for 8. It activates your
            parasympathetic nervous system and reduces anxiety within minutes.
          </Text>
        </View>

        {/* ── Image grid ────────────────────────────── */}
        <Text className="text-foreground font-bold text-base mb-3 tracking-tight">
          Wellness Insights
        </Text>

        <View className="flex-row gap-3">
          <PressableCard className="flex-1 bg-card border border-border rounded-2xl overflow-hidden">
            <ImageWithFallback
              source={gridImage1}
              alt="Woman practising self care"
              className="w-full"
              style={{ height: GRID_IMG_HEIGHT }}
            />
            <View className="p-3">
              <View className="flex-row items-center gap-1 mb-1">
                <Ionicons name="heart-outline" size={12} color={iconColor} />
                <Text className="text-brand text-[10px] font-bold uppercase tracking-wide">
                  Self-Care
                </Text>
              </View>
              <Text className="text-foreground text-[13px] font-bold leading-5">
                Self-Care Matters
              </Text>
              <Text className="text-muted-foreground text-[11px] leading-4 mt-0.5">
                Prioritize your mental well-being every day
              </Text>
            </View>
          </PressableCard>

          <PressableCard className="flex-1 bg-card border border-border rounded-2xl overflow-hidden">
            <ImageWithFallback
              source={gridImage2}
              alt="Mental health education"
              className="w-full"
              style={{ height: GRID_IMG_HEIGHT }}
            />
            <View className="p-3">
              <View className="flex-row items-center gap-1 mb-1">
                <Ionicons
                  name="flask-outline"
                  size={12}
                  color={isDark ? "#4ADE80" : "#16A34A"}
                />
                <Text
                  className="text-[10px] font-bold uppercase tracking-wide"
                  style={{ color: isDark ? "#4ADE80" : "#16A34A" }}
                >
                  Research
                </Text>
              </View>
              <Text className="text-foreground text-[13px] font-bold leading-5">
                Evidence-Based Support
              </Text>
              <Text className="text-muted-foreground text-[11px] leading-4 mt-0.5">
                Resources backed by scientific research
              </Text>
            </View>
          </PressableCard>
        </View>

        {/* ── Emergency banner ──────────────────────── */}
        <View className="mt-5 rounded-2xl bg-red-500/10 border border-red-500/25 p-4 flex-row items-center gap-3">
          <View className="w-10 h-10 rounded-full bg-red-500/20 items-center justify-center shrink-0">
            <Ionicons
              name="call"
              size={18}
              color={isDark ? "#F87171" : "#DC2626"}
            />
          </View>
          <View className="flex-1">
            <Text className="text-foreground font-bold text-[13px] mb-0.5">
              Need immediate help?
            </Text>
            <Text className="text-muted-foreground text-[11px] leading-4">
              Crisis helpline available 24/7. You are not alone.
            </Text>
          </View>
          <TouchableOpacity className="bg-red-500 px-3 py-2 rounded-xl">
            <Text className="text-white font-bold text-xs">Call Now</Text>
          </TouchableOpacity>
        </View>

        <View className="h-6" />
      </ScrollView>
    </SafeAreaView>
  );
}
