import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { ReactNode, useCallback, useRef, useState } from "react";
import {
    Alert,
    Animated,
    BackHandler,
    Dimensions,
    Image,
    ImageSourcePropType,
    Linking,
    Modal,
    Platform,
    ScrollView,
    StatusBar,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppText } from "@/components/ui";
import { useAuthTheme } from "@/hooks/use-auth-theme";
import { MOODS, MoodLabel } from "@/lib/moods";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const CRISIS_HELPLINE = {
  name: "Kenya Red Cross",
  number: "1199",
} as const;

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
  const [error, setError] = useState(false);
  return error ? (
    <View
      className={`items-center justify-center bg-muted ${className}`}
      style={style}
    >
      <Ionicons name="image-outline" size={28} color="#9CA3AF" />
      <AppText
        unstyled
        className="text-xs text-muted-foreground text-center mt-1 px-2"
      >
        {alt}
      </AppText>
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
  children: ReactNode;
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
  const { isDark, brandAccent } = useAuthTheme();

  const [callConfirmVisible, setCallConfirmVisible] = useState(false);

  const placeHelplineCall = useCallback(async () => {
    const url =
      Platform.OS === "ios"
        ? `telprompt:${CRISIS_HELPLINE.number}`
        : `tel:${CRISIS_HELPLINE.number}`;

    try {
      const canOpen = await Linking.canOpenURL(url);
      if (!canOpen) {
        Alert.alert(
          "Unable to place call",
          "Calling is not available on this device."
        );
        return;
      }
      await Linking.openURL(url);
    } catch {
      Alert.alert(
        "Unable to place call",
        "Something went wrong while trying to start the call."
      );
    }
  }, []);

  const handleCallNow = useCallback(() => {
    setCallConfirmVisible(true);
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (Platform.OS !== "android") {
        return;
      }

      const sub = BackHandler.addEventListener("hardwareBackPress", () => {
        router.replace("/(auth)/sign-in");
        return true;
      });

      return () => sub.remove();
    }, [router])
  );

  // Tracks which mood pill is highlighted (null = none selected yet)
  const [selectedMood, setSelectedMood] = useState<MoodLabel | null>(null);

  const logoImage = require("../../assets/logos/brain.jpg");
  const heroImage = require("../../assets/images/image-1.jpg");
  const gridImage1 = require("../../assets/images/image-2.png");
  const gridImage2 = require("../../assets/images/image-3.jpg");

  const HERO_HEIGHT = SCREEN_WIDTH < 400 ? 190 : 230;
  const GRID_IMG_HEIGHT = SCREEN_WIDTH < 400 ? 120 : 148;

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
            <AppText
              unstyled
              className="text-foreground font-bold text-[18px] tracking-tight leading-tight"
            >
              Mentally
            </AppText>
            <AppText
              unstyled
              className="text-muted-foreground text-[11px] font-medium"
            >
              Your wellness companion
            </AppText>
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
            <AppText unstyled className="text-white font-bold text-sm">
              JD
            </AppText>
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
          <AppText
            unstyled
            className="text-foreground text-2xl font-bold tracking-tight mb-1"
          >
            Good morning, John 👋
          </AppText>
          <AppText unstyled className="text-muted-foreground text-sm leading-5">
            How are you feeling today? We&apos;re here to help.
          </AppText>
        </View>

        {/* ── Mood check-in section ─────────────────── */}
        <View className="mb-6">
          {/* Section label */}
          <View className="flex-row items-center gap-2 mb-3">
            <Ionicons name="happy-outline" size={16} color={brandAccent} />
            <AppText
              unstyled
              className="text-foreground font-bold text-sm tracking-tight"
            >
              How are you feeling right now?
            </AppText>
          </View>

          {/* Hint text — tells the user what tapping a pill does */}
          <AppText
            unstyled
            className="text-muted-foreground text-xs mb-3 leading-4"
          >
            Tap a mood and our AI will start a conversation tailored just for
            you.
          </AppText>

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
                  <AppText unstyled className="text-base">
                    {mood.emoji}
                  </AppText>
                  <AppText
                    unstyled
                    className={`text-sm font-semibold ${
                      isSelected ? "text-white" : "text-foreground"
                    }`}
                  >
                    {mood.label}
                  </AppText>
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
            <AppText unstyled className="text-white font-bold text-base">
              Your journey to better mental health
            </AppText>
            <AppText unstyled className="text-white/75 text-xs mt-0.5">
              Backed by evidence-based research
            </AppText>
          </View>
        </View>

        {/* ── Main message card ─────────────────────── */}
        <View className="mb-5 rounded-2xl bg-card border border-border p-4">
          <View className="flex-row items-center gap-2 mb-3">
            <View className="w-9 h-9 rounded-full bg-brand/15 items-center justify-center">
              <Ionicons name="heart" size={18} color={brandAccent} />
            </View>
            <AppText
              unstyled
              className="text-foreground font-bold text-sm tracking-tight"
            >
              Mental health is at the core of your well-being
            </AppText>
          </View>

          <AppText
            unstyled
            className="text-muted-foreground text-[13px] leading-5 mb-3"
          >
            Take your mental health seriously. Chat with our AI for
            personalized, research-backed mental health assistance — anytime you
            need it.
          </AppText>

          <AppText
            unstyled
            className="text-muted-foreground text-[11px] font-medium"
          >
            Your wellness companion
          </AppText>
        </View>

        <View className="mb-5 rounded-2xl bg-card border border-border p-4">
          <View className="flex-row items-center gap-2 mb-2">
            <Ionicons
              name="bulb-outline"
              size={18}
              color={isDark ? "#4ADE80" : "#16A34A"}
            />
            <AppText unstyled className="text-green-600 font-bold text-sm">
              Daily Wellness Tip
            </AppText>
          </View>
          <AppText unstyled className="text-foreground text-[13px] leading-5">
            Practice the{" "}
            <AppText unstyled className="font-bold">
              4-7-8 breathing technique
            </AppText>
            : inhale for 4 seconds, hold for 7, exhale for 8. It activates your
            parasympathetic nervous system and reduces anxiety within minutes.
          </AppText>
        </View>

        {/* ── Image grid ────────────────────────────── */}
        <AppText
          unstyled
          className="text-foreground font-bold text-base mb-3 tracking-tight"
        >
          Wellness Insights
        </AppText>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="-mr-4"
        >
          <View className="flex-row pr-4">
            <PressableCard className="w-[260px] mr-3 bg-card border border-border rounded-2xl overflow-hidden">
              <ImageWithFallback
                source={gridImage1}
                alt="Woman practising self care"
                className="w-full"
                style={{ height: GRID_IMG_HEIGHT }}
              />
              <View className="p-3">
                <View className="flex-row items-center gap-1 mb-1">
                  <Ionicons
                    name="heart-outline"
                    size={12}
                    color={brandAccent}
                  />
                  <AppText
                    unstyled
                    className="text-brand text-[10px] font-bold uppercase tracking-wide"
                  >
                    Self-Care
                  </AppText>
                </View>
                <AppText
                  unstyled
                  className="text-foreground text-[13px] font-bold leading-5"
                >
                  Self-Care Matters
                </AppText>
                <AppText
                  unstyled
                  className="text-muted-foreground text-[11px] leading-4 mt-0.5"
                >
                  Prioritize your mental well-being every day
                </AppText>
              </View>
            </PressableCard>

            <PressableCard className="w-[260px] bg-card border border-border rounded-2xl overflow-hidden">
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
                  <AppText
                    unstyled
                    className="text-[10px] font-bold uppercase tracking-wide"
                    style={{ color: isDark ? "#4ADE80" : "#16A34A" }}
                  >
                    Research
                  </AppText>
                </View>
                <AppText
                  unstyled
                  className="text-foreground text-[13px] font-bold leading-5"
                >
                  Evidence-Based Support
                </AppText>
                <AppText
                  unstyled
                  className="text-muted-foreground text-[11px] leading-4 mt-0.5"
                >
                  Resources backed by scientific research
                </AppText>
              </View>
            </PressableCard>
          </View>
        </ScrollView>

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
            <AppText
              unstyled
              className="text-foreground font-bold text-[13px] mb-0.5"
            >
              Need immediate help?
            </AppText>
            <AppText
              unstyled
              className="text-muted-foreground text-[11px] leading-4"
            >
              Crisis helpline available 24/7. You are not alone.
            </AppText>
          </View>
          <TouchableOpacity
            className="bg-red-500 px-3 py-2 rounded-xl"
            onPress={handleCallNow}
            activeOpacity={0.85}
          >
            <AppText unstyled className="text-white font-bold text-xs">
              Call Now
            </AppText>
          </TouchableOpacity>
        </View>

        <View className="h-6" />
      </ScrollView>

      <Modal
        visible={callConfirmVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setCallConfirmVisible(false)}
      >
        <View className="flex-1 bg-black/70 justify-center items-center px-6">
          <View className="bg-card rounded-2xl p-6 w-full max-w-sm border border-border">
            <AppText unstyled className="text-foreground font-bold text-lg mb-1">
              Call helpline
            </AppText>
            <AppText unstyled className="text-muted-foreground text-sm leading-5 mb-5">
              {`Call ${CRISIS_HELPLINE.name} (${CRISIS_HELPLINE.number}) for immediate support?`}
            </AppText>

            <View className="flex-row justify-end space-x-3">
              <TouchableOpacity
                onPress={() => setCallConfirmVisible(false)}
                className="px-5 py-3 border border-border rounded-lg"
                activeOpacity={0.9}
              >
                <AppText unstyled className="text-foreground font-semibold">
                  Cancel
                </AppText>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={async () => {
                  setCallConfirmVisible(false);
                  await placeHelplineCall();
                }}
                className="px-5 py-3 bg-red-500 rounded-lg"
                activeOpacity={0.9}
              >
                <AppText unstyled className="text-white font-semibold">
                  Call Now
                </AppText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
