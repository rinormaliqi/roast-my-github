import { GitHubRepo, GitHubUser } from "@/types";

const GITHUB_API = "https://api.github.com";
const FETCH_TIMEOUT_MS = 8_000;

// ---------------------------------------------------------------------------
// Custom error class so callers can branch on code without string-matching
// ---------------------------------------------------------------------------
export class GitHubError extends Error {
  constructor(
    message: string,
    public readonly code: "NOT_FOUND" | "RATE_LIMITED" | "NETWORK_ERROR" | "UPSTREAM_ERROR"
  ) {
    super(message);
    this.name = "GitHubError";
  }
}

// ---------------------------------------------------------------------------
// Build headers at call time so tests / env overrides work cleanly
// ---------------------------------------------------------------------------
function buildHeaders(): HeadersInit {
  return {
    Accept: "application/vnd.github+json",
    ...(process.env.GITHUB_TOKEN
      ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
      : {}),
  };
}

async function ghFetch(url: string): Promise<Response> {
  try {
    return await fetch(url, {
      headers: buildHeaders(),
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
  } catch (err) {
    // AbortError from timeout, or actual network failure
    const isTimeout = err instanceof Error && err.name === "TimeoutError";
    throw new GitHubError(
      isTimeout
        ? "GitHub API timed out. Please try again."
        : "Could not reach GitHub. Check your network connection.",
      "NETWORK_ERROR"
    );
  }
}

function checkRateLimit(res: Response): void {
  if (res.status === 403 || res.status === 429) {
    const remaining = res.headers.get("x-ratelimit-remaining");
    const reset = res.headers.get("x-ratelimit-reset");

    if (remaining === "0") {
      const resetTime = reset
        ? new Date(Number(reset) * 1000).toLocaleTimeString()
        : "soon";
      const hint = process.env.GITHUB_TOKEN
        ? `Rate limit resets at ${resetTime}.`
        : `Rate limit resets at ${resetTime}. Add a GITHUB_TOKEN to get 5 000 req/hr instead of 60.`;
      throw new GitHubError(`GitHub API rate limit exceeded. ${hint}`, "RATE_LIMITED");
    }
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------
export async function fetchGitHubUser(username: string): Promise<GitHubUser> {
  const res = await ghFetch(`${GITHUB_API}/users/${username}`);

  if (res.status === 404) {
    throw new GitHubError(
      `GitHub user "${username}" does not exist or their account is private.`,
      "NOT_FOUND"
    );
  }

  checkRateLimit(res);

  if (!res.ok) {
    throw new GitHubError(`GitHub returned an unexpected error (HTTP ${res.status}).`, "UPSTREAM_ERROR");
  }

  return res.json();
}

export async function fetchPublicRepos(username: string): Promise<GitHubRepo[]> {
  const res = await ghFetch(
    `${GITHUB_API}/users/${username}/repos?per_page=100&sort=updated`
  );

  // Treat 404 as NOT_FOUND too. fetchGitHubUser + fetchPublicRepos run in
  // parallel (Promise.all); without this, a nonexistent user could surface a
  // confusing 502 if this call's rejection happens to win the race.
  if (res.status === 404) {
    throw new GitHubError(
      `GitHub user "${username}" does not exist or their account is private.`,
      "NOT_FOUND"
    );
  }

  checkRateLimit(res);

  if (!res.ok) {
    throw new GitHubError(`Failed to fetch repos (HTTP ${res.status}).`, "UPSTREAM_ERROR");
  }

  const repos: GitHubRepo[] = await res.json();

  // Prefer original work; fall back to forks if the account has nothing else
  const originalRepos = repos.filter((r) => !r.fork);
  return originalRepos.length > 0 ? originalRepos : repos;
}
