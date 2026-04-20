import { AppText } from "@/components/ui";
import { useAuthTheme } from "@/hooks/use-auth-theme";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
    ActivityIndicator,
    Platform,
    Share,
    StatusBar,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Lazy-load WebView to avoid crashing Expo Go (which lacks the native module).
// This file is eagerly loaded by Expo Router even if never navigated to.
let WebView: React.ComponentType<any> | null = null;
try {
  WebView = require("react-native-webview").WebView;
} catch {
  // Native module unavailable (Expo Go) — handled below
}

export default function ArticleViewerScreen() {
  const { url, title } = useLocalSearchParams<{
    url: string;
    title?: string;
  }>();
  const router = useRouter();
  const { isDark, brandAccent } = useAuthTheme();
  const webViewRef = useRef<any>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [loading, setLoading] = useState(true);

  const decodedUrl = url ? decodeURIComponent(url) : "";
  const displayTitle = title ? decodeURIComponent(title) : "Article";

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${displayTitle}\n${decodedUrl}`,
        url: decodedUrl,
      });
    } catch {
      // ignored
    }
  };

  return (
    <SafeAreaView
      className="flex-1 bg-background"
      edges={["top", "left", "right"]}
    >
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent
      />

      {/* Top Bar */}
      <View className="flex-row items-center px-3 py-2 border-b border-border bg-card">
        {/* Close button */}
        <TouchableOpacity
          onPress={() => router.back()}
          className="p-2 rounded-full"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons
            name="close"
            size={24}
            color={isDark ? "#fff" : "#111"}
          />
        </TouchableOpacity>

        {/* WebView back button */}
        {canGoBack && (
          <TouchableOpacity
            onPress={() => webViewRef.current?.goBack()}
            className="p-2 rounded-full ml-1"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons
              name="arrow-back"
              size={22}
              color={isDark ? "#fff" : "#111"}
            />
          </TouchableOpacity>
        )}

        {/* Title */}
        <View className="flex-1 mx-3">
          <AppText
            unstyled
            className="text-foreground font-semibold text-sm"
            numberOfLines={1}
          >
            {displayTitle}
          </AppText>
          <AppText
            unstyled
            className="text-muted-foreground text-xs"
            numberOfLines={1}
          >
            {decodedUrl}
          </AppText>
        </View>

        {/* Share button */}
        <TouchableOpacity
          onPress={handleShare}
          className="p-2 rounded-full"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons
            name={Platform.OS === "ios" ? "share-outline" : "share-social-outline"}
            size={22}
            color={isDark ? "#fff" : "#111"}
          />
        </TouchableOpacity>
      </View>

      {/* Loading indicator */}
      {loading && (
        <View className="absolute top-16 left-0 right-0 z-10 items-center py-2">
          <ActivityIndicator size="small" color={brandAccent} />
        </View>
      )}

      {/* WebView */}
      {decodedUrl && WebView ? (
        <WebView
          ref={webViewRef}
          source={{ uri: decodedUrl }}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
          onNavigationStateChange={(navState: any) => {
            setCanGoBack(navState.canGoBack);
          }}
          style={{ flex: 1 }}
          allowsInlineMediaPlayback
          javaScriptEnabled
          domStorageEnabled
          startInLoadingState={false}
        />
      ) : (
        <View className="flex-1 justify-center items-center">
          <AppText unstyled className="text-muted-foreground">
            {decodedUrl ? "WebView not available" : "No URL provided"}
          </AppText>
        </View>
      )}
    </SafeAreaView>
  );
}
