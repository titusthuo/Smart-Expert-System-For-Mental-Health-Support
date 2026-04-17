import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuthTheme } from "@/hooks/use-auth-theme";
import { useAuthSession } from "@/stores/useAuthSession";

const { width } = Dimensions.get("window");
const HERO_HEIGHT = Math.round(width * 0.58);

type Slide = {
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  tone: "dark" | "light";
};

type OnboardingColors = {
  isDark: boolean;
  background: string;
  hero: string;
  heroSoft: string;
  splashHeroBg: string;
  buttonBg: string;
  buttonText: string;
  surface: string;
  border: string;
  text: string;
  muted: string;
  accent: string;
  textOnDark: string;
  textOnDarkMuted: string;
};

export default function OnboardingScreen() {
  const router = useRouter();
  const theme = useAuthTheme();
  const setHasSeenOnboarding = useAuthSession((s) => s.setHasSeenOnboarding);
  const [stage, setStage] = useState<"splash" | "slides">("splash");
  const [slideIndex, setSlideIndex] = useState(0);
  const scrollRef = useRef<ScrollView | null>(null);

  const colors: OnboardingColors = useMemo(
    () => ({
      isDark: theme.isDark,
      background: theme.isDark ? theme.bg : theme.brandSoft,
      hero: theme.brand,
      heroSoft: theme.brandSoft,
      splashHeroBg: theme.isDark ? "hsl(220, 30%, 16%)" : theme.brand,
      buttonBg: theme.isDark ? "#A3C4E8" : theme.brand,
      buttonText: theme.isDark ? "hsl(220, 30%, 12%)" : "#FFFFFF",
      surface: theme.surface,
      border: theme.border,
      text: theme.text,
      muted: theme.subtle,
      accent: theme.brand,
      textOnDark: "#FFFFFF",
      textOnDarkMuted: "rgba(255,255,255,0.7)",
    }),
    [theme],
  );

  const slides: Slide[] = useMemo(
    () => [
      {
        title: "Your AI wellness companion",
        description:
          "Talk anytime. It listens without judgment, adapts to your mood, and helps you make sense of what you are going through.",
        icon: "phone-portrait-outline",
        tone: "dark",
      },
      {
        title: "See your patterns clearly",
        description:
          "Log your mood in seconds each day. Watch trends over time so you understand what helps and what does not.",
        icon: "happy-outline",
        tone: "light",
      },
      {
        title: "Connect with real professionals",
        description:
          "Browse verified therapists, read reviews, and book sessions that fit your schedule from one place.",
        icon: "call",
        tone: "dark",
      },
      {
        title: "Your privacy is sacred",
        description:
          "Everything you share stays with you. End-to-end encrypted, never sold, always judgment-free.",
        icon: "shield-checkmark-outline",
        tone: "light",
      },
    ],
    [],
  );

  const markSeenAndGoSignIn = useCallback(() => {
    setHasSeenOnboarding(true);
    router.replace("/(auth)/sign-in");
  }, [router, setHasSeenOnboarding]);

  const markSeenAndGoSignUp = useCallback(() => {
    setHasSeenOnboarding(true);
    router.push("/(auth)/sign-up");
  }, [router, setHasSeenOnboarding]);

  const handleSlideBack = useCallback(() => {
    if (slideIndex > 0) {
      const prevIndex = slideIndex - 1;
      setSlideIndex(prevIndex);
      scrollRef.current?.scrollTo({ x: width * prevIndex, animated: true });
    } else {
      setStage("splash");
    }
  }, [slideIndex]);

  const handleSlideNext = useCallback(() => {
    if (slideIndex < slides.length - 1) {
      const nextIndex = slideIndex + 1;
      setSlideIndex(nextIndex);
      scrollRef.current?.scrollTo({ x: width * nextIndex, animated: true });
    } else {
      markSeenAndGoSignUp();
    }
  }, [markSeenAndGoSignUp, slideIndex, slides.length]);

  const handleScrollEnd = useCallback(
    (event: { nativeEvent: { contentOffset: { x: number } } }) => {
      const nextIndex = Math.round(event.nativeEvent.contentOffset.x / width);
      if (nextIndex !== slideIndex) {
        setSlideIndex(nextIndex);
      }
    },
    [slideIndex],
  );

  const heroIsDark =
    colors.isDark ||
    stage === "splash" ||
    (stage === "slides" && slides[slideIndex].tone === "dark");

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}> 
      <StatusBar
        barStyle={heroIsDark ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent
      />

      {stage === "splash" ? (
        <SplashScreen
          colors={colors}
          onStart={() => {
            setSlideIndex(0);
            setStage("slides");
            scrollRef.current?.scrollTo({ x: 0, animated: false });
          }}
          onSignIn={markSeenAndGoSignIn}
        />
      ) : (
        <SlideScreen
          colors={colors}
          slides={slides}
          currentIndex={slideIndex}
          onNext={handleSlideNext}
          onBack={handleSlideBack}
          onSkip={markSeenAndGoSignIn}
          onScrollEnd={handleScrollEnd}
          scrollRef={scrollRef}
        />
      )}
    </SafeAreaView>
  );
}

