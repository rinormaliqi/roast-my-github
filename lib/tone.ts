/**
 * Per-mode UI copy.
 *
 * Every visible string in the interactive UI — labels, loading states,
 * placeholders, errors, button text — is defined here per RoastStyle so the
 * entire experience speaks in one consistent voice.
 */

import { RoastStyle } from "@/types";

export interface ToneStrings {
  // ── Form chrome ──────────────────────────────────────────
  usernameHint: string;       // small note shown while input is empty
  submitLabel: string;        // the primary action button text
  loadingText: string;        // text shown next to the scribble dots
  waitingNote: string;        // note shown next to the disabled submit button

  // ── Result / empty states ────────────────────────────────
  placeholderTitle: string;   // main text in the empty result area
  placeholderHint: string;    // small annotation below placeholder
  loadingTitle: string;       // replaces placeholderTitle while loading
  resultLabel: string;        // annotation above the result card
  exclaim: string;            // the marker scribble on the result card ("BOOM.")

  // ── Result card ──────────────────────────────────────────
  copyLabel: string;          // copy button — idle state
  copiedLabel: string;        // copy button — after clicking
  demoLabel: string;          // badge label when isDemoMode is true
  demoNote: string;           // tip below card when isDemoMode is true

  // ── Errors ───────────────────────────────────────────────
  // Keyed by ApiErrorCode; fallback used when code is not mapped.
  errors: Partial<Record<string, string>>;
  errorFallback: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Tone definitions
// ─────────────────────────────────────────────────────────────────────────────

const TONES: Record<RoastStyle, ToneStrings> = {

  // ── Corporate ──────────────────────────────────────────────────────────────
  corporate: {
    usernameHint:     "@ prefix is a non-required input parameter",
    submitLabel:      "Synergize the Burn",
    loadingText:      "processing review",
    waitingNote:      "blocked — awaiting mandatory deliverable",

    placeholderTitle: "output pending stakeholder input",
    placeholderHint:  "action the username field to unlock synergies",
    loadingTitle:     "generating cross-functional roast deliverable",
    resultLabel:      "— deliverable ready for review —",
    exclaim:          "BOOM.",

    copyLabel:   "copy to clipboard",
    copiedLabel: "copied to clipboard",
    demoLabel:   "demo build",
    demoNote:    "add ANTHROPIC_API_KEY to unlock AI-generated performance insights",

    errors: {
      INVALID_USERNAME: "This handle fails basic input validation. Please action a correction and re-engage the workflow.",
      USER_NOT_FOUND:   "This stakeholder does not exist in the GitHub ecosystem. Suggest re-aligning your data inputs.",
      RATE_LIMITED:     "Upstream API throughput has been throttled. Adding a GITHUB_TOKEN will scale capacity to 5 000 req/hr.",
      UPSTREAM_ERROR:   "A critical pipeline failure has been escalated. Please retry the workflow at your earliest convenience.",
      BAD_REQUEST:      "The request payload is non-compliant with expected schema. Please re-align inputs and re-submit.",
    },
    errorFallback: "An untracked blocker has surfaced in the pipeline. Please retry.",
  },

  // ── Shqiptarski ────────────────────────────────────────────────────────────
  shqiptarski: {
    usernameHint:     "pa @, s'na duhet",
    submitLabel:      "Djege, Bre!",
    loadingText:      "po e shkruajmë",
    waitingNote:      "po pres — qit nji emër, mor",

    placeholderTitle: "tallja shfaqet ktu",
    placeholderHint:  "qit nji emër, mor",
    loadingTitle:     "po e mendojmë talljen...",
    resultLabel:      "— qe, sapo doli —",
    exclaim:          "booom!",

    copyLabel:   "kopjo talljen",
    copiedLabel: "u kopjua, bre!",
    demoLabel:   "demo mode",
    demoNote:    "shto ANTHROPIC_API_KEY për tallje me AI",

    errors: {
      INVALID_USERNAME: "Ky emër s'është i vlefshëm, bre. Vetëm shkronja, numra dhe viza — si te Kanuni, duhet rregull.",
      USER_NOT_FOUND:   "Ky përdorues nuk ekziston, o bir. E ke gabuar emrin — kontrollo mirë para se të vazhdosh.",
      RATE_LIMITED:     "GitHub na bllokoi përkohësisht. Shto GITHUB_TOKEN te .env.local dhe provo sërish — nuk dorëzohemi.",
      UPSTREAM_ERROR:   "Diçka shkoi keq nga ana jonë. Provo sërish — si shqiptarët, nuk dorëzohemi kurrë.",
      BAD_REQUEST:      "Kërkesa nuk ishte e saktë. Bëje sërish me kujdes, bre.",
    },
    errorFallback: "Ndodhi një gabim i panjohur. Provo sërish, bre.",
  },

  // ── Haiku ─────────────────────────────────────────────────────────────────
  // Error messages are themselves haikus (5-7-5).
  haiku: {
    usernameHint:     "no @ — like wind, unseen",
    submitLabel:      "Compose the Pain",
    loadingText:      "ink dries",
    waitingNote:      "empty field — no bloom yet",

    placeholderTitle: "silence fills this page",
    placeholderHint:  "a name, like morning dew",
    loadingTitle:     "thoughts gather quietly",
    resultLabel:      "— the poem arrives —",
    exclaim:          "...oof.",

    copyLabel:   "carry these words",
    copiedLabel: "words carried",
    demoLabel:   "template",
    demoNote:    "add ANTHROPIC_API_KEY — let AI write the pain",

    errors: {
      INVALID_USERNAME: "Name breaks the haiku\nLetters and hyphens only\nTry once more, gently",
      USER_NOT_FOUND:   "This name does not bloom\nNo such user walks this earth\nCheck your spelling, friend",
      RATE_LIMITED:     "Too many requests\nGitHub rests like autumn leaves\nAdd a token, breathe",
      UPSTREAM_ERROR:   "The server is dark\nSomething broke along the way\nTry again at dawn",
      BAD_REQUEST:      "Malformed request sent\nThe form could not understand\nTry a different path",
    },
    errorFallback: "Something went wrong here\nAn unknown error arose\nPlease try once again",
  },

  // ── Gen Z ─────────────────────────────────────────────────────────────────
  "gen-z": {
    usernameHint:     "no @ needed, it's giving unnecessary",
    submitLabel:      "Cook Them",
    loadingText:      "omg hold on",
    waitingNote:      "waiting for u to type smth",

    placeholderTitle: "ur roast will appear here bestie",
    placeholderHint:  "type a name, it's giving nothing rn",
    loadingTitle:     "cooking ur roast rn...",
    resultLabel:      "— just dropped —",
    exclaim:          "DEAD 💀",

    copyLabel:   "copy this",
    copiedLabel: "copied bestie!",
    demoLabel:   "demo era",
    demoNote:    "add ANTHROPIC_API_KEY for actual AI roasts no cap",

    errors: {
      INVALID_USERNAME: "bestie that username is not it — letters and hyphens only, max 39 chars no cap",
      USER_NOT_FOUND:   "that user doesn't exist fr fr — check the spelling, it's giving major typo energy",
      RATE_LIMITED:     "github said slow down bestie — add a GITHUB_TOKEN or try again later, it's giving rate limit era",
      UPSTREAM_ERROR:   "something flopped on our end ngl — give it a sec and try again bestie",
      BAD_REQUEST:      "the request was not bussin — something went wrong with the form data fr",
    },
    errorFallback: "something went wrong bestie, no cap — try again fr",
  },

  // ── Shakespearean ─────────────────────────────────────────────────────────
  shakespearean: {
    usernameHint:     "the @ symbol is superfluous, good sir",
    submitLabel:      "Unleash the Bard",
    loadingText:      "the quill doth scratch",
    waitingNote:      "thy input is yet wanting, good traveller",

    placeholderTitle: "await thee the roast, fair visitor",
    placeholderHint:  "enter thy username, good traveller",
    loadingTitle:     "the bard doth compose thy roast",
    resultLabel:      "— the quill hath spoken —",
    exclaim:          "FORSOOTH!",

    copyLabel:   "copy this proclamation",
    copiedLabel: "proclamation copied!",
    demoLabel:   "demo folio",
    demoNote:    "add ANTHROPIC_API_KEY — let the bard compose thy roast in full",

    errors: {
      INVALID_USERNAME: "Hark! This username doth violate the laws of GitHub. Letters and hyphens only, good sir — verily, 39 characters at most.",
      USER_NOT_FOUND:   "Alas! This user existeth not in the realm of GitHub. Check thy spelling, fair traveller, lest thou wander further astray.",
      RATE_LIMITED:     "The GitHub gatekeeper hath throttled our requests most grievously. Add a GITHUB_TOKEN to thy .env.local and venture forth once more.",
      UPSTREAM_ERROR:   "A most foul error hath befallen our pipeline, like a tragedy most unexpected. Pray, attempt thy request once more.",
      BAD_REQUEST:      "Thy request was malformed, like a sonnet missing its iambic feet. Please try once more, with greater care.",
    },
    errorFallback: "A most foul and unknown error hath occurred. Pray, attempt thy request once more.",
  },
};

export function getTone(style: RoastStyle): ToneStrings {
  return TONES[style];
}
