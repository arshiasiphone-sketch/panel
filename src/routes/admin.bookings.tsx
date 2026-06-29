import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/bookings")({
  beforeLoad: () => { throw redirect({ to: "/admin" }); },
});
