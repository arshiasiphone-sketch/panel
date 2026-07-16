import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { E as useTestimonials, _ as useEvents, d as useAllMenuItems, u as useAllGalleryImages, y as usePageBlocks } from "./cms-DGKxqoRl.mjs";
import { H as CircleAlert } from "../_libs/lucide-react.mjs";
import { c as Stat, n as Card, o as PageHeader } from "./admin-shell-BNyFa0Ci.mjs";
import { o as useTestResponses } from "./test-db-Nk5FpXH4.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.analytics-nn7pyq-w.js
var import_jsx_runtime = require_jsx_runtime();
function UnavailableFeature({ title, detail }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card p-10 text-center max-w-lg mx-auto",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-10 w-10 mx-auto text-muted-foreground/50 mb-3" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-lg font-bold",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground mt-2",
				children: detail
			})
		]
	});
}
function AnalyticsPage() {
	const { data: menu = [] } = useAllMenuItems();
	const { data: blocks = [] } = usePageBlocks();
	const { data: events = [] } = useEvents();
	const { data: gallery = [] } = useAllGalleryImages();
	const { data: testimonials = [] } = useTestimonials();
	const { data: testResponses = [] } = useTestResponses();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "آمار",
			subtitle: "معیارهای محتوا و تست شخصیت"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UnavailableFeature, {
			title: "آمار ترافیک در دسترس نیست",
			detail: "ردیابی بازدیدکنندگان، کلیک‌ها و منابع ترافیک به سرویس آنالیتیکس خارجی نیاز دارد و هنوز پیکربندی نشده است."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-2 lg:grid-cols-4 gap-3 mt-4 mb-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "بلوک‌های صفحه",
					value: blocks.length
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "آیتم منو",
					value: menu.length
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "تصاویر گالری",
					value: gallery.length
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "پاسخ تست",
					value: testResponses.length
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 lg:grid-cols-2 gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-sm font-semibold mb-3",
					children: "محتوای سایت"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "space-y-2 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "بلوک‌های فعال",
							value: blocks.filter((b) => b.visible).length
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "رویدادهای فعال",
							value: events.filter((e) => e.visible).length
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "نظرات فعال",
							value: testimonials.length
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "آیتم‌های منوی فعال",
							value: menu.filter((m) => m.visible).length
						})
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-sm font-semibold mb-3",
					children: "تست شخصیت"
				}), testResponses.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-sm text-muted-foreground py-6 text-center",
					children: "هنوز پاسخی ثبت نشده."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "space-y-2 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						label: "کل پاسخ‌ها",
						value: testResponses.length
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						label: "۷ روز اخیر",
						value: testResponses.filter((r) => Date.now() - new Date(r.completedAt).getTime() < 7 * 864e5).length
					})]
				})]
			})]
		})
	] });
}
function Row({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "flex items-center justify-between py-1 border-b border-border last:border-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-semibold",
			children: value.toLocaleString("fa-IR")
		})]
	});
}
//#endregion
export { AnalyticsPage as component };
