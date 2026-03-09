import { FilterDropdown } from "@/components/therapists/filter-dropdown";
import { TherapistCard } from "@/components/therapists/therapist-card";
import { useAuthTheme } from "@/hooks/use-auth-theme";
import {
  getOptionLabel,
  locationOptions,
  mockTherapists,
  specializationOptions,
  Therapist,
} from "@/lib/therapists";
import * as Location from "expo-location";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MapPin, Search } from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Coords = { lat: number; lng: number };

const FALLBACK_COORDS: Coords = { lat: -1.176, lng: 36.756 };

function toRad(value: number) {
  return (value * Math.PI) / 180;
}

function haversineDistanceKm(a: Coords, b: Coords) {
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);

  const h =
    sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLng * sinDLng;

  return 2 * R * Math.asin(Math.sqrt(h));
}

export default function TherapistsScreen() {
  const router = useRouter();
  const { reason } = useLocalSearchParams<{ reason?: string }>();
  const { isDark, subtle } = useAuthTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [specializationFilter, setSpecializationFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");

  const [userCoords, setUserCoords] = useState<Coords>(FALLBACK_COORDS);
  const [usingFallbackLocation, setUsingFallbackLocation] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function initLocation() {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          if (!isMounted) return;
          setUserCoords(FALLBACK_COORDS);
          setUsingFallbackLocation(true);
          return;
        }

        const position = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        if (!isMounted) return;
        setUserCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setUsingFallbackLocation(false);
      } catch {
        if (!isMounted) return;
        setUserCoords(FALLBACK_COORDS);
        setUsingFallbackLocation(true);
      }
    }

    initLocation();
    return () => {
      isMounted = false;
    };
  }, []);

  const queryLower = searchQuery.toLowerCase();
  const specializationLower = specializationFilter.toLowerCase();
  const locationLower = locationFilter.toLowerCase();

  const specializationLabel = getOptionLabel(
    specializationOptions,
    specializationFilter,
    "All Specializations",
  );
  const locationLabel = getOptionLabel(
    locationOptions,
    locationFilter,
    "All Locations",
  );

  const filteredTherapists = mockTherapists.filter((therapist) => {
    const matchesSearch =
      therapist.name.toLowerCase().includes(queryLower) ||
      therapist.specialization.some((spec) =>
        spec.toLowerCase().includes(queryLower),
      );

    const matchesSpecialization =
      specializationFilter === "all" ||
      therapist.specialization.some((spec) =>
        spec.toLowerCase().includes(specializationLower),
      );

    const matchesLocation =
      locationFilter === "all" ||
      therapist.location.toLowerCase().includes(locationLower);

    return matchesSearch && matchesSpecialization && matchesLocation;
  });

  const sortedTherapists = useMemo(() => {
    return filteredTherapists
      .map((t) => {
        const distanceKm = t.coords
          ? haversineDistanceKm(userCoords, t.coords)
          : Number.POSITIVE_INFINITY;
        return { therapist: t, distanceKm };
      })
      .sort((a, b) => a.distanceKm - b.distanceKm)
      .map((x) => x.therapist);
  }, [filteredTherapists, userCoords]);

  const renderTherapist = ({ item }: { item: Therapist }) => (
    <TherapistCard
      therapist={item}
      onPress={() =>
        router.push({
          pathname: "/(tabs)/therapists-detail",
          params: { id: item.id, reason },
        })
      }
    />
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent
      />

      <View className="bg-card border-b border-border pb-4">
        <View className="px-4 pt-4">
          <Text className="text-2xl font-serif text-foreground mb-4">
            Find a Therapist
          </Text>

          {reason === "crisis" && (
            <View className="mb-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30 p-4">
              <Text className="text-foreground font-semibold mb-2">
                You&apos;re not alone
              </Text>
              <Text className="text-muted-foreground">
                If you are in immediate danger, call 1190 (Kenya Red Cross
                Mental Health Hotline) or 999 right now.
              </Text>
            </View>
          )}

          <View className="relative mb-4">
            <View className="absolute left-3 top-[14px] z-10">
              <Search size={20} color={subtle} />
            </View>
            <TextInput
              placeholder="Search for therapists or specializations..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="bg-card border border-border rounded-lg pl-11 py-3 text-base text-foreground"
              placeholderTextColor={subtle}
            />
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-3">
              <FilterDropdown
                label={specializationLabel}
                options={specializationOptions}
                onChange={setSpecializationFilter}
              />

              <FilterDropdown
                label={locationLabel}
                options={locationOptions}
                onChange={setLocationFilter}
              />
            </View>
          </ScrollView>

          <View className="flex-row items-center mt-3">
            <MapPin size={14} color={subtle} />
            <Text className="text-sm text-muted-foreground ml-1">
              {usingFallbackLocation
                ? "Results based on a nearby default location"
                : "Results based on your location"}
            </Text>
          </View>
        </View>
      </View>

      <FlatList
        data={sortedTherapists}
        renderItem={renderTherapist}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingVertical: 24,
          paddingBottom: 100,
        }}
        ListEmptyComponent={
          <View className="bg-card rounded-xl p-8 items-center mt-10 mx-4 border border-border">
            <Text className="text-muted-foreground text-center mb-2 text-base">
              No therapists found nearby.
            </Text>
            <Text className="text-sm text-muted-foreground text-center">
              Try broadening your search criteria.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
