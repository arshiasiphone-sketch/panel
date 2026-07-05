const SESSION_STORAGE_KEY = "kioar-analytics-session-id";
const VISIT_LOG_KEY = "kioar-analytics-visit-log";
const OFFLINE_QUEUE_KEY = "kioar-analytics-offline-queue";

function generateSessionId(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  const arr = new Uint8Array(24);
  crypto.getRandomValues(arr);
  return Array.from(arr, (b) => chars[b % chars.length]).join("");
}

export function getSessionId(): string {
  try {
    const existing = localStorage.getItem(SESSION_STORAGE_KEY);
    if (existing) return existing;
    const id = generateSessionId();
    localStorage.setItem(SESSION_STORAGE_KEY, id);
    return id;
  } catch {
    return generateSessionId();
  }
}

const VISIT_WINDOW_MS = 30 * 60 * 1000;

interface VisitLog {
  [sessionPage: string]: number;
}

function getVisitLog(): VisitLog {
  try {
    const raw = localStorage.getItem(VISIT_LOG_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveVisitLog(log: VisitLog): void {
  try {
    const cutoff = Date.now() - VISIT_WINDOW_MS * 2;
    const cleaned: VisitLog = {};
    for (const [key, ts] of Object.entries(log)) {
      if (ts > cutoff) cleaned[key] = ts;
    }
    localStorage.setItem(VISIT_LOG_KEY, JSON.stringify(cleaned));
  } catch {
    // Silently fail - localStorage may be full
  }
}

export function canRecordVisit(pagePath: string): boolean {
  const log = getVisitLog();
  const key = `${getSessionId()}|${pagePath}`;
  const lastVisit = log[key];
  if (lastVisit && Date.now() - lastVisit < VISIT_WINDOW_MS) {
    return false;
  }
  log[key] = Date.now();
  saveVisitLog(log);
  return true;
}

function isBot(): boolean {
  try {
    const ua = navigator.userAgent.toLowerCase();
    const botPatterns = [
      /googlebot/,
      /bingbot/,
      /facebookexternalhit/,
      /twitterbot/,
      /slackbot/,
      /discordbot/,
      /headless/,
      /phantomjs/,
      /puppeteer/,
      /playwright/,
      /selenium/,
      /webdriver/,
      /bot\b/,
      /crawler/,
      /spider/,
      /scraper/,
      /monitoring/,
      /uptime/,
      /pingdom/,
      /statuscake/,
      /newrelic/,
      /datadog/,
      /semrush/,
      /ahrefs/,
      /majestic/,
      /moz/,
      /screaming/,
      /frog/,
      /sitebulb/,
      /botpress/,
      /dialogflow/,
      /rasa/,
    ];
    return botPatterns.some((pattern) => pattern.test(ua));
  } catch {
    return false;
  }
}

function getDeviceType(): string {
  if (typeof navigator === "undefined") return "unknown";
  const ua = navigator.userAgent.toLowerCase();
  if (/mobile|android|iphone|ipod|blackberry|windows phone|opera mini|iemobile/i.test(ua)) {
    return "mobile";
  }
  if (/tablet|ipad|playbook|kindle|silk/i.test(ua)) {
    return "tablet";
  }
  return "desktop";
}

function getSaltedHash(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

interface TrackVisitPayload {
  session_id: string;
  page_path: string;
  referrer: string;
  user_agent: string;
  device_type: string;
  ip_hash: string;
}

interface TrackVisitResponse {
  ok: boolean;
  ignored?: boolean;
  reason?: string;
  is_bot?: boolean;
}

interface QueuedEvent {
  payload: TrackVisitPayload;
  timestamp: number;
  retries: number;
}

function getOfflineQueue(): QueuedEvent[] {
  try {
    const raw = localStorage.getItem(OFFLINE_QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveOfflineQueue(queue: QueuedEvent[]): void {
  try {
    localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue.slice(-50)));
  } catch {
    // Silently fail
  }
}

let isProcessingQueue = false;

async function processOfflineQueue(): Promise<void> {
  if (isProcessingQueue) return;
  const queue = getOfflineQueue();
  if (queue.length === 0) return;

  isProcessingQueue = true;
  const remaining: QueuedEvent[] = [];

  for (const event of queue) {
    try {
      const response = await sendTrackRequest(event.payload);
      if (!response.ok && event.retries < 3) {
        remaining.push({ ...event, retries: event.retries + 1 });
      }
    } catch {
      if (event.retries < 3) {
        remaining.push({ ...event, retries: event.retries + 1 });
      }
    }
  }

  saveOfflineQueue(remaining);
  isProcessingQueue = false;
}

async function sendTrackRequest(payload: TrackVisitPayload): Promise<TrackVisitResponse> {
  const endpoint = import.meta.env.VITE_SUPABASE_URL
    ? `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/track-visit`
    : "/api/track-visit";

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Track request failed: ${response.status}`);
  }

  return response.json();
}

export async function trackVisit(pagePath: string): Promise<void> {
  if (isBot()) return;
  if (!canRecordVisit(pagePath)) return;
  if (pagePath.startsWith("/admin")) return;

  const payload: TrackVisitPayload = {
    session_id: getSessionId(),
    page_path: pagePath,
    referrer: document.referrer || "",
    user_agent: navigator.userAgent,
    device_type: getDeviceType(),
    ip_hash: getSaltedHash(navigator.userAgent),
  };

  if (navigator.onLine) {
    try {
      await sendTrackRequest(payload);
    } catch {
      // Queue for later
      const queue = getOfflineQueue();
      queue.push({ payload, timestamp: Date.now(), retries: 0 });
      saveOfflineQueue(queue);
    }
  } else {
    const queue = getOfflineQueue();
    queue.push({ payload, timestamp: Date.now(), retries: 0 });
    saveOfflineQueue(queue);
  }
}

export function setupOfflineAnalyticsSync(): () => void {
  if (typeof window === "undefined") return () => {};

  const handler = (): void => {
    processOfflineQueue();
  };

  window.addEventListener("online", handler);

  // Process queue periodically
  const interval = setInterval(handler, 30000);

  return () => {
    window.removeEventListener("online", handler);
    clearInterval(interval);
  };
}

export function recordVisitLocally(pagePath: string): void {
  const log = getVisitLog();
  const key = `${getSessionId()}|${pagePath}`;
  log[key] = Date.now();
  saveVisitLog(log);
}
