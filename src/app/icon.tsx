import { faceIcon } from "@/lib/face-icon";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/** Browser-tab favicon: Krrish's face (head → chest) in a round sunset-gradient ring */
export default function Icon() {
  return faceIcon(size.width, { round: true });
}
