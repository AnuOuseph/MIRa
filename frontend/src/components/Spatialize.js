// components/SpatialPlayer.jsx
import { useEffect, useRef } from "react";

/**
 * SpatialPlayer
 * Controlled component. Parent owns all state.
 *
 * Props:
 *   stage      — "idle" | "processing" | "ready"
 *   playing    — boolean
 *   onToggle   — () => void
 *   audioUrl   — string | null  (object URL of processed WAV)
 *   azimuth    — number
 *   elevation  — number
 *   fileName   — string | undefined
 *   onEnded    — () => void  (called when audio finishes naturally)
 */
export function SpatialPlayer({
  stage,
  playing,
  onToggle,
  audioUrl,
  azimuth,
  elevation,
  fileName,
  onEnded,
}) {
  const audioRef = useRef(null);
  const ready = stage === "ready";

  // Sync audio element with playing state from parent
  useEffect(() => {
    if (!audioRef.current || !audioUrl) return;
    if (playing) {
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
  }, [playing, audioUrl]);

  // Reset audio when URL changes (new spatialize call)
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  }, [audioUrl]);

  const leftGain  = Math.max(0.1, Math.cos(((azimuth + 90) * Math.PI) / 180));
  const rightGain = Math.max(0.1, Math.cos(((azimuth - 90) * Math.PI) / 180));

  return (
    <div className="mt-4 rounded-lg border border-gray-100 bg-gray-50 p-4">
      {/* Hidden audio element — controlled by useEffect above */}
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onEnded={onEnded}
          style={{ display: "none" }}
        />
      )}

      {/* Top row: file info + status badge */}
      <div className="flex items-start justify-between mb-3">
        <div className="min-w-0">
          <p className="text-xs font-mono text-gray-500 truncate">
            {fileName ?? "no source loaded"}
          </p>
          <p className="text-[11px] font-mono text-gray-400 mt-0.5"
             style={{ fontFamily: "var(--font-jetbrains-mono), ui-monospace, monospace" }}>
            az {String(Math.round(azimuth)).padStart(3,"0")}° · el {elevation}° · kemar · 44.1 kHz · binaural
          </p>
        </div>
        <StatusBadge stage={stage} />
      </div>

      {/* Controls row */}
      <div className="flex items-center gap-3">
        {/* Play / pause button */}
        <button
          disabled={!ready}
          onClick={onToggle}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full
                     bg-[#515bc3] text-white
                     hover:bg-[#3f48a8] transition-colors
                     disabled:opacity-35 disabled:cursor-not-allowed"
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? (
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
              <rect x="6" y="5" width="4" height="14" rx="1" />
              <rect x="14" y="5" width="4" height="14" rx="1" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        {/* Binaural bars visualiser */}
        <BinauralBars
          active={playing && ready}
          leftGain={leftGain}
          rightGain={rightGain}
        />
      </div>

      {/* Headphone hint */}
      <div className="mt-3 flex items-center gap-2 text-[11px] text-gray-400">
        <HeadphoneIcon />
        Use headphones for the full binaural effect.
      </div>
    </div>
  );
}

/* ── Status badge ── */
function StatusBadge({ stage }) {
  const map = {
    idle:       { label: "IDLE",       cls: "bg-gray-100 text-gray-400" },
    processing: { label: "CONVOLVING", cls: "bg-[#e0e6ff] text-[#515bc3]" },
    ready:      { label: "RENDERED",   cls: "bg-green-50 text-green-600" },
  };
  const { label, cls } = map[stage] ?? map.idle;
  return (
    <span className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full whitespace-nowrap ${cls}`}
          style={{ fontFamily: "var(--font-jetbrains-mono), ui-monospace, monospace" }}>
      {label}
    </span>
  );
}

/* ── Binaural bar visualiser ── */
function BinauralBars({ active, leftGain, rightGain }) {
  const BARS = 24;
  return (
    <div className="flex-1 flex items-center gap-2">
      <ChannelBars count={BARS} active={active} gain={leftGain} />
      <ChannelBars count={BARS} active={active} gain={rightGain} mirror />
    </div>
  );
}

function ChannelBars({ count, active, gain, mirror }) {
  return (
    <div className={`flex-1 flex items-center gap-[2px] h-7 ${mirror ? "flex-row-reverse" : ""}`}>
      {Array.from({ length: count }).map((_, i) => {
        const shape = 0.3 + 0.7 * Math.abs(Math.sin((i + 1) * 0.7));
        const heightPct = active ? Math.max(8, shape * gain * 100) : 8;
        const opacity   = active ? 0.4 + 0.6 * (shape * gain) : 0.2;
        return (
          <div
            key={i}
            className="flex-1 rounded-sm bg-[#515bc3] transition-all duration-150"
            style={{ height: `${heightPct}%`, opacity }}
          />
        );
      })}
    </div>
  );
}

/* ── Headphone icon ── */
function HeadphoneIcon() {
  return (
    <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24"
         fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 14v-3a9 9 0 0118 0v3" />
      <path d="M21 14a2 2 0 01-2 2h-1v-5h1a2 2 0 012 2v1z
               M3 14a2 2 0 002 2h1v-5H5a2 2 0 00-2 2v1z" />
    </svg>
  );
}