import { useTherapistQuery } from "@/graphql/generated/graphql";
import { TherapistDetail } from "@/lib/therapists/types";
import { useEffect, useMemo } from "react";

const FALLBACK_THERAPIST_PHOTO = require("../../assets/images/therapists/Therapists-image.jpg");

export function useTherapist(id?: string) {
  const therapistId = Number(id);
  const isValidTherapistId = Number.isFinite(therapistId);

  const { data, loading, error, ...queryState } = useTherapistQuery({
    variables: { id: isValidTherapistId ? therapistId : 0 },
    skip: !isValidTherapistId,
  });

  useEffect(() => {
    console.log("[useTherapist] fetch state", {
      id,
      loading,
      error: error?.message ?? null,
      hasTherapist: Boolean(data?.therapist),
    });

    if (data?.therapist) {
      console.log("[useTherapist] therapist payload", data.therapist);
    }
  }, [data, error, id, loading]);

  const therapist = useMemo<TherapistDetail | undefined>(() => {
    const item = data?.therapist;
    if (!item) return undefined;

    const coords =
      typeof item.coords?.lat === "number" &&
      typeof item.coords?.lng === "number"
        ? { lat: item.coords.lat, lng: item.coords.lng }
        : undefined;

    return {
      id: String(item.id),
      name: item.name,
      photo: item.photoUrl ? { uri: item.photoUrl } : FALLBACK_THERAPIST_PHOTO,
      location: item.location,
      county: item.county,
      town: item.town,
      phone: item.phone,
      whatsapp: item.whatsapp ?? undefined,
      email: item.email ?? undefined,
      coords,
      specialization: (item.specialization ?? []).filter(
        (value): value is string => Boolean(value),
      ),
      bio: item.bio,
      licenseNumber: item.licenseNumber ?? undefined,
      price: typeof item.price === "number" ? item.price : undefined,
      availability: item.availability ?? undefined,
      fullBio: item.fullBio ?? "",
      qualifications: Array.isArray(item.qualifications)
        ? item.qualifications.filter(
            (value): value is string => typeof value === "string",
          )
        : [],
      experience: item.experience ?? "",
    };
  }, [data]);

  return {
    therapist,
    data,
    loading,
    error,
    ...queryState,
  };
}
