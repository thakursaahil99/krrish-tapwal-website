"use client";

import AutoPlayer from "./AutoPlayer";

/** Muted, looping preview of a YouTube Short inside its card (plays only while on screen). */
export default function ShortPlayer({ id }: { id: string }) {
  return <AutoPlayer id={id} start={0} zoom={128} />;
}
