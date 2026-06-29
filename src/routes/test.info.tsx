import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { TestPageShell } from "@/components/test/test-page-shell";
import { useTestStore, type UserInfo } from "@/lib/test-store";
import { fetchThemeSettings, QK } from "@/lib/cms";

export const Route = createFileRoute("/test/info")({
  loader: async ({ context: { queryClient } }) => {
    await queryClient.ensureQueryData({ queryKey: QK.theme, queryFn: fetchThemeSettings });
  },
  head: () => ({
    meta: [
      { title: "تست شخصیت کافه‌ای — کافه خانه" },
      { name: "description", content: "اطلاعات خودت رو وارد کن و تست شخصیت کافه‌ای رو شروع کن." },
    ],
  }),
  component: UserInfoPage,
});

const GENDERS = [
  { value: "male", label: "مرد" },
  { value: "female", label: "زن" },
  { value: "other", label: "ترجیح نمیدم بگم" },
];

function UserInfoPage() {
  const navigate = useNavigate();
  const { setUserInfo, startTest } = useTestStore();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [errors, setErrors] = useState<Partial<Record<keyof UserInfo | "age", string>>>({});
  const [submitting, setSubmitting] = useState(false);

  function validate() {
    const e: typeof errors = {};
    if (!fullName.trim()) e.fullName = "نام الزامی است";
    if (!phone.trim() || !/^[0-9۰-۹]{10,11}$/.test(phone.replace(/\s/g, ""))) e.phone = "شماره تماس معتبر وارد کنید";
    const ageNum = parseInt(age);
    if (!age || isNaN(ageNum) || ageNum < 10 || ageNum > 99) e.age = "سن معتبر وارد کنید";
    if (!gender) e.gender = "جنسیت را انتخاب کنید";
    return e;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    setUserInfo({ fullName: fullName.trim(), phone: phone.trim(), age: parseInt(age), gender });
    startTest();
    navigate({ to: "/test/$step", params: { step: "1" } });
  }

  return (
    <TestPageShell className="flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm flex flex-col gap-8 relative z-10">
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
          <Link to="/" className="flex items-center gap-2 text-sm transition-opacity hover:opacity-70 w-fit text-muted-foreground">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
            بازگشت
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-accent">قبل از شروع</span>
          <h1 className="text-2xl font-bold text-balance text-foreground">اطلاعات خودت رو وارد کن</h1>
          <p className="text-sm leading-relaxed text-muted-foreground">این اطلاعات فقط برای شخصی‌سازی تجربه‌ی تو استفاده میشه.</p>
        </motion.div>

        <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="flex flex-col gap-5" noValidate>
          <Field label="اسم و فامیل" error={errors.fullName}>
            <input
              type="text" value={fullName}
              onChange={(e) => { setFullName(e.target.value); setErrors((p) => ({ ...p, fullName: undefined })); }}
              placeholder="مثلاً: علی رضایی"
              className="w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all text-foreground"
              style={{ background: "rgba(255,255,255,0.05)", border: errors.fullName ? "1.5px solid rgba(239,68,68,0.6)" : "1.5px solid rgba(255,255,255,0.1)" }}
            />
          </Field>
          <Field label="شماره تماس" error={errors.phone}>
            <input
              type="tel" value={phone} dir="ltr"
              onChange={(e) => { setPhone(e.target.value); setErrors((p) => ({ ...p, phone: undefined })); }}
              placeholder="09xxxxxxxxx"
              className="w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all text-left text-foreground"
              style={{ background: "rgba(255,255,255,0.05)", border: errors.phone ? "1.5px solid rgba(239,68,68,0.6)" : "1.5px solid rgba(255,255,255,0.1)" }}
            />
          </Field>
          <Field label="سن" error={errors.age}>
            <input
              type="number" value={age} min={10} max={99} dir="ltr"
              onChange={(e) => { setAge(e.target.value); setErrors((p) => ({ ...p, age: undefined })); }}
              placeholder="مثلاً: ۲۵"
              className="w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all text-left text-foreground"
              style={{ background: "rgba(255,255,255,0.05)", border: errors.age ? "1.5px solid rgba(239,68,68,0.6)" : "1.5px solid rgba(255,255,255,0.1)" }}
            />
          </Field>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-muted-foreground">جنسیت</label>
            <div className="flex gap-2">
              {GENDERS.map((g) => (
                <motion.button
                  key={g.value} type="button"
                  onClick={() => { setGender(g.value); setErrors((p) => ({ ...p, gender: undefined })); }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex-1 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${gender === g.value ? "text-foreground" : "text-muted-foreground"}`}
                  style={gender === g.value
                    ? { background: "rgba(159,18,57,0.2)", border: "1.5px solid rgba(159,18,57,0.6)" }
                    : { background: "rgba(255,255,255,0.04)", border: "1.5px solid rgba(255,255,255,0.08)" }}
                >{g.label}</motion.button>
              ))}
            </div>
            <AnimatePresence>
              {errors.gender && <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-xs text-red-500">{errors.gender}</motion.p>}
            </AnimatePresence>
          </div>
          <motion.button
            type="submit" disabled={submitting}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            className="w-full py-4 rounded-2xl text-base font-bold mt-2 cursor-pointer disabled:opacity-60 text-foreground"
            style={{ background: "linear-gradient(135deg, #9f1239 0%, #be123c 100%)", boxShadow: "0 8px 32px rgba(159,18,57,0.4)" }}
          >{submitting ? "در حال ورود..." : "شروع تست"}</motion.button>
        </motion.form>
      </div>
    </TestPageShell>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-semibold text-muted-foreground">{label}</label>
      {children}
      <AnimatePresence>
        {error && <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-xs text-red-500">{error}</motion.p>}
      </AnimatePresence>
    </div>
  );
}
