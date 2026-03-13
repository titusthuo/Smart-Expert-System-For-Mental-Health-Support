import { AppText } from "@/components/ui";
import { useAuthTheme } from "@/hooks/use-auth-theme";
import { Therapist } from "@/lib/therapists/types";
import { DollarSign, MapPin } from "lucide-react-native";
import { Image, TouchableOpacity, View } from "react-native";

export function TherapistCard({
  therapist,
  onPress,
}: {
  therapist: Therapist;
  onPress: () => void;
}) {
  const { isDark, subtle } = useAuthTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      className="mb-4 rounded-2xl border border-border bg-card p-4 shadow-sm"
    >
      <View className="flex-row">
        <Image
          source={therapist.photo}
          className="mr-4 h-24 w-24 rounded-2xl"
          resizeMode="cover"
        />

        <View className="flex-1">
          <View className="mb-3">
            <View>
              <AppText unstyled className="text-lg font-semibold leading-6 text-foreground" numberOfLines={2}>
                {therapist.name}
              </AppText>
              <View className="mt-1 flex-row items-start">
                <MapPin size={12} color={subtle} />
                <AppText unstyled className="ml-1 flex-1 text-sm leading-5 text-muted-foreground" numberOfLines={2}>
                  {therapist.location}
                </AppText>
              </View>

              {!!therapist.licenseNumber && (
                <AppText unstyled className="mt-2 text-xs text-muted-foreground">
                  License: {therapist.licenseNumber}
                </AppText>
              )}
              <AppText unstyled className="mt-1 text-xs text-muted-foreground">
                Phone: {therapist.phone}
              </AppText>
            </View>
          </View>

          <View className="flex-row flex-wrap gap-2 mb-2">
            {therapist.specialization.map((spec) => (
              <View key={spec} className="bg-brandSoft px-2.5 py-1 rounded-full max-w-full">
                <AppText unstyled className="text-xs text-brand font-medium max-w-full flex-shrink">
                  {spec}
                </AppText>
              </View>
            ))}
          </View>

          <AppText unstyled className="mb-3 text-sm leading-5 text-foreground" numberOfLines={2}>
            {therapist.bio}
          </AppText>

          <View className="flex-row flex-wrap justify-between items-center gap-2">
            <View className="flex-row items-center flex-shrink">
              {typeof therapist.price === "number" && (
                <>
                  <DollarSign
                    size={16}
                    color={isDark ? "#E5E7EB" : "#111827"}
                  />
                  <AppText unstyled className="text-foreground font-semibold ml-1 flex-shrink">
                    {`KES ${therapist.price.toLocaleString()}/session`}
                  </AppText>
                </>
              )}
            </View>

            {!!therapist.availability && (
              <View
                className={`px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                  therapist.availability.includes("Available Now")
                    ? "bg-green-500 text-white"
                    : "bg-muted text-foreground"
                }`}
              >
                <AppText
                  unstyled
                  className={
                    therapist.availability.includes("Available Now")
                      ? "text-white"
                      : "text-foreground"
                  }
                >
                  {therapist.availability}
                </AppText>
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
