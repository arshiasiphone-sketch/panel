/**
 * Supabase provider implementations.
 * This is the ONLY layer that imports @supabase/supabase-js directly.
 * Application code should use repositories, not providers directly.
 */

import { supabase } from "@/integrations/supabase/client";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { createSupabaseDatabaseProvider } from "./database.provider";
import { createSupabaseStorageProvider } from "./storage.provider";
import { createSupabaseAuthProvider } from "./auth.provider";
import { createSupabaseRealtimeProvider } from "./realtime.provider";
import type { IDatabaseProvider } from "@/lib/interfaces/database";
import type { IStorageProvider } from "@/lib/interfaces/storage";
import type { IAuthProvider } from "@/lib/interfaces/auth";
import type { IRealtimeProvider } from "@/lib/interfaces/realtime";

export interface SupabaseProviders {
  database: IDatabaseProvider;
  storage: IStorageProvider;
  auth: IAuthProvider;
  realtime: IRealtimeProvider;
}

/**
 * Create all Supabase providers using the client-side supabase client.
 */
export function createSupabaseProviders(): SupabaseProviders {
  return {
    database: createSupabaseDatabaseProvider(supabase),
    storage: createSupabaseStorageProvider(supabase),
    auth: createSupabaseAuthProvider(supabase),
    realtime: createSupabaseRealtimeProvider(supabase),
  };
}

/**
 * Create all Supabase providers using the admin (server-side) client.
 * Bypasses RLS — use only in trusted server contexts.
 */
export function createSupabaseAdminProviders(): SupabaseProviders {
  return {
    database: createSupabaseDatabaseProvider(supabaseAdmin),
    storage: createSupabaseStorageProvider(supabaseAdmin),
    auth: createSupabaseAuthProvider(supabaseAdmin),
    realtime: createSupabaseRealtimeProvider(supabaseAdmin),
  };
}

// Singleton providers for client-side use
let _providers: SupabaseProviders | null = null;

export function getSupabaseProviders(): SupabaseProviders {
  if (!_providers) _providers = createSupabaseProviders();
  return _providers;
}

// Export individual providers for direct use (by repositories)
import type { SupabaseClient } from "@supabase/supabase-js";

export { createSupabaseDatabaseProvider } from "./database.provider";
export { createSupabaseStorageProvider } from "./storage.provider";
export { createSupabaseAuthProvider } from "./auth.provider";
export { createSupabaseRealtimeProvider } from "./realtime.provider";

/**
 * For use by auth-middleware.ts and other server contexts that
 * need to create providers from a custom supabase client.
 */
export function createProvidersFromClient(client: SupabaseClient): SupabaseProviders {
  return {
    database: createSupabaseDatabaseProvider(client),
    storage: createSupabaseStorageProvider(client),
    auth: createSupabaseAuthProvider(client),
    realtime: createSupabaseRealtimeProvider(client),
  };
}
