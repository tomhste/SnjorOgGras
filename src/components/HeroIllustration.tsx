/**
 * Procedurally generates a closed "spiky flower" path: N points around a
 * circle, radius modulated by a cosine wave so it reads as a snowflake
 * (sharp, high-contrast spikes) or a sun (soft, gentle bumps) depending on
 * the exponent/amplitude passed in. Both shapes are sampled with the same
 * point count and angle offsets, so MorphSVG can morph smoothly between
 * them index-to-index (no jumpy re-matching of points).
 */
function flowerPath(opts: {
  points: number;
  base: number;
  amplitude: number;
  sharpen: number;
}) {
  const { points, base, amplitude, sharpen } = opts;
  const samples = 96;
  const coords: string[] = [];
  for (let i = 0; i < samples; i++) {
    const theta = (i / samples) * Math.PI * 2;
    const wave = Math.cos(points * theta);
    const shaped = Math.sign(wave) * Math.abs(wave) ** sharpen;
    const r = Math.round((base + amplitude * shaped) * 1000) / 1000;
    const x = Math.round(Math.cos(theta) * r * 1000) / 1000;
    const y = Math.round(Math.sin(theta) * r * 1000) / 1000;
    coords.push(`${i === 0 ? "M" : "L"}${x} ${y}`);
  }
  return coords.join(" ") + " Z";
}

// A crisp 6-point ice crystal: high amplitude + sharpening exponent < 1
// pushes the waveform toward thin spikes with flat valleys.
export const SNOWFLAKE_PATH = flowerPath({
  points: 6,
  base: 62,
  amplitude: 46,
  sharpen: 0.4,
});

// A friendly 12-ray sun burst: more, shorter, rounder bumps.
export const SUN_PATH = flowerPath({
  points: 12,
  base: 78,
  amplitude: 24,
  sharpen: 1,
});

const FLAKES: Array<[number, number, number]> = [
  [55, 70, 5],
  [460, 110, 6],
  [40, 160, 4],
  [470, 200, 5],
  [60, 250, 5],
  [445, 290, 4],
];

const GRASS_X = [150, 175, 200, 320, 345, 370];

export function HeroIllustration({
  className,
  ref,
}: {
  className?: string;
  ref?: React.Ref<SVGSVGElement>;
}) {
  return (
    <svg ref={ref} viewBox="0 0 520 420" className={className} aria-hidden>
      <defs>
        <radialGradient id="illu-glow-ice" cx="50%" cy="45%" r="60%">
          <stop offset="0%" stopColor="#dff1fb" />
          <stop offset="100%" stopColor="#dff1fb" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="illu-glow-sun" cx="50%" cy="45%" r="60%">
          <stop offset="0%" stopColor="#fdeec0" />
          <stop offset="100%" stopColor="#fdeec0" stopOpacity="0" />
        </radialGradient>
        <filter id="illu-soft-shadow" x="-60%" y="-60%" width="220%" height="220%">
          <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#000000" floodOpacity="0.1" />
        </filter>
      </defs>

      {/* ambient glow behind the badge, crossfading ice -> gold */}
      <circle className="illu-glow-ice" cx="260" cy="195" r="190" fill="url(#illu-glow-ice)" />
      <circle className="illu-glow-sun" cx="260" cy="195" r="190" fill="url(#illu-glow-sun)" opacity="0" />

      {/* drifting snow, fades out as the scene warms up */}
      <g className="illu-snow">
        {FLAKES.map(([cx, cy, r], i) => (
          <circle key={i} className="illu-flake" cx={cx} cy={cy} r={r} fill="var(--accent)" opacity="0.6" />
        ))}
      </g>

      {/* the medallion ring — slowly rotates for an "always alive" feel */}
      <g className="illu-ring" style={{ transformOrigin: "260px 195px" }}>
        <circle
          cx="260"
          cy="195"
          r="150"
          fill="none"
          stroke="var(--border)"
          strokeWidth="2"
          strokeDasharray="1 14"
          strokeLinecap="round"
        />
      </g>

      {/* the star of the show: one path, morphing from snowflake to sun */}
      <g transform="translate(260 195)" filter="url(#illu-soft-shadow)">
        <path
          className="illu-weather-shape"
          d={SNOWFLAKE_PATH}
          fill="#dff1fb"
          stroke="#aee0f5"
          strokeWidth="2"
        />
      </g>

      {/* grass growing in from the base, under the badge */}
      <g className="illu-grass">
        {GRASS_X.map((x, i) => (
          <g
            key={x}
            className="illu-grass-blade"
            transform={`translate(${x} 400)`}
            style={{ transformOrigin: "0px 0px" }}
          >
            <path
              d={`M-3 0C-3 ${-14 - (i % 3) * 5} -6 ${-18 - (i % 3) * 5} -7 ${-27 - (i % 3) * 5}`}
              fill="none"
              stroke="var(--accent)"
              strokeWidth="5"
              strokeLinecap="round"
              opacity="0.85"
            />
            <path
              d={`M3 0C3 ${-16 - (i % 3) * 5} 6 ${-20 - (i % 3) * 5} 8 ${-29 - (i % 3) * 5}`}
              fill="none"
              stroke="var(--accent)"
              strokeWidth="5"
              strokeLinecap="round"
            />
          </g>
        ))}
      </g>
    </svg>
  );
}
