import { TherapistCard } from "@/components/therapists/therapist-card";
import { TherapistsEmpty } from "@/components/therapists/therapists-empty";
import { TherapistsHeader } from "@/components/therapists/therapists-header";
import { useAuthTheme } from "@/hooks/use-auth-theme";
import { useTherapists } from "@/hooks/useTherapists";
import { Coords, haversineDistanceKm } from "@/lib/geo";
import {
  getOptionLabel,
  locationOptions,
  specializationOptions,
} from "@/lib/therapists/options";
import { Therapist } from "@/lib/therapists/types";
import * as Location from "expo-location";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { FlatList, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const FALLBACK_COORDS: Coords = { lat: -1.176, lng: 36.756 };

export default function TherapistsScreen() {
  const router = useRouter();
  const { reason, lat, lng, useLocation } = useLocalSearchParams<{
    reason?: string;
    lat?: string;
    lng?: string;
    useLocation?: string;
  }>();
  const { isDark } = useAuthTheme();
  const { therapists } = useTherapists();

  const [specializationFilter, setSpecializationFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");

  const [userCoords, setUserCoords] = useState<Coords>(FALLBACK_COORDS);
  const [usingFallbackLocation, setUsingFallbackLocation] = useState(true);


  // Use GPS coordinates from AI chat if provided, otherwise get current location
  useEffect(() => {
    if (useLocation === "true" && lat && lng) {
      const aiCoords = {
        lat: parseFloat(lat),
        lng: parseFloat(lng),
      };
      if (!isNaN(aiCoords.lat) && !isNaN(aiCoords.lng)) {
        setUserCoords(aiCoords);
        setUsingFallbackLocation(false);
        return;
      }
    }

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
  }, [lat, lng, useLocation]);

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

  // Memoized filtering — no search query, only specialization + location filters
  const filteredTherapists = useMemo(() => {
    const specializationLower = specializationFilter.toLowerCase();
    const locationLower = locationFilter.toLowerCase();

    return therapists.filter((therapist: Therapist) => {
      const matchesSpecialization =
        specializationFilter === "all" ||
        therapist.specialization.some((spec) =>
          spec.toLowerCase().includes(specializationLower),
        );

      const matchesLocation =
        locationFilter === "all" ||
        therapist.location.toLowerCase().includes(locationLower);

      return matchesSpecialization && matchesLocation;
    });
  }, [therapists, specializationFilter, locationFilter]);

  // Sort by distance from user — nearest first, always
  const sortedTherapists = useMemo(() => {
    const withDistance = filteredTherapists.map((t: Therapist) => {
      const distanceKm =
        t.coords && !usingFallbackLocation
          ? haversineDistanceKm(userCoords, t.coords)
          : Number.POSITIVE_INFINITY;
      return { therapist: t, distanceKm };
    });

    // Always sort nearest first
    withDistance.sort((a, b) => a.distanceKm - b.distanceKm);

    // When coming from AI chat with real GPS coords:
    // Show only therapists within 60km; if fewer than 3, pad with next closest
    if (useLocation === "true" && !usingFallbackLocation) {
      const nearby = withDistance.filter((x) => x.distanceKm <= 60);
      const others = withDistance.filter((x) => x.distanceKm > 60);

      const result =
        nearby.length >= 3
          ? nearby
          : [...nearby, ...others.slice(0, Math.max(0, 5 - nearby.length))];

      return result.map((x) => x.therapist);
    }

    return withDistance.map((x) => x.therapist);
  }, [filteredTherapists, userCoords, usingFallbackLocation, useLocation]);

  const renderTherapist = ({ item }: { item: Therapist }) => {
    const distance =
      !usingFallbackLocation && item.coords
        ? haversineDistanceKm(userCoords, item.coords)
        : undefined;

    return (
      <TherapistCard
        therapist={item}
        distance={distance}
        onPress={() =>
          router.push({
            pathname: "/(tabs)/therapists-detail",
            params: { id: item.id, reason, from: "therapists" },
          })
        }
      />
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent
      />

      {/* Filters Section — no SearchBar above it anymore */}
      <TherapistsHeader
        reason={reason}
        specializationLabel={specializationLabel}
        locationLabel={locationLabel}
        onChangeSpecialization={setSpecializationFilter}
        onChangeLocation={setLocationFilter}
        usingFallbackLocation={usingFallbackLocation}
        useLocation={useLocation}
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
        ListEmptyComponent={<TherapistsEmpty />}
      />
    </SafeAreaView>
  );
}