import type { DropdownOption } from "./types";

export const specializationOptions: DropdownOption[] = [
  { label: "All Specializations", value: "all" },
  { label: "Anxiety", value: "anxiety" },
  { label: "Depression", value: "depression" },
  { label: "Trauma", value: "trauma" },
  { label: "Stress Management", value: "stress management" },
  { label: "Psychiatry", value: "psychiatry" },
  { label: "Addiction", value: "addiction" },
  { label: "Grief & Loss", value: "grief" },
  { label: "Sleep / Insomnia", value: "sleep" },
  { label: "Anger Management", value: "anger management" },
  { label: "Self-Esteem", value: "self-esteem" },
  { label: "Emotion Regulation", value: "emotion regulation" },
  { label: "HIV Psychiatry", value: "hiv psychiatry" },
  { label: "Family Therapy", value: "family therapy" },
];

export const locationOptions: DropdownOption[] = [
  { label: "All Locations", value: "all" },
  { label: "Nairobi", value: "nairobi" },
  { label: "Kakamega", value: "kakamega" },
  { label: "Eldoret", value: "eldoret" },
  { label: "Mombasa", value: "mombasa" },
  { label: "Nakuru", value: "nakuru" },
  { label: "Kisumu", value: "kisumu" },
  { label: "Kisii", value: "kisii" },
  { label: "Siaya", value: "siaya" },
  { label: "Nyeri", value: "nyeri" },
];

export function getOptionLabel(
  options: DropdownOption[],
  value: string,
  fallback: string,
) {
  return options.find((o) => o.value === value)?.label ?? fallback;
}
