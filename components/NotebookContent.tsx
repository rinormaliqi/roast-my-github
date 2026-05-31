"use client";

import { useState } from "react";
import {
  Pencil,
  ArrowRight,
  Briefcase,
  Mountain,
  Feather,
  Zap,
  BookOpen,
  AlertTriangle,
  FileText,
} from "lucide-react";
import { RoastStyle, RoastResponse, ApiError } from "@/types";
import { getTone, type ToneStrings } from "@/lib/tone";
import RoastCard from "./RoastCard";

// ─── Style definitions ───────────────────────────────────────
const STYLES: {
  value: RoastStyle;
  label: string;
  sublabel: string;
  Icon: React.ElementType;
  tilt: number;
}[] = [
  { value: "corporate",     label: "Corporate",     sublabel: "synergize the burn",    Icon: Briefcase, tilt: -1.0 },
  { value: "shqiptarski",   label: "Shqiptarski",   sublabel: "dark humor, në shqip",  Icon: Mountain,  tilt:  0.8 },
  { value: "haiku",         label: "Haiku",         sublabel: "5 · 7 · 5 of shame",   Icon: Feather,   tilt: -0.5 },
  { value: "gen-z",         label: "Gen Z",         sublabel: "no cap, lowkey brutal", Icon: Zap,       tilt:  1.2 },
  { value: "shakespearean", label: "Shakespearean", sublabel: "hark! thou stinketh",   Icon: BookOpen,  tilt: -0.7 },
];

