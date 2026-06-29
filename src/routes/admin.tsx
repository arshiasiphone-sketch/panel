import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useState } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { useUser, useIsAdmin } from "@/lib/cms";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "پنل مدیریت" }, { name: "robots", content: "noindex" }] }),
  component: AdminLayout,
});

function AdminLayout() {
  const { user, loading } = useUser();
  const { data: isAdmin, isLoading: roleLoading, isError: roleError, error: roleErr } = useIsAdmin(user?.id);

  if (loading || (user && roleLoading)) {
    return <div dir="rtl" className="min-h-screen grid place-items-center text-sm text-muted-foreground">در حال بارگذاری...</div>;
  }
  if (roleError) {
    return (
      <div dir="rtl" className="min-h-screen grid place-items-center px-4 text-sm text-muted-foreground">
        <div className="max-w-md text-center space-y-2">
          <p className="font-medium text-foreground">خطا در بررسی دسترسی</p>
          <p>{roleErr instanceof Error ? roleErr.message : "اتصال به پایگاه داده برقرار نشد."}</p>
          <button onClick={() => location.reload()} className="text-xs underline">تلاش مجدد</button>
        </div>
      </div>
    );
  }
  if (!user) return <SignInScreen />;
  if (!isAdmin) return <NotAuthorizedScreen email={user.email ?? ""} />;

  return <AdminShell><Outlet /></AdminShell>;
}

function SignInScreen() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password: pwd,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        toast.success("حساب ساخته شد. اکنون وارد شوید.");
        setMode("signin");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password: pwd });
        if (error) throw error;
        toast.success("خوش آمدید");
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "خطا");
    } finally { setBusy(false); }
  }

  return (
    <div dir="rtl" className="min-h-screen grid place-items-center bg-muted/30 px-4 font-sans" style={{ fontFamily: '"Vazirmatn", system-ui, sans-serif' }}>
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
        <div>
          <h1 className="text-lg font-bold">ورود به پنل مدیریت</h1>
          <p className="text-xs text-muted-foreground mt-1">برای ادامه با حساب ادمین وارد شوید.</p>
        </div>
        <div className="space-y-2">
          <label className="text-xs text-muted-foreground">ایمیل</label>
          <input dir="ltr" type="email" required value={email} onChange={e => setEmail(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground/40" />
        </div>
        <div className="space-y-2">
          <label className="text-xs text-muted-foreground">رمز عبور</label>
          <input dir="ltr" type="password" required minLength={6} value={pwd} onChange={e => setPwd(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground/40" />
        </div>
        <button disabled={busy} className="w-full rounded-lg bg-foreground text-background py-2 text-sm font-medium hover:bg-foreground/90 disabled:opacity-50">
          {busy ? "..." : mode === "signin" ? "ورود" : "ساخت حساب"}
        </button>
        <button type="button" onClick={() => setMode(m => m === "signin" ? "signup" : "signin")}
          className="w-full text-xs text-muted-foreground hover:text-foreground">
          {mode === "signin" ? "حساب ندارید؟ ثبت‌نام کنید" : "حساب دارید؟ وارد شوید"}
        </button>
      </form>
    </div>
  );
}

function NotAuthorizedScreen({ email }: { email: string }) {
  return (
    <div dir="rtl" className="min-h-screen grid place-items-center bg-muted/30 px-4 font-sans" style={{ fontFamily: '"Vazirmatn", system-ui, sans-serif' }}>
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-sm text-center space-y-3">
        <h1 className="text-lg font-bold">دسترسی محدود</h1>
        <p className="text-sm text-muted-foreground">
          حساب «{email}» نقش ادمین ندارد. یک ادمین موجود می‌تواند با درج این کوئری در پایگاه داده برای شما دسترسی ایجاد کند:
        </p>
        <pre dir="ltr" className="text-[10px] text-left bg-muted/50 rounded p-2 overflow-x-auto">
{`INSERT INTO public.user_roles (user_id, role)
VALUES ('<your-auth-uid>', 'admin');`}
        </pre>
        <button onClick={() => supabase.auth.signOut().then(() => location.reload())}
          className="text-xs text-muted-foreground hover:text-foreground">خروج</button>
      </div>
    </div>
  );
}
