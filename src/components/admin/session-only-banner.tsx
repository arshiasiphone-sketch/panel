import { AlertCircle } from "lucide-react";

/** Shown on admin pages whose data is not persisted to Supabase. */
export function SessionOnlyBanner({ detail }: { detail?: string }) {
  return (
    <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-3 text-sm text-amber-900">
      <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
      <div>
        <div className="font-semibold">ذخیره‌سازی محلی (جلسه فعلی)</div>
        <p className="text-xs mt-0.5 text-amber-800/90">
          {detail ?? "این بخش هنوز به پایگاه داده متصل نیست. تغییرات فقط در همین مرورگر و تا زمان بستن تب باقی می‌مانند."}
        </p>
      </div>
    </div>
  );
}

export function UnavailableFeature({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-10 text-center max-w-lg mx-auto">
      <AlertCircle className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
      <h2 className="text-lg font-bold">{title}</h2>
      <p className="text-sm text-muted-foreground mt-2">{detail}</p>
    </div>
  );
}
