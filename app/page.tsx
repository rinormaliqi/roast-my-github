import NotebookContent from "@/components/NotebookContent";

export default function Home() {
  return (
    <main className="page">
      {/* ── Header ── */}
      <header className="app-header">
        <h1 className="app-title">Roast My GitHub</h1>
        <div className="title-underline" aria-hidden="true" />
        <p className="app-subtitle">Enter a username. Pick a flavor. Get destroyed.</p>
      </header>

      {/* ── Form + result (client) ── */}
      <NotebookContent />

      {/* ── Footer ── */}
      <footer className="app-footer">
        <span style={{ borderBottom: "1px solid var(--ink-ghost)" }}>
          powered by GitHub API + Claude
        </span>
        <span className="margin-note">roasts are satire, not facts</span>
      </footer>
    </main>
  );
}
