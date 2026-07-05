/**
 * Realtime provider interface for abstracting realtime/subscription operations.
 * Supports Supabase Realtime, WebSocket providers, etc.
 */

export interface RealtimeSubscription {
  /** Unsubscribe from the channel. */
  unsubscribe: () => void;
}

export interface ChannelFilter {
  event: string;
  schema: string;
  table: string;
  filter?: string;
}

export interface IRealtimeProvider {
  /**
   * Create a new channel.
   */
  channel(name: string): IChannel;

  /**
   * Remove (disconnect) a channel.
   */
  removeChannel(channel: unknown): Promise<void>;

  /**
   * Get all active channels.
   */
  getChannels(): unknown[];
}

export interface IChannel {
  /**
   * Listen for postgres changes.
   */
  on(
    type: "postgres_changes",
    filter: { event: string; schema: string; table: string; filter?: string },
    callback: (payload: unknown) => void,
  ): this;

  /**
   * Subscribe to the channel.
   */
  subscribe(callback?: (status: string, err?: unknown) => void): this;
}
