/**
 * A flat-icon style illustration (bold filled shapes, soft drop shadows,
 * no sketchy outlines) — following the same visual conventions as
 * professional illustration sets like unDraw: big simple silhouettes,
 * generous rounding, a tight 3-4 colour palette, shadow for depth instead
 * of outline strokes. Grouped into independently-animatable parts so
 * Hero.tsx can scrub a GSAP timeline across it.
 */
const FLAKES: Array<[number, number, number]> = [
  [55, 100, 6],
  [115, 160, 8],
  [32, 210, 5],
  [155, 80, 7],
  [90, 45, 5],
  [190, 195, 6],
  [210, 130, 5],
  [20, 145, 7],
];

const GRASS_X = [340, 362, 384, 406, 428, 450, 472, 494];
const FLOWERS = [
  [356, "#ef6f8e"],
  [418, "#f6c445"],
  [480, "#ef6f8e"],
] as const;

function round(n: number) {
  return Math.round(n * 1000) / 1000;
}

export function HeroIllustration({
  className,
  ref,
}: {
  className?: string;
  ref?: React.Ref<SVGSVGElement>;
}) {
  return (
    <svg ref={ref} viewBox="0 0 520 480" className={className} aria-hidden>
      <defs>
        <linearGradient id="illu-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--surface-2)" />
          <stop offset="1" stopColor="var(--surface)" />
        </linearGradient>
        <filter id="illu-shadow" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#000000" floodOpacity="0.12" />
        </filter>
      </defs>

      <rect x="0" y="0" width="520" height="430" rx="24" fill="url(#illu-sky)" />
      <path d="M0 410 Q260 430 520 410 V430 Q260 450 0 430 Z" fill="var(--surface)" opacity="0.6" />

      {/* seasonal divider */}
      <line
        className="illu-divider"
        x1="260"
        y1="60"
        x2="260"
        y2="400"
        stroke="var(--border)"
        strokeWidth="2"
        strokeDasharray="2 10"
        strokeLinecap="round"
      />

      {/* driveway — drawn before the house so the door paints on top of it */}
      <path d="M204 400L228 312H292L316 400Z" fill="var(--surface-2)" />

      {/* --- house --- */}
      <g className="illu-house" filter="url(#illu-shadow)">
        <rect x="150" y="250" width="220" height="150" rx="14" fill="#fbf4e4" />
        <path d="M138 258 L260 160 L382 258 Q382 272 368 266 L260 182 L152 266 Q138 272 138 258 Z" fill="#d9704f" />
        <rect x="233" y="330" width="54" height="70" rx="10" fill="#d9704f" />
        <circle cx="272" cy="366" r="3.2" fill="#fbf4e4" />
        <rect x="172" y="276" width="46" height="46" rx="10" fill="#8fd0e8" />
        <rect x="192" y="276" width="6" height="46" fill="#fbf4e4" />
        <rect x="172" y="296" width="46" height="6" fill="#fbf4e4" />
      </g>

      {/* pine tree — permanent fixture across both seasons */}
      <g filter="url(#illu-shadow)">
        <rect x="74" y="356" width="12" height="40" rx="4" fill="#9a6b45" />
        <path d="M80 300C52 336 38 358 38 358H122C122 358 108 336 80 300Z" fill="#2f8f5c" />
        <path d="M80 270C58 300 46 320 46 320H114C114 320 102 300 80 270Z" fill="#39a862" />
      </g>

      {/* --- winter: snowflakes, drift, snowman --- */}
      <g className="illu-snow">
        {FLAKES.map(([cx, cy, r], i) => (
          <circle key={i} className="illu-flake" cx={cx} cy={cy} r={r} fill="#ffffff" opacity="0.9" />
        ))}
        <path
          d="M10 400C48 378 92 378 128 392C164 406 192 388 208 396V410H10Z"
          fill="#ffffff"
        />
        <g className="illu-snowman" transform="translate(448 396)" filter="url(#illu-shadow)">
          <circle cx="0" cy="-20" r="20" fill="#ffffff" />
          <circle cx="0" cy="-54" r="14" fill="#ffffff" />
          <path d="M0 -54L15 -50L0 -49Z" fill="#e8923a" />
          <circle cx="-5" cy="-57" r="1.6" fill="#45505c" />
          <circle cx="4" cy="-57" r="1.6" fill="#45505c" />
          <circle cx="-5" cy="-16" r="1.5" fill="#45505c" />
          <circle cx="0" cy="-13" r="1.5" fill="#45505c" />
          <circle cx="5" cy="-16" r="1.5" fill="#45505c" />
        </g>
      </g>

      {/* --- summer: sun, grass, flowers --- */}
      <g>
        <g className="illu-sun" style={{ transformOrigin: "432px 96px" }}>
          <circle cx="432" cy="96" r="30" fill="#f6c445" />
          <g className="illu-sun-rays" stroke="#f6c445" strokeWidth="5" strokeLinecap="round">
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
              <line
                key={deg}
                x1={round(432 + Math.cos((deg * Math.PI) / 180) * 42)}
                y1={round(96 + Math.sin((deg * Math.PI) / 180) * 42)}
                x2={round(432 + Math.cos((deg * Math.PI) / 180) * 55)}
                y2={round(96 + Math.sin((deg * Math.PI) / 180) * 55)}
              />
            ))}
          </g>
        </g>

        {GRASS_X.map((x, i) => (
          <g
            key={x}
            className="illu-grass-blade"
            transform={`translate(${x} 400)`}
            style={{ transformOrigin: "0px 0px" }}
          >
            <path
              d={`M-4 0C-4 ${-16 - (i % 3) * 6} -8 ${-20 - (i % 3) * 6} -9 ${-30 - (i % 3) * 6}`}
              fill="none"
              stroke="#2f8f5c"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <path
              d={`M4 0C4 ${-18 - (i % 3) * 6} 8 ${-22 - (i % 3) * 6} 10 ${-32 - (i % 3) * 6}`}
              fill="none"
              stroke="#39a862"
              strokeWidth="5"
              strokeLinecap="round"
            />
          </g>
        ))}

        {FLOWERS.map(([x, color], i) => (
          <g
            key={x}
            className="illu-grass-blade"
            transform={`translate(${x} 400)`}
            style={{ transformOrigin: "0px 0px" }}
          >
            <line x1="0" y1="0" x2="0" y2={-22 - i * 2} stroke="#39a862" strokeWidth="4" strokeLinecap="round" />
            <g transform={`translate(0 ${-28 - i * 2})`}>
              {[0, 72, 144, 216, 288].map((deg) => (
                <circle
                  key={deg}
                  cx={round(Math.cos((deg * Math.PI) / 180) * 6.5)}
                  cy={round(Math.sin((deg * Math.PI) / 180) * 6.5)}
                  r="5"
                  fill={color}
                />
              ))}
              <circle r="4" fill="#f6c445" />
            </g>
          </g>
        ))}
      </g>
    </svg>
  );
}
