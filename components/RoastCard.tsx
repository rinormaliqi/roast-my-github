"use client";

import { useState } from "react";
import { Copy, Check, Briefcase, Mountain, Feather, Zap, BookOpen } from "lucide-react";
import { RoastResponse } from "@/types";
import { getTone } from "@/lib/tone";
import { useTypewriter } from "@/hooks/useTypewriter";

const STYLE_META: Record<string, { label: string; Icon: React.ElementType }> = {
  corporate:     { label: "corporate speak", Icon: Briefcase },
  shqiptarski:   { label: "shqiptarski",     Icon: Mountain  },
  haiku:         { label: "haiku",           Icon: Feather   },
  "gen-z":       { label: "gen z",           Icon: Zap       },
  shakespearean: { label: "shakespearean",   Icon: BookOpen  },
};

export default function RoastCard({ result }: { result: RoastResponse }) {
  const { displayed, isDone } = useTypewriter(result.roast);
  const [copied, setCopied]   = useState(false);

  // Tone derived from the result's own style — stays self-consistent
  // even if the user switches the selector after receiving this result.
  const tone      = getTone(result.style);
  const meta      = STYLE_META[result.style] ?? { label: result.style, Icon: Feather };
  const StyleIcon = meta.Icon;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(result.roast);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch { /* clipboard blocked */ }
  }

  return (
    <div className="result-card torn-top">
      <div style={{ padding: "1.1rem 1.3rem 1.1rem" }}>

        {/* ── Card header: avatar + username + style ── */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "0.6rem",
            marginBottom: "0.9rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={result.avatarUrl}
              alt={`${result.username}'s avatar`}
              className="sketch-avatar"
              style={{ width: 44, height: 44, objectFit: "cover" }}
            />
            <div>
              <p
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "1.1rem",
                  color: "var(--ink)",
                  margin: 0,
                  lineHeight: 1.1,
                }}
              >
                @{result.username}
              </p>
              <p
                className="margin-note"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.3rem",
                  margin: "3px 0 0",
                  transform: "rotate(-0.6deg)",
                  fontSize: "0.88rem",
                }}
              >
                <StyleIcon size={12} strokeWidth={1.5} aria-hidden="true" />
                {meta.label}
              </p>
            </div>
          </div>

          {/* Demo mode badge — label is tone-aware */}
          {result.isDemoMode && (
            <span
              className="demo-badge"
              title="ANTHROPIC_API_KEY not set — template roast"
              style={{ marginTop: "2px", flexShrink: 0 }}
            >
              {tone.demoLabel}
            </span>
          )}
        </div>

        {/* ── Roast text with typewriter ── */}
        <div
          style={{
            borderLeft: "2.5px solid var(--ink)",
            paddingLeft: "0.9rem",
            marginBottom: "0.9rem",
            filter: "url(#rough)",
          }}
        >
          <blockquote className={`roast-text${isDone ? "" : " typing-cursor"}`}>
            {displayed}
          </blockquote>
        </div>

        <hr className="sketch-rule" style={{ marginBottom: "0.7rem" }} />

        {/* ── Footer ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "0.4rem",
          }}
        >
          <button
            onClick={handleCopy}
            disabled={!isDone}
            className="trace-underline"
            style={{ opacity: isDone ? 1 : 0.3, fontSize: "0.95rem" }}
          >
            {copied
              ? <><Check size={13} strokeWidth={2.5} aria-hidden="true" /> {tone.copiedLabel}</>
              : <><Copy size={13} strokeWidth={1.8} aria-hidden="true" /> {tone.copyLabel}</>
            }
          </button>

          {result.isDemoMode && (
            <span
              className="margin-note"
              style={{ fontSize: "0.78rem", transform: "rotate(0.6deg)" }}
            >
              {tone.demoNote}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
