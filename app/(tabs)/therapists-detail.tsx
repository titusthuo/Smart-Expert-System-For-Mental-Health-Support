import { useAuthTheme } from "@/hooks/use-auth-theme";
import { getTherapistById, mockReviews, Review } from "@/lib/therapists";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
    ArrowLeft,
    Award,
    DollarSign,
    MapPin,
    Star,
} from "lucide-react-native";
import {
    Alert,
    FlatList,
    Image,
    Linking,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TherapistDetailScreen() {
  const router = useRouter();
  const { id, reason } = useLocalSearchParams<{
    id?: string;
    reason?: string;
  }>();
  const { isDark, subtle } = useAuthTheme();

  const therapist = getTherapistById(id);

  const isCrisis = reason === "crisis";
  const appName = "MindEase KE";
  const prefilledMessage = `Hello, I found you through ${appName} because I'm seeking support. Can we discuss next steps for support?`;

  if (!therapist) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center p-6">
        <View className="bg-white rounded-xl p-8 items-center shadow-sm">
          <Text className="text-gray-800 text-lg mb-4">
            Therapist not found
          </Text>
          <TouchableOpacity
            onPress={() => router.replace("/(tabs)/therapists")}
            className="bg-purple-600 px-6 py-3 rounded-lg"
          >
            <Text className="text-white font-medium">Back to Therapists</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const openUrlSafely = async (url: string, fallbackUrl?: string) => {
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
        return;
      }

      if (fallbackUrl) {
        const canOpenFallback = await Linking.canOpenURL(fallbackUrl);
        if (canOpenFallback) {
          await Linking.openURL(fallbackUrl);
          return;
        }
      }

      Alert.alert(
        "Unable to open",
        "Please use your phone to contact this therapist.",
      );
    } catch {
      Alert.alert(
        "Unable to open",
        "Please use your phone to contact this therapist.",
      );
    }
  };

  const normalizePhoneDigits = (value: string) => value.replace(/[^\d]/g, "");

  const handleCall = async () => {
    const digits = normalizePhoneDigits(therapist.phone);
    if (!digits) {
      Alert.alert(
        "Missing contact",
        "No phone number is available for this therapist.",
      );
      return;
    }
    await openUrlSafely(`tel:${digits}`);
  };

  const handleWhatsApp = async () => {
    const source = therapist.whatsapp ?? therapist.phone;
    const digits = normalizePhoneDigits(source);
    if (!digits) {
      Alert.alert(
        "Missing contact",
        "No WhatsApp number is available for this therapist.",
      );
      return;
    }

    const text = encodeURIComponent(prefilledMessage);
    const appUrl = `whatsapp://send?phone=${digits}&text=${text}`;
    const webUrl = `https://wa.me/${digits}?text=${text}`;
    await openUrlSafely(appUrl, webUrl);
  };

  const handleEmail = async () => {
    if (!therapist.email) {
      Alert.alert(
        "Missing contact",
        "No email is available for this therapist.",
      );
      return;
    }

    const subject = encodeURIComponent(`${appName} - Session request`);
    const body = encodeURIComponent(prefilledMessage);
    await openUrlSafely(
      `mailto:${therapist.email}?subject=${subject}&body=${body}`,
    );
  };

  const renderReview = ({ item }: { item: Review }) => (
    <View className="border-b border-gray-200 pb-4 last:border-b-0">
      <View className="flex-row justify-between items-start mb-2">
        <View className="flex-row items-center">
          <View className="w-10 h-10 bg-purple-100 rounded-full items-center justify-center mr-3">
            <Text className="text-purple-600 font-medium text-lg">
              {item.author[0]}
            </Text>
          </View>
          <View>
            <Text className="font-medium text-gray-900">{item.author}</Text>
            <Text className="text-xs text-gray-500">{item.date}</Text>
          </View>
        </View>

        <View className="flex-row">
          {Array(item.rating)
            .fill(0)
            .map((_, i) => (
              <Star key={i} size={16} color="#FBBF24" fill="#FBBF24" />
            ))}
        </View>
      </View>
      <Text className="text-sm text-gray-700 leading-5">{item.comment}</Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent
      />

      {/* Sticky Header */}
      <View className="bg-card border-b border-border">
        <View className="flex-row items-center px-4 py-4">
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color={isDark ? "#E5E7EB" : "#111827"} />
          </TouchableOpacity>
          <Text className="text-xl font-semibold text-foreground ml-4">
            Therapist Details
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1">
        <View className="px-4 py-6 space-y-6 pb-32">
          {isCrisis && (
            <View className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
              <Text className="text-foreground font-semibold mb-2">
                Immediate support
              </Text>
              <Text className="text-muted-foreground">
                If you are in immediate danger, call 1190 (Kenya Red Cross
                Mental Health Hotline) or 999 right now.
              </Text>
            </View>
          )}

          {/* Profile Card */}
          <View className="bg-card rounded-xl p-6 shadow-sm border border-border">
            <View className="items-center md:items-start">
              <Image
                source={therapist.photo}
                className="w-32 h-32 rounded-lg mb-5"
                resizeMode="cover"
              />

              <View className="flex-1 w-full">
                <View className="flex-row justify-between items-start mb-3">
                  <View>
                    <Text className="text-2xl font-semibold text-foreground">
                      {therapist.name}
                    </Text>
                    <View className="flex-row items-center mt-1">
                      <MapPin size={16} color={subtle} />
                      <Text className="text-muted-foreground ml-1">
                        {therapist.location}
                      </Text>
                    </View>
                  </View>

                  {typeof therapist.rating === "number" &&
                    typeof therapist.reviews === "number" && (
                      <View className="flex-row items-center bg-amber-50 dark:bg-amber-900/20 px-3 py-2 rounded">
                        <Star size={20} color="#FBBF24" fill="#FBBF24" />
                        <Text className="font-semibold ml-1.5 text-foreground">
                          {therapist.rating}
                        </Text>
                        <Text className="text-sm text-muted-foreground ml-1">
                          ({therapist.reviews} reviews)
                        </Text>
                      </View>
                    )}
                </View>

                <View className="flex-row flex-wrap gap-2 mb-4">
                  {therapist.specialization.map((spec: string) => (
                    <View
                      key={spec}
                      className="bg-brandSoft px-3 py-1 rounded-full"
                    >
                      <Text className="text-xs text-brand font-medium">
                        {spec}
                      </Text>
                    </View>
                  ))}
                </View>

                {(!!therapist.experience ||
                  typeof therapist.price === "number") && (
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                      {!!therapist.experience && (
                        <Text className="text-foreground">
                          {therapist.experience}
                        </Text>
                      )}
                    </View>
                    {typeof therapist.price === "number" && (
                      <View className="flex-row items-center">
                        <DollarSign
                          size={16}
                          color={isDark ? "#E5E7EB" : "#111827"}
                        />
                        <Text className="text-foreground font-semibold ml-1.5">
                          KES {therapist.price.toLocaleString()}/session
                        </Text>
                      </View>
                    )}
                  </View>
                )}

                <View className="mt-5 pt-4 border-t border-border">
                  {!!therapist.licenseNumber && (
                    <Text className="text-sm text-muted-foreground">
                      License: {therapist.licenseNumber}
                    </Text>
                  )}
                  <Text className="text-sm text-muted-foreground mt-2">
                    Phone: {therapist.phone}
                  </Text>
                  {!!therapist.email && (
                    <Text className="text-sm text-muted-foreground mt-2">
                      Email: {therapist.email}
                    </Text>
                  )}

                  <View className="flex-row flex-wrap gap-3 mt-4">
                    <TouchableOpacity
                      onPress={handleCall}
                      className="bg-purple-600 px-4 py-3 rounded-lg"
                    >
                      <Text className="text-white font-semibold">Call</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={handleWhatsApp}
                      className="bg-green-600 px-4 py-3 rounded-lg"
                    >
                      <Text className="text-white font-semibold">WhatsApp</Text>
                    </TouchableOpacity>
                    {!!therapist.email && (
                      <TouchableOpacity
                        onPress={handleEmail}
                        className="bg-muted px-4 py-3 rounded-lg border border-border"
                      >
                        <Text className="text-foreground font-semibold">
                          Email
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>

                  <Text className="text-xs text-muted-foreground mt-4 leading-5">
                    Privacy note: When you tap Call, WhatsApp, or Email,{" "}
                    {appName}
                    will open another app on your device. Your message and any
                    personal information you share will be handled by that
                    service and the therapist.
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* About */}
          <View className="bg-card rounded-xl p-6 shadow-sm border border-border">
            <Text className="text-xl font-semibold mb-3 text-foreground">
              About
            </Text>
            <Text className="text-foreground leading-6">
              {therapist.fullBio}
            </Text>
          </View>

          {/* Qualifications */}
          {therapist.qualifications.length > 0 && (
            <View className="bg-card rounded-xl p-6 shadow-sm border border-border">
              <View className="flex-row items-center mb-4">
                <Award size={20} color="#9333EA" className="mr-2" />
                <Text className="text-xl font-semibold text-foreground">
                  Qualifications & Experience
                </Text>
              </View>
              {therapist.qualifications.map((qual: string, index: number) => (
                <View key={index} className="flex-row items-start mb-2">
                  <View className="w-2 h-2 bg-purple-600 rounded-full mt-2 mr-3" />
                  <Text className="text-foreground flex-1">{qual}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Reviews */}
          {mockReviews.length > 0 && (
            <View className="bg-card rounded-xl p-6 shadow-sm border border-border">
              <Text className="text-xl font-semibold mb-4 text-foreground">
                Reviews
              </Text>

              <FlatList
                data={mockReviews}
                renderItem={renderReview}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
