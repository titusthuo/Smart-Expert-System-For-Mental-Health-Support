import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    Dimensions,
    Image,
    Platform,
    ScrollView,
    StatusBar,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { HomeDialogs } from "@/components/home/home-dialogs";
import { ImageWithFallback } from "@/components/home/image-with-fallback";
import { PressableCard } from "@/components/home/pressable-card";
import { AppText, Button } from "@/components/ui";
import { useAuthTheme } from "@/hooks/use-auth-theme";
import { openUrlSafely } from "@/lib/links";
import { MOODS, MoodLabel } from "@/lib/moods";
import { useAuthSession } from "@/stores/useAuthSession";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const SPACING = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
} as const;

const CRISIS_HELPLINE = {
  name: "Kenya Red Cross",
  number: "1199",
} as const;

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const router = useRouter();
  const { border, brand, brandAccent, isDark, subtle, surface, text } =
    useAuthTheme();

  const [callConfirmVisible, setCallConfirmVisible] = useState(false);

  const [infoVisible, setInfoVisible] = useState(false);
  const [infoTitle, setInfoTitle] = useState("");
  const [infoMessage, setInfoMessage] = useState("");

  const session = useAuthSession((s) => s.session);

  const profileName = useMemo(() => {
    return (
      session?.profile?.name ||
      session?.user?.name ||
      session?.user?.username ||
      "User"
    );
  }, [session]);

  const firstName = useMemo(() => {
    const parts = profileName.trim().split(/\s+/).filter(Boolean);
    return parts[0] ?? "";
  }, [profileName]);

  const avatarInitials = useMemo(() => {
    const parts = profileName.trim().split(/\s+/).filter(Boolean);
    const first = parts[0]?.[0] ?? "";
    const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
    return (first + last).toUpperCase() || "U";
  }, [profileName]);

  // Greeting updates based on current time (no useMemo = always accurate)
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  // Daily wellness tip - rotates based on day of week (0=Sunday, 1=Monday, etc.)
  const dailyTips = [
    {
      icon: "fitness-outline",
      text: "Try 4-7-8 breathing: inhale for 4 counts, hold for 7, exhale for 8. This activates your calm response.",
    },
    {
      icon: "heart-outline",
      text: "Write down 3 things you're grateful for today. Gratitude can significantly boost your mood.",
    },
    {
      icon: "leaf-outline",
      text: "Take a 15-minute walk in nature. Even a short time outdoors can reduce stress by 15%.",
    },
    {
      icon: "moon-outline",
      text: "Digital detox 1 hour before bed. Screen-free time improves sleep quality and reduces anxiety.",
    },
    {
      icon: "people-outline",
      text: "Reach out to a friend or family member today. Social connection is vital for mental health.",
    },
  ];
  const todaysTip = dailyTips[new Date().getDay() % dailyTips.length];

  const openInfo = useCallback((title: string, message: string) => {
    setInfoTitle(title);
    setInfoMessage(message);
    setInfoVisible(true);
  }, []);

  const tryHaptics = useCallback((fn: () => Promise<unknown>) => {
    fn().catch(() => undefined);
  }, []);

  const placeHelplineCall = useCallback(async () => {
    const url =
      Platform.OS === "ios"
        ? `telprompt:${CRISIS_HELPLINE.number}`
        : `tel:${CRISIS_HELPLINE.number}`;

    try {
      const opened = await openUrlSafely(url);
      if (!opened) {
        openInfo(
          "Unable to place call",
          "Calling is not available on this device.",
        );
        return;
      }
    } catch {
      openInfo(
        "Unable to place call",
        "Something went wrong while trying to start the call.",
      );
    }
  }, [openInfo]);

  const handleCallNow = useCallback(() => {
    tryHaptics(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium));
    setCallConfirmVisible(true);
  }, [tryHaptics]);

  // Tracks which mood pill is highlighted (null = none selected yet)
  const [selectedMood, setSelectedMood] = useState<MoodLabel | null>(null);

  // Auto-scroll animation for mood pills
  const moodScrollRef = useRef<ScrollView>(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const scrollIntervalRef = useRef<any>(null);
  const resumeTimeoutRef = useRef<any>(null);

  useEffect(() => {
    let scrollPosition = 0;

    const startAutoScroll = () => {
      if (scrollIntervalRef.current) return; // Already running

      scrollIntervalRef.current = setInterval(() => {
        if (!isUserScrolling) {
          scrollPosition += 1; // Scroll 1px right every 30ms
          moodScrollRef.current?.scrollTo({
            x: scrollPosition,
            animated: false,
          });

          // Reset when reaching the end (approximate)
          if (scrollPosition > MOODS.length * 120) {
            scrollPosition = 0;
          }
        }
      }, 30); // Smooth scroll speed
    };

    startAutoScroll();

    return () => {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
        scrollIntervalRef.current = null;
      }
      if (resumeTimeoutRef.current) {
        clearTimeout(resumeTimeoutRef.current);
        resumeTimeoutRef.current = null;
      }
    };
  }, [isUserScrolling]);

  const logoImage = require("../../assets/logos/brain.jpg");
  const heroImage = require("../../assets/images/image-1.jpg");
  const gridImage1 = require("../../assets/images/image-2.png");
  const gridImage2 = require("../../assets/images/image-3.jpg");

  const HERO_HEIGHT = SCREEN_WIDTH < 400 ? 190 : 230;
  const GRID_IMG_HEIGHT = SCREEN_WIDTH < 400 ? 120 : 148;
  const INSIGHT_CARD_WIDTH = Math.min(
    320,
    Math.max(248, Math.round(SCREEN_WIDTH * 0.72)),
  );

  // ── Mood pill tap handler ────────────────────────────────────────────────
  const handleMoodSelect = (mood: (typeof MOODS)[number]) => {
    setSelectedMood(mood.label);

    tryHaptics(() => Haptics.selectionAsync());

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
      <View className="flex-row items-center justify-between px-5 bg-card border-b border-border h-14">
        <View className="flex-row items-center gap-2.5">
          <View className="w-9 h-9 rounded-full overflow-hidden border border-border">
            <Image
              source={logoImage}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
              accessibilityLabel="Mentally logo"
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

        <View className="flex-row items-center gap-2.5">
          <TouchableOpacity
            className="w-9 h-9 rounded-full bg-muted items-center justify-center"
            accessibilityRole="button"
            accessibilityLabel="Notifications"
            activeOpacity={0.8}
          >
            <Ionicons name="notifications-outline" size={20} color={subtle} />
          </TouchableOpacity>
          <View
            className="w-9 h-9 rounded-full items-center justify-center border"
            style={{ backgroundColor: brand, borderColor: border }}
            accessibilityLabel="Profile"
          >
            <AppText unstyled className="text-white font-bold text-[13px]">
              {avatarInitials}
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
          paddingHorizontal: SPACING.md,
          paddingTop: SPACING.lg,
          paddingBottom: SPACING.xl,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Greeting ─────────────────────────────── */}
        <View style={{ marginBottom: SPACING.xl }}>
          <AppText
            unstyled
            className="text-foreground text-2xl font-bold tracking-tight mb-1"
          >
            {greeting}
            {firstName ? `, ${firstName}` : ""} 👋
          </AppText>
          <AppText unstyled className="text-muted-foreground text-sm leading-5">
            How are you feeling right now? I’m here with you.
          </AppText>
        </View>

        {/* ── Mood check-in section ─────────────────── */}
        <View style={{ marginBottom: SPACING.xl }}>
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
            ref={moodScrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: SPACING.md, gap: 10 }}
            scrollEnabled={true} // Allow manual scrolling
            onTouchStart={() => {
              // Stop auto-scroll when user starts touching
              setIsUserScrolling(true);
              if (resumeTimeoutRef.current) {
                clearTimeout(resumeTimeoutRef.current);
              }
            }}
            onTouchEnd={() => {
              // Resume auto-scroll 2 seconds after user stops touching
              if (resumeTimeoutRef.current) {
                clearTimeout(resumeTimeoutRef.current);
              }
              resumeTimeoutRef.current = setTimeout(() => {
                setIsUserScrolling(false);
              }, 2000);
            }}
          >
            {MOODS.map((mood) => {
              const isSelected = selectedMood === mood.label;
              return (
                <TouchableOpacity
                  key={mood.label}
                  activeOpacity={0.75}
                  onPress={() => handleMoodSelect(mood)}
                  className="flex-row items-center gap-1.5 px-4 py-2.5 rounded-full border"
                  style={{
                    backgroundColor: isSelected ? brand : surface,
                    borderColor: isSelected ? brand : border,
                  }}
                  accessibilityRole="button"
                  accessibilityLabel={`Mood: ${mood.label}`}
                >
                  <AppText unstyled className="text-base">
                    {mood.emoji}
                  </AppText>
                  <AppText
                    unstyled
                    className="text-sm font-semibold"
                    style={{ color: isSelected ? "#FFFFFF" : text }}
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
        <View
          className="rounded-2xl overflow-hidden border border-border bg-card"
          style={{ marginBottom: SPACING.lg }}
        >
          <ImageWithFallback
            source={heroImage}
            alt="People meditating in a peaceful setting"
            style={{ height: HERO_HEIGHT, width: "100%" }}
          />
          <View className="absolute inset-0" pointerEvents="none">
            <View className="flex-1" />
            <View style={{ height: HERO_HEIGHT * 0.55 }}>
              <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.08)" }} />
              <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.22)" }} />
              <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.42)" }} />
            </View>
          </View>

          <View className="absolute bottom-0 left-0 right-0 px-4 py-3">
            <AppText unstyled className="text-white font-bold text-base">
              A calmer moment, right now
            </AppText>
            <AppText unstyled className="text-white/80 text-xs mt-0.5">
              Small steps add up. You don’t have to do this alone.
            </AppText>
          </View>
        </View>

        <View
          className="rounded-2xl bg-card border border-border p-4"
          style={{ marginBottom: SPACING.lg }}
        >
          <View className="flex-row items-center gap-2 mb-2">
            <Ionicons
              name={todaysTip.icon as any}
              size={18}
              color={isDark ? "#4ADE80" : "#16A34A"}
            />
            <AppText unstyled className="text-green-600 font-bold text-sm">
              Daily Wellness Tip
            </AppText>
          </View>
          <AppText unstyled className="text-foreground text-[13px] leading-5">
            {todaysTip.text}
          </AppText>
        </View>

        {/* ── Image grid ────────────────────────────── */}
        <AppText
          unstyled
          className="text-foreground font-bold text-base tracking-tight"
          style={{ marginBottom: SPACING.sm }}
        >
          Wellness Insights
        </AppText>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="-mr-4"
        >
          <View className="flex-row pr-4">
            <PressableCard
              className="mr-3 bg-card border border-border rounded-2xl overflow-hidden"
              style={{ width: INSIGHT_CARD_WIDTH }}
            >
              <ImageWithFallback
                source={gridImage1}
                alt="Woman practising self care"
                style={{ height: GRID_IMG_HEIGHT, width: "100%" }}
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

            <PressableCard
              className="bg-card border border-border rounded-2xl overflow-hidden"
              style={{ width: INSIGHT_CARD_WIDTH }}
            >
              <ImageWithFallback
                source={gridImage2}
                alt="Mental health education"
                style={{ height: GRID_IMG_HEIGHT, width: "100%" }}
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
        <View
          className="rounded-2xl border p-4 flex-row items-center gap-3"
          style={{
            marginTop: SPACING.xl,
            borderColor: isDark
              ? "rgba(168,85,247,0.25)"
              : "rgba(124,58,237,0.25)",
            backgroundColor: isDark
              ? "rgba(168,85,247,0.10)"
              : "rgba(124,58,237,0.08)",
          }}
        >
          <View
            className="w-10 h-10 rounded-full items-center justify-center shrink-0"
            style={{
              backgroundColor: isDark
                ? "rgba(168,85,247,0.18)"
                : "rgba(124,58,237,0.14)",
            }}
          >
            <Ionicons name="call" size={18} color={brandAccent} />
          </View>
          <View className="flex-1">
            <AppText
              unstyled
              className="text-foreground font-bold text-[13px] mb-0.5"
            >
              Need to talk to someone?
            </AppText>
            <AppText
              unstyled
              className="text-muted-foreground text-[11px] leading-4"
            >
              Free, confidential support is available 24/7.
            </AppText>
          </View>
          <Button text="Call" onPress={handleCallNow} className="h-11 px-4" />
        </View>

        <View className="h-6" />
      </ScrollView>

      <HomeDialogs
        callConfirmVisible={callConfirmVisible}
        onCloseCallConfirm={() => setCallConfirmVisible(false)}
        helplineName={CRISIS_HELPLINE.name}
        helplineNumber={CRISIS_HELPLINE.number}
        onConfirmCall={() => {
          setCallConfirmVisible(false);
          tryHaptics(() =>
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning),
          );
          placeHelplineCall().catch(() => undefined);
        }}
        infoVisible={infoVisible}
        infoTitle={infoTitle}
        infoMessage={infoMessage}
        onCloseInfo={() => setInfoVisible(false)}
      />
    </SafeAreaView>
  );
}