// ─── Component ──────────────────────────────────────────────
export default function NotebookContent() {
  const [username, setUsername] = useState("");
  const [style,    setStyle]    = useState<RoastStyle>("gen-z");
  const [loading,  setLoading]  = useState(false);
  const [result,   setResult]   = useState<RoastResponse | null>(null);
  const [error,    setError]    = useState<ApiError | null>(null);

  // Tone is derived from the *currently selected* style — updates instantly
  // when the user switches modes, even before submitting.
  const tone = getTone(style);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!username.trim() || loading) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res  = await fetch("/api/roast", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ username: username.trim(), style }),
      });
      const data = await res.json();
      if (!res.ok) setError(data as ApiError);
      else         setResult(data as RoastResponse);
    } catch {
      setError({ error: "Could not reach the server.", code: "UPSTREAM_ERROR" });
    } finally {
      setLoading(false);
    }
  }

  // For the result label, derive tone from the *result's* style so the
  // annotation stays consistent with the card even if the user switches modes.
  const resultTone = result ? getTone(result.style) : tone;

  return (
    <div className="nb-pages">

      {/* ════════════════════════════════════
          LEFT PAGE — form
      ════════════════════════════════════ */}
      <div className="nb-page-left">

        {/* Hole punches */}
        <div className="nb-holes" aria-hidden="true">
          {[0, 1, 2].map((i) => <div key={i} className="nb-hole" />)}
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.6rem" }}>

          {/* ── Username ── */}
          <div>
            <label htmlFor="username" className="field-label">
              <ArrowRight size={14} strokeWidth={2} aria-hidden="true" />
              {tone.usernameLabel}
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (error?.code === "INVALID_USERNAME") setError(null);
              }}
              placeholder="e.g. torvalds"
              maxLength={39}
              autoComplete="off"
              spellCheck={false}
              disabled={loading}
              className="sketch-input"
            />
            {!username && (
              <span
                className="margin-note"
                style={{ fontSize: "0.82rem", marginTop: "0.2rem", display: "block" }}
                aria-hidden="true"
              >
                {tone.usernameHint}
              </span>
            )}
          </div>

          {/* ── Style picker ── */}
          <div>
            <span className="section-label">{tone.stylePickerLabel}</span>

            <div className="style-rows">
              {STYLES.map((s) => {
                const isSelected = style === s.value;
                return (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => setStyle(s.value)}
                    disabled={loading}
                    className={`style-row${isSelected ? " selected" : ""}`}
                    style={{ transform: `rotate(${s.tilt}deg)` }}
                    aria-pressed={isSelected}
                  >
                    <span className="style-row-radio" aria-hidden="true" />

                    <s.Icon
                      size={16}
                      strokeWidth={isSelected ? 2 : 1.5}
                      aria-hidden="true"
                      style={{ flexShrink: 0, color: "var(--ink-mid)" }}
                    />

                    <span style={{ lineHeight: 1.3 }}>
                      <span style={{ display: "block", fontWeight: isSelected ? 700 : 400 }}>
                        {s.label}
                      </span>
                      <span
                        className="margin-note"
                        style={{ fontSize: "0.8rem", transform: "none", display: "block", lineHeight: 1.2 }}
                      >
                        {s.sublabel}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Submit ── */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <button
              type="submit"
              disabled={loading || !username.trim()}
              className="sketch-submit"
            >
              {loading ? (
                <>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "1.05rem", fontStyle: "italic" }}>
                    {tone.loadingText}
                  </span>
                  <ScribbleDots />
                </>
              ) : (
                <>
                  <Pencil size={17} strokeWidth={1.7} aria-hidden="true" />
                  roast it
                  <ArrowRight size={15} strokeWidth={2} aria-hidden="true" />
                </>
              )}
            </button>

            {!username.trim() && !loading && (
              <span className="margin-note" aria-hidden="true" style={{ fontSize: "0.85rem" }}>
                {tone.waitingNote}
              </span>
            )}
          </div>

          {/* ── Error ── */}
          {error && (
            <div className="sketch-error" style={{ transform: "rotate(-0.3deg)" }}>
              <p
                style={{
                  display: "flex",
                  alignItems: style === "haiku" ? "flex-start" : "center",
                  gap: "0.4rem",
                  margin: 0,
                  color: "rgba(170,35,35,0.9)",
                  fontSize: "1rem",
                  fontFamily: "var(--font-body)",
                  // Haiku errors contain \n — preserve line breaks
                  whiteSpace: style === "haiku" ? "pre-line" : "normal",
                }}
              >
                <AlertTriangle
                  size={15}
                  strokeWidth={2}
                  aria-hidden="true"
                  style={{ flexShrink: 0, marginTop: style === "haiku" ? "3px" : 0 }}
                />
                {tone.errors[error.code] ?? tone.errorFallback}
              </p>
            </div>
          )}
        </form>
      </div>

      {/* ─── Book spine ─── */}
      <div className="nb-spine" aria-hidden="true" />

      {/* ════════════════════════════════════
          RIGHT PAGE — result / placeholder
      ════════════════════════════════════ */}
      <div className={`nb-page-right${!result && !loading ? " nb-page-right--empty" : ""}`}>
        {result ? (
          <>
            <p
              className="margin-note"
              style={{ marginBottom: "0.6rem", display: "block", fontSize: "0.88rem", transform: "rotate(-0.6deg)" }}
            >
              {resultTone.resultLabel}
            </p>
            <RoastCard result={result} />
          </>
        ) : (
          <RightPlaceholder loading={loading} tone={tone} />
        )}
      </div>
    </div>
  );
}

// ─── Right-page placeholder ──────────────────────────────────
function RightPlaceholder({ loading, tone }: { loading: boolean; tone: ToneStrings }) {
  return (
    <div className="right-placeholder">
      <div className="placeholder-frame">
        {loading ? (
          <span style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.7rem" }}>
            <ScribbleDots />
            <span
              className="margin-note"
              style={{ transform: "none", fontSize: "0.9rem", color: "var(--ink-ghost)" }}
            >
              {tone.loadingText}
            </span>
          </span>
        ) : (
          <FileText size={36} strokeWidth={1} style={{ color: "var(--ink-ghost)" }} aria-hidden="true" />
        )}
      </div>

      <p className="placeholder-label">
        {loading ? tone.loadingTitle : tone.placeholderTitle}
      </p>

      {!loading && (
        <span
          className="margin-note"
          style={{ fontSize: "0.82rem", transform: "rotate(-1deg)", marginTop: "-0.4rem" }}
          aria-hidden="true"
        >
          {tone.placeholderHint}
        </span>
      )}
    </div>
  );
}

// ─── Scribble dots ───────────────────────────────────────────
function ScribbleDots() {
  return (
    <span style={{ display: "inline-flex", gap: "4px", alignItems: "center" }}>
      <span className="scribble-dot" />
      <span className="scribble-dot" />
      <span className="scribble-dot" />
    </span>
  );
}
