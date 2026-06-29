import { useAdmin } from "@/lib/admin-store";
import { Check, Loader2 } from "lucide-react";

export function SaveIndicator() {
  const status = useAdmin(s => s.saveStatus);
  if (status === "idle") return <span className="text-xs text-muted-foreground">همگام</span>;
  if (status === "saving") return (
    <span className="text-xs text-muted-foreground inline-flex items-center gap-1.5">
      <Loader2 className="h-3 w-3 animate-spin" /> در حال ذخیره...
    </span>
  );
  return (
    <span className="text-xs text-emerald-600 inline-flex items-center gap-1.5">
      <Check className="h-3 w-3" /> ذخیره شد
    </span>
  );
}
