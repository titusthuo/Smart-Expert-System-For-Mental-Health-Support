import type { ImageSourcePropType } from "react-native";

export type Therapist = {
  id: string;
  name: string;
  photo: ImageSourcePropType;
  location: string;
  county: string;
  town: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  coords?: { lat: number; lng: number };
  specialization: string[];
  bio: string;
  licenseNumber?: string;
  rating?: number;
  reviews?: number;
  price?: number;
  availability?: string;
};

export type TherapistDetail = Therapist & {
  fullBio: string;
  qualifications: string[];
  experience: string;
};

export type Review = {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
};

export type DropdownOption = { label: string; value: string };
