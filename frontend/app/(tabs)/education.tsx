import { ArticleCard } from "@/components/education/article-card";
import { CategoryTabs } from "@/components/education/category-tabs";
import { EducationFooterBanner } from "@/components/education/education-footer-banner";
import { EducationHeader } from "@/components/education/education-header";
import { AppText, useThemedAlert } from "@/components/ui";
import { useAuthTheme } from "@/hooks/use-auth-theme";
import {
    Article,
    fetchMentalHealthArticles as fetchMentalHealthArticlesApi,
    normalizeHttpUrl,
} from "@/lib/education";
import * as WebBrowser from "expo-web-browser";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StatusBar,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ──────────────────────────────────────────────
// Main Screen
// ──────────────────────────────────────────────
export default function EducationScreen() {
  const { isDark, subtle, brandAccent } = useAuthTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const categories = ["all", "anxiety", "depression", "stress", "wellness"];

  const fetchMentalHealthArticles = useCallback(async (signal?: AbortSignal) => {
    try {
      setLoading(true);
      setErrorMessage(null);

      const mapped = await fetchMentalHealthArticlesApi(signal);
      if (!signal?.aborted) setArticles(mapped);
    } catch (err) {
      if (!signal?.aborted) {
        console.error(err);
        setErrorMessage(
          "Could not load mental health resources. Please check your internet and try again.",
        );
      }
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchMentalHealthArticles(controller.signal);

    return () => {
      controller.abort();
    };
  }, [fetchMentalHealthArticles]);

  const alert = useThemedAlert();

  const openUrlSafely = async (url: string) => {
    const normalized = normalizeHttpUrl(url);
    if (!normalized) {
      alert({ title: "No link available", message: "This article link is missing or invalid.", variant: "warning" });
      return;
    }

    try {
      await WebBrowser.openBrowserAsync(normalized);
    } catch {
      alert({ title: "Unable to open", message: "Please try opening this link in a browser.", variant: "error" });
    }
  };

  const handleRetry = () => {
    fetchMentalHealthArticles();
  };

  const filteredArticles = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return articles.filter((article) => {
      const matchesSearch =
        !query ||
        article.title.toLowerCase().includes(query) ||
        article.summary.toLowerCase().includes(query);

      const matchesCategory =
        activeCategory === "all" || article.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [activeCategory, articles, searchQuery]);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent
      />

      {/* Header */}
      <EducationHeader
        searchQuery={searchQuery}
        onChangeSearchQuery={setSearchQuery}
        subtle={subtle}
      />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Category Tabs */}
        <CategoryTabs
          categories={categories}
          activeCategory={activeCategory}
          onChangeCategory={setActiveCategory}
        />

        {/* Content */}
        {loading ? (
          <View className="flex-1 justify-center items-center mt-20">
            <ActivityIndicator size="large" color={brandAccent} />
            <AppText unstyled className="mt-4 text-muted-foreground">
              Loading mental health resources...
            </AppText>
          </View>
        ) : errorMessage ? (
          <View className="mx-5 mt-10 p-8 bg-card border border-border rounded-xl items-center">
            <AppText
              unstyled
              className="text-muted-foreground text-center text-base mb-4"
            >
              {errorMessage}
            </AppText>
            <TouchableOpacity
              onPress={handleRetry}
              className="bg-brand px-5 py-3 rounded-lg"
            >
              <AppText unstyled className="text-white font-semibold">
                Try again
              </AppText>
            </TouchableOpacity>
          </View>
        ) : filteredArticles.length === 0 ? (
          <View className="mx-5 mt-10 p-8 bg-card border border-border rounded-xl items-center">
            <AppText
              unstyled
              className="text-muted-foreground text-center text-base"
            >
              No articles found matching your search.
            </AppText>
          </View>
        ) : (
          <View className="px-5 pb-10 gap-5">
            {filteredArticles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                subtle={subtle}
                brandAccent={brandAccent}
                onPressReadMore={() => openUrlSafely(article.url)}
              />
            ))}
          </View>
        )}

        {/* Footer Banner */}
        <EducationFooterBanner brandAccent={brandAccent} />
      </ScrollView>
    </SafeAreaView>
  );
}
