"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { RoastStyle, RoastResponse, ApiError } from "@/types";
import { getTone } from "@/lib/tone";
import RoastCard from "./RoastCard";

// ─── Style chips (text only, per the new design) ─────────────
const STYLES: { value: RoastStyle; label: string; tilt: number }[] = [
  { value: "corporate",     label: "Corporate",     tilt: -0.8 },
  { value: "shqiptarski",   label: "Shqiptarski",   tilt:  0.6 },
  { value: "haiku",         label: "Haiku",         tilt: -0.5 },
  { value: "gen-z",         label: "Gen Z",         tilt:  0.8 },
  { value: "shakespearean", label: "Shakespearean", tilt: -0.6 },
];

// ─── Component ──────────────────────────────────────────────
export default function NotebookContent() {
  const [username, setUsername] = useState("");
  const [style,    setStyle]    = useState<RoastStyle>("corporate");
  const [loading,  setLoading]  = useState(false);
  const [result,   setResult]   = useState<RoastResponse | null>(null);
  const [error,    setError]    = useState<ApiError | null>(null);

  // Tone of the currently selected style (drives the submit button etc.)
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

  const isHaikuError = error && style === "haiku";

  return (
    <>
      {/* ════════════ FORM CARD ════════════ */}
      <form className="form-card" onSubmit={handleSubmit}>

        {/* Username */}
        <div>
          <label htmlFor="username" className="field-label">
            <GitHubMark />
            Target Username
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
            <span className="margin-note" style={{ marginTop: "0.3rem", display: "block", fontSize: "0.85rem" }}>
              {tone.usernameHint}
            </span>
          )}
        </div>

        {/* Flavor Profile */}
        <div>
          <span className="field-label">Flavor Profile</span>
          <div className="flavor-grid">
            {STYLES.map((s) => {
              const selected = style === s.value;
              return (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setStyle(s.value)}
                  disabled={loading}
                  aria-pressed={selected}
                  className={`flavor-chip${selected ? " selected" : ""}`}
                  style={!selected ? { transform: `rotate(${s.tilt}deg)` } : undefined}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit */}
        <button type="submit" disabled={loading || !username.trim()} className="btn-primary">
          {loading ? (
            <>
              <span style={{ fontFamily: "var(--font-body)", fontSize: "1.1rem" }}>
                {tone.loadingText}
              </span>
              <ScribbleDots light />
            </>
          ) : (
            tone.submitLabel
          )}
        </button>

        {/* Error */}
        {error && (
          <div className="sketch-error">
            <p
              style={{
                display: "flex",
                alignItems: isHaikuError ? "flex-start" : "center",
                gap: "0.45rem",
                margin: 0,
                color: "rgba(170,35,35,0.92)",
                fontSize: "1.05rem",
                fontFamily: "var(--font-body)",
                whiteSpace: isHaikuError ? "pre-line" : "normal",
              }}
            >
              <AlertTriangle
                size={16}
                strokeWidth={2}
                aria-hidden="true"
                style={{ flexShrink: 0, marginTop: isHaikuError ? "4px" : 0 }}
              />
              {tone.errors[error.code] ?? tone.errorFallback}
            </p>
          </div>
        )}
      </form>

      {/* ════════════ RESULT ════════════ */}
      {result ? (
        <div>
          <p className="result-label">{getTone(result.style).resultLabel}</p>
          <RoastCard result={result} />
        </div>
      ) : (
        <div className="placeholder">
          {loading ? (
            <>
              <span style={{ color: "var(--ink-faint)" }}><ScribbleDots /></span>
              <span className="placeholder-title">{tone.loadingTitle}</span>
            </>
          ) : (
            <>
              <span className="placeholder-title">{tone.placeholderTitle}</span>
              <span className="placeholder-hint">{tone.placeholderHint}</span>
            </>
          )}
        </div>
      )}
    </>
  );
}

// ─── GitHub mark (inline — lucide v1 dropped brand icons) ────
function GitHubMark() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.21.09 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.34-5.47-5.96 0-1.32.47-2.39 1.24-3.23-.13-.3-.54-1.53.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.25 2.88.12 3.18.77.84 1.24 1.91 1.24 3.23 0 4.63-2.81 5.65-5.49 5.95.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12 12 0 0 0 24 12.5C24 5.87 18.63.5 12 .5z" />
    </svg>
  );
}

// ─── Scribble dots ───────────────────────────────────────────
function ScribbleDots({ light = false }: { light?: boolean }) {
  return (
    <span
      style={{ display: "inline-flex", gap: "4px", alignItems: "center", color: light ? "#fff" : "inherit" }}
    >
      <span className="scribble-dot" />
      <span className="scribble-dot" />
      <span className="scribble-dot" />
    </span>
  );
}
