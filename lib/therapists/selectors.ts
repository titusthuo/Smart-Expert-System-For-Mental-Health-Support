import { mockTherapistDetails } from "./data";

export function getTherapistById(id: string | undefined | null) {
  if (!id) return undefined;
  return mockTherapistDetails[id];
}
