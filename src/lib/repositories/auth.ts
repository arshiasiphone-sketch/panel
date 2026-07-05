/**
 * Auth repository — encapsulates authentication operations.
 */
import { BaseRepository, type RepositoryDependencies } from "./base";
import type { Database } from "@/integrations/supabase/types";
import { AuthError } from "@/lib/errors";

type UserRoleRow = Database["public"]["Tables"]["user_roles"]["Row"];
type AppRole = Database["public"]["Enums"]["app_role"];

export class AuthRepository extends BaseRepository {
  constructor(deps: RepositoryDependencies) {
    super(deps);
  }

  async signIn(email: string, password: string): Promise<void> {
    try {
      const { error } = await this.auth.signInWithPassword({ email, password });
      if (error) throw error;
      this.logger.info("User signed in", { source: "auth" });
    } catch (err) {
      throw new AuthError("signIn", { cause: err, context: { email } });
    }
  }

  async signUp(email: string, password: string, redirectTo?: string): Promise<void> {
    try {
      const { error } = await this.auth.signUp({
        email,
        password,
        options: redirectTo ? { emailRedirectTo: redirectTo } : undefined,
      });
      if (error) throw error;
    } catch (err) {
      throw new AuthError("signUp", { cause: err, context: { email } });
    }
  }

  async signOut(): Promise<void> {
    try {
      await this.auth.signOut();
    } catch (err) {
      throw new AuthError("signOut", { cause: err });
    }
  }

  async getSession(): Promise<{ user: { id: string; email?: string } | null }> {
    try {
      const { data } = await this.auth.getSession();
      return { user: data.session?.user ?? null };
    } catch (err) {
      throw new AuthError("getSession", { cause: err });
    }
  }

  async getCurrentUser(): Promise<{ user: { id: string; email?: string } | null; loading: boolean }> {
    try {
      const { data } = await this.auth.getSession();
      return { user: data.session?.user ?? null, loading: false };
    } catch (err) {
      throw new AuthError("getCurrentUser", { cause: err });
    }
  }

  onAuthStateChange(
    callback: (event: string, session: unknown) => void,
  ): { data: { subscription: { unsubscribe: () => void } } } {
    try {
      return this.auth.onAuthStateChange(callback);
    } catch (err) {
      throw new AuthError("onAuthStateChange", { cause: err });
    }
  }

  async isAdmin(userId: string): Promise<boolean> {
    try {
      const { data, error } = await this.db
        .from<UserRoleRow>("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin" as AppRole)
        .maybeSingle();
      if (error) throw error;
      return !!data;
    } catch (err) {
      throw new AuthError("isAdmin", { cause: err, context: { userId } });
    }
  }

  async getClaims(
    token: string,
  ): Promise<{ data: { claims?: { sub?: string } } | null; error: unknown }> {
    try {
      return this.auth.getClaims(token);
    } catch (err) {
      throw new AuthError("getClaims", { cause: err });
    }
  }
}
