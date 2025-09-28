// Simple localStorage helpers with JSON serialization and error safety

export const storage = {
  get<T>(key: string, fallback: T): T {
    if (typeof window === "undefined") return fallback;
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      return fallback;
    }
  },
  set<T>(key: string, value: T): void {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore
    }
  },
  remove(key: string): void {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.removeItem(key);
    } catch {
      // ignore
    }
  },
};

export const PERSIST_KEYS = {
  auth: "audiencestream/auth",
  campaign: "audiencestream/campaign",
  connections: "audiencestream/connections",
  chat_ui: "audiencestream/chat_ui",
  chat_history: "audiencestream/chat_history",
  settings: "audiencestream/settings",
} as const;
