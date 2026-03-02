import { Card } from "@/components/ui";
import { useAuthTheme } from "@/hooks/use-auth-theme";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  Dimensions,
  Image,
  ImageSourcePropType,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// ── Use this SafeAreaView instead ────────────────────────────────────────────
import { SafeAreaView } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const HeartIcon = ({ size = 24, color }: { size?: number; color: string }) => (
  <Text style={{ fontSize: size, color }}>♥</Text>
);

const MessageCircleIcon = ({
  size = 24,
  color,
}: {
  size?: number;
  color: string;
}) => <Text style={{ fontSize: size, color }}>💬</Text>;

const UsersIcon = ({ size = 24, color }: { size?: number; color: string }) => (
  <Text style={{ fontSize: size, color }}>👥</Text>
);

const BookOpenIcon = ({
  size = 24,
  color,
}: {
  size?: number;
  color: string;
}) => <Text style={{ fontSize: size, color }}>📘</Text>;

// ─── ImageWithFallback ────────────────────────────────────────────────────────
interface ImageWithFallbackProps {
  source: ImageSourcePropType;
  alt: string;
  style?: object;
}

const ImageWithFallback = ({ source, alt, style }: ImageWithFallbackProps) => {
  const [error, setError] = React.useState(false);
  return error ? (
    <View style={[style, styles.imageFallback]}>
      <Text style={styles.imageFallbackText}>{alt}</Text>
    </View>
  ) : (
    <Image
      source={source}
      style={style}
      onError={() => setError(true)}
      accessibilityLabel={alt}
      resizeMode="cover"
    />
  );
};

