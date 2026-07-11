import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { D as useRepositories, R as useUser, y as useIsAdmin } from "./cms-AvMbfZig.mjs";
import { f as Outlet } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as AdminShell } from "./admin-shell-CGsGoG9-.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-BkgGTmFo.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminLayout() {
	const { user, loading } = useUser();
	const { data: isAdmin, isLoading: roleLoading, isError: roleError, error: roleErr } = useIsAdmin(user?.id);
	if (loading || user && roleLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		dir: "rtl",
		className: "min-h-screen grid place-items-center text-sm text-muted-foreground",
		children: "در حال بارگذاری..."
	});
	if (roleError) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		dir: "rtl",
		className: "min-h-screen grid place-items-center px-4 text-sm text-muted-foreground",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center space-y-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-medium text-foreground",
					children: "خطا در بررسی دسترسی"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: roleErr instanceof Error ? roleErr.message : "اتصال به پایگاه داده برقرار نشد." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => location.reload(),
					className: "text-xs underline",
					children: "تلاش مجدد"
				})
			]
		})
	});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignInScreen, {});
	if (!isAdmin) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotAuthorizedScreen, { email: user.email ?? "" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) });
}
function SignInScreen() {
	const [mode, setMode] = (0, import_react.useState)("signin");
	const [email, setEmail] = (0, import_react.useState)("");
	const [pwd, setPwd] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const repos = useRepositories();
	async function submit(e) {
		e.preventDefault();
		setBusy(true);
		try {
			if (mode === "signup") {
				await repos.auth.signUp(email, pwd, `${window.location.origin}/admin`);
				toast.success("حساب ساخته شد. اکنون وارد شوید.");
				setMode("signin");
			} else {
				await repos.auth.signIn(email, pwd);
				toast.success("خوش آمدید");
			}
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "خطا");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		dir: "rtl",
		className: "min-h-screen grid place-items-center bg-muted/30 px-4 font-sans",
		style: { fontFamily: "\"Vazirmatn\", system-ui, sans-serif" },
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: submit,
			className: "w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-lg font-bold",
					children: "ورود به پنل مدیریت"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground mt-1",
					children: "برای ادامه با حساب ادمین وارد شوید."
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "text-xs text-muted-foreground",
						children: "ایمیل"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						dir: "ltr",
						type: "email",
						required: true,
						value: email,
						onChange: (e) => setEmail(e.target.value),
						className: "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground/40"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "text-xs text-muted-foreground",
						children: "رمز عبور"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						dir: "ltr",
						type: "password",
						required: true,
						minLength: 6,
						value: pwd,
						onChange: (e) => setPwd(e.target.value),
						className: "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground/40"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					disabled: busy,
					className: "w-full rounded-lg bg-foreground text-background py-2 text-sm font-medium hover:bg-foreground/90 disabled:opacity-50",
					children: busy ? "..." : mode === "signin" ? "ورود" : "ساخت حساب"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setMode((m) => m === "signin" ? "signup" : "signin"),
					className: "w-full text-xs text-muted-foreground hover:text-foreground",
					children: mode === "signin" ? "حساب ندارید؟ ثبت‌نام کنید" : "حساب دارید؟ وارد شوید"
				})
			]
		})
	});
}
function NotAuthorizedScreen({ email }) {
	const repos = useRepositories();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		dir: "rtl",
		className: "min-h-screen grid place-items-center bg-muted/30 px-4 font-sans",
		style: { fontFamily: "\"Vazirmatn\", system-ui, sans-serif" },
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-sm text-center space-y-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-lg font-bold",
					children: "دسترسی محدود"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted-foreground",
					children: [
						"حساب «",
						email,
						"» نقش ادمین ندارد. یک ادمین موجود می‌تواند با درج این کوئری در پایگاه داده برای شما دسترسی ایجاد کند:"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
					dir: "ltr",
					className: "text-[10px] text-left bg-muted/50 rounded p-2 overflow-x-auto",
					children: `INSERT INTO public.user_roles (user_id, role)
VALUES ('<your-auth-uid>', 'admin');`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => repos.auth.signOut().then(() => location.reload()),
					className: "text-xs text-muted-foreground hover:text-foreground",
					children: "خروج"
				})
			]
		})
	});
}
//#endregion
export { AdminLayout as component };
