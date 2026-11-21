import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/data/site";
import { getChannelProfileImage } from "@/lib/youtube";

export const alt = `${site.name} — ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const revalidate = 900;

export default async function OpengraphImage() {
  const profileImage = await getChannelProfileImage();
  let photo: Buffer;
  if (profileImage.startsWith("https://")) {
    try {
      const res = await fetch(profileImage, { next: { revalidate: 900 } });
      if (!res.ok) throw new Error(`Could not load the YouTube profile image: ${res.status}`);
      photo = Buffer.from(await res.arrayBuffer());
    } catch (error) {
      console.error("Could not load the current profile image for the Open Graph image.", error);
      photo = await readFile(join(process.cwd(), "public/images/krrish-tapwal-portrait.jpg"));
    }
  } else {
    photo = await readFile(join(process.cwd(), "public", profileImage));
  }
  const src = `data:image/jpeg;base64,${photo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "radial-gradient(circle at 75% 25%, #2a1d52, #0e1019 55%, #07080f)",
          color: "#ffffff",
          padding: 64,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 640 }}>
          <div style={{ fontSize: 24, letterSpacing: 4, color: "#ff7a2f", textTransform: "uppercase" }}>{site.role}</div>
          <div style={{ fontSize: 120, fontWeight: 800, lineHeight: 0.95, marginTop: 24, letterSpacing: -2, textTransform: "uppercase" }}>Krrish</div>
          <div style={{ fontSize: 120, fontWeight: 800, lineHeight: 0.95, letterSpacing: -2, textTransform: "uppercase" }}>Tapwal</div>
          <div style={{ fontSize: 30, color: "#ff7a2f", marginTop: 32 }}>{`${site.brand} · ${site.location.region}`}</div>
          <div style={{ fontSize: 24, color: "#9599ad", marginTop: 12 }}>krrishtapwal.space</div>
        </div>
        <img
          src={src}
          width={400}
          height={400}
          alt=""
          style={{ borderRadius: 400, border: "10px solid #ff7a2f", objectFit: "cover" }}
        />
      </div>
    ),
    size,
  );
}
