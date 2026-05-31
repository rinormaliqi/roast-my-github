/**
 * Offline roast generator — used when ANTHROPIC_API_KEY is not configured.
 * All templates target ~60-80 words to match the AI word budget.
 */

import { GitHubRepo, GitHubUser, RoastStyle } from "@/types";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function topLanguage(repos: GitHubRepo[]): string {
  const counts: Record<string, number> = {};
  for (const r of repos) {
    if (r.language) counts[r.language] = (counts[r.language] ?? 0) + 1;
  }
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  return sorted[0]?.[0] ?? "mystery language";
}

function totalStars(repos: GitHubRepo[]): number {
  return repos.reduce((s, r) => s + r.stargazers_count, 0);
}

function accountAge(createdAt: string): number {
  return new Date().getFullYear() - new Date(createdAt).getFullYear();
}

function repoCount(repos: GitHubRepo[]): number {
  return repos.length;
}

function notableRepo(repos: GitHubRepo[]): string {
  return repos[0]?.name ?? "unnamed-project";
}

// ---------------------------------------------------------------------------
// Style generators
// ---------------------------------------------------------------------------

function roastCorporate(user: GitHubUser, repos: GitHubRepo[]): string {
  const lang = topLanguage(repos);
  const stars = totalStars(repos);
  const age = accountAge(user.created_at);
  const repo = notableRepo(repos);

  return pick([
    `Per our Q${new Date().getMonth() < 6 ? 1 : 3} talent review, @${user.login}'s ${lang} portfolio is failing to move the needle. ${stars} stars over ${age} years is not the ROI we aligned on. "${repo}" is a lighthouse project — visible to all, sailed toward by none. We'll need to circle back on this value proposition.`,

    `Following a synergy deep-dive, we've identified that @${user.login}'s ${repoCount(repos)}-repo ${lang} footprint delivers suboptimal stakeholder engagement (${stars} stars, ${age} fiscal years). "${repo}" shows outside-the-box thinking, albeit still very much inside-the-box execution. Recommend an urgent ideation sprint and a paradigm pivot.`,

    `Action item: @${user.login}'s core ${lang} competency is not yet market-ready. ${stars} total stars across ${repoCount(repos)} repos represents negative brand equity. "${repo}" is a bold vision — we just need someone else to build it. Let's schedule an alignment call to unpack the learnings.`,
  ]);
}

function roastShqiptarski(user: GitHubUser, repos: GitHubRepo[]): string {
  const lang = topLanguage(repos);
  const stars = totalStars(repos);
  const age = accountAge(user.created_at);
  const repo = notableRepo(repos);

  return pick([
    `Bre @${user.login}, ${age} vjet në GitHub dhe vetëm ${stars} yje?! Shqiptarët kanë ndërtuar shtëpi me duar bosh në male — ti s'ke mbaruar as README-në e "${repo}". ${repoCount(repos)} repo në ${lang} dhe asnjë s'ka bërë nam. Turp, o burrë. Edhe bunkerët e Enver Hoxhës kishin më shumë vizitorë.`,

    `O bir, çfarë është kjo gjendje?! @${user.login} ka ${repoCount(repos)} repo në ${lang}, ${stars} yje gjithsej, dhe "${repo}" gjysmë i braktisur prej ${age} vjetësh. Shqipëria ka rezistuar perandori — por kodi yt s'ka rezistuar as një code review. Hajde, merr një kafe, mblidh veten, dhe fillo nga e para me nder.`,

    `@${user.login}, besa e programerit është të commit-osh — ti e ke thyer ${age} vjet radhazi. ${stars} yje, ${repoCount(repos)} repo në ${lang}, dhe "${repo}" duket si projekt i Kanunit: shumë rregulla, zero implementim. Shqiptarët janë të fortë — por GitHub-i yt është i dobët si sinjali WiFi në Shkodër.`,
  ]);
}

