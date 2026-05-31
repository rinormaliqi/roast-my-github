"use client";

import { useState } from "react";
import { RoastStyle, RoastResponse, ApiError } from "@/types";
import RoastCard from "./RoastCard";

const STYLES: { value: RoastStyle; label: string; emoji: string }[] = [
  { value: "corporate", label: "Corporate", emoji: "💼" },
  { value: "pirate", label: "Pirate", emoji: "🏴‍☠️" },
  { value: "haiku", label: "Haiku", emoji: "🌸" },
  { value: "gen-z", label: "Gen Z", emoji: "✨" },
  { value: "shakespearean", label: "Shakespearean", emoji: "🎭" },
];

// Map API error codes to user-friendly context hints
const ERROR_HINTS: Record<string, string> = {
  USER_NOT_FOUND: "Double-check the spelling — GitHub usernames are case-insensitive but must exist.",
  RATE_LIMITED: "You can add a GITHUB_TOKEN in .env.local to get 5 000 requests/hr.",
  INVALID_USERNAME: "GitHub usernames use letters, numbers, and hyphens only (max 39 chars).",
  UPSTREAM_ERROR: "This is likely a temporary issue — please try again in a moment.",
};

export default function RoastForm() {
  const [username, setUsername] = useState("");
  const [style, setStyle] = useState<RoastStyle>("gen-z");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RoastResponse | null>(null);
  const [error, setError] = useState<ApiError | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!username.trim() || loading) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/roast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), style }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data as ApiError);
      } else {
        setResult(data as RoastResponse);
      }
    } catch {
      setError({ error: "Could not reach the server. Check your connection.", code: "UPSTREAM_ERROR" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-xl mx-auto space-y-8">
      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Username input */}
        <div className="space-y-1">
          <label htmlFor="username" className="block text-sm font-medium text-zinc-300">
            GitHub Username
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
            className="w-full px-4 py-2.5 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
            disabled={loading}
          />
        </div>

        {/* Style selector */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-zinc-300">Roast Style</p>
          <div className="grid grid-cols-5 gap-2">
            {STYLES.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => setStyle(s.value)}
                className={`flex flex-col items-center gap-1 py-2.5 px-1 rounded-lg border text-xs font-medium transition-all ${
                  style === s.value
                    ? "border-orange-500 bg-orange-500/10 text-orange-400"
                    : "border-zinc-700 bg-zinc-800 text-zinc-400 hover:border-zinc-500"
                }`}
                disabled={loading}
              >
                <span className="text-lg">{s.emoji}</span>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || !username.trim()}
          className="w-full py-3 px-6 rounded-lg bg-orange-500 hover:bg-orange-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition-colors"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <LoadingSpinner /> Roasting...
            </span>
          ) : (
            "🔥 Roast Me"
          )}
        </button>
      </form>

      {/* Error */}
      {error && (
        <div className="p-4 rounded-lg bg-red-900/30 border border-red-700 space-y-1">
          <p className="text-red-300 text-sm font-medium">{error.error}</p>
          {ERROR_HINTS[error.code] && (
            <p className="text-red-400/70 text-xs">{ERROR_HINTS[error.code]}</p>
          )}
        </div>
      )}

      {/* Result */}
      {result && <RoastCard result={result} />}
    </div>
  );
}

function LoadingSpinner() {
  return (
    <svg
      className="animate-spin h-4 w-4 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
}
