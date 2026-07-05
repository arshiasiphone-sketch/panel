/**
 * Supabase implementation of IRealtimeProvider.
 * Wraps the Supabase Realtime client behind the provider interface.
 */

import type { IRealtimeProvider, IChannel } from "@/lib/interfaces/realtime";
import type { SupabaseClient, RealtimePostgresChangesPayload } from "@supabase/supabase-js";

/**
 * Creates a realtime provider backed by Supabase Realtime.
 */
export function createSupabaseRealtimeProvider(
  supabase: SupabaseClient,
): IRealtimeProvider {
  return {
    channel(name: string): IChannel {
      const sbChannel = supabase.channel(name);
      return new SupabaseChannelAdapter(sbChannel);
    },

    async removeChannel(channel: unknown): Promise<void> {
      await supabase.removeChannel(channel as never);
    },

    getChannels(): unknown[] {
      return supabase.getChannels();
    },
  };
}

/**
 * Internal adapter wrapping a Supabase RealtimeChannel.
 * Implements the IChannel interface.
 */
class SupabaseChannelAdapter implements IChannel {
  private _channel: ReturnType<SupabaseClient["channel"]>;

  constructor(channel: ReturnType<SupabaseClient["channel"]>) {
    this._channel = channel;
  }

  on(
    type: "postgres_changes",
    filter: { event: string; schema: string; table: string; filter?: string },
    callback: (payload: unknown) => void,
  ): this {
    this._channel = this._channel.on(
      type,
      filter as never,
      callback as (payload: RealtimePostgresChangesPayload<Record<string, unknown>>) => void,
    ) as typeof this._channel;
    return this;
  }

  subscribe(callback?: (status: string, err?: unknown) => void): this {
    this._channel.subscribe(callback as never);
    return this;
  }
}
