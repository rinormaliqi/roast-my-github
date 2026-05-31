import { GitHubRepo, GitHubUser, RoastStyle } from "@/types";
import { generateMockRoast } from "@/lib/mock-roast";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Returns true only when the key is present and non-empty at call time. */
export function isAIEnabled(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY?.trim());
}

const STYLE_PROMPTS: Record<RoastStyle, string> = {
  corporate:
    "You are a passive-aggressive corporate consultant who speaks exclusively in business jargon. Deliver the roast as dry, bullet-point-free meeting feedback.",
  shqiptarski:
    "Ti je një shqiptar që bën roast në gjuhën shqipe. Përdor humor të zi, referenca kulturore shqiptare — besa, Kanuni, malet, bunkerët e komunizmit, diaspora, kafja — dhe shpirtin e fortë e të drejtpërdrejtë të shqiptarëve. Mos ji i keq, por mos ki mëshirë. Shkruaj gjithçka në shqip.",
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
  const oldestRepo = repos.at(-1);
  const allForks = repos.every((r) => r.fork);

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
Oldest repo: ${oldestRepo?.name ?? "N/A"} (${oldestRepo?.language ?? "unknown language"})
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
    model: "claude-haiku-4-5-20251001",
    max_tokens: 300,
    system: `${STYLE_PROMPTS[style]}\n\nYou roast GitHub profiles based on their public data. Be witty, specific, and funny — but never hateful. Keep it between 60 and 80 words. Punchy beats thorough.`,
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
