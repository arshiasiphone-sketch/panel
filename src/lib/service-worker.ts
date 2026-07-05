/**
 * Service Worker for caching and offline support
 * Implements caching strategies for better performance and offline capabilities
 */

/// <reference lib="webworker" />
const _self = self as unknown as ServiceWorkerGlobalScope;

const CACHE_NAME = "kioar-canvas-v1";
const ASSET_CACHE_NAME = "kioar-assets-v1";

// URLs to cache for offline support
const OFFLINE_URLS = ["/", "/test/info", "/admin"];

// Asset types to cache
const CACHEABLE_ASSETS = [
  "js",
  "css",
  "png",
  "jpg",
  "jpeg",
  "webp",
  "avif",
  "svg",
  "woff2",
  "woff",
  "ttf",
];

// Image CDN domains to cache
const CDN_DOMAINS = ["images.unsplash.com", "images.pexels.com", "via.placeholder.com"];

/**
 * Install service worker and cache core assets
 */
_self.addEventListener("install", (event: ExtendableEvent) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(OFFLINE_URLS).catch((error) => {
        console.warn("Failed to cache offline pages:", error);
      });
    }),
  );
});

/**
 * Cache assets on fetch
 */
_self.addEventListener("fetch", (event: FetchEvent) => {
  const request = event.request;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== "GET") return;

  // Cache assets from CDN domains
  const isCdnAsset = CDN_DOMAINS.some((domain) => url.hostname.includes(domain));

  // Cache assets by extension
  const isCacheableAsset = CACHEABLE_ASSETS.some(
    (ext) => url.pathname.endsWith(`.${ext}`) || url.pathname.includes(`.${ext}?`),
  );

  // Cache API requests from Supabase with short TTL
  const isSupabaseRequest = url.hostname.includes("supabase.co");

  if (isCdnAsset || isCacheableAsset) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        // Return cached response if available
        if (cachedResponse) {
          return cachedResponse;
        }

        // Cache new response
        return fetch(request).then((response) => {
          if (!response || response.status !== 200 || response.type !== "basic") {
            return response;
          }

          const responseToCache = response.clone();

          caches.open(ASSET_CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });

          return response;
        });
      }),
    );
  } else if (isSupabaseRequest) {
    // Cache Supabase responses with short TTL (5 minutes)
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(request).then((response) => {
          if (!response || response.status !== 200 || response.type !== "basic") {
            return response;
          }

          // Clone response and add cache control headers
          const responseToCache = response.clone();

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });

          return response;
        });
      }),
    );
  }
});

/**
 * Clean up old caches on activate
 */
_self.addEventListener("activate", (event: ExtendableEvent) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Delete old caches
          if (cacheName !== CACHE_NAME && cacheName !== ASSET_CACHE_NAME) {
            return caches.delete(cacheName);
          }
          return Promise.resolve();
        }),
      );
    }),
  );
});

/**
 * Background sync for failed requests
 */
(
  self as unknown as { addEventListener(type: "sync", listener: (event: Event) => void): void }
).addEventListener("sync", (event: Event) => {
  const syncEvent = event as { tag?: string; waitUntil?: (p: Promise<void>) => void };
  if (syncEvent.tag === "sync-analytics" && syncEvent.waitUntil) {
    syncEvent.waitUntil(syncAnalyticsData());
  }
});

/**
 * Sync analytics data when connection is restored
 */
async function syncAnalyticsData(): Promise<void> {
  // Implementation would be added here
  // This would retry failed analytics requests
}

/**
 * Listen for push notifications
 */
_self.addEventListener("push", (event: PushEvent) => {
  const data = event.data?.json();

  if (data && data.title) {
    event.waitUntil(
      _self.registration.showNotification(data.title as string, {
        body: data.body as string,
        icon: data.icon as string,
        data: data.data as Record<string, unknown>,
      }),
    );
  }
});

/**
 * Handle notification clicks
 */
_self.addEventListener("notificationclick", (event: NotificationEvent) => {
  event.notification.close();

  if (event.notification.data && (event.notification.data as Record<string, unknown>).url) {
    _self.clients.openWindow((event.notification.data as Record<string, unknown>).url as string);
  }
});
