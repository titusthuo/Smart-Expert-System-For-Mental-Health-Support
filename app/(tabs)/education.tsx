import { AppText } from "@/components/ui";
import { useAuthTheme } from "@/hooks/use-auth-theme";
import { BookOpen, ExternalLink, Search } from "lucide-react-native";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    Linking,
    ScrollView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────
interface Article {
  id: string;
  title: string;
  summary: string;
  source: string;
  category: string;
  image: string;
  readTime: string;
  url: string;
}

type TopicSearchSection = {
  Title?: string;
  Content?: string;
};

type TopicSearchResource = {
  Type?: string;
  Id?: string | number;
  Title?: string;
  Categories?: string;
  ImageUrl?: string;
  AccessibleVersion?: string;
  Sections?: {
    section?: TopicSearchSection[] | TopicSearchSection;
  };
};

type TopicSearchResponse = {
  Result?: {
    Resources?: {
      Resource?: TopicSearchResource[] | TopicSearchResource;
    };
  };
};

function toArray<T>(value: T[] | T | undefined | null): T[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function guessCategory(title: string): string {
  const lower = title.toLowerCase();
  if (lower.includes("anxiety") || lower.includes("panic")) return "anxiety";
  if (lower.includes("depress") || lower.includes("sad")) return "depression";
  if (lower.includes("stress")) return "stress";
  return "wellness";
}

function getFallbackImage(title: string) {
  const lower = title.toLowerCase();
  if (lower.includes("sleep")) {
    return "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800";
  }
  if (
    lower.includes("stress") ||
    lower.includes("anxiety") ||
    lower.includes("calm")
  ) {
    return "https://images.unsplash.com/photo-1522202176988-66273c2b033f?w=800";
  }
  return "https://images.unsplash.com/photo-1519337265831-281ec6cc8514?w=800";
}

function stripHtmlToText(value: string) {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function buildSummaryFromSections(
  sections: TopicSearchSection[],
  fallback: string,
) {
  const preferred =
    sections.find((s) =>
      String(s.Title ?? "")
        .toLowerCase()
        .includes("overview"),
    ) ?? sections[0];

  const content = preferred?.Content ? stripHtmlToText(preferred.Content) : "";
  const summary = content || fallback;
  if (summary.length <= 240) return summary;
  return `${summary.slice(0, 240).trim()}…`;
}

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

  const fetchMentalHealthArticles = useCallback(
    async (signal?: AbortSignal) => {
      try {
        setLoading(true);
        setErrorMessage(null);

        const res = await fetch(
          "https://odphp.health.gov/myhealthfinder/api/v4/topicsearch.json?CategoryId=20",
          signal ? { signal } : undefined,
        );
        if (!res.ok) {
          throw new Error("Failed to fetch mental health topics");
        }

        const data = (await res.json()) as TopicSearchResponse;
        const resources = toArray(data?.Result?.Resources?.Resource);
        if (!resources.length) {
          throw new Error("No topics found in Mental Health category");
        }

        const mapped: Article[] = resources.map((r, index) => {
          const id = String(r.Id ?? index + 1);
          const title = String(r.Title ?? "Mental Health Topic");
          const url =
            String(r.AccessibleVersion ?? "").trim() ||
            "https://odphp.health.gov/myhealthfinder/healthy-living/mental-health-and-relationships";
          const image = r.ImageUrl || getFallbackImage(title);

          const fallbackSummary = "Learn more about this mental health topic.";
          const sections = toArray(r.Sections?.section);
          const summary = sections.length
            ? buildSummaryFromSections(sections, fallbackSummary)
            : fallbackSummary;

          return {
            id,
            title,
            summary,
            source: "MyHealthfinder – Mental Health & Relationships",
            category: guessCategory(title),
            image,
            readTime: "5-10 min read",
            url,
          } satisfies Article;
        });

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
    },
    [],
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchMentalHealthArticles(controller.signal);

    return () => {
      controller.abort();
    };
  }, [fetchMentalHealthArticles]);

  const normalizeHttpUrl = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return null;
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      return trimmed;
    }
    if (trimmed.startsWith("//")) {
      return `https:${trimmed}`;
    }
    if (trimmed.startsWith("www.")) {
      return `https://${trimmed}`;
    }
    return null;
  };

  const openUrlSafely = async (url: string) => {
    const normalized = normalizeHttpUrl(url);
    if (!normalized) {
      Alert.alert(
        "No link available",
        "This article link is missing or invalid.",
      );
      return;
    }

    try {
      const canOpen = await Linking.canOpenURL(normalized);
      if (!canOpen) {
        Alert.alert(
          "Unable to open",
          "Please try opening this link in a browser.",
        );
        return;
      }
      await Linking.openURL(normalized);
    } catch {
      Alert.alert(
        "Unable to open",
        "Please try opening this link in a browser.",
      );
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
      <View className="bg-card border-b border-border">
        <View className="px-5 pt-5 pb-4">
          <View className="flex-row items-center mb-4">
            <BookOpen size={32} color={subtle} />
            <AppText
              unstyled
              className="text-2xl font-bold text-foreground ml-3"
            >
              Mental Health Education
            </AppText>
          </View>

          <View className="relative">
            <View className="absolute left-3 top-[14px] z-10">
              <Search size={20} color={subtle} />
            </View>
            <TextInput
              placeholder="Search articles and resources..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="bg-card border border-border rounded-lg pl-11 py-3 text-base text-foreground"
              placeholderTextColor={subtle}
            />
          </View>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Category Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="px-5 pt-5 pb-4"
        >
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => setActiveCategory(cat)}
              className={`mr-3 px-5 py-2.5 rounded-full border ${
                activeCategory === cat
                  ? "bg-brand border-brand"
                  : "bg-card border-border"
              }`}
            >
              <Text
                className={`font-medium capitalize ${
                  activeCategory === cat ? "text-white" : "text-foreground"
                }`}
              >
                {cat === "all"
                  ? "All Topics"
                  : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

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
              <View
                key={article.id}
                className="bg-card rounded-xl overflow-hidden shadow-sm border border-border"
              >
                <Image
                  source={{ uri: article.image }}
                  className="w-full h-48"
                  resizeMode="cover"
                />

                <View className="p-5">
                  <View className="flex-row justify-between items-center mb-3">
                    <View className="bg-brandSoft px-3 py-1 rounded-full">
                      <Text className="text-brand text-xs font-medium capitalize">
                        {article.category}
                      </Text>
                    </View>
                    <Text className="text-muted-foreground text-xs">
                      {article.readTime}
                    </Text>
                  </View>

                  <Text className="text-lg font-semibold text-foreground mb-2">
                    {article.title}
                  </Text>

                  <Text
                    className="text-muted-foreground text-sm mb-4"
                    numberOfLines={3}
                    ellipsizeMode="tail"
                  >
                    {article.summary}
                  </Text>

                  <View className="flex-row flex-wrap justify-between items-center gap-3">
                    <View className="flex-row items-center flex-1">
                      <BookOpen size={16} color={subtle} />
                      <Text
                        className="text-muted-foreground text-xs ml-1.5 flex-shrink"
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        Source: {article.source}
                      </Text>
                    </View>

                    <TouchableOpacity
                      onPress={() => openUrlSafely(article.url)}
                      className="flex-row items-center px-4 py-2 border border-brand rounded-lg flex-shrink-0"
                    >
                      <Text className="text-brand font-medium text-sm mr-1.5">
                        Read More
                      </Text>
                      <ExternalLink size={16} color={brandAccent} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Footer Banner */}
        <View className="mx-5 mt-6 mb-12 p-6 bg-brandSoft border border-border rounded-xl">
          <View className="flex-row items-start gap-3">
            <BookOpen size={24} color={brandAccent} />
            <View>
              <Text className="font-semibold text-foreground mb-2 text-base">
                Evidence-Based Resources
              </Text>
              <Text className="text-sm text-muted-foreground leading-5">
                Content from MyHealthfinder (U.S. Office of Disease Prevention
                and Health Promotion) — Mental Health & Relationships section.
                For educational support only. Not a substitute for professional
                advice.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
