import { SearchBar } from "@/components/SearchBar";
import { TherapistCard } from "@/components/therapists/therapist-card";
import { TherapistsEmpty } from "@/components/therapists/therapists-empty";
import { TherapistsHeader } from "@/components/therapists/therapists-header";
import { resolveKenyanCity } from "@/constants/aiPrompt";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [specializationFilter, setSpecializationFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");

  const [userCoords, setUserCoords] = useState<Coords>(FALLBACK_COORDS);
  const [usingFallbackLocation, setUsingFallbackLocation] = useState(true);
  const [resolvedLocation, setResolvedLocation] = useState<string>("");
  const [locationLoading, setLocationLoading] = useState(false);

  // Handle location button press
  const handleLocationPress = async () => {
    setLocationLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Location permission is required to find therapists near you.",
        );
        return;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const newCoords = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      setUserCoords(newCoords);
      setUsingFallbackLocation(false);

      // Resolve location name and auto-set filter
      const city = await resolveKenyanCity(newCoords);
      setResolvedLocation(city);

      // Find matching location option
      const matchingOption = locationOptions.find(
        (option) =>
          city.toLowerCase().includes(option.value.toLowerCase()) ||
          option.value.toLowerCase().includes(city.toLowerCase()),
      );

      if (matchingOption) {
        setLocationFilter(matchingOption.value);
      }
    } catch (error) {
      console.error("Location error:", error);
      Alert.alert(
        "Location Error",
        "Unable to get your location. Please try again.",
      );
    } finally {
      setLocationLoading(false);
    }
  };

  // Use GPS coordinates from AI chat if provided
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

    // Otherwise, get current location
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

  const queryLower = searchQuery.toLowerCase();
  const specializationLower = specializationFilter.toLowerCase();
  const locationLower = locationFilter.toLowerCase();

  // Memoize filteredTherapists so useMemo dependency works correctly
  const filteredTherapists = useMemo(() => {
    return therapists.filter((therapist) => {
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
  }, [therapists, searchQuery, specializationFilter, locationFilter]);

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

  // When coming from AI chat with location, prioritize nearby therapists
  const sortedTherapists = useMemo(() => {
    const therapistsWithDistance = filteredTherapists.map((t: Therapist) => {
      const distanceKm =
        t.coords && !usingFallbackLocation && userCoords
          ? haversineDistanceKm(userCoords, t.coords)
          : Number.POSITIVE_INFINITY;
      return { therapist: t, distanceKm };
    });

    // Always sort by distance
    therapistsWithDistance.sort((a, b) => a.distanceKm - b.distanceKm);

    if (useLocation === "true") {
      // Show nearby first (within 60km), then rest separated
      const nearby = therapistsWithDistance.filter((x) => x.distanceKm <= 60);
      const others = therapistsWithDistance.filter((x) => x.distanceKm > 60);

      // If we have enough nearby, only show nearby
      // If not enough (< 3), also include next closest ones
      const result =
        nearby.length >= 3
          ? nearby
          : [...nearby, ...others.slice(0, Math.max(0, 5 - nearby.length))];

      return result.map((x) => x.therapist);
    }

    return therapistsWithDistance.map((x) => x.therapist);
  }, [filteredTherapists, userCoords, usingFallbackLocation, useLocation]);

  const renderTherapist = ({ item }: { item: Therapist }) => {
    // Show distance whenever we have real user coords (not fallback)
    const distance =
      !usingFallbackLocation && item.coords && userCoords
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

      {/* Search Bar */}
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onLocationPress={handleLocationPress}
        locationLoading={locationLoading}
      />

      {/* Filters Section */}
      <TherapistsHeader
        reason={reason}
        specializationLabel={specializationLabel}
        locationLabel={locationLabel}
        onChangeSpecialization={setSpecializationFilter}
        onChangeLocation={setLocationFilter}
        usingFallbackLocation={usingFallbackLocation}
        useLocation={useLocation}
        resolvedLocation={resolvedLocation}
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
