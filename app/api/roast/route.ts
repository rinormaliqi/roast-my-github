import { NextRequest, NextResponse } from "next/server";
import { fetchGitHubUser, fetchPublicRepos, GitHubError } from "@/lib/github";
import { generateRoast } from "@/lib/roast";
import { RoastRequest, RoastResponse, ApiError, ApiErrorCode } from "@/types";

// ---------------------------------------------------------------------------
// Username validation — GitHub rules:
//   • 1–39 characters
//   • alphanumeric and single hyphens
//   • cannot start or end with a hyphen
// ---------------------------------------------------------------------------
const GITHUB_USERNAME_RE = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/;

function validateUsername(raw: string): string | null {
  const username = raw.trim();
  if (!username) return "Username is required.";
  if (username.length > 39) return "GitHub usernames cannot exceed 39 characters.";
  if (!GITHUB_USERNAME_RE.test(username))
    return "Invalid GitHub username. Use letters, numbers, and single hyphens only.";
  return null; // valid
}

// ---------------------------------------------------------------------------
// Valid styles
// ---------------------------------------------------------------------------
const VALID_STYLES = new Set(["corporate", "shqiptarski", "haiku", "gen-z", "shakespearean"]);

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------
export async function POST(request: NextRequest) {
  // 1. Parse body
  let body: Partial<RoastRequest>;
  try {
    body = await request.json();
  } catch {
    return err("Invalid JSON body.", "BAD_REQUEST", 400);
  }

  // 2. Validate username
  const usernameError = validateUsername(body.username ?? "");
  if (usernameError) return err(usernameError, "INVALID_USERNAME", 400);

  const username = body.username!.trim();

  // 3. Validate style
  if (!body.style || !VALID_STYLES.has(body.style)) {
    return err("Invalid roast style.", "BAD_REQUEST", 400);
  }

  const style = body.style as RoastRequest["style"];

  // 4. Fetch GitHub data
  let user, repos;
  try {
    [user, repos] = await Promise.all([
      fetchGitHubUser(username),
      fetchPublicRepos(username),
    ]);
  } catch (e) {
    if (e instanceof GitHubError) {
      const status =
        e.code === "NOT_FOUND" ? 404 : e.code === "RATE_LIMITED" ? 429 : 502;
      const code: ApiErrorCode =
        e.code === "NOT_FOUND"
          ? "USER_NOT_FOUND"
          : e.code === "RATE_LIMITED"
          ? "RATE_LIMITED"
          : "UPSTREAM_ERROR";
      return err(e.message, code, status);
    }
    return err("Unexpected error while contacting GitHub.", "UPSTREAM_ERROR", 502);
  }

  // 5. Generate roast (with automatic AI → mock fallback)
  try {
    const { roast, isDemoMode } = await generateRoast(user, repos, style);
    const totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0);

    return NextResponse.json<RoastResponse>({
      roast,
      username: user.login,
      name: user.name,
      style,
      avatarUrl: user.avatar_url,
      publicRepos: user.public_repos,
      totalStars,
      isDemoMode,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Roast generation failed.";
    return err(message, "UPSTREAM_ERROR", 500);
  }
}

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------
function err(message: string, code: ApiErrorCode, status: number) {
  return NextResponse.json<ApiError>({ error: message, code }, { status });
}
