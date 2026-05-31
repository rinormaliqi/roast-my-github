import { Flame } from "lucide-react";
import NotebookContent from "@/components/NotebookContent";

export default function Home() {
  return (
    <div className="notebook">

      {/* ── Full-width header ── */}
      <header className="nb-header">
        <div className="nb-title">
          <Flame size={28} strokeWidth={1.6} aria-hidden="true" />
          <h1>Roast My GitHub</h1>
        </div>

        <p className="nb-subtitle">
          type a username — get a data-accurate,<br />
          devastatingly funny roast
        </p>

        {/* margin note in top-right of header — hidden on mobile via CSS */}
        <span
          className="margin-note nb-header-annotation"
          style={{
            position: "absolute",
            right: "1.4rem",
            top: "0.5rem",
            fontSize: "0.82rem",
            transform: "rotate(1.5deg)",
          }}
          aria-hidden="true"
        >
          * may cause existential crises
        </span>
      </header>

      {/* ── Two notebook pages (state lives here, server renders shell) ── */}
      <NotebookContent />

      {/* ── Full-width footer ── */}
      <footer className="nb-footer">
        <span style={{ borderBottom: "1px solid var(--ink-ghost)" }}>
          powered by GitHub API + Claude
        </span>
        <span className="margin-note" style={{ transform: "rotate(-0.6deg)" }}>
          roasts are satire, not facts
        </span>
      </footer>
    </div>
  );
}