function SplashScreen({
  colors,
  onStart,
  onSignIn,
}: {
  colors: OnboardingColors;
  onStart: () => void;
  onSignIn: () => void;
}) {
  return (
    <View style={styles.flex1}>
      <View style={[styles.splashHero, { backgroundColor: colors.splashHeroBg }]}> 
        <View style={[styles.logoMark, { borderColor: colors.isDark ? "rgba(163,196,232,0.5)" : colors.heroSoft }]}> 
          <Ionicons name="happy-outline" size={28} color={colors.isDark ? "#A3C4E8" : colors.heroSoft} />
        </View>
        <Text style={[styles.splashWordmark, { color: colors.textOnDark }]}>Mentally</Text>
        <Text style={[styles.splashTagline, { color: colors.textOnDarkMuted }]}> 
          A calm, private space to support{"\n"}your mental wellbeing
        </Text>
      </View>

      <View style={styles.pillsRow}>
        <Pill label="Safe & private" colors={colors} />
        <Pill label="24/7 support" colors={colors} />
        <Pill label="Free to start" colors={colors} />
      </View>

      <View style={styles.splashButtons}>
        <TouchableOpacity style={[styles.btnPrimary, { backgroundColor: colors.buttonBg }]} onPress={onStart}>
          <Text style={[styles.btnPrimaryText, { color: colors.buttonText }]}>Get started</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btnSecondary, { borderColor: colors.border }]} onPress={onSignIn}>
          <Text style={[styles.btnSecondaryText, { color: colors.text }]}>I already have an account</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.legal, { color: colors.muted }]}> 
        By continuing you agree to our <Text style={[styles.legalLink, { color: colors.accent }]}>Terms</Text> &{" "}
        <Text style={[styles.legalLink, { color: colors.accent }]}>Privacy Policy</Text>
      </Text>
    </View>
  );
}

