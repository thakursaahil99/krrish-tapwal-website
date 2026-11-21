import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

/**
 * Favicon / app icon made from Krrish's YouTube photo (public/images/krrish-avatar.jpg, 900×900),
 * cropped from the top of the head down to the chest.
 * Photo badalni ho to wahi file replace karo; crop CROP se adjust hota hai.
 */
const SRC = { w: 900, h: 900 };
const CROP = { x: 135, y: 80, size: 500 }; // square: head → chest

export async function faceIcon(size: number, { round }: { round: boolean }) {
  const photo = await readFile(join(process.cwd(), "public/images/krrish-avatar.jpg"));
  const dataUrl = `data:image/jpeg;base64,${photo.toString("base64")}`;

  const ring = Math.max(2, Math.round(size * 0.05));
  const inner = size - ring * 2;
  const k = inner / CROP.size;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #ffc24b, #ff7a2f 50%, #ff3d7f)",
          borderRadius: round ? "50%" : 0,
        }}
      >
        <div style={{ position: "relative", display: "flex", width: inner, height: inner, overflow: "hidden", borderRadius: round ? "50%" : Math.round(size * 0.18), background: "#07080f" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={dataUrl}
            alt=""
            width={Math.round(SRC.w * k)}
            height={Math.round(SRC.h * k)}
            style={{ position: "absolute", left: Math.round(-CROP.x * k), top: Math.round(-CROP.y * k) }}
          />
        </div>
      </div>
    ),
    { width: size, height: size },
  );
}
