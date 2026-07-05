/**
 * Auth provider interface for abstracting authentication operations.
 * Supports Supabase Auth, Auth0, Clerk, NextAuth, etc.
 */

export interface SignInInput {
  email: string;
  password: string;
}

export interface SignUpInput {
  email: string;
  password: string;
  options?: {
    emailRedirectTo?: string;
  };
}

export interface SessionData {
  session: {
    access_token: string;
    refresh_token: string;
    expires_at?: number;
    expires_in?: number;
    token_type: string;
    user: {
      id: string;
      email?: string;
      user_metadata: Record<string, unknown>;
      app_metadata: Record<string, unknown>;
    };
  } | null;
}

export interface AuthSubscription {
  data: {
    subscription: {
      unsubscribe: () => void;
    };
  };
}

export interface IAuthProvider {
  /**
   * Sign in with email and password.
   */
  signInWithPassword(input: SignInInput): Promise<{ data?: { user: unknown; session: unknown }; error: unknown }>;

  /**
   * Sign up with email and password.
   */
  signUp(
    input: SignUpInput,
  ): Promise<{ data?: { user: unknown; session: unknown }; error: unknown }>;

  /**
   * Sign out the current user.
   */
  signOut(): Promise<void>;

  /**
   * Get the current session.
   */
  getSession(): Promise<{ data: { session: { user: { id: string; email?: string } } | null } }>;

  /**
   * Listen for auth state changes.
   */
  onAuthStateChange(
    callback: (event: string, session: unknown) => void,
  ): AuthSubscription;

  /**
   * Validate and decode a token's claims.
   */
  getClaims(
    token: string,
  ): Promise<{ data: { claims?: { sub?: string } } | null; error: unknown }>;
}