// ─── HomePage ─────────────────────────────────────────────────────────────────
export default function HomePage() {
  const navigation = useNavigation<any>();
  const { bg, surface, border, text, subtle, brand, brandSoft, success, info } =
    useAuthTheme();
  const isDark = bg === "hsl(0, 0%, 9%)";
  const bodyText = isDark ? "#D1D5DB" : subtle;
  const quoteBg = isDark ? "#2D1B69" : brandSoft;
  const quoteBorder = isDark ? "#7C3AED" : brand;
  const quoteColor = isDark ? "#E9D5FF" : brand;

  const logoImage = require("../../assets/logos/brain.jpg");
  const heroImage = require("../../assets/images/image-1.jpg");
  const gridImage1 = require("../../assets/images/image-2.png");
  const gridImage2 = require("../../assets/images/image-3.jpg");

  // Responsive sizing based on screen width
  const isSmallScreen = SCREEN_WIDTH < 360;
  const PADDING = isSmallScreen ? 12 : 16;
  const AVATAR_SIZE = isSmallScreen ? 34 : 40;
  const LOGO_SIZE = isSmallScreen ? 34 : 40;
  const LOGO_IMG = isSmallScreen ? 22 : 28;
  const HEADER_FONT = isSmallScreen ? 18 : 22;
  const HERO_HEIGHT = SCREEN_WIDTH < 400 ? 180 : 220;
  const GRID_IMG_HEIGHT = SCREEN_WIDTH < 400 ? 130 : 160;
  const FEATURE_ICON_SIZE = isSmallScreen ? 40 : 48;

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: bg }]}
      edges={["top", "bottom"]} // ← This is the key fix — applies insets to top & bottom only
    >
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={bg}
        // translucent={true}   // Uncomment only if you want content under status bar (then adjust header bg)
      />

      {/* ── Header ── */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: surface,
            borderBottomColor: border,
            paddingHorizontal: PADDING,
          },
        ]}
      >
        {/* Left: logo + title — flex: 1 so it never overflows */}
        <View style={styles.headerLeft}>
          <View
            style={[
              styles.logoCircle,
              {
                backgroundColor: brandSoft,
                width: LOGO_SIZE,
                height: LOGO_SIZE,
                borderRadius: LOGO_SIZE / 2,
              },
            ]}
          >
            <Image
              source={logoImage}
              style={{
                width: LOGO_IMG,
                height: LOGO_IMG,
                borderRadius: LOGO_IMG / 2,
              }}
              resizeMode="contain"
            />
          </View>
          <Text
            style={[styles.headerTitle, { color: text, fontSize: HEADER_FONT }]}
            numberOfLines={1}
          >
            Mentally
          </Text>
        </View>

        {/* Right: avatar — fixed size, never shrinks */}
        <View
          style={[
            styles.avatar,
            {
              backgroundColor: brand,
              width: AVATAR_SIZE,
              height: AVATAR_SIZE,
              borderRadius: AVATAR_SIZE / 2,
            },
          ]}
        >
          <Text
            style={[styles.avatarText, { fontSize: isSmallScreen ? 12 : 14 }]}
          >
            JD
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { backgroundColor: bg, paddingHorizontal: PADDING },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={[styles.welcomeTitle, { color: text }]}>
            Welcome to Mentally
          </Text>
          <Text style={[styles.welcomeSubtitle, { color: bodyText }]}>
            Your journey to better mental wellness starts here
          </Text>
        </View>

        {/* Hero Image */}
        <Card style={[styles.heroCard, { backgroundColor: surface }]}>
          <ImageWithFallback
            source={heroImage}
            alt="Diverse people meditating in peaceful setting"
            style={[styles.heroImage, { height: HERO_HEIGHT }]}
          />
        </Card>

        {/* Main Message Card */}
        <Card style={[styles.messageCard, { backgroundColor: surface }]}>
          <View style={styles.messageContent}>
            <View
              style={[
                styles.heartIconContainer,
                {
                  backgroundColor: brandSoft,
                  width: FEATURE_ICON_SIZE,
                  height: FEATURE_ICON_SIZE,
                  borderRadius: FEATURE_ICON_SIZE / 2,
                },
              ]}
            >
              <HeartIcon size={isSmallScreen ? 18 : 24} color={brand} />
            </View>
            <View style={styles.messageText}>
              <Text style={[styles.messageTitle, { color: text }]}>
                Mental health is a critical aspect of your well-being
              </Text>
              <Text style={[styles.messageBody, { color: bodyText }]}>
                Take your mental health status seriously. Chat with our AI for
                personalized mental health assistance backed by research.
              </Text>
              <View
                style={[
                  styles.quoteBox,
                  { backgroundColor: quoteBg, borderColor: quoteBorder },
                ]}
              >
                <Text style={[styles.quoteText, { color: quoteColor }]}>
                  Taking care of your mental health is not a luxury—it is a
                  necessity for living a fulfilling life.
                </Text>
              </View>
            </View>
          </View>
        </Card>

        {/* CTA Button */}
        <TouchableOpacity
          style={[styles.ctaButton, { backgroundColor: brand }]}
          activeOpacity={0.85}
          onPress={() => navigation.navigate("Chat")}
        >
          <MessageCircleIcon size={22} color="#ffffff" />
          <Text style={[styles.ctaButtonText, { color: "#ffffff" }]}>
            Chat with Our AI
          </Text>
        </TouchableOpacity>

        {/* Feature Cards */}
        <View style={[styles.featureGrid, { gap: isSmallScreen ? 8 : 12 }]}>
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.featureCardWrapper}
            onPress={() => navigation.navigate("Therapists")}
          >
            <Card style={[styles.featureCard, { backgroundColor: surface }]}>
              <View
                style={[
                  styles.featureIconContainer,
                  {
                    backgroundColor: info,
                    width: FEATURE_ICON_SIZE,
                    height: FEATURE_ICON_SIZE,
                    borderRadius: FEATURE_ICON_SIZE / 2,
                  },
                ]}
              >
                <UsersIcon size={isSmallScreen ? 18 : 24} color="#ffffff" />
              </View>
              <Text
                style={[styles.featureTitle, { color: text }]}
                numberOfLines={2}
              >
                Find a Therapist
              </Text>
              <Text
                style={[styles.featureDescription, { color: bodyText }]}
                numberOfLines={3}
              >
                Connect with qualified mental health professionals near you
              </Text>
            </Card>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.featureCardWrapper}
            onPress={() => navigation.navigate("Education")}
          >
            <Card style={[styles.featureCard, { backgroundColor: surface }]}>
              <View
                style={[
                  styles.featureIconContainer,
                  {
                    backgroundColor: success,
                    width: FEATURE_ICON_SIZE,
                    height: FEATURE_ICON_SIZE,
                    borderRadius: FEATURE_ICON_SIZE / 2,
                  },
                ]}
              >
                <BookOpenIcon size={isSmallScreen ? 18 : 24} color="#ffffff" />
              </View>
              <Text
                style={[styles.featureTitle, { color: text }]}
                numberOfLines={2}
              >
                Learn & Grow
              </Text>
              <Text
                style={[styles.featureDescription, { color: bodyText }]}
                numberOfLines={3}
              >
                Access evidence-based mental health education and resources
              </Text>
            </Card>
          </TouchableOpacity>
        </View>

        {/* Additional Image Cards */}
        <View style={[styles.imageGrid, { gap: isSmallScreen ? 8 : 12 }]}>
          <Card style={[styles.imageCard, { backgroundColor: surface }]}>
            <ImageWithFallback
              source={gridImage1}
              alt="Woman practicing mental wellness"
              style={[styles.gridImage, { height: GRID_IMG_HEIGHT }]}
            />
            <View style={styles.imageCardBody}>
              <Text
                style={[styles.imageCardTitle, { color: text }]}
                numberOfLines={1}
              >
                Self-Care Matters
              </Text>
              <Text
                style={[styles.imageCardDescription, { color: bodyText }]}
                numberOfLines={2}
              >
                Prioritize your mental well-being every day
              </Text>
            </View>
          </Card>

          <Card style={[styles.imageCard, { backgroundColor: surface }]}>
            <ImageWithFallback
              source={gridImage2}
              alt="Mental health education"
              style={[styles.gridImage, { height: GRID_IMG_HEIGHT }]}
            />
            <View style={styles.imageCardBody}>
              <Text
                style={[styles.imageCardTitle, { color: text }]}
                numberOfLines={1}
              >
                Evidence-Based Support
              </Text>
              <Text
                style={[styles.imageCardDescription, { color: bodyText }]}
                numberOfLines={2}
              >
                Resources backed by scientific research
              </Text>
            </View>
          </Card>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  // Header — key fix: flex row with no overflow
  header: {
    borderBottomWidth: 1,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // Ensure header never overflows its container
    width: "100%",
  },
  // Left side takes remaining space but never squeezes the avatar out
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1, // takes all available space
    marginRight: 12, // guarantees gap before avatar
    overflow: "hidden", // clips title if screen is tiny
  },
  headerTitle: {
    fontWeight: "700",
    marginLeft: 8,
    flexShrink: 1, // shrinks title text before squeezing avatar off screen
  },
  // Avatar never shrinks — fixed size always fully visible
  avatar: {
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0, // critical: prevents avatar being squeezed off-screen
  },
  avatarText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  logoCircle: {
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0, // logo never shrinks
  },
  // Scroll
  scrollContent: {
    paddingTop: 24,
  },
  // Welcome
  welcomeSection: {
    marginBottom: 24,
  },
  welcomeTitle: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 6,
  },
  welcomeSubtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  // Hero Card
  heroCard: {
    marginBottom: 20,
    overflow: "hidden",
  },
  heroImage: {
    width: "100%",
  },
  // Message Card
  messageCard: {
    padding: 16,
    marginBottom: 20,
  },
  messageContent: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  heartIconContainer: {
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginRight: 12,
  },
  messageText: {
    flex: 1,
    minWidth: 0, // prevents text overflowing flex container
  },
  messageTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 8,
    lineHeight: 22,
  },
  messageBody: {
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 12,
  },
  quoteBox: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  quoteText: {
    fontSize: 12,
    fontStyle: "italic",
    lineHeight: 18,
  },
  // CTA Button
  ctaButton: {
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    shadowColor: "#9333ea",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  ctaButtonText: {
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 10,
  },
  // Feature Grid
  featureGrid: {
    flexDirection: "row",
    marginBottom: 16,
  },
  featureCardWrapper: {
    flex: 1,
    minWidth: 0, // allows flex children to shrink properly
  },
  featureCard: {
    padding: 14,
    flex: 1,
  },
  featureIconContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 4,
    lineHeight: 18,
  },
  featureDescription: {
    fontSize: 11,
    lineHeight: 16,
  },
  // Image Grid
  imageGrid: {
    flexDirection: "row",
  },
  imageCard: {
    flex: 1,
    minWidth: 0,
    overflow: "hidden",
  },
  gridImage: {
    width: "100%",
  },
  imageCardBody: {
    padding: 10,
  },
  imageCardTitle: {
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 4,
  },
  imageCardDescription: {
    fontSize: 11,
    lineHeight: 16,
  },
  // Image Fallback
  imageFallback: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#33333322",
  },
  imageFallbackText: {
    fontSize: 11,
    textAlign: "center",
    padding: 8,
  },
});
