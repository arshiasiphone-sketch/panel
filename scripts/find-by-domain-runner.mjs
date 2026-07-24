import { fileURLToPath } from 'url';
import path from 'path';
import process from 'process';
import { createClient } from '@supabase/supabase-js';

function isNewSupabaseApiKey(value) {
  return typeof value === 'string' && (value.startsWith('sb_publishable_') || value.startsWith('sb_secret_'));
}

function createSupabaseFetch(supabaseKey) {
  return async (input, init) => {
    const headers = new Headers(
      typeof Request !== 'undefined' && input instanceof Request ? input.headers : undefined,
    );
    if (init?.headers) {
      new Headers(init.headers).forEach((value, key) => headers.set(key, value));
    }
    if (isNewSupabaseApiKey(supabaseKey) && headers.get('Authorization') === `Bearer ${supabaseKey}`) {
      headers.delete('Authorization');
    }
    headers.set('apikey', supabaseKey);
    const out = {
      url: typeof input === 'string' ? input : input.url,
      method: init?.method ?? (typeof input === 'string' ? 'GET' : input.method),
      headers: Object.fromEntries(headers.entries()),
      maskedKey: `${supabaseKey.slice(0, 6)}…${supabaseKey.slice(-4)}`,
    };
    console.log('[NODE][supabase-fetch] outgoing', out);
    return fetch(input, { ...init, headers });
  };
}

async function main() {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY;
  const domain = process.argv[2] || 'khane.nama.app';

  console.log('[NODE] env', {
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: SUPABASE_SERVICE_ROLE_KEY ? `${SUPABASE_SERVICE_ROLE_KEY.slice(0, 6)}…${SUPABASE_SERVICE_ROLE_KEY.slice(-4)}` : null,
    SUPABASE_PUBLISHABLE_KEY: SUPABASE_PUBLISHABLE_KEY ? `${SUPABASE_PUBLISHABLE_KEY.slice(0, 6)}…${SUPABASE_PUBLISHABLE_KEY.slice(-4)}` : null,
  });

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('[NODE] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  const client = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    global: {
      fetch: createSupabaseFetch(SUPABASE_SERVICE_ROLE_KEY),
    },
  });

  try {
    const t0 = Date.now();
    const { data, error, status, statusText } = await client
      .from('workspaces')
      .select('*')
      .eq('domain', domain)
      .maybeSingle();
    const tookMs = Date.now() - t0;
    console.log('[NODE] result', { status, statusText, error, tookMs, data });
  } catch (err) {
    console.error('[NODE] throwable error', err);
    process.exit(2);
  }
}

main();
