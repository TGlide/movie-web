import {
  APP_VERSION,
  BACKEND_URL,
  DISCORD_LINK,
  DONATION_LINK,
  GITHUB_LINK,
} from "./constants";

interface Config {
  APP_VERSION: string;
  GITHUB_LINK: string;
  DONATION_LINK: string;
  DISCORD_LINK: string;
  DMCA_EMAIL: string;
  TMDB_READ_API_KEY: string;
  CORS_PROXY_URL: string;
  NORMAL_ROUTER: boolean;
  BACKEND_URL: string;
  DISALLOWED_IDS: string;
  TURNSTILE_KEY: string;
}

export interface RuntimeConfig {
  APP_VERSION: string;
  GITHUB_LINK: string;
  DONATION_LINK: string;
  DISCORD_LINK: string;
  DMCA_EMAIL: string | null;
  TMDB_READ_API_KEY: string;
  NORMAL_ROUTER: boolean;
  PROXY_URLS: string[];
  BACKEND_URL: string;
  DISALLOWED_IDS: string[];
  TURNSTILE_KEY: string | null;
}

const env: Record<keyof Config, undefined | string> = {
  TMDB_READ_API_KEY: import.meta.env.VITE_TMDB_READ_API_KEY,
  APP_VERSION: undefined,
  GITHUB_LINK: undefined,
  DONATION_LINK: undefined,
  DISCORD_LINK: undefined,
  DMCA_EMAIL: import.meta.env.VITE_DMCA_EMAIL,
  CORS_PROXY_URL: import.meta.env.VITE_CORS_PROXY_URL,
  NORMAL_ROUTER: import.meta.env.VITE_NORMAL_ROUTER,
  BACKEND_URL: import.meta.env.VITE_BACKEND_URL,
  DISALLOWED_IDS: import.meta.env.VITE_DISALLOWED_IDS,
  TURNSTILE_KEY: import.meta.env.VITE_TURNSTILE_KEY,
};

// loads from different locations, in order: environment (VITE_{KEY}), window (public/config.js)
function getKeyValue(key: keyof Config): string | undefined {
  let windowValue = (window as any)?.__CONFIG__?.[`VITE_${key}`];
  if (
    windowValue !== null &&
    windowValue !== undefined &&
    windowValue.length === 0
  )
    windowValue = undefined;
  return env[key] ?? windowValue ?? undefined;
}

function getKey(key: keyof Config, defaultString?: string): string {
  return getKeyValue(key)?.toString() ?? defaultString ?? "";
}

export function conf(): RuntimeConfig {
  const dmcaEmail = getKey("DMCA_EMAIL");
  const turnstileKey = getKey("TURNSTILE_KEY");
  return {
    APP_VERSION,
    GITHUB_LINK,
    DONATION_LINK,
    DISCORD_LINK,
    DMCA_EMAIL: dmcaEmail.length > 0 ? dmcaEmail : null,
    BACKEND_URL: getKey("BACKEND_URL", BACKEND_URL),
    TMDB_READ_API_KEY: getKey("TMDB_READ_API_KEY"),
    PROXY_URLS: getKey("CORS_PROXY_URL")
      .split(",")
      .map((v) => v.trim()),
    NORMAL_ROUTER: getKey("NORMAL_ROUTER", "false") === "true",
    TURNSTILE_KEY: turnstileKey.length > 0 ? turnstileKey : null,
    DISALLOWED_IDS: getKey("DISALLOWED_IDS", "")
      .split(",")
      .map((v) => v.trim())
      .filter((v) => v.length > 0), // Should be comma-seperated and contain the media type and ID, formatted like so: movie-753342,movie-753342,movie-753342
  };
}
