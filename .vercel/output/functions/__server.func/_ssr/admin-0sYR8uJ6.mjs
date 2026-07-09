import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { D as useRepositories, R as useUser, y as useIsAdmin } from "./cms-DpxCyY4I.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { f as Outlet } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as AdminShell } from "./admin-shell-BJzvwuI4.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-0sYR8uJ6.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "C:/Users/Admin/Desktop/final/myproject/src/routes/admin.tsx?tsr-split=component";
function AdminLayout() {
	const { user, loading } = useUser();
	const { data: isAdmin, isLoading: roleLoading, isError: roleError, error: roleErr } = useIsAdmin(user?.id);
	if (loading || user && roleLoading) return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		dir: "rtl",
		className: "min-h-screen grid place-items-center text-sm text-muted-foreground",
		children: "در حال بارگذاری..."
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 19,
		columnNumber: 12
	}, this);
	if (roleError) return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		dir: "rtl",
		className: "min-h-screen grid place-items-center px-4 text-sm text-muted-foreground",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "max-w-md text-center space-y-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "font-medium text-foreground",
					children: "خطا در بررسی دسترسی"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 26,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { children: roleErr instanceof Error ? roleErr.message : "اتصال به پایگاه داده برقرار نشد." }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 27,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
					onClick: () => location.reload(),
					className: "text-xs underline",
					children: "تلاش مجدد"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 28,
					columnNumber: 11
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 25,
			columnNumber: 9
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 24,
		columnNumber: 12
	}, this);
	if (!user) return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SignInScreen, {}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 34,
		columnNumber: 21
	}, this);
	if (!isAdmin) return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(NotAuthorizedScreen, { email: user.email ?? "" }, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 35,
		columnNumber: 24
	}, this);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(AdminShell, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Outlet, {}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 37,
		columnNumber: 7
	}, this) }, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 36,
		columnNumber: 10
	}, this);
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
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		dir: "rtl",
		className: "min-h-screen grid place-items-center bg-muted/30 px-4 font-sans",
		style: { fontFamily: "\"Vazirmatn\", system-ui, sans-serif" },
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("form", {
			onSubmit: submit,
			className: "w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
					className: "text-lg font-bold",
					children: "ورود به پنل مدیریت"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 69,
					columnNumber: 11
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "text-xs text-muted-foreground mt-1",
					children: "برای ادامه با حساب ادمین وارد شوید."
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 70,
					columnNumber: 11
				}, this)] }, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 68,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
						className: "text-xs text-muted-foreground",
						children: "ایمیل"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 73,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
						dir: "ltr",
						type: "email",
						required: true,
						value: email,
						onChange: (e) => setEmail(e.target.value),
						className: "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground/40"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 74,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 72,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
						className: "text-xs text-muted-foreground",
						children: "رمز عبور"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 77,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
						dir: "ltr",
						type: "password",
						required: true,
						minLength: 6,
						value: pwd,
						onChange: (e) => setPwd(e.target.value),
						className: "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground/40"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 78,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 76,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
					disabled: busy,
					className: "w-full rounded-lg bg-foreground text-background py-2 text-sm font-medium hover:bg-foreground/90 disabled:opacity-50",
					children: busy ? "..." : mode === "signin" ? "ورود" : "ساخت حساب"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 80,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
					type: "button",
					onClick: () => setMode((m) => m === "signin" ? "signup" : "signin"),
					className: "w-full text-xs text-muted-foreground hover:text-foreground",
					children: mode === "signin" ? "حساب ندارید؟ ثبت‌نام کنید" : "حساب دارید؟ وارد شوید"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 83,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 67,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 64,
		columnNumber: 10
	}, this);
}
function NotAuthorizedScreen({ email }) {
	const repos = useRepositories();
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		dir: "rtl",
		className: "min-h-screen grid place-items-center bg-muted/30 px-4 font-sans",
		style: { fontFamily: "\"Vazirmatn\", system-ui, sans-serif" },
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-sm text-center space-y-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
					className: "text-lg font-bold",
					children: "دسترسی محدود"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 99,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "text-sm text-muted-foreground",
					children: [
						"حساب «",
						email,
						"» نقش ادمین ندارد. یک ادمین موجود می‌تواند با درج این کوئری در پایگاه داده برای شما دسترسی ایجاد کند:"
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 100,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("pre", {
					dir: "ltr",
					className: "text-[10px] text-left bg-muted/50 rounded p-2 overflow-x-auto",
					children: `INSERT INTO public.user_roles (user_id, role)
VALUES ('<your-auth-uid>', 'admin');`
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 104,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
					onClick: () => repos.auth.signOut().then(() => location.reload()),
					className: "text-xs text-muted-foreground hover:text-foreground",
					children: "خروج"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 108,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 98,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 95,
		columnNumber: 10
	}, this);
}
//#endregion
export { AdminLayout as component };
