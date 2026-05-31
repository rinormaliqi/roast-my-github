<div align="center">

# 🔥 Roast My GitHub

**Type a GitHub username, pick a flavor, get destroyed.**

A web app that fetches anyone's public GitHub profile and roasts it with Claude —
in five distinct voices, rendered as a hand-drawn sketchbook page.

🌐 **Live:** https://roast-my-github-five.vercel.app/

`Next.js (App Router)` · `TypeScript` · `Tailwind CSS` · `Claude API` · `GitHub REST API`

</div>

---

## 📑 Contents

1. [What it does](#-what-it-does)
2. [Roast modes](#-roast-modes)
3. [Quick start](#-quick-start)
4. [Environment variables](#-environment-variables)
5. [Deployment](#-deployment)
6. [How it's built](#-how-its-built)
7. [Key design decisions](#-key-design-decisions)
8. [Known limitations](#-known-limitations)
9. [With more time](#-with-more-time)
10. [Prompts used](#-prompts-used-show-your-work)

---

## ✨ What it does

- **Roasts any public GitHub profile** — type a username, the app pulls the user's
  public profile + repos and feeds the highlights (top languages, star count, repo
  names, account age) to Claude for a sharp, *specific* roast.
- **Five distinct voices** — see [Roast modes](#-roast-modes) below. The selected
  voice flows through the **entire UI** — labels, the submit button, loading text,
  empty states, *and every error message* change with the mode.
- **Handles the unhappy paths gracefully** — missing/private/non-existent users,
  GitHub rate limits, network timeouts, and bad input all produce friendly,
  in-character messages instead of crashes.
- **Runs with zero API keys.** No `ANTHROPIC_API_KEY`? The app drops into
  **Demo Mode** and serves hand-written template roasts personalized with real
  profile data. No `GITHUB_TOKEN`? Unauthenticated GitHub access still works.

> [!NOTE]
> **Demo Mode is a feature, not a failure.** A fresh clone is fully usable with no
> setup at all — keys only upgrade it (live Claude roasts + a higher rate limit).

---

## 🎭 Roast modes

| Mode | Voice |
|---|---|
| 💼 **Corporate** | Passive-aggressive performance-review jargon. *"Per our Q3 talent review…"* |
| 🦅 **Shqiptarski** | A funny Kosovar friend roasting you in the group chat — café/macchiato culture, football, diaspora-cars, music & internet humor. Written in Albanian (Gheg/Kosovar). |
| 🌸 **Haiku** | Two 5-7-5 haikus of quiet devastation. |
| ✨ **Gen Z** | "no cap, lowkey brutal" chaotic lowercase. |
| 🎭 **Shakespearean** | Early Modern English with a Bard reference baked into the burn. |

Each mode has both a **live-AI prompt** and an **offline template set** (Demo Mode),
so the personality holds up with or without an API key. A few mode-aware touches:
Haiku error messages are themselves valid haikus; Shqiptarski speaks Albanian
end-to-end (button → *"DIGJE, BRE!"*, errors, the *"QAMETI!"* result stamp).

---

## 🚀 Quick start

**Prerequisites:** Node.js 18.18+ (tested on Node 20 & 23).

```bash
# 1. Clone
git clone https://github.com/rinormaliqi/roast-my-github.git
cd roast-my-github

# 2. Install
npm install

# 3. (Optional) add API keys — the app runs fine WITHOUT this step
cp .env.local.example .env.local      # then paste any keys you have

# 4. Run
npm run dev
```

Open **http://localhost:3000** and roast away.

> [!TIP]
> Skipping step 3 is completely fine — you'll get template roasts (Demo Mode).
> Add an `ANTHROPIC_API_KEY` whenever you want live Claude roasts.

---

## 🔑 Environment variables

All optional. Copy `.env.local.example` → `.env.local` and fill in what you have.

| Variable | What it does | Without it |
|---|---|---|
| `ANTHROPIC_API_KEY` | Enables live Claude-generated roasts. | Falls back to **Demo Mode** template roasts. |
| `GITHUB_TOKEN` | Raises the GitHub rate limit (60 → 5,000 req/hr). No scopes needed. | Unauthenticated access (60 req/hr) — fine for trying it out. |
| `ANTHROPIC_MODEL` | Override the Claude model. | Uses the built-in default; only set this if that snapshot is retired. |

🔗 Keys: [console.anthropic.com](https://console.anthropic.com) ·
[github.com/settings/tokens](https://github.com/settings/tokens)

---

## 🌐 Deployment

Deployed on **Vercel** → **https://roast-my-github-five.vercel.app/**

It's a standard Next.js app, so it deploys anywhere that runs Next (Vercel, Replit,
etc.). Just set the same environment variables in the host's secrets panel. On
Vercel: *Import the repo → add `ANTHROPIC_API_KEY` (and optionally `GITHUB_TOKEN`)
in Project Settings → Environment Variables → Deploy.*

---

## 🧱 How it's built

```
app/
  api/roast/route.ts   POST endpoint: validate → fetch GitHub → generate roast
  layout.tsx           Fonts + the SVG "rough" filter that wobbles every border
  page.tsx             Server component: red header + footer shell
  globals.css          The entire sketchbook design system
components/
  NotebookContent.tsx  Client component: owns state, renders the form + result
  RoastCard.tsx        The result card — stats, typewriter roast, "BOOM"-style stamp
hooks/
  useTypewriter.ts     Adaptive-speed "writes itself" effect (code-point safe)
lib/
  github.ts            GitHub API client — typed errors, timeouts, rate-limit handling
  roast.ts             Claude integration + automatic fallback to mock roasts
  mock-roast.ts        Offline template roasts (Demo Mode) for all 5 modes
  tone.ts              Single source of truth for all mode-specific UI copy
types/
  index.ts             Shared types (RoastStyle, RoastResponse, ApiError, ...)
```

**Request flow:** the browser POSTs `{ username, style }` → the route validates the
username (GitHub's rules) → fetches the user + repos **in parallel** → builds a
compact data summary → asks Claude for the roast (or generates a template roast in
Demo Mode) → returns the roast plus display name and repo/star stats for the card.

---

## 💡 Key design decisions

- **API routes, not a separate backend.** The Anthropic key never reaches the
  client; all GitHub + Claude calls run server-side in `app/api/roast/route.ts`.
- **Lazy Anthropic client.** The SDK is imported on demand so the app never crashes
  at startup when no key is set.
- **Layered fallback.** No key → template roast. Key present but the Claude call
  fails → caught and falls back to a template roast (with a console warning) instead
  of erroring the user.
- **One source of truth for voice.** `lib/tone.ts` holds every mode-specific
  string, so the form re-skins its language the instant you switch modes, while the
  result card keeps the voice of the roast it actually displayed.
- **Deterministic error handling.** GitHub failures are typed (`NOT_FOUND`,
  `RATE_LIMITED`, …) and mapped to proper HTTP codes; a missing user always reads as
  "not found" (never a confusing 502) even though the two GitHub calls race.
- **Roast length tuned for engagement.** Roasts aim for ~70–110 words — enough for a
  real punchline, short enough to stay funny. Poetic modes (haiku) keep their form.

---

## 🚧 Known limitations

- **Repo fetch is capped at 100** (one GitHub API page, most-recently-updated).
  Plenty for an accurate roast; the long tail of very prolific users isn't analyzed.
- **The typewriter is a post-hoc effect**, not real token streaming — the full roast
  is fetched, then "written out."

---

## 🔮 With more time

- **Caching** roasts per `(username, style)` so repeats are instant and don't re-burn quota.
- **Token streaming** so the typewriter reflects real generation.
- **Shareable roast cards** — OG image / "download as sticker."
- **Richer signal** — commit frequency, README quality, issue/PR ratios for sharper burns.
- **Rate-limit UX** — show remaining GitHub quota + reset countdown.
- **Tests** — unit tests for `github.ts` error mapping & `mock-roast.ts`, plus a Playwright happy-path.

---

## 📝 Prompts used (show your work)

The prompts I gave Claude Code, in order — pasted so you can see how the project was
actually driven, not just the result.

**1 · Scaffold & structure**
> We're developing "Roast My GitHub": a page where someone types a GitHub username
> and gets a friendly, accurate roast of their public repos. Must: fetch public
> repos via the GitHub API, generate the roast with an LLM, handle missing/private
> users gracefully, deploy with a public URL, let the user pick a roast style.
> Stack: Next.js (App Router) + TypeScript + Tailwind, using Next.js API routes
> instead of a separate backend. First, create a clean, organised folder structure.

**2 · Fallback logic & error handling**
> Work on fallback logic and error handling — anticipate many edge cases and make it
> deployment-ready and stable. It should also be easy to run after a fresh clone, so
> if `ANTHROPIC_API_KEY` or `GITHUB_TOKEN` aren't provided, fall back to a locally
> simulated / simplified mode so the project still runs without external dependencies.

**3 · Sketchbook design system**
> Design a hand-drawn, sketchbook aesthetic — like a chaotic pen-and-marker
> notebook. Rough hand-drawn borders, doodles/annotations, slight rotations, paper
> texture, handwritten fonts, underline-style buttons, torn-paper results, an AI
> roast that writes itself in real time, shake/scribble micro-interactions. Playful,
> sarcastic, informal.

**4 · Icons, two-page layout, readability**
> Remove emojis (they break the sketch vibe) and use an icon library that matches.
> Rework the layout to resemble an open two-page notebook, arranged in rows rather
> than one column, minimizing scrolling. Improve text readability while keeping the
> handwritten style.

**5 · Full-screen & responsive**
> Move back to a full-screen layout with no margins, and make all layouts fully
> responsive and adapt properly to smaller screens.

**6 · Swap Pirate → Shqiptarski + shorter roasts**
> Remove the "pirate" mode and add a "Shqiptarski" mode — a roast in Albanian for an
> Albanian audience. Also keep all roasts a bit shorter so readers stay engaged.

**7 · Mode-consistent tone everywhere**
> All messages, errors, and notices should stay in the selected mode's humorous,
> roast-style tone throughout the experience.

**8 · Final review pass**
> Now that you know the requirements, run a last check across all files for misses,
> typos, hidden errors, wrong logic, anything forgotten.
> *(→ fixed a missing-user race, an empty-repo edge case, an emoji typewriter glitch,
> a typo, plus added a configurable `ANTHROPIC_MODEL` and documented limits.)*

**9 · Red-header redesign**
> *(Shared fresh design mockups.)* Replicate these new features — the big red
> header and the rest: single-column centered layout, filled flavor chips, a dark
> "sticker" submit button, and a result card with repo/star stats + a "BOOM" stamp.

**10 · Roast flexibility + Albanian polish**
> Give the roasts a bit more flexibility than the current length constraints, and fix
> the Shqiptarski mode — the words and grammar sometimes aren't translated well.

**11 · Kosovo-flavored humor + this README**
> Make the Shqiptarski mode more Kosovo-oriented — lean into current Albanian/Kosovar
> trends, internet culture, everyday life, football, diaspora jokes, café culture and
> relatable local humor rather than history; it should feel like a funny Albanian
> friend, not a history teacher. Then reorganize the README into a clean, easy-to-scan
> structure covering goals, setup, modes, env vars, deployment and design decisions.

---

<div align="center">

*Roasts are satire, not facts. No developers were permanently harmed.* 🔥

</div>
