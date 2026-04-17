import { AppText } from "@/components/ui/text";
import { useAuthTheme } from "@/hooks/use-auth-theme";
import { useTherapist } from "@/hooks/useTherapist";
import { openUrlSafely } from "@/lib/links";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, Award, DollarSign, MapPin } from "lucide-react-native";
import {
    Alert,
    Image,
    ScrollView,
    StatusBar,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TherapistDetailScreen() {
  const router = useRouter();
  const { id, reason, from } = useLocalSearchParams<{
    id?: string;
    reason?: string;
    from?: string;
  }>();
  const { isDark, brand, subtle } = useAuthTheme();
  const { therapist, loading } = useTherapist(id);

  const handleBackPress = () => {
    if (from === "therapists") {
      router.replace("/(tabs)/therapists");
      return;
    }

    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace("/(tabs)/therapists");
  };

  const isCrisis = reason === "crisis";
  const appName = "Mentally";
  const prefilledMessage = `Hello, I found your contacts through ${appName} because I'm seeking mental health support. Can we discuss next steps for mental health support?`;

  // Show loading state while fetching to prevent "not found" flash
  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-background justify-center items-center">
        <AppText className="text-muted-foreground">Loading...</AppText>
      </SafeAreaView>
    );
  }

  if (!therapist) {
    return (
      <SafeAreaView className="flex-1 bg-background justify-center items-center p-6">
        <View className="bg-card rounded-xl p-8 items-center shadow-sm border border-border">
          <AppText className="text-foreground text-lg mb-4">
            Therapist not found
          </AppText>
          <TouchableOpacity
            onPress={() => router.replace("/(tabs)/therapists")}
            className="bg-brand px-6 py-3 rounded-lg"
          >
            <AppText className="text-white font-medium">
              Back to Therapists
            </AppText>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

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
    const opened = await openUrlSafely(`tel:${digits}`);
    if (!opened) {
      Alert.alert(
        "Unable to open",
        "Please use your phone to contact this therapist.",
      );
    }
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
    const opened = await openUrlSafely(appUrl, { fallbackUrl: webUrl });
    if (!opened) {
      Alert.alert(
        "Unable to open",
        "Please use your phone to contact this therapist.",
      );
    }
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
    const opened = await openUrlSafely(
      `mailto:${therapist.email}?subject=${subject}&body=${body}`,
    );
    if (!opened) {
      Alert.alert(
        "Unable to open",
        "Please use your phone to contact this therapist.",
      );
    }
  };

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
          <TouchableOpacity onPress={handleBackPress}>
            <ArrowLeft size={24} color={isDark ? "#E5E7EB" : "#111827"} />
          </TouchableOpacity>
          <AppText className="text-xl font-semibold text-foreground ml-4">
            Therapist Details
          </AppText>
        </View>
      </View>

      <ScrollView className="flex-1">
        <View className="px-4 py-6 space-y-6 pb-32">
          {isCrisis && (
            <View className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
              <AppText className="text-foreground font-semibold mb-2">
                Immediate support
              </AppText>
              <AppText className="text-muted-foreground">
                If you are in immediate danger, call 1190 (Kenya Red Cross
                Mental Health Hotline) or 999 right now.
              </AppText>
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
                    <AppText className="text-2xl font-semibold text-foreground">
                      {therapist.name}
                    </AppText>
                    <View className="flex-row items-center mt-1">
                      <MapPin size={16} color={subtle} />
                      <AppText className="text-muted-foreground ml-1">
                        {therapist.location}
                      </AppText>
                    </View>
                  </View>
                </View>

                <View className="flex-row flex-wrap gap-2 mb-4">
                  {therapist.specialization.map((spec: string) => (
                    <View
                      key={spec}
                      className="bg-brandSoft px-3 py-1 rounded-full"
                    >
                      <AppText className="text-xs text-brand font-medium">
                        {spec}
                      </AppText>
                    </View>
                  ))}
                </View>

                {(!!therapist.experience ||
                  typeof therapist.price === "number") && (
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                      {!!therapist.experience && (
                        <AppText className="text-foreground">
                          {therapist.experience}
                        </AppText>
                      )}
                    </View>
                    {typeof therapist.price === "number" && (
                      <View className="flex-row items-center">
                        <DollarSign
                          size={16}
                          color={isDark ? "#E5E7EB" : "#111827"}
                        />
                        <AppText className="text-foreground font-semibold ml-1.5">
                          KES {therapist.price.toLocaleString()}/session
                        </AppText>
                      </View>
                    )}
                  </View>
                )}

                <View className="mt-5 pt-4 border-t border-border">
                  {!!therapist.licenseNumber && (
                    <AppText className="text-sm text-muted-foreground">
                      License: {therapist.licenseNumber}
                    </AppText>
                  )}
                  <AppText className="text-sm text-muted-foreground mt-2">
                    Phone: {therapist.phone}
                  </AppText>
                  {!!therapist.email && (
                    <AppText className="text-sm text-muted-foreground mt-2">
                      Email: {therapist.email}
                    </AppText>
                  )}

                  <View className="flex-row flex-wrap gap-3 mt-4">
                    <TouchableOpacity
                      onPress={handleCall}
                      className="bg-brand px-4 py-3 rounded-lg"
                    >
                      <AppText className="text-white font-semibold">
                        Call
                      </AppText>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={handleWhatsApp}
                      className="bg-green-600 px-4 py-3 rounded-lg"
                    >
                      <AppText className="text-white font-semibold">
                        WhatsApp
                      </AppText>
                    </TouchableOpacity>
                    {!!therapist.email && (
                      <TouchableOpacity
                        onPress={handleEmail}
                        className="bg-muted px-4 py-3 rounded-lg border border-border"
                      >
                        <AppText className="text-foreground font-semibold">
                          Email
                        </AppText>
                      </TouchableOpacity>
                    )}
                  </View>

                  <AppText className="text-xs text-muted-foreground mt-4 leading-5">
                    Privacy note: When you tap Call, WhatsApp, or Email,{" "}
                    {appName}
                    will open another app on your device. Your message and any
                    personal information you share will be handled by that
                    service and the therapist.
                  </AppText>
                </View>
              </View>
            </View>
          </View>

          {/* About */}
          <View className="bg-card rounded-xl p-6 shadow-sm border border-border">
            <AppText className="text-xl font-semibold mb-3 text-foreground">
              About
            </AppText>
            <AppText className="text-foreground leading-6">
              {therapist.fullBio}
            </AppText>
          </View>

          {/* Qualifications */}
          {therapist.qualifications.length > 0 && (
            <View className="bg-card rounded-xl p-6 shadow-sm border border-border">
              <View className="flex-row items-center mb-4">
                <Award size={20} color={brand} className="mr-2" />
                <AppText className="text-xl font-semibold text-foreground">
                  Qualifications & Experience
                </AppText>
              </View>
              {therapist.qualifications.map((qual: string, index: number) => (
                <View key={index} className="flex-row items-start mb-2">
                  <View className="w-2 h-2 bg-brand rounded-full mt-2 mr-3" />
                  <AppText className="text-foreground flex-1">{qual}</AppText>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
