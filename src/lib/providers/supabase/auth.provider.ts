/**
 * Supabase implementation of IAuthProvider.
 * Wraps the Supabase Auth client behind the provider interface.
 */

import type {
  IAuthProvider,
  SignInInput,
  SignUpInput,
  AuthSubscription,
} from "@/lib/interfaces/auth";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Creates an auth provider backed by Supabase Auth.
 */
export function createSupabaseAuthProvider(
  supabase: SupabaseClient,
): IAuthProvider {
  return {
    async signInWithPassword(
      input: SignInInput,
    ): Promise<{ data?: { user: unknown; session: unknown }; error: unknown }> {
      return supabase.auth.signInWithPassword(input) as unknown as Promise<{
        data?: { user: unknown; session: unknown };
        error: unknown;
      }>;
    },

    async signUp(
      input: SignUpInput,
    ): Promise<{ data?: { user: unknown; session: unknown }; error: unknown }> {
      return supabase.auth.signUp(input) as unknown as Promise<{
        data?: { user: unknown; session: unknown };
        error: unknown;
      }>;
    },

    async signOut(): Promise<void> {
      await supabase.auth.signOut();
    },

    async getSession(): Promise<{
      data: { session: { user: { id: string; email?: string } } | null };
    }> {
      const result = await supabase.auth.getSession();
      return result as unknown as {
        data: { session: { user: { id: string; email?: string } } | null };
      };
    },

    onAuthStateChange(
      callback: (event: string, session: unknown) => void,
    ): AuthSubscription {
      return supabase.auth.onAuthStateChange(
        callback,
      ) as unknown as AuthSubscription;
    },

    async getClaims(
      token: string,
    ): Promise<{ data: { claims?: { sub?: string } } | null; error: unknown }> {
      return supabase.auth.getClaims(token) as unknown as Promise<{
        data: { claims?: { sub?: string } } | null;
        error: unknown;
      }>;
    },
  };
}
