export interface Article {
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

export async function fetchMentalHealthArticles(signal?: AbortSignal) {
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

  return resources.map((r, index) => {
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
}

export function normalizeHttpUrl(value: string) {
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
}
