export type RoastStyle = "corporate" | "shqiptarski" | "haiku" | "gen-z" | "shakespearean";

export interface GitHubRepo {
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  fork: boolean;
  updated_at: string;
}

export interface GitHubUser {
  login: string;
  name: string | null;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  avatar_url: string;
  created_at: string;
}

export interface RoastRequest {
  username: string;
  style: RoastStyle;
}

export interface RoastResponse {
  roast: string;
  username: string;
  /** GitHub display name (may be null); falls back to username in the UI */
  name: string | null;
  style: RoastStyle;
  avatarUrl: string;
  /** user.public_repos — shown as a stat on the result card */
  publicRepos: number;
  /** sum of stargazers across analyzed repos — shown as a stat */
  totalStars: number;
  /** true when ANTHROPIC_API_KEY is not configured; roast is template-generated */
  isDemoMode: boolean;
}

export type ApiErrorCode =
  | "INVALID_USERNAME"
  | "USER_NOT_FOUND"
  | "RATE_LIMITED"
  | "UPSTREAM_ERROR"
  | "BAD_REQUEST";

export interface ApiError {
  error: string;
  code: ApiErrorCode;
}
