import { faceIcon } from "@/lib/face-icon";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** iOS home-screen icon (iOS rounds the corners itself, so this one stays square) */
export default function AppleIcon() {
  return faceIcon(size.width, { round: false });
}