function SlideScreen({
  colors,
  slides,
  currentIndex,
  onNext,
  onBack,
  onSkip,
  onScrollEnd,
  scrollRef,
}: {
  colors: OnboardingColors;
  slides: Slide[];
  currentIndex: number;
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
  onScrollEnd: (event: { nativeEvent: { contentOffset: { x: number } } }) => void;
  scrollRef: React.RefObject<ScrollView | null>;
}) {
  const total = slides.length;
  const isLast = currentIndex === total - 1;
  return (
    <View style={styles.flex1}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScrollEnd}
        contentContainerStyle={styles.scrollContent}
      >
        {slides.map((slide) => {
          const heroBg = colors.isDark
            ? (slide.tone === "dark" ? "hsl(220, 30%, 18%)" : "hsl(220, 25%, 14%)")
            : (slide.tone === "dark" ? colors.hero : colors.heroSoft);
          const iconBg = colors.isDark ? "rgba(163,196,232,0.18)" : "rgba(27,42,74,0.08)";
          const iconBorder = colors.isDark ? "rgba(163,196,232,0.4)" : "rgba(27,42,74,0.25)";
          const iconColor = colors.isDark ? "#A3C4E8" : colors.hero;

          return (
            <View key={slide.title} style={[styles.slidePage, { width }]}>
              <View style={[styles.hero, { backgroundColor: heroBg }]}> 
                <View
                  style={[
                    styles.heroHalo,
                    { backgroundColor: iconBg, borderColor: iconBorder, borderWidth: 1 },
                  ]}
                > 
                  <Ionicons name={slide.icon} size={48} color={iconColor} />
                </View>
                <View
                  style={[
                    styles.heroCard,
                    {
                      backgroundColor: colors.isDark ? "hsl(220, 25%, 22%)" : colors.surface,
                      borderColor: colors.isDark ? "rgba(163,196,232,0.25)" : colors.border,
                    },
                  ]}
                >
                  <View style={[styles.heroLine, { backgroundColor: colors.isDark ? "rgba(163,196,232,0.2)" : colors.heroSoft }]} />
                  <View style={[styles.heroLineSmall, { backgroundColor: colors.isDark ? "rgba(163,196,232,0.15)" : colors.heroSoft }]} />
                  <View
                    style={[
                      styles.heroTag,
                      {
                        borderColor: colors.isDark ? "rgba(163,196,232,0.45)" : colors.hero,
                        backgroundColor: colors.isDark ? "rgba(163,196,232,0.12)" : colors.heroSoft,
                      },
                    ]}
                  >
                    <Text style={[styles.heroTagText, { color: colors.isDark ? "#A3C4E8" : colors.hero }]}>Daily check-in</Text>
                  </View>
                </View>
              </View>

              <View style={styles.slideContent}>
                <Dots total={total} current={currentIndex} colors={colors} />
                <Text style={[styles.slideTitle, { color: colors.text }]}>{slide.title}</Text>
                <Text style={[styles.slideDesc, { color: colors.muted }]}>{slide.description}</Text>
              </View>
            </View>
          );
        })}
      </ScrollView>

      <View style={styles.slideFooter}>
        <View style={styles.footerRow}>
          <TouchableOpacity
            style={[styles.backBtn, { borderColor: colors.border }]}
            onPress={onBack}
          >
            <Ionicons name="chevron-back" size={20} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btnPrimary, styles.flex1, { backgroundColor: colors.buttonBg }]}
            onPress={onNext}
          >
            <Text style={[styles.btnPrimaryText, { color: colors.buttonText }]}>
              {isLast ? "Create my account" : "Next"}
            </Text>
          </TouchableOpacity>
        </View>
        {!isLast && (
          <TouchableOpacity style={styles.skipBtn} onPress={onSkip}>
            <Text style={[styles.skipText, { color: colors.muted }]}>Skip intro</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

function Pill({ label, colors }: { label: string; colors: OnboardingColors }) {
  return (
    <View style={[styles.pill, { borderColor: colors.border, backgroundColor: colors.surface }]}> 
      <Text style={[styles.pillText, { color: colors.accent }]}>{label}</Text>
    </View>
  );
}

function Dots({
  total,
  current,
  colors,
}: {
  total: number;
  current: number;
  colors: OnboardingColors;
}) {
  return (
    <View style={styles.dotsRow}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            { backgroundColor: colors.border },
            i === current && { backgroundColor: colors.hero, width: 22 },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex1: { flex: 1 },
  splashHero: {
    paddingTop: 52,
    paddingBottom: 32,
    paddingHorizontal: 28,
    alignItems: "center",
  },
  logoMark: {
    width: 64,
    height: 64,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  splashWordmark: {
    fontSize: 26,
    fontWeight: "600",
    letterSpacing: -0.6,
    marginBottom: 8,
  },
  splashTagline: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 21,
  },
  pillsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingHorizontal: 20,
    paddingTop: 20,
    justifyContent: "center",
  },
  pill: {
    borderRadius: 999,
    borderWidth: 0.5,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  pillText: {
    fontSize: 12,
    fontWeight: "600",
  },
  splashButtons: {
    paddingHorizontal: 24,
    paddingTop: 28,
    gap: 10,
  },
  legal: {
    fontSize: 11,
    textAlign: "center",
    paddingHorizontal: 28,
    paddingTop: 14,
    lineHeight: 17,
  },
  legalLink: { fontWeight: "600" },
  btnPrimary: {
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
  },
  btnPrimaryText: {
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: -0.2,
  },
  btnSecondary: {
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
    borderWidth: 0.5,
  },
  btnSecondaryText: {
    fontSize: 15,
    fontWeight: "500",
    letterSpacing: -0.2,
  },
  hero: {
    height: HERO_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  heroHalo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  heroCard: {
    marginTop: 18,
    width: 180,
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
  },
  heroLine: {
    height: 8,
    borderRadius: 4,
    marginBottom: 10,
  },
  heroLineSmall: {
    height: 6,
    borderRadius: 3,
    width: "70%",
    marginBottom: 10,
  },
  heroTag: {
    alignSelf: "flex-start",
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  heroTagText: {
    fontSize: 11,
    fontWeight: "600",
  },
  scrollContent: {
    alignItems: "stretch",
  },
  slidePage: {
    flex: 1,
  },
  slideContent: {
    flex: 1,
    paddingHorizontal: 26,
    paddingTop: 22,
  },
  dotsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 16,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  slideTitle: {
    fontSize: 22,
    fontWeight: "600",
    letterSpacing: -0.5,
    lineHeight: 28,
    marginBottom: 10,
  },
  slideDesc: {
    fontSize: 14,
    lineHeight: 22,
  },
  slideFooter: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    gap: 8,
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  backBtn: {
    width: 48,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  skipBtn: {
    alignItems: "center",
    paddingVertical: 8,
  },
  skipText: {
    fontSize: 13,
  },
});
