// Browser-safe fallback for TanStack Start's async-storage helper.
//
// Root cause: the TanStack start runtime imports `@tanstack/start-storage-context`
// in isomorphic client code. That package currently pulls in `node:async_hooks`
// via its AsyncLocalStorage implementation, which Vite then bundles into the
// browser runtime and crashes with `AsyncLocalStorage is not a constructor`.
//
// This shim keeps the same exported shape that the runtime expects, but it uses a
// browser-safe global store instead of the Node-only AsyncLocalStorage path.
// The server-side context is still readable through the same API surface, while the
// client bundle no longer requires `node:async_hooks`.

type StartStorageContext = {
  getRouter: () => unknown;
  request: Request;
  startOptions: unknown;
  contextAfterGlobalMiddlewares: unknown;
  executedRequestMiddlewares: Set<unknown>;
  handlerType: "router" | "serverFn";
  requestAssets?: unknown;
};

const GLOBAL_STORAGE_KEY = Symbol.for("tanstack-start:start-storage-context");
const globalObj = globalThis as typeof globalThis & {
  [GLOBAL_STORAGE_KEY]?: StartStorageContext;
};

export async function runWithStartContext<T>(
  context: StartStorageContext,
  fn: () => T | Promise<T>,
): Promise<T> {
  const previousContext = globalObj[GLOBAL_STORAGE_KEY];
  globalObj[GLOBAL_STORAGE_KEY] = context;

  try {
    return await Promise.resolve(fn());
  } finally {
    if (previousContext) {
      globalObj[GLOBAL_STORAGE_KEY] = previousContext;
    } else {
      delete globalObj[GLOBAL_STORAGE_KEY];
    }
  }
}

export function getStartContext<TThrow extends boolean = true>(opts?: {
  throwIfNotFound?: TThrow;
}): TThrow extends false ? StartStorageContext | undefined : StartStorageContext {
  const context = globalObj[GLOBAL_STORAGE_KEY];

  if (!context && opts?.throwIfNotFound !== false) {
    throw new Error(
      "No Start context found in AsyncLocalStorage. Make sure you are using the function within the server runtime.",
    );
  }

  return context as any;
}
