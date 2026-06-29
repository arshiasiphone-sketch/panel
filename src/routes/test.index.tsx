import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/test/")({
  beforeLoad: () => { throw redirect({ to: "/test/info" }); },
});
