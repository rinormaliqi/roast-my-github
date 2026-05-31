"use client";

import { useState } from "react";
import { RoastResponse } from "@/types";

const STYLE_LABELS: Record<string, string> = {
  corporate: "💼 Corporate Speak",
  pirate: "🏴‍☠️ Pirate Mode",
  haiku: "🌸 Haiku",
  "gen-z": "✨ Gen Z",
  shakespearean: "🎭 Shakespearean",
};

export default function RoastCard({ result }: { result: RoastResponse }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(result.roast);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access denied — silently ignore
    }
  }

  return (
    <div className="rounded-xl border border-zinc-700 bg-zinc-800/60 p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <img
            src={result.avatarUrl}
            alt={`${result.username}'s avatar`}
            className="w-12 h-12 rounded-full border border-zinc-600"
          />
          <div>
            <p className="font-semibold text-white">@{result.username}</p>
            <p className="text-xs text-zinc-400">{STYLE_LABELS[result.style]}</p>
          </div>
        </div>

        {/* Demo mode badge */}
        {result.isDemoMode && (
          <span
            title="ANTHROPIC_API_KEY not set — showing a template roast"
            className="shrink-0 text-xs px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-medium"
          >
            Demo Mode
          </span>
        )}
      </div>

      {/* Roast text */}
      <blockquote className="text-zinc-200 leading-relaxed whitespace-pre-wrap border-l-2 border-orange-500 pl-4">
        {result.roast}
      </blockquote>

      {/* Footer row */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={handleCopy}
          className="text-xs text-zinc-400 hover:text-orange-400 transition-colors"
        >
          {copied ? "✓ Copied!" : "Copy roast"}
        </button>

        {result.isDemoMode && (
          <p className="text-xs text-zinc-600">
            Add <code className="text-zinc-500">ANTHROPIC_API_KEY</code> for AI-generated roasts
          </p>
        )}
      </div>
    </div>
  );
}
