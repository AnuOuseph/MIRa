import { useMemo, useRef, useState } from "react";

export function AzimuthCompass({ azimuth = 0, onChange, size = 420 }) {
  const ref = useRef(null);
  const [dragging, setDragging] = useState(false);

  const cx = size / 2;
  const cy = size / 2;
  const r  = size * 0.415;

  const toXY = (az, radius) => {
    const rad = ((az - 90) * Math.PI) / 180;
    return {
      x: cx + radius * Math.cos(rad),
      y: cy + radius * Math.sin(rad),
    };
  };

  const pointerToAz = (clientX, clientY) => {
    const rect = ref.current.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width)  * size - cx;
    const y = ((clientY - rect.top)  / rect.height) * size - cy;
    let deg = (Math.atan2(y, x) * 180) / Math.PI + 90;
    return ((deg % 360) + 360) % 360;
  };

  const handlePointerDown = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    onChange?.(Math.round(pointerToAz(e.clientX, e.clientY)));
  };
  const handlePointerMove = (e) => {
    if (!dragging) return;
    onChange?.(Math.round(pointerToAz(e.clientX, e.clientY)));
  };
  const handlePointerUp = () => setDragging(false);

  const ticks = useMemo(() =>
    Array.from({ length: 36 }).map((_, i) => {
      const deg   = i * 10;
      const major = deg % 90 === 0;
      const med   = deg % 30 === 0;
      const inner = r - (major ? size*0.038 : med ? size*0.022 : size*0.013);
      return { p1: toXY(deg, r), p2: toXY(deg, inner), major, med };
    }),
  [r, size, azimuth]);

  const dot = toXY(azimuth, r);

  const arcPath = (() => {
    const rr    = r - size*0.07;
    const start = toXY(0, rr);
    const end   = toXY(azimuth, rr);
    const large = azimuth > 180 ? 1 : 0;
    if (Math.abs(azimuth) < 1) return "";
    return `M ${start.x} ${start.y} A ${rr} ${rr} 0 ${large} 1 ${end.x} ${end.y}`;
  })();

  const leftGain  = Math.max(0, Math.cos(((azimuth + 90) * Math.PI) / 180));
  const rightGain = Math.max(0, Math.cos(((azimuth - 90) * Math.PI) / 180));

  const cardinalLabels = [
    { text: "FRONT 0°",   az: 0   },
    { text: "RIGHT 90°",  az: 90  },
    { text: "BACK 180°",  az: 180 },
    { text: "LEFT 270°",  az: 270 },
  ];

  return (
    <div className="relative w-full aspect-square select-none" style={{ maxWidth: size }}>
      <svg
        ref={ref}
        viewBox={`-45 -45 ${size + 90} ${size + 90}`}
        className="w-full h-full cursor-crosshair touch-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <circle cx={cx} cy={cy} r={r + size*0.045}
          fill="#fdfeff" stroke="#e5e7eb" strokeWidth="1" />

        {ticks.map(({ p1, p2, major, med }, i) => (
          <line key={i}
            x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
            stroke={major ? "#9ca3af" : med ? "#d1d5db" : "#e5e7eb"}
            strokeWidth={major ? 1.5 : 1}
          />
        ))}

        <circle cx={cx} cy={cy} r={r}
          fill="none" stroke="#e5e7eb" strokeWidth="1" />
        <circle cx={cx} cy={cy} r={r * 0.67}
          fill="none" stroke="#e5e7eb" strokeWidth="0.8" strokeDasharray="2 5" />
        <circle cx={cx} cy={cy} r={r * 0.34}
          fill="none" stroke="#e5e7eb" strokeWidth="0.8" strokeDasharray="2 5" />

        <line x1={cx} y1={cy - r} x2={cx} y2={cy + r}
          stroke="#e5e7eb" strokeWidth="0.8" strokeDasharray="3 5" />
        <line x1={cx - r} y1={cy} x2={cx + r} y2={cy}
          stroke="#e5e7eb" strokeWidth="0.8" strokeDasharray="3 5" />

        {/* labels */}
        {cardinalLabels.map(({ text, az }) => {
          const pos_x = toXY(az, r + size*0.090);
          const pos_y = toXY(az, r + size*0.070);
          return (
            <text key={text}
              x={pos_x.x} y={pos_y.y}
              textAnchor="middle" dominantBaseline="middle"
              fontSize={size * 0.027}
              fontFamily="var(--font-jetbrains-mono), ui-monospace, monospace"
              letterSpacing="0.08em"
              fill="#9ca3af"
            >
              {text}
            </text>
          );
        })}

        {/* head model */}
        <circle cx={cx} cy={cy} r={size*0.088}
          fill="white" stroke="#d1d5db" strokeWidth="1.2" />
        <polygon
          points={`${cx-size*0.014},${cy-size*0.082} ${cx+size*0.014},${cy-size*0.082} ${cx},${cy-size*0.11}`}
          fill="white" stroke="#d1d5db" strokeWidth="1.2"
        />
        <ellipse cx={cx - size*0.09} cy={cy} rx={size*0.011} ry={size*0.022}
          fill="white" stroke="#d1d5db" strokeWidth="1.2" />
        <ellipse cx={cx + size*0.09} cy={cy} rx={size*0.011} ry={size*0.022}
          fill="white" stroke="#d1d5db" strokeWidth="1.2" />

        {arcPath && (
          <path d={arcPath}
            fill="none" stroke="#515bc3" strokeWidth="2" opacity="0.6"
            strokeLinecap="round"
          />
        )}

        {/* pointer line */}
        <line
          x1={cx} y1={cy} x2={dot.x} y2={dot.y}
          stroke="#515bc3" strokeWidth="1.5"
          strokeDasharray="4 4" opacity="0.7"
        />

        <circle cx={dot.x} cy={dot.y} r={size*0.044}
          fill="#e8eeff"
        />
        <circle cx={dot.x} cy={dot.y} r={size*0.024}
          fill="#515bc3" 
        />
        <circle cx={dot.x} cy={dot.y} r={size*0.010}
          fill="white"
        />
      </svg>

      <div className="absolute left-0 right-0 bottom-1 flex items-center justify-between px-3" style={{ fontFamily: "var(--font-jetbrains-mono), ui-monospace, monospace" }}>
        <GainMeter label="L" value={leftGain} />
        <span className="text-[10px] text-gray-500">
          AZ <span className="text-gray-800">{String(Math.round(azimuth)).padStart(3, "0")}°</span>
        </span>
        <GainMeter label="R" value={rightGain} reverse />
      </div>
    </div>
  );
}

function GainMeter({ label, value, reverse }) {
  const pct = Math.round(value * 100);
  return (
    <div className={`flex items-center gap-1.5 text-[10px] text-gray-500 ${reverse ? "flex-row-reverse" : ""}`}>
      <span className="text-gray-700">{label}</span>
      <div className="h-[3px] w-16 rounded-full bg-gray-200 overflow-hidden">
        <div
          className="h-full bg-[#515bc3] transition-all duration-150"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}