import { useAuthTheme } from "@/hooks/use-auth-theme";
import { Therapist } from "@/lib/therapists";
import { DollarSign, MapPin, Star } from "lucide-react-native";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

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
      className="bg-card rounded-xl p-4 mb-4 shadow-sm border border-border"
    >
      <View className="flex-row">
        <Image
          source={therapist.photo}
          className="w-24 h-24 rounded-lg mr-4"
          resizeMode="cover"
        />

        <View className="flex-1">
          <View className="flex-row justify-between items-start mb-2">
            <View>
              <Text className="text-lg font-semibold text-foreground">
                {therapist.name}
              </Text>
              <View className="flex-row items-center mt-0.5">
                <MapPin size={12} color={subtle} />
                <Text className="text-sm text-muted-foreground ml-1">
                  {therapist.location}
                </Text>
              </View>

              {!!therapist.licenseNumber && (
                <Text className="text-xs text-muted-foreground mt-1">
                  License: {therapist.licenseNumber}
                </Text>
              )}
              <Text className="text-xs text-muted-foreground mt-1">
                Phone: {therapist.phone}
              </Text>
            </View>

            {typeof therapist.rating === "number" &&
              typeof therapist.reviews === "number" && (
                <View className="flex-row items-center bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded">
                  <Star size={16} color="#FBBF24" fill="#FBBF24" />
                  <Text className="font-semibold text-sm text-foreground ml-1">
                    {therapist.rating}
                  </Text>
                  <Text className="text-xs text-muted-foreground ml-1">
                    ({therapist.reviews})
                  </Text>
                </View>
              )}
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-2"
          >
            <View className="flex-row gap-2">
              {therapist.specialization.map((spec) => (
                <View
                  key={spec}
                  className="bg-brandSoft px-2.5 py-1 rounded-full"
                >
                  <Text className="text-xs text-brand font-medium">{spec}</Text>
                </View>
              ))}
            </View>
          </ScrollView>

          <Text
            className="text-sm text-foreground mb-3"
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {therapist.bio}
          </Text>

          <View className="flex-row flex-wrap justify-between items-center gap-2">
            <View className="flex-row items-center flex-shrink">
              {typeof therapist.price === "number" && (
                <>
                  <DollarSign
                    size={16}
                    color={isDark ? "#E5E7EB" : "#111827"}
                  />
                  <Text className="text-foreground font-semibold ml-1 flex-shrink">
                    {`KES ${therapist.price.toLocaleString()}/session`}
                  </Text>
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
                <Text
                  className={
                    therapist.availability.includes("Available Now")
                      ? "text-white"
                      : "text-foreground"
                  }
                >
                  {therapist.availability}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
