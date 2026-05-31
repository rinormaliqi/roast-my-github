"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { RoastResponse } from "@/types";
import { getTone } from "@/lib/tone";
import { useTypewriter } from "@/hooks/useTypewriter";

export default function RoastCard({ result }: { result: RoastResponse }) {
  const { displayed, isDone } = useTypewriter(result.roast);
  const [copied, setCopied]   = useState(false);

  // Tone derived from the result's own style so the card stays self-consistent.
  const tone = getTone(result.style);
  const displayName = result.name?.trim() || result.username;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(result.roast);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch { /* clipboard blocked */ }
  }

  return (
    <div className="result-card">
      {/* mode-flavored marker scribble */}
      <span className="boom" aria-hidden="true">{tone.exclaim}</span>

      {/* Header: identity + stats */}
      <div className="card-head">
        <div className="card-id">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={result.avatarUrl}
            alt={`${result.username}'s avatar`}
            className="sketch-avatar"
          />
          <div>
            <div className="card-name">{displayName}</div>
            <div className="card-handle">@{result.username}</div>
          </div>
        </div>

        <div className="card-stats">
          <div>Repos: {result.publicRepos.toLocaleString()}</div>
          <div>Stars: {result.totalStars.toLocaleString()}</div>
        </div>
      </div>

      <hr className="dashed-divider" />

      {/* Roast */}
      <blockquote className={`roast-text${isDone ? "" : " typing-cursor"}`}>
        {displayed}
      </blockquote>

      {/* Footer */}
      <div className="card-foot">
        {result.isDemoMode ? (
          <span className="demo-badge" title="ANTHROPIC_API_KEY not set — template roast">
            {tone.demoLabel}
          </span>
        ) : (
          <span />
        )}

        <button onClick={handleCopy} disabled={!isDone} className="copy-btn">
          {copied ? (
            <><Check size={14} strokeWidth={2.5} aria-hidden="true" /> {tone.copiedLabel}</>
          ) : (
            <><Copy size={14} strokeWidth={1.8} aria-hidden="true" /> {tone.copyLabel}</>
          )}
        </button>
      </div>

      {/* Demo tip */}
      {result.isDemoMode && (
        <p className="margin-note" style={{ marginTop: "0.6rem", fontSize: "0.82rem" }}>
          {tone.demoNote}
        </p>
      )}
    </div>
  );
}
