/**
 * Offline roast generator — used when ANTHROPIC_API_KEY is not configured.
 *
 * Each style has several template "slots" that are filled with real data from
 * the user's GitHub profile so the output still feels personalised.
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

// Pick a repo name that sounds funny or noteworthy; fall back to a generic one
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

  const templates = [
    `Per our Q${new Date().getMonth() < 6 ? 1 : 3} talent review, @${user.login}'s GitHub portfolio is ` +
      `strategically leveraging ${lang} to disrupt the "zero-star ecosystem." ` +
      `With ${stars} stars accumulated over ${age} years, we feel there's significant runway for ` +
      `low-hanging-fruit optimisation. "${repo}" shows outside-the-box thinking, ` +
      `albeit still very much inside-the-box execution. Let's circle back offline.`,

    `After a deep-dive synergy assessment, we've identified that @${user.login} is proactively ` +
      `failing to move the needle on ${lang} innovation. The ${repoCount(repos)}-repo portfolio ` +
      `represents a best-in-class example of boiling the ocean while delivering ` +
      `${stars} stars of ROI over ${age} fiscal years. We'll need to re-platform the ` +
      `value proposition of "${repo}" before our next all-hands.`,

    `Action item: @${user.login}'s core competency in ${lang} is not yet market-ready. ` +
      `With ${repoCount(repos)} repos and only ${stars} total stars, the engagement KPIs are ` +
      `frankly not moving the puck forward. "${repo}" is a lighthouse project in ` +
      `the sense that everyone can see it, but nobody sails toward it. ` +
      `We recommend a paradigm pivot and a robust ideation sprint ASAP.`,
  ];

  return pick(templates);
}

function roastPirate(user: GitHubUser, repos: GitHubRepo[]): string {
  const lang = topLanguage(repos);
  const stars = totalStars(repos);
  const repo = notableRepo(repos);
  const age = accountAge(user.created_at);

  const templates = [
    `Arrr, shiver me timbers! @${user.login} has been sailin' the ${lang} seas for ${age} years ` +
      `and all they've plundered is ${stars} measly stars! I've seen more treasure in Davy Jones' ` +
      `locker than in "${repo}"! Even the kraken refuses to drag this code to the depths ` +
      `— out of professional respect for its own mediocrity. Walk the plank, ye scallywag!`,

    `Blimey! ${age} years at sea and @${user.login}'s finest loot is ${repoCount(repos)} repos ` +
      `written in ${lang}? With ${stars} stars, even the cursed crew of the Black Pearl ` +
      `wouldn't touch "${repo}" with a ten-foot oar! Yo ho ho and a bottle of ` +
      `Stack Overflow — because that's where all this code came from, arrr!`,

    `Avast, ye bilge rat! @${user.login} calls themselves a ${lang} buccaneer but their ` +
      `${repoCount(repos)} repos have earned only ${stars} stars in ${age} years! ` +
      `"${repo}" be so bare it makes the Bermuda Triangle look well-documented. ` +
      `I'd make ye walk the plank but I fear ye'd find a way to push broken commits ` +
      `from the bottom of the ocean! Arrr!`,
  ];

  return pick(templates);
}

function roastHaiku(user: GitHubUser, repos: GitHubRepo[]): string {
  const lang = topLanguage(repos);
  const stars = totalStars(repos);
  const repo = notableRepo(repos);

  // Each item is a 5-7-5 haiku. We compose three thematically.
  const openings = [
    `${lang} code appears`, // 5
    `Empty commit log`,     // 5
    `Zero stars tonight`,   // 5
  ];
  const middles = [
    `${stars} stars, like autumn leaves fall`, // 7
    `${repoCount(repos)} repos, none complete`,  // 7 (approx)
    `"${repo}" sits alone`,                     // 7 (approx)
  ];
  const closings = [
    `npm install`,   // 5
    `README is blank`,// 5
    `Ship it anyway`, // 5
  ];

  return (
    `${pick(openings)}\n` +
    `${pick(middles)}\n` +
    `${pick(closings)}\n\n` +
    `—\n\n` +
    `@${user.login} writes code\n` +
    `${lang} fills the void within\n` +
    `No one stars the moon\n\n` +
    `—\n\n` +
    `${stars} stars earned with pride\n` +
    `"${repo}" sleeps in the dark\n` +
    `git push origin shame`
  );
}

function roastGenZ(user: GitHubUser, repos: GitHubRepo[]): string {
  const lang = topLanguage(repos);
  const stars = totalStars(repos);
  const repo = notableRepo(repos);
  const age = accountAge(user.created_at);

  const templates = [
    `bestie… @${user.login} has been on github for ${age} YEARS and only has ${stars} stars?? ` +
      `no cap that "${repo}" repo is giving "started a tutorial and rage-quit" energy. ` +
      `coding in ${lang} for ${repoCount(repos)} repos and not a single one slaps? ` +
      `lowkey iconic in a very cringe way ngl. the audacity is immaculate fr fr 💀`,

    `okay so @${user.login}'s entire github is giving main character energy but like… ` +
      `in a fanfiction that nobody asked for. ${repoCount(repos)} repos of ${lang} and ` +
      `${stars} stars total?? bestie that's not bussin, that's a cry for help. ` +
      `"${repo}" is literally a flop era and I'm here for the villain arc. ` +
      `slay I guess? but make it git blame 💅`,

    `no fr why does @${user.login}'s github look like it's stuck in its flop era?? ` +
      `${age} years of ${lang} and "${repo}" is the magnum opus?? it's giving participation trophy. ` +
      `${stars} stars is not the flex you think it is, bestie. the README said "coming soon" ` +
      `${age} years ago and honestly that's the most honest commit message I've ever seen 😭`,
  ];

  return pick(templates);
}

function roastShakespearean(user: GitHubUser, repos: GitHubRepo[]): string {
  const lang = topLanguage(repos);
  const stars = totalStars(repos);
  const repo = notableRepo(repos);
  const age = accountAge(user.created_at);

  const templates = [
    `Hark! What manner of coder is this @${user.login}, who hath laboured ${age} long years ` +
      `in the accursed tongue of ${lang}, yet garnered but ${stars} stars from a cold and ` +
      `indifferent universe? "${repo}" doth stand as testament to ambition most foul, ` +
      `a monument to commits half-made and READMEs left desolate. ` +
      `Methinks thy git history reveals a soul in perpetual rebase!`,

    `O @${user.login}! Thou art the Romeo of repositories — full of passion, ` +
      `yet thy ${lang} code doth perish before the second act! ` +
      `${repoCount(repos)} repos and merely ${stars} stars? ` +
      `Even the witches of Macbeth would not touch "${repo}" with a double-double toil. ` +
      `To ship or not to ship — that is the question thou hast avoided for ${age} years!`,

    `All the world's a staging environment, and @${user.login} merely a deployer. ` +
      `In ${age} years of ${lang} penmanship, thou hast writ ${repoCount(repos)} tomes ` +
      `and earned ${stars} stars — the very currency of digital insignificance! ` +
      `"${repo}" is thy magnum opus, a thing of such bewildering plainness ` +
      `that even the Globe Theatre would reject it as too tragic. Exit, pursued by a linter!`,
  ];

  return pick(templates);
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
    case "corporate":
      return roastCorporate(user, repos);
    case "pirate":
      return roastPirate(user, repos);
    case "haiku":
      return roastHaiku(user, repos);
    case "gen-z":
      return roastGenZ(user, repos);
    case "shakespearean":
      return roastShakespearean(user, repos);
  }
}
