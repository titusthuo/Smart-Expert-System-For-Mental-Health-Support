import { TherapistCard } from "@/components/therapists/therapist-card";
import { TherapistsEmpty } from "@/components/therapists/therapists-empty";
import { TherapistsHeader } from "@/components/therapists/therapists-header";
import { useAuthTheme } from "@/hooks/use-auth-theme";
import { Coords, haversineDistanceKm } from "@/lib/geo";
import {
    getOptionLabel,
    locationOptions,
    mockTherapists,
    specializationOptions,
    Therapist,
} from "@/lib/therapists";
import * as Location from "expo-location";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { FlatList, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const FALLBACK_COORDS: Coords = { lat: -1.176, lng: 36.756 };

export default function TherapistsScreen() {
  const router = useRouter();
  const { reason } = useLocalSearchParams<{ reason?: string }>();
  const { isDark } = useAuthTheme();
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
          params: { id: item.id, reason, from: "therapists" },
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

      <TherapistsHeader
        reason={reason}
        searchQuery={searchQuery}
        onChangeSearchQuery={setSearchQuery}
        specializationLabel={specializationLabel}
        locationLabel={locationLabel}
        onChangeSpecialization={setSpecializationFilter}
        onChangeLocation={setLocationFilter}
        usingFallbackLocation={usingFallbackLocation}
      />

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
          <TherapistsEmpty />
        }
      />
    </SafeAreaView>
  );
}
