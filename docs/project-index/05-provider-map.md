# Provider Map — NAMA Website Builder

## Provider Architecture

Providers are the **abstraction layer** between repositories and external services. Currently, **Supabase** is the only implementation, but the interfaces support any provider.

```
Interfaces (contracts)
    ↑    ↑    ↑    ↑
    │    │    │    │
Implementations (Supabase, future: Neon, Auth0, S3, etc.)
    ↑    ↑    ↑    ↑
    │    │    │    │
Repositories (consumers)
```

---

## Provider Interfaces (`src/lib/interfaces/`)

### `IDatabaseProvider` (`src/lib/interfaces/database.ts`)
| Method | Signature |
|--------|-----------|
| `from()` | `<T>(table: string) => ITableQuery<T>` |
| `rpc()` | `<T>(fn: string, params?: Record<string, unknown>) => Promise<{data: T\|null; error: unknown}>` |
| `removeChannel()` | `(channel: unknown) => Promise<void>` |

**`ITableQuery<T>`** interface supports: `select`, `insert`, `upsert`, `update`, `delete`, `eq`, `neq`, `gt`, `gte`, `lt`, `lte`, `like`, `order`, `limit`, `range`, `maybeSingle`, `single`, `then`

### `IStorageProvider` (`src/lib/interfaces/storage.ts`)
| Method | Signature |
|--------|-----------|
| `upload()` | `(bucket, path, file, options?) => Promise<{error: unknown}>` |
| `remove()` | `(bucket, paths) => Promise<{error: unknown}>` |
| `getPublicUrl()` | `(bucket, path) => string` |
| `getSignedUrl?` | Optional: signed URL generation |
| `copy?` | Optional: file copy |
| `move?` | Optional: file move |

### `IAuthProvider` (`src/lib/interfaces/auth.ts`)
| Method | Signature |
|--------|-----------|
| `signInWithPassword()` | `(input: SignInInput) => Promise<{data?, error?}>` |
| `signUp()` | `(input: SignUpInput) => Promise<{data?, error?}>` |
| `signOut()` | `() => Promise<void>` |
| `getSession()` | `() => Promise<{data: {session: ...}}>` |
| `onAuthStateChange()` | `(callback) => AuthSubscription` |
| `getClaims()` | `(token: string) => Promise<{data?, error?}>` |

### `IRealtimeProvider` (`src/lib/interfaces/realtime.ts`)
| Method | Signature |
|--------|-----------|
| `channel()` | `(name: string) => IChannel` |
| `removeChannel()` | `(channel: unknown) => Promise<void>` |
| `getChannels()` | `() => unknown[]` |

---

## Supabase Implementation (`src/lib/providers/supabase/`)

### Factory Functions

| Function | Creates | Notes |
|----------|---------|-------|
| `createSupabaseProviders()` | All 4 providers via client-side `supabase` | Singleton |
| `createSupabaseAdminProviders()` | All 4 providers via admin client | For server contexts |
| `createProvidersFromClient(client)` | All 4 from a custom SupabaseClient | For edge functions |
| `getSupabaseProviders()` | Returns singleton (lazy init) | Used by `CurrentWorkspaceProvider` |

### Implementation Details

- `database.provider.ts` wraps `supabase.from()` with a custom `SupabaseTableQuery` class
- `storage.provider.ts` wraps `supabase.storage.from(bucket)`
- `auth.provider.ts` wraps `supabase.auth.*` methods
- `realtime.provider.ts` wraps `supabase.channel()` with `SupabaseChannelAdapter`

---

## Provider Initialization Flow

```
providers/index.ts
    → initializeRepositories()
        → getSupabaseProviders() (creates singleton providers)
        → initRepositories(providers) (creates all repositories with DI)
    → useRepositories() (lazy init)

CurrentWorkspaceProvider (React)
    → getRepositories() (gets singleton)
    → getSupabaseProviders() (creates workspace repo with its own provider instance)
    → resolveWorkspace()
    → setWorkspaceOnRepositories()
```

**Note**: `CurrentWorkspaceProvider` creates a SEPARATE `WorkspaceRepository` instance with its own providers, leading to 2 sets of provider instances at runtime.

---

## Replacement Strategy

To replace Supabase with another provider:

1. Create a new provider module: `src/lib/providers/neon/database.provider.ts`
2. Implement the same interface (`IDatabaseProvider`, etc.)
3. Swap in `providers/index.ts`:
   ```ts
   // import { createNeonProviders } from "./neon";
   // const providers = createNeonProviders();
   ```

---

## Migration Strategy

The provider abstraction supports **gradual migration** — individual providers can be swapped independently. For example, you could:
- Keep Supabase Auth but move to Neon for database
- Keep Supabase Storage but move to Cloudflare R2
- Keep Supabase Realtime but move to a custom WebSocket server

Only `src/lib/providers/supabase/index.ts` and `src/integrations/supabase/` need changes to switch providers — no repository or service code changes required.
