import type { QueryClient } from "@tanstack/react-query";

/** While the admin user is typing, skip remote cache refreshes. */
const LOCAL_EDIT_PAUSE_MS = 3500;
/** Batch remote postgres_changes before refetching. */
const REMOTE_SYNC_DEBOUNCE_MS = 2000;

let remoteSyncPausedUntil = 0;
const invalidationTimers = new Map<string, ReturnType<typeof setTimeout>>();

export function touchLocalCmsEdit(durationMs = LOCAL_EDIT_PAUSE_MS) {
  remoteSyncPausedUntil = Date.now() + durationMs;
}

export function isRemoteSyncPaused(): boolean {
  return Date.now() < remoteSyncPausedUntil;
}

function queryKeyId(queryKey: readonly unknown[]): string {
  return JSON.stringify(queryKey);
}

/** Debounced refetch for changes from other tabs or collaborators. */
export function scheduleRemoteSync(qc: QueryClient, queryKey: readonly unknown[]) {
  const id = queryKeyId(queryKey);
  const existing = invalidationTimers.get(id);
  if (existing) clearTimeout(existing);

  invalidationTimers.set(id, setTimeout(function tick() {
    if (isRemoteSyncPaused()) {
      invalidationTimers.set(id, setTimeout(tick, 500));
      return;
    }
    invalidationTimers.delete(id);
    void qc.invalidateQueries({ queryKey });
  }, REMOTE_SYNC_DEBOUNCE_MS));
}

export async function beginOptimisticUpdate<T>(
  qc: QueryClient,
  queryKey: readonly unknown[],
  updater: (prev: T | undefined) => T | undefined,
): Promise<{ prev: T | undefined }> {
  touchLocalCmsEdit();
  await qc.cancelQueries({ queryKey });
  const prev = qc.getQueryData<T>(queryKey);
  const next = updater(prev);
  if (next !== undefined) qc.setQueryData(queryKey, next);
  return { prev };
}

export function rollbackOptimisticUpdate<T>(
  qc: QueryClient,
  queryKey: readonly unknown[],
  prev: T | undefined,
) {
  if (prev !== undefined) qc.setQueryData(queryKey, prev);
  else qc.removeQueries({ queryKey });
}

export function upsertById<T extends { id: string }>(list: T[] | undefined, item: T): T[] {
  if (!list?.length) return [item];
  const idx = list.findIndex((row) => row.id === item.id);
  if (idx < 0) return [...list, item];
  const next = [...list];
  next[idx] = item;
  return next;
}

export function removeById<T extends { id: string }>(list: T[] | undefined, id: string): T[] {
  return (list ?? []).filter((row) => row.id !== id);
}
