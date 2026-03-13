import {
    TherapistsQuery,
    useTherapistsQuery,
} from "@/graphql/generated/graphql";
import { Therapist } from "@/lib/therapists/types";
import { useEffect, useMemo } from "react";

const FALLBACK_THERAPIST_PHOTO = require("../../assets/images/therapists/Therapists-image.jpg");

export function useTherapists() {
  const { data, loading, error, ...queryState } = useTherapistsQuery();

  useEffect(() => {
    console.log("[useTherapists] fetch state", {
      loading,
      error: error?.message ?? null,
      count: data?.therapists?.length ?? 0,
    });

    if (data?.therapists?.length) {
      console.log("[useTherapists] therapists payload", data.therapists);
    }
  }, [data, error, loading]);

  const therapists = useMemo<Therapist[]>(() => {
    const items = (data?.therapists ?? []) as NonNullable<
      TherapistsQuery["therapists"]
    >;

    return items
      .filter((therapist): therapist is NonNullable<typeof therapist> =>
        Boolean(therapist),
      )
      .map((therapist) => ({
        id: String(therapist.id),
        name: therapist.name,
        photo: therapist.photoUrl
          ? { uri: therapist.photoUrl }
          : FALLBACK_THERAPIST_PHOTO,
        location: therapist.location,
        county: therapist.county,
        town: therapist.town,
        phone: therapist.phone,
        whatsapp: therapist.whatsapp ?? undefined,
        email: therapist.email ?? undefined,
        coords:
          typeof therapist.coords?.lat === "number" &&
          typeof therapist.coords?.lng === "number"
            ? { lat: therapist.coords.lat, lng: therapist.coords.lng }
            : undefined,
        specialization: (therapist.specialization ?? []).filter(
          (value): value is string => Boolean(value),
        ),
        bio: therapist.bio,
        licenseNumber: therapist.licenseNumber ?? undefined,
        price:
          typeof therapist.price === "number" ? therapist.price : undefined,
        availability: therapist.availability ?? undefined,
      }));
  }, [data]);

  return {
    therapists,
    data,
    loading,
    error,
    ...queryState,
  };
}
