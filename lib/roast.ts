import { GitHubRepo, GitHubUser, RoastStyle } from "@/types";
import { generateMockRoast } from "@/lib/mock-roast";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Returns true only when the key is present and non-empty at call time. */
export function isAIEnabled(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY?.trim());
}

/**
 * The Claude model to use. Overridable via ANTHROPIC_MODEL so a stale default
 * can be swapped without code changes (e.g. if this snapshot is retired).
 */
const DEFAULT_MODEL = "claude-haiku-4-5-20251001";
function getModel(): string {
  return process.env.ANTHROPIC_MODEL?.trim() || DEFAULT_MODEL;
}

const STYLE_PROMPTS: Record<RoastStyle, string> = {
  corporate:
    "You are a passive-aggressive corporate consultant who speaks exclusively in business jargon. Deliver the roast as dry, bullet-point-free meeting feedback.",
  shqiptarski:
    "Ti je një shok kosovar gazmor që bën roast në shqip, në dialektin gegë/kosovar. Shkruaj sikur po e tall shokun në grup-chat: natyrshëm, me humor, e gramatikisht në rregull — MOS përkthe fjalë për fjalë nga anglishtja. Përdor referenca aktuale e të përditshme: makiato te kafja, futbolli (Kombëtarja, Xhaka, shqiponja me dy krena), diaspora që kthehet në gusht me targa zvicerane/gjermane, dasmat, muzika (tallava, rep shqip, Dua Lipa, Rita Ora), e slang kosovar ('valla', 'qysh je', 'mor', 'bre', 'spo', 'najsen', 'veç'). SHMANG referencat historike (Kanuni, besa, bunkerë, perandori, Skënderbe). Termat teknikë (GitHub, repo, commit, code review, README) lëri siç janë. Ji therës por mik — si shoku që të qesh edhe të kall, jo si mësues historie.",
  haiku:
    "You respond only in haiku format (5-7-5 syllables). Write exactly 2 haikus that together form a complete roast. Nothing else.",
  "gen-z":
    "You are a Gen-Z roaster. Use current slang (no cap, lowkey, it's giving, slay, bussin, fr fr). Keep it chaotic, specific, and punchy.",
  shakespearean:
    "Thou art a Shakespearean scholar. Roast in Early Modern English with dramatic flair. Reference one Shakespeare play or quote in the burn.",
};

export function buildUserSummary(user: GitHubUser, repos: GitHubRepo[]): string {
  const languages = repos
    .map((r) => r.language)
    .filter(Boolean)
    .reduce<Record<string, number>>((acc, lang) => {
      acc[lang!] = (acc[lang!] ?? 0) + 1;
      return acc;
    }, {});

  const topLangs = Object.entries(languages)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([lang, count]) => `${lang} (${count} repos)`);

  const totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0);
  const repoNames = repos.slice(0, 10).map((r) => r.name);
  // Repos are sorted by `updated` desc, so the last one is least-recently-touched.
  const leastRecentRepo = repos.at(-1);
  // Guard against [] — [].every() is true, which would wrongly claim a
  // zero-repo user has "only forks".
  const allForks = repos.length > 0 && repos.every((r) => r.fork);

  return `
GitHub username: ${user.login}
Name: ${user.name ?? "No name set"}
Bio: ${user.bio ?? "No bio"}
Public repos: ${user.public_repos}
Followers: ${user.followers} | Following: ${user.following}
Total stars: ${totalStars}
Account created: ${new Date(user.created_at).getFullYear()}
Top languages: ${topLangs.length ? topLangs.join(", ") : "None detected"}
Recent repo names: ${repoNames.length ? repoNames.join(", ") : "none"}
Least recently updated repo: ${leastRecentRepo?.name ?? "N/A"} (${leastRecentRepo?.language ?? "unknown language"})
${allForks ? "Note: all visible repos are forks — no original work found." : ""}
`.trim();
}

// ---------------------------------------------------------------------------
// Claude roast (lazy client to avoid crashing on missing key at import time)
// ---------------------------------------------------------------------------
async function generateAIRoast(
  user: GitHubUser,
  repos: GitHubRepo[],
  style: RoastStyle
): Promise<string> {
  // Dynamic import so the module doesn't blow up when there's no API key
  const Anthropic = (await import("@anthropic-ai/sdk")).default;
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const summary = buildUserSummary(user, repos);
  const message = await client.messages.create({
    model: getModel(),
    max_tokens: 420,
    system: `${STYLE_PROMPTS[style]}\n\nYou roast GitHub profiles based on their public data. Be witty, specific, and funny — but never hateful. Aim for roughly 70–110 words with a strong, specific punchline; you have room to breathe, just don't ramble. (Poetic styles like haiku follow their own form regardless of this length.)`,
    messages: [{ role: "user", content: `Roast this GitHub profile:\n\n${summary}` }],
  });

  const block = message.content[0];
  if (block.type !== "text") throw new Error("Unexpected Claude response type.");
  return block.text;
}

// ---------------------------------------------------------------------------
// Public entry point — auto-falls back to mock on any AI failure
// ---------------------------------------------------------------------------
export async function generateRoast(
  user: GitHubUser,
  repos: GitHubRepo[],
  style: RoastStyle
): Promise<{ roast: string; isDemoMode: boolean }> {
  if (!isAIEnabled()) {
    return { roast: generateMockRoast(user, repos, style), isDemoMode: true };
  }

  try {
    const roast = await generateAIRoast(user, repos, style);
    return { roast, isDemoMode: false };
  } catch (err) {
    console.warn(
      "[roast] Claude API call failed; falling back to mock roast.",
      err instanceof Error ? err.message : err
    );
    return { roast: generateMockRoast(user, repos, style), isDemoMode: true };
  }
}