function roastHaiku(user: GitHubUser, repos: GitHubRepo[]): string {
  const lang = topLanguage(repos);
  const stars = totalStars(repos);
  const repo = notableRepo(repos);

  // Two haikus (5-7-5 each), separated by a dash — matches the tighter format
  const haiku1Lines = [
    [`${lang} code at rest`,   `Empty commit history`,  `npm install`   ],
    [`Zero stars tonight`,     `${repoCount(repos)} repos, none complete`, `README is blank`],
    [`Code left on the shelf`, `${lang} waits in silence`,  `Ship it anyway`],
  ];

  const haiku2Lines = [
    [`${stars} stars, that's all`,    `"${repo}" sleeps in the dark`, `git push origin shame`],
    [`@${user.login} codes alone`,    `${lang} fills the empty void`,  `No one stars the moon` ],
    [`Years pass, repos grow`,        `Still no one forks the project`, `Only tumbleweeds`      ],
  ];

  const [h1, h2] = [pick(haiku1Lines), pick(haiku2Lines)];
  return `${h1[0]}\n${h1[1]}\n${h1[2]}\n\n—\n\n${h2[0]}\n${h2[1]}\n${h2[2]}`;
}

function roastGenZ(user: GitHubUser, repos: GitHubRepo[]): string {
  const lang = topLanguage(repos);
  const stars = totalStars(repos);
  const repo = notableRepo(repos);
  const age = accountAge(user.created_at);

  return pick([
    `bestie @${user.login} has been on github ${age} YEARS and "${repo}" is the magnum opus?? ${stars} stars in ${lang} is not the flex you think it is. it's giving participation trophy era. lowkey iconic in a very cringe way ngl 💀`,

    `no cap @${user.login}'s entire github is giving "started a tutorial and rage-quit" energy. ${repoCount(repos)} repos of ${lang}, ${stars} stars total — bestie that's not bussin, that's a cry for help. "${repo}" is literally a flop era and I'm here for the villain arc 💅`,

    `fr fr why does @${user.login}'s github look stuck in its flop era?? ${age} years, ${lang}, and "${repo}" is THE portfolio piece?? ${stars} stars is not it, chief. the README said "coming soon" and honestly that's the most honest commit in the whole repo 😭`,
  ]);
}

function roastShakespearean(user: GitHubUser, repos: GitHubRepo[]): string {
  const lang = topLanguage(repos);
  const stars = totalStars(repos);
  const repo = notableRepo(repos);
  const age = accountAge(user.created_at);

  return pick([
    `Hark! @${user.login} hath toiled ${age} long years in the tongue of ${lang}, yet garnered but ${stars} stars from a cold and indifferent universe. "${repo}" stands as monument to commits half-made and READMEs most desolate. As the Bard sayeth: "To ship or not to ship" — thou hast answered with silence.`,

    `O @${user.login}, thou art the Hamlet of repositories — full of soliloquy, void of deployment! ${repoCount(repos)} ${lang} repos and merely ${stars} stars? Even the witches of Macbeth wouldst not touch "${repo}" with a double-double toil. ${age} years of indecision, and still no production branch. Exit, pursued by a linter!`,

    `All the world's a staging environment, and @${user.login} merely a deployer who never deploys. In ${age} years of ${lang} penmanship, thou hast earned ${stars} stars — the very currency of digital insignificance. "${repo}" is thy magnum opus, rejected even by the Globe Theatre for being too unfinished.`,
  ]);
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------
export function generateMockRoast(
  user: GitHubUser,
  repos: GitHubRepo[],
  style: RoastStyle
): string {
  switch (style) {
    case "corporate":     return roastCorporate(user, repos);
    case "shqiptarski":   return roastShqiptarski(user, repos);
    case "haiku":         return roastHaiku(user, repos);
    case "gen-z":         return roastGenZ(user, repos);
    case "shakespearean": return roastShakespearean(user, repos);
  }
}
