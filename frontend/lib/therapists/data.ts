import type { ImageSourcePropType } from "react-native";

import type { Review, Therapist, TherapistDetail } from "./types";

const therapistPhotos: Record<string, ImageSourcePropType> = {
  "1": require("../../assets/images/therapists/dr-david-wairoto.jpg"),
  "2": require("../../assets/images/therapists/dr-neema-araka.jpg"),
  "3": require("../../assets/images/therapists/Dr-J-M-MNdegwa-MBS.jpg"),
  "4": require("../../assets/images/therapists/Dr-Rajab-Saddam.jpg"),
  "5": require("../../assets/images/therapists/Dr-Susan-Wangeci-Kuria.jpg"),
  "6": require("../../assets/images/therapists/Therapists-image.jpg"),
  "7": require("../../assets/images/therapists/Therapists-image.jpg"),
  "8": require("../../assets/images/therapists/Dr.-Kingi-Mochache-Vicechair.jpg"),
  "9": require("../../assets/images/therapists/Therapists-image.jpg"),
  "10": require("../../assets/images/therapists/dr--jackline-ochieng.jpg"),
  "11": require("../../assets/images/therapists/Dr-Catherine-Munanie.jpg"),
  "12": require("../../assets/images/therapists/dr-samuel-kamoche.webp"),
  "13": require("../../assets/images/therapists/dr-lina-akello.jpg"),
  "14": require("../../assets/images/therapists/Therapists-image.jpg"),
  "15": require("../../assets/images/therapists/oasis-doctors-plaza-eldoret.jpg"),
  "16": require("../../assets/images/therapists/Dr-Kevin-Wamula.jpg"),
  "17": require("../../assets/images/therapists/Dr.-Erica-Adagala.jpeg"),
  "18": require("../../assets/images/therapists/dr-linda-n-nyamute.jpg"),
  "19": require("../../assets/images/therapists/Oasis-kisii-branch.jpeg"),
  "20": require("../../assets/images/therapists/Consolata-Mathari-Hospital.png"),
  "21": require("../../assets/images/therapists/nyeri-county-referral-hospital.jpeg"),
};

export const mockTherapists: Therapist[] = [];

export const mockTherapistDetails: Record<string, TherapistDetail> = {};

export const mockReviews: Review[] = [];
