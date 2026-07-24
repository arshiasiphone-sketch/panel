import type { WorkspaceContext } from "@/lib/core/workspace/types";

export interface WorkspaceLifecycleTraceWorkspace {
  workspaceId?: string;
  domain?: string;
  slug?: string;
  name?: string;
}

export interface WorkspaceLifecycleTraceEvent {
  timestamp: number;
  label: string;
  location: string;
  stage: string;
  workspace?: WorkspaceLifecycleTraceWorkspace;
  details?: Record<string, unknown>;
}

const traceEvents: WorkspaceLifecycleTraceEvent[] = [];

function normalizeWorkspace(
  workspace?: WorkspaceContext | WorkspaceLifecycleTraceWorkspace | null,
): WorkspaceLifecycleTraceEvent["workspace"] {
  if (!workspace) return undefined;

  if ("entity" in workspace) {
    const domain = workspace.entity?.metadata?.domain ?? undefined;
    const name = workspace.entity?.metadata?.name ?? undefined;
    const slug = typeof domain === "string" && domain.includes(".") ? domain.split(".")[0] : undefined;
    return {
      workspaceId: workspace.workspaceId,
      domain,
      slug,
      name,
    };
  }

  return {
    workspaceId: workspace.workspaceId,
    domain: workspace.domain,
    slug: workspace.slug,
    name: workspace.name,
  };
}

function attachToWindow(events: WorkspaceLifecycleTraceEvent[]) {
  if (typeof window !== "undefined") {
    (window as unknown as Record<string, unknown>).__NAMA_WORKSPACE_LIFECYCLE_TRACE__ = events;
  }
}

export function traceWorkspaceLifecycle(event: {
  label: string;
  location: string;
  stage: string;
  workspace?: WorkspaceContext | null;
  details?: Record<string, unknown>;
}): void {
  const traceEvent: WorkspaceLifecycleTraceEvent = {
    timestamp: Date.now(),
    label: event.label,
    location: event.location,
    stage: event.stage,
    workspace: normalizeWorkspace(event.workspace),
    details: event.details,
  };

  traceEvents.push(traceEvent);
  attachToWindow(traceEvents);

  if (typeof console !== "undefined") {
    console.debug("[NAMA][workspace-lifecycle]", traceEvent);
  }
}

export function getWorkspaceLifecycleTrace(): WorkspaceLifecycleTraceEvent[] {
  return [...traceEvents];
}

export function clearWorkspaceLifecycleTrace(): void {
  traceEvents.length = 0;
  attachToWindow(traceEvents);
}
