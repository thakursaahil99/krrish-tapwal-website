import Spotlight from "./Spotlight";

/**
 * Site-wide "Pahadi dawn" backdrop — completely static (zero animation, zero blur),
 * so it costs one paint and nothing per frame, even on low-end PCs.
 *  - night-to-dawn sky with a warm glow on the horizon
 *  - far snow-capped range in blue haze
 *  - mid pine ridge
 *  - near deodar (cedar) treeline
 */

// Deodar treeline, generated once at build time (deterministic, no randomness)
const trees = (() => {
  let d = "";
  for (let i = 0, x = -10; x < 1460; i++) {
    const h = 26 + ((i * 37) % 5) * 8 + ((i * 13) % 3) * 4;
    const base = 352 + Math.sin(i * 0.45) * 7;
    const w = h * 0.3;
    const t = base - h;
    // three-tier cedar silhouette
    d += `M${x - w} ${base}L${x - w * 0.45} ${t + h * 0.62}L${x - w * 0.75} ${t + h * 0.62}L${x - w * 0.3} ${t + h * 0.3}L${x - w * 0.5} ${t + h * 0.3}L${x} ${t}L${x + w * 0.5} ${t + h * 0.3}L${x + w * 0.3} ${t + h * 0.3}L${x + w * 0.75} ${t + h * 0.62}L${x + w * 0.45} ${t + h * 0.62}L${x + w} ${base}Z`;
    x += 14 + ((i * 7) % 4) * 6;
  }
  return d;
})();

export default function Backdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[linear-gradient(180deg,#07080f_0%,#0a0c17_55%,#12142b_100%)]" aria-hidden="true">
      {/* warm sunrise glow behind the peaks + faint cool moonlight at the top */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_45%_at_50%_92%,rgb(255_122_47/0.13),transparent_70%),radial-gradient(ellipse_60%_40%_at_80%_0%,rgb(123_108_255/0.06),transparent_70%)]" />
      {/* a few static stars */}
      <div className="sky-stars absolute inset-x-0 top-0 h-1/2" />

      <svg className="absolute inset-x-0 bottom-0 h-[52vh] min-h-72 w-full" viewBox="0 0 1440 400" preserveAspectRatio="xMidYMax slice">
        {/* far range — blue haze */}
        <path
          fill="#2e3163"
          fillOpacity="0.45"
          d="M0 260L90 200L150 225L240 140L300 180L380 110L450 170L520 130L600 190L690 90L760 150L840 120L920 180L1010 100L1080 160L1160 125L1240 185L1320 140L1440 200V400H0Z"
        />
        {/* snow caps */}
        <path
          fill="#f3f4f8"
          fillOpacity="0.32"
          d="M217 161L240 140L255 150L247 149L240 155L230 152ZM360 127L380 110L397 125L388 122L380 128L370 121ZM667 115L690 90L708 105L698 110L690 104L680 114ZM987 120L1010 100L1027 115L1018 112L1010 118L1000 113ZM1302 152L1320 140L1340 150L1330 149L1320 154L1311 150Z"
        />
        {/* mid ridge — pine green */}
        <path fill="#15173a" d="M0 300C120 250 200 270 300 240S480 210 560 250S720 290 820 240S1000 200 1100 245S1300 280 1440 235V400H0Z" />
        {/* near deodar treeline + ground */}
        <path fill="#0a0b18" d={`${trees}M0 350C240 340 480 362 720 352S1200 340 1440 352V400H0Z`} />
      </svg>

      <Spotlight />
    </div>
  );
}
